"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOverlayHandlers = createOverlayHandlers;
function createOverlayHandlers(host, fallbackFocus) {
    var openOverlay = function (component) {
        host.showOverlay(component);
    };
    var closeOverlay = function () {
        if (host.hasOverlay()) {
            host.hideOverlay();
            return;
        }
        host.setFocus(fallbackFocus);
    };
    return { openOverlay: openOverlay, closeOverlay: closeOverlay };
}
