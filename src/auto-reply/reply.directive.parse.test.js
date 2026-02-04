"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var reply_js_1 = require("./reply.js");
var directives_js_1 = require("./reply/directives.js");
(0, vitest_1.describe)("directive parsing", function () {
    (0, vitest_1.it)("ignores verbose directive inside URL", function () {
        var body = "https://x.com/verioussmith/status/1997066835133669687";
        var res = (0, reply_js_1.extractVerboseDirective)(body);
        (0, vitest_1.expect)(res.hasDirective).toBe(false);
        (0, vitest_1.expect)(res.cleaned).toBe(body);
    });
    (0, vitest_1.it)("ignores typoed /verioussmith", function () {
        var body = "/verioussmith";
        var res = (0, reply_js_1.extractVerboseDirective)(body);
        (0, vitest_1.expect)(res.hasDirective).toBe(false);
        (0, vitest_1.expect)(res.cleaned).toBe(body.trim());
    });
    (0, vitest_1.it)("ignores think directive inside URL", function () {
        var body = "see https://example.com/path/thinkstuff";
        var res = (0, reply_js_1.extractThinkDirective)(body);
        (0, vitest_1.expect)(res.hasDirective).toBe(false);
    });
    (0, vitest_1.it)("matches verbose with leading space", function () {
        var res = (0, reply_js_1.extractVerboseDirective)(" please /verbose on now");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.verboseLevel).toBe("on");
    });
    (0, vitest_1.it)("matches reasoning directive", function () {
        var res = (0, reply_js_1.extractReasoningDirective)("/reasoning on please");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.reasoningLevel).toBe("on");
    });
    (0, vitest_1.it)("matches reasoning stream directive", function () {
        var res = (0, reply_js_1.extractReasoningDirective)("/reasoning stream please");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.reasoningLevel).toBe("stream");
    });
    (0, vitest_1.it)("matches elevated with leading space", function () {
        var res = (0, reply_js_1.extractElevatedDirective)(" please /elevated on now");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.elevatedLevel).toBe("on");
    });
    (0, vitest_1.it)("matches elevated ask", function () {
        var res = (0, reply_js_1.extractElevatedDirective)("/elevated ask please");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.elevatedLevel).toBe("ask");
    });
    (0, vitest_1.it)("matches elevated full", function () {
        var res = (0, reply_js_1.extractElevatedDirective)("/elevated full please");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.elevatedLevel).toBe("full");
    });
    (0, vitest_1.it)("matches think at start of line", function () {
        var res = (0, reply_js_1.extractThinkDirective)("/think:high run slow");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.thinkLevel).toBe("high");
    });
    (0, vitest_1.it)("does not match /think followed by extra letters", function () {
        // e.g. someone typing "/think" + extra letter "hink"
        var res = (0, reply_js_1.extractThinkDirective)("/thinkstuff");
        (0, vitest_1.expect)(res.hasDirective).toBe(false);
    });
    (0, vitest_1.it)("matches /think with no argument", function () {
        var res = (0, reply_js_1.extractThinkDirective)("/think");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.thinkLevel).toBeUndefined();
        (0, vitest_1.expect)(res.rawLevel).toBeUndefined();
    });
    (0, vitest_1.it)("matches /t with no argument", function () {
        var res = (0, reply_js_1.extractThinkDirective)("/t");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.thinkLevel).toBeUndefined();
    });
    (0, vitest_1.it)("matches think with no argument and consumes colon", function () {
        var res = (0, reply_js_1.extractThinkDirective)("/think:");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.thinkLevel).toBeUndefined();
        (0, vitest_1.expect)(res.rawLevel).toBeUndefined();
        (0, vitest_1.expect)(res.cleaned).toBe("");
    });
    (0, vitest_1.it)("matches verbose with no argument", function () {
        var res = (0, reply_js_1.extractVerboseDirective)("/verbose:");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.verboseLevel).toBeUndefined();
        (0, vitest_1.expect)(res.rawLevel).toBeUndefined();
        (0, vitest_1.expect)(res.cleaned).toBe("");
    });
    (0, vitest_1.it)("matches reasoning with no argument", function () {
        var res = (0, reply_js_1.extractReasoningDirective)("/reasoning:");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.reasoningLevel).toBeUndefined();
        (0, vitest_1.expect)(res.rawLevel).toBeUndefined();
        (0, vitest_1.expect)(res.cleaned).toBe("");
    });
    (0, vitest_1.it)("matches elevated with no argument", function () {
        var res = (0, reply_js_1.extractElevatedDirective)("/elevated:");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.elevatedLevel).toBeUndefined();
        (0, vitest_1.expect)(res.rawLevel).toBeUndefined();
        (0, vitest_1.expect)(res.cleaned).toBe("");
    });
    (0, vitest_1.it)("matches exec directive with options", function () {
        var res = (0, reply_js_1.extractExecDirective)("please /exec host=gateway security=allowlist ask=on-miss node=mac-mini now");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.execHost).toBe("gateway");
        (0, vitest_1.expect)(res.execSecurity).toBe("allowlist");
        (0, vitest_1.expect)(res.execAsk).toBe("on-miss");
        (0, vitest_1.expect)(res.execNode).toBe("mac-mini");
        (0, vitest_1.expect)(res.cleaned).toBe("please now");
    });
    (0, vitest_1.it)("captures invalid exec host values", function () {
        var res = (0, reply_js_1.extractExecDirective)("/exec host=spaceship");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.execHost).toBeUndefined();
        (0, vitest_1.expect)(res.rawExecHost).toBe("spaceship");
        (0, vitest_1.expect)(res.invalidHost).toBe(true);
    });
    (0, vitest_1.it)("matches queue directive", function () {
        var res = (0, reply_js_1.extractQueueDirective)("please /queue interrupt now");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.queueMode).toBe("interrupt");
        (0, vitest_1.expect)(res.queueReset).toBe(false);
        (0, vitest_1.expect)(res.cleaned).toBe("please now");
    });
    (0, vitest_1.it)("preserves spacing when stripping think directives before paths", function () {
        var res = (0, reply_js_1.extractThinkDirective)("thats not /think high/tmp/hello");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.cleaned).toBe("thats not /tmp/hello");
    });
    (0, vitest_1.it)("preserves spacing when stripping verbose directives before paths", function () {
        var res = (0, reply_js_1.extractVerboseDirective)("thats not /verbose on/tmp/hello");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.cleaned).toBe("thats not /tmp/hello");
    });
    (0, vitest_1.it)("preserves spacing when stripping reasoning directives before paths", function () {
        var res = (0, reply_js_1.extractReasoningDirective)("thats not /reasoning on/tmp/hello");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.cleaned).toBe("thats not /tmp/hello");
    });
    (0, vitest_1.it)("preserves spacing when stripping status directives before paths", function () {
        var res = (0, directives_js_1.extractStatusDirective)("thats not /status:/tmp/hello");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.cleaned).toBe("thats not /tmp/hello");
    });
    (0, vitest_1.it)("does not treat /usage as a status directive", function () {
        var res = (0, directives_js_1.extractStatusDirective)("thats not /usage:/tmp/hello");
        (0, vitest_1.expect)(res.hasDirective).toBe(false);
        (0, vitest_1.expect)(res.cleaned).toBe("thats not /usage:/tmp/hello");
    });
    (0, vitest_1.it)("parses queue options and modes", function () {
        var res = (0, reply_js_1.extractQueueDirective)("please /queue steer+backlog debounce:2s cap:5 drop:summarize now");
        (0, vitest_1.expect)(res.hasDirective).toBe(true);
        (0, vitest_1.expect)(res.queueMode).toBe("steer-backlog");
        (0, vitest_1.expect)(res.debounceMs).toBe(2000);
        (0, vitest_1.expect)(res.cap).toBe(5);
        (0, vitest_1.expect)(res.dropPolicy).toBe("summarize");
        (0, vitest_1.expect)(res.cleaned).toBe("please now");
    });
    (0, vitest_1.it)("extracts reply_to_current tag", function () {
        var res = (0, reply_js_1.extractReplyToTag)("ok [[reply_to_current]]", "msg-1");
        (0, vitest_1.expect)(res.replyToId).toBe("msg-1");
        (0, vitest_1.expect)(res.cleaned).toBe("ok");
    });
    (0, vitest_1.it)("extracts reply_to_current tag with whitespace", function () {
        var res = (0, reply_js_1.extractReplyToTag)("ok [[ reply_to_current ]]", "msg-1");
        (0, vitest_1.expect)(res.replyToId).toBe("msg-1");
        (0, vitest_1.expect)(res.cleaned).toBe("ok");
    });
    (0, vitest_1.it)("extracts reply_to id tag", function () {
        var res = (0, reply_js_1.extractReplyToTag)("see [[reply_to:12345]] now", "msg-1");
        (0, vitest_1.expect)(res.replyToId).toBe("12345");
        (0, vitest_1.expect)(res.cleaned).toBe("see now");
    });
    (0, vitest_1.it)("extracts reply_to id tag with whitespace", function () {
        var res = (0, reply_js_1.extractReplyToTag)("see [[ reply_to : 12345 ]] now", "msg-1");
        (0, vitest_1.expect)(res.replyToId).toBe("12345");
        (0, vitest_1.expect)(res.cleaned).toBe("see now");
    });
    (0, vitest_1.it)("preserves newlines when stripping reply tags", function () {
        var res = (0, reply_js_1.extractReplyToTag)("line 1\nline 2 [[reply_to_current]]\n\nline 3", "msg-2");
        (0, vitest_1.expect)(res.replyToId).toBe("msg-2");
        (0, vitest_1.expect)(res.cleaned).toBe("line 1\nline 2\n\nline 3");
    });
});
