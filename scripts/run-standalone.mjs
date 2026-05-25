#!/usr/bin/env node

import {
  resolveRuntimePorts,
  withRuntimePortEnv,
  spawnWithForwardedSignals,
} from "./runtime-env.mjs";
import { randomUUID } from "node:crypto";
import { bootstrapEnv } from "./bootstrap-env.mjs";

const env = bootstrapEnv();
env.OMNIROUTE_WS_BRIDGE_SECRET ||= randomUUID();
process.env.OMNIROUTE_WS_BRIDGE_SECRET = env.OMNIROUTE_WS_BRIDGE_SECRET;
const runtimePorts = resolveRuntimePorts(env);

spawnWithForwardedSignals("node", ["standalone-server-ws.mjs"], {
  stdio: "inherit",
  env: withRuntimePortEnv(env, runtimePorts),
});
