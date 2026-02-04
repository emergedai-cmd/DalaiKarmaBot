"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var config_js_1 = require("./config.js");
(0, vitest_1.describe)("web search provider config", function () {
    (0, vitest_1.it)("accepts perplexity provider and config", function () {
        var res = (0, config_js_1.validateConfigObject)({
            tools: {
                web: {
                    search: {
                        enabled: true,
                        provider: "perplexity",
                        perplexity: {
                            apiKey: "test-key",
                            baseUrl: "https://api.perplexity.ai",
                            model: "perplexity/sonar-pro",
                        },
                    },
                },
            },
        });
        (0, vitest_1.expect)(res.ok).toBe(true);
    });
});
