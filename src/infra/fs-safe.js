"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.SafeOpenError = void 0;
exports.openFileWithinRoot = openFileWithinRoot;
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var SafeOpenError = /** @class */ (function (_super) {
    __extends(SafeOpenError, _super);
    function SafeOpenError(code, message) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.name = "SafeOpenError";
        return _this;
    }
    return SafeOpenError;
}(Error));
exports.SafeOpenError = SafeOpenError;
var NOT_FOUND_CODES = new Set(["ENOENT", "ENOTDIR"]);
var ensureTrailingSep = function (value) { return (value.endsWith(node_path_1.default.sep) ? value : value + node_path_1.default.sep); };
var isNodeError = function (err) {
    return Boolean(err && typeof err === "object" && "code" in err);
};
var isNotFoundError = function (err) {
    return isNodeError(err) && typeof err.code === "string" && NOT_FOUND_CODES.has(err.code);
};
var isSymlinkOpenError = function (err) {
    return isNodeError(err) && (err.code === "ELOOP" || err.code === "EINVAL" || err.code === "ENOTSUP");
};
function openFileWithinRoot(params) {
    return __awaiter(this, void 0, void 0, function () {
        var rootReal, err_1, rootWithSep, resolved, supportsNoFollow, flags, handle, err_2, lstat, realPath, stat, realStat, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.realpath(params.rootDir)];
                case 1:
                    rootReal = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    if (isNotFoundError(err_1)) {
                        throw new SafeOpenError("not-found", "root dir not found");
                    }
                    throw err_1;
                case 3:
                    rootWithSep = ensureTrailingSep(rootReal);
                    resolved = node_path_1.default.resolve(rootWithSep, params.relativePath);
                    if (!resolved.startsWith(rootWithSep)) {
                        throw new SafeOpenError("invalid-path", "path escapes root");
                    }
                    supportsNoFollow = process.platform !== "win32" && "O_NOFOLLOW" in node_fs_1.constants;
                    flags = node_fs_1.constants.O_RDONLY | (supportsNoFollow ? node_fs_1.constants.O_NOFOLLOW : 0);
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, promises_1.default.open(resolved, flags)];
                case 5:
                    handle = _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_2 = _a.sent();
                    if (isNotFoundError(err_2)) {
                        throw new SafeOpenError("not-found", "file not found");
                    }
                    if (isSymlinkOpenError(err_2)) {
                        throw new SafeOpenError("invalid-path", "symlink open blocked");
                    }
                    throw err_2;
                case 7:
                    _a.trys.push([7, 12, , 14]);
                    return [4 /*yield*/, promises_1.default.lstat(resolved).catch(function () { return null; })];
                case 8:
                    lstat = _a.sent();
                    if (lstat === null || lstat === void 0 ? void 0 : lstat.isSymbolicLink()) {
                        throw new SafeOpenError("invalid-path", "symlink not allowed");
                    }
                    return [4 /*yield*/, promises_1.default.realpath(resolved)];
                case 9:
                    realPath = _a.sent();
                    if (!realPath.startsWith(rootWithSep)) {
                        throw new SafeOpenError("invalid-path", "path escapes root");
                    }
                    return [4 /*yield*/, handle.stat()];
                case 10:
                    stat = _a.sent();
                    if (!stat.isFile()) {
                        throw new SafeOpenError("invalid-path", "not a file");
                    }
                    return [4 /*yield*/, promises_1.default.stat(realPath)];
                case 11:
                    realStat = _a.sent();
                    if (stat.ino !== realStat.ino || stat.dev !== realStat.dev) {
                        throw new SafeOpenError("invalid-path", "path mismatch");
                    }
                    return [2 /*return*/, { handle: handle, realPath: realPath, stat: stat }];
                case 12:
                    err_3 = _a.sent();
                    return [4 /*yield*/, handle.close().catch(function () { })];
                case 13:
                    _a.sent();
                    if (err_3 instanceof SafeOpenError) {
                        throw err_3;
                    }
                    if (isNotFoundError(err_3)) {
                        throw new SafeOpenError("not-found", "file not found");
                    }
                    throw err_3;
                case 14: return [2 /*return*/];
            }
        });
    });
}
