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
exports.registerCompletionCli = registerCompletionCli;
exports.installCompletion = installCompletion;
var commander_1 = require("commander");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var register_subclis_js_1 = require("./program/register.subclis.js");
function registerCompletionCli(program) {
    var _this = this;
    program
        .command("completion")
        .description("Generate shell completion script")
        .addOption(new commander_1.Option("-s, --shell <shell>", "Shell to generate completion for")
        .choices(["zsh", "bash", "powershell", "fish"])
        .default("zsh"))
        .option("-i, --install", "Install completion script to shell profile")
        .option("-y, --yes", "Skip confirmation (non-interactive)", false)
        .action(function (options) { return __awaiter(_this, void 0, void 0, function () {
        var shell, entries, _i, entries_1, entry, script;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    shell = options.shell;
                    entries = (0, register_subclis_js_1.getSubCliEntries)();
                    _i = 0, entries_1 = entries;
                    _a.label = 1;
                case 1:
                    if (!(_i < entries_1.length)) return [3 /*break*/, 4];
                    entry = entries_1[_i];
                    // Skip completion command itself to avoid cycle if we were to add it to the list
                    if (entry.name === "completion") {
                        return [3 /*break*/, 3];
                    }
                    return [4 /*yield*/, (0, register_subclis_js_1.registerSubCliByName)(program, entry.name)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (!options.install) return [3 /*break*/, 6];
                    return [4 /*yield*/, installCompletion(shell, Boolean(options.yes), program.name())];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
                case 6:
                    script = "";
                    if (shell === "zsh") {
                        script = generateZshCompletion(program);
                    }
                    else if (shell === "bash") {
                        script = generateBashCompletion(program);
                    }
                    else if (shell === "powershell") {
                        script = generatePowerShellCompletion(program);
                    }
                    else if (shell === "fish") {
                        script = generateFishCompletion(program);
                    }
                    console.log(script);
                    return [2 /*return*/];
            }
        });
    }); });
}
function installCompletion(shell_1, yes_1) {
    return __awaiter(this, arguments, void 0, function (shell, yes, binName) {
        var home, profilePath, sourceLine, _a, _b, content, err_1;
        if (binName === void 0) { binName = "openclaw"; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    home = process.env.HOME || node_os_1.default.homedir();
                    profilePath = "";
                    sourceLine = "";
                    if (!(shell === "zsh")) return [3 /*break*/, 1];
                    profilePath = node_path_1.default.join(home, ".zshrc");
                    sourceLine = "source <(".concat(binName, " completion --shell zsh)");
                    return [3 /*break*/, 7];
                case 1:
                    if (!(shell === "bash")) return [3 /*break*/, 6];
                    // Try .bashrc first, then .bash_profile
                    profilePath = node_path_1.default.join(home, ".bashrc");
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, promises_1.default.access(profilePath)];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _a = _c.sent();
                    profilePath = node_path_1.default.join(home, ".bash_profile");
                    return [3 /*break*/, 5];
                case 5:
                    sourceLine = "source <(".concat(binName, " completion --shell bash)");
                    return [3 /*break*/, 7];
                case 6:
                    if (shell === "fish") {
                        profilePath = node_path_1.default.join(home, ".config", "fish", "config.fish");
                        sourceLine = "".concat(binName, " completion --shell fish | source");
                    }
                    else {
                        console.error("Automated installation not supported for ".concat(shell, " yet."));
                        return [2 /*return*/];
                    }
                    _c.label = 7;
                case 7:
                    _c.trys.push([7, 16, , 17]);
                    _c.label = 8;
                case 8:
                    _c.trys.push([8, 10, , 13]);
                    return [4 /*yield*/, promises_1.default.access(profilePath)];
                case 9:
                    _c.sent();
                    return [3 /*break*/, 13];
                case 10:
                    _b = _c.sent();
                    if (!yes) {
                        console.warn("Profile not found at ".concat(profilePath, ". Created a new one."));
                    }
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(profilePath), { recursive: true })];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(profilePath, "", "utf-8")];
                case 12:
                    _c.sent();
                    return [3 /*break*/, 13];
                case 13: return [4 /*yield*/, promises_1.default.readFile(profilePath, "utf-8")];
                case 14:
                    content = _c.sent();
                    if (content.includes("".concat(binName, " completion"))) {
                        if (!yes) {
                            console.log("Completion already installed in ".concat(profilePath));
                        }
                        return [2 /*return*/];
                    }
                    if (!yes) {
                        // Simple confirmation could go here if we had a prompter,
                        // but for now we assume --yes or manual invocation implies consent or we print info.
                        // Since we don't have a prompter passed in here easily without adding deps, we'll log.
                        console.log("Installing completion to ".concat(profilePath, "..."));
                    }
                    return [4 /*yield*/, promises_1.default.appendFile(profilePath, "\n# OpenClaw Completion\n".concat(sourceLine, "\n"))];
                case 15:
                    _c.sent();
                    console.log("Completion installed. Restart your shell or run: source ".concat(profilePath));
                    return [3 /*break*/, 17];
                case 16:
                    err_1 = _c.sent();
                    console.error("Failed to install completion: ".concat(err_1));
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
function generateZshCompletion(program) {
    var rootCmd = program.name();
    var script = "\n#compdef ".concat(rootCmd, "\n\n_").concat(rootCmd, "_root_completion() {\n  local -a commands\n  local -a options\n  \n  _arguments -C \\\n    ").concat(generateZshArgs(program), " \\\n    ").concat(generateZshSubcmdList(program), " \\\n    \"*::arg:->args\"\n\n  case $state in\n    (args)\n      case $line[1] in\n        ").concat(program.commands.map(function (cmd) { return "(".concat(cmd.name(), ") _").concat(rootCmd, "_").concat(cmd.name().replace(/-/g, "_"), " ;;"); }).join("\n        "), "\n      esac\n      ;;\n  esac\n}\n\n").concat(generateZshSubcommands(program, rootCmd), "\n\ncompdef _").concat(rootCmd, "_root_completion ").concat(rootCmd, "\n");
    return script;
}
function generateZshArgs(cmd) {
    return (cmd.options || [])
        .map(function (opt) {
        var flags = opt.flags.split(/[ ,|]+/);
        var name = flags.find(function (f) { return f.startsWith("--"); }) || flags[0];
        var short = flags.find(function (f) { return f.startsWith("-") && !f.startsWith("--"); });
        var desc = opt.description.replace(/'/g, "'\\''");
        if (short) {
            return "\"(".concat(name, " ").concat(short, ")\"{").concat(name, ",").concat(short, "}\"[").concat(desc, "]\"");
        }
        return "\"".concat(name, "[").concat(desc, "]\"");
    })
        .join(" \\\n    ");
}
function generateZshSubcmdList(cmd) {
    var list = cmd.commands
        .map(function (c) {
        var desc = c
            .description()
            .replace(/'/g, "'\\''")
            .replace(/\[/g, "\\[")
            .replace(/\]/g, "\\]");
        return "'".concat(c.name(), "[").concat(desc, "]'");
    })
        .join(" ");
    return "\"1: :_values 'command' ".concat(list, "\"");
}
function generateZshSubcommands(program, prefix) {
    var script = "";
    var _loop_1 = function (cmd) {
        var cmdName = cmd.name();
        var funcName = "_".concat(prefix, "_").concat(cmdName.replace(/-/g, "_"));
        // Recurse first
        script += generateZshSubcommands(cmd, "".concat(prefix, "_").concat(cmdName.replace(/-/g, "_")));
        var subCommands = cmd.commands;
        if (subCommands.length > 0) {
            script += "\n".concat(funcName, "() {\n  local -a commands\n  local -a options\n  \n  _arguments -C \\\n    ").concat(generateZshArgs(cmd), " \\\n    ").concat(generateZshSubcmdList(cmd), " \\\n    \"*::arg:->args\"\n\n  case $state in\n    (args)\n      case $line[1] in\n        ").concat(subCommands.map(function (sub) { return "(".concat(sub.name(), ") ").concat(funcName, "_").concat(sub.name().replace(/-/g, "_"), " ;;"); }).join("\n        "), "\n      esac\n      ;;\n  esac\n}\n");
        }
        else {
            script += "\n".concat(funcName, "() {\n  _arguments -C \\\n    ").concat(generateZshArgs(cmd), "\n}\n");
        }
    };
    for (var _i = 0, _a = program.commands; _i < _a.length; _i++) {
        var cmd = _a[_i];
        _loop_1(cmd);
    }
    return script;
}
function generateBashCompletion(program) {
    // Simplified Bash completion using dynamic iteration logic (often hardcoded in static scripts)
    // For a robust implementation, usually one maps out the tree.
    // This assumes a simple structure.
    var rootCmd = program.name();
    // We can use a recursive function to build the case statements
    return "\n_".concat(rootCmd, "_completion() {\n    local cur prev opts\n    COMPREPLY=()\n    cur=\"${COMP_WORDS[COMP_CWORD]}\"\n    prev=\"${COMP_WORDS[COMP_CWORD-1]}\"\n    \n    # Simple top-level completion for now\n    opts=\"").concat(program.commands.map(function (c) { return c.name(); }).join(" "), " ").concat(program.options.map(function (o) { return o.flags.split(" ")[0]; }).join(" "), "\"\n    \n    case \"${prev}\" in\n      ").concat(program.commands.map(function (cmd) { return generateBashSubcommand(cmd); }).join("\n      "), "\n    esac\n\n    if [[ ${cur} == -* ]] ; then\n        COMPREPLY=( $(compgen -W \"${opts}\" -- ${cur}) )\n        return 0\n    fi\n    \n    COMPREPLY=( $(compgen -W \"${opts}\" -- ${cur}) )\n}\n\ncomplete -F _").concat(rootCmd, "_completion ").concat(rootCmd, "\n");
}
function generateBashSubcommand(cmd) {
    // This is a naive implementation; fully recursive bash completion is complex to generate as a single string without improved state tracking.
    // For now, let's provide top-level command recognition.
    return "".concat(cmd.name(), ")\n        opts=\"").concat(cmd.commands.map(function (c) { return c.name(); }).join(" "), " ").concat(cmd.options.map(function (o) { return o.flags.split(" ")[0]; }).join(" "), "\"\n        COMPREPLY=( $(compgen -W \"${opts}\" -- ${cur}) )\n        return 0\n        ;;");
}
function generatePowerShellCompletion(program) {
    var rootCmd = program.name();
    var visit = function (cmd, parents) {
        var cmdName = cmd.name();
        var fullPath = __spreadArray(__spreadArray([], parents, true), [cmdName], false).join(" ");
        var script = "";
        // Command completion for this level
        var subCommands = cmd.commands.map(function (c) { return c.name(); });
        var options = cmd.options.map(function (o) { return o.flags.split(/[ ,|]+/)[0]; }); // Take first flag
        var allCompletions = __spreadArray(__spreadArray([], subCommands, true), options, true).map(function (s) { return "'".concat(s, "'"); }).join(",");
        if (allCompletions.length > 0) {
            script += "\n            if ($commandPath -eq '".concat(fullPath, "') {\n                $completions = @(").concat(allCompletions, ")\n                $completions | Where-Object { $_ -like \"$wordToComplete*\" } | ForEach-Object {\n                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)\n                }\n            }\n");
        }
        // Recurse
        for (var _i = 0, _a = cmd.commands; _i < _a.length; _i++) {
            var sub = _a[_i];
            script += visit(sub, __spreadArray(__spreadArray([], parents, true), [cmdName], false));
        }
        return script;
    };
    var rootBody = visit(program, []);
    return "\nRegister-ArgumentCompleter -Native -CommandName ".concat(rootCmd, " -ScriptBlock {\n    param($wordToComplete, $commandAst, $cursorPosition)\n    \n    $commandElements = $commandAst.CommandElements\n    $commandPath = \"\"\n    \n    # Reconstruct command path (simple approximation)\n    # Skip the executable name\n    for ($i = 1; $i -lt $commandElements.Count; $i++) {\n        $element = $commandElements[$i].Extent.Text\n        if ($element -like \"-*\") { break }\n        if ($i -eq $commandElements.Count - 1 -and $wordToComplete -ne \"\") { break } # Don't include current word being typed\n        $commandPath += \"$element \"\n    }\n    $commandPath = $commandPath.Trim()\n    \n    # Root command\n    if ($commandPath -eq \"\") {\n         $completions = @(").concat(program.commands.map(function (c) { return "'".concat(c.name(), "'"); }).join(","), ", ").concat(program.options.map(function (o) { return "'".concat(o.flags.split(" ")[0], "'"); }).join(","), ") \n         $completions | Where-Object { $_ -like \"$wordToComplete*\" } | ForEach-Object {\n            [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)\n         }\n    }\n    \n    ").concat(rootBody, "\n}\n");
}
function generateFishCompletion(program) {
    var rootCmd = program.name();
    var script = "";
    var visit = function (cmd, parents) {
        var _a, _b, _c, _d;
        var cmdName = cmd.name();
        var fullPath = __spreadArray([], parents, true);
        if (parents.length > 0) {
            fullPath.push(cmdName);
        } // Only push if not root, or consistent root handling
        // Fish uses 'seen_subcommand_from' to determine context.
        // For root: complete -c openclaw -n "__fish_use_subcommand" -a "subcmd" -d "desc"
        // Root logic
        if (parents.length === 0) {
            // Subcommands of root
            for (var _i = 0, _e = cmd.commands; _i < _e.length; _i++) {
                var sub = _e[_i];
                var desc = sub.description().replace(/'/g, "'\\''");
                script += "complete -c ".concat(rootCmd, " -n \"__fish_use_subcommand\" -a \"").concat(sub.name(), "\" -d '").concat(desc, "'\n");
            }
            // Options of root
            for (var _f = 0, _g = cmd.options; _f < _g.length; _f++) {
                var opt = _g[_f];
                var flags = opt.flags.split(/[ ,|]+/);
                var long = (_a = flags.find(function (f) { return f.startsWith("--"); })) === null || _a === void 0 ? void 0 : _a.replace(/^--/, "");
                var short = (_b = flags
                    .find(function (f) { return f.startsWith("-") && !f.startsWith("--"); })) === null || _b === void 0 ? void 0 : _b.replace(/^-/, "");
                var desc = opt.description.replace(/'/g, "'\\''");
                var line = "complete -c ".concat(rootCmd, " -n \"__fish_use_subcommand\"");
                if (short) {
                    line += " -s ".concat(short);
                }
                if (long) {
                    line += " -l ".concat(long);
                }
                line += " -d '".concat(desc, "'\n");
                script += line;
            }
        }
        else {
            // Nested commands
            // Logic: if seen subcommand matches parents...
            // But fish completion logic is simpler if we just say "if we haven't seen THIS command yet but seen parent"
            // Actually, a robust fish completion often requires defining a function to check current line.
            // For simplicity, we'll assume standard fish helper __fish_seen_subcommand_from.
            // To properly scope to 'openclaw gateway' and not 'openclaw other gateway', we need to check the sequence.
            // A simplified approach:
            // Subcommands
            for (var _h = 0, _j = cmd.commands; _h < _j.length; _h++) {
                var sub = _j[_h];
                var desc = sub.description().replace(/'/g, "'\\''");
                script += "complete -c ".concat(rootCmd, " -n \"__fish_seen_subcommand_from ").concat(cmdName, "\" -a \"").concat(sub.name(), "\" -d '").concat(desc, "'\n");
            }
            // Options
            for (var _k = 0, _l = cmd.options; _k < _l.length; _k++) {
                var opt = _l[_k];
                var flags = opt.flags.split(/[ ,|]+/);
                var long = (_c = flags.find(function (f) { return f.startsWith("--"); })) === null || _c === void 0 ? void 0 : _c.replace(/^--/, "");
                var short = (_d = flags
                    .find(function (f) { return f.startsWith("-") && !f.startsWith("--"); })) === null || _d === void 0 ? void 0 : _d.replace(/^-/, "");
                var desc = opt.description.replace(/'/g, "'\\''");
                var line = "complete -c ".concat(rootCmd, " -n \"__fish_seen_subcommand_from ").concat(cmdName, "\"");
                if (short) {
                    line += " -s ".concat(short);
                }
                if (long) {
                    line += " -l ".concat(long);
                }
                line += " -d '".concat(desc, "'\n");
                script += line;
            }
        }
        for (var _m = 0, _o = cmd.commands; _m < _o.length; _m++) {
            var sub = _o[_m];
            visit(sub, __spreadArray(__spreadArray([], parents, true), [cmdName], false));
        }
    };
    visit(program, []);
    return script;
}
