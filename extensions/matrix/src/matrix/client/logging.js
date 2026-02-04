"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureMatrixSdkLoggingConfigured = ensureMatrixSdkLoggingConfigured;
var matrix_bot_sdk_1 = require("@vector-im/matrix-bot-sdk");
var matrixSdkLoggingConfigured = false;
var matrixSdkBaseLogger = new matrix_bot_sdk_1.ConsoleLogger();
function shouldSuppressMatrixHttpNotFound(module, messageOrObject) {
    if (module !== "MatrixHttpClient") {
        return false;
    }
    return messageOrObject.some(function (entry) {
        if (!entry || typeof entry !== "object") {
            return false;
        }
        return entry.errcode === "M_NOT_FOUND";
    });
}
function ensureMatrixSdkLoggingConfigured() {
    if (matrixSdkLoggingConfigured) {
        return;
    }
    matrixSdkLoggingConfigured = true;
    matrix_bot_sdk_1.LogService.setLogger({
        trace: function (module) {
            var messageOrObject = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                messageOrObject[_i - 1] = arguments[_i];
            }
            return matrixSdkBaseLogger.trace.apply(matrixSdkBaseLogger, __spreadArray([module], messageOrObject, false));
        },
        debug: function (module) {
            var messageOrObject = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                messageOrObject[_i - 1] = arguments[_i];
            }
            return matrixSdkBaseLogger.debug.apply(matrixSdkBaseLogger, __spreadArray([module], messageOrObject, false));
        },
        info: function (module) {
            var messageOrObject = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                messageOrObject[_i - 1] = arguments[_i];
            }
            return matrixSdkBaseLogger.info.apply(matrixSdkBaseLogger, __spreadArray([module], messageOrObject, false));
        },
        warn: function (module) {
            var messageOrObject = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                messageOrObject[_i - 1] = arguments[_i];
            }
            return matrixSdkBaseLogger.warn.apply(matrixSdkBaseLogger, __spreadArray([module], messageOrObject, false));
        },
        error: function (module) {
            var messageOrObject = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                messageOrObject[_i - 1] = arguments[_i];
            }
            if (shouldSuppressMatrixHttpNotFound(module, messageOrObject)) {
                return;
            }
            matrixSdkBaseLogger.error.apply(matrixSdkBaseLogger, __spreadArray([module], messageOrObject, false));
        },
    });
}
