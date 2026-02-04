"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var network_config_js_1 = require("./network-config.js");
(0, vitest_1.describe)("resolveTelegramAutoSelectFamilyDecision", function () {
    (0, vitest_1.it)("prefers env enable over env disable", function () {
        var decision = (0, network_config_js_1.resolveTelegramAutoSelectFamilyDecision)({
            env: {
                OPENCLAW_TELEGRAM_ENABLE_AUTO_SELECT_FAMILY: "1",
                OPENCLAW_TELEGRAM_DISABLE_AUTO_SELECT_FAMILY: "1",
            },
            nodeMajor: 22,
        });
        (0, vitest_1.expect)(decision).toEqual({
            value: true,
            source: "env:OPENCLAW_TELEGRAM_ENABLE_AUTO_SELECT_FAMILY",
        });
    });
    (0, vitest_1.it)("uses env disable when set", function () {
        var decision = (0, network_config_js_1.resolveTelegramAutoSelectFamilyDecision)({
            env: { OPENCLAW_TELEGRAM_DISABLE_AUTO_SELECT_FAMILY: "1" },
            nodeMajor: 22,
        });
        (0, vitest_1.expect)(decision).toEqual({
            value: false,
            source: "env:OPENCLAW_TELEGRAM_DISABLE_AUTO_SELECT_FAMILY",
        });
    });
    (0, vitest_1.it)("uses config override when provided", function () {
        var decision = (0, network_config_js_1.resolveTelegramAutoSelectFamilyDecision)({
            network: { autoSelectFamily: true },
            nodeMajor: 22,
        });
        (0, vitest_1.expect)(decision).toEqual({ value: true, source: "config" });
    });
    (0, vitest_1.it)("defaults to disable on Node 22", function () {
        var decision = (0, network_config_js_1.resolveTelegramAutoSelectFamilyDecision)({ nodeMajor: 22 });
        (0, vitest_1.expect)(decision).toEqual({ value: false, source: "default-node22" });
    });
    (0, vitest_1.it)("returns null when no decision applies", function () {
        var decision = (0, network_config_js_1.resolveTelegramAutoSelectFamilyDecision)({ nodeMajor: 20 });
        (0, vitest_1.expect)(decision).toEqual({ value: null });
    });
});
