"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderSkills = renderSkills;
var lit_1 = require("lit");
var format_1 = require("../format");
function renderSkills(props) {
    var _a, _b;
    var skills = (_b = (_a = props.report) === null || _a === void 0 ? void 0 : _a.skills) !== null && _b !== void 0 ? _b : [];
    var filter = props.filter.trim().toLowerCase();
    var filtered = filter
        ? skills.filter(function (skill) {
            return [skill.name, skill.description, skill.source].join(" ").toLowerCase().includes(filter);
        })
        : skills;
    return (0, lit_1.html)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    <section class=\"card\">\n      <div class=\"row\" style=\"justify-content: space-between;\">\n        <div>\n          <div class=\"card-title\">Skills</div>\n          <div class=\"card-sub\">Bundled, managed, and workspace skills.</div>\n        </div>\n        <button class=\"btn\" ?disabled=", " @click=", ">\n          ", "\n        </button>\n      </div>\n\n      <div class=\"filters\" style=\"margin-top: 14px;\">\n        <label class=\"field\" style=\"flex: 1;\">\n          <span>Filter</span>\n          <input\n            .value=", "\n            @input=", "\n            placeholder=\"Search skills\"\n          />\n        </label>\n        <div class=\"muted\">", " shown</div>\n      </div>\n\n      ", "\n\n      ", "\n    </section>\n  "], ["\n    <section class=\"card\">\n      <div class=\"row\" style=\"justify-content: space-between;\">\n        <div>\n          <div class=\"card-title\">Skills</div>\n          <div class=\"card-sub\">Bundled, managed, and workspace skills.</div>\n        </div>\n        <button class=\"btn\" ?disabled=", " @click=", ">\n          ", "\n        </button>\n      </div>\n\n      <div class=\"filters\" style=\"margin-top: 14px;\">\n        <label class=\"field\" style=\"flex: 1;\">\n          <span>Filter</span>\n          <input\n            .value=", "\n            @input=", "\n            placeholder=\"Search skills\"\n          />\n        </label>\n        <div class=\"muted\">", " shown</div>\n      </div>\n\n      ", "\n\n      ", "\n    </section>\n  "])), props.loading, props.onRefresh, props.loading ? "Loading…" : "Refresh", props.filter, function (e) { return props.onFilterChange(e.target.value); }, filtered.length, props.error
        ? (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<div class=\"callout danger\" style=\"margin-top: 12px;\">", "</div>"], ["<div class=\"callout danger\" style=\"margin-top: 12px;\">", "</div>"])), props.error) : lit_1.nothing, filtered.length === 0
        ? (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n              <div class=\"muted\" style=\"margin-top: 16px\">No skills found.</div>\n            "], ["\n              <div class=\"muted\" style=\"margin-top: 16px\">No skills found.</div>\n            "]))) : (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n            <div class=\"list\" style=\"margin-top: 16px;\">\n              ", "\n            </div>\n          "], ["\n            <div class=\"list\" style=\"margin-top: 16px;\">\n              ", "\n            </div>\n          "])), filtered.map(function (skill) { return renderSkill(skill, props); })));
}
function renderSkill(skill, props) {
    var _a, _b;
    var busy = props.busyKey === skill.skillKey;
    var apiKey = (_a = props.edits[skill.skillKey]) !== null && _a !== void 0 ? _a : "";
    var message = (_b = props.messages[skill.skillKey]) !== null && _b !== void 0 ? _b : null;
    var canInstall = skill.install.length > 0 && skill.missing.bins.length > 0;
    var missing = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], skill.missing.bins.map(function (b) { return "bin:".concat(b); }), true), skill.missing.env.map(function (e) { return "env:".concat(e); }), true), skill.missing.config.map(function (c) { return "config:".concat(c); }), true), skill.missing.os.map(function (o) { return "os:".concat(o); }), true);
    var reasons = [];
    if (skill.disabled) {
        reasons.push("disabled");
    }
    if (skill.blockedByAllowlist) {
        reasons.push("blocked by allowlist");
    }
    return (0, lit_1.html)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n    <div class=\"list-item\">\n      <div class=\"list-main\">\n        <div class=\"list-title\">\n          ", "", "\n        </div>\n        <div class=\"list-sub\">", "</div>\n        <div class=\"chip-row\" style=\"margin-top: 6px;\">\n          <span class=\"chip\">", "</span>\n          <span class=\"chip ", "\">\n            ", "\n          </span>\n          ", "\n        </div>\n        ", "\n        ", "\n      </div>\n      <div class=\"list-meta\">\n        <div class=\"row\" style=\"justify-content: flex-end; flex-wrap: wrap;\">\n          <button\n            class=\"btn\"\n            ?disabled=", "\n            @click=", "\n          >\n            ", "\n          </button>\n          ", "\n        </div>\n        ", "\n        ", "\n      </div>\n    </div>\n  "], ["\n    <div class=\"list-item\">\n      <div class=\"list-main\">\n        <div class=\"list-title\">\n          ", "", "\n        </div>\n        <div class=\"list-sub\">", "</div>\n        <div class=\"chip-row\" style=\"margin-top: 6px;\">\n          <span class=\"chip\">", "</span>\n          <span class=\"chip ", "\">\n            ", "\n          </span>\n          ", "\n        </div>\n        ", "\n        ", "\n      </div>\n      <div class=\"list-meta\">\n        <div class=\"row\" style=\"justify-content: flex-end; flex-wrap: wrap;\">\n          <button\n            class=\"btn\"\n            ?disabled=", "\n            @click=", "\n          >\n            ", "\n          </button>\n          ", "\n        </div>\n        ", "\n        ", "\n      </div>\n    </div>\n  "])), skill.emoji ? "".concat(skill.emoji, " ") : "", skill.name, (0, format_1.clampText)(skill.description, 140), skill.source, skill.eligible ? "chip-ok" : "chip-warn", skill.eligible ? "eligible" : "blocked", skill.disabled
        ? (0, lit_1.html)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n                  <span class=\"chip chip-warn\">disabled</span>\n                "], ["\n                  <span class=\"chip chip-warn\">disabled</span>\n                "]))) : lit_1.nothing, missing.length > 0
        ? (0, lit_1.html)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n              <div class=\"muted\" style=\"margin-top: 6px;\">\n                Missing: ", "\n              </div>\n            "], ["\n              <div class=\"muted\" style=\"margin-top: 6px;\">\n                Missing: ", "\n              </div>\n            "])), missing.join(", ")) : lit_1.nothing, reasons.length > 0
        ? (0, lit_1.html)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n              <div class=\"muted\" style=\"margin-top: 6px;\">\n                Reason: ", "\n              </div>\n            "], ["\n              <div class=\"muted\" style=\"margin-top: 6px;\">\n                Reason: ", "\n              </div>\n            "])), reasons.join(", ")) : lit_1.nothing, busy, function () { return props.onToggle(skill.skillKey, skill.disabled); }, skill.disabled ? "Enable" : "Disable", canInstall
        ? (0, lit_1.html)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["<button\n                class=\"btn\"\n                ?disabled=", "\n                @click=", "\n              >\n                ", "\n              </button>"], ["<button\n                class=\"btn\"\n                ?disabled=", "\n                @click=", "\n              >\n                ", "\n              </button>"])), busy, function () { return props.onInstall(skill.skillKey, skill.name, skill.install[0].id); }, busy ? "Installing…" : skill.install[0].label) : lit_1.nothing, message
        ? (0, lit_1.html)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["<div\n              class=\"muted\"\n              style=\"margin-top: 8px; color: ", ";\"\n            >\n              ", "\n            </div>"], ["<div\n              class=\"muted\"\n              style=\"margin-top: 8px; color: ", ";\"\n            >\n              ", "\n            </div>"])), message.kind === "error"
            ? "var(--danger-color, #d14343)"
            : "var(--success-color, #0a7f5a)", message.message) : lit_1.nothing, skill.primaryEnv
        ? (0, lit_1.html)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n              <div class=\"field\" style=\"margin-top: 10px;\">\n                <span>API key</span>\n                <input\n                  type=\"password\"\n                  .value=", "\n                  @input=", "\n                />\n              </div>\n              <button\n                class=\"btn primary\"\n                style=\"margin-top: 8px;\"\n                ?disabled=", "\n                @click=", "\n              >\n                Save key\n              </button>\n            "], ["\n              <div class=\"field\" style=\"margin-top: 10px;\">\n                <span>API key</span>\n                <input\n                  type=\"password\"\n                  .value=", "\n                  @input=", "\n                />\n              </div>\n              <button\n                class=\"btn primary\"\n                style=\"margin-top: 8px;\"\n                ?disabled=", "\n                @click=", "\n              >\n                Save key\n              </button>\n            "])), apiKey, function (e) {
            return props.onEdit(skill.skillKey, e.target.value);
        }, busy, function () { return props.onSaveKey(skill.skillKey); }) : lit_1.nothing);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
