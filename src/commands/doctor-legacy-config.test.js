"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var doctor_legacy_config_js_1 = require("./doctor-legacy-config.js");
(0, vitest_1.describe)("normalizeLegacyConfigValues", function () {
    var previousOauthDir;
    var tempOauthDir;
    var writeCreds = function (dir) {
        node_fs_1.default.mkdirSync(dir, { recursive: true });
        node_fs_1.default.writeFileSync(node_path_1.default.join(dir, "creds.json"), JSON.stringify({ me: {} }));
    };
    (0, vitest_1.beforeEach)(function () {
        previousOauthDir = process.env.OPENCLAW_OAUTH_DIR;
        tempOauthDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-oauth-"));
        process.env.OPENCLAW_OAUTH_DIR = tempOauthDir;
    });
    (0, vitest_1.afterEach)(function () {
        if (previousOauthDir === undefined) {
            delete process.env.OPENCLAW_OAUTH_DIR;
        }
        else {
            process.env.OPENCLAW_OAUTH_DIR = previousOauthDir;
        }
        if (tempOauthDir) {
            node_fs_1.default.rmSync(tempOauthDir, { recursive: true, force: true });
            tempOauthDir = undefined;
        }
    });
    (0, vitest_1.it)("does not add whatsapp config when missing and no auth exists", function () {
        var _a;
        var res = (0, doctor_legacy_config_js_1.normalizeLegacyConfigValues)({
            messages: { ackReaction: "👀" },
        });
        (0, vitest_1.expect)((_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.whatsapp).toBeUndefined();
        (0, vitest_1.expect)(res.changes).toEqual([]);
    });
    (0, vitest_1.it)("copies legacy ack reaction when whatsapp config exists", function () {
        var _a, _b;
        var res = (0, doctor_legacy_config_js_1.normalizeLegacyConfigValues)({
            messages: { ackReaction: "👀", ackReactionScope: "group-mentions" },
            channels: { whatsapp: {} },
        });
        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.whatsapp) === null || _b === void 0 ? void 0 : _b.ackReaction).toEqual({
            emoji: "👀",
            direct: false,
            group: "mentions",
        });
        (0, vitest_1.expect)(res.changes).toEqual([
            "Copied messages.ackReaction → channels.whatsapp.ackReaction (scope: group-mentions).",
        ]);
    });
    (0, vitest_1.it)("does not add whatsapp config when only auth exists (issue #900)", function () {
        var _a;
        var credsDir = node_path_1.default.join(tempOauthDir !== null && tempOauthDir !== void 0 ? tempOauthDir : "", "whatsapp", "default");
        writeCreds(credsDir);
        var res = (0, doctor_legacy_config_js_1.normalizeLegacyConfigValues)({
            messages: { ackReaction: "👀", ackReactionScope: "group-mentions" },
        });
        (0, vitest_1.expect)((_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.whatsapp).toBeUndefined();
        (0, vitest_1.expect)(res.changes).toEqual([]);
    });
    (0, vitest_1.it)("does not add whatsapp config when only legacy auth exists (issue #900)", function () {
        var _a;
        var credsPath = node_path_1.default.join(tempOauthDir !== null && tempOauthDir !== void 0 ? tempOauthDir : "", "creds.json");
        node_fs_1.default.writeFileSync(credsPath, JSON.stringify({ me: {} }));
        var res = (0, doctor_legacy_config_js_1.normalizeLegacyConfigValues)({
            messages: { ackReaction: "👀", ackReactionScope: "group-mentions" },
        });
        (0, vitest_1.expect)((_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.whatsapp).toBeUndefined();
        (0, vitest_1.expect)(res.changes).toEqual([]);
    });
    (0, vitest_1.it)("does not add whatsapp config when only non-default auth exists (issue #900)", function () {
        var _a;
        var credsDir = node_path_1.default.join(tempOauthDir !== null && tempOauthDir !== void 0 ? tempOauthDir : "", "whatsapp", "work");
        writeCreds(credsDir);
        var res = (0, doctor_legacy_config_js_1.normalizeLegacyConfigValues)({
            messages: { ackReaction: "👀", ackReactionScope: "group-mentions" },
        });
        (0, vitest_1.expect)((_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.whatsapp).toBeUndefined();
        (0, vitest_1.expect)(res.changes).toEqual([]);
    });
    (0, vitest_1.it)("copies legacy ack reaction when authDir override exists", function () {
        var _a, _b;
        var customDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-wa-auth-"));
        try {
            writeCreds(customDir);
            var res = (0, doctor_legacy_config_js_1.normalizeLegacyConfigValues)({
                messages: { ackReaction: "👀", ackReactionScope: "group-mentions" },
                channels: { whatsapp: { accounts: { work: { authDir: customDir } } } },
            });
            (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.whatsapp) === null || _b === void 0 ? void 0 : _b.ackReaction).toEqual({
                emoji: "👀",
                direct: false,
                group: "mentions",
            });
        }
        finally {
            node_fs_1.default.rmSync(customDir, { recursive: true, force: true });
        }
    });
});
