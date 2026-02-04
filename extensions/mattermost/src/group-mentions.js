"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMattermostGroupRequireMention = resolveMattermostGroupRequireMention;
var accounts_js_1 = require("./mattermost/accounts.js");
function resolveMattermostGroupRequireMention(params) {
    var account = (0, accounts_js_1.resolveMattermostAccount)({
        cfg: params.cfg,
        accountId: params.accountId,
    });
    if (typeof account.requireMention === "boolean") {
        return account.requireMention;
    }
    return true;
}
