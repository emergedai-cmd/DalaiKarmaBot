"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerNodesCli = registerNodesCli;
var links_js_1 = require("../../terminal/links.js");
var theme_js_1 = require("../../terminal/theme.js");
var register_camera_js_1 = require("./register.camera.js");
var register_canvas_js_1 = require("./register.canvas.js");
var register_invoke_js_1 = require("./register.invoke.js");
var register_location_js_1 = require("./register.location.js");
var register_notify_js_1 = require("./register.notify.js");
var register_pairing_js_1 = require("./register.pairing.js");
var register_screen_js_1 = require("./register.screen.js");
var register_status_js_1 = require("./register.status.js");
function registerNodesCli(program) {
    var nodes = program
        .command("nodes")
        .description("Manage gateway-owned node pairing")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/nodes", "docs.openclaw.ai/cli/nodes"), "\n");
    });
    (0, register_status_js_1.registerNodesStatusCommands)(nodes);
    (0, register_pairing_js_1.registerNodesPairingCommands)(nodes);
    (0, register_invoke_js_1.registerNodesInvokeCommands)(nodes);
    (0, register_notify_js_1.registerNodesNotifyCommand)(nodes);
    (0, register_canvas_js_1.registerNodesCanvasCommands)(nodes);
    (0, register_camera_js_1.registerNodesCameraCommands)(nodes);
    (0, register_screen_js_1.registerNodesScreenCommands)(nodes);
    (0, register_location_js_1.registerNodesLocationCommands)(nodes);
}
