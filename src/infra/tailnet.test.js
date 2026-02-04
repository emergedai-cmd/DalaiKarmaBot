"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_os_1 = require("node:os");
var vitest_1 = require("vitest");
var tailnet_js_1 = require("./tailnet.js");
(0, vitest_1.describe)("tailnet address detection", function () {
    (0, vitest_1.it)("detects tailscale IPv4 and IPv6 addresses", function () {
        vitest_1.vi.spyOn(node_os_1.default, "networkInterfaces").mockReturnValue({
            lo0: [
                { address: "127.0.0.1", family: "IPv4", internal: true, netmask: "" },
            ],
            utun9: [
                {
                    address: "100.123.224.76",
                    family: "IPv4",
                    internal: false,
                    netmask: "",
                },
                {
                    address: "fd7a:115c:a1e0::8801:e04c",
                    family: "IPv6",
                    internal: false,
                    netmask: "",
                },
            ],
        });
        var out = (0, tailnet_js_1.listTailnetAddresses)();
        (0, vitest_1.expect)(out.ipv4).toEqual(["100.123.224.76"]);
        (0, vitest_1.expect)(out.ipv6).toEqual(["fd7a:115c:a1e0::8801:e04c"]);
    });
});
