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
exports.extractMSTeamsPollVote = extractMSTeamsPollVote;
exports.buildMSTeamsPollCard = buildMSTeamsPollCard;
exports.normalizeMSTeamsPollSelections = normalizeMSTeamsPollSelections;
exports.createMSTeamsPollStoreFs = createMSTeamsPollStoreFs;
var node_crypto_1 = require("node:crypto");
var storage_js_1 = require("./storage.js");
var store_fs_js_1 = require("./store-fs.js");
var STORE_FILENAME = "msteams-polls.json";
var MAX_POLLS = 1000;
var POLL_TTL_MS = 30 * 24 * 60 * 60 * 1000;
function isRecord(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function normalizeChoiceValue(value) {
    if (typeof value === "string") {
        var trimmed = value.trim();
        return trimmed ? trimmed : null;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
        return String(value);
    }
    return null;
}
function extractSelections(value) {
    if (Array.isArray(value)) {
        return value.map(normalizeChoiceValue).filter(function (entry) { return Boolean(entry); });
    }
    var normalized = normalizeChoiceValue(value);
    if (!normalized) {
        return [];
    }
    if (normalized.includes(",")) {
        return normalized
            .split(",")
            .map(function (entry) { return entry.trim(); })
            .filter(Boolean);
    }
    return [normalized];
}
function readNestedValue(value, keys) {
    var current = value;
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        if (!isRecord(current)) {
            return undefined;
        }
        current = current[key];
    }
    return current;
}
function readNestedString(value, keys) {
    var found = readNestedValue(value, keys);
    return typeof found === "string" && found.trim() ? found.trim() : undefined;
}
function extractMSTeamsPollVote(activity) {
    var _a, _b, _c, _d, _e, _f;
    var value = activity === null || activity === void 0 ? void 0 : activity.value;
    if (!value || !isRecord(value)) {
        return null;
    }
    var pollId = (_f = (_e = (_d = (_c = (_b = (_a = readNestedString(value, ["openclawPollId"])) !== null && _a !== void 0 ? _a : readNestedString(value, ["pollId"])) !== null && _b !== void 0 ? _b : readNestedString(value, ["openclaw", "pollId"])) !== null && _c !== void 0 ? _c : readNestedString(value, ["openclaw", "poll", "id"])) !== null && _d !== void 0 ? _d : readNestedString(value, ["data", "openclawPollId"])) !== null && _e !== void 0 ? _e : readNestedString(value, ["data", "pollId"])) !== null && _f !== void 0 ? _f : readNestedString(value, ["data", "openclaw", "pollId"]);
    if (!pollId) {
        return null;
    }
    var directSelections = extractSelections(value.choices);
    var nestedSelections = extractSelections(readNestedValue(value, ["choices"]));
    var dataSelections = extractSelections(readNestedValue(value, ["data", "choices"]));
    var selections = directSelections.length > 0
        ? directSelections
        : nestedSelections.length > 0
            ? nestedSelections
            : dataSelections;
    if (selections.length === 0) {
        return null;
    }
    return {
        pollId: pollId,
        selections: selections,
    };
}
function buildMSTeamsPollCard(params) {
    var _a;
    var pollId = (_a = params.pollId) !== null && _a !== void 0 ? _a : node_crypto_1.default.randomUUID();
    var maxSelections = typeof params.maxSelections === "number" && params.maxSelections > 1
        ? Math.floor(params.maxSelections)
        : 1;
    var cappedMaxSelections = Math.min(Math.max(1, maxSelections), params.options.length);
    var choices = params.options.map(function (option, index) { return ({
        title: option,
        value: String(index),
    }); });
    var hint = cappedMaxSelections > 1
        ? "Select up to ".concat(cappedMaxSelections, " option").concat(cappedMaxSelections === 1 ? "" : "s", ".")
        : "Select one option.";
    var card = {
        type: "AdaptiveCard",
        version: "1.5",
        body: [
            {
                type: "TextBlock",
                text: params.question,
                wrap: true,
                weight: "Bolder",
                size: "Medium",
            },
            {
                type: "Input.ChoiceSet",
                id: "choices",
                isMultiSelect: cappedMaxSelections > 1,
                style: "expanded",
                choices: choices,
            },
            {
                type: "TextBlock",
                text: hint,
                wrap: true,
                isSubtle: true,
                spacing: "Small",
            },
        ],
        actions: [
            {
                type: "Action.Submit",
                title: "Vote",
                data: {
                    openclawPollId: pollId,
                    pollId: pollId,
                },
                msteams: {
                    type: "messageBack",
                    text: "openclaw poll vote",
                    displayText: "Vote recorded",
                    value: { openclawPollId: pollId, pollId: pollId },
                },
            },
        ],
    };
    var fallbackLines = __spreadArray([
        "Poll: ".concat(params.question)
    ], params.options.map(function (option, index) { return "".concat(index + 1, ". ").concat(option); }), true);
    return {
        pollId: pollId,
        question: params.question,
        options: params.options,
        maxSelections: cappedMaxSelections,
        card: card,
        fallbackText: fallbackLines.join("\n"),
    };
}
function parseTimestamp(value) {
    if (!value) {
        return null;
    }
    var parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
}
function pruneExpired(polls) {
    var cutoff = Date.now() - POLL_TTL_MS;
    var entries = Object.entries(polls).filter(function (_a) {
        var _b, _c;
        var poll = _a[1];
        var ts = (_c = parseTimestamp((_b = poll.updatedAt) !== null && _b !== void 0 ? _b : poll.createdAt)) !== null && _c !== void 0 ? _c : 0;
        return ts >= cutoff;
    });
    return Object.fromEntries(entries);
}
function pruneToLimit(polls) {
    var entries = Object.entries(polls);
    if (entries.length <= MAX_POLLS) {
        return polls;
    }
    entries.sort(function (a, b) {
        var _a, _b, _c, _d;
        var aTs = (_b = parseTimestamp((_a = a[1].updatedAt) !== null && _a !== void 0 ? _a : a[1].createdAt)) !== null && _b !== void 0 ? _b : 0;
        var bTs = (_d = parseTimestamp((_c = b[1].updatedAt) !== null && _c !== void 0 ? _c : b[1].createdAt)) !== null && _d !== void 0 ? _d : 0;
        return aTs - bTs;
    });
    var keep = entries.slice(entries.length - MAX_POLLS);
    return Object.fromEntries(keep);
}
function normalizeMSTeamsPollSelections(poll, selections) {
    var maxSelections = Math.max(1, poll.maxSelections);
    var mapped = selections
        .map(function (entry) { return Number.parseInt(entry, 10); })
        .filter(function (value) { return Number.isFinite(value); })
        .filter(function (value) { return value >= 0 && value < poll.options.length; })
        .map(function (value) { return String(value); });
    var limited = maxSelections > 1 ? mapped.slice(0, maxSelections) : mapped.slice(0, 1);
    return Array.from(new Set(limited));
}
function createMSTeamsPollStoreFs(params) {
    var _this = this;
    var filePath = (0, storage_js_1.resolveMSTeamsStorePath)({
        filename: STORE_FILENAME,
        env: params === null || params === void 0 ? void 0 : params.env,
        homedir: params === null || params === void 0 ? void 0 : params.homedir,
        stateDir: params === null || params === void 0 ? void 0 : params.stateDir,
        storePath: params === null || params === void 0 ? void 0 : params.storePath,
    });
    var empty = { version: 1, polls: {} };
    var readStore = function () { return __awaiter(_this, void 0, void 0, function () {
        var value, pruned;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, store_fs_js_1.readJsonFile)(filePath, empty)];
                case 1:
                    value = (_b.sent()).value;
                    pruned = pruneToLimit(pruneExpired((_a = value.polls) !== null && _a !== void 0 ? _a : {}));
                    return [2 /*return*/, { version: 1, polls: pruned }];
            }
        });
    }); };
    var writeStore = function (data) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, store_fs_js_1.writeJsonFile)(filePath, data)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var createPoll = function (poll) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, store_fs_js_1.withFileLock)(filePath, empty, function () { return __awaiter(_this, void 0, void 0, function () {
                        var data;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, readStore()];
                                case 1:
                                    data = _a.sent();
                                    data.polls[poll.id] = poll;
                                    return [4 /*yield*/, writeStore({ version: 1, polls: pruneToLimit(data.polls) })];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var getPoll = function (pollId) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, store_fs_js_1.withFileLock)(filePath, empty, function () { return __awaiter(_this, void 0, void 0, function () {
                        var data;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, readStore()];
                                case 1:
                                    data = _b.sent();
                                    return [2 /*return*/, (_a = data.polls[pollId]) !== null && _a !== void 0 ? _a : null];
                            }
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    var recordVote = function (params) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, store_fs_js_1.withFileLock)(filePath, empty, function () { return __awaiter(_this, void 0, void 0, function () {
                        var data, poll, normalized;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, readStore()];
                                case 1:
                                    data = _a.sent();
                                    poll = data.polls[params.pollId];
                                    if (!poll) {
                                        return [2 /*return*/, null];
                                    }
                                    normalized = normalizeMSTeamsPollSelections(poll, params.selections);
                                    poll.votes[params.voterId] = normalized;
                                    poll.updatedAt = new Date().toISOString();
                                    data.polls[poll.id] = poll;
                                    return [4 /*yield*/, writeStore({ version: 1, polls: pruneToLimit(data.polls) })];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/, poll];
                            }
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    return { createPoll: createPoll, getPoll: getPoll, recordVote: recordVote };
}
