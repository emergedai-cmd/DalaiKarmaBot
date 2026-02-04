"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemTheme = getSystemTheme;
exports.resolveTheme = resolveTheme;
function getSystemTheme() {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function resolveTheme(mode) {
    if (mode === "system") {
        return getSystemTheme();
    }
    return mode;
}
