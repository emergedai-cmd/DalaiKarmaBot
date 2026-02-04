"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var memory_search_js_1 = require("./memory-search.js");
(0, vitest_1.describe)("memory search config", function () {
    (0, vitest_1.it)("returns null when disabled", function () {
        var cfg = {
            agents: {
                defaults: {
                    memorySearch: { enabled: true },
                },
                list: [
                    {
                        id: "main",
                        default: true,
                        memorySearch: { enabled: false },
                    },
                ],
            },
        };
        var resolved = (0, memory_search_js_1.resolveMemorySearchConfig)(cfg, "main");
        (0, vitest_1.expect)(resolved).toBeNull();
    });
    (0, vitest_1.it)("defaults provider to auto when unspecified", function () {
        var cfg = {
            agents: {
                defaults: {
                    memorySearch: {
                        enabled: true,
                    },
                },
            },
        };
        var resolved = (0, memory_search_js_1.resolveMemorySearchConfig)(cfg, "main");
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.provider).toBe("auto");
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.fallback).toBe("none");
    });
    (0, vitest_1.it)("merges defaults and overrides", function () {
        var cfg = {
            agents: {
                defaults: {
                    memorySearch: {
                        provider: "openai",
                        model: "text-embedding-3-small",
                        store: {
                            vector: {
                                enabled: false,
                                extensionPath: "/opt/sqlite-vec.dylib",
                            },
                        },
                        chunking: { tokens: 500, overlap: 100 },
                        query: { maxResults: 4, minScore: 0.2 },
                    },
                },
                list: [
                    {
                        id: "main",
                        default: true,
                        memorySearch: {
                            chunking: { tokens: 320 },
                            query: { maxResults: 8 },
                            store: {
                                vector: {
                                    enabled: true,
                                },
                            },
                        },
                    },
                ],
            },
        };
        var resolved = (0, memory_search_js_1.resolveMemorySearchConfig)(cfg, "main");
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.provider).toBe("openai");
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.model).toBe("text-embedding-3-small");
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.chunking.tokens).toBe(320);
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.chunking.overlap).toBe(100);
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.query.maxResults).toBe(8);
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.query.minScore).toBe(0.2);
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.store.vector.enabled).toBe(true);
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.store.vector.extensionPath).toBe("/opt/sqlite-vec.dylib");
    });
    (0, vitest_1.it)("merges extra memory paths from defaults and overrides", function () {
        var cfg = {
            agents: {
                defaults: {
                    memorySearch: {
                        extraPaths: ["/shared/notes", " docs "],
                    },
                },
                list: [
                    {
                        id: "main",
                        default: true,
                        memorySearch: {
                            extraPaths: ["/shared/notes", "../team-notes"],
                        },
                    },
                ],
            },
        };
        var resolved = (0, memory_search_js_1.resolveMemorySearchConfig)(cfg, "main");
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.extraPaths).toEqual(["/shared/notes", "docs", "../team-notes"]);
    });
    (0, vitest_1.it)("includes batch defaults for openai without remote overrides", function () {
        var _a;
        var cfg = {
            agents: {
                defaults: {
                    memorySearch: {
                        provider: "openai",
                    },
                },
            },
        };
        var resolved = (0, memory_search_js_1.resolveMemorySearchConfig)(cfg, "main");
        (0, vitest_1.expect)((_a = resolved === null || resolved === void 0 ? void 0 : resolved.remote) === null || _a === void 0 ? void 0 : _a.batch).toEqual({
            enabled: true,
            wait: true,
            concurrency: 2,
            pollIntervalMs: 2000,
            timeoutMinutes: 60,
        });
    });
    (0, vitest_1.it)("keeps remote unset for local provider without overrides", function () {
        var cfg = {
            agents: {
                defaults: {
                    memorySearch: {
                        provider: "local",
                    },
                },
            },
        };
        var resolved = (0, memory_search_js_1.resolveMemorySearchConfig)(cfg, "main");
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.remote).toBeUndefined();
    });
    (0, vitest_1.it)("includes remote defaults for gemini without overrides", function () {
        var _a;
        var cfg = {
            agents: {
                defaults: {
                    memorySearch: {
                        provider: "gemini",
                    },
                },
            },
        };
        var resolved = (0, memory_search_js_1.resolveMemorySearchConfig)(cfg, "main");
        (0, vitest_1.expect)((_a = resolved === null || resolved === void 0 ? void 0 : resolved.remote) === null || _a === void 0 ? void 0 : _a.batch).toEqual({
            enabled: true,
            wait: true,
            concurrency: 2,
            pollIntervalMs: 2000,
            timeoutMinutes: 60,
        });
    });
    (0, vitest_1.it)("defaults session delta thresholds", function () {
        var cfg = {
            agents: {
                defaults: {
                    memorySearch: {
                        provider: "openai",
                    },
                },
            },
        };
        var resolved = (0, memory_search_js_1.resolveMemorySearchConfig)(cfg, "main");
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.sync.sessions).toEqual({
            deltaBytes: 100000,
            deltaMessages: 50,
        });
    });
    (0, vitest_1.it)("merges remote defaults with agent overrides", function () {
        var cfg = {
            agents: {
                defaults: {
                    memorySearch: {
                        provider: "openai",
                        remote: {
                            baseUrl: "https://default.example/v1",
                            apiKey: "default-key",
                            headers: { "X-Default": "on" },
                        },
                    },
                },
                list: [
                    {
                        id: "main",
                        default: true,
                        memorySearch: {
                            remote: {
                                baseUrl: "https://agent.example/v1",
                            },
                        },
                    },
                ],
            },
        };
        var resolved = (0, memory_search_js_1.resolveMemorySearchConfig)(cfg, "main");
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.remote).toEqual({
            baseUrl: "https://agent.example/v1",
            apiKey: "default-key",
            headers: { "X-Default": "on" },
            batch: {
                enabled: true,
                wait: true,
                concurrency: 2,
                pollIntervalMs: 2000,
                timeoutMinutes: 60,
            },
        });
    });
    (0, vitest_1.it)("gates session sources behind experimental flag", function () {
        var cfg = {
            agents: {
                defaults: {
                    memorySearch: {
                        provider: "openai",
                        sources: ["memory", "sessions"],
                    },
                },
                list: [
                    {
                        id: "main",
                        default: true,
                        memorySearch: {
                            experimental: { sessionMemory: false },
                        },
                    },
                ],
            },
        };
        var resolved = (0, memory_search_js_1.resolveMemorySearchConfig)(cfg, "main");
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.sources).toEqual(["memory"]);
    });
    (0, vitest_1.it)("allows session sources when experimental flag is enabled", function () {
        var cfg = {
            agents: {
                defaults: {
                    memorySearch: {
                        provider: "openai",
                        sources: ["memory", "sessions"],
                        experimental: { sessionMemory: true },
                    },
                },
            },
        };
        var resolved = (0, memory_search_js_1.resolveMemorySearchConfig)(cfg, "main");
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.sources).toContain("sessions");
    });
});
