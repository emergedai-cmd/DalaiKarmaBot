"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachGatewayWsConnectionHandler = attachGatewayWsConnectionHandler;
var node_crypto_1 = require("node:crypto");
var canvas_host_url_js_1 = require("../../infra/canvas-host-url.js");
var system_presence_js_1 = require("../../infra/system-presence.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var net_js_1 = require("../net.js");
var server_constants_js_1 = require("../server-constants.js");
var server_utils_js_1 = require("../server-utils.js");
var ws_log_js_1 = require("../ws-log.js");
var health_state_js_1 = require("./health-state.js");
var message_handler_js_1 = require("./ws-connection/message-handler.js");
function attachGatewayWsConnectionHandler(params) {
    var wss = params.wss, clients = params.clients, port = params.port, gatewayHost = params.gatewayHost, canvasHostEnabled = params.canvasHostEnabled, canvasHostServerPort = params.canvasHostServerPort, resolvedAuth = params.resolvedAuth, gatewayMethods = params.gatewayMethods, events = params.events, logGateway = params.logGateway, logHealth = params.logHealth, logWsControl = params.logWsControl, extraHandlers = params.extraHandlers, broadcast = params.broadcast, buildRequestContext = params.buildRequestContext;
    wss.on("connection", function (socket, upgradeReq) {
        var _a, _b;
        var client = null;
        var closed = false;
        var openedAt = Date.now();
        var connId = (0, node_crypto_1.randomUUID)();
        var remoteAddr = (_a = socket._socket) === null || _a === void 0 ? void 0 : _a.remoteAddress;
        var headerValue = function (value) {
            return Array.isArray(value) ? value[0] : value;
        };
        var requestHost = headerValue(upgradeReq.headers.host);
        var requestOrigin = headerValue(upgradeReq.headers.origin);
        var requestUserAgent = headerValue(upgradeReq.headers["user-agent"]);
        var forwardedFor = headerValue(upgradeReq.headers["x-forwarded-for"]);
        var realIp = headerValue(upgradeReq.headers["x-real-ip"]);
        var canvasHostPortForWs = canvasHostServerPort !== null && canvasHostServerPort !== void 0 ? canvasHostServerPort : (canvasHostEnabled ? port : undefined);
        var canvasHostOverride = gatewayHost && gatewayHost !== "0.0.0.0" && gatewayHost !== "::" ? gatewayHost : undefined;
        var canvasHostUrl = (0, canvas_host_url_js_1.resolveCanvasHostUrl)({
            canvasPort: canvasHostPortForWs,
            hostOverride: canvasHostServerPort ? canvasHostOverride : undefined,
            requestHost: upgradeReq.headers.host,
            forwardedProto: upgradeReq.headers["x-forwarded-proto"],
            localAddress: (_b = upgradeReq.socket) === null || _b === void 0 ? void 0 : _b.localAddress,
        });
        (0, ws_log_js_1.logWs)("in", "open", { connId: connId, remoteAddr: remoteAddr });
        var handshakeState = "pending";
        var closeCause;
        var closeMeta = {};
        var lastFrameType;
        var lastFrameMethod;
        var lastFrameId;
        var setCloseCause = function (cause, meta) {
            if (!closeCause) {
                closeCause = cause;
            }
            if (meta && Object.keys(meta).length > 0) {
                closeMeta = __assign(__assign({}, closeMeta), meta);
            }
        };
        var setLastFrameMeta = function (meta) {
            var _a, _b, _c;
            if (meta.type || meta.method || meta.id) {
                lastFrameType = (_a = meta.type) !== null && _a !== void 0 ? _a : lastFrameType;
                lastFrameMethod = (_b = meta.method) !== null && _b !== void 0 ? _b : lastFrameMethod;
                lastFrameId = (_c = meta.id) !== null && _c !== void 0 ? _c : lastFrameId;
            }
        };
        var send = function (obj) {
            try {
                socket.send(JSON.stringify(obj));
            }
            catch (_a) {
                /* ignore */
            }
        };
        var connectNonce = (0, node_crypto_1.randomUUID)();
        send({
            type: "event",
            event: "connect.challenge",
            payload: { nonce: connectNonce, ts: Date.now() },
        });
        var close = function (code, reason) {
            if (code === void 0) { code = 1000; }
            if (closed) {
                return;
            }
            closed = true;
            clearTimeout(handshakeTimer);
            if (client) {
                clients.delete(client);
            }
            try {
                socket.close(code, reason);
            }
            catch (_a) {
                /* ignore */
            }
        };
        socket.once("error", function (err) {
            logWsControl.warn("error conn=".concat(connId, " remote=").concat(remoteAddr !== null && remoteAddr !== void 0 ? remoteAddr : "?", ": ").concat((0, server_utils_js_1.formatError)(err)));
            close();
        });
        var isNoisySwiftPmHelperClose = function (userAgent, remote) {
            return Boolean((userAgent === null || userAgent === void 0 ? void 0 : userAgent.toLowerCase().includes("swiftpm-testing-helper")) && (0, net_js_1.isLoopbackAddress)(remote));
        };
        socket.once("close", function (code, reason) {
            var _a;
            var durationMs = Date.now() - openedAt;
            var closeContext = __assign({ cause: closeCause, handshake: handshakeState, durationMs: durationMs, lastFrameType: lastFrameType, lastFrameMethod: lastFrameMethod, lastFrameId: lastFrameId, host: requestHost, origin: requestOrigin, userAgent: requestUserAgent, forwardedFor: forwardedFor }, closeMeta);
            if (!client) {
                var logFn = isNoisySwiftPmHelperClose(requestUserAgent, remoteAddr)
                    ? logWsControl.debug
                    : logWsControl.warn;
                logFn("closed before connect conn=".concat(connId, " remote=").concat(remoteAddr !== null && remoteAddr !== void 0 ? remoteAddr : "?", " fwd=").concat(forwardedFor !== null && forwardedFor !== void 0 ? forwardedFor : "n/a", " origin=").concat(requestOrigin !== null && requestOrigin !== void 0 ? requestOrigin : "n/a", " host=").concat(requestHost !== null && requestHost !== void 0 ? requestHost : "n/a", " ua=").concat(requestUserAgent !== null && requestUserAgent !== void 0 ? requestUserAgent : "n/a", " code=").concat(code !== null && code !== void 0 ? code : "n/a", " reason=").concat((reason === null || reason === void 0 ? void 0 : reason.toString()) || "n/a"), closeContext);
            }
            if (client && (0, message_channel_js_1.isWebchatClient)(client.connect.client)) {
                logWsControl.info("webchat disconnected code=".concat(code, " reason=").concat((reason === null || reason === void 0 ? void 0 : reason.toString()) || "n/a", " conn=").concat(connId));
            }
            if (client === null || client === void 0 ? void 0 : client.presenceKey) {
                (0, system_presence_js_1.upsertPresence)(client.presenceKey, { reason: "disconnect" });
                (0, health_state_js_1.incrementPresenceVersion)();
                broadcast("presence", { presence: (0, system_presence_js_1.listSystemPresence)() }, {
                    dropIfSlow: true,
                    stateVersion: {
                        presence: (0, health_state_js_1.getPresenceVersion)(),
                        health: (0, health_state_js_1.getHealthVersion)(),
                    },
                });
            }
            if (((_a = client === null || client === void 0 ? void 0 : client.connect) === null || _a === void 0 ? void 0 : _a.role) === "node") {
                var context = buildRequestContext();
                var nodeId = context.nodeRegistry.unregister(connId);
                if (nodeId) {
                    context.nodeUnsubscribeAll(nodeId);
                }
            }
            (0, ws_log_js_1.logWs)("out", "close", {
                connId: connId,
                code: code,
                reason: reason === null || reason === void 0 ? void 0 : reason.toString(),
                durationMs: durationMs,
                cause: closeCause,
                handshake: handshakeState,
                lastFrameType: lastFrameType,
                lastFrameMethod: lastFrameMethod,
                lastFrameId: lastFrameId,
            });
            close();
        });
        var handshakeTimeoutMs = (0, server_constants_js_1.getHandshakeTimeoutMs)();
        var handshakeTimer = setTimeout(function () {
            if (!client) {
                handshakeState = "failed";
                setCloseCause("handshake-timeout", {
                    handshakeMs: Date.now() - openedAt,
                });
                logWsControl.warn("handshake timeout conn=".concat(connId, " remote=").concat(remoteAddr !== null && remoteAddr !== void 0 ? remoteAddr : "?"));
                close();
            }
        }, handshakeTimeoutMs);
        (0, message_handler_js_1.attachGatewayWsMessageHandler)({
            socket: socket,
            upgradeReq: upgradeReq,
            connId: connId,
            remoteAddr: remoteAddr,
            forwardedFor: forwardedFor,
            realIp: realIp,
            requestHost: requestHost,
            requestOrigin: requestOrigin,
            requestUserAgent: requestUserAgent,
            canvasHostUrl: canvasHostUrl,
            connectNonce: connectNonce,
            resolvedAuth: resolvedAuth,
            gatewayMethods: gatewayMethods,
            events: events,
            extraHandlers: extraHandlers,
            buildRequestContext: buildRequestContext,
            send: send,
            close: close,
            isClosed: function () { return closed; },
            clearHandshakeTimer: function () { return clearTimeout(handshakeTimer); },
            getClient: function () { return client; },
            setClient: function (next) {
                client = next;
                clients.add(next);
            },
            setHandshakeState: function (next) {
                handshakeState = next;
            },
            setCloseCause: setCloseCause,
            setLastFrameMeta: setLastFrameMeta,
            logGateway: logGateway,
            logHealth: logHealth,
            logWsControl: logWsControl,
        });
    });
}
