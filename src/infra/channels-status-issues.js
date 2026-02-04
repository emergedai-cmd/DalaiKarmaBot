"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectChannelStatusIssues = collectChannelStatusIssues;
var index_js_1 = require("../channels/plugins/index.js");
function collectChannelStatusIssues(payload) {
    var _a;
    var issues = [];
    var accountsByChannel = payload.channelAccounts;
    for (var _i = 0, _b = (0, index_js_1.listChannelPlugins)(); _i < _b.length; _i++) {
        var plugin = _b[_i];
        var collect = (_a = plugin.status) === null || _a === void 0 ? void 0 : _a.collectStatusIssues;
        if (!collect) {
            continue;
        }
        var raw = accountsByChannel === null || accountsByChannel === void 0 ? void 0 : accountsByChannel[plugin.id];
        if (!Array.isArray(raw)) {
            continue;
        }
        issues.push.apply(issues, collect(raw));
    }
    return issues;
}
