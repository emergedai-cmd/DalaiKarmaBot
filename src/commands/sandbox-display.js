"use strict";
/**
 * Display utilities for sandbox CLI
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayContainers = displayContainers;
exports.displayBrowsers = displayBrowsers;
exports.displaySummary = displaySummary;
exports.displayRecreatePreview = displayRecreatePreview;
exports.displayRecreateResult = displayRecreateResult;
var command_format_js_1 = require("../cli/command-format.js");
var sandbox_formatters_js_1 = require("./sandbox-formatters.js");
function displayItems(items, config, runtime) {
    if (items.length === 0) {
        runtime.log(config.emptyMessage);
        return;
    }
    runtime.log("\n".concat(config.title, "\n"));
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        config.renderItem(item, runtime);
    }
}
function displayContainers(containers, runtime) {
    displayItems(containers, {
        emptyMessage: "No sandbox containers found.",
        title: "📦 Sandbox Containers:",
        renderItem: function (container, rt) {
            rt.log("  ".concat(container.containerName));
            rt.log("    Status:  ".concat((0, sandbox_formatters_js_1.formatStatus)(container.running)));
            rt.log("    Image:   ".concat(container.image, " ").concat((0, sandbox_formatters_js_1.formatImageMatch)(container.imageMatch)));
            rt.log("    Age:     ".concat((0, sandbox_formatters_js_1.formatAge)(Date.now() - container.createdAtMs)));
            rt.log("    Idle:    ".concat((0, sandbox_formatters_js_1.formatAge)(Date.now() - container.lastUsedAtMs)));
            rt.log("    Session: ".concat(container.sessionKey));
            rt.log("");
        },
    }, runtime);
}
function displayBrowsers(browsers, runtime) {
    displayItems(browsers, {
        emptyMessage: "No sandbox browser containers found.",
        title: "🌐 Sandbox Browser Containers:",
        renderItem: function (browser, rt) {
            rt.log("  ".concat(browser.containerName));
            rt.log("    Status:  ".concat((0, sandbox_formatters_js_1.formatStatus)(browser.running)));
            rt.log("    Image:   ".concat(browser.image, " ").concat((0, sandbox_formatters_js_1.formatImageMatch)(browser.imageMatch)));
            rt.log("    CDP:     ".concat(browser.cdpPort));
            if (browser.noVncPort) {
                rt.log("    noVNC:   ".concat(browser.noVncPort));
            }
            rt.log("    Age:     ".concat((0, sandbox_formatters_js_1.formatAge)(Date.now() - browser.createdAtMs)));
            rt.log("    Idle:    ".concat((0, sandbox_formatters_js_1.formatAge)(Date.now() - browser.lastUsedAtMs)));
            rt.log("    Session: ".concat(browser.sessionKey));
            rt.log("");
        },
    }, runtime);
}
function displaySummary(containers, browsers, runtime) {
    var totalCount = containers.length + browsers.length;
    var runningCount = containers.filter(function (c) { return c.running; }).length + browsers.filter(function (b) { return b.running; }).length;
    var mismatchCount = containers.filter(function (c) { return !c.imageMatch; }).length + browsers.filter(function (b) { return !b.imageMatch; }).length;
    runtime.log("Total: ".concat(totalCount, " (").concat(runningCount, " running)"));
    if (mismatchCount > 0) {
        runtime.log("\n\u26A0\uFE0F  ".concat(mismatchCount, " container(s) with image mismatch detected."));
        runtime.log("   Run '".concat((0, command_format_js_1.formatCliCommand)("openclaw sandbox recreate --all"), "' to update all containers."));
    }
}
function displayRecreatePreview(containers, browsers, runtime) {
    runtime.log("\nContainers to be recreated:\n");
    if (containers.length > 0) {
        runtime.log("📦 Sandbox Containers:");
        for (var _i = 0, containers_1 = containers; _i < containers_1.length; _i++) {
            var container = containers_1[_i];
            runtime.log("  - ".concat(container.containerName, " (").concat((0, sandbox_formatters_js_1.formatSimpleStatus)(container.running), ")"));
        }
    }
    if (browsers.length > 0) {
        runtime.log("\n🌐 Browser Containers:");
        for (var _a = 0, browsers_1 = browsers; _a < browsers_1.length; _a++) {
            var browser = browsers_1[_a];
            runtime.log("  - ".concat(browser.containerName, " (").concat((0, sandbox_formatters_js_1.formatSimpleStatus)(browser.running), ")"));
        }
    }
    var total = containers.length + browsers.length;
    runtime.log("\nTotal: ".concat(total, " container(s)"));
}
function displayRecreateResult(result, runtime) {
    runtime.log("\nDone: ".concat(result.successCount, " removed, ").concat(result.failCount, " failed"));
    if (result.successCount > 0) {
        runtime.log("\nContainers will be automatically recreated when the agent is next used.");
    }
}
