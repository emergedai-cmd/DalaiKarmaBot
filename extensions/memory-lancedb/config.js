"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryConfigSchema = exports.MEMORY_CATEGORIES = void 0;
exports.vectorDimsForModel = vectorDimsForModel;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
exports.MEMORY_CATEGORIES = ["preference", "fact", "decision", "entity", "other"];
var DEFAULT_MODEL = "text-embedding-3-small";
var LEGACY_STATE_DIRS = [];
function resolveDefaultDbPath() {
    var home = (0, node_os_1.homedir)();
    var preferred = (0, node_path_1.join)(home, ".openclaw", "memory", "lancedb");
    try {
        if (node_fs_1.default.existsSync(preferred)) {
            return preferred;
        }
    }
    catch (_a) {
        // best-effort
    }
    for (var _i = 0, LEGACY_STATE_DIRS_1 = LEGACY_STATE_DIRS; _i < LEGACY_STATE_DIRS_1.length; _i++) {
        var legacy = LEGACY_STATE_DIRS_1[_i];
        var candidate = (0, node_path_1.join)(home, legacy, "memory", "lancedb");
        try {
            if (node_fs_1.default.existsSync(candidate)) {
                return candidate;
            }
        }
        catch (_b) {
            // best-effort
        }
    }
    return preferred;
}
var DEFAULT_DB_PATH = resolveDefaultDbPath();
var EMBEDDING_DIMENSIONS = {
    "text-embedding-3-small": 1536,
    "text-embedding-3-large": 3072,
};
function assertAllowedKeys(value, allowed, label) {
    var unknown = Object.keys(value).filter(function (key) { return !allowed.includes(key); });
    if (unknown.length === 0) {
        return;
    }
    throw new Error("".concat(label, " has unknown keys: ").concat(unknown.join(", ")));
}
function vectorDimsForModel(model) {
    var dims = EMBEDDING_DIMENSIONS[model];
    if (!dims) {
        throw new Error("Unsupported embedding model: ".concat(model));
    }
    return dims;
}
function resolveEnvVars(value) {
    return value.replace(/\$\{([^}]+)\}/g, function (_, envVar) {
        var envValue = process.env[envVar];
        if (!envValue) {
            throw new Error("Environment variable ".concat(envVar, " is not set"));
        }
        return envValue;
    });
}
function resolveEmbeddingModel(embedding) {
    var model = typeof embedding.model === "string" ? embedding.model : DEFAULT_MODEL;
    vectorDimsForModel(model);
    return model;
}
exports.memoryConfigSchema = {
    parse: function (value) {
        if (!value || typeof value !== "object" || Array.isArray(value)) {
            throw new Error("memory config required");
        }
        var cfg = value;
        assertAllowedKeys(cfg, ["embedding", "dbPath", "autoCapture", "autoRecall"], "memory config");
        var embedding = cfg.embedding;
        if (!embedding || typeof embedding.apiKey !== "string") {
            throw new Error("embedding.apiKey is required");
        }
        assertAllowedKeys(embedding, ["apiKey", "model"], "embedding config");
        var model = resolveEmbeddingModel(embedding);
        return {
            embedding: {
                provider: "openai",
                model: model,
                apiKey: resolveEnvVars(embedding.apiKey),
            },
            dbPath: typeof cfg.dbPath === "string" ? cfg.dbPath : DEFAULT_DB_PATH,
            autoCapture: cfg.autoCapture !== false,
            autoRecall: cfg.autoRecall !== false,
        };
    },
    uiHints: {
        "embedding.apiKey": {
            label: "OpenAI API Key",
            sensitive: true,
            placeholder: "sk-proj-...",
            help: "API key for OpenAI embeddings (or use ${OPENAI_API_KEY})",
        },
        "embedding.model": {
            label: "Embedding Model",
            placeholder: DEFAULT_MODEL,
            help: "OpenAI embedding model to use",
        },
        dbPath: {
            label: "Database Path",
            placeholder: "~/.openclaw/memory/lancedb",
            advanced: true,
        },
        autoCapture: {
            label: "Auto-Capture",
            help: "Automatically capture important information from conversations",
        },
        autoRecall: {
            label: "Auto-Recall",
            help: "Automatically inject relevant memories into context",
        },
    },
};
