"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var server_node_subscriptions_js_1 = require("./server-node-subscriptions.js");
(0, vitest_1.describe)("node subscription manager", function () {
    (0, vitest_1.test)("routes events to subscribed nodes", function () {
        var manager = (0, server_node_subscriptions_js_1.createNodeSubscriptionManager)();
        var sent = [];
        var sendEvent = function (evt) {
            return sent.push(evt);
        };
        manager.subscribe("node-a", "main");
        manager.subscribe("node-b", "main");
        manager.sendToSession("main", "chat", { ok: true }, sendEvent);
        (0, vitest_1.expect)(sent).toHaveLength(2);
        (0, vitest_1.expect)(sent.map(function (s) { return s.nodeId; }).toSorted()).toEqual(["node-a", "node-b"]);
        (0, vitest_1.expect)(sent[0].event).toBe("chat");
    });
    (0, vitest_1.test)("unsubscribeAll clears session mappings", function () {
        var manager = (0, server_node_subscriptions_js_1.createNodeSubscriptionManager)();
        var sent = [];
        var sendEvent = function (evt) {
            return sent.push("".concat(evt.nodeId, ":").concat(evt.event));
        };
        manager.subscribe("node-a", "main");
        manager.subscribe("node-a", "secondary");
        manager.unsubscribeAll("node-a");
        manager.sendToSession("main", "tick", {}, sendEvent);
        manager.sendToSession("secondary", "tick", {}, sendEvent);
        (0, vitest_1.expect)(sent).toEqual([]);
    });
});
