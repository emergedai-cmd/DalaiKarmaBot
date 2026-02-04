"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var env_substitution_js_1 = require("./env-substitution.js");
(0, vitest_1.describe)("resolveConfigEnvVars", function () {
    (0, vitest_1.describe)("basic substitution", function () {
        (0, vitest_1.it)("substitutes a single env var", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "${FOO}" }, { FOO: "bar" });
            (0, vitest_1.expect)(result).toEqual({ key: "bar" });
        });
        (0, vitest_1.it)("substitutes multiple different env vars in same string", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "${A}/${B}" }, { A: "x", B: "y" });
            (0, vitest_1.expect)(result).toEqual({ key: "x/y" });
        });
        (0, vitest_1.it)("substitutes inline with prefix and suffix", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "prefix-${FOO}-suffix" }, { FOO: "bar" });
            (0, vitest_1.expect)(result).toEqual({ key: "prefix-bar-suffix" });
        });
        (0, vitest_1.it)("substitutes same var multiple times", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "${FOO}:${FOO}" }, { FOO: "bar" });
            (0, vitest_1.expect)(result).toEqual({ key: "bar:bar" });
        });
    });
    (0, vitest_1.describe)("nested structures", function () {
        (0, vitest_1.it)("substitutes in nested objects", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({
                outer: {
                    inner: {
                        key: "${API_KEY}",
                    },
                },
            }, { API_KEY: "secret123" });
            (0, vitest_1.expect)(result).toEqual({
                outer: {
                    inner: {
                        key: "secret123",
                    },
                },
            });
        });
        (0, vitest_1.it)("substitutes in arrays", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({ items: ["${A}", "${B}", "${C}"] }, { A: "1", B: "2", C: "3" });
            (0, vitest_1.expect)(result).toEqual({ items: ["1", "2", "3"] });
        });
        (0, vitest_1.it)("substitutes in deeply nested arrays and objects", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({
                providers: [
                    { name: "openai", apiKey: "${OPENAI_KEY}" },
                    { name: "anthropic", apiKey: "${ANTHROPIC_KEY}" },
                ],
            }, { OPENAI_KEY: "sk-xxx", ANTHROPIC_KEY: "sk-yyy" });
            (0, vitest_1.expect)(result).toEqual({
                providers: [
                    { name: "openai", apiKey: "sk-xxx" },
                    { name: "anthropic", apiKey: "sk-yyy" },
                ],
            });
        });
    });
    (0, vitest_1.describe)("missing env var handling", function () {
        (0, vitest_1.it)("throws MissingEnvVarError for missing env var", function () {
            (0, vitest_1.expect)(function () { return (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "${MISSING}" }, {}); }).toThrow(env_substitution_js_1.MissingEnvVarError);
        });
        (0, vitest_1.it)("includes var name in error", function () {
            try {
                (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "${MISSING_VAR}" }, {});
                throw new Error("Expected to throw");
            }
            catch (err) {
                (0, vitest_1.expect)(err).toBeInstanceOf(env_substitution_js_1.MissingEnvVarError);
                var error = err;
                (0, vitest_1.expect)(error.varName).toBe("MISSING_VAR");
            }
        });
        (0, vitest_1.it)("includes config path in error", function () {
            try {
                (0, env_substitution_js_1.resolveConfigEnvVars)({ outer: { inner: { key: "${MISSING}" } } }, {});
                throw new Error("Expected to throw");
            }
            catch (err) {
                (0, vitest_1.expect)(err).toBeInstanceOf(env_substitution_js_1.MissingEnvVarError);
                var error = err;
                (0, vitest_1.expect)(error.configPath).toBe("outer.inner.key");
            }
        });
        (0, vitest_1.it)("includes array index in config path", function () {
            try {
                (0, env_substitution_js_1.resolveConfigEnvVars)({ items: ["ok", "${MISSING}"] }, { OK: "val" });
                throw new Error("Expected to throw");
            }
            catch (err) {
                (0, vitest_1.expect)(err).toBeInstanceOf(env_substitution_js_1.MissingEnvVarError);
                var error = err;
                (0, vitest_1.expect)(error.configPath).toBe("items[1]");
            }
        });
        (0, vitest_1.it)("treats empty string env var as missing", function () {
            (0, vitest_1.expect)(function () { return (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "${EMPTY}" }, { EMPTY: "" }); }).toThrow(env_substitution_js_1.MissingEnvVarError);
        });
    });
    (0, vitest_1.describe)("escape syntax", function () {
        (0, vitest_1.it)("outputs literal ${VAR} when escaped with $$", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "$${VAR}" }, { VAR: "value" });
            (0, vitest_1.expect)(result).toEqual({ key: "${VAR}" });
        });
        (0, vitest_1.it)("handles mix of escaped and unescaped", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "${REAL}/$${LITERAL}" }, { REAL: "resolved" });
            (0, vitest_1.expect)(result).toEqual({ key: "resolved/${LITERAL}" });
        });
        (0, vitest_1.it)("handles escaped and unescaped of the same var (escaped first)", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "$${FOO} ${FOO}" }, { FOO: "bar" });
            (0, vitest_1.expect)(result).toEqual({ key: "${FOO} bar" });
        });
        (0, vitest_1.it)("handles escaped and unescaped of the same var (unescaped first)", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "${FOO} $${FOO}" }, { FOO: "bar" });
            (0, vitest_1.expect)(result).toEqual({ key: "bar ${FOO}" });
        });
        (0, vitest_1.it)("handles multiple escaped vars", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "$${A}:$${B}" }, {});
            (0, vitest_1.expect)(result).toEqual({ key: "${A}:${B}" });
        });
        (0, vitest_1.it)("does not unescape $${VAR} sequences from env values", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "${FOO}" }, { FOO: "$${BAR}" });
            (0, vitest_1.expect)(result).toEqual({ key: "$${BAR}" });
        });
    });
    (0, vitest_1.describe)("non-matching patterns unchanged", function () {
        (0, vitest_1.it)("leaves $VAR (no braces) unchanged", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "$VAR" }, { VAR: "value" });
            (0, vitest_1.expect)(result).toEqual({ key: "$VAR" });
        });
        (0, vitest_1.it)("leaves ${lowercase} unchanged (uppercase only)", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "${lowercase}" }, { lowercase: "value" });
            (0, vitest_1.expect)(result).toEqual({ key: "${lowercase}" });
        });
        (0, vitest_1.it)("leaves ${MixedCase} unchanged", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "${MixedCase}" }, { MixedCase: "value" });
            (0, vitest_1.expect)(result).toEqual({ key: "${MixedCase}" });
        });
        (0, vitest_1.it)("leaves ${123INVALID} unchanged (must start with letter or underscore)", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "${123INVALID}" }, {});
            (0, vitest_1.expect)(result).toEqual({ key: "${123INVALID}" });
        });
        (0, vitest_1.it)("substitutes ${_UNDERSCORE_START} (valid)", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "${_UNDERSCORE_START}" }, { _UNDERSCORE_START: "valid" });
            (0, vitest_1.expect)(result).toEqual({ key: "valid" });
        });
        (0, vitest_1.it)("substitutes ${VAR_WITH_NUMBERS_123} (valid)", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({ key: "${VAR_WITH_NUMBERS_123}" }, { VAR_WITH_NUMBERS_123: "valid" });
            (0, vitest_1.expect)(result).toEqual({ key: "valid" });
        });
    });
    (0, vitest_1.describe)("passthrough behavior", function () {
        (0, vitest_1.it)("passes through primitives unchanged", function () {
            (0, vitest_1.expect)((0, env_substitution_js_1.resolveConfigEnvVars)("hello", {})).toBe("hello");
            (0, vitest_1.expect)((0, env_substitution_js_1.resolveConfigEnvVars)(42, {})).toBe(42);
            (0, vitest_1.expect)((0, env_substitution_js_1.resolveConfigEnvVars)(true, {})).toBe(true);
            (0, vitest_1.expect)((0, env_substitution_js_1.resolveConfigEnvVars)(null, {})).toBe(null);
        });
        (0, vitest_1.it)("passes through empty object", function () {
            (0, vitest_1.expect)((0, env_substitution_js_1.resolveConfigEnvVars)({}, {})).toEqual({});
        });
        (0, vitest_1.it)("passes through empty array", function () {
            (0, vitest_1.expect)((0, env_substitution_js_1.resolveConfigEnvVars)([], {})).toEqual([]);
        });
        (0, vitest_1.it)("passes through non-string values in objects", function () {
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)({ num: 42, bool: true, nil: null, arr: [1, 2] }, {});
            (0, vitest_1.expect)(result).toEqual({ num: 42, bool: true, nil: null, arr: [1, 2] });
        });
    });
    (0, vitest_1.describe)("real-world config patterns", function () {
        (0, vitest_1.it)("substitutes API keys in provider config", function () {
            var config = {
                models: {
                    providers: {
                        "vercel-gateway": {
                            apiKey: "${VERCEL_GATEWAY_API_KEY}",
                        },
                        openai: {
                            apiKey: "${OPENAI_API_KEY}",
                        },
                    },
                },
            };
            var env = {
                VERCEL_GATEWAY_API_KEY: "vg_key_123",
                OPENAI_API_KEY: "sk-xxx",
            };
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)(config, env);
            (0, vitest_1.expect)(result).toEqual({
                models: {
                    providers: {
                        "vercel-gateway": {
                            apiKey: "vg_key_123",
                        },
                        openai: {
                            apiKey: "sk-xxx",
                        },
                    },
                },
            });
        });
        (0, vitest_1.it)("substitutes gateway auth token", function () {
            var config = {
                gateway: {
                    auth: {
                        token: "${OPENCLAW_GATEWAY_TOKEN}",
                    },
                },
            };
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)(config, {
                OPENCLAW_GATEWAY_TOKEN: "secret-token",
            });
            (0, vitest_1.expect)(result).toEqual({
                gateway: {
                    auth: {
                        token: "secret-token",
                    },
                },
            });
        });
        (0, vitest_1.it)("substitutes base URL with env var", function () {
            var config = {
                models: {
                    providers: {
                        custom: {
                            baseUrl: "${CUSTOM_API_BASE}/v1",
                        },
                    },
                },
            };
            var result = (0, env_substitution_js_1.resolveConfigEnvVars)(config, {
                CUSTOM_API_BASE: "https://api.example.com",
            });
            (0, vitest_1.expect)(result).toEqual({
                models: {
                    providers: {
                        custom: {
                            baseUrl: "https://api.example.com/v1",
                        },
                    },
                },
            });
        });
    });
});
