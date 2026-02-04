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
var web_tools_js_1 = require("../src/agents/tools/web-tools.js");
var DEFAULT_URLS = [
    "https://example.com/",
    "https://news.ycombinator.com/",
    "https://www.reddit.com/r/javascript/",
    "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent",
    "https://httpbin.org/html",
];
var urls = process.argv.slice(2);
var targets = urls.length > 0 ? urls : DEFAULT_URLS;
function runFetch(url, readability) {
    return __awaiter(this, void 0, void 0, function () {
        var tool, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!readability) {
                        throw new Error("Basic extraction removed. Set readability=true or enable Firecrawl.");
                    }
                    tool = (0, web_tools_js_1.createWebFetchTool)({
                        config: {
                            tools: {
                                web: { fetch: { readability: readability, cacheTtlMinutes: 0, firecrawl: { enabled: false } } },
                            },
                        },
                        sandboxed: false,
                    });
                    if (!tool) {
                        throw new Error("web_fetch tool is disabled");
                    }
                    return [4 /*yield*/, tool.execute("test", { url: url, extractMode: "markdown" })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.details];
            }
        });
    });
}
function truncate(value, max) {
    if (max === void 0) { max = 160; }
    if (!value) {
        return "";
    }
    return value.length > max ? "".concat(value.slice(0, max), "\u2026") : value;
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, targets_1, url, readable;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _i = 0, targets_1 = targets;
                    _d.label = 1;
                case 1:
                    if (!(_i < targets_1.length)) return [3 /*break*/, 4];
                    url = targets_1[_i];
                    console.log("\n=== ".concat(url));
                    return [4 /*yield*/, runFetch(url, true)];
                case 2:
                    readable = _d.sent();
                    console.log("readability: ".concat((_a = readable.extractor) !== null && _a !== void 0 ? _a : "unknown", " len=").concat((_b = readable.length) !== null && _b !== void 0 ? _b : 0, " title=").concat(truncate((_c = readable.title) !== null && _c !== void 0 ? _c : "", 80)));
                    if (readable.text) {
                        console.log("readability sample: ".concat(truncate(readable.text)));
                    }
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
run().catch(function (error) {
    console.error(error);
    process.exit(1);
});
