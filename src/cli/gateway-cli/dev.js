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
exports.ensureDevGatewayConfig = ensureDevGatewayConfig;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var workspace_templates_js_1 = require("../../agents/workspace-templates.js");
var workspace_js_1 = require("../../agents/workspace.js");
var onboard_helpers_js_1 = require("../../commands/onboard-helpers.js");
var config_js_1 = require("../../config/config.js");
var runtime_js_1 = require("../../runtime.js");
var utils_js_1 = require("../../utils.js");
var DEV_IDENTITY_NAME = "C3-PO";
var DEV_IDENTITY_THEME = "protocol droid";
var DEV_IDENTITY_EMOJI = "🤖";
var DEV_AGENT_WORKSPACE_SUFFIX = "dev";
function loadDevTemplate(name, fallback) {
    return __awaiter(this, void 0, void 0, function () {
        var templateDir, raw, endIndex, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, workspace_templates_js_1.resolveWorkspaceTemplateDir)()];
                case 1:
                    templateDir = _b.sent();
                    return [4 /*yield*/, node_fs_1.default.promises.readFile(node_path_1.default.join(templateDir, name), "utf-8")];
                case 2:
                    raw = _b.sent();
                    if (!raw.startsWith("---")) {
                        return [2 /*return*/, raw];
                    }
                    endIndex = raw.indexOf("\n---", 3);
                    if (endIndex === -1) {
                        return [2 /*return*/, raw];
                    }
                    return [2 /*return*/, raw.slice(endIndex + "\n---".length).replace(/^\s+/, "")];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/, fallback];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var resolveDevWorkspaceDir = function (env) {
    var _a;
    if (env === void 0) { env = process.env; }
    var baseDir = (0, workspace_js_1.resolveDefaultAgentWorkspaceDir)(env, node_os_1.default.homedir);
    var profile = (_a = env.OPENCLAW_PROFILE) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
    if (profile === "dev") {
        return baseDir;
    }
    return "".concat(baseDir, "-").concat(DEV_AGENT_WORKSPACE_SUFFIX);
};
function writeFileIfMissing(filePath, content) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1, anyErr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, node_fs_1.default.promises.writeFile(filePath, content, {
                            encoding: "utf-8",
                            flag: "wx",
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    anyErr = err_1;
                    if (anyErr.code !== "EEXIST") {
                        throw err_1;
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function ensureDevWorkspace(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var resolvedDir, _a, agents, soul, tools, identity, user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    resolvedDir = (0, utils_js_1.resolveUserPath)(dir);
                    return [4 /*yield*/, node_fs_1.default.promises.mkdir(resolvedDir, { recursive: true })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, Promise.all([
                            loadDevTemplate("AGENTS.dev.md", "# AGENTS.md - OpenClaw Dev Workspace\n\nDefault dev workspace for openclaw gateway --dev.\n"),
                            loadDevTemplate("SOUL.dev.md", "# SOUL.md - Dev Persona\n\nProtocol droid for debugging and operations.\n"),
                            loadDevTemplate("TOOLS.dev.md", "# TOOLS.md - User Tool Notes (editable)\n\nAdd your local tool notes here.\n"),
                            loadDevTemplate("IDENTITY.dev.md", "# IDENTITY.md - Agent Identity\n\n- Name: ".concat(DEV_IDENTITY_NAME, "\n- Creature: protocol droid\n- Vibe: ").concat(DEV_IDENTITY_THEME, "\n- Emoji: ").concat(DEV_IDENTITY_EMOJI, "\n")),
                            loadDevTemplate("USER.dev.md", "# USER.md - User Profile\n\n- Name:\n- Preferred address:\n- Notes:\n"),
                        ])];
                case 2:
                    _a = _b.sent(), agents = _a[0], soul = _a[1], tools = _a[2], identity = _a[3], user = _a[4];
                    return [4 /*yield*/, writeFileIfMissing(node_path_1.default.join(resolvedDir, "AGENTS.md"), agents)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, writeFileIfMissing(node_path_1.default.join(resolvedDir, "SOUL.md"), soul)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, writeFileIfMissing(node_path_1.default.join(resolvedDir, "TOOLS.md"), tools)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, writeFileIfMissing(node_path_1.default.join(resolvedDir, "IDENTITY.md"), identity)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, writeFileIfMissing(node_path_1.default.join(resolvedDir, "USER.md"), user)];
                case 7:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function ensureDevGatewayConfig(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var workspace, io, configPath, configExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    workspace = resolveDevWorkspaceDir();
                    if (!opts.reset) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, onboard_helpers_js_1.handleReset)("full", workspace, runtime_js_1.defaultRuntime)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    io = (0, config_js_1.createConfigIO)();
                    configPath = io.configPath;
                    configExists = node_fs_1.default.existsSync(configPath);
                    if (!opts.reset && configExists) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)({
                            gateway: {
                                mode: "local",
                                bind: "loopback",
                            },
                            agents: {
                                defaults: {
                                    workspace: workspace,
                                    skipBootstrap: true,
                                },
                                list: [
                                    {
                                        id: "dev",
                                        default: true,
                                        workspace: workspace,
                                        identity: {
                                            name: DEV_IDENTITY_NAME,
                                            theme: DEV_IDENTITY_THEME,
                                            emoji: DEV_IDENTITY_EMOJI,
                                        },
                                    },
                                ],
                            },
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, ensureDevWorkspace(workspace)];
                case 4:
                    _a.sent();
                    runtime_js_1.defaultRuntime.log("Dev config ready: ".concat((0, utils_js_1.shortenHomePath)(configPath)));
                    runtime_js_1.defaultRuntime.log("Dev workspace ready: ".concat((0, utils_js_1.shortenHomePath)((0, utils_js_1.resolveUserPath)(workspace))));
                    return [2 /*return*/];
            }
        });
    });
}
