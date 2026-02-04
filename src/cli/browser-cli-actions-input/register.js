"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBrowserActionInputCommands = registerBrowserActionInputCommands;
var register_element_js_1 = require("./register.element.js");
var register_files_downloads_js_1 = require("./register.files-downloads.js");
var register_form_wait_eval_js_1 = require("./register.form-wait-eval.js");
var register_navigation_js_1 = require("./register.navigation.js");
function registerBrowserActionInputCommands(browser, parentOpts) {
    (0, register_navigation_js_1.registerBrowserNavigationCommands)(browser, parentOpts);
    (0, register_element_js_1.registerBrowserElementCommands)(browser, parentOpts);
    (0, register_files_downloads_js_1.registerBrowserFilesAndDownloadsCommands)(browser, parentOpts);
    (0, register_form_wait_eval_js_1.registerBrowserFormWaitEvalCommands)(browser, parentOpts);
}
