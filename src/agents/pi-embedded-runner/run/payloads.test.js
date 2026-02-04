"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var payloads_js_1 = require("./payloads.js");
(0, vitest_1.describe)("buildEmbeddedRunPayloads", function () {
    var errorJson = '{"type":"error","error":{"details":null,"type":"overloaded_error","message":"Overloaded"},"request_id":"req_011CX7DwS7tSvggaNHmefwWg"}';
    var errorJsonPretty = "{\n  \"type\": \"error\",\n  \"error\": {\n    \"details\": null,\n    \"type\": \"overloaded_error\",\n    \"message\": \"Overloaded\"\n  },\n  \"request_id\": \"req_011CX7DwS7tSvggaNHmefwWg\"\n}";
    var makeAssistant = function (overrides) {
        return (__assign({ stopReason: "error", errorMessage: errorJson, content: [{ type: "text", text: errorJson }] }, overrides));
    };
    (0, vitest_1.it)("suppresses raw API error JSON when the assistant errored", function () {
        var _a, _b;
        var lastAssistant = makeAssistant({});
        var payloads = (0, payloads_js_1.buildEmbeddedRunPayloads)({
            assistantTexts: [errorJson],
            toolMetas: [],
            lastAssistant: lastAssistant,
            sessionKey: "session:telegram",
            inlineToolResultsAllowed: false,
            verboseLevel: "off",
            reasoningLevel: "off",
        });
        (0, vitest_1.expect)(payloads).toHaveLength(1);
        (0, vitest_1.expect)((_a = payloads[0]) === null || _a === void 0 ? void 0 : _a.text).toBe("The AI service is temporarily overloaded. Please try again in a moment.");
        (0, vitest_1.expect)((_b = payloads[0]) === null || _b === void 0 ? void 0 : _b.isError).toBe(true);
        (0, vitest_1.expect)(payloads.some(function (payload) { return payload.text === errorJson; })).toBe(false);
    });
    (0, vitest_1.it)("suppresses pretty-printed error JSON that differs from the errorMessage", function () {
        var _a;
        var lastAssistant = makeAssistant({ errorMessage: errorJson });
        var payloads = (0, payloads_js_1.buildEmbeddedRunPayloads)({
            assistantTexts: [errorJsonPretty],
            toolMetas: [],
            lastAssistant: lastAssistant,
            sessionKey: "session:telegram",
            inlineToolResultsAllowed: true,
            verboseLevel: "on",
            reasoningLevel: "off",
        });
        (0, vitest_1.expect)(payloads).toHaveLength(1);
        (0, vitest_1.expect)((_a = payloads[0]) === null || _a === void 0 ? void 0 : _a.text).toBe("The AI service is temporarily overloaded. Please try again in a moment.");
        (0, vitest_1.expect)(payloads.some(function (payload) { return payload.text === errorJsonPretty; })).toBe(false);
    });
    (0, vitest_1.it)("suppresses raw error JSON from fallback assistant text", function () {
        var _a;
        var lastAssistant = makeAssistant({ content: [{ type: "text", text: errorJsonPretty }] });
        var payloads = (0, payloads_js_1.buildEmbeddedRunPayloads)({
            assistantTexts: [],
            toolMetas: [],
            lastAssistant: lastAssistant,
            sessionKey: "session:telegram",
            inlineToolResultsAllowed: false,
            verboseLevel: "off",
            reasoningLevel: "off",
        });
        (0, vitest_1.expect)(payloads).toHaveLength(1);
        (0, vitest_1.expect)((_a = payloads[0]) === null || _a === void 0 ? void 0 : _a.text).toBe("The AI service is temporarily overloaded. Please try again in a moment.");
        (0, vitest_1.expect)(payloads.some(function (payload) { var _a; return (_a = payload.text) === null || _a === void 0 ? void 0 : _a.includes("request_id"); })).toBe(false);
    });
    (0, vitest_1.it)("suppresses raw error JSON even when errorMessage is missing", function () {
        var _a;
        var lastAssistant = makeAssistant({ errorMessage: undefined });
        var payloads = (0, payloads_js_1.buildEmbeddedRunPayloads)({
            assistantTexts: [errorJsonPretty],
            toolMetas: [],
            lastAssistant: lastAssistant,
            sessionKey: "session:telegram",
            inlineToolResultsAllowed: false,
            verboseLevel: "off",
            reasoningLevel: "off",
        });
        (0, vitest_1.expect)(payloads).toHaveLength(1);
        (0, vitest_1.expect)((_a = payloads[0]) === null || _a === void 0 ? void 0 : _a.isError).toBe(true);
        (0, vitest_1.expect)(payloads.some(function (payload) { var _a; return (_a = payload.text) === null || _a === void 0 ? void 0 : _a.includes("request_id"); })).toBe(false);
    });
    (0, vitest_1.it)("does not suppress error-shaped JSON when the assistant did not error", function () {
        var _a;
        var payloads = (0, payloads_js_1.buildEmbeddedRunPayloads)({
            assistantTexts: [errorJsonPretty],
            toolMetas: [],
            lastAssistant: { stopReason: "end_turn" },
            sessionKey: "session:telegram",
            inlineToolResultsAllowed: false,
            verboseLevel: "off",
            reasoningLevel: "off",
        });
        (0, vitest_1.expect)(payloads).toHaveLength(1);
        (0, vitest_1.expect)((_a = payloads[0]) === null || _a === void 0 ? void 0 : _a.text).toBe(errorJsonPretty.trim());
    });
    (0, vitest_1.it)("adds a fallback error when a tool fails and no assistant output exists", function () {
        var _a, _b, _c;
        var payloads = (0, payloads_js_1.buildEmbeddedRunPayloads)({
            assistantTexts: [],
            toolMetas: [],
            lastAssistant: undefined,
            lastToolError: { toolName: "browser", error: "tab not found" },
            sessionKey: "session:telegram",
            inlineToolResultsAllowed: false,
            verboseLevel: "off",
            reasoningLevel: "off",
            toolResultFormat: "plain",
        });
        (0, vitest_1.expect)(payloads).toHaveLength(1);
        (0, vitest_1.expect)((_a = payloads[0]) === null || _a === void 0 ? void 0 : _a.isError).toBe(true);
        (0, vitest_1.expect)((_b = payloads[0]) === null || _b === void 0 ? void 0 : _b.text).toContain("Browser");
        (0, vitest_1.expect)((_c = payloads[0]) === null || _c === void 0 ? void 0 : _c.text).toContain("tab not found");
    });
    (0, vitest_1.it)("does not add tool error fallback when assistant output exists", function () {
        var _a;
        var payloads = (0, payloads_js_1.buildEmbeddedRunPayloads)({
            assistantTexts: ["All good"],
            toolMetas: [],
            lastAssistant: { stopReason: "end_turn" },
            lastToolError: { toolName: "browser", error: "tab not found" },
            sessionKey: "session:telegram",
            inlineToolResultsAllowed: false,
            verboseLevel: "off",
            reasoningLevel: "off",
            toolResultFormat: "plain",
        });
        (0, vitest_1.expect)(payloads).toHaveLength(1);
        (0, vitest_1.expect)((_a = payloads[0]) === null || _a === void 0 ? void 0 : _a.text).toBe("All good");
    });
    (0, vitest_1.it)("adds tool error fallback when the assistant only invoked tools", function () {
        var _a, _b, _c;
        var payloads = (0, payloads_js_1.buildEmbeddedRunPayloads)({
            assistantTexts: [],
            toolMetas: [],
            lastAssistant: {
                stopReason: "toolUse",
                content: [
                    {
                        type: "toolCall",
                        id: "toolu_01",
                        name: "exec",
                        arguments: { command: "echo hi" },
                    },
                ],
            },
            lastToolError: { toolName: "exec", error: "Command exited with code 1" },
            sessionKey: "session:telegram",
            inlineToolResultsAllowed: false,
            verboseLevel: "off",
            reasoningLevel: "off",
            toolResultFormat: "plain",
        });
        (0, vitest_1.expect)(payloads).toHaveLength(1);
        (0, vitest_1.expect)((_a = payloads[0]) === null || _a === void 0 ? void 0 : _a.isError).toBe(true);
        (0, vitest_1.expect)((_b = payloads[0]) === null || _b === void 0 ? void 0 : _b.text).toContain("Exec");
        (0, vitest_1.expect)((_c = payloads[0]) === null || _c === void 0 ? void 0 : _c.text).toContain("code 1");
    });
    (0, vitest_1.it)("suppresses recoverable tool errors containing 'required'", function () {
        var payloads = (0, payloads_js_1.buildEmbeddedRunPayloads)({
            assistantTexts: [],
            toolMetas: [],
            lastAssistant: undefined,
            lastToolError: { toolName: "message", meta: "reply", error: "text required" },
            sessionKey: "session:telegram",
            inlineToolResultsAllowed: false,
            verboseLevel: "off",
            reasoningLevel: "off",
            toolResultFormat: "plain",
        });
        // Recoverable errors should not be sent to the user
        (0, vitest_1.expect)(payloads).toHaveLength(0);
    });
    (0, vitest_1.it)("suppresses recoverable tool errors containing 'missing'", function () {
        var payloads = (0, payloads_js_1.buildEmbeddedRunPayloads)({
            assistantTexts: [],
            toolMetas: [],
            lastAssistant: undefined,
            lastToolError: { toolName: "message", error: "messageId missing" },
            sessionKey: "session:telegram",
            inlineToolResultsAllowed: false,
            verboseLevel: "off",
            reasoningLevel: "off",
            toolResultFormat: "plain",
        });
        (0, vitest_1.expect)(payloads).toHaveLength(0);
    });
    (0, vitest_1.it)("suppresses recoverable tool errors containing 'invalid'", function () {
        var payloads = (0, payloads_js_1.buildEmbeddedRunPayloads)({
            assistantTexts: [],
            toolMetas: [],
            lastAssistant: undefined,
            lastToolError: { toolName: "message", error: "invalid parameter: to" },
            sessionKey: "session:telegram",
            inlineToolResultsAllowed: false,
            verboseLevel: "off",
            reasoningLevel: "off",
            toolResultFormat: "plain",
        });
        (0, vitest_1.expect)(payloads).toHaveLength(0);
    });
    (0, vitest_1.it)("shows non-recoverable tool errors to the user", function () {
        var _a, _b;
        var payloads = (0, payloads_js_1.buildEmbeddedRunPayloads)({
            assistantTexts: [],
            toolMetas: [],
            lastAssistant: undefined,
            lastToolError: { toolName: "browser", error: "connection timeout" },
            sessionKey: "session:telegram",
            inlineToolResultsAllowed: false,
            verboseLevel: "off",
            reasoningLevel: "off",
            toolResultFormat: "plain",
        });
        // Non-recoverable errors should still be shown
        (0, vitest_1.expect)(payloads).toHaveLength(1);
        (0, vitest_1.expect)((_a = payloads[0]) === null || _a === void 0 ? void 0 : _a.isError).toBe(true);
        (0, vitest_1.expect)((_b = payloads[0]) === null || _b === void 0 ? void 0 : _b.text).toContain("connection timeout");
    });
});
