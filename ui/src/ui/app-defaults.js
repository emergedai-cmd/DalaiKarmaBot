"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CRON_FORM = exports.DEFAULT_LOG_LEVEL_FILTERS = void 0;
exports.DEFAULT_LOG_LEVEL_FILTERS = {
    trace: true,
    debug: true,
    info: true,
    warn: true,
    error: true,
    fatal: true,
};
exports.DEFAULT_CRON_FORM = {
    name: "",
    description: "",
    agentId: "",
    enabled: true,
    scheduleKind: "every",
    scheduleAt: "",
    everyAmount: "30",
    everyUnit: "minutes",
    cronExpr: "0 7 * * *",
    cronTz: "",
    sessionTarget: "main",
    wakeMode: "next-heartbeat",
    payloadKind: "systemEvent",
    payloadText: "",
    deliver: false,
    channel: "last",
    to: "",
    timeoutSeconds: "",
    postToMainPrefix: "",
};
