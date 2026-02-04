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
exports.createGatewayPluginRequestHandler = createGatewayPluginRequestHandler;
function createGatewayPluginRequestHandler(params) {
    var _this = this;
    var registry = params.registry, log = params.log;
    return function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var routes, handlers, url_1, route, err_1, _i, handlers_1, entry, handled, err_2;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    routes = (_a = registry.httpRoutes) !== null && _a !== void 0 ? _a : [];
                    handlers = (_b = registry.httpHandlers) !== null && _b !== void 0 ? _b : [];
                    if (routes.length === 0 && handlers.length === 0) {
                        return [2 /*return*/, false];
                    }
                    if (!(routes.length > 0)) return [3 /*break*/, 4];
                    url_1 = new URL((_c = req.url) !== null && _c !== void 0 ? _c : "/", "http://localhost");
                    route = routes.find(function (entry) { return entry.path === url_1.pathname; });
                    if (!route) return [3 /*break*/, 4];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, route.handler(req, res)];
                case 2:
                    _e.sent();
                    return [2 /*return*/, true];
                case 3:
                    err_1 = _e.sent();
                    log.warn("plugin http route failed (".concat((_d = route.pluginId) !== null && _d !== void 0 ? _d : "unknown", "): ").concat(String(err_1)));
                    if (!res.headersSent) {
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "text/plain; charset=utf-8");
                        res.end("Internal Server Error");
                    }
                    return [2 /*return*/, true];
                case 4:
                    _i = 0, handlers_1 = handlers;
                    _e.label = 5;
                case 5:
                    if (!(_i < handlers_1.length)) return [3 /*break*/, 10];
                    entry = handlers_1[_i];
                    _e.label = 6;
                case 6:
                    _e.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, entry.handler(req, res)];
                case 7:
                    handled = _e.sent();
                    if (handled) {
                        return [2 /*return*/, true];
                    }
                    return [3 /*break*/, 9];
                case 8:
                    err_2 = _e.sent();
                    log.warn("plugin http handler failed (".concat(entry.pluginId, "): ").concat(String(err_2)));
                    if (!res.headersSent) {
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "text/plain; charset=utf-8");
                        res.end("Internal Server Error");
                    }
                    return [2 /*return*/, true];
                case 9:
                    _i++;
                    return [3 /*break*/, 5];
                case 10: return [2 /*return*/, false];
            }
        });
    }); };
}
