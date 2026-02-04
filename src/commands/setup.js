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
exports.setupCommand = setupCommand;
var json5_1 = require("json5");
var promises_1 = require("node:fs/promises");
var workspace_js_1 = require("../agents/workspace.js");
var config_js_1 = require("../config/config.js");
var logging_js_1 = require("../config/logging.js");
var sessions_js_1 = require("../config/sessions.js");
var runtime_js_1 = require("../runtime.js");
var utils_js_1 = require("../utils.js");
function readConfigFileRaw(configPath) {
    return __awaiter(this, void 0, void 0, function () {
        var raw, parsed, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.readFile(configPath, "utf-8")];
                case 1:
                    raw = _b.sent();
                    parsed = json5_1.default.parse(raw);
                    if (parsed && typeof parsed === "object") {
                        return [2 /*return*/, { exists: true, parsed: parsed }];
                    }
                    return [2 /*return*/, { exists: true, parsed: {} }];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, { exists: false, parsed: {} }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function setupCommand(opts_1) {
    return __awaiter(this, arguments, void 0, function (opts, runtime) {
        var desiredWorkspace, io, configPath, existingRaw, cfg, defaults, workspace, next, ws, sessionsDir;
        var _a, _b, _c, _d, _e;
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    desiredWorkspace = typeof (opts === null || opts === void 0 ? void 0 : opts.workspace) === "string" && opts.workspace.trim()
                        ? opts.workspace.trim()
                        : undefined;
                    io = (0, config_js_1.createConfigIO)();
                    configPath = io.configPath;
                    return [4 /*yield*/, readConfigFileRaw(configPath)];
                case 1:
                    existingRaw = _f.sent();
                    cfg = existingRaw.parsed;
                    defaults = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) !== null && _b !== void 0 ? _b : {};
                    workspace = (_c = desiredWorkspace !== null && desiredWorkspace !== void 0 ? desiredWorkspace : defaults.workspace) !== null && _c !== void 0 ? _c : workspace_js_1.DEFAULT_AGENT_WORKSPACE_DIR;
                    next = __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, defaults), { workspace: workspace }) }) });
                    if (!(!existingRaw.exists || defaults.workspace !== workspace)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(next)];
                case 2:
                    _f.sent();
                    if (!existingRaw.exists) {
                        runtime.log("Wrote ".concat((0, logging_js_1.formatConfigPath)(configPath)));
                    }
                    else {
                        (0, logging_js_1.logConfigUpdated)(runtime, { path: configPath, suffix: "(set agents.defaults.workspace)" });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    runtime.log("Config OK: ".concat((0, logging_js_1.formatConfigPath)(configPath)));
                    _f.label = 4;
                case 4: return [4 /*yield*/, (0, workspace_js_1.ensureAgentWorkspace)({
                        dir: workspace,
                        ensureBootstrapFiles: !((_e = (_d = next.agents) === null || _d === void 0 ? void 0 : _d.defaults) === null || _e === void 0 ? void 0 : _e.skipBootstrap),
                    })];
                case 5:
                    ws = _f.sent();
                    runtime.log("Workspace OK: ".concat((0, utils_js_1.shortenHomePath)(ws.dir)));
                    sessionsDir = (0, sessions_js_1.resolveSessionTranscriptsDir)();
                    return [4 /*yield*/, promises_1.default.mkdir(sessionsDir, { recursive: true })];
                case 6:
                    _f.sent();
                    runtime.log("Sessions OK: ".concat((0, utils_js_1.shortenHomePath)(sessionsDir)));
                    return [2 /*return*/];
            }
        });
    });
}
