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
exports.ensureMediaHosted = ensureMediaHosted;
var promises_1 = require("node:fs/promises");
var command_format_js_1 = require("../cli/command-format.js");
var ports_js_1 = require("../infra/ports.js");
var tailscale_js_1 = require("../infra/tailscale.js");
var logger_js_1 = require("../logger.js");
var runtime_js_1 = require("../runtime.js");
var server_js_1 = require("./server.js");
var store_js_1 = require("./store.js");
var DEFAULT_PORT = 42873;
var TTL_MS = 2 * 60 * 1000;
var mediaServer = null;
function ensureMediaHosted(source_1) {
    return __awaiter(this, arguments, void 0, function (source, opts) {
        var port, runtime, saved, hostname, needsServerStart, url;
        var _a, _b, _c;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    port = (_a = opts.port) !== null && _a !== void 0 ? _a : DEFAULT_PORT;
                    runtime = (_b = opts.runtime) !== null && _b !== void 0 ? _b : runtime_js_1.defaultRuntime;
                    return [4 /*yield*/, (0, store_js_1.saveMediaSource)(source)];
                case 1:
                    saved = _d.sent();
                    return [4 /*yield*/, (0, tailscale_js_1.getTailnetHostname)()];
                case 2:
                    hostname = _d.sent();
                    return [4 /*yield*/, isPortFree(port)];
                case 3:
                    needsServerStart = _d.sent();
                    if (!(needsServerStart && !opts.startServer)) return [3 /*break*/, 5];
                    return [4 /*yield*/, promises_1.default.rm(saved.path).catch(function () { })];
                case 4:
                    _d.sent();
                    throw new Error("Media hosting requires the webhook/Funnel server. Start `".concat((0, command_format_js_1.formatCliCommand)("openclaw webhook"), "`/`").concat((0, command_format_js_1.formatCliCommand)("openclaw up"), "` or re-run with --serve-media."));
                case 5:
                    if (!(needsServerStart && opts.startServer)) return [3 /*break*/, 7];
                    if (!!mediaServer) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, server_js_1.startMediaServer)(port, TTL_MS, runtime)];
                case 6:
                    mediaServer = _d.sent();
                    (0, logger_js_1.logInfo)("\uD83E\uDD9E Started temporary media host on http://localhost:".concat(port, "/media/:id (TTL ").concat(TTL_MS / 1000, "s)"), runtime);
                    (_c = mediaServer.unref) === null || _c === void 0 ? void 0 : _c.call(mediaServer);
                    _d.label = 7;
                case 7:
                    url = "https://".concat(hostname, "/media/").concat(saved.id);
                    return [2 /*return*/, { url: url, id: saved.id, size: saved.size }];
            }
        });
    });
}
function isPortFree(port) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, ports_js_1.ensurePortAvailable)(port)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    err_1 = _a.sent();
                    if (err_1 instanceof ports_js_1.PortInUseError) {
                        return [2 /*return*/, false];
                    }
                    throw err_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
