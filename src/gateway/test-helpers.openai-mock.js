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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installOpenAiResponsesMock = installOpenAiResponsesMock;
function extractLastUserText(input) {
    for (var i = input.length - 1; i >= 0; i -= 1) {
        var item = input[i];
        if (!item || item.role !== "user") {
            continue;
        }
        var content = item.content;
        if (Array.isArray(content)) {
            var text = content
                .filter(function (c) {
                return !!c &&
                    typeof c === "object" &&
                    c.type === "input_text" &&
                    typeof c.text === "string";
            })
                .map(function (c) { return c.text; })
                .join("\n")
                .trim();
            if (text) {
                return text;
            }
        }
    }
    return "";
}
function extractToolOutput(input) {
    for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
        var itemRaw = input_1[_i];
        var item = itemRaw;
        if (!item || item.type !== "function_call_output") {
            continue;
        }
        return typeof item.output === "string" ? item.output : "";
    }
    return "";
}
function fakeOpenAIResponsesStream(params) {
    return __asyncGenerator(this, arguments, function fakeOpenAIResponsesStream_1() {
        var input, toolOutput, prompt_1, quoted, toolPath, argsJson, nonceA, nonceB, reply;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    input = Array.isArray(params.input) ? params.input : [];
                    toolOutput = extractToolOutput(input);
                    if (!!toolOutput) return [3 /*break*/, 10];
                    prompt_1 = extractLastUserText(input);
                    quoted = (_a = /"([^"]+)"/.exec(prompt_1)) === null || _a === void 0 ? void 0 : _a[1];
                    toolPath = quoted !== null && quoted !== void 0 ? quoted : "package.json";
                    argsJson = JSON.stringify({ path: toolPath });
                    return [4 /*yield*/, __await({
                            type: "response.output_item.added",
                            item: {
                                type: "function_call",
                                id: "fc_test_1",
                                call_id: "call_test_1",
                                name: "read",
                                arguments: "",
                            },
                        })];
                case 1: return [4 /*yield*/, _f.sent()];
                case 2:
                    _f.sent();
                    return [4 /*yield*/, __await({ type: "response.function_call_arguments.delta", delta: argsJson })];
                case 3: return [4 /*yield*/, _f.sent()];
                case 4:
                    _f.sent();
                    return [4 /*yield*/, __await({
                            type: "response.output_item.done",
                            item: {
                                type: "function_call",
                                id: "fc_test_1",
                                call_id: "call_test_1",
                                name: "read",
                                arguments: argsJson,
                            },
                        })];
                case 5: return [4 /*yield*/, _f.sent()];
                case 6:
                    _f.sent();
                    return [4 /*yield*/, __await({
                            type: "response.completed",
                            response: {
                                status: "completed",
                                usage: { input_tokens: 10, output_tokens: 10, total_tokens: 20 },
                            },
                        })];
                case 7: return [4 /*yield*/, _f.sent()];
                case 8:
                    _f.sent();
                    return [4 /*yield*/, __await(void 0)];
                case 9: return [2 /*return*/, _f.sent()];
                case 10:
                    nonceA = (_c = (_b = /nonceA=([^\s]+)/.exec(toolOutput)) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : "";
                    nonceB = (_e = (_d = /nonceB=([^\s]+)/.exec(toolOutput)) === null || _d === void 0 ? void 0 : _d[1]) !== null && _e !== void 0 ? _e : "";
                    reply = "".concat(nonceA, " ").concat(nonceB).trim();
                    return [4 /*yield*/, __await({
                            type: "response.output_item.added",
                            item: {
                                type: "message",
                                id: "msg_test_1",
                                role: "assistant",
                                content: [],
                                status: "in_progress",
                            },
                        })];
                case 11: return [4 /*yield*/, _f.sent()];
                case 12:
                    _f.sent();
                    return [4 /*yield*/, __await({
                            type: "response.output_item.done",
                            item: {
                                type: "message",
                                id: "msg_test_1",
                                role: "assistant",
                                status: "completed",
                                content: [{ type: "output_text", text: reply, annotations: [] }],
                            },
                        })];
                case 13: return [4 /*yield*/, _f.sent()];
                case 14:
                    _f.sent();
                    return [4 /*yield*/, __await({
                            type: "response.completed",
                            response: {
                                status: "completed",
                                usage: { input_tokens: 10, output_tokens: 10, total_tokens: 20 },
                            },
                        })];
                case 15: return [4 /*yield*/, _f.sent()];
                case 16:
                    _f.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function decodeBodyText(body) {
    if (!body) {
        return "";
    }
    if (typeof body === "string") {
        return body;
    }
    if (body instanceof Uint8Array) {
        return Buffer.from(body).toString("utf8");
    }
    if (body instanceof ArrayBuffer) {
        return Buffer.from(new Uint8Array(body)).toString("utf8");
    }
    return "";
}
function buildOpenAIResponsesSse(params) {
    return __awaiter(this, void 0, void 0, function () {
        var events, _a, _b, _c, event_1, e_1_1, sse, encoder, body;
        var _d, e_1, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    events = [];
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 6, 7, 12]);
                    _a = true, _b = __asyncValues(fakeOpenAIResponsesStream(params));
                    _g.label = 2;
                case 2: return [4 /*yield*/, _b.next()];
                case 3:
                    if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                    _f = _c.value;
                    _a = false;
                    event_1 = _f;
                    events.push(event_1);
                    _g.label = 4;
                case 4:
                    _a = true;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _g.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _g.trys.push([7, , 10, 11]);
                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _e.call(_b)];
                case 8:
                    _g.sent();
                    _g.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12:
                    sse = "".concat(events.map(function (e) { return "data: ".concat(JSON.stringify(e), "\n\n"); }).join(""), "data: [DONE]\n\n");
                    encoder = new TextEncoder();
                    body = new ReadableStream({
                        start: function (controller) {
                            controller.enqueue(encoder.encode(sse));
                            controller.close();
                        },
                    });
                    return [2 /*return*/, new Response(body, {
                            status: 200,
                            headers: { "content-type": "text/event-stream" },
                        })];
            }
        });
    });
}
function installOpenAiResponsesMock(params) {
    var _this = this;
    var _a;
    var originalFetch = globalThis.fetch;
    var baseUrl = (_a = params === null || params === void 0 ? void 0 : params.baseUrl) !== null && _a !== void 0 ? _a : "https://api.openai.com/v1";
    var responsesUrl = "".concat(baseUrl, "/responses");
    var isResponsesRequest = function (url) {
        return url === responsesUrl ||
            url.startsWith("".concat(responsesUrl, "/")) ||
            url.startsWith("".concat(responsesUrl, "?"));
    };
    var fetchImpl = function (input, init) { return __awaiter(_this, void 0, void 0, function () {
        var url, bodyText, _a, _b, parsed, inputItems;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                    if (!isResponsesRequest(url)) return [3 /*break*/, 7];
                    if (!(typeof (init === null || init === void 0 ? void 0 : init.body) !== "undefined")) return [3 /*break*/, 1];
                    _a = decodeBodyText(init.body);
                    return [3 /*break*/, 5];
                case 1:
                    if (!(input instanceof Request)) return [3 /*break*/, 3];
                    return [4 /*yield*/, input.clone().text()];
                case 2:
                    _b = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _b = "";
                    _c.label = 4;
                case 4:
                    _a = _b;
                    _c.label = 5;
                case 5:
                    bodyText = _a;
                    parsed = bodyText ? JSON.parse(bodyText) : {};
                    inputItems = Array.isArray(parsed.input) ? parsed.input : [];
                    return [4 /*yield*/, buildOpenAIResponsesSse({ input: inputItems })];
                case 6: return [2 /*return*/, _c.sent()];
                case 7:
                    if (url.startsWith(baseUrl)) {
                        throw new Error("unexpected OpenAI request in mock test: ".concat(url));
                    }
                    if (!originalFetch) {
                        throw new Error("fetch is not available (url=".concat(url, ")"));
                    }
                    return [4 /*yield*/, originalFetch(input, init)];
                case 8: return [2 /*return*/, _c.sent()];
            }
        });
    }); };
    globalThis.fetch = fetchImpl;
    return {
        baseUrl: baseUrl,
        restore: function () {
            globalThis.fetch = originalFetch;
        },
    };
}
