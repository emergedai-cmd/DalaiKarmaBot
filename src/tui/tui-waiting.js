"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultWaitingPhrases = void 0;
exports.pickWaitingPhrase = pickWaitingPhrase;
exports.shimmerText = shimmerText;
exports.buildWaitingStatusMessage = buildWaitingStatusMessage;
exports.defaultWaitingPhrases = [
    "flibbertigibbeting",
    "kerfuffling",
    "dillydallying",
    "twiddling thumbs",
    "noodling",
    "bamboozling",
    "moseying",
    "hobnobbing",
    "pondering",
    "conjuring",
];
function pickWaitingPhrase(tick, phrases) {
    var _a, _b;
    if (phrases === void 0) { phrases = exports.defaultWaitingPhrases; }
    var idx = Math.floor(tick / 10) % phrases.length;
    return (_b = (_a = phrases[idx]) !== null && _a !== void 0 ? _a : phrases[0]) !== null && _b !== void 0 ? _b : "waiting";
}
function shimmerText(theme, text, tick) {
    var width = 6;
    var hi = function (ch) { return theme.bold(theme.accentSoft(ch)); };
    var pos = tick % (text.length + width);
    var start = Math.max(0, pos - width);
    var end = Math.min(text.length - 1, pos);
    var out = "";
    for (var i = 0; i < text.length; i++) {
        var ch = text[i];
        out += i >= start && i <= end ? hi(ch) : theme.dim(ch);
    }
    return out;
}
function buildWaitingStatusMessage(params) {
    var phrase = pickWaitingPhrase(params.tick, params.phrases);
    var cute = shimmerText(params.theme, "".concat(phrase, "\u2026"), params.tick);
    return "".concat(cute, " \u2022 ").concat(params.elapsed, " | ").concat(params.connectionStatus);
}
