"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextFromPrompt = extractTextFromPrompt;
exports.extractAttachmentsFromPrompt = extractAttachmentsFromPrompt;
exports.formatToolTitle = formatToolTitle;
exports.inferToolKind = inferToolKind;
function extractTextFromPrompt(prompt) {
    var _a;
    var parts = [];
    for (var _i = 0, prompt_1 = prompt; _i < prompt_1.length; _i++) {
        var block = prompt_1[_i];
        if (block.type === "text") {
            parts.push(block.text);
            continue;
        }
        if (block.type === "resource") {
            var resource = block.resource;
            if (resource === null || resource === void 0 ? void 0 : resource.text) {
                parts.push(resource.text);
            }
            continue;
        }
        if (block.type === "resource_link") {
            var title = block.title ? " (".concat(block.title, ")") : "";
            var uri = (_a = block.uri) !== null && _a !== void 0 ? _a : "";
            var line = uri ? "[Resource link".concat(title, "] ").concat(uri) : "[Resource link".concat(title, "]");
            parts.push(line);
        }
    }
    return parts.join("\n");
}
function extractAttachmentsFromPrompt(prompt) {
    var attachments = [];
    for (var _i = 0, prompt_2 = prompt; _i < prompt_2.length; _i++) {
        var block = prompt_2[_i];
        if (block.type !== "image") {
            continue;
        }
        var image = block;
        if (!image.data || !image.mimeType) {
            continue;
        }
        attachments.push({
            type: "image",
            mimeType: image.mimeType,
            content: image.data,
        });
    }
    return attachments;
}
function formatToolTitle(name, args) {
    var base = name !== null && name !== void 0 ? name : "tool";
    if (!args || Object.keys(args).length === 0) {
        return base;
    }
    var parts = Object.entries(args).map(function (_a) {
        var key = _a[0], value = _a[1];
        var raw = typeof value === "string" ? value : JSON.stringify(value);
        var safe = raw.length > 100 ? "".concat(raw.slice(0, 100), "...") : raw;
        return "".concat(key, ": ").concat(safe);
    });
    return "".concat(base, ": ").concat(parts.join(", "));
}
function inferToolKind(name) {
    if (!name) {
        return "other";
    }
    var normalized = name.toLowerCase();
    if (normalized.includes("read")) {
        return "read";
    }
    if (normalized.includes("write") || normalized.includes("edit")) {
        return "edit";
    }
    if (normalized.includes("delete") || normalized.includes("remove")) {
        return "delete";
    }
    if (normalized.includes("move") || normalized.includes("rename")) {
        return "move";
    }
    if (normalized.includes("search") || normalized.includes("find")) {
        return "search";
    }
    if (normalized.includes("exec") || normalized.includes("run") || normalized.includes("bash")) {
        return "execute";
    }
    if (normalized.includes("fetch") || normalized.includes("http")) {
        return "fetch";
    }
    return "other";
}
