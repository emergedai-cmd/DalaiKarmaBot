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
exports.ensureSystemdUserLingerInteractive = ensureSystemdUserLingerInteractive;
exports.ensureSystemdUserLingerNonInteractive = ensureSystemdUserLingerNonInteractive;
var systemd_js_1 = require("../daemon/systemd.js");
var note_js_1 = require("../terminal/note.js");
function ensureSystemdUserLingerInteractive(params) {
    return __awaiter(this, void 0, void 0, function () {
        var env, prompter, title, status, reason, actionNote, ok, resultNoSudo, result;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (process.platform !== "linux") {
                        return [2 /*return*/];
                    }
                    if (params.prompt === false) {
                        return [2 /*return*/];
                    }
                    env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
                    prompter = (_b = params.prompter) !== null && _b !== void 0 ? _b : { note: note_js_1.note };
                    title = (_c = params.title) !== null && _c !== void 0 ? _c : "Systemd";
                    return [4 /*yield*/, (0, systemd_js_1.isSystemdUserServiceAvailable)()];
                case 1:
                    if (!!(_e.sent())) return [3 /*break*/, 3];
                    return [4 /*yield*/, prompter.note("Systemd user services are unavailable. Skipping lingering checks.", title)];
                case 2:
                    _e.sent();
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, (0, systemd_js_1.readSystemdUserLingerStatus)(env)];
                case 4:
                    status = _e.sent();
                    if (!!status) return [3 /*break*/, 6];
                    return [4 /*yield*/, prompter.note("Unable to read loginctl linger status. Ensure systemd + loginctl are available.", title)];
                case 5:
                    _e.sent();
                    return [2 /*return*/];
                case 6:
                    if (status.linger === "yes") {
                        return [2 /*return*/];
                    }
                    reason = (_d = params.reason) !== null && _d !== void 0 ? _d : "Systemd user services stop when you log out or go idle, which kills the Gateway.";
                    actionNote = params.requireConfirm
                        ? "We can enable lingering now (may require sudo; writes /var/lib/systemd/linger)."
                        : "Enabling lingering now (may require sudo; writes /var/lib/systemd/linger).";
                    return [4 /*yield*/, prompter.note("".concat(reason, "\n").concat(actionNote), title)];
                case 7:
                    _e.sent();
                    if (!(params.requireConfirm && prompter.confirm)) return [3 /*break*/, 10];
                    return [4 /*yield*/, prompter.confirm({
                            message: "Enable systemd lingering for ".concat(status.user, "?"),
                            initialValue: true,
                        })];
                case 8:
                    ok = _e.sent();
                    if (!!ok) return [3 /*break*/, 10];
                    return [4 /*yield*/, prompter.note("Without lingering, the Gateway will stop when you log out.", title)];
                case 9:
                    _e.sent();
                    return [2 /*return*/];
                case 10: return [4 /*yield*/, (0, systemd_js_1.enableSystemdUserLinger)({
                        env: env,
                        user: status.user,
                    })];
                case 11:
                    resultNoSudo = _e.sent();
                    if (!resultNoSudo.ok) return [3 /*break*/, 13];
                    return [4 /*yield*/, prompter.note("Enabled systemd lingering for ".concat(status.user, "."), title)];
                case 12:
                    _e.sent();
                    return [2 /*return*/];
                case 13: return [4 /*yield*/, (0, systemd_js_1.enableSystemdUserLinger)({
                        env: env,
                        user: status.user,
                        sudoMode: "prompt",
                    })];
                case 14:
                    result = _e.sent();
                    if (!result.ok) return [3 /*break*/, 16];
                    return [4 /*yield*/, prompter.note("Enabled systemd lingering for ".concat(status.user, "."), title)];
                case 15:
                    _e.sent();
                    return [2 /*return*/];
                case 16:
                    params.runtime.error("Failed to enable lingering: ".concat(result.stderr || result.stdout || "unknown error"));
                    return [4 /*yield*/, prompter.note("Run manually: sudo loginctl enable-linger ".concat(status.user), title)];
                case 17:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function ensureSystemdUserLingerNonInteractive(params) {
    return __awaiter(this, void 0, void 0, function () {
        var env, status, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (process.platform !== "linux") {
                        return [2 /*return*/];
                    }
                    env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
                    return [4 /*yield*/, (0, systemd_js_1.isSystemdUserServiceAvailable)()];
                case 1:
                    if (!(_b.sent())) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, systemd_js_1.readSystemdUserLingerStatus)(env)];
                case 2:
                    status = _b.sent();
                    if (!status || status.linger === "yes") {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, systemd_js_1.enableSystemdUserLinger)({
                            env: env,
                            user: status.user,
                            sudoMode: "non-interactive",
                        })];
                case 3:
                    result = _b.sent();
                    if (result.ok) {
                        params.runtime.log("Enabled systemd lingering for ".concat(status.user, "."));
                        return [2 /*return*/];
                    }
                    params.runtime.log("Systemd lingering is disabled for ".concat(status.user, ". Run: sudo loginctl enable-linger ").concat(status.user));
                    return [2 /*return*/];
            }
        });
    });
}
