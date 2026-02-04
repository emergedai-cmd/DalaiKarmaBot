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
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var moonshot_kimi_k2_1 = require("../ui/src/ui/data/moonshot-kimi-k2");
var here = node_path_1.default.dirname((0, node_url_1.fileURLToPath)(import.meta.url));
var repoRoot = node_path_1.default.resolve(here, "..");
function replaceBlockLines(text, startMarker, endMarker, lines) {
    var startIndex = text.indexOf(startMarker);
    if (startIndex === -1) {
        throw new Error("Missing start marker: ".concat(startMarker));
    }
    var endIndex = text.indexOf(endMarker, startIndex);
    if (endIndex === -1) {
        throw new Error("Missing end marker: ".concat(endMarker));
    }
    var startLineStart = text.lastIndexOf("\n", startIndex);
    var startLineStartIndex = startLineStart === -1 ? 0 : startLineStart + 1;
    var indent = text.slice(startLineStartIndex, startIndex);
    var endLineEnd = text.indexOf("\n", endIndex);
    var endLineEndIndex = endLineEnd === -1 ? text.length : endLineEnd + 1;
    var before = text.slice(0, startLineStartIndex);
    var after = text.slice(endLineEndIndex);
    var replacementLines = __spreadArray(__spreadArray([
        "".concat(indent).concat(startMarker)
    ], lines.map(function (line) { return "".concat(indent).concat(line); }), true), [
        "".concat(indent).concat(endMarker),
    ], false);
    var replacement = replacementLines.join("\n");
    if (!after) {
        return "".concat(before).concat(replacement);
    }
    return "".concat(before).concat(replacement, "\n").concat(after);
}
function renderKimiK2Ids(prefix) {
    return moonshot_kimi_k2_1.MOONSHOT_KIMI_K2_MODELS.map(function (model) { return "- `".concat(prefix).concat(model.id, "`"); });
}
function renderMoonshotAliases() {
    return moonshot_kimi_k2_1.MOONSHOT_KIMI_K2_MODELS.map(function (model, index) {
        var isLast = index === moonshot_kimi_k2_1.MOONSHOT_KIMI_K2_MODELS.length - 1;
        var suffix = isLast ? "" : ",";
        return "\"moonshot/".concat(model.id, "\": { alias: \"").concat(model.alias, "\" }").concat(suffix);
    });
}
function renderMoonshotModels() {
    var input = JSON.stringify(__spreadArray([], moonshot_kimi_k2_1.MOONSHOT_KIMI_K2_INPUT, true));
    var cost = "input: ".concat(moonshot_kimi_k2_1.MOONSHOT_KIMI_K2_COST.input, ", output: ").concat(moonshot_kimi_k2_1.MOONSHOT_KIMI_K2_COST.output, ", cacheRead: ").concat(moonshot_kimi_k2_1.MOONSHOT_KIMI_K2_COST.cacheRead, ", cacheWrite: ").concat(moonshot_kimi_k2_1.MOONSHOT_KIMI_K2_COST.cacheWrite);
    return moonshot_kimi_k2_1.MOONSHOT_KIMI_K2_MODELS.flatMap(function (model, index) {
        var isLast = index === moonshot_kimi_k2_1.MOONSHOT_KIMI_K2_MODELS.length - 1;
        var closing = isLast ? "}" : "},";
        return [
            "{",
            "  id: \"".concat(model.id, "\","),
            "  name: \"".concat(model.name, "\","),
            "  reasoning: ".concat(model.reasoning, ","),
            "  input: ".concat(input, ","),
            "  cost: { ".concat(cost, " },"),
            "  contextWindow: ".concat(moonshot_kimi_k2_1.MOONSHOT_KIMI_K2_CONTEXT_WINDOW, ","),
            "  maxTokens: ".concat(moonshot_kimi_k2_1.MOONSHOT_KIMI_K2_MAX_TOKENS),
            closing,
        ];
    });
}
function syncMoonshotDocs() {
    return __awaiter(this, void 0, void 0, function () {
        var moonshotDoc, conceptsDoc, moonshotText, conceptsText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    moonshotDoc = node_path_1.default.join(repoRoot, "docs/providers/moonshot.md");
                    conceptsDoc = node_path_1.default.join(repoRoot, "docs/concepts/model-providers.md");
                    return [4 /*yield*/, (0, promises_1.readFile)(moonshotDoc, "utf8")];
                case 1:
                    moonshotText = _a.sent();
                    moonshotText = replaceBlockLines(moonshotText, "{/_ moonshot-kimi-k2-ids:start _/ && null}", "{/_ moonshot-kimi-k2-ids:end _/ && null}", renderKimiK2Ids(""));
                    moonshotText = replaceBlockLines(moonshotText, "// moonshot-kimi-k2-aliases:start", "// moonshot-kimi-k2-aliases:end", renderMoonshotAliases());
                    moonshotText = replaceBlockLines(moonshotText, "// moonshot-kimi-k2-models:start", "// moonshot-kimi-k2-models:end", renderMoonshotModels());
                    return [4 /*yield*/, (0, promises_1.readFile)(conceptsDoc, "utf8")];
                case 2:
                    conceptsText = _a.sent();
                    conceptsText = replaceBlockLines(conceptsText, "{/_ moonshot-kimi-k2-model-refs:start _/ && null}", "{/_ moonshot-kimi-k2-model-refs:end _/ && null}", renderKimiK2Ids("moonshot/"));
                    return [4 /*yield*/, (0, promises_1.writeFile)(moonshotDoc, moonshotText)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(conceptsDoc, conceptsText)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
syncMoonshotDocs().catch(function (error) {
    console.error(error);
    process.exitCode = 1;
});
