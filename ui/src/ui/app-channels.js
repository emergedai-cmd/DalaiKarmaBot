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
exports.handleWhatsAppStart = handleWhatsAppStart;
exports.handleWhatsAppWait = handleWhatsAppWait;
exports.handleWhatsAppLogout = handleWhatsAppLogout;
exports.handleChannelConfigSave = handleChannelConfigSave;
exports.handleChannelConfigReload = handleChannelConfigReload;
exports.handleNostrProfileEdit = handleNostrProfileEdit;
exports.handleNostrProfileCancel = handleNostrProfileCancel;
exports.handleNostrProfileFieldChange = handleNostrProfileFieldChange;
exports.handleNostrProfileToggleAdvanced = handleNostrProfileToggleAdvanced;
exports.handleNostrProfileSave = handleNostrProfileSave;
exports.handleNostrProfileImport = handleNostrProfileImport;
var channels_1 = require("./controllers/channels");
var config_1 = require("./controllers/config");
var channels_nostr_profile_form_1 = require("./views/channels.nostr-profile-form");
function handleWhatsAppStart(host, force) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, channels_1.startWhatsAppLogin)(host, force)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, channels_1.loadChannels)(host, true)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function handleWhatsAppWait(host) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, channels_1.waitWhatsAppLogin)(host)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, channels_1.loadChannels)(host, true)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function handleWhatsAppLogout(host) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, channels_1.logoutWhatsApp)(host)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, channels_1.loadChannels)(host, true)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function handleChannelConfigSave(host) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, config_1.saveConfig)(host)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, config_1.loadConfig)(host)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, channels_1.loadChannels)(host, true)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function handleChannelConfigReload(host) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, config_1.loadConfig)(host)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, channels_1.loadChannels)(host, true)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function parseValidationErrors(details) {
    if (!Array.isArray(details)) {
        return {};
    }
    var errors = {};
    for (var _i = 0, details_1 = details; _i < details_1.length; _i++) {
        var entry = details_1[_i];
        if (typeof entry !== "string") {
            continue;
        }
        var _a = entry.split(":"), rawField = _a[0], rest = _a.slice(1);
        if (!rawField || rest.length === 0) {
            continue;
        }
        var field = rawField.trim();
        var message = rest.join(":").trim();
        if (field && message) {
            errors[field] = message;
        }
    }
    return errors;
}
function resolveNostrAccountId(host) {
    var _a, _b, _c, _d, _e, _f;
    var accounts = (_c = (_b = (_a = host.channelsSnapshot) === null || _a === void 0 ? void 0 : _a.channelAccounts) === null || _b === void 0 ? void 0 : _b.nostr) !== null && _c !== void 0 ? _c : [];
    return (_f = (_e = (_d = accounts[0]) === null || _d === void 0 ? void 0 : _d.accountId) !== null && _e !== void 0 ? _e : host.nostrProfileAccountId) !== null && _f !== void 0 ? _f : "default";
}
function buildNostrProfileUrl(accountId, suffix) {
    if (suffix === void 0) { suffix = ""; }
    return "/api/channels/nostr/".concat(encodeURIComponent(accountId), "/profile").concat(suffix);
}
function handleNostrProfileEdit(host, accountId, profile) {
    host.nostrProfileAccountId = accountId;
    host.nostrProfileFormState = (0, channels_nostr_profile_form_1.createNostrProfileFormState)(profile !== null && profile !== void 0 ? profile : undefined);
}
function handleNostrProfileCancel(host) {
    host.nostrProfileFormState = null;
    host.nostrProfileAccountId = null;
}
function handleNostrProfileFieldChange(host, field, value) {
    var _a, _b;
    var state = host.nostrProfileFormState;
    if (!state) {
        return;
    }
    host.nostrProfileFormState = __assign(__assign({}, state), { values: __assign(__assign({}, state.values), (_a = {}, _a[field] = value, _a)), fieldErrors: __assign(__assign({}, state.fieldErrors), (_b = {}, _b[field] = "", _b)) });
}
function handleNostrProfileToggleAdvanced(host) {
    var state = host.nostrProfileFormState;
    if (!state) {
        return;
    }
    host.nostrProfileFormState = __assign(__assign({}, state), { showAdvanced: !state.showAdvanced });
}
function handleNostrProfileSave(host) {
    return __awaiter(this, void 0, void 0, function () {
        var state, accountId, response, data, errorMessage, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    state = host.nostrProfileFormState;
                    if (!state || state.saving) {
                        return [2 /*return*/];
                    }
                    accountId = resolveNostrAccountId(host);
                    host.nostrProfileFormState = __assign(__assign({}, state), { saving: true, error: null, success: null, fieldErrors: {} });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, fetch(buildNostrProfileUrl(accountId), {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(state.values),
                        })];
                case 2:
                    response = _b.sent();
                    return [4 /*yield*/, response.json().catch(function () { return null; })];
                case 3:
                    data = (_b.sent());
                    if (!response.ok || (data === null || data === void 0 ? void 0 : data.ok) === false || !data) {
                        errorMessage = (_a = data === null || data === void 0 ? void 0 : data.error) !== null && _a !== void 0 ? _a : "Profile update failed (".concat(response.status, ")");
                        host.nostrProfileFormState = __assign(__assign({}, state), { saving: false, error: errorMessage, success: null, fieldErrors: parseValidationErrors(data === null || data === void 0 ? void 0 : data.details) });
                        return [2 /*return*/];
                    }
                    if (!data.persisted) {
                        host.nostrProfileFormState = __assign(__assign({}, state), { saving: false, error: "Profile publish failed on all relays.", success: null });
                        return [2 /*return*/];
                    }
                    host.nostrProfileFormState = __assign(__assign({}, state), { saving: false, error: null, success: "Profile published to relays.", fieldErrors: {}, original: __assign({}, state.values) });
                    return [4 /*yield*/, (0, channels_1.loadChannels)(host, true)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _b.sent();
                    host.nostrProfileFormState = __assign(__assign({}, state), { saving: false, error: "Profile update failed: ".concat(String(err_1)), success: null });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function handleNostrProfileImport(host) {
    return __awaiter(this, void 0, void 0, function () {
        var state, accountId, response, data, errorMessage, merged, nextValues, showAdvanced, err_2;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    state = host.nostrProfileFormState;
                    if (!state || state.importing) {
                        return [2 /*return*/];
                    }
                    accountId = resolveNostrAccountId(host);
                    host.nostrProfileFormState = __assign(__assign({}, state), { importing: true, error: null, success: null });
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch(buildNostrProfileUrl(accountId, "/import"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ autoMerge: true }),
                        })];
                case 2:
                    response = _d.sent();
                    return [4 /*yield*/, response.json().catch(function () { return null; })];
                case 3:
                    data = (_d.sent());
                    if (!response.ok || (data === null || data === void 0 ? void 0 : data.ok) === false || !data) {
                        errorMessage = (_a = data === null || data === void 0 ? void 0 : data.error) !== null && _a !== void 0 ? _a : "Profile import failed (".concat(response.status, ")");
                        host.nostrProfileFormState = __assign(__assign({}, state), { importing: false, error: errorMessage, success: null });
                        return [2 /*return*/];
                    }
                    merged = (_c = (_b = data.merged) !== null && _b !== void 0 ? _b : data.imported) !== null && _c !== void 0 ? _c : null;
                    nextValues = merged ? __assign(__assign({}, state.values), merged) : state.values;
                    showAdvanced = Boolean(nextValues.banner || nextValues.website || nextValues.nip05 || nextValues.lud16);
                    host.nostrProfileFormState = __assign(__assign({}, state), { importing: false, values: nextValues, error: null, success: data.saved
                            ? "Profile imported from relays. Review and publish."
                            : "Profile imported. Review and publish.", showAdvanced: showAdvanced });
                    if (!data.saved) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, channels_1.loadChannels)(host, true)];
                case 4:
                    _d.sent();
                    _d.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_2 = _d.sent();
                    host.nostrProfileFormState = __assign(__assign({}, state), { importing: false, error: "Profile import failed: ".concat(String(err_2)), success: null });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
