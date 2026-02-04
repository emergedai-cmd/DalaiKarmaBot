"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTwilioProviderWebhook = verifyTwilioProviderWebhook;
var webhook_security_js_1 = require("../../webhook-security.js");
function verifyTwilioProviderWebhook(params) {
    var _a;
    var result = (0, webhook_security_js_1.verifyTwilioWebhook)(params.ctx, params.authToken, {
        publicUrl: params.currentPublicUrl || undefined,
        allowNgrokFreeTierLoopbackBypass: (_a = params.options.allowNgrokFreeTierLoopbackBypass) !== null && _a !== void 0 ? _a : false,
        skipVerification: params.options.skipVerification,
    });
    if (!result.ok) {
        console.warn("[twilio] Webhook verification failed: ".concat(result.reason));
        if (result.verificationUrl) {
            console.warn("[twilio] Verification URL: ".concat(result.verificationUrl));
        }
    }
    return {
        ok: result.ok,
        reason: result.reason,
    };
}
