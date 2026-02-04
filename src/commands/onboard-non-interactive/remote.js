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
exports.runNonInteractiveOnboardingRemote = runNonInteractiveOnboardingRemote;
var command_format_js_1 = require("../../cli/command-format.js");
var config_js_1 = require("../../config/config.js");
var logging_js_1 = require("../../config/logging.js");
var onboard_helpers_js_1 = require("../onboard-helpers.js");
function runNonInteractiveOnboardingRemote(params) {
    return __awaiter(this, void 0, void 0, function () {
        var opts, runtime, baseConfig, mode, remoteUrl, nextConfig, payload;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    opts = params.opts, runtime = params.runtime, baseConfig = params.baseConfig;
                    mode = "remote";
                    remoteUrl = (_a = opts.remoteUrl) === null || _a === void 0 ? void 0 : _a.trim();
                    if (!remoteUrl) {
                        runtime.error("Missing --remote-url for remote mode.");
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    nextConfig = __assign(__assign({}, baseConfig), { gateway: __assign(__assign({}, baseConfig.gateway), { mode: "remote", remote: {
                                url: remoteUrl,
                                token: ((_b = opts.remoteToken) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                            } }) });
                    nextConfig = (0, onboard_helpers_js_1.applyWizardMetadata)(nextConfig, { command: "onboard", mode: mode });
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(nextConfig)];
                case 1:
                    _c.sent();
                    (0, logging_js_1.logConfigUpdated)(runtime);
                    payload = {
                        mode: mode,
                        remoteUrl: remoteUrl,
                        auth: opts.remoteToken ? "token" : "none",
                    };
                    if (opts.json) {
                        runtime.log(JSON.stringify(payload, null, 2));
                    }
                    else {
                        runtime.log("Remote gateway: ".concat(remoteUrl));
                        runtime.log("Auth: ".concat(payload.auth));
                        runtime.log("Tip: run `".concat((0, command_format_js_1.formatCliCommand)("openclaw configure --section web"), "` to store your Brave API key for web_search. Docs: https://docs.openclaw.ai/tools/web"));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
