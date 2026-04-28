const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);

function readBooleanEnv(name: string, defaultValue = false, env: NodeJS.ProcessEnv = process.env) {
  const raw = env[name];
  if (typeof raw !== "string") return defaultValue;
  const normalized = raw.trim().toLowerCase();
  if (normalized === "") return defaultValue;
  return TRUE_VALUES.has(normalized);
}

export function isCloudSyncFeatureEnabled(env: NodeJS.ProcessEnv = process.env) {
  return readBooleanEnv("OMNIROUTE_ENABLE_CLOUD_SYNC", false, env);
}

export function isCloudflaredFeatureEnabled(env: NodeJS.ProcessEnv = process.env) {
  return readBooleanEnv("OMNIROUTE_ENABLE_CLOUDFLARED", false, env);
}

export function isStorageEncryptionRequired(env: NodeJS.ProcessEnv = process.env) {
  return readBooleanEnv("OMNIROUTE_REQUIRE_STORAGE_ENCRYPTION", false, env);
}
