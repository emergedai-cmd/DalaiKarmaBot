"use strict";
/**
 * Matrix Poll Types (MSC3381)
 *
 * Defines types for Matrix poll events:
 * - m.poll.start - Creates a new poll
 * - m.poll.response - Records a vote
 * - m.poll.end - Closes a poll
 */
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POLL_END_TYPES = exports.POLL_RESPONSE_TYPES = exports.POLL_START_TYPES = exports.POLL_EVENT_TYPES = exports.ORG_POLL_END = exports.ORG_POLL_RESPONSE = exports.ORG_POLL_START = exports.M_POLL_END = exports.M_POLL_RESPONSE = exports.M_POLL_START = void 0;
exports.isPollStartType = isPollStartType;
exports.getTextContent = getTextContent;
exports.parsePollStartContent = parsePollStartContent;
exports.formatPollAsText = formatPollAsText;
exports.buildPollStartContent = buildPollStartContent;
exports.M_POLL_START = "m.poll.start";
exports.M_POLL_RESPONSE = "m.poll.response";
exports.M_POLL_END = "m.poll.end";
exports.ORG_POLL_START = "org.matrix.msc3381.poll.start";
exports.ORG_POLL_RESPONSE = "org.matrix.msc3381.poll.response";
exports.ORG_POLL_END = "org.matrix.msc3381.poll.end";
exports.POLL_EVENT_TYPES = [
    exports.M_POLL_START,
    exports.M_POLL_RESPONSE,
    exports.M_POLL_END,
    exports.ORG_POLL_START,
    exports.ORG_POLL_RESPONSE,
    exports.ORG_POLL_END,
];
exports.POLL_START_TYPES = [exports.M_POLL_START, exports.ORG_POLL_START];
exports.POLL_RESPONSE_TYPES = [exports.M_POLL_RESPONSE, exports.ORG_POLL_RESPONSE];
exports.POLL_END_TYPES = [exports.M_POLL_END, exports.ORG_POLL_END];
function isPollStartType(eventType) {
    return exports.POLL_START_TYPES.includes(eventType);
}
function getTextContent(text) {
    var _a, _b, _c;
    if (!text) {
        return "";
    }
    return (_c = (_b = (_a = text["m.text"]) !== null && _a !== void 0 ? _a : text["org.matrix.msc1767.text"]) !== null && _b !== void 0 ? _b : text.body) !== null && _c !== void 0 ? _c : "";
}
function parsePollStartContent(content) {
    var _a, _b, _c, _d;
    var poll = (_b = (_a = content[exports.M_POLL_START]) !== null && _a !== void 0 ? _a : content[exports.ORG_POLL_START]) !== null && _b !== void 0 ? _b : content["m.poll"];
    if (!poll) {
        return null;
    }
    var question = getTextContent(poll.question);
    if (!question) {
        return null;
    }
    var answers = poll.answers
        .map(function (answer) { return getTextContent(answer); })
        .filter(function (a) { return a.trim().length > 0; });
    return {
        eventId: "",
        roomId: "",
        sender: "",
        senderName: "",
        question: question,
        answers: answers,
        kind: (_c = poll.kind) !== null && _c !== void 0 ? _c : "m.poll.disclosed",
        maxSelections: (_d = poll.max_selections) !== null && _d !== void 0 ? _d : 1,
    };
}
function formatPollAsText(summary) {
    var lines = __spreadArray([
        "[Poll]",
        summary.question,
        ""
    ], summary.answers.map(function (answer, idx) { return "".concat(idx + 1, ". ").concat(answer); }), true);
    return lines.join("\n");
}
function buildTextContent(body) {
    return {
        "m.text": body,
        "org.matrix.msc1767.text": body,
    };
}
function buildPollFallbackText(question, answers) {
    if (answers.length === 0) {
        return question;
    }
    return "".concat(question, "\n").concat(answers.map(function (answer, idx) { return "".concat(idx + 1, ". ").concat(answer); }).join("\n"));
}
function buildPollStartContent(poll) {
    var _a;
    var question = poll.question.trim();
    var answers = poll.options
        .map(function (option) { return option.trim(); })
        .filter(function (option) { return option.length > 0; })
        .map(function (option, idx) { return (__assign({ id: "answer".concat(idx + 1) }, buildTextContent(option))); });
    var maxSelections = poll.multiple ? Math.max(1, answers.length) : 1;
    var fallbackText = buildPollFallbackText(question, answers.map(function (answer) { return getTextContent(answer); }));
    return _a = {},
        _a[exports.M_POLL_START] = {
            question: buildTextContent(question),
            kind: poll.multiple ? "m.poll.undisclosed" : "m.poll.disclosed",
            max_selections: maxSelections,
            answers: answers,
        },
        _a["m.text"] = fallbackText,
        _a["org.matrix.msc1767.text"] = fallbackText,
        _a;
}
