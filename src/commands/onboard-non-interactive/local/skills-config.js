"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyNonInteractiveSkillsConfig = applyNonInteractiveSkillsConfig;
function applyNonInteractiveSkillsConfig(params) {
    var _a, _b;
    var nextConfig = params.nextConfig, opts = params.opts, runtime = params.runtime;
    if (opts.skipSkills) {
        return nextConfig;
    }
    var nodeManager = (_a = opts.nodeManager) !== null && _a !== void 0 ? _a : "npm";
    if (!["npm", "pnpm", "bun"].includes(nodeManager)) {
        runtime.error("Invalid --node-manager (use npm, pnpm, or bun)");
        runtime.exit(1);
        return nextConfig;
    }
    return __assign(__assign({}, nextConfig), { skills: __assign(__assign({}, nextConfig.skills), { install: __assign(__assign({}, (_b = nextConfig.skills) === null || _b === void 0 ? void 0 : _b.install), { nodeManager: nodeManager }) }) });
}
