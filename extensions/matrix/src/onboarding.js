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
exports.matrixOnboardingAdapter = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var directory_live_js_1 = require("./directory-live.js");
var directory_live_js_2 = require("./directory-live.js");
var accounts_js_1 = require("./matrix/accounts.js");
var deps_js_1 = require("./matrix/deps.js");
var channel = "matrix";
function setMatrixDmPolicy(cfg, policy) {
    var _a, _b, _c, _d, _e, _f;
    var allowFrom = policy === "open" ? (0, plugin_sdk_1.addWildcardAllowFrom)((_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.matrix) === null || _b === void 0 ? void 0 : _b.dm) === null || _c === void 0 ? void 0 : _c.allowFrom) : undefined;
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { matrix: __assign(__assign({}, (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.matrix), { dm: __assign(__assign(__assign({}, (_f = (_e = cfg.channels) === null || _e === void 0 ? void 0 : _e.matrix) === null || _f === void 0 ? void 0 : _f.dm), { policy: policy }), (allowFrom ? { allowFrom: allowFrom } : {})) }) }) });
}
function noteMatrixAuthHelp(prompter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prompter.note([
                        "Matrix requires a homeserver URL.",
                        "Use an access token (recommended) or a password (logs in and stores a token).",
                        "With access token: user ID is fetched automatically.",
                        "Env vars supported: MATRIX_HOMESERVER, MATRIX_USER_ID, MATRIX_ACCESS_TOKEN, MATRIX_PASSWORD.",
                        "Docs: ".concat((0, plugin_sdk_1.formatDocsLink)("/channels/matrix", "channels/matrix")),
                    ].join("\n"), "Matrix setup")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function promptMatrixAllowFrom(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, prompter, existingAllowFrom, account, canResolve, parseInput, isFullUserId, entry, parts, resolvedIds, unresolved, _i, parts_1, part, results, match, unique;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    cfg = params.cfg, prompter = params.prompter;
                    existingAllowFrom = (_d = (_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.matrix) === null || _b === void 0 ? void 0 : _b.dm) === null || _c === void 0 ? void 0 : _c.allowFrom) !== null && _d !== void 0 ? _d : [];
                    account = (0, accounts_js_1.resolveMatrixAccount)({ cfg: cfg });
                    canResolve = Boolean(account.configured);
                    parseInput = function (raw) {
                        return raw
                            .split(/[\n,;]+/g)
                            .map(function (entry) { return entry.trim(); })
                            .filter(Boolean);
                    };
                    isFullUserId = function (value) { return value.startsWith("@") && value.includes(":"); };
                    _h.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 12];
                    return [4 /*yield*/, prompter.text({
                            message: "Matrix allowFrom (username or user id)",
                            placeholder: "@user:server",
                            initialValue: existingAllowFrom[0] ? String(existingAllowFrom[0]) : undefined,
                            validate: function (value) { return (String(value !== null && value !== void 0 ? value : "").trim() ? undefined : "Required"); },
                        })];
                case 2:
                    entry = _h.sent();
                    parts = parseInput(String(entry));
                    resolvedIds = [];
                    unresolved = [];
                    _i = 0, parts_1 = parts;
                    _h.label = 3;
                case 3:
                    if (!(_i < parts_1.length)) return [3 /*break*/, 9];
                    part = parts_1[_i];
                    if (isFullUserId(part)) {
                        resolvedIds.push(part);
                        return [3 /*break*/, 8];
                    }
                    if (!canResolve) {
                        unresolved.push(part);
                        return [3 /*break*/, 8];
                    }
                    return [4 /*yield*/, (0, directory_live_js_2.listMatrixDirectoryPeersLive)({
                            cfg: cfg,
                            query: part,
                            limit: 5,
                        }).catch(function () { return []; })];
                case 4:
                    results = _h.sent();
                    match = results.find(function (result) { return result.id; });
                    if (!(match === null || match === void 0 ? void 0 : match.id)) return [3 /*break*/, 7];
                    resolvedIds.push(match.id);
                    if (!(results.length > 1)) return [3 /*break*/, 6];
                    return [4 /*yield*/, prompter.note("Multiple matches for \"".concat(part, "\", using ").concat(match.id, "."), "Matrix allowlist")];
                case 5:
                    _h.sent();
                    _h.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    unresolved.push(part);
                    _h.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 3];
                case 9:
                    if (!(unresolved.length > 0)) return [3 /*break*/, 11];
                    return [4 /*yield*/, prompter.note("Could not resolve: ".concat(unresolved.join(", "), ". Use full @user:server IDs."), "Matrix allowlist")];
                case 10:
                    _h.sent();
                    return [3 /*break*/, 1];
                case 11:
                    unique = __spreadArray([], new Set(__spreadArray(__spreadArray([], existingAllowFrom.map(function (item) { return String(item).trim(); }).filter(Boolean), true), resolvedIds, true)), true);
                    return [2 /*return*/, __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { matrix: __assign(__assign({}, (_e = cfg.channels) === null || _e === void 0 ? void 0 : _e.matrix), { enabled: true, dm: __assign(__assign({}, (_g = (_f = cfg.channels) === null || _f === void 0 ? void 0 : _f.matrix) === null || _g === void 0 ? void 0 : _g.dm), { policy: "allowlist", allowFrom: unique }) }) }) })];
                case 12: return [2 /*return*/];
            }
        });
    });
}
function setMatrixGroupPolicy(cfg, groupPolicy) {
    var _a;
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { matrix: __assign(__assign({}, (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.matrix), { enabled: true, groupPolicy: groupPolicy }) }) });
}
function setMatrixGroupRooms(cfg, roomKeys) {
    var _a;
    var groups = Object.fromEntries(roomKeys.map(function (key) { return [key, { allow: true }]; }));
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { matrix: __assign(__assign({}, (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.matrix), { enabled: true, groups: groups }) }) });
}
var dmPolicy = {
    label: "Matrix",
    channel: channel,
    policyKey: "channels.matrix.dm.policy",
    allowFromKey: "channels.matrix.dm.allowFrom",
    getCurrent: function (cfg) { var _a, _b, _c, _d; return (_d = (_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.matrix) === null || _b === void 0 ? void 0 : _b.dm) === null || _c === void 0 ? void 0 : _c.policy) !== null && _d !== void 0 ? _d : "pairing"; },
    setPolicy: function (cfg, policy) { return setMatrixDmPolicy(cfg, policy); },
    promptAllowFrom: promptMatrixAllowFrom,
};
exports.matrixOnboardingAdapter = {
    channel: channel,
    getStatus: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var account, configured, sdkReady;
        var cfg = _b.cfg;
        return __generator(this, function (_c) {
            account = (0, accounts_js_1.resolveMatrixAccount)({ cfg: cfg });
            configured = account.configured;
            sdkReady = (0, deps_js_1.isMatrixSdkAvailable)();
            return [2 /*return*/, {
                    channel: channel,
                    configured: configured,
                    statusLines: [
                        "Matrix: ".concat(configured ? "configured" : "needs homeserver + access token or password"),
                    ],
                    selectionHint: !sdkReady
                        ? "install @vector-im/matrix-bot-sdk"
                        : configured
                            ? "configured"
                            : "needs auth",
                }];
        });
    }); },
    configure: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var next, existing, account, envHomeserver, envUserId, envAccessToken, envPassword, envReady, useEnv, homeserver, _c, accessToken, password, userId, keep, authMode, _d, _e, _f, deviceName, _g, enableEncryption, existingGroups, accessConfig, roomKeys, resolvedIds, unresolved, _loop_1, _i, _h, entry, err_1;
        var _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
        var cfg = _b.cfg, runtime = _b.runtime, prompter = _b.prompter, forceAllowFrom = _b.forceAllowFrom;
        return __generator(this, function (_7) {
            switch (_7.label) {
                case 0:
                    next = cfg;
                    return [4 /*yield*/, (0, deps_js_1.ensureMatrixSdkInstalled)({
                            runtime: runtime,
                            confirm: function (message) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, prompter.confirm({
                                                message: message,
                                                initialValue: true,
                                            })];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); },
                        })];
                case 1:
                    _7.sent();
                    existing = (_k = (_j = next.channels) === null || _j === void 0 ? void 0 : _j.matrix) !== null && _k !== void 0 ? _k : {};
                    account = (0, accounts_js_1.resolveMatrixAccount)({ cfg: next });
                    if (!!account.configured) return [3 /*break*/, 3];
                    return [4 /*yield*/, noteMatrixAuthHelp(prompter)];
                case 2:
                    _7.sent();
                    _7.label = 3;
                case 3:
                    envHomeserver = (_l = process.env.MATRIX_HOMESERVER) === null || _l === void 0 ? void 0 : _l.trim();
                    envUserId = (_m = process.env.MATRIX_USER_ID) === null || _m === void 0 ? void 0 : _m.trim();
                    envAccessToken = (_o = process.env.MATRIX_ACCESS_TOKEN) === null || _o === void 0 ? void 0 : _o.trim();
                    envPassword = (_p = process.env.MATRIX_PASSWORD) === null || _p === void 0 ? void 0 : _p.trim();
                    envReady = Boolean(envHomeserver && (envAccessToken || (envUserId && envPassword)));
                    if (!(envReady &&
                        !existing.homeserver &&
                        !existing.userId &&
                        !existing.accessToken &&
                        !existing.password)) return [3 /*break*/, 7];
                    return [4 /*yield*/, prompter.confirm({
                            message: "Matrix env vars detected. Use env values?",
                            initialValue: true,
                        })];
                case 4:
                    useEnv = _7.sent();
                    if (!useEnv) return [3 /*break*/, 7];
                    next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { matrix: __assign(__assign({}, (_q = next.channels) === null || _q === void 0 ? void 0 : _q.matrix), { enabled: true }) }) });
                    if (!forceAllowFrom) return [3 /*break*/, 6];
                    return [4 /*yield*/, promptMatrixAllowFrom({ cfg: next, prompter: prompter })];
                case 5:
                    next = _7.sent();
                    _7.label = 6;
                case 6: return [2 /*return*/, { cfg: next }];
                case 7:
                    _c = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Matrix homeserver URL",
                            initialValue: (_r = existing.homeserver) !== null && _r !== void 0 ? _r : envHomeserver,
                            validate: function (value) {
                                var raw = String(value !== null && value !== void 0 ? value : "").trim();
                                if (!raw) {
                                    return "Required";
                                }
                                if (!/^https?:\/\//i.test(raw)) {
                                    return "Use a full URL (https://...)";
                                }
                                return undefined;
                            },
                        })];
                case 8:
                    homeserver = _c.apply(void 0, [_7.sent()]).trim();
                    accessToken = (_s = existing.accessToken) !== null && _s !== void 0 ? _s : "";
                    password = (_t = existing.password) !== null && _t !== void 0 ? _t : "";
                    userId = (_u = existing.userId) !== null && _u !== void 0 ? _u : "";
                    if (!(accessToken || password)) return [3 /*break*/, 10];
                    return [4 /*yield*/, prompter.confirm({
                            message: "Matrix credentials already configured. Keep them?",
                            initialValue: true,
                        })];
                case 9:
                    keep = _7.sent();
                    if (!keep) {
                        accessToken = "";
                        password = "";
                        userId = "";
                    }
                    _7.label = 10;
                case 10:
                    if (!(!accessToken && !password)) return [3 /*break*/, 16];
                    return [4 /*yield*/, prompter.select({
                            message: "Matrix auth method",
                            options: [
                                { value: "token", label: "Access token (user ID fetched automatically)" },
                                { value: "password", label: "Password (requires user ID)" },
                            ],
                        })];
                case 11:
                    authMode = _7.sent();
                    if (!(authMode === "token")) return [3 /*break*/, 13];
                    _d = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Matrix access token",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 12:
                    accessToken = _d.apply(void 0, [_7.sent()]).trim();
                    // With access token, we can fetch the userId automatically - don't prompt for it
                    // The client.ts will use whoami() to get it
                    userId = "";
                    return [3 /*break*/, 16];
                case 13:
                    _e = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Matrix user ID",
                            initialValue: (_v = existing.userId) !== null && _v !== void 0 ? _v : envUserId,
                            validate: function (value) {
                                var raw = String(value !== null && value !== void 0 ? value : "").trim();
                                if (!raw) {
                                    return "Required";
                                }
                                if (!raw.startsWith("@")) {
                                    return "Matrix user IDs should start with @";
                                }
                                if (!raw.includes(":")) {
                                    return "Matrix user IDs should include a server (:server)";
                                }
                                return undefined;
                            },
                        })];
                case 14:
                    // Password auth requires user ID upfront
                    userId = _e.apply(void 0, [_7.sent()]).trim();
                    _f = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Matrix password",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 15:
                    password = _f.apply(void 0, [_7.sent()]).trim();
                    _7.label = 16;
                case 16:
                    _g = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Matrix device name (optional)",
                            initialValue: (_w = existing.deviceName) !== null && _w !== void 0 ? _w : "OpenClaw Gateway",
                        })];
                case 17:
                    deviceName = _g.apply(void 0, [_7.sent()]).trim();
                    return [4 /*yield*/, prompter.confirm({
                            message: "Enable end-to-end encryption (E2EE)?",
                            initialValue: (_x = existing.encryption) !== null && _x !== void 0 ? _x : false,
                        })];
                case 18:
                    enableEncryption = _7.sent();
                    next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { matrix: __assign(__assign({}, (_y = next.channels) === null || _y === void 0 ? void 0 : _y.matrix), { enabled: true, homeserver: homeserver, userId: userId || undefined, accessToken: accessToken || undefined, password: password || undefined, deviceName: deviceName || undefined, encryption: enableEncryption || undefined }) }) });
                    if (!forceAllowFrom) return [3 /*break*/, 20];
                    return [4 /*yield*/, promptMatrixAllowFrom({ cfg: next, prompter: prompter })];
                case 19:
                    next = _7.sent();
                    _7.label = 20;
                case 20:
                    existingGroups = (_1 = (_0 = (_z = next.channels) === null || _z === void 0 ? void 0 : _z.matrix) === null || _0 === void 0 ? void 0 : _0.groups) !== null && _1 !== void 0 ? _1 : (_3 = (_2 = next.channels) === null || _2 === void 0 ? void 0 : _2.matrix) === null || _3 === void 0 ? void 0 : _3.rooms;
                    return [4 /*yield*/, (0, plugin_sdk_1.promptChannelAccessConfig)({
                            prompter: prompter,
                            label: "Matrix rooms",
                            currentPolicy: (_6 = (_5 = (_4 = next.channels) === null || _4 === void 0 ? void 0 : _4.matrix) === null || _5 === void 0 ? void 0 : _5.groupPolicy) !== null && _6 !== void 0 ? _6 : "allowlist",
                            currentEntries: Object.keys(existingGroups !== null && existingGroups !== void 0 ? existingGroups : {}),
                            placeholder: "!roomId:server, #alias:server, Project Room",
                            updatePrompt: Boolean(existingGroups),
                        })];
                case 21:
                    accessConfig = _7.sent();
                    if (!accessConfig) return [3 /*break*/, 33];
                    if (!(accessConfig.policy !== "allowlist")) return [3 /*break*/, 22];
                    next = setMatrixGroupPolicy(next, accessConfig.policy);
                    return [3 /*break*/, 33];
                case 22:
                    roomKeys = accessConfig.entries;
                    if (!(accessConfig.entries.length > 0)) return [3 /*break*/, 32];
                    _7.label = 23;
                case 23:
                    _7.trys.push([23, 30, , 32]);
                    resolvedIds = [];
                    unresolved = [];
                    _loop_1 = function (entry) {
                        var trimmed, cleaned, matches, exact, best;
                        return __generator(this, function (_8) {
                            switch (_8.label) {
                                case 0:
                                    trimmed = entry.trim();
                                    if (!trimmed) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    cleaned = trimmed.replace(/^(room|channel):/i, "").trim();
                                    if (cleaned.startsWith("!") && cleaned.includes(":")) {
                                        resolvedIds.push(cleaned);
                                        return [2 /*return*/, "continue"];
                                    }
                                    return [4 /*yield*/, (0, directory_live_js_1.listMatrixDirectoryGroupsLive)({
                                            cfg: next,
                                            query: trimmed,
                                            limit: 10,
                                        })];
                                case 1:
                                    matches = _8.sent();
                                    exact = matches.find(function (match) { var _a; return ((_a = match.name) !== null && _a !== void 0 ? _a : "").toLowerCase() === trimmed.toLowerCase(); });
                                    best = exact !== null && exact !== void 0 ? exact : matches[0];
                                    if (best === null || best === void 0 ? void 0 : best.id) {
                                        resolvedIds.push(best.id);
                                    }
                                    else {
                                        unresolved.push(entry);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _h = accessConfig.entries;
                    _7.label = 24;
                case 24:
                    if (!(_i < _h.length)) return [3 /*break*/, 27];
                    entry = _h[_i];
                    return [5 /*yield**/, _loop_1(entry)];
                case 25:
                    _7.sent();
                    _7.label = 26;
                case 26:
                    _i++;
                    return [3 /*break*/, 24];
                case 27:
                    roomKeys = __spreadArray(__spreadArray([], resolvedIds, true), unresolved.map(function (entry) { return entry.trim(); }).filter(Boolean), true);
                    if (!(resolvedIds.length > 0 || unresolved.length > 0)) return [3 /*break*/, 29];
                    return [4 /*yield*/, prompter.note([
                            resolvedIds.length > 0 ? "Resolved: ".concat(resolvedIds.join(", ")) : undefined,
                            unresolved.length > 0
                                ? "Unresolved (kept as typed): ".concat(unresolved.join(", "))
                                : undefined,
                        ]
                            .filter(Boolean)
                            .join("\n"), "Matrix rooms")];
                case 28:
                    _7.sent();
                    _7.label = 29;
                case 29: return [3 /*break*/, 32];
                case 30:
                    err_1 = _7.sent();
                    return [4 /*yield*/, prompter.note("Room lookup failed; keeping entries as typed. ".concat(String(err_1)), "Matrix rooms")];
                case 31:
                    _7.sent();
                    return [3 /*break*/, 32];
                case 32:
                    next = setMatrixGroupPolicy(next, "allowlist");
                    next = setMatrixGroupRooms(next, roomKeys);
                    _7.label = 33;
                case 33: return [2 /*return*/, { cfg: next }];
            }
        });
    }); },
    dmPolicy: dmPolicy,
    disable: function (cfg) {
        var _a;
        return (__assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { matrix: __assign(__assign({}, (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.matrix), { enabled: false }) }) }));
    },
};
