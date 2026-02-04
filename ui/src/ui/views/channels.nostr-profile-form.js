"use strict";
/**
 * Nostr Profile Edit Form
 *
 * Provides UI for editing and publishing Nostr profile (kind:0).
 */
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderNostrProfileForm = renderNostrProfileForm;
exports.createNostrProfileFormState = createNostrProfileFormState;
var lit_1 = require("lit");
// ============================================================================
// Helpers
// ============================================================================
function isFormDirty(state) {
    var values = state.values, original = state.original;
    return (values.name !== original.name ||
        values.displayName !== original.displayName ||
        values.about !== original.about ||
        values.picture !== original.picture ||
        values.banner !== original.banner ||
        values.website !== original.website ||
        values.nip05 !== original.nip05 ||
        values.lud16 !== original.lud16);
}
// ============================================================================
// Form Rendering
// ============================================================================
function renderNostrProfileForm(params) {
    var state = params.state, callbacks = params.callbacks, accountId = params.accountId;
    var isDirty = isFormDirty(state);
    var renderField = function (field, label, opts) {
        var _a;
        if (opts === void 0) { opts = {}; }
        var _b = opts.type, type = _b === void 0 ? "text" : _b, placeholder = opts.placeholder, maxLength = opts.maxLength, help = opts.help;
        var value = (_a = state.values[field]) !== null && _a !== void 0 ? _a : "";
        var error = state.fieldErrors[field];
        var inputId = "nostr-profile-".concat(field);
        if (type === "textarea") {
            return (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n        <div class=\"form-field\" style=\"margin-bottom: 12px;\">\n          <label for=\"", "\" style=\"display: block; margin-bottom: 4px; font-weight: 500;\">\n            ", "\n          </label>\n          <textarea\n            id=\"", "\"\n            .value=", "\n            placeholder=", "\n            maxlength=", "\n            rows=\"3\"\n            style=\"width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; resize: vertical; font-family: inherit;\"\n            @input=", "\n            ?disabled=", "\n          ></textarea>\n          ", "\n          ", "\n        </div>\n      "], ["\n        <div class=\"form-field\" style=\"margin-bottom: 12px;\">\n          <label for=\"", "\" style=\"display: block; margin-bottom: 4px; font-weight: 500;\">\n            ", "\n          </label>\n          <textarea\n            id=\"", "\"\n            .value=", "\n            placeholder=", "\n            maxlength=", "\n            rows=\"3\"\n            style=\"width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; resize: vertical; font-family: inherit;\"\n            @input=", "\n            ?disabled=", "\n          ></textarea>\n          ", "\n          ", "\n        </div>\n      "])), inputId, label, inputId, value, placeholder !== null && placeholder !== void 0 ? placeholder : "", maxLength !== null && maxLength !== void 0 ? maxLength : 2000, function (e) {
                var target = e.target;
                callbacks.onFieldChange(field, target.value);
            }, state.saving, help ? (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<div style=\"font-size: 12px; color: var(--text-muted); margin-top: 2px;\">", "</div>"], ["<div style=\"font-size: 12px; color: var(--text-muted); margin-top: 2px;\">", "</div>"])), help) : lit_1.nothing, error ? (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<div style=\"font-size: 12px; color: var(--danger-color); margin-top: 2px;\">", "</div>"], ["<div style=\"font-size: 12px; color: var(--danger-color); margin-top: 2px;\">", "</div>"])), error) : lit_1.nothing);
        }
        return (0, lit_1.html)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      <div class=\"form-field\" style=\"margin-bottom: 12px;\">\n        <label for=\"", "\" style=\"display: block; margin-bottom: 4px; font-weight: 500;\">\n          ", "\n        </label>\n        <input\n          id=\"", "\"\n          type=", "\n          .value=", "\n          placeholder=", "\n          maxlength=", "\n          style=\"width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;\"\n          @input=", "\n          ?disabled=", "\n        />\n        ", "\n        ", "\n      </div>\n    "], ["\n      <div class=\"form-field\" style=\"margin-bottom: 12px;\">\n        <label for=\"", "\" style=\"display: block; margin-bottom: 4px; font-weight: 500;\">\n          ", "\n        </label>\n        <input\n          id=\"", "\"\n          type=", "\n          .value=", "\n          placeholder=", "\n          maxlength=", "\n          style=\"width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;\"\n          @input=", "\n          ?disabled=", "\n        />\n        ", "\n        ", "\n      </div>\n    "])), inputId, label, inputId, type, value, placeholder !== null && placeholder !== void 0 ? placeholder : "", maxLength !== null && maxLength !== void 0 ? maxLength : 256, function (e) {
            var target = e.target;
            callbacks.onFieldChange(field, target.value);
        }, state.saving, help ? (0, lit_1.html)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["<div style=\"font-size: 12px; color: var(--text-muted); margin-top: 2px;\">", "</div>"], ["<div style=\"font-size: 12px; color: var(--text-muted); margin-top: 2px;\">", "</div>"])), help) : lit_1.nothing, error ? (0, lit_1.html)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["<div style=\"font-size: 12px; color: var(--danger-color); margin-top: 2px;\">", "</div>"], ["<div style=\"font-size: 12px; color: var(--danger-color); margin-top: 2px;\">", "</div>"])), error) : lit_1.nothing);
    };
    var renderPicturePreview = function () {
        var picture = state.values.picture;
        if (!picture) {
            return lit_1.nothing;
        }
        return (0, lit_1.html)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      <div style=\"margin-bottom: 12px;\">\n        <img\n          src=", "\n          alt=\"Profile picture preview\"\n          style=\"max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);\"\n          @error=", "\n          @load=", "\n        />\n      </div>\n    "], ["\n      <div style=\"margin-bottom: 12px;\">\n        <img\n          src=", "\n          alt=\"Profile picture preview\"\n          style=\"max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);\"\n          @error=", "\n          @load=", "\n        />\n      </div>\n    "])), picture, function (e) {
            var img = e.target;
            img.style.display = "none";
        }, function (e) {
            var img = e.target;
            img.style.display = "block";
        });
    };
    return (0, lit_1.html)(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n    <div class=\"nostr-profile-form\" style=\"padding: 16px; background: var(--bg-secondary); border-radius: 8px; margin-top: 12px;\">\n      <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;\">\n        <div style=\"font-weight: 600; font-size: 16px;\">Edit Profile</div>\n        <div style=\"font-size: 12px; color: var(--text-muted);\">Account: ", "</div>\n      </div>\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      <div style=\"display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap;\">\n        <button\n          class=\"btn primary\"\n          @click=", "\n          ?disabled=", "\n        >\n          ", "\n        </button>\n\n        <button\n          class=\"btn\"\n          @click=", "\n          ?disabled=", "\n        >\n          ", "\n        </button>\n\n        <button\n          class=\"btn\"\n          @click=", "\n        >\n          ", "\n        </button>\n\n        <button\n          class=\"btn\"\n          @click=", "\n          ?disabled=", "\n        >\n          Cancel\n        </button>\n      </div>\n\n      ", "\n    </div>\n  "], ["\n    <div class=\"nostr-profile-form\" style=\"padding: 16px; background: var(--bg-secondary); border-radius: 8px; margin-top: 12px;\">\n      <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;\">\n        <div style=\"font-weight: 600; font-size: 16px;\">Edit Profile</div>\n        <div style=\"font-size: 12px; color: var(--text-muted);\">Account: ", "</div>\n      </div>\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      <div style=\"display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap;\">\n        <button\n          class=\"btn primary\"\n          @click=", "\n          ?disabled=", "\n        >\n          ", "\n        </button>\n\n        <button\n          class=\"btn\"\n          @click=", "\n          ?disabled=", "\n        >\n          ", "\n        </button>\n\n        <button\n          class=\"btn\"\n          @click=", "\n        >\n          ", "\n        </button>\n\n        <button\n          class=\"btn\"\n          @click=", "\n          ?disabled=", "\n        >\n          Cancel\n        </button>\n      </div>\n\n      ", "\n    </div>\n  "])), accountId, state.error
        ? (0, lit_1.html)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["<div class=\"callout danger\" style=\"margin-bottom: 12px;\">", "</div>"], ["<div class=\"callout danger\" style=\"margin-bottom: 12px;\">", "</div>"])), state.error) : lit_1.nothing, state.success
        ? (0, lit_1.html)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["<div class=\"callout success\" style=\"margin-bottom: 12px;\">", "</div>"], ["<div class=\"callout success\" style=\"margin-bottom: 12px;\">", "</div>"])), state.success) : lit_1.nothing, renderPicturePreview(), renderField("name", "Username", {
        placeholder: "satoshi",
        maxLength: 256,
        help: "Short username (e.g., satoshi)",
    }), renderField("displayName", "Display Name", {
        placeholder: "Satoshi Nakamoto",
        maxLength: 256,
        help: "Your full display name",
    }), renderField("about", "Bio", {
        type: "textarea",
        placeholder: "Tell people about yourself...",
        maxLength: 2000,
        help: "A brief bio or description",
    }), renderField("picture", "Avatar URL", {
        type: "url",
        placeholder: "https://example.com/avatar.jpg",
        help: "HTTPS URL to your profile picture",
    }), state.showAdvanced
        ? (0, lit_1.html)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n            <div style=\"border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 12px;\">\n              <div style=\"font-weight: 500; margin-bottom: 12px; color: var(--text-muted);\">Advanced</div>\n\n              ", "\n\n              ", "\n\n              ", "\n\n              ", "\n            </div>\n          "], ["\n            <div style=\"border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 12px;\">\n              <div style=\"font-weight: 500; margin-bottom: 12px; color: var(--text-muted);\">Advanced</div>\n\n              ", "\n\n              ", "\n\n              ", "\n\n              ", "\n            </div>\n          "])), renderField("banner", "Banner URL", {
            type: "url",
            placeholder: "https://example.com/banner.jpg",
            help: "HTTPS URL to a banner image",
        }), renderField("website", "Website", {
            type: "url",
            placeholder: "https://example.com",
            help: "Your personal website",
        }), renderField("nip05", "NIP-05 Identifier", {
            placeholder: "you@example.com",
            help: "Verifiable identifier (e.g., you@domain.com)",
        }), renderField("lud16", "Lightning Address", {
            placeholder: "you@getalby.com",
            help: "Lightning address for tips (LUD-16)",
        })) : lit_1.nothing, callbacks.onSave, state.saving || !isDirty, state.saving ? "Saving..." : "Save & Publish", callbacks.onImport, state.importing || state.saving, state.importing ? "Importing..." : "Import from Relays", callbacks.onToggleAdvanced, state.showAdvanced ? "Hide Advanced" : "Show Advanced", callbacks.onCancel, state.saving, isDirty
        ? (0, lit_1.html)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n              <div style=\"font-size: 12px; color: var(--warning-color); margin-top: 8px\">\n                You have unsaved changes\n              </div>\n            "], ["\n              <div style=\"font-size: 12px; color: var(--warning-color); margin-top: 8px\">\n                You have unsaved changes\n              </div>\n            "]))) : lit_1.nothing);
}
// ============================================================================
// Factory
// ============================================================================
/**
 * Create initial form state from existing profile
 */
