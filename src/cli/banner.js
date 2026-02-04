"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCliBannerLine = formatCliBannerLine;
exports.formatCliBannerArt = formatCliBannerArt;
exports.emitCliBanner = emitCliBanner;
exports.hasEmittedCliBanner = hasEmittedCliBanner;
var git_commit_js_1 = require("../infra/git-commit.js");
var ansi_js_1 = require("../terminal/ansi.js");
var theme_js_1 = require("../terminal/theme.js");
var tagline_js_1 = require("./tagline.js");
var bannerEmitted = false;
var graphemeSegmenter = typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;
function splitGraphemes(value) {
    if (!graphemeSegmenter) {
        return Array.from(value);
    }
    try {
        return Array.from(graphemeSegmenter.segment(value), function (seg) { return seg.segment; });
    }
    catch (_a) {
        return Array.from(value);
    }
}
var hasJsonFlag = function (argv) {
    return argv.some(function (arg) { return arg === "--json" || arg.startsWith("--json="); });
};
var hasVersionFlag = function (argv) {
    return argv.some(function (arg) { return arg === "--version" || arg === "-V" || arg === "-v"; });
};
function formatCliBannerLine(version, options) {
    var _a, _b, _c, _d;
    if (options === void 0) { options = {}; }
    var commit = (_a = options.commit) !== null && _a !== void 0 ? _a : (0, git_commit_js_1.resolveCommitHash)({ env: options.env });
    var commitLabel = commit !== null && commit !== void 0 ? commit : "unknown";
    var tagline = (0, tagline_js_1.pickTagline)(options);
    var rich = (_b = options.richTty) !== null && _b !== void 0 ? _b : (0, theme_js_1.isRich)();
    var title = "🦞 OpenClaw";
    var prefix = "🦞 ";
    var columns = (_d = (_c = options.columns) !== null && _c !== void 0 ? _c : process.stdout.columns) !== null && _d !== void 0 ? _d : 120;
    var plainFullLine = "".concat(title, " ").concat(version, " (").concat(commitLabel, ") \u2014 ").concat(tagline);
    var fitsOnOneLine = (0, ansi_js_1.visibleWidth)(plainFullLine) <= columns;
    if (rich) {
        if (fitsOnOneLine) {
            return "".concat(theme_js_1.theme.heading(title), " ").concat(theme_js_1.theme.info(version), " ").concat(theme_js_1.theme.muted("(".concat(commitLabel, ")")), " ").concat(theme_js_1.theme.muted("—"), " ").concat(theme_js_1.theme.accentDim(tagline));
        }
        var line1_1 = "".concat(theme_js_1.theme.heading(title), " ").concat(theme_js_1.theme.info(version), " ").concat(theme_js_1.theme.muted("(".concat(commitLabel, ")")));
        var line2_1 = "".concat(" ".repeat(prefix.length)).concat(theme_js_1.theme.accentDim(tagline));
        return "".concat(line1_1, "\n").concat(line2_1);
    }
    if (fitsOnOneLine) {
        return plainFullLine;
    }
    var line1 = "".concat(title, " ").concat(version, " (").concat(commitLabel, ")");
    var line2 = "".concat(" ".repeat(prefix.length)).concat(tagline);
    return "".concat(line1, "\n").concat(line2);
}
var LOBSTER_ASCII = [
    "▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄",
    "██░▄▄▄░██░▄▄░██░▄▄▄██░▀██░██░▄▄▀██░████░▄▄▀██░███░██",
    "██░███░██░▀▀░██░▄▄▄██░█░█░██░█████░████░▀▀░██░█░█░██",
    "██░▀▀▀░██░█████░▀▀▀██░██▄░██░▀▀▄██░▀▀░█░██░██▄▀▄▀▄██",
    "▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀",
    "                  🦞 OPENCLAW 🦞                    ",
    " ",
];
function formatCliBannerArt(options) {
    var _a;
    if (options === void 0) { options = {}; }
    var rich = (_a = options.richTty) !== null && _a !== void 0 ? _a : (0, theme_js_1.isRich)();
    if (!rich) {
        return LOBSTER_ASCII.join("\n");
    }
    var colorChar = function (ch) {
        if (ch === "█") {
            return theme_js_1.theme.accentBright(ch);
        }
        if (ch === "░") {
            return theme_js_1.theme.accentDim(ch);
        }
        if (ch === "▀") {
            return theme_js_1.theme.accent(ch);
        }
        return theme_js_1.theme.muted(ch);
    };
    var colored = LOBSTER_ASCII.map(function (line) {
        if (line.includes("OPENCLAW")) {
            return (theme_js_1.theme.muted("              ") +
                theme_js_1.theme.accent("🦞") +
                theme_js_1.theme.info(" OPENCLAW ") +
                theme_js_1.theme.accent("🦞"));
        }
        return splitGraphemes(line).map(colorChar).join("");
    });
    return colored.join("\n");
}
function emitCliBanner(version, options) {
    var _a;
    if (options === void 0) { options = {}; }
    if (bannerEmitted) {
        return;
    }
    var argv = (_a = options.argv) !== null && _a !== void 0 ? _a : process.argv;
    if (!process.stdout.isTTY) {
        return;
    }
    if (hasJsonFlag(argv)) {
        return;
    }
    if (hasVersionFlag(argv)) {
        return;
    }
    var line = formatCliBannerLine(version, options);
    process.stdout.write("\n".concat(line, "\n\n"));
    bannerEmitted = true;
}
function hasEmittedCliBanner() {
    return bannerEmitted;
}
