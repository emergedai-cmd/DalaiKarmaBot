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
exports.docsSearchCommand = docsSearchCommand;
var skills_js_1 = require("../agents/skills.js");
var command_format_js_1 = require("../cli/command-format.js");
var exec_js_1 = require("../process/exec.js");
var links_js_1 = require("../terminal/links.js");
var theme_js_1 = require("../terminal/theme.js");
var SEARCH_TOOL = "https://docs.openclaw.ai/mcp.SearchOpenClaw";
var SEARCH_TIMEOUT_MS = 30000;
var DEFAULT_SNIPPET_MAX = 220;
function resolveNodeRunner() {
    if ((0, skills_js_1.hasBinary)("pnpm")) {
        return { cmd: "pnpm", args: ["dlx"] };
    }
    if ((0, skills_js_1.hasBinary)("npx")) {
        return { cmd: "npx", args: ["-y"] };
    }
    throw new Error("Missing pnpm or npx; install a Node package runner.");
}
function runNodeTool(tool_1, toolArgs_1) {
    return __awaiter(this, arguments, void 0, function (tool, toolArgs, options) {
        var runner, argv;
        var _a;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    runner = resolveNodeRunner();
                    argv = __spreadArray(__spreadArray(__spreadArray([runner.cmd], runner.args, true), [tool], false), toolArgs, true);
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(argv, {
                            timeoutMs: (_a = options.timeoutMs) !== null && _a !== void 0 ? _a : SEARCH_TIMEOUT_MS,
                            input: options.input,
                        })];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
function runTool(tool_1, toolArgs_1) {
    return __awaiter(this, arguments, void 0, function (tool, toolArgs, options) {
        var _a;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(0, skills_js_1.hasBinary)(tool)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(__spreadArray([tool], toolArgs, true), {
                            timeoutMs: (_a = options.timeoutMs) !== null && _a !== void 0 ? _a : SEARCH_TIMEOUT_MS,
                            input: options.input,
                        })];
                case 1: return [2 /*return*/, _b.sent()];
                case 2: return [4 /*yield*/, runNodeTool(tool, toolArgs, options)];
                case 3: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
function extractLine(lines, prefix) {
    var line = lines.find(function (value) { return value.startsWith(prefix); });
    if (!line) {
        return undefined;
    }
    return line.slice(prefix.length).trim();
}
function normalizeSnippet(raw, fallback) {
    var base = raw && raw.trim().length > 0 ? raw : fallback;
    var cleaned = base.replace(/\s+/g, " ").trim();
    if (!cleaned) {
        return "";
    }
    if (cleaned.length <= DEFAULT_SNIPPET_MAX) {
        return cleaned;
    }
    return "".concat(cleaned.slice(0, DEFAULT_SNIPPET_MAX - 3), "...");
}
function firstParagraph(text) {
    var _a;
    var parts = text
        .split(/\n\s*\n/)
        .map(function (chunk) { return chunk.trim(); })
        .filter(Boolean);
    return (_a = parts[0]) !== null && _a !== void 0 ? _a : "";
}
function parseSearchOutput(raw) {
    var normalized = raw.replace(/\r/g, "");
    var blocks = normalized
        .split(/\n(?=Title: )/g)
        .map(function (chunk) { return chunk.trim(); })
        .filter(Boolean);
    var results = [];
    for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
        var block = blocks_1[_i];
        var lines = block.split("\n");
        var title = extractLine(lines, "Title:");
        var link = extractLine(lines, "Link:");
        if (!title || !link) {
            continue;
        }
        var content = extractLine(lines, "Content:");
        var contentIndex = lines.findIndex(function (line) { return line.startsWith("Content:"); });
        var body = contentIndex >= 0
            ? lines
                .slice(contentIndex + 1)
                .join("\n")
                .trim()
            : "";
        var snippet = normalizeSnippet(content, firstParagraph(body));
        results.push({ title: title, link: link, snippet: snippet || undefined });
    }
    return results;
}
function escapeMarkdown(text) {
    return text.replace(/[()[\]]/g, "\\$&");
}
function buildMarkdown(query, results) {
    var lines = ["# Docs search: ".concat(escapeMarkdown(query)), ""];
    if (results.length === 0) {
        lines.push("_No results._");
        return lines.join("\n");
    }
    for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
        var item = results_1[_i];
        var title = escapeMarkdown(item.title);
        var snippet = item.snippet ? escapeMarkdown(item.snippet) : "";
        var suffix = snippet ? " - ".concat(snippet) : "";
        lines.push("- [".concat(title, "](").concat(item.link, ")").concat(suffix));
    }
    return lines.join("\n");
}
function formatLinkLabel(link) {
    return link.replace(/^https?:\/\//i, "");
}
function renderRichResults(query, results, runtime) {
    runtime.log("".concat(theme_js_1.theme.heading("Docs search:"), " ").concat(theme_js_1.theme.info(query)));
    if (results.length === 0) {
        runtime.log(theme_js_1.theme.muted("No results."));
        return;
    }
    for (var _i = 0, results_2 = results; _i < results_2.length; _i++) {
        var item = results_2[_i];
        var linkLabel = formatLinkLabel(item.link);
        var link = (0, links_js_1.formatDocsLink)(item.link, linkLabel);
        runtime.log("".concat(theme_js_1.theme.muted("-"), " ").concat(theme_js_1.theme.command(item.title), " ").concat(theme_js_1.theme.muted("(")).concat(link).concat(theme_js_1.theme.muted(")")));
        if (item.snippet) {
            runtime.log("  ".concat(theme_js_1.theme.muted(item.snippet)));
        }
    }
}
function renderMarkdown(markdown, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            runtime.log(markdown.trimEnd());
            return [2 /*return*/];
        });
    });
}
function docsSearchCommand(queryParts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var query, docs, payload, res, err, results, markdown;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = queryParts.join(" ").trim();
                    if (!query) {
                        docs = (0, links_js_1.formatDocsLink)("/", "docs.openclaw.ai");
                        if ((0, theme_js_1.isRich)()) {
                            runtime.log("".concat(theme_js_1.theme.muted("Docs:"), " ").concat(docs));
                            runtime.log("".concat(theme_js_1.theme.muted("Search:"), " ").concat((0, command_format_js_1.formatCliCommand)('openclaw docs "your query"')));
                        }
                        else {
                            runtime.log("Docs: https://docs.openclaw.ai/");
                            runtime.log("Search: ".concat((0, command_format_js_1.formatCliCommand)('openclaw docs "your query"')));
                        }
                        return [2 /*return*/];
                    }
                    payload = JSON.stringify({ query: query });
                    return [4 /*yield*/, runTool("mcporter", ["call", SEARCH_TOOL, "--args", payload, "--output", "text"], { timeoutMs: SEARCH_TIMEOUT_MS })];
                case 1:
                    res = _a.sent();
                    if (res.code !== 0) {
                        err = res.stderr.trim() || res.stdout.trim() || "exit ".concat(res.code);
                        runtime.error("Docs search failed: ".concat(err));
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    results = parseSearchOutput(res.stdout);
                    if ((0, theme_js_1.isRich)()) {
                        renderRichResults(query, results, runtime);
                        return [2 /*return*/];
                    }
                    markdown = buildMarkdown(query, results);
                    return [4 /*yield*/, renderMarkdown(markdown, runtime)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
