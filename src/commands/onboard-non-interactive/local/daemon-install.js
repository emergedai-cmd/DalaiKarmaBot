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
exports.installGatewayDaemonNonInteractive = installGatewayDaemonNonInteractive;
var service_js_1 = require("../../../daemon/service.js");
var systemd_js_1 = require("../../../daemon/systemd.js");
var daemon_install_helpers_js_1 = require("../../daemon-install-helpers.js");
var daemon_runtime_js_1 = require("../../daemon-runtime.js");
var systemd_linger_js_1 = require("../../systemd-linger.js");
function installGatewayDaemonNonInteractive(params) {
    return __awaiter(this, void 0, void 0, function () {
        var opts, runtime, port, gatewayToken, daemonRuntimeRaw, systemdAvailable, _a, service, _b, programArguments, workingDirectory, environment, err_1;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    opts = params.opts, runtime = params.runtime, port = params.port, gatewayToken = params.gatewayToken;
                    if (!opts.installDaemon) {
                        return [2 /*return*/];
                    }
                    daemonRuntimeRaw = (_c = opts.daemonRuntime) !== null && _c !== void 0 ? _c : daemon_runtime_js_1.DEFAULT_GATEWAY_DAEMON_RUNTIME;
                    if (!(process.platform === "linux")) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, systemd_js_1.isSystemdUserServiceAvailable)()];
                case 1:
                    _a = _d.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = true;
                    _d.label = 3;
                case 3:
                    systemdAvailable = _a;
                    if (process.platform === "linux" && !systemdAvailable) {
                        runtime.log("Systemd user services are unavailable; skipping service install.");
                        return [2 /*return*/];
                    }
                    if (!(0, daemon_runtime_js_1.isGatewayDaemonRuntime)(daemonRuntimeRaw)) {
                        runtime.error("Invalid --daemon-runtime (use node or bun)");
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    service = (0, service_js_1.resolveGatewayService)();
                    return [4 /*yield*/, (0, daemon_install_helpers_js_1.buildGatewayInstallPlan)({
                            env: process.env,
                            port: port,
                            token: gatewayToken,
                            runtime: daemonRuntimeRaw,
                            warn: function (message) { return runtime.log(message); },
                            config: params.nextConfig,
                        })];
                case 4:
                    _b = _d.sent(), programArguments = _b.programArguments, workingDirectory = _b.workingDirectory, environment = _b.environment;
                    _d.label = 5;
                case 5:
                    _d.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, service.install({
                            env: process.env,
                            stdout: process.stdout,
                            programArguments: programArguments,
                            workingDirectory: workingDirectory,
                            environment: environment,
                        })];
                case 6:
                    _d.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _d.sent();
                    runtime.error("Gateway service install failed: ".concat(String(err_1)));
                    runtime.log((0, daemon_install_helpers_js_1.gatewayInstallErrorHint)());
                    return [2 /*return*/];
                case 8: return [4 /*yield*/, (0, systemd_linger_js_1.ensureSystemdUserLingerNonInteractive)({ runtime: runtime })];
                case 9:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
}
