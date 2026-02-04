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
var web_tools_js_1 = require("./web-tools.js");
var SAMPLE_HTML = "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <title>Example Article</title>\n  </head>\n  <body>\n    <nav>\n      <ul>\n        <li><a href=\"/home\">Home</a></li>\n        <li><a href=\"/about\">About</a></li>\n      </ul>\n    </nav>\n    <main>\n      <article>\n        <h1>Example Article</h1>\n        <p>Main content starts here with enough words to satisfy readability.</p>\n        <p>Second paragraph for a bit more signal.</p>\n      </article>\n    </main>\n    <footer>Footer text</footer>\n  </body>\n</html>";
(0, vitest_1.describe)("web fetch readability", function () {
    (0, vitest_1.it)("extracts readable text", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, web_tools_js_1.extractReadableContent)({
                        html: SAMPLE_HTML,
                        url: "https://example.com/article",
                        extractMode: "text",
                    })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.text).toContain("Main content starts here");
                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.title).toBe("Example Article");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("extracts readable markdown", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, web_tools_js_1.extractReadableContent)({
                        html: SAMPLE_HTML,
                        url: "https://example.com/article",
                        extractMode: "markdown",
                    })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.text).toContain("Main content starts here");
                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.title).toBe("Example Article");
                    return [2 /*return*/];
            }
        });
    }); });
});
