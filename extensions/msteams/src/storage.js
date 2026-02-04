"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMSTeamsStorePath = resolveMSTeamsStorePath;
var node_path_1 = require("node:path");
var runtime_js_1 = require("./runtime.js");
function resolveMSTeamsStorePath(params) {
    var _a;
    if (params.storePath) {
        return params.storePath;
    }
    if (params.stateDir) {
        return node_path_1.default.join(params.stateDir, params.filename);
    }
    var env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
    var stateDir = params.homedir
        ? (0, runtime_js_1.getMSTeamsRuntime)().state.resolveStateDir(env, params.homedir)
        : (0, runtime_js_1.getMSTeamsRuntime)().state.resolveStateDir(env);
    return node_path_1.default.join(stateDir, params.filename);
}
