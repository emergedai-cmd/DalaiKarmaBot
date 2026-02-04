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
var vitest_1 = require("vitest");
vitest_1.vi.mock("./config.js", function () { return ({
    readLoggingConfig: function () { return undefined; },
}); });
vitest_1.vi.mock("./logger.js", function () { return ({
    getLogger: function () { return ({
        trace: function () { },
        debug: function () { },
        info: function () { },
        warn: function () { },
        error: function () { },
        fatal: function () { },
    }); },
}); });
var loadConfigCalls = 0;
vitest_1.vi.mock("node:module", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("node:module")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, Object.assign({}, actual, {
                        createRequire: function (url) {
                            var realRequire = actual.createRequire(url);
                            return function (specifier) {
                                if (specifier.endsWith("config.js")) {
                                    return {
                                        loadConfig: function () {
                                            loadConfigCalls += 1;
                                            if (loadConfigCalls > 5) {
                                                return {};
                                            }
                                            console.error("config load failed");
                                            return {};
                                        },
                                    };
                                }
                                return realRequire(specifier);
                            };
                        },
                    })];
        }
    });
}); });
var originalIsTty;
var snapshot;
(0, vitest_1.beforeEach)(function () {
    loadConfigCalls = 0;
    vitest_1.vi.resetModules();
    snapshot = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error,
        debug: console.debug,
        trace: console.trace,
    };
    originalIsTty = process.stdout.isTTY;
    Object.defineProperty(process.stdout, "isTTY", { value: false, configurable: true });
});
(0, vitest_1.afterEach)(function () {
    console.log = snapshot.log;
    console.info = snapshot.info;
    console.warn = snapshot.warn;
    console.error = snapshot.error;
    console.debug = snapshot.debug;
    console.trace = snapshot.trace;
    Object.defineProperty(process.stdout, "isTTY", { value: originalIsTty, configurable: true });
    vitest_1.vi.restoreAllMocks();
});
function loadLogging() {
    return __awaiter(this, void 0, void 0, function () {
        var logging, state;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../logging.js"); })];
                case 1:
                    logging = _a.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./state.js"); })];
                case 2:
                    state = _a.sent();
                    state.loggingState.cachedConsoleSettings = null;
                    return [2 /*return*/, { logging: logging, state: state }];
            }
        });
    });
}
(0, vitest_1.describe)("getConsoleSettings", function () {
    (0, vitest_1.it)("does not recurse when loadConfig logs during resolution", function () { return __awaiter(void 0, void 0, void 0, function () {
        var logging, getConsoleSettings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadLogging()];
                case 1:
                    logging = (_a.sent()).logging;
                    logging.setConsoleTimestampPrefix(true);
                    logging.enableConsoleCapture();
                    getConsoleSettings = logging.getConsoleSettings;
                    getConsoleSettings();
                    (0, vitest_1.expect)(loadConfigCalls).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips config fallback during re-entrant resolution", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, logging, state;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, loadLogging()];
                case 1:
                    _a = _b.sent(), logging = _a.logging, state = _a.state;
                    state.loggingState.resolvingConsoleSettings = true;
                    logging.setConsoleTimestampPrefix(true);
                    logging.enableConsoleCapture();
                    logging.getConsoleSettings();
                    (0, vitest_1.expect)(loadConfigCalls).toBe(0);
                    state.loggingState.resolvingConsoleSettings = false;
                    return [2 /*return*/];
            }
        });
    }); });
});
