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
exports.readFileTailLines = readFileTailLines;
exports.summarizeLogTail = summarizeLogTail;
exports.pickGatewaySelfPresence = pickGatewaySelfPresence;
var promises_1 = require("node:fs/promises");
function readFileTailLines(filePath, maxLines) {
    return __awaiter(this, void 0, void 0, function () {
        var raw, lines, out;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.readFile(filePath, "utf8").catch(function () { return ""; })];
                case 1:
                    raw = _a.sent();
                    if (!raw.trim()) {
                        return [2 /*return*/, []];
                    }
                    lines = raw.replace(/\r/g, "").split("\n");
                    out = lines.slice(Math.max(0, lines.length - maxLines));
                    return [2 /*return*/, out.map(function (line) { return line.trimEnd(); }).filter(function (line) { return line.trim().length > 0; })];
            }
        });
    });
}
function countMatches(haystack, needle) {
    if (!haystack || !needle) {
        return 0;
    }
    return haystack.split(needle).length - 1;
}
function shorten(message, maxLen) {
    var cleaned = message.replace(/\s+/g, " ").trim();
    if (cleaned.length <= maxLen) {
        return cleaned;
    }
    return "".concat(cleaned.slice(0, Math.max(0, maxLen - 1)), "\u2026");
}
function normalizeGwsLine(line) {
    return line
        .replace(/\s+runId=[^\s]+/g, "")
        .replace(/\s+conn=[^\s]+/g, "")
        .replace(/\s+id=[^\s]+/g, "")
        .replace(/\s+error=Error:.*$/g, "")
        .trim();
}
function consumeJsonBlock(lines, startIndex) {
    var _a, _b, _c, _d;
    var startLine = (_a = lines[startIndex]) !== null && _a !== void 0 ? _a : "";
    var braceAt = startLine.indexOf("{");
    if (braceAt < 0) {
        return null;
    }
    var parts = [startLine.slice(braceAt)];
    var depth = countMatches((_b = parts[0]) !== null && _b !== void 0 ? _b : "", "{") - countMatches((_c = parts[0]) !== null && _c !== void 0 ? _c : "", "}");
    var i = startIndex;
    while (depth > 0 && i + 1 < lines.length) {
        i += 1;
        var next = (_d = lines[i]) !== null && _d !== void 0 ? _d : "";
        parts.push(next);
        depth += countMatches(next, "{") - countMatches(next, "}");
    }
    return { json: parts.join("\n"), endIndex: i };
}
function summarizeLogTail(rawLines, opts) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var maxLines = Math.max(6, (_a = opts === null || opts === void 0 ? void 0 : opts.maxLines) !== null && _a !== void 0 ? _a : 26);
    var out = [];
    var groups = new Map();
    var addGroup = function (key, base) {
        var existing = groups.get(key);
        if (existing) {
            existing.count += 1;
            return;
        }
        groups.set(key, { count: 1, index: out.length, base: base });
        out.push(base);
    };
    var addLine = function (line) {
        var trimmed = line.trimEnd();
        if (!trimmed) {
            return;
        }
        out.push(trimmed);
    };
    var lines = rawLines.map(function (line) { return line.trimEnd(); }).filter(Boolean);
    var _loop_1 = function (i) {
        var line = (_b = lines[i]) !== null && _b !== void 0 ? _b : "";
        var trimmedStart = line.trimStart();
        if ((trimmedStart.startsWith('"') ||
            trimmedStart === "}" ||
            trimmedStart === "{" ||
            trimmedStart.startsWith("}") ||
            trimmedStart.startsWith("{")) &&
            !trimmedStart.startsWith("[") &&
            !trimmedStart.startsWith("#")) {
            return out_i_1 = i, "continue";
        }
        // "[openai-codex] Token refresh failed: 401 { ...json... }"
        var tokenRefresh = line.match(/^\[([^\]]+)\]\s+Token refresh failed:\s*(\d+)\s*(\{)?\s*$/);
        if (tokenRefresh) {
            var tag = (_c = tokenRefresh[1]) !== null && _c !== void 0 ? _c : "unknown";
            var status_1 = (_d = tokenRefresh[2]) !== null && _d !== void 0 ? _d : "unknown";
            var block_1 = consumeJsonBlock(lines, i);
            if (block_1) {
                i = block_1.endIndex;
                var parsed = (function () {
                    try {
                        return JSON.parse(block_1.json);
                    }
                    catch (_a) {
                        return null;
                    }
                })();
                var code = ((_f = (_e = parsed === null || parsed === void 0 ? void 0 : parsed.error) === null || _e === void 0 ? void 0 : _e.code) === null || _f === void 0 ? void 0 : _f.trim()) || null;
                var msg = ((_h = (_g = parsed === null || parsed === void 0 ? void 0 : parsed.error) === null || _g === void 0 ? void 0 : _g.message) === null || _h === void 0 ? void 0 : _h.trim()) || null;
                var msgShort = msg
                    ? msg.toLowerCase().includes("signing in again")
                        ? "re-auth required"
                        : shorten(msg, 52)
                    : null;
                var base = "[".concat(tag, "] token refresh ").concat(status_1).concat(code ? " ".concat(code) : "").concat(msgShort ? " \u00B7 ".concat(msgShort) : "");
                addGroup("token:".concat(tag, ":").concat(status_1, ":").concat(code !== null && code !== void 0 ? code : "", ":").concat(msgShort !== null && msgShort !== void 0 ? msgShort : ""), base);
                return out_i_1 = i, "continue";
            }
        }
        // "Embedded agent failed before reply: OAuth token refresh failed for openai-codex: ..."
        var embedded = line.match(/^Embedded agent failed before reply:\s+OAuth token refresh failed for ([^:]+):/);
        if (embedded) {
            var provider = ((_j = embedded[1]) === null || _j === void 0 ? void 0 : _j.trim()) || "unknown";
            addGroup("embedded:".concat(provider), "Embedded agent: OAuth token refresh failed (".concat(provider, ")"));
            return out_i_1 = i, "continue";
        }
        // "[gws] ⇄ res ✗ agent ... errorCode=UNAVAILABLE errorMessage=Error: OAuth token refresh failed ... runId=..."
        if (line.startsWith("[gws]") &&
            line.includes("errorCode=UNAVAILABLE") &&
            line.includes("OAuth token refresh failed")) {
            var normalized = normalizeGwsLine(line);
            addGroup("gws:".concat(normalized), normalized);
            return out_i_1 = i, "continue";
        }
        addLine(line);
        out_i_1 = i;
    };
    var out_i_1;
    for (var i = 0; i < lines.length; i += 1) {
        _loop_1(i);
        i = out_i_1;
    }
    for (var _i = 0, _k = groups.values(); _i < _k.length; _i++) {
        var g = _k[_i];
        if (g.count <= 1) {
            continue;
        }
        out[g.index] = "".concat(g.base, " \u00D7").concat(g.count);
    }
    var deduped = [];
    for (var _l = 0, out_1 = out; _l < out_1.length; _l++) {
        var line = out_1[_l];
        if (deduped[deduped.length - 1] === line) {
            continue;
        }
        deduped.push(line);
    }
    if (deduped.length <= maxLines) {
        return deduped;
    }
    var head = Math.min(6, Math.floor(maxLines / 3));
    var tail = Math.max(1, maxLines - head - 1);
    var kept = __spreadArray(__spreadArray(__spreadArray([], deduped.slice(0, head), true), [
        "\u2026 ".concat(deduped.length - head - tail, " lines omitted \u2026")
    ], false), deduped.slice(-tail), true);
    return kept;
}
function pickGatewaySelfPresence(presence) {
    var _a;
    if (!Array.isArray(presence)) {
        return null;
    }
    var entries = presence;
    var self = (_a = entries.find(function (e) { return e.mode === "gateway" && e.reason === "self"; })) !== null && _a !== void 0 ? _a : null;
    if (!self) {
        return null;
    }
    return {
        host: typeof self.host === "string" ? self.host : undefined,
        ip: typeof self.ip === "string" ? self.ip : undefined,
        version: typeof self.version === "string" ? self.version : undefined,
        platform: typeof self.platform === "string" ? self.platform : undefined,
    };
}