function createNostrProfileFormState(profile) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var values = {
        name: (_a = profile === null || profile === void 0 ? void 0 : profile.name) !== null && _a !== void 0 ? _a : "",
        displayName: (_b = profile === null || profile === void 0 ? void 0 : profile.displayName) !== null && _b !== void 0 ? _b : "",
        about: (_c = profile === null || profile === void 0 ? void 0 : profile.about) !== null && _c !== void 0 ? _c : "",
        picture: (_d = profile === null || profile === void 0 ? void 0 : profile.picture) !== null && _d !== void 0 ? _d : "",
        banner: (_e = profile === null || profile === void 0 ? void 0 : profile.banner) !== null && _e !== void 0 ? _e : "",
        website: (_f = profile === null || profile === void 0 ? void 0 : profile.website) !== null && _f !== void 0 ? _f : "",
        nip05: (_g = profile === null || profile === void 0 ? void 0 : profile.nip05) !== null && _g !== void 0 ? _g : "",
        lud16: (_h = profile === null || profile === void 0 ? void 0 : profile.lud16) !== null && _h !== void 0 ? _h : "",
    };
    return {
        values: values,
        original: __assign({}, values),
        saving: false,
        importing: false,
        error: null,
        success: null,
        fieldErrors: {},
        showAdvanced: Boolean((profile === null || profile === void 0 ? void 0 : profile.banner) || (profile === null || profile === void 0 ? void 0 : profile.website) || (profile === null || profile === void 0 ? void 0 : profile.nip05) || (profile === null || profile === void 0 ? void 0 : profile.lud16)),
    };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
