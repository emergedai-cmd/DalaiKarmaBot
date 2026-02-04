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
exports.resolveWorkspaceTemplateDir = resolveWorkspaceTemplateDir;
exports.resetWorkspaceTemplateDirCache = resetWorkspaceTemplateDirCache;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var openclaw_root_js_1 = require("../infra/openclaw-root.js");
var FALLBACK_TEMPLATE_DIR = node_path_1.default.resolve(node_path_1.default.dirname((0, node_url_1.fileURLToPath)(import.meta.url)), "../../docs/reference/templates");
var cachedTemplateDir;
var resolvingTemplateDir;
function pathExists(candidate) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.access(candidate)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, true];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function resolveWorkspaceTemplateDir(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (cachedTemplateDir) {
                        return [2 /*return*/, cachedTemplateDir];
                    }
                    if (resolvingTemplateDir) {
                        return [2 /*return*/, resolvingTemplateDir];
                    }
                    resolvingTemplateDir = (function () { return __awaiter(_this, void 0, void 0, function () {
                        var moduleUrl, argv1, cwd, packageRoot, candidates, _i, candidates_1, candidate;
                        var _a, _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    moduleUrl = (_a = opts === null || opts === void 0 ? void 0 : opts.moduleUrl) !== null && _a !== void 0 ? _a : import.meta.url;
                                    argv1 = (_b = opts === null || opts === void 0 ? void 0 : opts.argv1) !== null && _b !== void 0 ? _b : process.argv[1];
                                    cwd = (_c = opts === null || opts === void 0 ? void 0 : opts.cwd) !== null && _c !== void 0 ? _c : process.cwd();
                                    return [4 /*yield*/, (0, openclaw_root_js_1.resolveOpenClawPackageRoot)({ moduleUrl: moduleUrl, argv1: argv1, cwd: cwd })];
                                case 1:
                                    packageRoot = _e.sent();
                                    candidates = [
                                        packageRoot ? node_path_1.default.join(packageRoot, "docs", "reference", "templates") : null,
                                        cwd ? node_path_1.default.resolve(cwd, "docs", "reference", "templates") : null,
                                        FALLBACK_TEMPLATE_DIR,
                                    ].filter(Boolean);
                                    _i = 0, candidates_1 = candidates;
                                    _e.label = 2;
                                case 2:
                                    if (!(_i < candidates_1.length)) return [3 /*break*/, 5];
                                    candidate = candidates_1[_i];
                                    return [4 /*yield*/, pathExists(candidate)];
                                case 3:
                                    if (_e.sent()) {
                                        cachedTemplateDir = candidate;
                                        return [2 /*return*/, candidate];
                                    }
                                    _e.label = 4;
                                case 4:
                                    _i++;
                                    return [3 /*break*/, 2];
                                case 5:
                                    cachedTemplateDir = (_d = candidates[0]) !== null && _d !== void 0 ? _d : FALLBACK_TEMPLATE_DIR;
                                    return [2 /*return*/, cachedTemplateDir];
                            }
                        });
                    }); })();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, resolvingTemplateDir];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    resolvingTemplateDir = undefined;
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function resetWorkspaceTemplateDirCache() {
    cachedTemplateDir = undefined;
    resolvingTemplateDir = undefined;
}
