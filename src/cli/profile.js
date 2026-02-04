"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCliProfileArgs = parseCliProfileArgs;
exports.applyCliProfileEnv = applyCliProfileEnv;
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var profile_utils_js_1 = require("./profile-utils.js");
function takeValue(raw, next) {
    if (raw.includes("=")) {
        var _a = raw.split("=", 2), value = _a[1];
        var trimmed_1 = (value !== null && value !== void 0 ? value : "").trim();
        return { value: trimmed_1 || null, consumedNext: false };
    }
    var trimmed = (next !== null && next !== void 0 ? next : "").trim();
    return { value: trimmed || null, consumedNext: Boolean(next) };
}
function parseCliProfileArgs(argv) {
    if (argv.length < 2) {
        return { ok: true, profile: null, argv: argv };
    }
    var out = argv.slice(0, 2);
    var profile = null;
    var sawDev = false;
    var sawCommand = false;
    var args = argv.slice(2);
    for (var i = 0; i < args.length; i += 1) {
        var arg = args[i];
        if (arg === undefined) {
            continue;
        }
        if (sawCommand) {
            out.push(arg);
            continue;
        }
        if (arg === "--dev") {
            if (profile && profile !== "dev") {
                return { ok: false, error: "Cannot combine --dev with --profile" };
            }
            sawDev = true;
            profile = "dev";
            continue;
        }
        if (arg === "--profile" || arg.startsWith("--profile=")) {
            if (sawDev) {
                return { ok: false, error: "Cannot combine --dev with --profile" };
            }
            var next = args[i + 1];
            var _a = takeValue(arg, next), value = _a.value, consumedNext = _a.consumedNext;
            if (consumedNext) {
                i += 1;
            }
            if (!value) {
                return { ok: false, error: "--profile requires a value" };
            }
            if (!(0, profile_utils_js_1.isValidProfileName)(value)) {
                return {
                    ok: false,
                    error: 'Invalid --profile (use letters, numbers, "_", "-" only)',
                };
            }
            profile = value;
            continue;
        }
        if (!arg.startsWith("-")) {
            sawCommand = true;
            out.push(arg);
            continue;
        }
        out.push(arg);
    }
    return { ok: true, profile: profile, argv: out };
}
function resolveProfileStateDir(profile, homedir) {
    var suffix = profile.toLowerCase() === "default" ? "" : "-".concat(profile);
    return node_path_1.default.join(homedir(), ".openclaw".concat(suffix));
}
function applyCliProfileEnv(params) {
    var _a, _b, _c, _d, _e, _f;
    var env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
    var homedir = (_b = params.homedir) !== null && _b !== void 0 ? _b : node_os_1.default.homedir;
    var profile = params.profile.trim();
    if (!profile) {
        return;
    }
    // Convenience only: fill defaults, never override explicit env values.
    env.OPENCLAW_PROFILE = profile;
    var stateDir = ((_c = env.OPENCLAW_STATE_DIR) === null || _c === void 0 ? void 0 : _c.trim()) || resolveProfileStateDir(profile, homedir);
    if (!((_d = env.OPENCLAW_STATE_DIR) === null || _d === void 0 ? void 0 : _d.trim())) {
        env.OPENCLAW_STATE_DIR = stateDir;
    }
    if (!((_e = env.OPENCLAW_CONFIG_PATH) === null || _e === void 0 ? void 0 : _e.trim())) {
        env.OPENCLAW_CONFIG_PATH = node_path_1.default.join(stateDir, "openclaw.json");
    }
    if (profile === "dev" && !((_f = env.OPENCLAW_GATEWAY_PORT) === null || _f === void 0 ? void 0 : _f.trim())) {
        env.OPENCLAW_GATEWAY_PORT = "19001";
    }
}
