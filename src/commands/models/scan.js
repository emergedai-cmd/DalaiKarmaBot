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
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelsScanCommand = modelsScanCommand;
var prompts_1 = require("@clack/prompts");
var model_auth_js_1 = require("../../agents/model-auth.js");
var model_scan_js_1 = require("../../agents/model-scan.js");
var progress_js_1 = require("../../cli/progress.js");
var config_js_1 = require("../../config/config.js");
var logging_js_1 = require("../../config/logging.js");
var prompt_style_js_1 = require("../../terminal/prompt-style.js");
var shared_js_1 = require("./shared.js");
var MODEL_PAD = 42;
var CTX_PAD = 8;
var multiselect = function (params) {
    return (0, prompts_1.multiselect)(__assign(__assign({}, params), { message: (0, prompt_style_js_1.stylePromptMessage)(params.message), options: params.options.map(function (opt) {
            return opt.hint === undefined ? opt : __assign(__assign({}, opt), { hint: (0, prompt_style_js_1.stylePromptHint)(opt.hint) });
        }) }));
};
var pad = function (value, size) { return value.padEnd(size); };
var truncate = function (value, max) {
    if (value.length <= max) {
        return value;
    }
    if (max <= 3) {
        return value.slice(0, max);
    }
    return "".concat(value.slice(0, max - 3), "...");
};
function sortScanResults(results) {
    return results.slice().toSorted(function (a, b) {
        var _a, _b, _c, _d, _e, _f;
        var aImage = a.image.ok ? 1 : 0;
        var bImage = b.image.ok ? 1 : 0;
        if (aImage !== bImage) {
            return bImage - aImage;
        }
        var aToolLatency = (_a = a.tool.latencyMs) !== null && _a !== void 0 ? _a : Number.POSITIVE_INFINITY;
        var bToolLatency = (_b = b.tool.latencyMs) !== null && _b !== void 0 ? _b : Number.POSITIVE_INFINITY;
        if (aToolLatency !== bToolLatency) {
            return aToolLatency - bToolLatency;
        }
        var aCtx = (_c = a.contextLength) !== null && _c !== void 0 ? _c : 0;
        var bCtx = (_d = b.contextLength) !== null && _d !== void 0 ? _d : 0;
        if (aCtx !== bCtx) {
            return bCtx - aCtx;
        }
        var aParams = (_e = a.inferredParamB) !== null && _e !== void 0 ? _e : 0;
        var bParams = (_f = b.inferredParamB) !== null && _f !== void 0 ? _f : 0;
        if (aParams !== bParams) {
            return bParams - aParams;
        }
        return a.modelRef.localeCompare(b.modelRef);
    });
}
function sortImageResults(results) {
    return results.slice().toSorted(function (a, b) {
        var _a, _b, _c, _d, _e, _f;
        var aLatency = (_a = a.image.latencyMs) !== null && _a !== void 0 ? _a : Number.POSITIVE_INFINITY;
        var bLatency = (_b = b.image.latencyMs) !== null && _b !== void 0 ? _b : Number.POSITIVE_INFINITY;
        if (aLatency !== bLatency) {
            return aLatency - bLatency;
        }
        var aCtx = (_c = a.contextLength) !== null && _c !== void 0 ? _c : 0;
        var bCtx = (_d = b.contextLength) !== null && _d !== void 0 ? _d : 0;
        if (aCtx !== bCtx) {
            return bCtx - aCtx;
        }
        var aParams = (_e = a.inferredParamB) !== null && _e !== void 0 ? _e : 0;
        var bParams = (_f = b.inferredParamB) !== null && _f !== void 0 ? _f : 0;
        if (aParams !== bParams) {
            return bParams - aParams;
        }
        return a.modelRef.localeCompare(b.modelRef);
    });
}
function buildScanHint(result) {
    var toolLabel = result.tool.ok ? "tool ".concat((0, shared_js_1.formatMs)(result.tool.latencyMs)) : "tool fail";
    var imageLabel = result.image.skipped
        ? "img skip"
        : result.image.ok
            ? "img ".concat((0, shared_js_1.formatMs)(result.image.latencyMs))
            : "img fail";
    var ctxLabel = result.contextLength ? "ctx ".concat((0, shared_js_1.formatTokenK)(result.contextLength)) : "ctx ?";
    var paramLabel = result.inferredParamB ? "".concat(result.inferredParamB, "b") : null;
    return [toolLabel, imageLabel, ctxLabel, paramLabel].filter(Boolean).join(" | ");
}
function printScanSummary(results, runtime) {
    var toolOk = results.filter(function (r) { return r.tool.ok; });
    var imageOk = results.filter(function (r) { return r.image.ok; });
    var toolImageOk = results.filter(function (r) { return r.tool.ok && r.image.ok; });
    var imageOnly = imageOk.filter(function (r) { return !r.tool.ok; });
    runtime.log("Scan results: tested ".concat(results.length, ", tool ok ").concat(toolOk.length, ", image ok ").concat(imageOk.length, ", tool+image ok ").concat(toolImageOk.length, ", image only ").concat(imageOnly.length));
}
function printScanTable(results, runtime) {
    var header = [
        pad("Model", MODEL_PAD),
        pad("Tool", 10),
        pad("Image", 10),
        pad("Ctx", CTX_PAD),
        pad("Params", 8),
        "Notes",
    ].join(" ");
    runtime.log(header);
    for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
        var entry = results_1[_i];
        var modelLabel = pad(truncate(entry.modelRef, MODEL_PAD), MODEL_PAD);
        var toolLabel = pad(entry.tool.ok ? (0, shared_js_1.formatMs)(entry.tool.latencyMs) : "fail", 10);
        var imageLabel = pad(entry.image.ok ? (0, shared_js_1.formatMs)(entry.image.latencyMs) : entry.image.skipped ? "skip" : "fail", 10);
        var ctxLabel = pad((0, shared_js_1.formatTokenK)(entry.contextLength), CTX_PAD);
        var paramsLabel = pad(entry.inferredParamB ? "".concat(entry.inferredParamB, "b") : "-", 8);
        var notes = entry.modality ? "modality:".concat(entry.modality) : "";
        runtime.log([modelLabel, toolLabel, imageLabel, ctxLabel, paramsLabel, notes].join(" "));
    }
}
function modelsScanCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var minParams, maxAgeDays, maxCandidates, timeout, concurrency, cfg, probe, storedKey, resolved, _a, results, toolOk, sorted, toolSorted, imageOk, imageSorted, imagePreferred, preselectPool, preselected, imagePreselected, noInput, canPrompt, selected, selectedImages, selection, imageSelection, _updated;
        var _this = this;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    minParams = opts.minParams ? Number(opts.minParams) : undefined;
                    if (minParams !== undefined && (!Number.isFinite(minParams) || minParams < 0)) {
                        throw new Error("--min-params must be >= 0");
                    }
                    maxAgeDays = opts.maxAgeDays ? Number(opts.maxAgeDays) : undefined;
                    if (maxAgeDays !== undefined && (!Number.isFinite(maxAgeDays) || maxAgeDays < 0)) {
                        throw new Error("--max-age-days must be >= 0");
                    }
                    maxCandidates = opts.maxCandidates ? Number(opts.maxCandidates) : 6;
                    if (!Number.isFinite(maxCandidates) || maxCandidates <= 0) {
                        throw new Error("--max-candidates must be > 0");
                    }
                    timeout = opts.timeout ? Number(opts.timeout) : undefined;
                    if (timeout !== undefined && (!Number.isFinite(timeout) || timeout <= 0)) {
                        throw new Error("--timeout must be > 0");
                    }
                    concurrency = opts.concurrency ? Number(opts.concurrency) : undefined;
                    if (concurrency !== undefined && (!Number.isFinite(concurrency) || concurrency <= 0)) {
                        throw new Error("--concurrency must be > 0");
                    }
                    cfg = (0, config_js_1.loadConfig)();
                    probe = (_b = opts.probe) !== null && _b !== void 0 ? _b : true;
                    if (!probe) return [3 /*break*/, 4];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, model_auth_js_1.resolveApiKeyForProvider)({
                            provider: "openrouter",
                            cfg: cfg,
                        })];
                case 2:
                    resolved = _e.sent();
                    storedKey = resolved.apiKey;
                    return [3 /*break*/, 4];
                case 3:
                    _a = _e.sent();
                    storedKey = undefined;
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, (0, progress_js_1.withProgressTotals)({
                        label: "Scanning OpenRouter models...",
                        indeterminate: false,
                        enabled: opts.json !== true,
                    }, function (update) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, model_scan_js_1.scanOpenRouterModels)({
                                        apiKey: storedKey !== null && storedKey !== void 0 ? storedKey : undefined,
                                        minParamB: minParams,
                                        maxAgeDays: maxAgeDays,
                                        providerFilter: opts.provider,
                                        timeoutMs: timeout,
                                        concurrency: concurrency,
                                        probe: probe,
                                        onProgress: function (_a) {
                                            var phase = _a.phase, completed = _a.completed, total = _a.total;
                                            if (phase !== "probe") {
                                                return;
                                            }
                                            var labelBase = probe ? "Probing models" : "Scanning models";
                                            update({
                                                completed: completed,
                                                total: total,
                                                label: "".concat(labelBase, " (").concat(completed, "/").concat(total, ")"),
                                            });
                                        },
                                    })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })];
                case 5:
                    results = _e.sent();
                    if (!probe) {
                        if (!opts.json) {
                            runtime.log("Found ".concat(results.length, " OpenRouter free models (metadata only; pass --probe to test tools/images)."));
                            printScanTable(sortScanResults(results), runtime);
                        }
                        else {
                            runtime.log(JSON.stringify(results, null, 2));
                        }
                        return [2 /*return*/];
                    }
                    toolOk = results.filter(function (entry) { return entry.tool.ok; });
                    if (toolOk.length === 0) {
                        throw new Error("No tool-capable OpenRouter free models found.");
                    }
                    sorted = sortScanResults(results);
                    toolSorted = sortScanResults(toolOk);
                    imageOk = results.filter(function (entry) { return entry.image.ok; });
                    imageSorted = sortImageResults(imageOk);
                    imagePreferred = toolSorted.filter(function (entry) { return entry.image.ok; });
                    preselectPool = imagePreferred.length > 0 ? imagePreferred : toolSorted;
                    preselected = preselectPool
                        .slice(0, Math.floor(maxCandidates))
                        .map(function (entry) { return entry.modelRef; });
                    imagePreselected = imageSorted
                        .slice(0, Math.floor(maxCandidates))
                        .map(function (entry) { return entry.modelRef; });
                    if (!opts.json) {
                        printScanSummary(results, runtime);
                        printScanTable(sorted, runtime);
                    }
                    noInput = opts.input === false;
                    canPrompt = process.stdin.isTTY && !opts.yes && !noInput && !opts.json;
                    selected = preselected;
                    selectedImages = imagePreselected;
                    if (!canPrompt) return [3 /*break*/, 9];
                    return [4 /*yield*/, multiselect({
                            message: "Select fallback models (ordered)",
                            options: toolSorted.map(function (entry) { return ({
                                value: entry.modelRef,
                                label: entry.modelRef,
                                hint: buildScanHint(entry),
                            }); }),
                            initialValues: preselected,
                        })];
                case 6:
                    selection = _e.sent();
                    if ((0, prompts_1.isCancel)(selection)) {
                        (0, prompts_1.cancel)((_c = (0, prompt_style_js_1.stylePromptTitle)("Model scan cancelled.")) !== null && _c !== void 0 ? _c : "Model scan cancelled.");
                        runtime.exit(0);
                    }
                    selected = selection;
                    if (!(imageSorted.length > 0)) return [3 /*break*/, 8];
                    return [4 /*yield*/, multiselect({
                            message: "Select image fallback models (ordered)",
                            options: imageSorted.map(function (entry) { return ({
                                value: entry.modelRef,
                                label: entry.modelRef,
                                hint: buildScanHint(entry),
                            }); }),
                            initialValues: imagePreselected,
                        })];
                case 7:
                    imageSelection = _e.sent();
                    if ((0, prompts_1.isCancel)(imageSelection)) {
                        (0, prompts_1.cancel)((_d = (0, prompt_style_js_1.stylePromptTitle)("Model scan cancelled.")) !== null && _d !== void 0 ? _d : "Model scan cancelled.");
                        runtime.exit(0);
                    }
                    selectedImages = imageSelection;
                    _e.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    if (!process.stdin.isTTY && !opts.yes && !noInput && !opts.json) {
                        throw new Error("Non-interactive scan: pass --yes to apply defaults.");
                    }
                    _e.label = 10;
                case 10:
                    if (selected.length === 0) {
                        throw new Error("No models selected for fallbacks.");
                    }
                    if (opts.setImage && selectedImages.length === 0) {
                        throw new Error("No image-capable models selected for image model.");
                    }
                    return [4 /*yield*/, (0, shared_js_1.updateConfig)(function (cfg) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                            var nextModels = __assign({}, (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models);
                            for (var _i = 0, selected_1 = selected; _i < selected_1.length; _i++) {
                                var entry = selected_1[_i];
                                if (!nextModels[entry]) {
                                    nextModels[entry] = {};
                                }
                            }
                            for (var _k = 0, selectedImages_1 = selectedImages; _k < selectedImages_1.length; _k++) {
                                var entry = selectedImages_1[_k];
                                if (!nextModels[entry]) {
                                    nextModels[entry] = {};
                                }
                            }
                            var existingImageModel = (_d = (_c = cfg.agents) === null || _c === void 0 ? void 0 : _c.defaults) === null || _d === void 0 ? void 0 : _d.imageModel;
                            var nextImageModel = selectedImages.length > 0
                                ? __assign(__assign(__assign({}, ((existingImageModel === null || existingImageModel === void 0 ? void 0 : existingImageModel.primary) ? { primary: existingImageModel.primary } : undefined)), { fallbacks: selectedImages }), (opts.setImage ? { primary: selectedImages[0] } : {})) : (_f = (_e = cfg.agents) === null || _e === void 0 ? void 0 : _e.defaults) === null || _f === void 0 ? void 0 : _f.imageModel;
                            var existingModel = (_h = (_g = cfg.agents) === null || _g === void 0 ? void 0 : _g.defaults) === null || _h === void 0 ? void 0 : _h.model;
                            var defaults = __assign(__assign(__assign(__assign({}, (_j = cfg.agents) === null || _j === void 0 ? void 0 : _j.defaults), { model: __assign(__assign(__assign({}, ((existingModel === null || existingModel === void 0 ? void 0 : existingModel.primary) ? { primary: existingModel.primary } : undefined)), { fallbacks: selected }), (opts.setDefault ? { primary: selected[0] } : {})) }), (nextImageModel ? { imageModel: nextImageModel } : {})), { models: nextModels });
                            return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: defaults }) });
                        })];
                case 11:
                    _updated = _e.sent();
                    if (opts.json) {
                        runtime.log(JSON.stringify({
                            selected: selected,
                            selectedImages: selectedImages,
                            setDefault: Boolean(opts.setDefault),
                            setImage: Boolean(opts.setImage),
                            results: results,
                            warnings: [],
                        }, null, 2));
                        return [2 /*return*/];
                    }
                    (0, logging_js_1.logConfigUpdated)(runtime);
                    runtime.log("Fallbacks: ".concat(selected.join(", ")));
                    if (selectedImages.length > 0) {
                        runtime.log("Image fallbacks: ".concat(selectedImages.join(", ")));
                    }
                    if (opts.setDefault) {
                        runtime.log("Default model: ".concat(selected[0]));
                    }
                    if (opts.setImage && selectedImages.length > 0) {
                        runtime.log("Image model: ".concat(selectedImages[0]));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
