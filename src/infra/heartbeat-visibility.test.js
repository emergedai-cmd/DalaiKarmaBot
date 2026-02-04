"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var heartbeat_visibility_js_1 = require("./heartbeat-visibility.js");
(0, vitest_1.describe)("resolveHeartbeatVisibility", function () {
    (0, vitest_1.it)("returns default values when no config is provided", function () {
        var cfg = {};
        var result = (0, heartbeat_visibility_js_1.resolveHeartbeatVisibility)({ cfg: cfg, channel: "telegram" });
        (0, vitest_1.expect)(result).toEqual({
            showOk: false,
            showAlerts: true,
            useIndicator: true,
        });
    });
    (0, vitest_1.it)("uses channel defaults when provided", function () {
        var cfg = {
            channels: {
                defaults: {
                    heartbeat: {
                        showOk: true,
                        showAlerts: false,
                        useIndicator: false,
                    },
                },
            },
        };
        var result = (0, heartbeat_visibility_js_1.resolveHeartbeatVisibility)({ cfg: cfg, channel: "telegram" });
        (0, vitest_1.expect)(result).toEqual({
            showOk: true,
            showAlerts: false,
            useIndicator: false,
        });
    });
    (0, vitest_1.it)("per-channel config overrides channel defaults", function () {
        var cfg = {
            channels: {
                defaults: {
                    heartbeat: {
                        showOk: false,
                        showAlerts: true,
                        useIndicator: true,
                    },
                },
                telegram: {
                    heartbeat: {
                        showOk: true,
                    },
                },
            },
        };
        var result = (0, heartbeat_visibility_js_1.resolveHeartbeatVisibility)({ cfg: cfg, channel: "telegram" });
        (0, vitest_1.expect)(result).toEqual({
            showOk: true,
            showAlerts: true,
            useIndicator: true,
        });
    });
    (0, vitest_1.it)("per-account config overrides per-channel config", function () {
        var cfg = {
            channels: {
                defaults: {
                    heartbeat: {
                        showOk: false,
                        showAlerts: true,
                        useIndicator: true,
                    },
                },
                telegram: {
                    heartbeat: {
                        showOk: false,
                        showAlerts: false,
                    },
                    accounts: {
                        primary: {
                            heartbeat: {
                                showOk: true,
                                showAlerts: true,
                            },
                        },
                    },
                },
            },
        };
        var result = (0, heartbeat_visibility_js_1.resolveHeartbeatVisibility)({
            cfg: cfg,
            channel: "telegram",
            accountId: "primary",
        });
        (0, vitest_1.expect)(result).toEqual({
            showOk: true,
            showAlerts: true,
            useIndicator: true,
        });
    });
    (0, vitest_1.it)("falls through to defaults when account has no heartbeat config", function () {
        var cfg = {
            channels: {
                defaults: {
                    heartbeat: {
                        showOk: false,
                    },
                },
                telegram: {
                    heartbeat: {
                        showAlerts: false,
                    },
                    accounts: {
                        primary: {},
                    },
                },
            },
        };
        var result = (0, heartbeat_visibility_js_1.resolveHeartbeatVisibility)({
            cfg: cfg,
            channel: "telegram",
            accountId: "primary",
        });
        (0, vitest_1.expect)(result).toEqual({
            showOk: false,
            showAlerts: false,
            useIndicator: true,
        });
    });
    (0, vitest_1.it)("handles missing accountId gracefully", function () {
        var cfg = {
            channels: {
                telegram: {
                    heartbeat: {
                        showOk: true,
                    },
                    accounts: {
                        primary: {
                            heartbeat: {
                                showOk: false,
                            },
                        },
                    },
                },
            },
        };
        var result = (0, heartbeat_visibility_js_1.resolveHeartbeatVisibility)({ cfg: cfg, channel: "telegram" });
        (0, vitest_1.expect)(result.showOk).toBe(true);
    });
    (0, vitest_1.it)("handles non-existent account gracefully", function () {
        var cfg = {
            channels: {
                telegram: {
                    heartbeat: {
                        showOk: true,
                    },
                    accounts: {
                        primary: {
                            heartbeat: {
                                showOk: false,
                            },
                        },
                    },
                },
            },
        };
        var result = (0, heartbeat_visibility_js_1.resolveHeartbeatVisibility)({
            cfg: cfg,
            channel: "telegram",
            accountId: "nonexistent",
        });
        (0, vitest_1.expect)(result.showOk).toBe(true);
    });
    (0, vitest_1.it)("works with whatsapp channel", function () {
        var cfg = {
            channels: {
                whatsapp: {
                    heartbeat: {
                        showOk: true,
                        showAlerts: false,
                    },
                },
            },
        };
        var result = (0, heartbeat_visibility_js_1.resolveHeartbeatVisibility)({ cfg: cfg, channel: "whatsapp" });
        (0, vitest_1.expect)(result).toEqual({
            showOk: true,
            showAlerts: false,
            useIndicator: true,
        });
    });
    (0, vitest_1.it)("works with discord channel", function () {
        var cfg = {
            channels: {
                discord: {
                    heartbeat: {
                        useIndicator: false,
                    },
                },
            },
        };
        var result = (0, heartbeat_visibility_js_1.resolveHeartbeatVisibility)({ cfg: cfg, channel: "discord" });
        (0, vitest_1.expect)(result).toEqual({
            showOk: false,
            showAlerts: true,
            useIndicator: false,
        });
    });
    (0, vitest_1.it)("works with slack channel", function () {
        var cfg = {
            channels: {
                slack: {
                    heartbeat: {
                        showOk: true,
                        showAlerts: true,
                        useIndicator: true,
                    },
                },
            },
        };
        var result = (0, heartbeat_visibility_js_1.resolveHeartbeatVisibility)({ cfg: cfg, channel: "slack" });
        (0, vitest_1.expect)(result).toEqual({
            showOk: true,
            showAlerts: true,
            useIndicator: true,
        });
    });
    (0, vitest_1.it)("webchat uses channel defaults only (no per-channel config)", function () {
        var cfg = {
            channels: {
                defaults: {
                    heartbeat: {
                        showOk: true,
                        showAlerts: false,
                        useIndicator: false,
                    },
                },
            },
        };
        var result = (0, heartbeat_visibility_js_1.resolveHeartbeatVisibility)({ cfg: cfg, channel: "webchat" });
        (0, vitest_1.expect)(result).toEqual({
            showOk: true,
            showAlerts: false,
            useIndicator: false,
        });
    });
    (0, vitest_1.it)("webchat returns defaults when no channel defaults configured", function () {
        var cfg = {};
        var result = (0, heartbeat_visibility_js_1.resolveHeartbeatVisibility)({ cfg: cfg, channel: "webchat" });
        (0, vitest_1.expect)(result).toEqual({
            showOk: false,
            showAlerts: true,
            useIndicator: true,
        });
    });
    (0, vitest_1.it)("webchat ignores accountId (only uses defaults)", function () {
        var cfg = {
            channels: {
                defaults: {
                    heartbeat: {
                        showOk: true,
                    },
                },
            },
        };
        var result = (0, heartbeat_visibility_js_1.resolveHeartbeatVisibility)({
            cfg: cfg,
            channel: "webchat",
            accountId: "some-account",
        });
        (0, vitest_1.expect)(result.showOk).toBe(true);
    });
});
