"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDuration = formatDuration;
exports.channelEnabled = channelEnabled;
exports.getChannelAccountCount = getChannelAccountCount;
exports.renderChannelAccountCount = renderChannelAccountCount;
var lit_1 = require("lit");
function formatDuration(ms) {
    if (!ms && ms !== 0) {
        return "n/a";
    }
    var sec = Math.round(ms / 1000);
    if (sec < 60) {
        return "".concat(sec, "s");
    }
    var min = Math.round(sec / 60);
    if (min < 60) {
        return "".concat(min, "m");
    }
    var hr = Math.round(min / 60);
    return "".concat(hr, "h");
}
function channelEnabled(key, props) {
    var _a, _b;
    var snapshot = props.snapshot;
    var channels = snapshot === null || snapshot === void 0 ? void 0 : snapshot.channels;
    if (!snapshot || !channels) {
        return false;
    }
    var channelStatus = channels[key];
    var configured = typeof (channelStatus === null || channelStatus === void 0 ? void 0 : channelStatus.configured) === "boolean" && channelStatus.configured;
    var running = typeof (channelStatus === null || channelStatus === void 0 ? void 0 : channelStatus.running) === "boolean" && channelStatus.running;
    var connected = typeof (channelStatus === null || channelStatus === void 0 ? void 0 : channelStatus.connected) === "boolean" && channelStatus.connected;
    var accounts = (_b = (_a = snapshot.channelAccounts) === null || _a === void 0 ? void 0 : _a[key]) !== null && _b !== void 0 ? _b : [];
    var accountActive = accounts.some(function (account) { return account.configured || account.running || account.connected; });
    return configured || running || connected || accountActive;
}
function getChannelAccountCount(key, channelAccounts) {
    var _a, _b;
    return (_b = (_a = channelAccounts === null || channelAccounts === void 0 ? void 0 : channelAccounts[key]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
}
function renderChannelAccountCount(key, channelAccounts) {
    var count = getChannelAccountCount(key, channelAccounts);
    if (count < 2) {
        return lit_1.nothing;
    }
    return (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<div class=\"account-count\">Accounts (", ")</div>"], ["<div class=\"account-count\">Accounts (", ")</div>"])), count);
}
var templateObject_1;
