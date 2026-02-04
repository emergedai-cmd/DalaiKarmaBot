"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPathWithinBase = isPathWithinBase;
var node_path_1 = require("node:path");
function isPathWithinBase(base, target) {
    if (process.platform === "win32") {
        var normalizedBase_1 = node_path_1.default.win32.normalize(node_path_1.default.win32.resolve(base));
        var normalizedTarget_1 = node_path_1.default.win32.normalize(node_path_1.default.win32.resolve(target));
        var rel_1 = node_path_1.default.win32.relative(normalizedBase_1.toLowerCase(), normalizedTarget_1.toLowerCase());
        return rel_1 === "" || (!rel_1.startsWith("..") && !node_path_1.default.win32.isAbsolute(rel_1));
    }
    var normalizedBase = node_path_1.default.resolve(base);
    var normalizedTarget = node_path_1.default.resolve(target);
    var rel = node_path_1.default.relative(normalizedBase, normalizedTarget);
    return rel === "" || (!rel.startsWith("..") && !node_path_1.default.isAbsolute(rel));
}
