"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerConfigCli = registerConfigCli;
var json5_1 = require("json5");
var config_js_1 = require("../config/config.js");
var globals_js_1 = require("../globals.js");
var runtime_js_1 = require("../runtime.js");
var links_js_1 = require("../terminal/links.js");
var theme_js_1 = require("../terminal/theme.js");
var utils_js_1 = require("../utils.js");
var command_format_js_1 = require("./command-format.js");
function isIndexSegment(raw) {
    return /^[0-9]+$/.test(raw);
}
function parsePath(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return [];
    }
    var parts = [];
    var current = "";
    var i = 0;
    while (i < trimmed.length) {
        var ch = trimmed[i];
        if (ch === "\\") {
            var next = trimmed[i + 1];
            if (next) {
                current += next;
            }
            i += 2;
            continue;
        }
        if (ch === ".") {
            if (current) {
                parts.push(current);
            }
            current = "";
            i += 1;
            continue;
        }
        if (ch === "[") {
            if (current) {
                parts.push(current);
            }
            current = "";
            var close_1 = trimmed.indexOf("]", i);
            if (close_1 === -1) {
                throw new Error("Invalid path (missing \"]\"): ".concat(raw));
            }
            var inside = trimmed.slice(i + 1, close_1).trim();
            if (!inside) {
                throw new Error("Invalid path (empty \"[]\"): ".concat(raw));
            }
            parts.push(inside);
            i = close_1 + 1;
            continue;
        }
        current += ch;
        i += 1;
    }
    if (current) {
        parts.push(current);
    }
    return parts.map(function (part) { return part.trim(); }).filter(Boolean);
}
function parseValue(raw, opts) {
    var trimmed = raw.trim();
    if (opts.json) {
        try {
            return json5_1.default.parse(trimmed);
        }
        catch (err) {
            throw new Error("Failed to parse JSON5 value: ".concat(String(err)), { cause: err });
        }
    }
    try {
        return json5_1.default.parse(trimmed);
    }
    catch (_a) {
        return raw;
    }
}
function getAtPath(root, path) {
    var current = root;
    for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
        var segment = path_1[_i];
        if (!current || typeof current !== "object") {
            return { found: false };
        }
        if (Array.isArray(current)) {
            if (!isIndexSegment(segment)) {
                return { found: false };
            }
            var index = Number.parseInt(segment, 10);
            if (!Number.isFinite(index) || index < 0 || index >= current.length) {
                return { found: false };
            }
            current = current[index];
            continue;
        }
        var record = current;
        if (!(segment in record)) {
            return { found: false };
        }
        current = record[segment];
    }
    return { found: true, value: current };
}
function setAtPath(root, path, value) {
    var current = root;
    for (var i = 0; i < path.length - 1; i += 1) {
        var segment = path[i];
        var next = path[i + 1];
        var nextIsIndex = Boolean(next && isIndexSegment(next));
        if (Array.isArray(current)) {
            if (!isIndexSegment(segment)) {
                throw new Error("Expected numeric index for array segment \"".concat(segment, "\""));
            }
            var index = Number.parseInt(segment, 10);
            var existing_1 = current[index];
            if (!existing_1 || typeof existing_1 !== "object") {
                current[index] = nextIsIndex ? [] : {};
            }
            current = current[index];
            continue;
        }
        if (!current || typeof current !== "object") {
            throw new Error("Cannot traverse into \"".concat(segment, "\" (not an object)"));
        }
        var record = current;
        var existing = record[segment];
        if (!existing || typeof existing !== "object") {
            record[segment] = nextIsIndex ? [] : {};
        }
        current = record[segment];
    }
    var last = path[path.length - 1];
    if (Array.isArray(current)) {
        if (!isIndexSegment(last)) {
            throw new Error("Expected numeric index for array segment \"".concat(last, "\""));
        }
        var index = Number.parseInt(last, 10);
        current[index] = value;
        return;
    }
    if (!current || typeof current !== "object") {
        throw new Error("Cannot set \"".concat(last, "\" (parent is not an object)"));
    }
    current[last] = value;
}
function unsetAtPath(root, path) {
    var current = root;
    for (var i = 0; i < path.length - 1; i += 1) {
        var segment = path[i];
        if (!current || typeof current !== "object") {
            return false;
        }
        if (Array.isArray(current)) {
            if (!isIndexSegment(segment)) {
                return false;
            }
            var index = Number.parseInt(segment, 10);
            if (!Number.isFinite(index) || index < 0 || index >= current.length) {
                return false;
            }
            current = current[index];
            continue;
        }
        var record_1 = current;
        if (!(segment in record_1)) {
            return false;
        }
        current = record_1[segment];
    }
    var last = path[path.length - 1];
    if (Array.isArray(current)) {
        if (!isIndexSegment(last)) {
            return false;
        }
        var index = Number.parseInt(last, 10);
        if (!Number.isFinite(index) || index < 0 || index >= current.length) {
            return false;
        }
        current.splice(index, 1);
        return true;
    }
    if (!current || typeof current !== "object") {
        return false;
    }
    var record = current;
    if (!(last in record)) {
        return false;
    }
    delete record[last];
    return true;
}
function loadValidConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var snapshot, _i, _a, issue;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 1:
                    snapshot = _b.sent();
                    if (snapshot.valid) {
                        return [2 /*return*/, snapshot];
                    }
                    runtime_js_1.defaultRuntime.error("Config invalid at ".concat((0, utils_js_1.shortenHomePath)(snapshot.path), "."));
                    for (_i = 0, _a = snapshot.issues; _i < _a.length; _i++) {
                        issue = _a[_i];
                        runtime_js_1.defaultRuntime.error("- ".concat(issue.path || "<root>", ": ").concat(issue.message));
                    }
                    runtime_js_1.defaultRuntime.error("Run `".concat((0, command_format_js_1.formatCliCommand)("openclaw doctor"), "` to repair, then retry."));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [2 /*return*/, snapshot];
            }
        });
    });
}
function registerConfigCli(program) {
    var _this = this;
    var cmd = program
        .command("config")
        .description("Config helpers (get/set/unset). Run without subcommand for the wizard.")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/config", "docs.openclaw.ai/cli/config"), "\n");
    })
        .option("--section <section>", "Configure wizard sections (repeatable). Use with no subcommand.", function (value, previous) { return __spreadArray(__spreadArray([], previous, true), [value], false); }, [])
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _a, CONFIGURE_WIZARD_SECTIONS, configureCommand, configureCommandWithSections, sections, invalid;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../commands/configure.js"); })];
                case 1:
                    _a = _b.sent(), CONFIGURE_WIZARD_SECTIONS = _a.CONFIGURE_WIZARD_SECTIONS, configureCommand = _a.configureCommand, configureCommandWithSections = _a.configureCommandWithSections;
                    sections = Array.isArray(opts.section)
                        ? opts.section
                            .map(function (value) { return (typeof value === "string" ? value.trim() : ""); })
                            .filter(Boolean)
                        : [];
                    if (!(sections.length === 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, configureCommand(runtime_js_1.defaultRuntime)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
                case 3:
                    invalid = sections.filter(function (s) { return !CONFIGURE_WIZARD_SECTIONS.includes(s); });
                    if (invalid.length > 0) {
                        runtime_js_1.defaultRuntime.error("Invalid --section: ".concat(invalid.join(", "), ". Expected one of: ").concat(CONFIGURE_WIZARD_SECTIONS.join(", "), "."));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, configureCommandWithSections(sections, runtime_js_1.defaultRuntime)];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    cmd
        .command("get")
        .description("Get a config value by dot path")
        .argument("<path>", "Config path (dot or bracket notation)")
        .option("--json", "Output JSON", false)
        .action(function (path, opts) { return __awaiter(_this, void 0, void 0, function () {
        var parsedPath, snapshot, res, err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    parsedPath = parsePath(path);
                    if (parsedPath.length === 0) {
                        throw new Error("Path is empty.");
                    }
                    return [4 /*yield*/, loadValidConfig()];
                case 1:
                    snapshot = _c.sent();
                    res = getAtPath(snapshot.config, parsedPath);
                    if (!res.found) {
                        runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)("Config path not found: ".concat(path)));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    if (opts.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify((_a = res.value) !== null && _a !== void 0 ? _a : null, null, 2));
                        return [2 /*return*/];
                    }
                    if (typeof res.value === "string" ||
                        typeof res.value === "number" ||
                        typeof res.value === "boolean") {
                        runtime_js_1.defaultRuntime.log(String(res.value));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log(JSON.stringify((_b = res.value) !== null && _b !== void 0 ? _b : null, null, 2));
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _c.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_1)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    cmd
        .command("set")
        .description("Set a config value by dot path")
        .argument("<path>", "Config path (dot or bracket notation)")
        .argument("<value>", "Value (JSON5 or raw string)")
        .option("--json", "Parse value as JSON5 (required)", false)
        .action(function (path, value, opts) { return __awaiter(_this, void 0, void 0, function () {
        var parsedPath, parsedValue, snapshot, next, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    parsedPath = parsePath(path);
                    if (parsedPath.length === 0) {
                        throw new Error("Path is empty.");
                    }
                    parsedValue = parseValue(value, opts);
                    return [4 /*yield*/, loadValidConfig()];
                case 1:
                    snapshot = _a.sent();
                    next = snapshot.config;
                    setAtPath(next, parsedPath, parsedValue);
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(next)];
                case 2:
                    _a.sent();
                    runtime_js_1.defaultRuntime.log((0, globals_js_1.info)("Updated ".concat(path, ". Restart the gateway to apply.")));
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_2)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    cmd
        .command("unset")
        .description("Remove a config value by dot path")
        .argument("<path>", "Config path (dot or bracket notation)")
        .action(function (path) { return __awaiter(_this, void 0, void 0, function () {
        var parsedPath, snapshot, next, removed, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    parsedPath = parsePath(path);
                    if (parsedPath.length === 0) {
                        throw new Error("Path is empty.");
                    }
                    return [4 /*yield*/, loadValidConfig()];
                case 1:
                    snapshot = _a.sent();
                    next = snapshot.config;
                    removed = unsetAtPath(next, parsedPath);
                    if (!removed) {
                        runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)("Config path not found: ".concat(path)));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(next)];
                case 2:
                    _a.sent();
                    runtime_js_1.defaultRuntime.log((0, globals_js_1.info)("Removed ".concat(path, ". Restart the gateway to apply.")));
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_3)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}
