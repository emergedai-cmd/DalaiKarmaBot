"use strict";
/**
 * OpenClaw Memory (LanceDB) Plugin
 *
 * Long-term memory with vector search for AI conversations.
 * Uses LanceDB for storage and OpenAI for embeddings.
 * Provides seamless auto-recall and auto-capture via lifecycle hooks.
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
Object.defineProperty(exports, "__esModule", { value: true });
var lancedb = require("@lancedb/lancedb");
var typebox_1 = require("@sinclair/typebox");
var node_crypto_1 = require("node:crypto");
var openai_1 = require("openai");
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var config_js_1 = require("./config.js");
// ============================================================================
// LanceDB Provider
// ============================================================================
var TABLE_NAME = "memories";
var MemoryDB = /** @class */ (function () {
    function MemoryDB(dbPath, vectorDim) {
        this.dbPath = dbPath;
        this.vectorDim = vectorDim;
        this.db = null;
        this.table = null;
        this.initPromise = null;
    }
    MemoryDB.prototype.ensureInitialized = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.table) {
                    return [2 /*return*/];
                }
                if (this.initPromise) {
                    return [2 /*return*/, this.initPromise];
                }
                this.initPromise = this.doInitialize();
                return [2 /*return*/, this.initPromise];
            });
        });
    };
    MemoryDB.prototype.doInitialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, tables, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, lancedb.connect(this.dbPath)];
                    case 1:
                        _a.db = _d.sent();
                        return [4 /*yield*/, this.db.tableNames()];
                    case 2:
                        tables = _d.sent();
                        if (!tables.includes(TABLE_NAME)) return [3 /*break*/, 4];
                        _b = this;
                        return [4 /*yield*/, this.db.openTable(TABLE_NAME)];
                    case 3:
                        _b.table = _d.sent();
                        return [3 /*break*/, 7];
                    case 4:
                        _c = this;
                        return [4 /*yield*/, this.db.createTable(TABLE_NAME, [
                                {
                                    id: "__schema__",
                                    text: "",
                                    vector: Array.from({ length: this.vectorDim }).fill(0),
                                    importance: 0,
                                    category: "other",
                                    createdAt: 0,
                                },
                            ])];
                    case 5:
                        _c.table = _d.sent();
                        return [4 /*yield*/, this.table.delete('id = "__schema__"')];
                    case 6:
                        _d.sent();
                        _d.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MemoryDB.prototype.store = function (entry) {
        return __awaiter(this, void 0, void 0, function () {
            var fullEntry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureInitialized()];
                    case 1:
                        _a.sent();
                        fullEntry = __assign(__assign({}, entry), { id: (0, node_crypto_1.randomUUID)(), createdAt: Date.now() });
                        return [4 /*yield*/, this.table.add([fullEntry])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, fullEntry];
                }
            });
        });
    };
    MemoryDB.prototype.search = function (vector_1) {
        return __awaiter(this, arguments, void 0, function (vector, limit, minScore) {
            var results, mapped;
            if (limit === void 0) { limit = 5; }
            if (minScore === void 0) { minScore = 0.5; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureInitialized()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.table.vectorSearch(vector).limit(limit).toArray()];
                    case 2:
                        results = _a.sent();
                        mapped = results.map(function (row) {
                            var _a;
                            var distance = (_a = row._distance) !== null && _a !== void 0 ? _a : 0;
                            // Use inverse for a 0-1 range: sim = 1 / (1 + d)
                            var score = 1 / (1 + distance);
                            return {
                                entry: {
                                    id: row.id,
                                    text: row.text,
                                    vector: row.vector,
                                    importance: row.importance,
                                    category: row.category,
                                    createdAt: row.createdAt,
                                },
                                score: score,
                            };
                        });
                        return [2 /*return*/, mapped.filter(function (r) { return r.score >= minScore; })];
                }
            });
        });
    };
    MemoryDB.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var uuidRegex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureInitialized()];
                    case 1:
                        _a.sent();
                        uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                        if (!uuidRegex.test(id)) {
                            throw new Error("Invalid memory ID format: ".concat(id));
                        }
                        return [4 /*yield*/, this.table.delete("id = '".concat(id, "'"))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    MemoryDB.prototype.count = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureInitialized()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.table.countRows()];
                }
            });
        });
    };
    return MemoryDB;
}());
// ============================================================================
// OpenAI Embeddings
// ============================================================================
var Embeddings = /** @class */ (function () {
    function Embeddings(apiKey, model) {
        this.model = model;
        this.client = new openai_1.default({ apiKey: apiKey });
    }
    Embeddings.prototype.embed = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.embeddings.create({
                            model: this.model,
                            input: text,
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data[0].embedding];
                }
            });
        });
    };
    return Embeddings;
}());
// ============================================================================
// Rule-based capture filter
// ============================================================================
var MEMORY_TRIGGERS = [
    /zapamatuj si|pamatuj|remember/i,
    /preferuji|radši|nechci|prefer/i,
    /rozhodli jsme|budeme používat/i,
    /\+\d{10,}/,
    /[\w.-]+@[\w.-]+\.\w+/,
    /můj\s+\w+\s+je|je\s+můj/i,
    /my\s+\w+\s+is|is\s+my/i,
    /i (like|prefer|hate|love|want|need)/i,
    /always|never|important/i,
];
function shouldCapture(text) {
    if (text.length < 10 || text.length > 500) {
        return false;
    }
    // Skip injected context from memory recall
    if (text.includes("<relevant-memories>")) {
        return false;
    }
    // Skip system-generated content
    if (text.startsWith("<") && text.includes("</")) {
        return false;
    }
    // Skip agent summary responses (contain markdown formatting)
    if (text.includes("**") && text.includes("\n-")) {
        return false;
    }
    // Skip emoji-heavy responses (likely agent output)
    var emojiCount = (text.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
    if (emojiCount > 3) {
        return false;
    }
    return MEMORY_TRIGGERS.some(function (r) { return r.test(text); });
}
function detectCategory(text) {
    var lower = text.toLowerCase();
    if (/prefer|radši|like|love|hate|want/i.test(lower)) {
        return "preference";
    }
    if (/rozhodli|decided|will use|budeme/i.test(lower)) {
        return "decision";
    }
    if (/\+\d{10,}|@[\w.-]+\.\w+|is called|jmenuje se/i.test(lower)) {
        return "entity";
    }
    if (/is|are|has|have|je|má|jsou/i.test(lower)) {
        return "fact";
    }
    return "other";
}
// ============================================================================
// Plugin Definition
// ============================================================================
var memoryPlugin = {
    id: "memory-lancedb",
    name: "Memory (LanceDB)",
    description: "LanceDB-backed long-term memory with auto-recall/capture",
    kind: "memory",
    configSchema: config_js_1.memoryConfigSchema,
    register: function (api) {
        var _this = this;
        var _a;
        var cfg = config_js_1.memoryConfigSchema.parse(api.pluginConfig);
        var resolvedDbPath = api.resolvePath(cfg.dbPath);
        var vectorDim = (0, config_js_1.vectorDimsForModel)((_a = cfg.embedding.model) !== null && _a !== void 0 ? _a : "text-embedding-3-small");
        var db = new MemoryDB(resolvedDbPath, vectorDim);
        var embeddings = new Embeddings(cfg.embedding.apiKey, cfg.embedding.model);
        api.logger.info("memory-lancedb: plugin registered (db: ".concat(resolvedDbPath, ", lazy init)"));
        // ========================================================================
        // Tools
        // ========================================================================
        api.registerTool({
            name: "memory_recall",
            label: "Memory Recall",
            description: "Search through long-term memories. Use when you need context about user preferences, past decisions, or previously discussed topics.",
            parameters: typebox_1.Type.Object({
                query: typebox_1.Type.String({ description: "Search query" }),
                limit: typebox_1.Type.Optional(typebox_1.Type.Number({ description: "Max results (default: 5)" })),
            }),
            execute: function (_toolCallId, params) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, query, _b, limit, vector, results, text, sanitizedResults;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _a = params, query = _a.query, _b = _a.limit, limit = _b === void 0 ? 5 : _b;
                                return [4 /*yield*/, embeddings.embed(query)];
                            case 1:
                                vector = _c.sent();
                                return [4 /*yield*/, db.search(vector, limit, 0.1)];
                            case 2:
                                results = _c.sent();
                                if (results.length === 0) {
                                    return [2 /*return*/, {
                                            content: [{ type: "text", text: "No relevant memories found." }],
                                            details: { count: 0 },
                                        }];
                                }
                                text = results
                                    .map(function (r, i) {
                                    return "".concat(i + 1, ". [").concat(r.entry.category, "] ").concat(r.entry.text, " (").concat((r.score * 100).toFixed(0), "%)");
                                })
                                    .join("\n");
                                sanitizedResults = results.map(function (r) { return ({
                                    id: r.entry.id,
                                    text: r.entry.text,
                                    category: r.entry.category,
                                    importance: r.entry.importance,
                                    score: r.score,
                                }); });
                                return [2 /*return*/, {
                                        content: [{ type: "text", text: "Found ".concat(results.length, " memories:\n\n").concat(text) }],
                                        details: { count: results.length, memories: sanitizedResults },
                                    }];
                        }
                    });
                });
            },
        }, { name: "memory_recall" });
        api.registerTool({
            name: "memory_store",
            label: "Memory Store",
            description: "Save important information in long-term memory. Use for preferences, facts, decisions.",
            parameters: typebox_1.Type.Object({
                text: typebox_1.Type.String({ description: "Information to remember" }),
                importance: typebox_1.Type.Optional(typebox_1.Type.Number({ description: "Importance 0-1 (default: 0.7)" })),
                category: typebox_1.Type.Optional((0, plugin_sdk_1.stringEnum)(config_js_1.MEMORY_CATEGORIES)),
            }),
            execute: function (_toolCallId, params) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, text, _b, importance, _c, category, vector, existing, entry;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _a = params, text = _a.text, _b = _a.importance, importance = _b === void 0 ? 0.7 : _b, _c = _a.category, category = _c === void 0 ? "other" : _c;
                                return [4 /*yield*/, embeddings.embed(text)];
                            case 1:
                                vector = _d.sent();
                                return [4 /*yield*/, db.search(vector, 1, 0.95)];
                            case 2:
                                existing = _d.sent();
                                if (existing.length > 0) {
                                    return [2 /*return*/, {
                                            content: [
                                                {
                                                    type: "text",
                                                    text: "Similar memory already exists: \"".concat(existing[0].entry.text, "\""),
                                                },
                                            ],
                                            details: {
                                                action: "duplicate",
                                                existingId: existing[0].entry.id,
                                                existingText: existing[0].entry.text,
                                            },
                                        }];
                                }
                                return [4 /*yield*/, db.store({
                                        text: text,
                                        vector: vector,
                                        importance: importance,
                                        category: category,
                                    })];
                            case 3:
                                entry = _d.sent();
                                return [2 /*return*/, {
                                        content: [{ type: "text", text: "Stored: \"".concat(text.slice(0, 100), "...\"") }],
                                        details: { action: "created", id: entry.id },
                                    }];
                        }
                    });
                });
            },
        }, { name: "memory_store" });
        api.registerTool({
            name: "memory_forget",
            label: "Memory Forget",
            description: "Delete specific memories. GDPR-compliant.",
            parameters: typebox_1.Type.Object({
                query: typebox_1.Type.Optional(typebox_1.Type.String({ description: "Search to find memory" })),
                memoryId: typebox_1.Type.Optional(typebox_1.Type.String({ description: "Specific memory ID" })),
            }),
            execute: function (_toolCallId, params) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, query, memoryId, vector, results, list, sanitizedCandidates;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = params, query = _a.query, memoryId = _a.memoryId;
                                if (!memoryId) return [3 /*break*/, 2];
                                return [4 /*yield*/, db.delete(memoryId)];
                            case 1:
                                _b.sent();
                                return [2 /*return*/, {
                                        content: [{ type: "text", text: "Memory ".concat(memoryId, " forgotten.") }],
                                        details: { action: "deleted", id: memoryId },
                                    }];
                            case 2:
                                if (!query) return [3 /*break*/, 7];
                                return [4 /*yield*/, embeddings.embed(query)];
                            case 3:
                                vector = _b.sent();
                                return [4 /*yield*/, db.search(vector, 5, 0.7)];
                            case 4:
                                results = _b.sent();
                                if (results.length === 0) {
                                    return [2 /*return*/, {
                                            content: [{ type: "text", text: "No matching memories found." }],
                                            details: { found: 0 },
                                        }];
                                }
                                if (!(results.length === 1 && results[0].score > 0.9)) return [3 /*break*/, 6];
                                return [4 /*yield*/, db.delete(results[0].entry.id)];
                            case 5:
                                _b.sent();
                                return [2 /*return*/, {
                                        content: [{ type: "text", text: "Forgotten: \"".concat(results[0].entry.text, "\"") }],
                                        details: { action: "deleted", id: results[0].entry.id },
                                    }];
                            case 6:
                                list = results
                                    .map(function (r) { return "- [".concat(r.entry.id.slice(0, 8), "] ").concat(r.entry.text.slice(0, 60), "..."); })
                                    .join("\n");
                                sanitizedCandidates = results.map(function (r) { return ({
                                    id: r.entry.id,
                                    text: r.entry.text,
                                    category: r.entry.category,
                                    score: r.score,
                                }); });
                                return [2 /*return*/, {
                                        content: [
                                            {
                                                type: "text",
                                                text: "Found ".concat(results.length, " candidates. Specify memoryId:\n").concat(list),
                                            },
                                        ],
                                        details: { action: "candidates", candidates: sanitizedCandidates },
                                    }];
                            case 7: return [2 /*return*/, {
                                    content: [{ type: "text", text: "Provide query or memoryId." }],
                                    details: { error: "missing_param" },
                                }];
                        }
                    });
                });
            },
        }, { name: "memory_forget" });
        // ========================================================================
        // CLI Commands
        // ========================================================================
        api.registerCli(function (_a) {
            var program = _a.program;
            var memory = program.command("ltm").description("LanceDB memory plugin commands");
            memory
                .command("list")
                .description("List memories")
                .action(function () { return __awaiter(_this, void 0, void 0, function () {
                var count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, db.count()];
                        case 1:
                            count = _a.sent();
                            console.log("Total memories: ".concat(count));
                            return [2 /*return*/];
                    }
                });
            }); });
            memory
                .command("search")
                .description("Search memories")
                .argument("<query>", "Search query")
                .option("--limit <n>", "Max results", "5")
                .action(function (query, opts) { return __awaiter(_this, void 0, void 0, function () {
                var vector, results, output;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, embeddings.embed(query)];
                        case 1:
                            vector = _a.sent();
                            return [4 /*yield*/, db.search(vector, parseInt(opts.limit), 0.3)];
                        case 2:
                            results = _a.sent();
                            output = results.map(function (r) { return ({
                                id: r.entry.id,
                                text: r.entry.text,
                                category: r.entry.category,
                                importance: r.entry.importance,
                                score: r.score,
                            }); });
                            console.log(JSON.stringify(output, null, 2));
                            return [2 /*return*/];
                    }
                });
            }); });
            memory
                .command("stats")
                .description("Show memory statistics")
                .action(function () { return __awaiter(_this, void 0, void 0, function () {
                var count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, db.count()];
                        case 1:
                            count = _a.sent();
                            console.log("Total memories: ".concat(count));
                            return [2 /*return*/];
                    }
                });
            }); });
        }, { commands: ["ltm"] });
        // ========================================================================
        // Lifecycle Hooks
        // ========================================================================
        // Auto-recall: inject relevant memories before agent starts
        if (cfg.autoRecall) {
            api.on("before_agent_start", function (event) { return __awaiter(_this, void 0, void 0, function () {
                var vector, results, memoryContext, err_1;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!event.prompt || event.prompt.length < 5) {
                                return [2 /*return*/];
                            }
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, embeddings.embed(event.prompt)];
                        case 2:
                            vector = _c.sent();
                            return [4 /*yield*/, db.search(vector, 3, 0.3)];
                        case 3:
                            results = _c.sent();
                            if (results.length === 0) {
                                return [2 /*return*/];
                            }
                            memoryContext = results
                                .map(function (r) { return "- [".concat(r.entry.category, "] ").concat(r.entry.text); })
                                .join("\n");
                            (_b = (_a = api.logger).info) === null || _b === void 0 ? void 0 : _b.call(_a, "memory-lancedb: injecting ".concat(results.length, " memories into context"));
                            return [2 /*return*/, {
                                    prependContext: "<relevant-memories>\nThe following memories may be relevant to this conversation:\n".concat(memoryContext, "\n</relevant-memories>"),
                                }];
                        case 4:
                            err_1 = _c.sent();
                            api.logger.warn("memory-lancedb: recall failed: ".concat(String(err_1)));
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
        }
        // Auto-capture: analyze and store important information after agent ends
        if (cfg.autoCapture) {
            api.on("agent_end", function (event) { return __awaiter(_this, void 0, void 0, function () {
                var texts, _i, _a, msg, msgObj, role, content, _b, content_1, block, toCapture, stored, _c, _d, text, category, vector, existing, err_2;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!event.success || !event.messages || event.messages.length === 0) {
                                return [2 /*return*/];
                            }
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 8, , 9]);
                            texts = [];
                            for (_i = 0, _a = event.messages; _i < _a.length; _i++) {
                                msg = _a[_i];
                                // Type guard for message object
                                if (!msg || typeof msg !== "object") {
                                    continue;
                                }
                                msgObj = msg;
                                role = msgObj.role;
                                if (role !== "user" && role !== "assistant") {
                                    continue;
                                }
                                content = msgObj.content;
                                // Handle string content directly
                                if (typeof content === "string") {
                                    texts.push(content);
                                    continue;
                                }
                                // Handle array content (content blocks)
                                if (Array.isArray(content)) {
                                    for (_b = 0, content_1 = content; _b < content_1.length; _b++) {
                                        block = content_1[_b];
                                        if (block &&
                                            typeof block === "object" &&
                                            "type" in block &&
                                            block.type === "text" &&
                                            "text" in block &&
                                            typeof block.text === "string") {
                                            texts.push(block.text);
                                        }
                                    }
                                }
                            }
                            toCapture = texts.filter(function (text) { return text && shouldCapture(text); });
                            if (toCapture.length === 0) {
                                return [2 /*return*/];
                            }
                            stored = 0;
                            _c = 0, _d = toCapture.slice(0, 3);
                            _e.label = 2;
                        case 2:
                            if (!(_c < _d.length)) return [3 /*break*/, 7];
                            text = _d[_c];
                            category = detectCategory(text);
                            return [4 /*yield*/, embeddings.embed(text)];
                        case 3:
                            vector = _e.sent();
                            return [4 /*yield*/, db.search(vector, 1, 0.95)];
                        case 4:
                            existing = _e.sent();
                            if (existing.length > 0) {
                                return [3 /*break*/, 6];
                            }
                            return [4 /*yield*/, db.store({
                                    text: text,
                                    vector: vector,
                                    importance: 0.7,
                                    category: category,
                                })];
                        case 5:
                            _e.sent();
                            stored++;
                            _e.label = 6;
                        case 6:
                            _c++;
                            return [3 /*break*/, 2];
                        case 7:
                            if (stored > 0) {
                                api.logger.info("memory-lancedb: auto-captured ".concat(stored, " memories"));
                            }
                            return [3 /*break*/, 9];
                        case 8:
                            err_2 = _e.sent();
                            api.logger.warn("memory-lancedb: capture failed: ".concat(String(err_2)));
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            }); });
        }
        // ========================================================================
        // Service
        // ========================================================================
        api.registerService({
            id: "memory-lancedb",
            start: function () {
                api.logger.info("memory-lancedb: initialized (db: ".concat(resolvedDbPath, ", model: ").concat(cfg.embedding.model, ")"));
            },
            stop: function () {
                api.logger.info("memory-lancedb: stopped");
            },
        });
    },
};
exports.default = memoryPlugin;
