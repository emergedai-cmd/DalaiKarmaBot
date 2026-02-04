"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_WS_SLOW_MS = void 0;
exports.setGatewayWsLogStyle = setGatewayWsLogStyle;
exports.getGatewayWsLogStyle = getGatewayWsLogStyle;
var gatewayWsLogStyle = "auto";
function setGatewayWsLogStyle(style) {
    gatewayWsLogStyle = style;
}
function getGatewayWsLogStyle() {
    return gatewayWsLogStyle;
}
exports.DEFAULT_WS_SLOW_MS = 50;
