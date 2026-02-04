"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHookEvent = exports.triggerHook = exports.getRegisteredHookEventKeys = exports.clearHooks = exports.unregisterHook = exports.registerHook = void 0;
__exportStar(require("./internal-hooks.js"), exports);
var internal_hooks_js_1 = require("./internal-hooks.js");
Object.defineProperty(exports, "registerHook", { enumerable: true, get: function () { return internal_hooks_js_1.registerInternalHook; } });
Object.defineProperty(exports, "unregisterHook", { enumerable: true, get: function () { return internal_hooks_js_1.unregisterInternalHook; } });
Object.defineProperty(exports, "clearHooks", { enumerable: true, get: function () { return internal_hooks_js_1.clearInternalHooks; } });
Object.defineProperty(exports, "getRegisteredHookEventKeys", { enumerable: true, get: function () { return internal_hooks_js_1.getRegisteredEventKeys; } });
Object.defineProperty(exports, "triggerHook", { enumerable: true, get: function () { return internal_hooks_js_1.triggerInternalHook; } });
Object.defineProperty(exports, "createHookEvent", { enumerable: true, get: function () { return internal_hooks_js_1.createInternalHookEvent; } });
