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
exports.isMatrixSdkAvailable = isMatrixSdkAvailable;
exports.ensureMatrixSdkInstalled = ensureMatrixSdkInstalled;
var node_fs_1 = require("node:fs");
var node_module_1 = require("node:module");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var runtime_js_1 = require("../runtime.js");
var MATRIX_SDK_PACKAGE = "@vector-im/matrix-bot-sdk";
function isMatrixSdkAvailable() {
    try {
        var req = (0, node_module_1.createRequire)(import.meta.url);
        req.resolve(MATRIX_SDK_PACKAGE);
        return true;
    }
    catch (_a) {
        return false;
    }
}
function resolvePluginRoot() {
    var currentDir = node_path_1.default.dirname((0, node_url_1.fileURLToPath)(import.meta.url));
    return node_path_1.default.resolve(currentDir, "..", "..");
}
function ensureMatrixSdkInstalled(params) {
    return __awaiter(this, void 0, void 0, function () {
        var confirm, ok, root, command, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (isMatrixSdkAvailable()) {
                        return [2 /*return*/];
                    }
                    confirm = params.confirm;
                    if (!confirm) return [3 /*break*/, 2];
                    return [4 /*yield*/, confirm("Matrix requires @vector-im/matrix-bot-sdk. Install now?")];
                case 1:
                    ok = _c.sent();
                    if (!ok) {
                        throw new Error("Matrix requires @vector-im/matrix-bot-sdk (install dependencies first).");
                    }
                    _c.label = 2;
                case 2:
                    root = resolvePluginRoot();
                    command = node_fs_1.default.existsSync(node_path_1.default.join(root, "pnpm-lock.yaml"))
                        ? ["pnpm", "install"]
                        : ["npm", "install", "--omit=dev", "--silent"];
                    (_b = (_a = params.runtime).log) === null || _b === void 0 ? void 0 : _b.call(_a, "matrix: installing dependencies via ".concat(command[0], " (").concat(root, ")\u2026"));
                    return [4 /*yield*/, (0, runtime_js_1.getMatrixRuntime)().system.runCommandWithTimeout(command, {
                            cwd: root,
                            timeoutMs: 300000,
                            env: { COREPACK_ENABLE_DOWNLOAD_PROMPT: "0" },
                        })];
                case 3:
                    result = _c.sent();
                    if (result.code !== 0) {
                        throw new Error(result.stderr.trim() || result.stdout.trim() || "Matrix dependency install failed.");
                    }
                    if (!isMatrixSdkAvailable()) {
                        throw new Error("Matrix dependency install completed but @vector-im/matrix-bot-sdk is still missing.");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
