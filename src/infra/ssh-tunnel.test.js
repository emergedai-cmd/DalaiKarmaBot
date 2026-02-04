"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var ssh_tunnel_js_1 = require("./ssh-tunnel.js");
(0, vitest_1.describe)("parseSshTarget", function () {
    (0, vitest_1.it)("parses user@host:port targets", function () {
        (0, vitest_1.expect)((0, ssh_tunnel_js_1.parseSshTarget)("me@example.com:2222")).toEqual({
            user: "me",
            host: "example.com",
            port: 2222,
        });
    });
    (0, vitest_1.it)("parses host-only targets with default port", function () {
        (0, vitest_1.expect)((0, ssh_tunnel_js_1.parseSshTarget)("example.com")).toEqual({
            user: undefined,
            host: "example.com",
            port: 22,
        });
    });
    (0, vitest_1.it)("rejects hostnames that start with '-'", function () {
        (0, vitest_1.expect)((0, ssh_tunnel_js_1.parseSshTarget)("-V")).toBeNull();
        (0, vitest_1.expect)((0, ssh_tunnel_js_1.parseSshTarget)("me@-badhost")).toBeNull();
        (0, vitest_1.expect)((0, ssh_tunnel_js_1.parseSshTarget)("-oProxyCommand=echo")).toBeNull();
    });
});
