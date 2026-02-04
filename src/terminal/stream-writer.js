"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSafeStreamWriter = createSafeStreamWriter;
function isBrokenPipeError(err) {
    var code = err === null || err === void 0 ? void 0 : err.code;
    return code === "EPIPE" || code === "EIO";
}
function createSafeStreamWriter(options) {
    if (options === void 0) { options = {}; }
    var closed = false;
    var notified = false;
    var noteBrokenPipe = function (err, stream) {
        var _a;
        if (notified) {
            return;
        }
        notified = true;
        (_a = options.onBrokenPipe) === null || _a === void 0 ? void 0 : _a.call(options, err, stream);
    };
    var handleError = function (err, stream) {
        if (!isBrokenPipeError(err)) {
            throw err;
        }
        closed = true;
        noteBrokenPipe(err, stream);
        return false;
    };
    var write = function (stream, text) {
        var _a;
        if (closed) {
            return false;
        }
        try {
            (_a = options.beforeWrite) === null || _a === void 0 ? void 0 : _a.call(options);
        }
        catch (err) {
            return handleError(err, process.stderr);
        }
        try {
            stream.write(text);
            return !closed;
        }
        catch (err) {
            return handleError(err, stream);
        }
    };
    var writeLine = function (stream, text) {
        return write(stream, "".concat(text, "\n"));
    };
    return {
        write: write,
        writeLine: writeLine,
        reset: function () {
            closed = false;
            notified = false;
        },
        isClosed: function () { return closed; },
    };
}
