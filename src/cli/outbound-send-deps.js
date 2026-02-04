"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOutboundSendDeps = createOutboundSendDeps;
// Provider docking: extend this mapping when adding new outbound send deps.
function createOutboundSendDeps(deps) {
    return {
        sendWhatsApp: deps.sendMessageWhatsApp,
        sendTelegram: deps.sendMessageTelegram,
        sendDiscord: deps.sendMessageDiscord,
        sendSlack: deps.sendMessageSlack,
        sendSignal: deps.sendMessageSignal,
        sendIMessage: deps.sendMessageIMessage,
    };
}
