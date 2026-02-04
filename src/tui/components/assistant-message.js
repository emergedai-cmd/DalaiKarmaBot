"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistantMessageComponent = void 0;
var pi_tui_1 = require("@mariozechner/pi-tui");
var theme_js_1 = require("../theme/theme.js");
var AssistantMessageComponent = /** @class */ (function (_super) {
    __extends(AssistantMessageComponent, _super);
    function AssistantMessageComponent(text) {
        var _this = _super.call(this) || this;
        _this.body = new pi_tui_1.Markdown(text, 1, 0, theme_js_1.markdownTheme, {
            color: function (line) { return theme_js_1.theme.fg(line); },
        });
        _this.addChild(new pi_tui_1.Spacer(1));
        _this.addChild(_this.body);
        return _this;
    }
    AssistantMessageComponent.prototype.setText = function (text) {
        this.body.setText(text);
    };
    return AssistantMessageComponent;
}(pi_tui_1.Container));
exports.AssistantMessageComponent = AssistantMessageComponent;
