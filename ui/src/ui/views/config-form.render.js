"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECTION_META = void 0;
exports.renderConfigForm = renderConfigForm;
var lit_1 = require("lit");
var icons_1 = require("../icons");
var config_form_node_1 = require("./config-form.node");
var config_form_shared_1 = require("./config-form.shared");
// SVG Icons for section cards (Lucide-style)
var sectionIcons = {
    env: (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <circle cx=\"12\" cy=\"12\" r=\"3\"></circle>\n      <path\n        d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"\n      ></path>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <circle cx=\"12\" cy=\"12\" r=\"3\"></circle>\n      <path\n        d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"\n      ></path>\n    </svg>\n  "]))),
    update: (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path>\n      <polyline points=\"7 10 12 15 17 10\"></polyline>\n      <line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"></line>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path>\n      <polyline points=\"7 10 12 15 17 10\"></polyline>\n      <line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"></line>\n    </svg>\n  "]))),
    agents: (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path\n        d=\"M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z\"\n      ></path>\n      <circle cx=\"8\" cy=\"14\" r=\"1\"></circle>\n      <circle cx=\"16\" cy=\"14\" r=\"1\"></circle>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path\n        d=\"M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z\"\n      ></path>\n      <circle cx=\"8\" cy=\"14\" r=\"1\"></circle>\n      <circle cx=\"16\" cy=\"14\" r=\"1\"></circle>\n    </svg>\n  "]))),
    auth: (0, lit_1.html)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect>\n      <path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect>\n      <path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path>\n    </svg>\n  "]))),
    channels: (0, lit_1.html)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"></path>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"></path>\n    </svg>\n  "]))),
    messages: (0, lit_1.html)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z\"></path>\n      <polyline points=\"22,6 12,13 2,6\"></polyline>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z\"></path>\n      <polyline points=\"22,6 12,13 2,6\"></polyline>\n    </svg>\n  "]))),
    commands: (0, lit_1.html)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <polyline points=\"4 17 10 11 4 5\"></polyline>\n      <line x1=\"12\" y1=\"19\" x2=\"20\" y2=\"19\"></line>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <polyline points=\"4 17 10 11 4 5\"></polyline>\n      <line x1=\"12\" y1=\"19\" x2=\"20\" y2=\"19\"></line>\n    </svg>\n  "]))),
    hooks: (0, lit_1.html)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"></path>\n      <path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"></path>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"></path>\n      <path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"></path>\n    </svg>\n  "]))),
    skills: (0, lit_1.html)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <polygon\n        points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"\n      ></polygon>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <polygon\n        points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"\n      ></polygon>\n    </svg>\n  "]))),
    tools: (0, lit_1.html)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path\n        d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"\n      ></path>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path\n        d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"\n      ></path>\n    </svg>\n  "]))),
    gateway: (0, lit_1.html)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <circle cx=\"12\" cy=\"12\" r=\"10\"></circle>\n      <line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line>\n      <path\n        d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"\n      ></path>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <circle cx=\"12\" cy=\"12\" r=\"10\"></circle>\n      <line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line>\n      <path\n        d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"\n      ></path>\n    </svg>\n  "]))),
    wizard: (0, lit_1.html)(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M15 4V2\"></path>\n      <path d=\"M15 16v-2\"></path>\n      <path d=\"M8 9h2\"></path>\n      <path d=\"M20 9h2\"></path>\n      <path d=\"M17.8 11.8 19 13\"></path>\n      <path d=\"M15 9h0\"></path>\n      <path d=\"M17.8 6.2 19 5\"></path>\n      <path d=\"m3 21 9-9\"></path>\n      <path d=\"M12.2 6.2 11 5\"></path>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M15 4V2\"></path>\n      <path d=\"M15 16v-2\"></path>\n      <path d=\"M8 9h2\"></path>\n      <path d=\"M20 9h2\"></path>\n      <path d=\"M17.8 11.8 19 13\"></path>\n      <path d=\"M15 9h0\"></path>\n      <path d=\"M17.8 6.2 19 5\"></path>\n      <path d=\"m3 21 9-9\"></path>\n      <path d=\"M12.2 6.2 11 5\"></path>\n    </svg>\n  "]))),
    // Additional sections
    meta: (0, lit_1.html)(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M12 20h9\"></path>\n      <path d=\"M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z\"></path>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M12 20h9\"></path>\n      <path d=\"M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z\"></path>\n    </svg>\n  "]))),
    logging: (0, lit_1.html)(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"></path>\n      <polyline points=\"14 2 14 8 20 8\"></polyline>\n      <line x1=\"16\" y1=\"13\" x2=\"8\" y2=\"13\"></line>\n      <line x1=\"16\" y1=\"17\" x2=\"8\" y2=\"17\"></line>\n      <polyline points=\"10 9 9 9 8 9\"></polyline>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"></path>\n      <polyline points=\"14 2 14 8 20 8\"></polyline>\n      <line x1=\"16\" y1=\"13\" x2=\"8\" y2=\"13\"></line>\n      <line x1=\"16\" y1=\"17\" x2=\"8\" y2=\"17\"></line>\n      <polyline points=\"10 9 9 9 8 9\"></polyline>\n    </svg>\n  "]))),
    browser: (0, lit_1.html)(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <circle cx=\"12\" cy=\"12\" r=\"10\"></circle>\n      <circle cx=\"12\" cy=\"12\" r=\"4\"></circle>\n      <line x1=\"21.17\" y1=\"8\" x2=\"12\" y2=\"8\"></line>\n      <line x1=\"3.95\" y1=\"6.06\" x2=\"8.54\" y2=\"14\"></line>\n      <line x1=\"10.88\" y1=\"21.94\" x2=\"15.46\" y2=\"14\"></line>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <circle cx=\"12\" cy=\"12\" r=\"10\"></circle>\n      <circle cx=\"12\" cy=\"12\" r=\"4\"></circle>\n      <line x1=\"21.17\" y1=\"8\" x2=\"12\" y2=\"8\"></line>\n      <line x1=\"3.95\" y1=\"6.06\" x2=\"8.54\" y2=\"14\"></line>\n      <line x1=\"10.88\" y1=\"21.94\" x2=\"15.46\" y2=\"14\"></line>\n    </svg>\n  "]))),
    ui: (0, lit_1.html)(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect>\n      <line x1=\"3\" y1=\"9\" x2=\"21\" y2=\"9\"></line>\n      <line x1=\"9\" y1=\"21\" x2=\"9\" y2=\"9\"></line>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect>\n      <line x1=\"3\" y1=\"9\" x2=\"21\" y2=\"9\"></line>\n      <line x1=\"9\" y1=\"21\" x2=\"9\" y2=\"9\"></line>\n    </svg>\n  "]))),
    models: (0, lit_1.html)(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path\n        d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"\n      ></path>\n      <polyline points=\"3.27 6.96 12 12.01 20.73 6.96\"></polyline>\n      <line x1=\"12\" y1=\"22.08\" x2=\"12\" y2=\"12\"></line>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path\n        d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"\n      ></path>\n      <polyline points=\"3.27 6.96 12 12.01 20.73 6.96\"></polyline>\n      <line x1=\"12\" y1=\"22.08\" x2=\"12\" y2=\"12\"></line>\n    </svg>\n  "]))),
    bindings: (0, lit_1.html)(templateObject_18 || (templateObject_18 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <rect x=\"2\" y=\"2\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"></rect>\n      <rect x=\"2\" y=\"14\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"></rect>\n      <line x1=\"6\" y1=\"6\" x2=\"6.01\" y2=\"6\"></line>\n      <line x1=\"6\" y1=\"18\" x2=\"6.01\" y2=\"18\"></line>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <rect x=\"2\" y=\"2\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"></rect>\n      <rect x=\"2\" y=\"14\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"></rect>\n      <line x1=\"6\" y1=\"6\" x2=\"6.01\" y2=\"6\"></line>\n      <line x1=\"6\" y1=\"18\" x2=\"6.01\" y2=\"18\"></line>\n    </svg>\n  "]))),
    broadcast: (0, lit_1.html)(templateObject_19 || (templateObject_19 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M4.9 19.1C1 15.2 1 8.8 4.9 4.9\"></path>\n      <path d=\"M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5\"></path>\n      <circle cx=\"12\" cy=\"12\" r=\"2\"></circle>\n      <path d=\"M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5\"></path>\n      <path d=\"M19.1 4.9C23 8.8 23 15.1 19.1 19\"></path>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M4.9 19.1C1 15.2 1 8.8 4.9 4.9\"></path>\n      <path d=\"M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5\"></path>\n      <circle cx=\"12\" cy=\"12\" r=\"2\"></circle>\n      <path d=\"M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5\"></path>\n      <path d=\"M19.1 4.9C23 8.8 23 15.1 19.1 19\"></path>\n    </svg>\n  "]))),
    audio: (0, lit_1.html)(templateObject_20 || (templateObject_20 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M9 18V5l12-2v13\"></path>\n      <circle cx=\"6\" cy=\"18\" r=\"3\"></circle>\n      <circle cx=\"18\" cy=\"16\" r=\"3\"></circle>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M9 18V5l12-2v13\"></path>\n      <circle cx=\"6\" cy=\"18\" r=\"3\"></circle>\n      <circle cx=\"18\" cy=\"16\" r=\"3\"></circle>\n    </svg>\n  "]))),
    session: (0, lit_1.html)(templateObject_21 || (templateObject_21 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path>\n      <circle cx=\"9\" cy=\"7\" r=\"4\"></circle>\n      <path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"></path>\n      <path d=\"M16 3.13a4 4 0 0 1 0 7.75\"></path>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path>\n      <circle cx=\"9\" cy=\"7\" r=\"4\"></circle>\n      <path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"></path>\n      <path d=\"M16 3.13a4 4 0 0 1 0 7.75\"></path>\n    </svg>\n  "]))),
    cron: (0, lit_1.html)(templateObject_22 || (templateObject_22 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <circle cx=\"12\" cy=\"12\" r=\"10\"></circle>\n      <polyline points=\"12 6 12 12 16 14\"></polyline>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <circle cx=\"12\" cy=\"12\" r=\"10\"></circle>\n      <polyline points=\"12 6 12 12 16 14\"></polyline>\n    </svg>\n  "]))),
    web: (0, lit_1.html)(templateObject_23 || (templateObject_23 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <circle cx=\"12\" cy=\"12\" r=\"10\"></circle>\n      <line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line>\n      <path\n        d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"\n      ></path>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <circle cx=\"12\" cy=\"12\" r=\"10\"></circle>\n      <line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line>\n      <path\n        d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"\n      ></path>\n    </svg>\n  "]))),
    discovery: (0, lit_1.html)(templateObject_24 || (templateObject_24 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <circle cx=\"11\" cy=\"11\" r=\"8\"></circle>\n      <line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"></line>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <circle cx=\"11\" cy=\"11\" r=\"8\"></circle>\n      <line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"></line>\n    </svg>\n  "]))),
    canvasHost: (0, lit_1.html)(templateObject_25 || (templateObject_25 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect>\n      <circle cx=\"8.5\" cy=\"8.5\" r=\"1.5\"></circle>\n      <polyline points=\"21 15 16 10 5 21\"></polyline>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect>\n      <circle cx=\"8.5\" cy=\"8.5\" r=\"1.5\"></circle>\n      <polyline points=\"21 15 16 10 5 21\"></polyline>\n    </svg>\n  "]))),
    talk: (0, lit_1.html)(templateObject_26 || (templateObject_26 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z\"></path>\n      <path d=\"M19 10v2a7 7 0 0 1-14 0v-2\"></path>\n      <line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"23\"></line>\n      <line x1=\"8\" y1=\"23\" x2=\"16\" y2=\"23\"></line>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z\"></path>\n      <path d=\"M19 10v2a7 7 0 0 1-14 0v-2\"></path>\n      <line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"23\"></line>\n      <line x1=\"8\" y1=\"23\" x2=\"16\" y2=\"23\"></line>\n    </svg>\n  "]))),
    plugins: (0, lit_1.html)(templateObject_27 || (templateObject_27 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M12 2v6\"></path>\n      <path d=\"m4.93 10.93 4.24 4.24\"></path>\n      <path d=\"M2 12h6\"></path>\n      <path d=\"m4.93 13.07 4.24-4.24\"></path>\n      <path d=\"M12 22v-6\"></path>\n      <path d=\"m19.07 13.07-4.24-4.24\"></path>\n      <path d=\"M22 12h-6\"></path>\n      <path d=\"m19.07 10.93-4.24 4.24\"></path>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M12 2v6\"></path>\n      <path d=\"m4.93 10.93 4.24 4.24\"></path>\n      <path d=\"M2 12h6\"></path>\n      <path d=\"m4.93 13.07 4.24-4.24\"></path>\n      <path d=\"M12 22v-6\"></path>\n      <path d=\"m19.07 13.07-4.24-4.24\"></path>\n      <path d=\"M22 12h-6\"></path>\n      <path d=\"m19.07 10.93-4.24 4.24\"></path>\n    </svg>\n  "]))),
    default: (0, lit_1.html)(templateObject_28 || (templateObject_28 = __makeTemplateObject(["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"></path>\n      <polyline points=\"14 2 14 8 20 8\"></polyline>\n    </svg>\n  "], ["\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\">\n      <path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"></path>\n      <polyline points=\"14 2 14 8 20 8\"></polyline>\n    </svg>\n  "]))),
};
// Section metadata
exports.SECTION_META = {
    env: {
        label: "Environment Variables",
        description: "Environment variables passed to the gateway process",
    },
    update: { label: "Updates", description: "Auto-update settings and release channel" },
    agents: { label: "Agents", description: "Agent configurations, models, and identities" },
    auth: { label: "Authentication", description: "API keys and authentication profiles" },
    channels: {
        label: "Channels",
        description: "Messaging channels (Telegram, Discord, Slack, etc.)",
    },
    messages: { label: "Messages", description: "Message handling and routing settings" },
    commands: { label: "Commands", description: "Custom slash commands" },
    hooks: { label: "Hooks", description: "Webhooks and event hooks" },
    skills: { label: "Skills", description: "Skill packs and capabilities" },
    tools: { label: "Tools", description: "Tool configurations (browser, search, etc.)" },
    gateway: { label: "Gateway", description: "Gateway server settings (port, auth, binding)" },
    wizard: { label: "Setup Wizard", description: "Setup wizard state and history" },
    // Additional sections
    meta: { label: "Metadata", description: "Gateway metadata and version information" },
    logging: { label: "Logging", description: "Log levels and output configuration" },
    browser: { label: "Browser", description: "Browser automation settings" },
    ui: { label: "UI", description: "User interface preferences" },
    models: { label: "Models", description: "AI model configurations and providers" },
    bindings: { label: "Bindings", description: "Key bindings and shortcuts" },
    broadcast: { label: "Broadcast", description: "Broadcast and notification settings" },
    audio: { label: "Audio", description: "Audio input/output settings" },
    session: { label: "Session", description: "Session management and persistence" },
    cron: { label: "Cron", description: "Scheduled tasks and automation" },
    web: { label: "Web", description: "Web server and API settings" },
    discovery: { label: "Discovery", description: "Service discovery and networking" },
    canvasHost: { label: "Canvas Host", description: "Canvas rendering and display" },
    talk: { label: "Talk", description: "Voice and speech settings" },
    plugins: { label: "Plugins", description: "Plugin management and extensions" },
};
function getSectionIcon(key) {
    var _a;
    return (_a = sectionIcons[key]) !== null && _a !== void 0 ? _a : sectionIcons.default;
}
function matchesSearch(key, schema, query) {
    if (!query) {
        return true;
    }
    var q = query.toLowerCase();
    var meta = exports.SECTION_META[key];
    // Check key name
    if (key.toLowerCase().includes(q)) {
        return true;
    }
    // Check label and description
    if (meta) {
        if (meta.label.toLowerCase().includes(q)) {
            return true;
        }
        if (meta.description.toLowerCase().includes(q)) {
            return true;
        }
    }
    return schemaMatches(schema, q);
}
function schemaMatches(schema, query) {
    var _a, _b, _c, _d, _e;
    if ((_a = schema.title) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(query)) {
        return true;
    }
    if ((_b = schema.description) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(query)) {
        return true;
    }
    if ((_c = schema.enum) === null || _c === void 0 ? void 0 : _c.some(function (value) { return String(value).toLowerCase().includes(query); })) {
        return true;
    }
    if (schema.properties) {
        for (var _i = 0, _f = Object.entries(schema.properties); _i < _f.length; _i++) {
            var _g = _f[_i], propKey = _g[0], propSchema = _g[1];
            if (propKey.toLowerCase().includes(query)) {
                return true;
            }
            if (schemaMatches(propSchema, query)) {
                return true;
            }
        }
    }
    if (schema.items) {
        var items = Array.isArray(schema.items) ? schema.items : [schema.items];
        for (var _h = 0, items_1 = items; _h < items_1.length; _h++) {
            var item = items_1[_h];
            if (item && schemaMatches(item, query)) {
                return true;
            }
        }
    }
    if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
        if (schemaMatches(schema.additionalProperties, query)) {
            return true;
        }
    }
    var unions = (_e = (_d = schema.anyOf) !== null && _d !== void 0 ? _d : schema.oneOf) !== null && _e !== void 0 ? _e : schema.allOf;
    if (unions) {
        for (var _j = 0, unions_1 = unions; _j < unions_1.length; _j++) {
            var entry = unions_1[_j];
            if (entry && schemaMatches(entry, query)) {
                return true;
            }
        }
    }
    return false;
}
function renderConfigForm(props) {
    var _a, _b, _c, _d, _e;
    if (!props.schema) {
        return (0, lit_1.html)(templateObject_29 || (templateObject_29 = __makeTemplateObject(["\n      <div class=\"muted\">Schema unavailable.</div>\n    "], ["\n      <div class=\"muted\">Schema unavailable.</div>\n    "])));
    }
    var schema = props.schema;
    var value = (_a = props.value) !== null && _a !== void 0 ? _a : {};
    if ((0, config_form_shared_1.schemaType)(schema) !== "object" || !schema.properties) {
        return (0, lit_1.html)(templateObject_30 || (templateObject_30 = __makeTemplateObject(["\n      <div class=\"callout danger\">Unsupported schema. Use Raw.</div>\n    "], ["\n      <div class=\"callout danger\">Unsupported schema. Use Raw.</div>\n    "])));
    }
    var unsupported = new Set((_b = props.unsupportedPaths) !== null && _b !== void 0 ? _b : []);
    var properties = schema.properties;
    var searchQuery = (_c = props.searchQuery) !== null && _c !== void 0 ? _c : "";
    var activeSection = props.activeSection;
    var activeSubsection = (_d = props.activeSubsection) !== null && _d !== void 0 ? _d : null;
    var entries = Object.entries(properties).toSorted(function (a, b) {
        var _a, _b, _c, _d;
        var orderA = (_b = (_a = (0, config_form_shared_1.hintForPath)([a[0]], props.uiHints)) === null || _a === void 0 ? void 0 : _a.order) !== null && _b !== void 0 ? _b : 50;
        var orderB = (_d = (_c = (0, config_form_shared_1.hintForPath)([b[0]], props.uiHints)) === null || _c === void 0 ? void 0 : _c.order) !== null && _d !== void 0 ? _d : 50;
        if (orderA !== orderB) {
            return orderA - orderB;
        }
        return a[0].localeCompare(b[0]);
    });
    var filteredEntries = entries.filter(function (_a) {
        var key = _a[0], node = _a[1];
        if (activeSection && key !== activeSection) {
            return false;
        }
        if (searchQuery && !matchesSearch(key, node, searchQuery)) {
            return false;
        }
        return true;
    });
    var subsectionContext = null;
    if (activeSection && activeSubsection && filteredEntries.length === 1) {
        var sectionSchema = (_e = filteredEntries[0]) === null || _e === void 0 ? void 0 : _e[1];
        if (sectionSchema &&
            (0, config_form_shared_1.schemaType)(sectionSchema) === "object" &&
            sectionSchema.properties &&
            sectionSchema.properties[activeSubsection]) {
            subsectionContext = {
                sectionKey: activeSection,
                subsectionKey: activeSubsection,
                schema: sectionSchema.properties[activeSubsection],
            };
        }
    }
    if (filteredEntries.length === 0) {
        return (0, lit_1.html)(templateObject_31 || (templateObject_31 = __makeTemplateObject(["\n      <div class=\"config-empty\">\n        <div class=\"config-empty__icon\">", "</div>\n        <div class=\"config-empty__text\">\n          ", "\n        </div>\n      </div>\n    "], ["\n      <div class=\"config-empty\">\n        <div class=\"config-empty__icon\">", "</div>\n        <div class=\"config-empty__text\">\n          ", "\n        </div>\n      </div>\n    "])), icons_1.icons.search, searchQuery ? "No settings match \"".concat(searchQuery, "\"") : "No settings in this section");
    }
    return (0, lit_1.html)(templateObject_36 || (templateObject_36 = __makeTemplateObject(["\n    <div class=\"config-form config-form--modern\">\n      ", "\n    </div>\n  "], ["\n    <div class=\"config-form config-form--modern\">\n      ", "\n    </div>\n  "])), subsectionContext
        ? (function () {
            var _a, _b, _c, _d, _e;
            var sectionKey = subsectionContext.sectionKey, subsectionKey = subsectionContext.subsectionKey, node = subsectionContext.schema;
            var hint = (0, config_form_shared_1.hintForPath)([sectionKey, subsectionKey], props.uiHints);
            var label = (_b = (_a = hint === null || hint === void 0 ? void 0 : hint.label) !== null && _a !== void 0 ? _a : node.title) !== null && _b !== void 0 ? _b : (0, config_form_shared_1.humanize)(subsectionKey);
            var description = (_d = (_c = hint === null || hint === void 0 ? void 0 : hint.help) !== null && _c !== void 0 ? _c : node.description) !== null && _d !== void 0 ? _d : "";
            var sectionValue = value[sectionKey];
            var scopedValue = sectionValue && typeof sectionValue === "object"
                ? sectionValue[subsectionKey]
                : undefined;
            var id = "config-section-".concat(sectionKey, "-").concat(subsectionKey);
            return (0, lit_1.html)(templateObject_33 || (templateObject_33 = __makeTemplateObject(["\n              <section class=\"config-section-card\" id=", ">\n                <div class=\"config-section-card__header\">\n                  <span class=\"config-section-card__icon\">", "</span>\n                  <div class=\"config-section-card__titles\">\n                    <h3 class=\"config-section-card__title\">", "</h3>\n                    ", "\n                  </div>\n                </div>\n                <div class=\"config-section-card__content\">\n                  ", "\n                </div>\n              </section>\n            "], ["\n              <section class=\"config-section-card\" id=", ">\n                <div class=\"config-section-card__header\">\n                  <span class=\"config-section-card__icon\">", "</span>\n                  <div class=\"config-section-card__titles\">\n                    <h3 class=\"config-section-card__title\">", "</h3>\n                    ", "\n                  </div>\n                </div>\n                <div class=\"config-section-card__content\">\n                  ", "\n                </div>\n              </section>\n            "])), id, getSectionIcon(sectionKey), label, description
                ? (0, lit_1.html)(templateObject_32 || (templateObject_32 = __makeTemplateObject(["<p class=\"config-section-card__desc\">", "</p>"], ["<p class=\"config-section-card__desc\">", "</p>"])), description) : lit_1.nothing, (0, config_form_node_1.renderNode)({
                schema: node,
                value: scopedValue,
                path: [sectionKey, subsectionKey],
                hints: props.uiHints,
                unsupported: unsupported,
                disabled: (_e = props.disabled) !== null && _e !== void 0 ? _e : false,
                showLabel: false,
                onPatch: props.onPatch,
            }));
        })()
        : filteredEntries.map(function (_a) {
            var _b, _c, _d;
            var key = _a[0], node = _a[1];
            var meta = (_b = exports.SECTION_META[key]) !== null && _b !== void 0 ? _b : {
                label: key.charAt(0).toUpperCase() + key.slice(1),
                description: (_c = node.description) !== null && _c !== void 0 ? _c : "",
            };
            return (0, lit_1.html)(templateObject_35 || (templateObject_35 = __makeTemplateObject(["\n              <section class=\"config-section-card\" id=\"config-section-", "\">\n                <div class=\"config-section-card__header\">\n                  <span class=\"config-section-card__icon\">", "</span>\n                  <div class=\"config-section-card__titles\">\n                    <h3 class=\"config-section-card__title\">", "</h3>\n                    ", "\n                  </div>\n                </div>\n                <div class=\"config-section-card__content\">\n                  ", "\n                </div>\n              </section>\n            "], ["\n              <section class=\"config-section-card\" id=\"config-section-", "\">\n                <div class=\"config-section-card__header\">\n                  <span class=\"config-section-card__icon\">", "</span>\n                  <div class=\"config-section-card__titles\">\n                    <h3 class=\"config-section-card__title\">", "</h3>\n                    ", "\n                  </div>\n                </div>\n                <div class=\"config-section-card__content\">\n                  ", "\n                </div>\n              </section>\n            "])), key, getSectionIcon(key), meta.label, meta.description
                ? (0, lit_1.html)(templateObject_34 || (templateObject_34 = __makeTemplateObject(["<p class=\"config-section-card__desc\">", "</p>"], ["<p class=\"config-section-card__desc\">", "</p>"])), meta.description) : lit_1.nothing, (0, config_form_node_1.renderNode)({
                schema: node,
                value: value[key],
                path: [key],
                hints: props.uiHints,
                unsupported: unsupported,
                disabled: (_d = props.disabled) !== null && _d !== void 0 ? _d : false,
                showLabel: false,
                onPatch: props.onPatch,
            }));
        }));
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32, templateObject_33, templateObject_34, templateObject_35, templateObject_36;
