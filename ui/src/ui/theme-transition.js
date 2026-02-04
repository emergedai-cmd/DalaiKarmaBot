"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startThemeTransition = void 0;
var clamp01 = function (value) {
    if (Number.isNaN(value)) {
        return 0.5;
    }
    if (value <= 0) {
        return 0;
    }
    if (value >= 1) {
        return 1;
    }
    return value;
};
var hasReducedMotionPreference = function () {
    var _a;
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return false;
    }
    return (_a = window.matchMedia("(prefers-reduced-motion: reduce)").matches) !== null && _a !== void 0 ? _a : false;
};
var cleanupThemeTransition = function (root) {
    root.classList.remove("theme-transition");
    root.style.removeProperty("--theme-switch-x");
    root.style.removeProperty("--theme-switch-y");
};
var startThemeTransition = function (_a) {
    var _b, _c;
    var nextTheme = _a.nextTheme, applyTheme = _a.applyTheme, context = _a.context, currentTheme = _a.currentTheme;
    if (currentTheme === nextTheme) {
        return;
    }
    var documentReference = (_b = globalThis.document) !== null && _b !== void 0 ? _b : null;
    if (!documentReference) {
        applyTheme();
        return;
    }
    var root = documentReference.documentElement;
    var document_ = documentReference;
    var prefersReducedMotion = hasReducedMotionPreference();
    var canUseViewTransition = Boolean(document_.startViewTransition) && !prefersReducedMotion;
    if (canUseViewTransition) {
        var xPercent = 0.5;
        var yPercent = 0.5;
        if ((context === null || context === void 0 ? void 0 : context.pointerClientX) !== undefined &&
            (context === null || context === void 0 ? void 0 : context.pointerClientY) !== undefined &&
            typeof window !== "undefined") {
            xPercent = clamp01(context.pointerClientX / window.innerWidth);
            yPercent = clamp01(context.pointerClientY / window.innerHeight);
        }
        else if (context === null || context === void 0 ? void 0 : context.element) {
            var rect = context.element.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && typeof window !== "undefined") {
                xPercent = clamp01((rect.left + rect.width / 2) / window.innerWidth);
                yPercent = clamp01((rect.top + rect.height / 2) / window.innerHeight);
            }
        }
        root.style.setProperty("--theme-switch-x", "".concat(xPercent * 100, "%"));
        root.style.setProperty("--theme-switch-y", "".concat(yPercent * 100, "%"));
        root.classList.add("theme-transition");
        try {
            var transition = (_c = document_.startViewTransition) === null || _c === void 0 ? void 0 : _c.call(document_, function () {
                applyTheme();
            });
            if (transition === null || transition === void 0 ? void 0 : transition.finished) {
                void transition.finished.finally(function () { return cleanupThemeTransition(root); });
            }
            else {
                cleanupThemeTransition(root);
            }
        }
        catch (_d) {
            cleanupThemeTransition(root);
            applyTheme();
        }
        return;
    }
    applyTheme();
    cleanupThemeTransition(root);
};
exports.startThemeTransition = startThemeTransition;
