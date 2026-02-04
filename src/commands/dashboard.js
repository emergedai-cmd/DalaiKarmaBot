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
exports.dashboardCommand = dashboardCommand;
var config_js_1 = require("../config/config.js");
var clipboard_js_1 = require("../infra/clipboard.js");
var runtime_js_1 = require("../runtime.js");
var onboard_helpers_js_1 = require("./onboard-helpers.js");
function dashboardCommand() {
    return __awaiter(this, arguments, void 0, function (runtime, options) {
        var snapshot, cfg, port, bind, basePath, customBindHost, token, links, authedUrl, copied, opened, hint, browserSupport;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        if (options === void 0) { options = {}; }
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 1:
                    snapshot = _k.sent();
                    cfg = snapshot.valid ? snapshot.config : {};
                    port = (0, config_js_1.resolveGatewayPort)(cfg);
                    bind = (_b = (_a = cfg.gateway) === null || _a === void 0 ? void 0 : _a.bind) !== null && _b !== void 0 ? _b : "loopback";
                    basePath = (_d = (_c = cfg.gateway) === null || _c === void 0 ? void 0 : _c.controlUi) === null || _d === void 0 ? void 0 : _d.basePath;
                    customBindHost = (_e = cfg.gateway) === null || _e === void 0 ? void 0 : _e.customBindHost;
                    token = (_j = (_h = (_g = (_f = cfg.gateway) === null || _f === void 0 ? void 0 : _f.auth) === null || _g === void 0 ? void 0 : _g.token) !== null && _h !== void 0 ? _h : process.env.OPENCLAW_GATEWAY_TOKEN) !== null && _j !== void 0 ? _j : "";
                    links = (0, onboard_helpers_js_1.resolveControlUiLinks)({
                        port: port,
                        bind: bind,
                        customBindHost: customBindHost,
                        basePath: basePath,
                    });
                    authedUrl = token ? "".concat(links.httpUrl, "?token=").concat(encodeURIComponent(token)) : links.httpUrl;
                    runtime.log("Dashboard URL: ".concat(authedUrl));
                    return [4 /*yield*/, (0, clipboard_js_1.copyToClipboard)(authedUrl).catch(function () { return false; })];
                case 2:
                    copied = _k.sent();
                    runtime.log(copied ? "Copied to clipboard." : "Copy to clipboard unavailable.");
                    opened = false;
                    if (!!options.noOpen) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, onboard_helpers_js_1.detectBrowserOpenSupport)()];
                case 3:
                    browserSupport = _k.sent();
                    if (!browserSupport.ok) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, onboard_helpers_js_1.openUrl)(authedUrl)];
                case 4:
                    opened = _k.sent();
                    _k.label = 5;
                case 5:
                    if (!opened) {
                        hint = (0, onboard_helpers_js_1.formatControlUiSshHint)({
                            port: port,
                            basePath: basePath,
                            token: token || undefined,
                        });
                    }
                    return [3 /*break*/, 7];
                case 6:
                    hint = "Browser launch disabled (--no-open). Use the URL above.";
                    _k.label = 7;
                case 7:
                    if (opened) {
                        runtime.log("Opened in your browser. Keep that tab to control OpenClaw.");
                    }
                    else if (hint) {
                        runtime.log(hint);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
