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
Object.defineProperty(exports, "__esModule", { value: true });
var node_child_process_1 = require("node:child_process");
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
function parseArgs(argv) {
    var maxLines = 500;
    for (var index = 0; index < argv.length; index++) {
        var arg = argv[index];
        if (arg === "--max") {
            var next = argv[index + 1];
            if (!next || Number.isNaN(Number(next))) {
                throw new Error("Missing/invalid --max value");
            }
            maxLines = Number(next);
            index++;
            continue;
        }
    }
    return { maxLines: maxLines };
}
function gitLsFilesAll() {
    // Include untracked files too so local refactors don’t “pass” by accident.
    var stdout = (0, node_child_process_1.execFileSync)("git", ["ls-files", "--cached", "--others", "--exclude-standard"], {
        encoding: "utf8",
    });
    return stdout
        .split("\n")
        .map(function (line) { return line.trim(); })
        .filter(Boolean);
}
function countLines(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.readFile)(filePath, "utf8")];
                case 1:
                    content = _a.sent();
                    // Count physical lines. Keeps the rule simple + predictable.
                    return [2 /*return*/, content.split("\n").length];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var maxLines, files, results, offenders, _i, offenders_1, offender;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Makes `... | head` safe.
                    process.stdout.on("error", function (error) {
                        if (error.code === "EPIPE") {
                            process.exit(0);
                        }
                        throw error;
                    });
                    maxLines = parseArgs(process.argv.slice(2)).maxLines;
                    files = gitLsFilesAll()
                        .filter(function (filePath) { return (0, node_fs_1.existsSync)(filePath); })
                        .filter(function (filePath) { return filePath.endsWith(".ts") || filePath.endsWith(".tsx"); });
                    return [4 /*yield*/, Promise.all(files.map(function (filePath) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = { filePath: filePath };
                                        return [4 /*yield*/, countLines(filePath)];
                                    case 1: return [2 /*return*/, (_a.lines = _b.sent(), _a)];
                                }
                            });
                        }); }))];
                case 1:
                    results = _a.sent();
                    offenders = results
                        .filter(function (result) { return result.lines > maxLines; })
                        .toSorted(function (a, b) { return b.lines - a.lines; });
                    if (!offenders.length) {
                        return [2 /*return*/];
                    }
                    // Minimal, grep-friendly output.
                    for (_i = 0, offenders_1 = offenders; _i < offenders_1.length; _i++) {
                        offender = offenders_1[_i];
                        // eslint-disable-next-line no-console
                        console.log("".concat(offender.lines, "\t").concat(offender.filePath));
                    }
                    process.exitCode = 1;
                    return [2 /*return*/];
            }
        });
    });
}
await main();
