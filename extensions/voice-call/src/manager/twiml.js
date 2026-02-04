"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNotifyTwiml = generateNotifyTwiml;
var voice_mapping_js_1 = require("../voice-mapping.js");
function generateNotifyTwiml(message, voice) {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Response>\n  <Say voice=\"".concat(voice, "\">").concat((0, voice_mapping_js_1.escapeXml)(message), "</Say>\n  <Hangup/>\n</Response>");
}
