import { getDbInstance } from "./core";
import { decrypt, encrypt } from "./encryption";

interface SecretRow {
  value?: string;
}

export function getPersistedSecret(key: string): string | null {
  try {
    const db = getDbInstance();
    const row = db
      .prepare("SELECT value FROM key_value WHERE namespace = 'secrets' AND key = ?")
      .get(key) as SecretRow | undefined;
    if (typeof row?.value !== "string") return null;
    const parsed = JSON.parse(row.value);
    if (typeof parsed !== "string") return null;
    const decrypted = decrypt(parsed);
    const reEncrypted = encrypt(decrypted ?? null);
    if (typeof decrypted === "string" && typeof reEncrypted === "string" && reEncrypted !== parsed) {
      db.prepare("UPDATE key_value SET value = ? WHERE namespace = 'secrets' AND key = ?").run(
        JSON.stringify(reEncrypted),
        key
      );
    }
    return typeof decrypted === "string" ? decrypted : null;
  } catch {
    return null;
  }
}

export function persistSecret(key: string, value: string): void {
  try {
    const db = getDbInstance();
    const storedValue = encrypt(value);
    db.prepare(
      "INSERT OR IGNORE INTO key_value (namespace, key, value) VALUES ('secrets', ?, ?)"
    ).run(key, JSON.stringify(storedValue));
  } catch {
    // Non-fatal: secrets still work for the current process if persistence fails.
  }
}
