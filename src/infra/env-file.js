"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertSharedEnvVar = upsertSharedEnvVar;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var utils_js_1 = require("../utils.js");
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function upsertSharedEnvVar(params) {
    var _a;
    var env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
    var dir = (0, utils_js_1.resolveConfigDir)(env);
    var filepath = node_path_1.default.join(dir, ".env");
    var key = params.key.trim();
    var value = params.value;
    var raw = "";
    if (node_fs_1.default.existsSync(filepath)) {
        raw = node_fs_1.default.readFileSync(filepath, "utf8");
    }
    var lines = raw.length ? raw.split(/\r?\n/) : [];
    var matcher = new RegExp("^(\\s*(?:export\\s+)?)".concat(escapeRegExp(key), "\\s*="));
    var updated = false;
    var replaced = false;
    var nextLines = lines.map(function (line) {
        var _a;
        var match = line.match(matcher);
        if (!match) {
            return line;
        }
        replaced = true;
        var prefix = (_a = match[1]) !== null && _a !== void 0 ? _a : "";
        var next = "".concat(prefix).concat(key, "=").concat(value);
        if (next !== line) {
            updated = true;
        }
        return next;
    });
    if (!replaced) {
        nextLines.push("".concat(key, "=").concat(value));
        updated = true;
    }
    if (!node_fs_1.default.existsSync(dir)) {
        node_fs_1.default.mkdirSync(dir, { recursive: true, mode: 448 });
    }
    var output = "".concat(nextLines.join("\n"), "\n");
    node_fs_1.default.writeFileSync(filepath, output, "utf8");
    node_fs_1.default.chmodSync(filepath, 384);
    return { path: filepath, updated: updated, created: !raw };
}
