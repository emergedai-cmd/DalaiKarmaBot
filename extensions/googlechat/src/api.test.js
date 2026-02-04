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
var api_js_1 = require("./api.js");
vitest_1.vi.mock("./auth.js", function () { return ({
    getGoogleChatAccessToken: vitest_1.vi.fn().mockResolvedValue("token"),
}); });
var account = {
    accountId: "default",
    enabled: true,
    credentialSource: "inline",
    config: {},
};
(0, vitest_1.describe)("downloadGoogleChatMedia", function () {
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.unstubAllGlobals();
    });
    (0, vitest_1.it)("rejects when content-length exceeds max bytes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var body, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = new ReadableStream({
                        start: function (controller) {
                            controller.enqueue(new Uint8Array([1, 2, 3]));
                            controller.close();
                        },
                    });
                    response = new Response(body, {
                        status: 200,
                        headers: { "content-length": "50", "content-type": "application/octet-stream" },
                    });
                    vitest_1.vi.stubGlobal("fetch", vitest_1.vi.fn().mockResolvedValue(response));
                    return [4 /*yield*/, (0, vitest_1.expect)((0, api_js_1.downloadGoogleChatMedia)({ account: account, resourceName: "media/123", maxBytes: 10 })).rejects.toThrow(/max bytes/i)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects when streamed payload exceeds max bytes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chunks, index, body, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chunks = [new Uint8Array(6), new Uint8Array(6)];
                    index = 0;
                    body = new ReadableStream({
                        pull: function (controller) {
                            if (index < chunks.length) {
                                controller.enqueue(chunks[index++]);
                            }
                            else {
                                controller.close();
                            }
                        },
                    });
                    response = new Response(body, {
                        status: 200,
                        headers: { "content-type": "application/octet-stream" },
                    });
                    vitest_1.vi.stubGlobal("fetch", vitest_1.vi.fn().mockResolvedValue(response));
                    return [4 /*yield*/, (0, vitest_1.expect)((0, api_js_1.downloadGoogleChatMedia)({ account: account, resourceName: "media/123", maxBytes: 10 })).rejects.toThrow(/max bytes/i)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
