#!/usr/bin/env node

import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  resolveRuntimePorts,
  withRuntimePortEnv,
  spawnWithForwardedSignals,
} from "../build/runtime-env.mjs";
import { bootstrapEnv } from "../build/bootstrap-env.mjs";

const env = bootstrapEnv();
env.OMNIROUTE_WS_BRIDGE_SECRET ||= randomUUID();
process.env.OMNIROUTE_WS_BRIDGE_SECRET = env.OMNIROUTE_WS_BRIDGE_SECRET;
const runtimePorts = resolveRuntimePorts(env);
const standaloneWsEntry = fileURLToPath(new URL("./standalone-server-ws.mjs", import.meta.url));

spawnWithForwardedSignals("node", [standaloneWsEntry], {
  stdio: "inherit",
  env: withRuntimePortEnv(env, runtimePorts),
});
