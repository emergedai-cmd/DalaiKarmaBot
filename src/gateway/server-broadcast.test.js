"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var server_broadcast_js_1 = require("./server-broadcast.js");
(0, vitest_1.describe)("gateway broadcaster", function () {
    (0, vitest_1.it)("filters approval and pairing events by scope", function () {
        var approvalsSocket = {
            bufferedAmount: 0,
            send: vitest_1.vi.fn(),
            close: vitest_1.vi.fn(),
        };
        var pairingSocket = {
            bufferedAmount: 0,
            send: vitest_1.vi.fn(),
            close: vitest_1.vi.fn(),
        };
        var readSocket = {
            bufferedAmount: 0,
            send: vitest_1.vi.fn(),
            close: vitest_1.vi.fn(),
        };
        var clients = new Set([
            {
                socket: approvalsSocket,
                connect: { role: "operator", scopes: ["operator.approvals"] },
                connId: "c-approvals",
            },
            {
                socket: pairingSocket,
                connect: { role: "operator", scopes: ["operator.pairing"] },
                connId: "c-pairing",
            },
            {
                socket: readSocket,
                connect: { role: "operator", scopes: ["operator.read"] },
                connId: "c-read",
            },
        ]);
        var broadcast = (0, server_broadcast_js_1.createGatewayBroadcaster)({ clients: clients }).broadcast;
        broadcast("exec.approval.requested", { id: "1" });
        broadcast("device.pair.requested", { requestId: "r1" });
        (0, vitest_1.expect)(approvalsSocket.send).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(pairingSocket.send).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(readSocket.send).toHaveBeenCalledTimes(0);
    });
});
