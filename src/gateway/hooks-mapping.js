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
exports.resolveHookMappings = resolveHookMappings;
exports.applyHookMappings = applyHookMappings;
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var config_js_1 = require("../config/config.js");
var hookPresetMappings = {
    gmail: [
        {
            id: "gmail",
            match: { path: "gmail" },
            action: "agent",
            wakeMode: "now",
            name: "Gmail",
            sessionKey: "hook:gmail:{{messages[0].id}}",
            messageTemplate: "New email from {{messages[0].from}}\nSubject: {{messages[0].subject}}\n{{messages[0].snippet}}\n{{messages[0].body}}",
        },
    ],
};
var transformCache = new Map();
function resolveHookMappings(hooks) {
    var _a, _b;
    var presets = (_a = hooks === null || hooks === void 0 ? void 0 : hooks.presets) !== null && _a !== void 0 ? _a : [];
    var gmailAllowUnsafe = (_b = hooks === null || hooks === void 0 ? void 0 : hooks.gmail) === null || _b === void 0 ? void 0 : _b.allowUnsafeExternalContent;
    var mappings = [];
    if (hooks === null || hooks === void 0 ? void 0 : hooks.mappings) {
        mappings.push.apply(mappings, hooks.mappings);
    }
    for (var _i = 0, presets_1 = presets; _i < presets_1.length; _i++) {
        var preset = presets_1[_i];
        var presetMappings = hookPresetMappings[preset];
        if (!presetMappings) {
            continue;
        }
        if (preset === "gmail" && typeof gmailAllowUnsafe === "boolean") {
            mappings.push.apply(mappings, presetMappings.map(function (mapping) { return (__assign(__assign({}, mapping), { allowUnsafeExternalContent: gmailAllowUnsafe })); }));
            continue;
        }
        mappings.push.apply(mappings, presetMappings);
    }
    if (mappings.length === 0) {
        return [];
    }
    var configDir = node_path_1.default.dirname(config_js_1.CONFIG_PATH);
    var transformsDir = (hooks === null || hooks === void 0 ? void 0 : hooks.transformsDir)
        ? resolvePath(configDir, hooks.transformsDir)
        : configDir;
    return mappings.map(function (mapping, index) { return normalizeHookMapping(mapping, index, transformsDir); });
}
function applyHookMappings(mappings, ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, mappings_1, mapping, base, override, transform, merged;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (mappings.length === 0) {
                        return [2 /*return*/, null];
                    }
                    _i = 0, mappings_1 = mappings;
                    _a.label = 1;
                case 1:
                    if (!(_i < mappings_1.length)) return [3 /*break*/, 6];
                    mapping = mappings_1[_i];
                    if (!mappingMatches(mapping, ctx)) {
                        return [3 /*break*/, 5];
                    }
                    base = buildActionFromMapping(mapping, ctx);
                    if (!base.ok) {
                        return [2 /*return*/, base];
                    }
                    override = null;
                    if (!mapping.transform) return [3 /*break*/, 4];
                    return [4 /*yield*/, loadTransform(mapping.transform)];
                case 2:
                    transform = _a.sent();
                    return [4 /*yield*/, transform(ctx)];
                case 3:
                    override = _a.sent();
                    if (override === null) {
                        return [2 /*return*/, { ok: true, action: null, skipped: true }];
                    }
                    _a.label = 4;
                case 4:
                    if (!base.action) {
                        return [2 /*return*/, { ok: true, action: null, skipped: true }];
                    }
                    merged = mergeAction(base.action, override, mapping.action);
                    if (!merged.ok) {
                        return [2 /*return*/, merged];
                    }
                    return [2 /*return*/, merged];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, null];
            }
        });
    });
}
function normalizeHookMapping(mapping, index, transformsDir) {
    var _a, _b, _c, _d, _e, _f, _g;
    var id = ((_a = mapping.id) === null || _a === void 0 ? void 0 : _a.trim()) || "mapping-".concat(index + 1);
    var matchPath = normalizeMatchPath((_b = mapping.match) === null || _b === void 0 ? void 0 : _b.path);
    var matchSource = (_d = (_c = mapping.match) === null || _c === void 0 ? void 0 : _c.source) === null || _d === void 0 ? void 0 : _d.trim();
    var action = (_e = mapping.action) !== null && _e !== void 0 ? _e : "agent";
    var wakeMode = (_f = mapping.wakeMode) !== null && _f !== void 0 ? _f : "now";
    var transform = mapping.transform
        ? {
            modulePath: resolvePath(transformsDir, mapping.transform.module),
            exportName: ((_g = mapping.transform.export) === null || _g === void 0 ? void 0 : _g.trim()) || undefined,
        }
        : undefined;
    return {
        id: id,
        matchPath: matchPath,
        matchSource: matchSource,
        action: action,
        wakeMode: wakeMode,
        name: mapping.name,
        sessionKey: mapping.sessionKey,
        messageTemplate: mapping.messageTemplate,
        textTemplate: mapping.textTemplate,
        deliver: mapping.deliver,
        allowUnsafeExternalContent: mapping.allowUnsafeExternalContent,
        channel: mapping.channel,
        to: mapping.to,
        model: mapping.model,
        thinking: mapping.thinking,
        timeoutSeconds: mapping.timeoutSeconds,
        transform: transform,
    };
}
function mappingMatches(mapping, ctx) {
    if (mapping.matchPath) {
        if (mapping.matchPath !== normalizeMatchPath(ctx.path)) {
            return false;
        }
    }
    if (mapping.matchSource) {
        var source = typeof ctx.payload.source === "string" ? ctx.payload.source : undefined;
        if (!source || source !== mapping.matchSource) {
            return false;
        }
    }
    return true;
}
function buildActionFromMapping(mapping, ctx) {
    var _a, _b, _c, _d;
    if (mapping.action === "wake") {
        var text = renderTemplate((_a = mapping.textTemplate) !== null && _a !== void 0 ? _a : "", ctx);
        return {
            ok: true,
            action: {
                kind: "wake",
                text: text,
                mode: (_b = mapping.wakeMode) !== null && _b !== void 0 ? _b : "now",
            },
        };
    }
    var message = renderTemplate((_c = mapping.messageTemplate) !== null && _c !== void 0 ? _c : "", ctx);
    return {
        ok: true,
        action: {
            kind: "agent",
            message: message,
            name: renderOptional(mapping.name, ctx),
            wakeMode: (_d = mapping.wakeMode) !== null && _d !== void 0 ? _d : "now",
            sessionKey: renderOptional(mapping.sessionKey, ctx),
            deliver: mapping.deliver,
            allowUnsafeExternalContent: mapping.allowUnsafeExternalContent,
            channel: mapping.channel,
            to: renderOptional(mapping.to, ctx),
            model: renderOptional(mapping.model, ctx),
            thinking: renderOptional(mapping.thinking, ctx),
            timeoutSeconds: mapping.timeoutSeconds,
        },
    };
}
function mergeAction(base, override, defaultAction) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    if (!override) {
        return validateAction(base);
    }
    var kind = (_b = (_a = override.kind) !== null && _a !== void 0 ? _a : base.kind) !== null && _b !== void 0 ? _b : defaultAction;
    if (kind === "wake") {
        var baseWake = base.kind === "wake" ? base : undefined;
        var text = typeof override.text === "string" ? override.text : ((_c = baseWake === null || baseWake === void 0 ? void 0 : baseWake.text) !== null && _c !== void 0 ? _c : "");
        var mode = override.mode === "next-heartbeat" ? "next-heartbeat" : ((_d = baseWake === null || baseWake === void 0 ? void 0 : baseWake.mode) !== null && _d !== void 0 ? _d : "now");
        return validateAction({ kind: "wake", text: text, mode: mode });
    }
    var baseAgent = base.kind === "agent" ? base : undefined;
    var message = typeof override.message === "string" ? override.message : ((_e = baseAgent === null || baseAgent === void 0 ? void 0 : baseAgent.message) !== null && _e !== void 0 ? _e : "");
    var wakeMode = override.wakeMode === "next-heartbeat" ? "next-heartbeat" : ((_f = baseAgent === null || baseAgent === void 0 ? void 0 : baseAgent.wakeMode) !== null && _f !== void 0 ? _f : "now");
    return validateAction({
        kind: "agent",
        message: message,
        wakeMode: wakeMode,
        name: (_g = override.name) !== null && _g !== void 0 ? _g : baseAgent === null || baseAgent === void 0 ? void 0 : baseAgent.name,
        sessionKey: (_h = override.sessionKey) !== null && _h !== void 0 ? _h : baseAgent === null || baseAgent === void 0 ? void 0 : baseAgent.sessionKey,
        deliver: typeof override.deliver === "boolean" ? override.deliver : baseAgent === null || baseAgent === void 0 ? void 0 : baseAgent.deliver,
        allowUnsafeExternalContent: typeof override.allowUnsafeExternalContent === "boolean"
            ? override.allowUnsafeExternalContent
            : baseAgent === null || baseAgent === void 0 ? void 0 : baseAgent.allowUnsafeExternalContent,
        channel: (_j = override.channel) !== null && _j !== void 0 ? _j : baseAgent === null || baseAgent === void 0 ? void 0 : baseAgent.channel,
        to: (_k = override.to) !== null && _k !== void 0 ? _k : baseAgent === null || baseAgent === void 0 ? void 0 : baseAgent.to,
        model: (_l = override.model) !== null && _l !== void 0 ? _l : baseAgent === null || baseAgent === void 0 ? void 0 : baseAgent.model,
        thinking: (_m = override.thinking) !== null && _m !== void 0 ? _m : baseAgent === null || baseAgent === void 0 ? void 0 : baseAgent.thinking,
        timeoutSeconds: (_o = override.timeoutSeconds) !== null && _o !== void 0 ? _o : baseAgent === null || baseAgent === void 0 ? void 0 : baseAgent.timeoutSeconds,
    });
}
function validateAction(action) {
    var _a, _b;
    if (action.kind === "wake") {
        if (!((_a = action.text) === null || _a === void 0 ? void 0 : _a.trim())) {
            return { ok: false, error: "hook mapping requires text" };
        }
        return { ok: true, action: action };
    }
    if (!((_b = action.message) === null || _b === void 0 ? void 0 : _b.trim())) {
        return { ok: false, error: "hook mapping requires message" };
    }
    return { ok: true, action: action };
}
function loadTransform(transform) {
    return __awaiter(this, void 0, void 0, function () {
        var cached, url, mod, fn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cached = transformCache.get(transform.modulePath);
                    if (cached) {
                        return [2 /*return*/, cached];
                    }
                    url = (0, node_url_1.pathToFileURL)(transform.modulePath).href;
                    return [4 /*yield*/, Promise.resolve("".concat(url)).then(function (s) { return require(s); })];
                case 1:
                    mod = (_a.sent());
                    fn = resolveTransformFn(mod, transform.exportName);
                    transformCache.set(transform.modulePath, fn);
                    return [2 /*return*/, fn];
            }
        });
    });
}
function resolveTransformFn(mod, exportName) {
    var _a;
    var candidate = exportName ? mod[exportName] : ((_a = mod.default) !== null && _a !== void 0 ? _a : mod.transform);
    if (typeof candidate !== "function") {
        throw new Error("hook transform module must export a function");
    }
    return candidate;
}
function resolvePath(baseDir, target) {
    if (!target) {
        return baseDir;
    }
    if (node_path_1.default.isAbsolute(target)) {
        return target;
    }
    return node_path_1.default.join(baseDir, target);
}
function normalizeMatchPath(raw) {
    if (!raw) {
        return undefined;
    }
    var trimmed = raw.trim();
    if (!trimmed) {
        return undefined;
    }
    return trimmed.replace(/^\/+/, "").replace(/\/+$/, "");
}
function renderOptional(value, ctx) {
    if (!value) {
        return undefined;
    }
    var rendered = renderTemplate(value, ctx).trim();
    return rendered ? rendered : undefined;
}
function renderTemplate(template, ctx) {
    if (!template) {
        return "";
    }
    return template.replace(/\{\{\s*([^}]+)\s*\}\}/g, function (_, expr) {
        var value = resolveTemplateExpr(expr.trim(), ctx);
        if (value === undefined || value === null) {
            return "";
        }
        if (typeof value === "string") {
            return value;
        }
        if (typeof value === "number" || typeof value === "boolean") {
            return String(value);
        }
        return JSON.stringify(value);
    });
}
function resolveTemplateExpr(expr, ctx) {
    if (expr === "path") {
        return ctx.path;
    }
    if (expr === "now") {
        return new Date().toISOString();
    }
    if (expr.startsWith("headers.")) {
        return getByPath(ctx.headers, expr.slice("headers.".length));
    }
    if (expr.startsWith("query.")) {
        return getByPath(Object.fromEntries(ctx.url.searchParams.entries()), expr.slice("query.".length));
    }
    if (expr.startsWith("payload.")) {
        return getByPath(ctx.payload, expr.slice("payload.".length));
    }
    return getByPath(ctx.payload, expr);
}
function getByPath(input, pathExpr) {
    if (!pathExpr) {
        return undefined;
    }
    var parts = [];
    var re = /([^.[\]]+)|(\[(\d+)\])/g;
    var match = re.exec(pathExpr);
    while (match) {
        if (match[1]) {
            parts.push(match[1]);
        }
        else if (match[3]) {
            parts.push(Number(match[3]));
        }
        match = re.exec(pathExpr);
    }
    var current = input;
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        if (current === null || current === undefined) {
            return undefined;
        }
        if (typeof part === "number") {
            if (!Array.isArray(current)) {
                return undefined;
            }
            current = current[part];
            continue;
        }
        if (typeof current !== "object") {
            return undefined;
        }
        current = current[part];
    }
    return current;
}
