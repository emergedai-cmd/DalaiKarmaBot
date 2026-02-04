"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = contextPruningExtension;
var pruner_js_1 = require("./pruner.js");
var runtime_js_1 = require("./runtime.js");
function contextPruningExtension(api) {
    api.on("context", function (event, ctx) {
        var _a, _b;
        var runtime = (0, runtime_js_1.getContextPruningRuntime)(ctx.sessionManager);
        if (!runtime) {
            return undefined;
        }
        if (runtime.settings.mode === "cache-ttl") {
            var ttlMs = runtime.settings.ttlMs;
            var lastTouch = (_a = runtime.lastCacheTouchAt) !== null && _a !== void 0 ? _a : null;
            if (!lastTouch || ttlMs <= 0) {
                return undefined;
            }
            if (ttlMs > 0 && Date.now() - lastTouch < ttlMs) {
                return undefined;
            }
        }
        var next = (0, pruner_js_1.pruneContextMessages)({
            messages: event.messages,
            settings: runtime.settings,
            ctx: ctx,
            isToolPrunable: runtime.isToolPrunable,
            contextWindowTokensOverride: (_b = runtime.contextWindowTokens) !== null && _b !== void 0 ? _b : undefined,
        });
        if (next === event.messages) {
            return undefined;
        }
        if (runtime.settings.mode === "cache-ttl") {
            runtime.lastCacheTouchAt = Date.now();
        }
        return { messages: next };
    });
}
