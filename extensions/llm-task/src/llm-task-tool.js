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
exports.createLlmTaskTool = createLlmTaskTool;
var typebox_1 = require("@sinclair/typebox");
var ajv_1 = require("ajv");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
function loadRunEmbeddedPiAgent() {
    return __awaiter(this, void 0, void 0, function () {
        var mod_1, _a, mod;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../../../src/agents/pi-embedded-runner.js"); })];
                case 1:
                    mod_1 = _b.sent();
                    // oxlint-disable-next-line typescript/no-explicit-any
                    if (typeof mod_1.runEmbeddedPiAgent === "function") {
                        // oxlint-disable-next-line typescript/no-explicit-any
                        return [2 /*return*/, mod_1.runEmbeddedPiAgent];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 3: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../../agents/pi-embedded-runner.js"); })];
                case 4:
                    mod = _b.sent();
                    if (typeof mod.runEmbeddedPiAgent !== "function") {
                        throw new Error("Internal error: runEmbeddedPiAgent not available");
                    }
                    return [2 /*return*/, mod.runEmbeddedPiAgent];
            }
        });
    });
}
function stripCodeFences(s) {
    var _a;
    var trimmed = s.trim();
    var m = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    if (m) {
        return ((_a = m[1]) !== null && _a !== void 0 ? _a : "").trim();
    }
    return trimmed;
}
function collectText(payloads) {
    var texts = (payloads !== null && payloads !== void 0 ? payloads : [])
        .filter(function (p) { return !p.isError && typeof p.text === "string"; })
        .map(function (p) { var _a; return (_a = p.text) !== null && _a !== void 0 ? _a : ""; });
    return texts.join("\n").trim();
}
function toModelKey(provider, model) {
    var p = provider === null || provider === void 0 ? void 0 : provider.trim();
    var m = model === null || model === void 0 ? void 0 : model.trim();
    if (!p || !m) {
        return undefined;
    }
    return "".concat(p, "/").concat(m);
}
function createLlmTaskTool(api) {
    return {
        name: "llm-task",
        description: "Run a generic JSON-only LLM task and return schema-validated JSON. Designed for orchestration from Lobster workflows via openclaw.invoke.",
        parameters: typebox_1.Type.Object({
            prompt: typebox_1.Type.String({ description: "Task instruction for the LLM." }),
            input: typebox_1.Type.Optional(typebox_1.Type.Unknown({ description: "Optional input payload for the task." })),
            schema: typebox_1.Type.Optional(typebox_1.Type.Unknown({ description: "Optional JSON Schema to validate the returned JSON." })),
            provider: typebox_1.Type.Optional(typebox_1.Type.String({ description: "Provider override (e.g. openai-codex, anthropic)." })),
            model: typebox_1.Type.Optional(typebox_1.Type.String({ description: "Model id override." })),
            authProfileId: typebox_1.Type.Optional(typebox_1.Type.String({ description: "Auth profile override." })),
            temperature: typebox_1.Type.Optional(typebox_1.Type.Number({ description: "Best-effort temperature override." })),
            maxTokens: typebox_1.Type.Optional(typebox_1.Type.Number({ description: "Best-effort maxTokens override." })),
            timeoutMs: typebox_1.Type.Optional(typebox_1.Type.Number({ description: "Timeout for the LLM run." })),
        }),
        execute: function (_id, params) {
            return __awaiter(this, void 0, void 0, function () {
                var prompt, pluginCfg, primary, primaryProvider, primaryModel, provider, model, authProfileId, modelKey, allowed, timeoutMs, streamParams, input, inputJson, system, fullPrompt, tmpDir, sessionId, sessionFile, runEmbeddedPiAgent, result, text, raw, parsed, schema, ajv, validate, ok, msg, _a;
                var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                return __generator(this, function (_o) {
                    switch (_o.label) {
                        case 0:
                            prompt = typeof params.prompt === "string" ? params.prompt : "";
                            if (!prompt.trim()) {
                                throw new Error("prompt required");
                            }
                            pluginCfg = ((_b = api.pluginConfig) !== null && _b !== void 0 ? _b : {});
                            primary = (_f = (_e = (_d = (_c = api.config) === null || _c === void 0 ? void 0 : _c.agents) === null || _d === void 0 ? void 0 : _d.defaults) === null || _e === void 0 ? void 0 : _e.model) === null || _f === void 0 ? void 0 : _f.primary;
                            primaryProvider = typeof primary === "string" ? primary.split("/")[0] : undefined;
                            primaryModel = typeof primary === "string" ? primary.split("/").slice(1).join("/") : undefined;
                            provider = (typeof params.provider === "string" && params.provider.trim()) ||
                                (typeof pluginCfg.defaultProvider === "string" && pluginCfg.defaultProvider.trim()) ||
                                primaryProvider ||
                                undefined;
                            model = (typeof params.model === "string" && params.model.trim()) ||
                                (typeof pluginCfg.defaultModel === "string" && pluginCfg.defaultModel.trim()) ||
                                primaryModel ||
                                undefined;
                            authProfileId = 
                            // oxlint-disable-next-line typescript/no-explicit-any
                            (typeof params.authProfileId === "string" &&
                                // oxlint-disable-next-line typescript/no-explicit-any
                                params.authProfileId.trim()) ||
                                (typeof pluginCfg.defaultAuthProfileId === "string" &&
                                    pluginCfg.defaultAuthProfileId.trim()) ||
                                undefined;
                            modelKey = toModelKey(provider, model);
                            if (!provider || !model || !modelKey) {
                                throw new Error("provider/model could not be resolved (provider=".concat(String(provider !== null && provider !== void 0 ? provider : ""), ", model=").concat(String(model !== null && model !== void 0 ? model : ""), ")"));
                            }
                            allowed = Array.isArray(pluginCfg.allowedModels) ? pluginCfg.allowedModels : undefined;
                            if (allowed && allowed.length > 0 && !allowed.includes(modelKey)) {
                                throw new Error("Model not allowed by llm-task plugin config: ".concat(modelKey, ". Allowed models: ").concat(allowed.join(", ")));
                            }
                            timeoutMs = (typeof params.timeoutMs === "number" && params.timeoutMs > 0
                                ? params.timeoutMs
                                : undefined) ||
                                (typeof pluginCfg.timeoutMs === "number" && pluginCfg.timeoutMs > 0
                                    ? pluginCfg.timeoutMs
                                    : undefined) ||
                                30000;
                            streamParams = {
                                temperature: typeof params.temperature === "number" ? params.temperature : undefined,
                                maxTokens: typeof params.maxTokens === "number"
                                    ? params.maxTokens
                                    : typeof pluginCfg.maxTokens === "number"
                                        ? pluginCfg.maxTokens
                                        : undefined,
                            };
                            input = params.input;
                            try {
                                inputJson = JSON.stringify(input !== null && input !== void 0 ? input : null, null, 2);
                            }
                            catch (_p) {
                                throw new Error("input must be JSON-serializable");
                            }
                            system = [
                                "You are a JSON-only function.",
                                "Return ONLY a valid JSON value.",
                                "Do not wrap in markdown fences.",
                                "Do not include commentary.",
                                "Do not call tools.",
                            ].join(" ");
                            fullPrompt = "".concat(system, "\n\nTASK:\n").concat(prompt, "\n\nINPUT_JSON:\n").concat(inputJson, "\n");
                            tmpDir = null;
                            _o.label = 1;
                        case 1:
                            _o.trys.push([1, , 5, 10]);
                            return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-llm-task-"))];
                        case 2:
                            tmpDir = _o.sent();
                            sessionId = "llm-task-".concat(Date.now());
                            sessionFile = node_path_1.default.join(tmpDir, "session.json");
                            return [4 /*yield*/, loadRunEmbeddedPiAgent()];
                        case 3:
                            runEmbeddedPiAgent = _o.sent();
                            return [4 /*yield*/, runEmbeddedPiAgent({
                                    sessionId: sessionId,
                                    sessionFile: sessionFile,
                                    workspaceDir: (_k = (_j = (_h = (_g = api.config) === null || _g === void 0 ? void 0 : _g.agents) === null || _h === void 0 ? void 0 : _h.defaults) === null || _j === void 0 ? void 0 : _j.workspace) !== null && _k !== void 0 ? _k : process.cwd(),
                                    config: api.config,
                                    prompt: fullPrompt,
                                    timeoutMs: timeoutMs,
                                    runId: "llm-task-".concat(Date.now()),
                                    provider: provider,
                                    model: model,
                                    authProfileId: authProfileId,
                                    authProfileIdSource: authProfileId ? "user" : "auto",
                                    streamParams: streamParams,
                                    disableTools: true,
                                })];
                        case 4:
                            result = _o.sent();
                            text = collectText(result.payloads);
                            if (!text) {
                                throw new Error("LLM returned empty output");
                            }
                            raw = stripCodeFences(text);
                            parsed = void 0;
                            try {
                                parsed = JSON.parse(raw);
                            }
                            catch (_q) {
                                throw new Error("LLM returned invalid JSON");
                            }
                            schema = params.schema;
                            if (schema && typeof schema === "object" && !Array.isArray(schema)) {
                                ajv = new ajv_1.default({ allErrors: true, strict: false });
                                validate = ajv.compile(schema);
                                ok = validate(parsed);
                                if (!ok) {
                                    msg = (_m = (_l = validate.errors) === null || _l === void 0 ? void 0 : _l.map(function (e) { return "".concat(e.instancePath || "<root>", " ").concat(e.message || "invalid"); }).join("; ")) !== null && _m !== void 0 ? _m : "invalid";
                                    throw new Error("LLM JSON did not match schema: ".concat(msg));
                                }
                            }
                            return [2 /*return*/, {
                                    content: [{ type: "text", text: JSON.stringify(parsed, null, 2) }],
                                    details: { json: parsed, provider: provider, model: model },
                                }];
                        case 5:
                            if (!tmpDir) return [3 /*break*/, 9];
                            _o.label = 6;
                        case 6:
                            _o.trys.push([6, 8, , 9]);
                            return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                        case 7:
                            _o.sent();
                            return [3 /*break*/, 9];
                        case 8:
                            _a = _o.sent();
                            return [3 /*break*/, 9];
                        case 9: return [7 /*endfinally*/];
                        case 10: return [2 /*return*/];
                    }
                });
            });
        },
    };
}
