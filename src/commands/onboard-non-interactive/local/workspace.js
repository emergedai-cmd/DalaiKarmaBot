"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveNonInteractiveWorkspaceDir = resolveNonInteractiveWorkspaceDir;
var utils_js_1 = require("../../../utils.js");
function resolveNonInteractiveWorkspaceDir(params) {
    var _a, _b, _c, _d;
    var raw = ((_d = (_a = params.opts.workspace) !== null && _a !== void 0 ? _a : (_c = (_b = params.baseConfig.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.workspace) !== null && _d !== void 0 ? _d : params.defaultWorkspaceDir).trim();
    return (0, utils_js_1.resolveUserPath)(raw);
}
