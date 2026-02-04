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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var identity_avatar_js_1 = require("./identity-avatar.js");
function writeFile(filePath_1) {
    return __awaiter(this, arguments, void 0, function (filePath, contents) {
        if (contents === void 0) { contents = "avatar"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(filePath), { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(filePath, contents, "utf-8")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
(0, vitest_1.describe)("resolveAgentAvatar", function () {
    (0, vitest_1.it)("resolves local avatar from config when inside workspace", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, workspace, avatarPath, cfg, workspaceReal, resolved, resolvedReal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-avatar-"))];
                case 1:
                    root = _a.sent();
                    workspace = node_path_1.default.join(root, "work");
                    avatarPath = node_path_1.default.join(workspace, "avatars", "main.png");
                    return [4 /*yield*/, writeFile(avatarPath)];
                case 2:
                    _a.sent();
                    cfg = {
                        agents: {
                            list: [
                                {
                                    id: "main",
                                    workspace: workspace,
                                    identity: { avatar: "avatars/main.png" },
                                },
                            ],
                        },
                    };
                    return [4 /*yield*/, promises_1.default.realpath(workspace)];
                case 3:
                    workspaceReal = _a.sent();
                    resolved = (0, identity_avatar_js_1.resolveAgentAvatar)(cfg, "main");
                    (0, vitest_1.expect)(resolved.kind).toBe("local");
                    if (!(resolved.kind === "local")) return [3 /*break*/, 5];
                    return [4 /*yield*/, promises_1.default.realpath(resolved.filePath)];
                case 4:
                    resolvedReal = _a.sent();
                    (0, vitest_1.expect)(node_path_1.default.relative(workspaceReal, resolvedReal)).toBe(node_path_1.default.join("avatars", "main.png"));
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects avatars outside the workspace", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, workspace, outsidePath, cfg, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-avatar-"))];
                case 1:
                    root = _a.sent();
                    workspace = node_path_1.default.join(root, "work");
                    return [4 /*yield*/, promises_1.default.mkdir(workspace, { recursive: true })];
                case 2:
                    _a.sent();
                    outsidePath = node_path_1.default.join(root, "outside.png");
                    return [4 /*yield*/, writeFile(outsidePath)];
                case 3:
                    _a.sent();
                    cfg = {
                        agents: {
                            list: [
                                {
                                    id: "main",
                                    workspace: workspace,
                                    identity: { avatar: outsidePath },
                                },
                            ],
                        },
                    };
                    resolved = (0, identity_avatar_js_1.resolveAgentAvatar)(cfg, "main");
                    (0, vitest_1.expect)(resolved.kind).toBe("none");
                    if (resolved.kind === "none") {
                        (0, vitest_1.expect)(resolved.reason).toBe("outside_workspace");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to IDENTITY.md when config has no avatar", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, workspace, avatarPath, cfg, workspaceReal, resolved, resolvedReal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-avatar-"))];
                case 1:
                    root = _a.sent();
                    workspace = node_path_1.default.join(root, "work");
                    avatarPath = node_path_1.default.join(workspace, "avatars", "fallback.png");
                    return [4 /*yield*/, writeFile(avatarPath)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.mkdir(workspace, { recursive: true })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspace, "IDENTITY.md"), "- Avatar: avatars/fallback.png\n", "utf-8")];
                case 4:
                    _a.sent();
                    cfg = {
                        agents: {
                            list: [{ id: "main", workspace: workspace }],
                        },
                    };
                    return [4 /*yield*/, promises_1.default.realpath(workspace)];
                case 5:
                    workspaceReal = _a.sent();
                    resolved = (0, identity_avatar_js_1.resolveAgentAvatar)(cfg, "main");
                    (0, vitest_1.expect)(resolved.kind).toBe("local");
                    if (!(resolved.kind === "local")) return [3 /*break*/, 7];
                    return [4 /*yield*/, promises_1.default.realpath(resolved.filePath)];
                case 6:
                    resolvedReal = _a.sent();
                    (0, vitest_1.expect)(node_path_1.default.relative(workspaceReal, resolvedReal)).toBe(node_path_1.default.join("avatars", "fallback.png"));
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts remote and data avatars", function () {
        var cfg = {
            agents: {
                list: [
                    { id: "main", identity: { avatar: "https://example.com/avatar.png" } },
                    { id: "data", identity: { avatar: "data:image/png;base64,aaaa" } },
                ],
            },
        };
        var remote = (0, identity_avatar_js_1.resolveAgentAvatar)(cfg, "main");
        (0, vitest_1.expect)(remote.kind).toBe("remote");
        var data = (0, identity_avatar_js_1.resolveAgentAvatar)(cfg, "data");
        (0, vitest_1.expect)(data.kind).toBe("data");
    });
});
