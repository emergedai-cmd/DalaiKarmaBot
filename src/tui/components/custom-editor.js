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
exports.CustomEditor = void 0;
var pi_tui_1 = require("@mariozechner/pi-tui");
var CustomEditor = /** @class */ (function (_super) {
    __extends(CustomEditor, _super);
    function CustomEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CustomEditor.prototype.handleInput = function (data) {
        if ((0, pi_tui_1.matchesKey)(data, pi_tui_1.Key.alt("enter")) && this.onAltEnter) {
            this.onAltEnter();
            return;
        }
        if ((0, pi_tui_1.matchesKey)(data, pi_tui_1.Key.ctrl("l")) && this.onCtrlL) {
            this.onCtrlL();
            return;
        }
        if ((0, pi_tui_1.matchesKey)(data, pi_tui_1.Key.ctrl("o")) && this.onCtrlO) {
            this.onCtrlO();
            return;
        }
        if ((0, pi_tui_1.matchesKey)(data, pi_tui_1.Key.ctrl("p")) && this.onCtrlP) {
            this.onCtrlP();
            return;
        }
        if ((0, pi_tui_1.matchesKey)(data, pi_tui_1.Key.ctrl("g")) && this.onCtrlG) {
            this.onCtrlG();
            return;
        }
        if ((0, pi_tui_1.matchesKey)(data, pi_tui_1.Key.ctrl("t")) && this.onCtrlT) {
            this.onCtrlT();
            return;
        }
        if ((0, pi_tui_1.matchesKey)(data, pi_tui_1.Key.shift("tab")) && this.onShiftTab) {
            this.onShiftTab();
            return;
        }
        if ((0, pi_tui_1.matchesKey)(data, pi_tui_1.Key.escape) && this.onEscape && !this.isShowingAutocomplete()) {
            this.onEscape();
            return;
        }
        if ((0, pi_tui_1.matchesKey)(data, pi_tui_1.Key.ctrl("c")) && this.onCtrlC) {
            this.onCtrlC();
            return;
        }
        if ((0, pi_tui_1.matchesKey)(data, pi_tui_1.Key.ctrl("d"))) {
            if (this.getText().length === 0 && this.onCtrlD) {
                this.onCtrlD();
            }
            return;
        }
        _super.prototype.handleInput.call(this, data);
    };
    return CustomEditor;
}(pi_tui_1.Editor));
exports.CustomEditor = CustomEditor;
