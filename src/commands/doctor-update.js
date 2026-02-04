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
exports.maybeOfferUpdateBeforeDoctor = maybeOfferUpdateBeforeDoctor;
var command_format_js_1 = require("../cli/command-format.js");
var env_js_1 = require("../infra/env.js");
var update_runner_js_1 = require("../infra/update-runner.js");
var exec_js_1 = require("../process/exec.js");
var note_js_1 = require("../terminal/note.js");
function detectOpenClawGitCheckout(root) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(["git", "-C", root, "rev-parse", "--show-toplevel"], {
                        timeoutMs: 5000,
                    }).catch(function () { return null; })];
                case 1:
                    res = _a.sent();
                    if (!res) {
                        return [2 /*return*/, "unknown"];
                    }
                    if (res.code !== 0) {
                        // Avoid noisy "Update via package manager" notes when git is missing/broken,
                        // but do show it when this is clearly not a git checkout.
                        if (res.stderr.toLowerCase().includes("not a git repository")) {
                            return [2 /*return*/, "not-git"];
                        }
                        return [2 /*return*/, "unknown"];
                    }
                    return [2 /*return*/, res.stdout.trim() === root ? "git" : "not-git"];
            }
        });
    });
}
function maybeOfferUpdateBeforeDoctor(params) {
    return __awaiter(this, void 0, void 0, function () {
        var updateInProgress, canOfferUpdate, git, shouldUpdate, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    updateInProgress = (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_UPDATE_IN_PROGRESS);
                    canOfferUpdate = !updateInProgress &&
                        params.options.nonInteractive !== true &&
                        params.options.yes !== true &&
                        params.options.repair !== true &&
                        Boolean(process.stdin.isTTY);
                    if (!canOfferUpdate || !params.root) {
                        return [2 /*return*/, { updated: false }];
                    }
                    return [4 /*yield*/, detectOpenClawGitCheckout(params.root)];
                case 1:
                    git = _a.sent();
                    if (!(git === "git")) return [3 /*break*/, 4];
                    return [4 /*yield*/, params.confirm({
                            message: "Update OpenClaw from git before running doctor?",
                            initialValue: true,
                        })];
                case 2:
                    shouldUpdate = _a.sent();
                    if (!shouldUpdate) {
                        return [2 /*return*/, { updated: false }];
                    }
                    (0, note_js_1.note)("Running update (fetch/rebase/build/ui:build/doctor)…", "Update");
                    return [4 /*yield*/, (0, update_runner_js_1.runGatewayUpdate)({
                            cwd: params.root,
                            argv1: process.argv[1],
                        })];
                case 3:
                    result = _a.sent();
                    (0, note_js_1.note)([
                        "Status: ".concat(result.status),
                        "Mode: ".concat(result.mode),
                        result.root ? "Root: ".concat(result.root) : null,
                        result.reason ? "Reason: ".concat(result.reason) : null,
                    ]
                        .filter(Boolean)
                        .join("\n"), "Update result");
                    if (result.status === "ok") {
                        params.outro("Update completed (doctor already ran as part of the update).");
                        return [2 /*return*/, { updated: true, handled: true }];
                    }
                    return [2 /*return*/, { updated: true, handled: false }];
                case 4:
                    if (git === "not-git") {
                        (0, note_js_1.note)([
                            "This install is not a git checkout.",
                            "Run `".concat((0, command_format_js_1.formatCliCommand)("openclaw update"), "` to update via your package manager (npm/pnpm), then rerun doctor."),
                        ].join("\n"), "Update");
                    }
                    return [2 /*return*/, { updated: false }];
            }
        });
    });
}
