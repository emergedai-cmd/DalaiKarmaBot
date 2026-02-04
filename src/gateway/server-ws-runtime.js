"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachGatewayWsHandlers = attachGatewayWsHandlers;
var ws_connection_js_1 = require("./server/ws-connection.js");
function attachGatewayWsHandlers(params) {
    (0, ws_connection_js_1.attachGatewayWsConnectionHandler)({
        wss: params.wss,
        clients: params.clients,
        port: params.port,
        gatewayHost: params.gatewayHost,
        canvasHostEnabled: params.canvasHostEnabled,
        canvasHostServerPort: params.canvasHostServerPort,
        resolvedAuth: params.resolvedAuth,
        gatewayMethods: params.gatewayMethods,
        events: params.events,
        logGateway: params.logGateway,
        logHealth: params.logHealth,
        logWsControl: params.logWsControl,
        extraHandlers: params.extraHandlers,
        broadcast: params.broadcast,
        buildRequestContext: function () { return params.context; },
    });
}
