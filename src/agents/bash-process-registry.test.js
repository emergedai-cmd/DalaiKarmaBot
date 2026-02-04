"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var bash_process_registry_js_1 = require("./bash-process-registry.js");
(0, vitest_1.describe)("bash process registry", function () {
    (0, vitest_1.beforeEach)(function () {
        (0, bash_process_registry_js_1.resetProcessRegistryForTests)();
    });
    (0, vitest_1.it)("captures output and truncates", function () {
        var session = {
            id: "sess",
            command: "echo test",
            child: { pid: 123 },
            startedAt: Date.now(),
            cwd: "/tmp",
            maxOutputChars: 10,
            pendingMaxOutputChars: 30000,
            totalOutputChars: 0,
            pendingStdout: [],
            pendingStderr: [],
            pendingStdoutChars: 0,
            pendingStderrChars: 0,
            aggregated: "",
            tail: "",
            exited: false,
            exitCode: undefined,
            exitSignal: undefined,
            truncated: false,
            backgrounded: false,
        };
        (0, bash_process_registry_js_1.addSession)(session);
        (0, bash_process_registry_js_1.appendOutput)(session, "stdout", "0123456789");
        (0, bash_process_registry_js_1.appendOutput)(session, "stdout", "abcdef");
        (0, vitest_1.expect)(session.aggregated).toBe("6789abcdef");
        (0, vitest_1.expect)(session.truncated).toBe(true);
    });
    (0, vitest_1.it)("caps pending output to avoid runaway polls", function () {
        var session = {
            id: "sess",
            command: "echo test",
            child: { pid: 123 },
            startedAt: Date.now(),
            cwd: "/tmp",
            maxOutputChars: 100000,
            pendingMaxOutputChars: 20000,
            totalOutputChars: 0,
            pendingStdout: [],
            pendingStderr: [],
            pendingStdoutChars: 0,
            pendingStderrChars: 0,
            aggregated: "",
            tail: "",
            exited: false,
            exitCode: undefined,
            exitSignal: undefined,
            truncated: false,
            backgrounded: true,
        };
        (0, bash_process_registry_js_1.addSession)(session);
        var payload = "".concat("a".repeat(70000)).concat("b".repeat(20000));
        (0, bash_process_registry_js_1.appendOutput)(session, "stdout", payload);
        var drained = (0, bash_process_registry_js_1.drainSession)(session);
        (0, vitest_1.expect)(drained.stdout).toBe("b".repeat(20000));
        (0, vitest_1.expect)(session.pendingStdout).toHaveLength(0);
        (0, vitest_1.expect)(session.pendingStdoutChars).toBe(0);
        (0, vitest_1.expect)(session.truncated).toBe(true);
    });
    (0, vitest_1.it)("respects max output cap when pending cap is larger", function () {
        var session = {
            id: "sess",
            command: "echo test",
            child: { pid: 123 },
            startedAt: Date.now(),
            cwd: "/tmp",
            maxOutputChars: 5000,
            pendingMaxOutputChars: 30000,
            totalOutputChars: 0,
            pendingStdout: [],
            pendingStderr: [],
            pendingStdoutChars: 0,
            pendingStderrChars: 0,
            aggregated: "",
            tail: "",
            exited: false,
            exitCode: undefined,
            exitSignal: undefined,
            truncated: false,
            backgrounded: true,
        };
        (0, bash_process_registry_js_1.addSession)(session);
        (0, bash_process_registry_js_1.appendOutput)(session, "stdout", "x".repeat(10000));
        var drained = (0, bash_process_registry_js_1.drainSession)(session);
        (0, vitest_1.expect)(drained.stdout.length).toBe(5000);
        (0, vitest_1.expect)(session.truncated).toBe(true);
    });
    (0, vitest_1.it)("caps stdout and stderr independently", function () {
        var session = {
            id: "sess",
            command: "echo test",
            child: { pid: 123 },
            startedAt: Date.now(),
            cwd: "/tmp",
            maxOutputChars: 100,
            pendingMaxOutputChars: 10,
            totalOutputChars: 0,
            pendingStdout: [],
            pendingStderr: [],
            pendingStdoutChars: 0,
            pendingStderrChars: 0,
            aggregated: "",
            tail: "",
            exited: false,
            exitCode: undefined,
            exitSignal: undefined,
            truncated: false,
            backgrounded: true,
        };
        (0, bash_process_registry_js_1.addSession)(session);
        (0, bash_process_registry_js_1.appendOutput)(session, "stdout", "a".repeat(6));
        (0, bash_process_registry_js_1.appendOutput)(session, "stdout", "b".repeat(6));
        (0, bash_process_registry_js_1.appendOutput)(session, "stderr", "c".repeat(12));
        var drained = (0, bash_process_registry_js_1.drainSession)(session);
        (0, vitest_1.expect)(drained.stdout).toBe("a".repeat(4) + "b".repeat(6));
        (0, vitest_1.expect)(drained.stderr).toBe("c".repeat(10));
        (0, vitest_1.expect)(session.truncated).toBe(true);
    });
    (0, vitest_1.it)("only persists finished sessions when backgrounded", function () {
        var session = {
            id: "sess",
            command: "echo test",
            child: { pid: 123 },
            startedAt: Date.now(),
            cwd: "/tmp",
            maxOutputChars: 100,
            pendingMaxOutputChars: 30000,
            totalOutputChars: 0,
            pendingStdout: [],
            pendingStderr: [],
            pendingStdoutChars: 0,
            pendingStderrChars: 0,
            aggregated: "",
            tail: "",
            exited: false,
            exitCode: undefined,
            exitSignal: undefined,
            truncated: false,
            backgrounded: false,
        };
        (0, bash_process_registry_js_1.addSession)(session);
        (0, bash_process_registry_js_1.markExited)(session, 0, null, "completed");
        (0, vitest_1.expect)((0, bash_process_registry_js_1.listFinishedSessions)()).toHaveLength(0);
        (0, bash_process_registry_js_1.markBackgrounded)(session);
        (0, bash_process_registry_js_1.markExited)(session, 0, null, "completed");
        (0, vitest_1.expect)((0, bash_process_registry_js_1.listFinishedSessions)()).toHaveLength(1);
    });
});
