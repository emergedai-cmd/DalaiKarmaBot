"use strict";
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
exports.select = exports.confirm = exports.text = exports.outro = exports.intro = exports.CONFIGURE_SECTION_OPTIONS = exports.CONFIGURE_WIZARD_SECTIONS = void 0;
var prompts_1 = require("@clack/prompts");
var prompt_style_js_1 = require("../terminal/prompt-style.js");
exports.CONFIGURE_WIZARD_SECTIONS = [
    "workspace",
    "model",
    "web",
    "gateway",
    "daemon",
    "channels",
    "skills",
    "health",
];
exports.CONFIGURE_SECTION_OPTIONS = [
    { value: "workspace", label: "Workspace", hint: "Set workspace + sessions" },
    { value: "model", label: "Model", hint: "Pick provider + credentials" },
    { value: "web", label: "Web tools", hint: "Configure Brave search + fetch" },
    { value: "gateway", label: "Gateway", hint: "Port, bind, auth, tailscale" },
    {
        value: "daemon",
        label: "Daemon",
        hint: "Install/manage the background service",
    },
    {
        value: "channels",
        label: "Channels",
        hint: "Link WhatsApp/Telegram/etc and defaults",
    },
    { value: "skills", label: "Skills", hint: "Install/enable workspace skills" },
    {
        value: "health",
        label: "Health check",
        hint: "Run gateway + channel checks",
    },
];
var intro = function (message) { var _a; return (0, prompts_1.intro)((_a = (0, prompt_style_js_1.stylePromptTitle)(message)) !== null && _a !== void 0 ? _a : message); };
exports.intro = intro;
var outro = function (message) { var _a; return (0, prompts_1.outro)((_a = (0, prompt_style_js_1.stylePromptTitle)(message)) !== null && _a !== void 0 ? _a : message); };
exports.outro = outro;
var text = function (params) {
    return (0, prompts_1.text)(__assign(__assign({}, params), { message: (0, prompt_style_js_1.stylePromptMessage)(params.message) }));
};
exports.text = text;
var confirm = function (params) {
    return (0, prompts_1.confirm)(__assign(__assign({}, params), { message: (0, prompt_style_js_1.stylePromptMessage)(params.message) }));
};
exports.confirm = confirm;
var select = function (params) {
    return (0, prompts_1.select)(__assign(__assign({}, params), { message: (0, prompt_style_js_1.stylePromptMessage)(params.message), options: params.options.map(function (opt) {
            return opt.hint === undefined ? opt : __assign(__assign({}, opt), { hint: (0, prompt_style_js_1.stylePromptHint)(opt.hint) });
        }) }));
};
exports.select = select;
