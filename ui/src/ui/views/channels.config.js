"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderChannelConfigForm = renderChannelConfigForm;
exports.renderChannelConfigSection = renderChannelConfigSection;
var lit_1 = require("lit");
var config_form_1 = require("./config-form");
function resolveSchemaNode(schema, path) {
    var _a;
    var current = schema;
    for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
        var key = path_1[_i];
        if (!current) {
            return null;
        }
        var type = (0, config_form_1.schemaType)(current);
        if (type === "object") {
            var properties = (_a = current.properties) !== null && _a !== void 0 ? _a : {};
            if (typeof key === "string" && properties[key]) {
                current = properties[key];
                continue;
            }
            var additional = current.additionalProperties;
            if (typeof key === "string" && additional && typeof additional === "object") {
                current = additional;
                continue;
            }
            return null;
        }
        if (type === "array") {
            if (typeof key !== "number") {
                return null;
            }
            var items = Array.isArray(current.items) ? current.items[0] : current.items;
            current = items !== null && items !== void 0 ? items : null;
            continue;
        }
        return null;
    }
    return current;
}
function resolveChannelValue(config, channelId) {
    var _a, _b;
    var channels = ((_a = config.channels) !== null && _a !== void 0 ? _a : {});
    var fromChannels = channels[channelId];
    var fallback = config[channelId];
    var resolved = (_b = (fromChannels && typeof fromChannels === "object"
        ? fromChannels
        : null)) !== null && _b !== void 0 ? _b : (fallback && typeof fallback === "object" ? fallback : null);
    return resolved !== null && resolved !== void 0 ? resolved : {};
}
function renderChannelConfigForm(props) {
    var _a;
    var analysis = (0, config_form_1.analyzeConfigSchema)(props.schema);
    var normalized = analysis.schema;
    if (!normalized) {
        return (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      <div class=\"callout danger\">Schema unavailable. Use Raw.</div>\n    "], ["\n      <div class=\"callout danger\">Schema unavailable. Use Raw.</div>\n    "])));
    }
    var node = resolveSchemaNode(normalized, ["channels", props.channelId]);
    if (!node) {
        return (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      <div class=\"callout danger\">Channel config schema unavailable.</div>\n    "], ["\n      <div class=\"callout danger\">Channel config schema unavailable.</div>\n    "])));
    }
    var configValue = (_a = props.configValue) !== null && _a !== void 0 ? _a : {};
    var value = resolveChannelValue(configValue, props.channelId);
    return (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    <div class=\"config-form\">\n      ", "\n    </div>\n  "], ["\n    <div class=\"config-form\">\n      ", "\n    </div>\n  "])), (0, config_form_1.renderNode)({
        schema: node,
        value: value,
        path: ["channels", props.channelId],
        hints: props.uiHints,
        unsupported: new Set(analysis.unsupportedPaths),
        disabled: props.disabled,
        showLabel: false,
        onPatch: props.onPatch,
    }));
}
function renderChannelConfigSection(params) {
    var channelId = params.channelId, props = params.props;
    var disabled = props.configSaving || props.configSchemaLoading;
    return (0, lit_1.html)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    <div style=\"margin-top: 16px;\">\n      ", "\n      <div class=\"row\" style=\"margin-top: 12px;\">\n        <button\n          class=\"btn primary\"\n          ?disabled=", "\n          @click=", "\n        >\n          ", "\n        </button>\n        <button\n          class=\"btn\"\n          ?disabled=", "\n          @click=", "\n        >\n          Reload\n        </button>\n      </div>\n    </div>\n  "], ["\n    <div style=\"margin-top: 16px;\">\n      ", "\n      <div class=\"row\" style=\"margin-top: 12px;\">\n        <button\n          class=\"btn primary\"\n          ?disabled=", "\n          @click=", "\n        >\n          ", "\n        </button>\n        <button\n          class=\"btn\"\n          ?disabled=", "\n          @click=", "\n        >\n          Reload\n        </button>\n      </div>\n    </div>\n  "])), props.configSchemaLoading
        ? (0, lit_1.html)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n              <div class=\"muted\">Loading config schema\u2026</div>\n            "], ["\n              <div class=\"muted\">Loading config schema\u2026</div>\n            "]))) : renderChannelConfigForm({
        channelId: channelId,
        configValue: props.configForm,
        schema: props.configSchema,
        uiHints: props.configUiHints,
        disabled: disabled,
        onPatch: props.onConfigPatch,
    }), disabled || !props.configFormDirty, function () { return props.onConfigSave(); }, props.configSaving ? "Saving…" : "Save", disabled, function () { return props.onConfigReload(); });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
