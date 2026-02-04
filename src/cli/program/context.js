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
exports.createProgramContext = createProgramContext;
var version_js_1 = require("../../version.js");
var channel_options_js_1 = require("../channel-options.js");
function createProgramContext() {
    var channelOptions = (0, channel_options_js_1.resolveCliChannelOptions)();
    return {
        programVersion: version_js_1.VERSION,
        channelOptions: channelOptions,
        messageChannelOptions: channelOptions.join("|"),
        agentChannelOptions: __spreadArray(["last"], channelOptions, true).join("|"),
    };
}
