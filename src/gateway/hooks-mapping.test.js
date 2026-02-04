"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var hooks_mapping_js_1 = require("./hooks-mapping.js");
var baseUrl = new URL("http://127.0.0.1:18789/hooks/gmail");
(0, vitest_1.describe)("hooks mapping", function () {
    (0, vitest_1.it)("resolves gmail preset", function () {
        var _a;
        var mappings = (0, hooks_mapping_js_1.resolveHookMappings)({ presets: ["gmail"] });
        (0, vitest_1.expect)(mappings.length).toBeGreaterThan(0);
        (0, vitest_1.expect)((_a = mappings[0]) === null || _a === void 0 ? void 0 : _a.matchPath).toBe("gmail");
    });
    (0, vitest_1.it)("renders template from payload", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mappings, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mappings = (0, hooks_mapping_js_1.resolveHookMappings)({
                        mappings: [
                            {
                                id: "demo",
                                match: { path: "gmail" },
                                action: "agent",
                                messageTemplate: "Subject: {{messages[0].subject}}",
                            },
                        ],
                    });
                    return [4 /*yield*/, (0, hooks_mapping_js_1.applyHookMappings)(mappings, {
                            payload: { messages: [{ subject: "Hello" }] },
                            headers: {},
                            url: baseUrl,
                            path: "gmail",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.ok).toBe(true);
                    if (result === null || result === void 0 ? void 0 : result.ok) {
                        (0, vitest_1.expect)(result.action.kind).toBe("agent");
                        (0, vitest_1.expect)(result.action.message).toBe("Subject: Hello");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes model override from mapping", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mappings, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mappings = (0, hooks_mapping_js_1.resolveHookMappings)({
                        mappings: [
                            {
                                id: "demo",
                                match: { path: "gmail" },
                                action: "agent",
                                messageTemplate: "Subject: {{messages[0].subject}}",
                                model: "openai/gpt-4.1-mini",
                            },
                        ],
                    });
                    return [4 /*yield*/, (0, hooks_mapping_js_1.applyHookMappings)(mappings, {
                            payload: { messages: [{ subject: "Hello" }] },
                            headers: {},
                            url: baseUrl,
                            path: "gmail",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.ok).toBe(true);
                    if ((result === null || result === void 0 ? void 0 : result.ok) && result.action.kind === "agent") {
                        (0, vitest_1.expect)(result.action.model).toBe("openai/gpt-4.1-mini");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs transform module", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, modPath, placeholder, mappings, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hooks-"));
                    modPath = node_path_1.default.join(dir, "transform.mjs");
                    placeholder = "${payload.name}";
                    node_fs_1.default.writeFileSync(modPath, "export default ({ payload }) => ({ kind: \"wake\", text: `Ping ".concat(placeholder, "` });"));
                    mappings = (0, hooks_mapping_js_1.resolveHookMappings)({
                        transformsDir: dir,
                        mappings: [
                            {
                                match: { path: "custom" },
                                action: "agent",
                                transform: { module: "transform.mjs" },
                            },
                        ],
                    });
                    return [4 /*yield*/, (0, hooks_mapping_js_1.applyHookMappings)(mappings, {
                            payload: { name: "Ada" },
                            headers: {},
                            url: new URL("http://127.0.0.1:18789/hooks/custom"),
                            path: "custom",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.ok).toBe(true);
                    if (result === null || result === void 0 ? void 0 : result.ok) {
                        (0, vitest_1.expect)(result.action.kind).toBe("wake");
                        if (result.action.kind === "wake") {
                            (0, vitest_1.expect)(result.action.text).toBe("Ping Ada");
                        }
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats null transform as a handled skip", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, modPath, mappings, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hooks-skip-"));
                    modPath = node_path_1.default.join(dir, "transform.mjs");
                    node_fs_1.default.writeFileSync(modPath, "export default () => null;");
                    mappings = (0, hooks_mapping_js_1.resolveHookMappings)({
                        transformsDir: dir,
                        mappings: [
                            {
                                match: { path: "skip" },
                                action: "agent",
                                transform: { module: "transform.mjs" },
                            },
                        ],
                    });
                    return [4 /*yield*/, (0, hooks_mapping_js_1.applyHookMappings)(mappings, {
                            payload: {},
                            headers: {},
                            url: new URL("http://127.0.0.1:18789/hooks/skip"),
                            path: "skip",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.ok).toBe(true);
                    if (result === null || result === void 0 ? void 0 : result.ok) {
                        (0, vitest_1.expect)(result.action).toBeNull();
                        (0, vitest_1.expect)("skipped" in result).toBe(true);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefers explicit mappings over presets", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mappings, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mappings = (0, hooks_mapping_js_1.resolveHookMappings)({
                        presets: ["gmail"],
                        mappings: [
                            {
                                id: "override",
                                match: { path: "gmail" },
                                action: "agent",
                                messageTemplate: "Override subject: {{messages[0].subject}}",
                            },
                        ],
                    });
                    return [4 /*yield*/, (0, hooks_mapping_js_1.applyHookMappings)(mappings, {
                            payload: { messages: [{ subject: "Hello" }] },
                            headers: {},
                            url: baseUrl,
                            path: "gmail",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.ok).toBe(true);
                    if (result === null || result === void 0 ? void 0 : result.ok) {
                        (0, vitest_1.expect)(result.action.kind).toBe("agent");
                        (0, vitest_1.expect)(result.action.message).toBe("Override subject: Hello");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects missing message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mappings, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mappings = (0, hooks_mapping_js_1.resolveHookMappings)({
                        mappings: [{ match: { path: "noop" }, action: "agent" }],
                    });
                    return [4 /*yield*/, (0, hooks_mapping_js_1.applyHookMappings)(mappings, {
                            payload: {},
                            headers: {},
                            url: new URL("http://127.0.0.1:18789/hooks/noop"),
                            path: "noop",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.ok).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
