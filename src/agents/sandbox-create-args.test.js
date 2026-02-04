"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var sandbox_js_1 = require("./sandbox.js");
(0, vitest_1.describe)("buildSandboxCreateArgs", function () {
    (0, vitest_1.it)("includes hardening and resource flags", function () {
        var cfg = {
            image: "openclaw-sandbox:bookworm-slim",
            containerPrefix: "openclaw-sbx-",
            workdir: "/workspace",
            readOnlyRoot: true,
            tmpfs: ["/tmp"],
            network: "none",
            user: "1000:1000",
            capDrop: ["ALL"],
            env: { LANG: "C.UTF-8" },
            pidsLimit: 256,
            memory: "512m",
            memorySwap: 1024,
            cpus: 1.5,
            ulimits: {
                nofile: { soft: 1024, hard: 2048 },
                nproc: 128,
                core: "0",
            },
            seccompProfile: "/tmp/seccomp.json",
            apparmorProfile: "openclaw-sandbox",
            dns: ["1.1.1.1"],
            extraHosts: ["internal.service:10.0.0.5"],
        };
        var args = (0, sandbox_js_1.buildSandboxCreateArgs)({
            name: "openclaw-sbx-test",
            cfg: cfg,
            scopeKey: "main",
            createdAtMs: 1700000000000,
            labels: { "openclaw.sandboxBrowser": "1" },
        });
        (0, vitest_1.expect)(args).toEqual(vitest_1.expect.arrayContaining([
            "create",
            "--name",
            "openclaw-sbx-test",
            "--label",
            "openclaw.sandbox=1",
            "--label",
            "openclaw.sessionKey=main",
            "--label",
            "openclaw.createdAtMs=1700000000000",
            "--label",
            "openclaw.sandboxBrowser=1",
            "--read-only",
            "--tmpfs",
            "/tmp",
            "--network",
            "none",
            "--user",
            "1000:1000",
            "--cap-drop",
            "ALL",
            "--security-opt",
            "no-new-privileges",
            "--security-opt",
            "seccomp=/tmp/seccomp.json",
            "--security-opt",
            "apparmor=openclaw-sandbox",
            "--dns",
            "1.1.1.1",
            "--add-host",
            "internal.service:10.0.0.5",
            "--pids-limit",
            "256",
            "--memory",
            "512m",
            "--memory-swap",
            "1024",
            "--cpus",
            "1.5",
        ]));
        var ulimitValues = [];
        for (var i = 0; i < args.length; i += 1) {
            if (args[i] === "--ulimit") {
                var value = args[i + 1];
                if (value) {
                    ulimitValues.push(value);
                }
            }
        }
        (0, vitest_1.expect)(ulimitValues).toEqual(vitest_1.expect.arrayContaining(["nofile=1024:2048", "nproc=128", "core=0"]));
    });
    (0, vitest_1.it)("emits -v flags for custom binds", function () {
        var cfg = {
            image: "openclaw-sandbox:bookworm-slim",
            containerPrefix: "openclaw-sbx-",
            workdir: "/workspace",
            readOnlyRoot: false,
            tmpfs: [],
            network: "none",
            capDrop: [],
            binds: ["/home/user/source:/source:rw", "/var/run/docker.sock:/var/run/docker.sock"],
        };
        var args = (0, sandbox_js_1.buildSandboxCreateArgs)({
            name: "openclaw-sbx-binds",
            cfg: cfg,
            scopeKey: "main",
            createdAtMs: 1700000000000,
        });
        (0, vitest_1.expect)(args).toContain("-v");
        var vFlags = [];
        for (var i = 0; i < args.length; i++) {
            if (args[i] === "-v") {
                var value = args[i + 1];
                if (value) {
                    vFlags.push(value);
                }
            }
        }
        (0, vitest_1.expect)(vFlags).toContain("/home/user/source:/source:rw");
        (0, vitest_1.expect)(vFlags).toContain("/var/run/docker.sock:/var/run/docker.sock");
    });
    (0, vitest_1.it)("omits -v flags when binds is empty or undefined", function () {
        var cfg = {
            image: "openclaw-sandbox:bookworm-slim",
            containerPrefix: "openclaw-sbx-",
            workdir: "/workspace",
            readOnlyRoot: false,
            tmpfs: [],
            network: "none",
            capDrop: [],
            binds: [],
        };
        var args = (0, sandbox_js_1.buildSandboxCreateArgs)({
            name: "openclaw-sbx-no-binds",
            cfg: cfg,
            scopeKey: "main",
            createdAtMs: 1700000000000,
        });
        // Count -v flags that are NOT workspace mounts (workspace mounts are internal)
        var customVFlags = [];
        for (var i = 0; i < args.length; i++) {
            if (args[i] === "-v") {
                var value = args[i + 1];
                if (value && !value.includes("/workspace")) {
                    customVFlags.push(value);
                }
            }
        }
        (0, vitest_1.expect)(customVFlags).toHaveLength(0);
    });
});
