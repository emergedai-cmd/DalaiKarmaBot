"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBonjourError = formatBonjourError;
function formatBonjourError(err) {
    if (err instanceof Error) {
        var msg = err.message || String(err);
        return err.name && err.name !== "Error" ? "".concat(err.name, ": ").concat(msg) : msg;
    }
    return String(err);
}
