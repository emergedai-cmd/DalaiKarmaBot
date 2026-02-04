"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var widearea_dns_js_1 = require("./widearea-dns.js");
(0, vitest_1.describe)("wide-area DNS-SD zone rendering", function () {
    (0, vitest_1.it)("renders a zone with gateway PTR/SRV/TXT records", function () {
        var txt = (0, widearea_dns_js_1.renderWideAreaGatewayZoneText)({
            domain: "openclaw.internal.",
            serial: 2025121701,
            gatewayPort: 18789,
            displayName: "Mac Studio (OpenClaw)",
            tailnetIPv4: "100.123.224.76",
            tailnetIPv6: "fd7a:115c:a1e0::8801:e04c",
            hostLabel: "studio-london",
            instanceLabel: "studio-london",
            sshPort: 22,
            cliPath: "/opt/homebrew/bin/openclaw",
        });
        (0, vitest_1.expect)(txt).toContain("$ORIGIN openclaw.internal.");
        (0, vitest_1.expect)(txt).toContain("studio-london IN A 100.123.224.76");
        (0, vitest_1.expect)(txt).toContain("studio-london IN AAAA fd7a:115c:a1e0::8801:e04c");
        (0, vitest_1.expect)(txt).toContain("_openclaw-gw._tcp IN PTR studio-london._openclaw-gw._tcp");
        (0, vitest_1.expect)(txt).toContain("studio-london._openclaw-gw._tcp IN SRV 0 0 18789 studio-london");
        (0, vitest_1.expect)(txt).toContain("displayName=Mac Studio (OpenClaw)");
        (0, vitest_1.expect)(txt).toContain("gatewayPort=18789");
        (0, vitest_1.expect)(txt).toContain("sshPort=22");
        (0, vitest_1.expect)(txt).toContain("cliPath=/opt/homebrew/bin/openclaw");
    });
    (0, vitest_1.it)("includes tailnetDns when provided", function () {
        var txt = (0, widearea_dns_js_1.renderWideAreaGatewayZoneText)({
            domain: "openclaw.internal.",
            serial: 2025121701,
            gatewayPort: 18789,
            displayName: "Mac Studio (OpenClaw)",
            tailnetIPv4: "100.123.224.76",
            tailnetDns: "peters-mac-studio-1.sheep-coho.ts.net",
            hostLabel: "studio-london",
            instanceLabel: "studio-london",
        });
        (0, vitest_1.expect)(txt).toContain("tailnetDns=peters-mac-studio-1.sheep-coho.ts.net");
    });
});
