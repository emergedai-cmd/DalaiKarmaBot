"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var tui_overlays_js_1 = require("./tui-overlays.js");
var DummyComponent = /** @class */ (function () {
    function DummyComponent() {
    }
    DummyComponent.prototype.render = function () {
        return ["dummy"];
    };
    DummyComponent.prototype.invalidate = function () { };
    return DummyComponent;
}());
(0, vitest_1.describe)("createOverlayHandlers", function () {
    (0, vitest_1.it)("routes overlays through the TUI overlay stack", function () {
        var showOverlay = vitest_1.vi.fn();
        var hideOverlay = vitest_1.vi.fn();
        var setFocus = vitest_1.vi.fn();
        var open = false;
        var host = {
            showOverlay: function (component) {
                open = true;
                showOverlay(component);
            },
            hideOverlay: function () {
                open = false;
                hideOverlay();
            },
            hasOverlay: function () { return open; },
            setFocus: setFocus,
        };
        var _a = (0, tui_overlays_js_1.createOverlayHandlers)(host, new DummyComponent()), openOverlay = _a.openOverlay, closeOverlay = _a.closeOverlay;
        var overlay = new DummyComponent();
        openOverlay(overlay);
        (0, vitest_1.expect)(showOverlay).toHaveBeenCalledWith(overlay);
        closeOverlay();
        (0, vitest_1.expect)(hideOverlay).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(setFocus).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("restores focus when closing without an overlay", function () {
        var setFocus = vitest_1.vi.fn();
        var host = {
            showOverlay: vitest_1.vi.fn(),
            hideOverlay: vitest_1.vi.fn(),
            hasOverlay: function () { return false; },
            setFocus: setFocus,
        };
        var fallback = new DummyComponent();
        var closeOverlay = (0, tui_overlays_js_1.createOverlayHandlers)(host, fallback).closeOverlay;
        closeOverlay();
        (0, vitest_1.expect)(setFocus).toHaveBeenCalledWith(fallback);
    });
});
