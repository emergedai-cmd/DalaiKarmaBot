"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPENROUTER_MODELS_URL = void 0;
exports.scanOpenRouterModels = scanOpenRouterModels;
var pi_ai_1 = require("@mariozechner/pi-ai");
var typebox_1 = require("@sinclair/typebox");
var OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";
exports.OPENROUTER_MODELS_URL = OPENROUTER_MODELS_URL;
var DEFAULT_TIMEOUT_MS = 12000;
var DEFAULT_CONCURRENCY = 3;
var BASE_IMAGE_PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X3mIAAAAASUVORK5CYII=";
var TOOL_PING = {
    name: "ping",
    description: "Return OK.",
    parameters: typebox_1.Type.Object({}),
};
function normalizeCreatedAtMs(value) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return null;
    }
    if (value <= 0) {
        return null;
    }
    if (value > 1e12) {
        return Math.round(value);
    }
    return Math.round(value * 1000);
}
function inferParamBFromIdOrName(text) {
    var raw = text.toLowerCase();
    var matches = raw.matchAll(/(?:^|[^a-z0-9])[a-z]?(\d+(?:\.\d+)?)b(?:[^a-z0-9]|$)/g);
    var best = null;
    for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
        var match = matches_1[_i];
        var numRaw = match[1];
        if (!numRaw) {
            continue;
        }
        var value = Number(numRaw);
        if (!Number.isFinite(value) || value <= 0) {
            continue;
        }
        if (best === null || value > best) {
            best = value;
        }
    }
    return best;
}
function parseModality(modality) {
    if (!modality) {
        return ["text"];
    }
    var normalized = modality.toLowerCase();
    var parts = normalized.split(/[^a-z]+/).filter(Boolean);
    var hasImage = parts.includes("image");
    return hasImage ? ["text", "image"] : ["text"];
}
function parseNumberString(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value !== "string") {
        return null;
    }
    var trimmed = value.trim();
    if (!trimmed) {
        return null;
    }
    var num = Number(trimmed);
    if (!Number.isFinite(num)) {
        return null;
    }
    return num;
}
function parseOpenRouterPricing(value) {
    var _a, _b, _c, _d;
    if (!value || typeof value !== "object") {
        return null;
    }
    var obj = value;
    var prompt = parseNumberString(obj.prompt);
    var completion = parseNumberString(obj.completion);
    var request = (_a = parseNumberString(obj.request)) !== null && _a !== void 0 ? _a : 0;
    var image = (_b = parseNumberString(obj.image)) !== null && _b !== void 0 ? _b : 0;
    var webSearch = (_c = parseNumberString(obj.web_search)) !== null && _c !== void 0 ? _c : 0;
    var internalReasoning = (_d = parseNumberString(obj.internal_reasoning)) !== null && _d !== void 0 ? _d : 0;
    if (prompt === null || completion === null) {
        return null;
    }
    return {
        prompt: prompt,
        completion: completion,
        request: request,
        image: image,
        webSearch: webSearch,
        internalReasoning: internalReasoning,
    };
}
function isFreeOpenRouterModel(entry) {
    if (entry.id.endsWith(":free")) {
        return true;
    }
    if (!entry.pricing) {
        return false;
    }
    return entry.pricing.prompt === 0 && entry.pricing.completion === 0;
}
function withTimeout(timeoutMs, fn) {
    return __awaiter(this, void 0, void 0, function () {
        var controller, timer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    controller = new AbortController();
                    timer = setTimeout(function () { return controller.abort(); }, timeoutMs);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, fn(controller.signal)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    clearTimeout(timer);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function fetchOpenRouterModels(fetchImpl) {
    return __awaiter(this, void 0, void 0, function () {
        var res, payload, entries;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchImpl(OPENROUTER_MODELS_URL, {
                        headers: { Accept: "application/json" },
                    })];
                case 1:
                    res = _a.sent();
                    if (!res.ok) {
                        throw new Error("OpenRouter /models failed: HTTP ".concat(res.status));
                    }
                    return [4 /*yield*/, res.json()];
                case 2:
                    payload = (_a.sent());
                    entries = Array.isArray(payload.data) ? payload.data : [];
                    return [2 /*return*/, entries
                            .map(function (entry) {
                            if (!entry || typeof entry !== "object") {
                                return null;
                            }
                            var obj = entry;
                            var id = typeof obj.id === "string" ? obj.id.trim() : "";
                            if (!id) {
                                return null;
                            }
                            var name = typeof obj.name === "string" && obj.name.trim() ? obj.name.trim() : id;
                            var contextLength = typeof obj.context_length === "number" && Number.isFinite(obj.context_length)
                                ? obj.context_length
                                : null;
                            var maxCompletionTokens = typeof obj.max_completion_tokens === "number" && Number.isFinite(obj.max_completion_tokens)
                                ? obj.max_completion_tokens
                                : typeof obj.max_output_tokens === "number" && Number.isFinite(obj.max_output_tokens)
                                    ? obj.max_output_tokens
                                    : null;
                            var supportedParameters = Array.isArray(obj.supported_parameters)
                                ? obj.supported_parameters
                                    .filter(function (value) { return typeof value === "string"; })
                                    .map(function (value) { return value.trim(); })
                                    .filter(Boolean)
                                : [];
                            var supportedParametersCount = supportedParameters.length;
                            var supportsToolsMeta = supportedParameters.includes("tools");
                            var modality = typeof obj.modality === "string" && obj.modality.trim() ? obj.modality.trim() : null;
                            var inferredParamB = inferParamBFromIdOrName("".concat(id, " ").concat(name));
                            var createdAtMs = normalizeCreatedAtMs(obj.created_at);
                            var pricing = parseOpenRouterPricing(obj.pricing);
                            return {
                                id: id,
                                name: name,
                                contextLength: contextLength,
                                maxCompletionTokens: maxCompletionTokens,
                                supportedParameters: supportedParameters,
                                supportedParametersCount: supportedParametersCount,
                                supportsToolsMeta: supportsToolsMeta,
                                modality: modality,
                                inferredParamB: inferredParamB,
                                createdAtMs: createdAtMs,
                                pricing: pricing,
                            };
                        })
                            .filter(function (entry) { return Boolean(entry); })];
            }
        });
    });
}
function probeTool(model, apiKey, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        var context, startedAt, message, hasToolCall, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    context = {
                        messages: [
                            {
                                role: "user",
                                content: "Call the ping tool with {} and nothing else.",
                                timestamp: Date.now(),
                            },
                        ],
                        tools: [TOOL_PING],
                    };
                    startedAt = Date.now();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, withTimeout(timeoutMs, function (signal) {
                            return (0, pi_ai_1.complete)(model, context, {
                                apiKey: apiKey,
                                maxTokens: 32,
                                temperature: 0,
                                toolChoice: "required",
                                signal: signal,
                            });
                        })];
                case 2:
                    message = _a.sent();
                    hasToolCall = message.content.some(function (block) { return block.type === "toolCall"; });
                    if (!hasToolCall) {
                        return [2 /*return*/, {
                                ok: false,
                                latencyMs: Date.now() - startedAt,
                                error: "No tool call returned",
                            }];
                    }
                    return [2 /*return*/, { ok: true, latencyMs: Date.now() - startedAt }];
                case 3:
                    err_1 = _a.sent();
                    return [2 /*return*/, {
                            ok: false,
                            latencyMs: Date.now() - startedAt,
                            error: err_1 instanceof Error ? err_1.message : String(err_1),
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function probeImage(model, apiKey, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        var context, startedAt, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    context = {
                        messages: [
                            {
                                role: "user",
                                content: [
                                    { type: "text", text: "Reply with OK." },
                                    { type: "image", data: BASE_IMAGE_PNG, mimeType: "image/png" },
                                ],
                                timestamp: Date.now(),
                            },
                        ],
                    };
                    startedAt = Date.now();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, withTimeout(timeoutMs, function (signal) {
                            return (0, pi_ai_1.complete)(model, context, {
                                apiKey: apiKey,
                                maxTokens: 16,
                                temperature: 0,
                                signal: signal,
                            });
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, { ok: true, latencyMs: Date.now() - startedAt }];
                case 3:
                    err_2 = _a.sent();
                    return [2 /*return*/, {
                            ok: false,
                            latencyMs: Date.now() - startedAt,
                            error: err_2 instanceof Error ? err_2.message : String(err_2),
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function ensureImageInput(model) {
    if (model.input.includes("image")) {
        return model;
    }
    return __assign(__assign({}, model), { input: Array.from(new Set(__spreadArray(__spreadArray([], model.input, true), ["image"], false))) });
}
function mapWithConcurrency(items, concurrency, fn, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var limit, results, nextIndex, completed, worker;
        var _this = this;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    limit = Math.max(1, Math.floor(concurrency));
                    results = Array.from({ length: items.length }, function () { return undefined; });
                    nextIndex = 0;
                    completed = 0;
                    worker = function () { return __awaiter(_this, void 0, void 0, function () {
                        var current, _a, _b;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    if (!true) return [3 /*break*/, 2];
                                    current = nextIndex;
                                    nextIndex += 1;
                                    if (current >= items.length) {
                                        return [2 /*return*/];
                                    }
                                    _a = results;
                                    _b = current;
                                    return [4 /*yield*/, fn(items[current], current)];
                                case 1:
                                    _a[_b] = _d.sent();
                                    completed += 1;
                                    (_c = opts === null || opts === void 0 ? void 0 : opts.onProgress) === null || _c === void 0 ? void 0 : _c.call(opts, completed, items.length);
                                    return [3 /*break*/, 0];
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); };
                    if (items.length === 0) {
                        (_a = opts === null || opts === void 0 ? void 0 : opts.onProgress) === null || _a === void 0 ? void 0 : _a.call(opts, 0, 0);
                        return [2 /*return*/, results];
                    }
                    return [4 /*yield*/, Promise.all(Array.from({ length: Math.min(limit, items.length) }, function () { return worker(); }))];
                case 1:
                    _b.sent();
                    return [2 /*return*/, results];
            }
        });
    });
}
function scanOpenRouterModels() {
    return __awaiter(this, arguments, void 0, function (options) {
        var fetchImpl, probe, apiKey, timeoutMs, concurrency, minParamB, maxAgeDays, providerFilter, catalog, now, filtered, baseModel;
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    fetchImpl = (_a = options.fetchImpl) !== null && _a !== void 0 ? _a : fetch;
                    probe = (_b = options.probe) !== null && _b !== void 0 ? _b : true;
                    apiKey = ((_c = options.apiKey) === null || _c === void 0 ? void 0 : _c.trim()) || (0, pi_ai_1.getEnvApiKey)("openrouter") || "";
                    if (probe && !apiKey) {
                        throw new Error("Missing OpenRouter API key. Set OPENROUTER_API_KEY to run models scan.");
                    }
                    timeoutMs = Math.max(1, Math.floor((_d = options.timeoutMs) !== null && _d !== void 0 ? _d : DEFAULT_TIMEOUT_MS));
                    concurrency = Math.max(1, Math.floor((_e = options.concurrency) !== null && _e !== void 0 ? _e : DEFAULT_CONCURRENCY));
                    minParamB = Math.max(0, Math.floor((_f = options.minParamB) !== null && _f !== void 0 ? _f : 0));
                    maxAgeDays = Math.max(0, Math.floor((_g = options.maxAgeDays) !== null && _g !== void 0 ? _g : 0));
                    providerFilter = (_j = (_h = options.providerFilter) === null || _h === void 0 ? void 0 : _h.trim().toLowerCase()) !== null && _j !== void 0 ? _j : "";
                    return [4 /*yield*/, fetchOpenRouterModels(fetchImpl)];
                case 1:
                    catalog = _l.sent();
                    now = Date.now();
                    filtered = catalog.filter(function (entry) {
                        var _a, _b, _c;
                        if (!isFreeOpenRouterModel(entry)) {
                            return false;
                        }
                        if (providerFilter) {
                            var prefix = (_b = (_a = entry.id.split("/")[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : "";
                            if (prefix !== providerFilter) {
                                return false;
                            }
                        }
                        if (minParamB > 0) {
                            var params = (_c = entry.inferredParamB) !== null && _c !== void 0 ? _c : 0;
                            if (params < minParamB) {
                                return false;
                            }
                        }
                        if (maxAgeDays > 0 && entry.createdAtMs) {
                            var ageMs = now - entry.createdAtMs;
                            var ageDays = ageMs / (24 * 60 * 60 * 1000);
                            if (ageDays > maxAgeDays) {
                                return false;
                            }
                        }
                        return true;
                    });
                    baseModel = (0, pi_ai_1.getModel)("openrouter", "openrouter/auto");
                    (_k = options.onProgress) === null || _k === void 0 ? void 0 : _k.call(options, {
                        phase: "probe",
                        completed: 0,
                        total: filtered.length,
                    });
                    return [2 /*return*/, mapWithConcurrency(filtered, concurrency, function (entry) { return __awaiter(_this, void 0, void 0, function () {
                            var isFree, model, toolResult, imageResult, _a;
                            var _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        isFree = isFreeOpenRouterModel(entry);
                                        if (!probe) {
                                            return [2 /*return*/, {
                                                    id: entry.id,
                                                    name: entry.name,
                                                    provider: "openrouter",
                                                    modelRef: "openrouter/".concat(entry.id),
                                                    contextLength: entry.contextLength,
                                                    maxCompletionTokens: entry.maxCompletionTokens,
                                                    supportedParametersCount: entry.supportedParametersCount,
                                                    supportsToolsMeta: entry.supportsToolsMeta,
                                                    modality: entry.modality,
                                                    inferredParamB: entry.inferredParamB,
                                                    createdAtMs: entry.createdAtMs,
                                                    pricing: entry.pricing,
                                                    isFree: isFree,
                                                    tool: { ok: false, latencyMs: null, skipped: true },
                                                    image: { ok: false, latencyMs: null, skipped: true },
                                                }];
                                        }
                                        model = __assign(__assign({}, baseModel), { id: entry.id, name: entry.name || entry.id, contextWindow: (_b = entry.contextLength) !== null && _b !== void 0 ? _b : baseModel.contextWindow, maxTokens: (_c = entry.maxCompletionTokens) !== null && _c !== void 0 ? _c : baseModel.maxTokens, input: parseModality(entry.modality), reasoning: baseModel.reasoning });
                                        return [4 /*yield*/, probeTool(model, apiKey, timeoutMs)];
                                    case 1:
                                        toolResult = _d.sent();
                                        if (!model.input.includes("image")) return [3 /*break*/, 3];
                                        return [4 /*yield*/, probeImage(ensureImageInput(model), apiKey, timeoutMs)];
                                    case 2:
                                        _a = _d.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        _a = { ok: false, latencyMs: null, skipped: true };
                                        _d.label = 4;
                                    case 4:
                                        imageResult = _a;
                                        return [2 /*return*/, {
                                                id: entry.id,
                                                name: entry.name,
                                                provider: "openrouter",
                                                modelRef: "openrouter/".concat(entry.id),
                                                contextLength: entry.contextLength,
                                                maxCompletionTokens: entry.maxCompletionTokens,
                                                supportedParametersCount: entry.supportedParametersCount,
                                                supportsToolsMeta: entry.supportsToolsMeta,
                                                modality: entry.modality,
                                                inferredParamB: entry.inferredParamB,
                                                createdAtMs: entry.createdAtMs,
                                                pricing: entry.pricing,
                                                isFree: isFree,
                                                tool: toolResult,
                                                image: imageResult,
                                            }];
                                }
                            });
                        }); }, {
                            onProgress: function (completed, total) {
                                var _a;
                                return (_a = options.onProgress) === null || _a === void 0 ? void 0 : _a.call(options, {
                                    phase: "probe",
                                    completed: completed,
                                    total: total,
                                });
                            },
                        })];
            }
        });
    });
}
