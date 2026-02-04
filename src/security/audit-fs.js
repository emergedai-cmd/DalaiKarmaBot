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
exports.safeStat = safeStat;
exports.inspectPathPermissions = inspectPathPermissions;
exports.formatPermissionDetail = formatPermissionDetail;
exports.formatPermissionRemediation = formatPermissionRemediation;
exports.modeBits = modeBits;
exports.formatOctal = formatOctal;
exports.isWorldWritable = isWorldWritable;
exports.isGroupWritable = isGroupWritable;
exports.isWorldReadable = isWorldReadable;
exports.isGroupReadable = isGroupReadable;
var promises_1 = require("node:fs/promises");
var windows_acl_js_1 = require("./windows-acl.js");
function safeStat(targetPath) {
    return __awaiter(this, void 0, void 0, function () {
        var lst, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.lstat(targetPath)];
                case 1:
                    lst = _a.sent();
                    return [2 /*return*/, {
                            ok: true,
                            isSymlink: lst.isSymbolicLink(),
                            isDir: lst.isDirectory(),
                            mode: typeof lst.mode === "number" ? lst.mode : null,
                            uid: typeof lst.uid === "number" ? lst.uid : null,
                            gid: typeof lst.gid === "number" ? lst.gid : null,
                        }];
                case 2:
                    err_1 = _a.sent();
                    return [2 /*return*/, {
                            ok: false,
                            isSymlink: false,
                            isDir: false,
                            mode: null,
                            uid: null,
                            gid: null,
                            error: String(err_1),
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function inspectPathPermissions(targetPath, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var st, bits, platform, acl;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, safeStat(targetPath)];
                case 1:
                    st = _b.sent();
                    if (!st.ok) {
                        return [2 /*return*/, {
                                ok: false,
                                isSymlink: false,
                                isDir: false,
                                mode: null,
                                bits: null,
                                source: "unknown",
                                worldWritable: false,
                                groupWritable: false,
                                worldReadable: false,
                                groupReadable: false,
                                error: st.error,
                            }];
                    }
                    bits = modeBits(st.mode);
                    platform = (_a = opts === null || opts === void 0 ? void 0 : opts.platform) !== null && _a !== void 0 ? _a : process.platform;
                    if (!(platform === "win32")) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, windows_acl_js_1.inspectWindowsAcl)(targetPath, { env: opts === null || opts === void 0 ? void 0 : opts.env, exec: opts === null || opts === void 0 ? void 0 : opts.exec })];
                case 2:
                    acl = _b.sent();
                    if (!acl.ok) {
                        return [2 /*return*/, {
                                ok: true,
                                isSymlink: st.isSymlink,
                                isDir: st.isDir,
                                mode: st.mode,
                                bits: bits,
                                source: "unknown",
                                worldWritable: false,
                                groupWritable: false,
                                worldReadable: false,
                                groupReadable: false,
                                error: acl.error,
                            }];
                    }
                    return [2 /*return*/, {
                            ok: true,
                            isSymlink: st.isSymlink,
                            isDir: st.isDir,
                            mode: st.mode,
                            bits: bits,
                            source: "windows-acl",
                            worldWritable: acl.untrustedWorld.some(function (entry) { return entry.canWrite; }),
                            groupWritable: acl.untrustedGroup.some(function (entry) { return entry.canWrite; }),
                            worldReadable: acl.untrustedWorld.some(function (entry) { return entry.canRead; }),
                            groupReadable: acl.untrustedGroup.some(function (entry) { return entry.canRead; }),
                            aclSummary: (0, windows_acl_js_1.formatWindowsAclSummary)(acl),
                        }];
                case 3: return [2 /*return*/, {
                        ok: true,
                        isSymlink: st.isSymlink,
                        isDir: st.isDir,
                        mode: st.mode,
                        bits: bits,
                        source: "posix",
                        worldWritable: isWorldWritable(bits),
                        groupWritable: isGroupWritable(bits),
                        worldReadable: isWorldReadable(bits),
                        groupReadable: isGroupReadable(bits),
                    }];
            }
        });
    });
}
function formatPermissionDetail(targetPath, perms) {
    var _a;
    if (perms.source === "windows-acl") {
        var summary = (_a = perms.aclSummary) !== null && _a !== void 0 ? _a : "unknown";
        return "".concat(targetPath, " acl=").concat(summary);
    }
    return "".concat(targetPath, " mode=").concat(formatOctal(perms.bits));
}
function formatPermissionRemediation(params) {
    if (params.perms.source === "windows-acl") {
        return (0, windows_acl_js_1.formatIcaclsResetCommand)(params.targetPath, { isDir: params.isDir, env: params.env });
    }
    var mode = params.posixMode.toString(8).padStart(3, "0");
    return "chmod ".concat(mode, " ").concat(params.targetPath);
}
function modeBits(mode) {
    if (mode == null) {
        return null;
    }
    return mode & 511;
}
function formatOctal(bits) {
    if (bits == null) {
        return "unknown";
    }
    return bits.toString(8).padStart(3, "0");
}
function isWorldWritable(bits) {
    if (bits == null) {
        return false;
    }
    return (bits & 2) !== 0;
}
function isGroupWritable(bits) {
    if (bits == null) {
        return false;
    }
    return (bits & 16) !== 0;
}
function isWorldReadable(bits) {
    if (bits == null) {
        return false;
    }
    return (bits & 4) !== 0;
}
function isGroupReadable(bits) {
    if (bits == null) {
        return false;
    }
    return (bits & 32) !== 0;
}
