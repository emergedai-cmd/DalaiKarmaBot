"use strict";
/**
 * Opt-in context pruning (“microcompact”-style) for Pi sessions.
 *
 * This only affects the in-memory context for the current request; it does not rewrite session
 * history persisted on disk.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONTEXT_PRUNING_SETTINGS = exports.computeEffectiveSettings = exports.pruneContextMessages = exports.default = void 0;
var extension_js_1 = require("./context-pruning/extension.js");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return extension_js_1.default; } });
var pruner_js_1 = require("./context-pruning/pruner.js");
Object.defineProperty(exports, "pruneContextMessages", { enumerable: true, get: function () { return pruner_js_1.pruneContextMessages; } });
var settings_js_1 = require("./context-pruning/settings.js");
Object.defineProperty(exports, "computeEffectiveSettings", { enumerable: true, get: function () { return settings_js_1.computeEffectiveSettings; } });
Object.defineProperty(exports, "DEFAULT_CONTEXT_PRUNING_SETTINGS", { enumerable: true, get: function () { return settings_js_1.DEFAULT_CONTEXT_PRUNING_SETTINGS; } });
