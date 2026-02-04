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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var web_tools_js_1 = require("../src/agents/tools/web-tools.js");
var DEFAULT_URLS = [
    "https://en.wikipedia.org/wiki/Web_scraping",
    "https://news.ycombinator.com/",
    "https://www.apple.com/iphone/",
    "https://www.nytimes.com/",
    "https://www.reddit.com/r/javascript/",
];
var urls = process.argv.slice(2);
var targets = urls.length > 0 ? urls : DEFAULT_URLS;
var apiKey = process.env.FIRECRAWL_API_KEY;
var baseUrl = (_a = process.env.FIRECRAWL_BASE_URL) !== null && _a !== void 0 ? _a : "https://api.firecrawl.dev";
var userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
var timeoutMs = 30000;
function truncate(value, max) {
    if (max === void 0) { max = 180; }
    if (!value) {
        return "";
    }
    return value.length > max ? "".concat(value.slice(0, max), "\u2026") : value;
}
function fetchHtml(url) {
    return __awaiter(this, void 0, void 0, function () {
        var controller, timer, res, contentType, body;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    controller = new AbortController();
                    timer = setTimeout(function () { return controller.abort(); }, timeoutMs);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 4, 5]);
                    return [4 /*yield*/, fetch(url, {
                            method: "GET",
                            headers: { Accept: "*/*", "User-Agent": userAgent },
                            signal: controller.signal,
                        })];
                case 2:
                    res = _b.sent();
                    contentType = (_a = res.headers.get("content-type")) !== null && _a !== void 0 ? _a : "application/octet-stream";
                    return [4 /*yield*/, res.text()];
                case 3:
                    body = _b.sent();
                    return [2 /*return*/, {
                            ok: res.ok,
                            status: res.status,
                            contentType: contentType,
                            finalUrl: res.url || url,
                            body: body,
                        }];
                case 4:
                    clearTimeout(timer);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, targets_1, url, localStatus, localTitle, localText, localError, res, readable, error_1, firecrawl, error_2, message;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!apiKey) {
                        console.log("FIRECRAWL_API_KEY not set. Firecrawl comparisons will be skipped.");
                    }
                    _i = 0, targets_1 = targets;
                    _d.label = 1;
                case 1:
                    if (!(_i < targets_1.length)) return [3 /*break*/, 14];
                    url = targets_1[_i];
                    console.log("\n=== ".concat(url));
                    localStatus = "skipped";
                    localTitle = "";
                    localText = "";
                    localError = void 0;
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 8, , 9]);
                    return [4 /*yield*/, fetchHtml(url)];
                case 3:
                    res = _d.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    localStatus = "http ".concat(res.status);
                    return [3 /*break*/, 7];
                case 4:
                    if (!!res.contentType.includes("text/html")) return [3 /*break*/, 5];
                    localStatus = "non-html (".concat(res.contentType, ")");
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, (0, web_tools_js_1.extractReadableContent)({
                        html: res.body,
                        url: res.finalUrl,
                        extractMode: "markdown",
                    })];
                case 6:
                    readable = _d.sent();
                    if (readable === null || readable === void 0 ? void 0 : readable.text) {
                        localStatus = "readability";
                        localTitle = (_a = readable.title) !== null && _a !== void 0 ? _a : "";
                        localText = readable.text;
                    }
                    else {
                        localStatus = "readability-empty";
                    }
                    _d.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_1 = _d.sent();
                    localStatus = "error";
                    localError = error_1 instanceof Error ? error_1.message : String(error_1);
                    return [3 /*break*/, 9];
                case 9:
                    console.log("local: ".concat(localStatus, " len=").concat(localText.length, " title=").concat(truncate(localTitle, 80)));
                    if (localError) {
                        console.log("local error: ".concat(localError));
                    }
                    if (localText) {
                        console.log("local sample: ".concat(truncate(localText)));
                    }
                    if (!apiKey) return [3 /*break*/, 13];
                    _d.label = 10;
                case 10:
                    _d.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, (0, web_tools_js_1.fetchFirecrawlContent)({
                            url: url,
                            extractMode: "markdown",
                            apiKey: apiKey,
                            baseUrl: baseUrl,
                            onlyMainContent: true,
                            maxAgeMs: 172800000,
                            proxy: "auto",
                            storeInCache: true,
                            timeoutSeconds: 60,
                        })];
                case 11:
                    firecrawl = _d.sent();
                    console.log("firecrawl: ok len=".concat(firecrawl.text.length, " title=").concat(truncate((_b = firecrawl.title) !== null && _b !== void 0 ? _b : "", 80), " status=").concat((_c = firecrawl.status) !== null && _c !== void 0 ? _c : "n/a"));
                    if (firecrawl.warning) {
                        console.log("firecrawl warning: ".concat(firecrawl.warning));
                    }
                    if (firecrawl.text) {
                        console.log("firecrawl sample: ".concat(truncate(firecrawl.text)));
                    }
                    return [3 /*break*/, 13];
                case 12:
                    error_2 = _d.sent();
                    message = error_2 instanceof Error ? error_2.message : String(error_2);
                    console.log("firecrawl: error ".concat(message));
                    return [3 /*break*/, 13];
                case 13:
                    _i++;
                    return [3 /*break*/, 1];
                case 14:
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
run().catch(function (error) {
    console.error(error);
    process.exit(1);
});
