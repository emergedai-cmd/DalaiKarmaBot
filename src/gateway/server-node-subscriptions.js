"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNodeSubscriptionManager = createNodeSubscriptionManager;
function createNodeSubscriptionManager() {
    var nodeSubscriptions = new Map();
    var sessionSubscribers = new Map();
    var toPayloadJSON = function (payload) { return (payload ? JSON.stringify(payload) : null); };
    var subscribe = function (nodeId, sessionKey) {
        var normalizedNodeId = nodeId.trim();
        var normalizedSessionKey = sessionKey.trim();
        if (!normalizedNodeId || !normalizedSessionKey) {
            return;
        }
        var nodeSet = nodeSubscriptions.get(normalizedNodeId);
        if (!nodeSet) {
            nodeSet = new Set();
            nodeSubscriptions.set(normalizedNodeId, nodeSet);
        }
        if (nodeSet.has(normalizedSessionKey)) {
            return;
        }
        nodeSet.add(normalizedSessionKey);
        var sessionSet = sessionSubscribers.get(normalizedSessionKey);
        if (!sessionSet) {
            sessionSet = new Set();
            sessionSubscribers.set(normalizedSessionKey, sessionSet);
        }
        sessionSet.add(normalizedNodeId);
    };
    var unsubscribe = function (nodeId, sessionKey) {
        var normalizedNodeId = nodeId.trim();
        var normalizedSessionKey = sessionKey.trim();
        if (!normalizedNodeId || !normalizedSessionKey) {
            return;
        }
        var nodeSet = nodeSubscriptions.get(normalizedNodeId);
        nodeSet === null || nodeSet === void 0 ? void 0 : nodeSet.delete(normalizedSessionKey);
        if ((nodeSet === null || nodeSet === void 0 ? void 0 : nodeSet.size) === 0) {
            nodeSubscriptions.delete(normalizedNodeId);
        }
        var sessionSet = sessionSubscribers.get(normalizedSessionKey);
        sessionSet === null || sessionSet === void 0 ? void 0 : sessionSet.delete(normalizedNodeId);
        if ((sessionSet === null || sessionSet === void 0 ? void 0 : sessionSet.size) === 0) {
            sessionSubscribers.delete(normalizedSessionKey);
        }
    };
    var unsubscribeAll = function (nodeId) {
        var normalizedNodeId = nodeId.trim();
        var nodeSet = nodeSubscriptions.get(normalizedNodeId);
        if (!nodeSet) {
            return;
        }
        for (var _i = 0, nodeSet_1 = nodeSet; _i < nodeSet_1.length; _i++) {
            var sessionKey = nodeSet_1[_i];
            var sessionSet = sessionSubscribers.get(sessionKey);
            sessionSet === null || sessionSet === void 0 ? void 0 : sessionSet.delete(normalizedNodeId);
            if ((sessionSet === null || sessionSet === void 0 ? void 0 : sessionSet.size) === 0) {
                sessionSubscribers.delete(sessionKey);
            }
        }
        nodeSubscriptions.delete(normalizedNodeId);
    };
    var sendToSession = function (sessionKey, event, payload, sendEvent) {
        var normalizedSessionKey = sessionKey.trim();
        if (!normalizedSessionKey || !sendEvent) {
            return;
        }
        var subs = sessionSubscribers.get(normalizedSessionKey);
        if (!subs || subs.size === 0) {
            return;
        }
        var payloadJSON = toPayloadJSON(payload);
        for (var _i = 0, subs_1 = subs; _i < subs_1.length; _i++) {
            var nodeId = subs_1[_i];
            sendEvent({ nodeId: nodeId, event: event, payloadJSON: payloadJSON });
        }
    };
    var sendToAllSubscribed = function (event, payload, sendEvent) {
        if (!sendEvent) {
            return;
        }
        var payloadJSON = toPayloadJSON(payload);
        for (var _i = 0, _a = nodeSubscriptions.keys(); _i < _a.length; _i++) {
            var nodeId = _a[_i];
            sendEvent({ nodeId: nodeId, event: event, payloadJSON: payloadJSON });
        }
    };
    var sendToAllConnected = function (event, payload, listConnected, sendEvent) {
        if (!sendEvent || !listConnected) {
            return;
        }
        var payloadJSON = toPayloadJSON(payload);
        for (var _i = 0, _a = listConnected(); _i < _a.length; _i++) {
            var node = _a[_i];
            sendEvent({ nodeId: node.nodeId, event: event, payloadJSON: payloadJSON });
        }
    };
    var clear = function () {
        nodeSubscriptions.clear();
        sessionSubscribers.clear();
    };
    return {
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        unsubscribeAll: unsubscribeAll,
        sendToSession: sendToSession,
        sendToAllSubscribed: sendToAllSubscribed,
        sendToAllConnected: sendToAllConnected,
        clear: clear,
    };
}
