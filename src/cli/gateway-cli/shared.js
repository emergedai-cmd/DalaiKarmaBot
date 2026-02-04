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
exports.toOptionString = void 0;
exports.parsePort = parsePort;
exports.describeUnknownError = describeUnknownError;
exports.extractGatewayMiskeys = extractGatewayMiskeys;
exports.renderGatewayServiceStopHints = renderGatewayServiceStopHints;
exports.maybeExplainGatewayServiceStop = maybeExplainGatewayServiceStop;
var constants_js_1 = require("../../daemon/constants.js");
var service_js_1 = require("../../daemon/service.js");
var runtime_js_1 = require("../../runtime.js");
var command_format_js_1 = require("../command-format.js");
function parsePort(raw) {
    if (raw === undefined || raw === null) {
        return null;
    }
    var value = typeof raw === "string"
        ? raw
        : typeof raw === "number" || typeof raw === "bigint"
            ? raw.toString()
            : null;
    if (value === null) {
        return null;
    }
    var parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return null;
    }
    return parsed;
}
var toOptionString = function (value) {
    if (typeof value === "string") {
        return value;
    }
    if (typeof value === "number" || typeof value === "bigint") {
        return value.toString();
    }
    return undefined;
};
exports.toOptionString = toOptionString;
function describeUnknownError(err) {
    if (err instanceof Error) {
        return err.message;
    }
    if (typeof err === "string") {
        return err;
    }
    if (typeof err === "number" || typeof err === "bigint") {
        return err.toString();
    }
    if (typeof err === "boolean") {
        return err ? "true" : "false";
    }
    if (err && typeof err === "object") {
        if ("message" in err && typeof err.message === "string") {
            return err.message;
        }
        try {
            return JSON.stringify(err);
        }
        catch (_a) {
            return "Unknown error";
        }
    }
    return "Unknown error";
}
function extractGatewayMiskeys(parsed) {
    if (!parsed || typeof parsed !== "object") {
        return { hasGatewayToken: false, hasRemoteToken: false };
    }
    var gateway = parsed.gateway;
    if (!gateway || typeof gateway !== "object") {
        return { hasGatewayToken: false, hasRemoteToken: false };
    }
    var hasGatewayToken = "token" in gateway;
    var remote = gateway.remote;
    var hasRemoteToken = remote && typeof remote === "object" ? "token" in remote : false;
    return { hasGatewayToken: hasGatewayToken, hasRemoteToken: hasRemoteToken };
}
function renderGatewayServiceStopHints(env) {
    if (env === void 0) { env = process.env; }
    var profile = env.OPENCLAW_PROFILE;
    switch (process.platform) {
        case "darwin":
            return [
                "Tip: ".concat((0, command_format_js_1.formatCliCommand)("openclaw gateway stop")),
                "Or: launchctl bootout gui/$UID/".concat((0, constants_js_1.resolveGatewayLaunchAgentLabel)(profile)),
            ];
        case "linux":
            return [
                "Tip: ".concat((0, command_format_js_1.formatCliCommand)("openclaw gateway stop")),
                "Or: systemctl --user stop ".concat((0, constants_js_1.resolveGatewaySystemdServiceName)(profile), ".service"),
            ];
        case "win32":
            return [
                "Tip: ".concat((0, command_format_js_1.formatCliCommand)("openclaw gateway stop")),
                "Or: schtasks /End /TN \"".concat((0, constants_js_1.resolveGatewayWindowsTaskName)(profile), "\""),
            ];
        default:
            return ["Tip: ".concat((0, command_format_js_1.formatCliCommand)("openclaw gateway stop"))];
    }
}
function maybeExplainGatewayServiceStop() {
    return __awaiter(this, void 0, void 0, function () {
        var service, loaded, _a, _i, _b, hint;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    service = (0, service_js_1.resolveGatewayService)();
                    loaded = null;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 2:
                    loaded = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _c.sent();
                    loaded = null;
                    return [3 /*break*/, 4];
                case 4:
                    if (loaded === false) {
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.error(loaded
                        ? "Gateway service appears ".concat(service.loadedText, ". Stop it first.")
                        : "Gateway service status unknown; if supervised, stop it first.");
                    for (_i = 0, _b = renderGatewayServiceStopHints(); _i < _b.length; _i++) {
                        hint = _b[_i];
                        runtime_js_1.defaultRuntime.error(hint);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
