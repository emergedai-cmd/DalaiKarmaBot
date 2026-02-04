"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasConnectedMobileNode = hasConnectedMobileNode;
var isMobilePlatform = function (platform) {
    var p = typeof platform === "string" ? platform.trim().toLowerCase() : "";
    if (!p) {
        return false;
    }
    return p.startsWith("ios") || p.startsWith("ipados") || p.startsWith("android");
};
function hasConnectedMobileNode(registry) {
    var connected = registry.listConnected();
    return connected.some(function (n) { return isMobilePlatform(n.platform); });
}
