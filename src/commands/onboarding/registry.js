"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProviderOnboardingAdapters = exports.getProviderOnboardingAdapter = void 0;
exports.getChannelOnboardingAdapter = getChannelOnboardingAdapter;
exports.listChannelOnboardingAdapters = listChannelOnboardingAdapters;
var index_js_1 = require("../../channels/plugins/index.js");
var CHANNEL_ONBOARDING_ADAPTERS = function () {
    return new Map((0, index_js_1.listChannelPlugins)()
        .map(function (plugin) { return (plugin.onboarding ? [plugin.id, plugin.onboarding] : null); })
        .filter(function (entry) {
        return Boolean(entry);
    }));
};
function getChannelOnboardingAdapter(channel) {
    return CHANNEL_ONBOARDING_ADAPTERS().get(channel);
}
function listChannelOnboardingAdapters() {
    return Array.from(CHANNEL_ONBOARDING_ADAPTERS().values());
}
// Legacy aliases (pre-rename).
exports.getProviderOnboardingAdapter = getChannelOnboardingAdapter;
exports.listProviderOnboardingAdapters = listChannelOnboardingAdapters;
