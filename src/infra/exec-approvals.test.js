"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var exec_approvals_js_1 = require("./exec-approvals.js");
function makePathEnv(binDir) {
    if (process.platform !== "win32") {
        return { PATH: binDir };
    }
    return { PATH: binDir, PATHEXT: ".EXE;.CMD;.BAT;.COM" };
}
function makeTempDir() {
    return node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-exec-approvals-"));
}
(0, vitest_1.describe)("exec approvals allowlist matching", function () {
    (0, vitest_1.it)("ignores basename-only patterns", function () {
        var resolution = {
            rawExecutable: "rg",
            resolvedPath: "/opt/homebrew/bin/rg",
            executableName: "rg",
        };
        var entries = [{ pattern: "RG" }];
        var match = (0, exec_approvals_js_1.matchAllowlist)(entries, resolution);
        (0, vitest_1.expect)(match).toBeNull();
    });
    (0, vitest_1.it)("matches by resolved path with **", function () {
        var resolution = {
            rawExecutable: "rg",
            resolvedPath: "/opt/homebrew/bin/rg",
            executableName: "rg",
        };
        var entries = [{ pattern: "/opt/**/rg" }];
        var match = (0, exec_approvals_js_1.matchAllowlist)(entries, resolution);
        (0, vitest_1.expect)(match === null || match === void 0 ? void 0 : match.pattern).toBe("/opt/**/rg");
    });
    (0, vitest_1.it)("does not let * cross path separators", function () {
        var resolution = {
            rawExecutable: "rg",
            resolvedPath: "/opt/homebrew/bin/rg",
            executableName: "rg",
        };
        var entries = [{ pattern: "/opt/*/rg" }];
        var match = (0, exec_approvals_js_1.matchAllowlist)(entries, resolution);
        (0, vitest_1.expect)(match).toBeNull();
    });
    (0, vitest_1.it)("requires a resolved path", function () {
        var resolution = {
            rawExecutable: "bin/rg",
            resolvedPath: undefined,
            executableName: "rg",
        };
        var entries = [{ pattern: "bin/rg" }];
        var match = (0, exec_approvals_js_1.matchAllowlist)(entries, resolution);
        (0, vitest_1.expect)(match).toBeNull();
    });
});
(0, vitest_1.describe)("exec approvals command resolution", function () {
    (0, vitest_1.it)("resolves PATH executables", function () {
        var dir = makeTempDir();
        var binDir = node_path_1.default.join(dir, "bin");
        node_fs_1.default.mkdirSync(binDir, { recursive: true });
        var exeName = process.platform === "win32" ? "rg.exe" : "rg";
        var exe = node_path_1.default.join(binDir, exeName);
        node_fs_1.default.writeFileSync(exe, "");
        node_fs_1.default.chmodSync(exe, 493);
        var res = (0, exec_approvals_js_1.resolveCommandResolution)("rg -n foo", undefined, makePathEnv(binDir));
        (0, vitest_1.expect)(res === null || res === void 0 ? void 0 : res.resolvedPath).toBe(exe);
        (0, vitest_1.expect)(res === null || res === void 0 ? void 0 : res.executableName).toBe(exeName);
    });
    (0, vitest_1.it)("resolves relative paths against cwd", function () {
        var dir = makeTempDir();
        var cwd = node_path_1.default.join(dir, "project");
        var script = node_path_1.default.join(cwd, "scripts", "run.sh");
        node_fs_1.default.mkdirSync(node_path_1.default.dirname(script), { recursive: true });
        node_fs_1.default.writeFileSync(script, "");
        node_fs_1.default.chmodSync(script, 493);
        var res = (0, exec_approvals_js_1.resolveCommandResolution)("./scripts/run.sh --flag", cwd, undefined);
        (0, vitest_1.expect)(res === null || res === void 0 ? void 0 : res.resolvedPath).toBe(script);
    });
    (0, vitest_1.it)("parses quoted executables", function () {
        var dir = makeTempDir();
        var cwd = node_path_1.default.join(dir, "project");
        var script = node_path_1.default.join(cwd, "bin", "tool");
        node_fs_1.default.mkdirSync(node_path_1.default.dirname(script), { recursive: true });
        node_fs_1.default.writeFileSync(script, "");
        node_fs_1.default.chmodSync(script, 493);
        var res = (0, exec_approvals_js_1.resolveCommandResolution)('"./bin/tool" --version', cwd, undefined);
        (0, vitest_1.expect)(res === null || res === void 0 ? void 0 : res.resolvedPath).toBe(script);
    });
});
(0, vitest_1.describe)("exec approvals shell parsing", function () {
    (0, vitest_1.it)("parses simple pipelines", function () {
        var res = (0, exec_approvals_js_1.analyzeShellCommand)({ command: "echo ok | jq .foo" });
        (0, vitest_1.expect)(res.ok).toBe(true);
        (0, vitest_1.expect)(res.segments.map(function (seg) { return seg.argv[0]; })).toEqual(["echo", "jq"]);
    });
    (0, vitest_1.it)("parses chained commands", function () {
        var _a;
        var res = (0, exec_approvals_js_1.analyzeShellCommand)({ command: "ls && rm -rf /" });
        (0, vitest_1.expect)(res.ok).toBe(true);
        (0, vitest_1.expect)((_a = res.chains) === null || _a === void 0 ? void 0 : _a.map(function (chain) { var _a; return (_a = chain[0]) === null || _a === void 0 ? void 0 : _a.argv[0]; })).toEqual(["ls", "rm"]);
    });
    (0, vitest_1.it)("parses argv commands", function () {
        var _a;
        var res = (0, exec_approvals_js_1.analyzeArgvCommand)({ argv: ["/bin/echo", "ok"] });
        (0, vitest_1.expect)(res.ok).toBe(true);
        (0, vitest_1.expect)((_a = res.segments[0]) === null || _a === void 0 ? void 0 : _a.argv).toEqual(["/bin/echo", "ok"]);
    });
});
(0, vitest_1.describe)("exec approvals shell allowlist (chained commands)", function () {
    (0, vitest_1.it)("allows chained commands when all parts are allowlisted", function () {
        var allowlist = [
            { pattern: "/usr/bin/obsidian-cli" },
            { pattern: "/usr/bin/head" },
        ];
        var result = (0, exec_approvals_js_1.evaluateShellAllowlist)({
            command: "/usr/bin/obsidian-cli print-default && /usr/bin/obsidian-cli search foo | /usr/bin/head",
            allowlist: allowlist,
            safeBins: new Set(),
            cwd: "/tmp",
        });
        (0, vitest_1.expect)(result.analysisOk).toBe(true);
        (0, vitest_1.expect)(result.allowlistSatisfied).toBe(true);
    });
    (0, vitest_1.it)("rejects chained commands when any part is not allowlisted", function () {
        var allowlist = [{ pattern: "/usr/bin/obsidian-cli" }];
        var result = (0, exec_approvals_js_1.evaluateShellAllowlist)({
            command: "/usr/bin/obsidian-cli print-default && /usr/bin/rm -rf /",
            allowlist: allowlist,
            safeBins: new Set(),
            cwd: "/tmp",
        });
        (0, vitest_1.expect)(result.analysisOk).toBe(true);
        (0, vitest_1.expect)(result.allowlistSatisfied).toBe(false);
    });
    (0, vitest_1.it)("returns analysisOk=false for malformed chains", function () {
        var allowlist = [{ pattern: "/usr/bin/echo" }];
        var result = (0, exec_approvals_js_1.evaluateShellAllowlist)({
            command: "/usr/bin/echo ok &&",
            allowlist: allowlist,
            safeBins: new Set(),
            cwd: "/tmp",
        });
        (0, vitest_1.expect)(result.analysisOk).toBe(false);
        (0, vitest_1.expect)(result.allowlistSatisfied).toBe(false);
    });
    (0, vitest_1.it)("respects quotes when splitting chains", function () {
        var allowlist = [{ pattern: "/usr/bin/echo" }];
        var result = (0, exec_approvals_js_1.evaluateShellAllowlist)({
            command: '/usr/bin/echo "foo && bar"',
            allowlist: allowlist,
            safeBins: new Set(),
            cwd: "/tmp",
        });
        (0, vitest_1.expect)(result.analysisOk).toBe(true);
        (0, vitest_1.expect)(result.allowlistSatisfied).toBe(true);
    });
});
(0, vitest_1.describe)("exec approvals safe bins", function () {
    (0, vitest_1.it)("allows safe bins with non-path args", function () {
        var dir = makeTempDir();
        var binDir = node_path_1.default.join(dir, "bin");
        node_fs_1.default.mkdirSync(binDir, { recursive: true });
        var exeName = process.platform === "win32" ? "jq.exe" : "jq";
        var exe = node_path_1.default.join(binDir, exeName);
        node_fs_1.default.writeFileSync(exe, "");
        node_fs_1.default.chmodSync(exe, 493);
        var res = (0, exec_approvals_js_1.analyzeShellCommand)({
            command: "jq .foo",
            cwd: dir,
            env: makePathEnv(binDir),
        });
        (0, vitest_1.expect)(res.ok).toBe(true);
        var segment = res.segments[0];
        var ok = (0, exec_approvals_js_1.isSafeBinUsage)({
            argv: segment.argv,
            resolution: segment.resolution,
            safeBins: (0, exec_approvals_js_1.normalizeSafeBins)(["jq"]),
            cwd: dir,
        });
        (0, vitest_1.expect)(ok).toBe(true);
    });
    (0, vitest_1.it)("blocks safe bins with file args", function () {
        var dir = makeTempDir();
        var binDir = node_path_1.default.join(dir, "bin");
        node_fs_1.default.mkdirSync(binDir, { recursive: true });
        var exeName = process.platform === "win32" ? "jq.exe" : "jq";
        var exe = node_path_1.default.join(binDir, exeName);
        node_fs_1.default.writeFileSync(exe, "");
        node_fs_1.default.chmodSync(exe, 493);
        var file = node_path_1.default.join(dir, "secret.json");
        node_fs_1.default.writeFileSync(file, "{}");
        var res = (0, exec_approvals_js_1.analyzeShellCommand)({
            command: "jq .foo secret.json",
            cwd: dir,
            env: makePathEnv(binDir),
        });
        (0, vitest_1.expect)(res.ok).toBe(true);
        var segment = res.segments[0];
        var ok = (0, exec_approvals_js_1.isSafeBinUsage)({
            argv: segment.argv,
            resolution: segment.resolution,
            safeBins: (0, exec_approvals_js_1.normalizeSafeBins)(["jq"]),
            cwd: dir,
        });
        (0, vitest_1.expect)(ok).toBe(false);
    });
});
(0, vitest_1.describe)("exec approvals allowlist evaluation", function () {
    (0, vitest_1.it)("satisfies allowlist on exact match", function () {
        var analysis = {
            ok: true,
            segments: [
                {
                    raw: "tool",
                    argv: ["tool"],
                    resolution: {
                        rawExecutable: "tool",
                        resolvedPath: "/usr/bin/tool",
                        executableName: "tool",
                    },
                },
            ],
        };
        var allowlist = [{ pattern: "/usr/bin/tool" }];
        var result = (0, exec_approvals_js_1.evaluateExecAllowlist)({
            analysis: analysis,
            allowlist: allowlist,
            safeBins: new Set(),
            cwd: "/tmp",
        });
        (0, vitest_1.expect)(result.allowlistSatisfied).toBe(true);
        (0, vitest_1.expect)(result.allowlistMatches.map(function (entry) { return entry.pattern; })).toEqual(["/usr/bin/tool"]);
    });
    (0, vitest_1.it)("satisfies allowlist via safe bins", function () {
        var analysis = {
            ok: true,
            segments: [
                {
                    raw: "jq .foo",
                    argv: ["jq", ".foo"],
                    resolution: {
                        rawExecutable: "jq",
                        resolvedPath: "/usr/bin/jq",
                        executableName: "jq",
                    },
                },
            ],
        };
        var result = (0, exec_approvals_js_1.evaluateExecAllowlist)({
            analysis: analysis,
            allowlist: [],
            safeBins: (0, exec_approvals_js_1.normalizeSafeBins)(["jq"]),
            cwd: "/tmp",
        });
        (0, vitest_1.expect)(result.allowlistSatisfied).toBe(true);
        (0, vitest_1.expect)(result.allowlistMatches).toEqual([]);
    });
    (0, vitest_1.it)("satisfies allowlist via auto-allow skills", function () {
        var analysis = {
            ok: true,
            segments: [
                {
                    raw: "skill-bin",
                    argv: ["skill-bin", "--help"],
                    resolution: {
                        rawExecutable: "skill-bin",
                        resolvedPath: "/opt/skills/skill-bin",
                        executableName: "skill-bin",
                    },
                },
            ],
        };
        var result = (0, exec_approvals_js_1.evaluateExecAllowlist)({
            analysis: analysis,
            allowlist: [],
            safeBins: new Set(),
            skillBins: new Set(["skill-bin"]),
            autoAllowSkills: true,
            cwd: "/tmp",
        });
        (0, vitest_1.expect)(result.allowlistSatisfied).toBe(true);
    });
});
(0, vitest_1.describe)("exec approvals policy helpers", function () {
    (0, vitest_1.it)("minSecurity returns the more restrictive value", function () {
        (0, vitest_1.expect)((0, exec_approvals_js_1.minSecurity)("deny", "full")).toBe("deny");
        (0, vitest_1.expect)((0, exec_approvals_js_1.minSecurity)("allowlist", "full")).toBe("allowlist");
    });
    (0, vitest_1.it)("maxAsk returns the more aggressive ask mode", function () {
        (0, vitest_1.expect)((0, exec_approvals_js_1.maxAsk)("off", "always")).toBe("always");
        (0, vitest_1.expect)((0, exec_approvals_js_1.maxAsk)("on-miss", "off")).toBe("on-miss");
    });
    (0, vitest_1.it)("requiresExecApproval respects ask mode and allowlist satisfaction", function () {
        (0, vitest_1.expect)((0, exec_approvals_js_1.requiresExecApproval)({
            ask: "always",
            security: "allowlist",
            analysisOk: true,
            allowlistSatisfied: true,
        })).toBe(true);
        (0, vitest_1.expect)((0, exec_approvals_js_1.requiresExecApproval)({
            ask: "off",
            security: "allowlist",
            analysisOk: true,
            allowlistSatisfied: false,
        })).toBe(false);
        (0, vitest_1.expect)((0, exec_approvals_js_1.requiresExecApproval)({
            ask: "on-miss",
            security: "allowlist",
            analysisOk: true,
            allowlistSatisfied: true,
        })).toBe(false);
        (0, vitest_1.expect)((0, exec_approvals_js_1.requiresExecApproval)({
            ask: "on-miss",
            security: "allowlist",
            analysisOk: false,
            allowlistSatisfied: false,
        })).toBe(true);
        (0, vitest_1.expect)((0, exec_approvals_js_1.requiresExecApproval)({
            ask: "on-miss",
            security: "full",
            analysisOk: false,
            allowlistSatisfied: false,
        })).toBe(false);
    });
});
(0, vitest_1.describe)("exec approvals wildcard agent", function () {
    (0, vitest_1.it)("merges wildcard allowlist entries with agent entries", function () {
        var dir = makeTempDir();
        var homedirSpy = vitest_1.vi.spyOn(node_os_1.default, "homedir").mockReturnValue(dir);
        try {
            var approvalsPath = node_path_1.default.join(dir, ".openclaw", "exec-approvals.json");
            node_fs_1.default.mkdirSync(node_path_1.default.dirname(approvalsPath), { recursive: true });
            node_fs_1.default.writeFileSync(approvalsPath, JSON.stringify({
                version: 1,
                agents: {
                    "*": { allowlist: [{ pattern: "/bin/hostname" }] },
                    main: { allowlist: [{ pattern: "/usr/bin/uname" }] },
                },
            }, null, 2));
            var resolved = (0, exec_approvals_js_1.resolveExecApprovals)("main");
            (0, vitest_1.expect)(resolved.allowlist.map(function (entry) { return entry.pattern; })).toEqual([
                "/bin/hostname",
                "/usr/bin/uname",
            ]);
        }
        finally {
            homedirSpy.mockRestore();
        }
    });
});
(0, vitest_1.describe)("exec approvals node host allowlist check", function () {
    // These tests verify the allowlist satisfaction logic used by the node host path
    // The node host checks: matchAllowlist() || isSafeBinUsage() for each command segment
    // Using hardcoded resolution objects for cross-platform compatibility
    (0, vitest_1.it)("satisfies allowlist when command matches exact path pattern", function () {
        var resolution = {
            rawExecutable: "python3",
            resolvedPath: "/usr/bin/python3",
            executableName: "python3",
        };
        var entries = [{ pattern: "/usr/bin/python3" }];
        var match = (0, exec_approvals_js_1.matchAllowlist)(entries, resolution);
        (0, vitest_1.expect)(match).not.toBeNull();
        (0, vitest_1.expect)(match === null || match === void 0 ? void 0 : match.pattern).toBe("/usr/bin/python3");
    });
    (0, vitest_1.it)("satisfies allowlist when command matches ** wildcard pattern", function () {
        // Simulates symlink resolution: /opt/homebrew/bin/python3 -> /opt/homebrew/opt/python@3.14/bin/python3.14
        var resolution = {
            rawExecutable: "python3",
            resolvedPath: "/opt/homebrew/opt/python@3.14/bin/python3.14",
            executableName: "python3.14",
        };
        // Pattern with ** matches across multiple directories
        var entries = [{ pattern: "/opt/**/python*" }];
        var match = (0, exec_approvals_js_1.matchAllowlist)(entries, resolution);
        (0, vitest_1.expect)(match === null || match === void 0 ? void 0 : match.pattern).toBe("/opt/**/python*");
    });
    (0, vitest_1.it)("does not satisfy allowlist when command is not in allowlist", function () {
        var resolution = {
            rawExecutable: "unknown-tool",
            resolvedPath: "/usr/local/bin/unknown-tool",
            executableName: "unknown-tool",
        };
        // Allowlist has different commands
        var entries = [
            { pattern: "/usr/bin/python3" },
            { pattern: "/opt/**/node" },
        ];
        var match = (0, exec_approvals_js_1.matchAllowlist)(entries, resolution);
        (0, vitest_1.expect)(match).toBeNull();
        // Also not a safe bin
        var safe = (0, exec_approvals_js_1.isSafeBinUsage)({
            argv: ["unknown-tool", "--help"],
            resolution: resolution,
            safeBins: (0, exec_approvals_js_1.normalizeSafeBins)(["jq", "curl"]),
            cwd: "/tmp",
        });
        (0, vitest_1.expect)(safe).toBe(false);
    });
    (0, vitest_1.it)("satisfies via safeBins even when not in allowlist", function () {
        var resolution = {
            rawExecutable: "jq",
            resolvedPath: "/usr/bin/jq",
            executableName: "jq",
        };
        // Not in allowlist
        var entries = [{ pattern: "/usr/bin/python3" }];
        var match = (0, exec_approvals_js_1.matchAllowlist)(entries, resolution);
        (0, vitest_1.expect)(match).toBeNull();
        // But is a safe bin with non-file args
        var safe = (0, exec_approvals_js_1.isSafeBinUsage)({
            argv: ["jq", ".foo"],
            resolution: resolution,
            safeBins: (0, exec_approvals_js_1.normalizeSafeBins)(["jq"]),
            cwd: "/tmp",
        });
        (0, vitest_1.expect)(safe).toBe(true);
    });
});
(0, vitest_1.describe)("exec approvals default agent migration", function () {
    (0, vitest_1.it)("migrates legacy default agent entries to main", function () {
        var _a, _b, _c, _d, _e;
        var file = {
            version: 1,
            agents: {
                default: { allowlist: [{ pattern: "/bin/legacy" }] },
            },
        };
        var resolved = (0, exec_approvals_js_1.resolveExecApprovalsFromFile)({ file: file });
        (0, vitest_1.expect)(resolved.allowlist.map(function (entry) { return entry.pattern; })).toEqual(["/bin/legacy"]);
        (0, vitest_1.expect)((_a = resolved.file.agents) === null || _a === void 0 ? void 0 : _a.default).toBeUndefined();
        (0, vitest_1.expect)((_e = (_d = (_c = (_b = resolved.file.agents) === null || _b === void 0 ? void 0 : _b.main) === null || _c === void 0 ? void 0 : _c.allowlist) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.pattern).toBe("/bin/legacy");
    });
    (0, vitest_1.it)("prefers main agent settings when both main and default exist", function () {
        var _a;
        var file = {
            version: 1,
            agents: {
                main: { ask: "always", allowlist: [{ pattern: "/bin/main" }] },
                default: { ask: "off", allowlist: [{ pattern: "/bin/legacy" }] },
            },
        };
        var resolved = (0, exec_approvals_js_1.resolveExecApprovalsFromFile)({ file: file });
        (0, vitest_1.expect)(resolved.agent.ask).toBe("always");
        (0, vitest_1.expect)(resolved.allowlist.map(function (entry) { return entry.pattern; })).toEqual(["/bin/main", "/bin/legacy"]);
        (0, vitest_1.expect)((_a = resolved.file.agents) === null || _a === void 0 ? void 0 : _a.default).toBeUndefined();
    });
});
