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
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResizableDivider = void 0;
var lit_1 = require("lit");
var decorators_js_1 = require("lit/decorators.js");
/**
 * A draggable divider for resizable split views.
 * Dispatches 'resize' events with { splitRatio: number } detail.
 */
var ResizableDivider = function () {
    var _classDecorators = [(0, decorators_js_1.customElement)("resizable-divider")];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = lit_1.LitElement;
    var _splitRatio_decorators;
    var _splitRatio_initializers = [];
    var _splitRatio_extraInitializers = [];
    var _minRatio_decorators;
    var _minRatio_initializers = [];
    var _minRatio_extraInitializers = [];
    var _maxRatio_decorators;
    var _maxRatio_initializers = [];
    var _maxRatio_extraInitializers = [];
    var ResizableDivider = _classThis = /** @class */ (function (_super) {
        __extends(ResizableDivider_1, _super);
        function ResizableDivider_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.splitRatio = __runInitializers(_this, _splitRatio_initializers, 0.6);
            _this.minRatio = (__runInitializers(_this, _splitRatio_extraInitializers), __runInitializers(_this, _minRatio_initializers, 0.4));
            _this.maxRatio = (__runInitializers(_this, _minRatio_extraInitializers), __runInitializers(_this, _maxRatio_initializers, 0.7));
            _this.isDragging = (__runInitializers(_this, _maxRatio_extraInitializers), false);
            _this.startX = 0;
            _this.startRatio = 0;
            _this.handleMouseDown = function (e) {
                _this.isDragging = true;
                _this.startX = e.clientX;
                _this.startRatio = _this.splitRatio;
                _this.classList.add("dragging");
                document.addEventListener("mousemove", _this.handleMouseMove);
                document.addEventListener("mouseup", _this.handleMouseUp);
                e.preventDefault();
            };
            _this.handleMouseMove = function (e) {
                if (!_this.isDragging) {
                    return;
                }
                var container = _this.parentElement;
                if (!container) {
                    return;
                }
                var containerWidth = container.getBoundingClientRect().width;
                var deltaX = e.clientX - _this.startX;
                var deltaRatio = deltaX / containerWidth;
                var newRatio = _this.startRatio + deltaRatio;
                newRatio = Math.max(_this.minRatio, Math.min(_this.maxRatio, newRatio));
                _this.dispatchEvent(new CustomEvent("resize", {
                    detail: { splitRatio: newRatio },
                    bubbles: true,
                    composed: true,
                }));
            };
            _this.handleMouseUp = function () {
                _this.isDragging = false;
                _this.classList.remove("dragging");
                document.removeEventListener("mousemove", _this.handleMouseMove);
                document.removeEventListener("mouseup", _this.handleMouseUp);
            };
            return _this;
        }
        ResizableDivider_1.prototype.render = function () {
            return (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      \n    "], ["\n      \n    "])));
        };
        ResizableDivider_1.prototype.connectedCallback = function () {
            _super.prototype.connectedCallback.call(this);
            this.addEventListener("mousedown", this.handleMouseDown);
        };
        ResizableDivider_1.prototype.disconnectedCallback = function () {
            _super.prototype.disconnectedCallback.call(this);
            this.removeEventListener("mousedown", this.handleMouseDown);
            document.removeEventListener("mousemove", this.handleMouseMove);
            document.removeEventListener("mouseup", this.handleMouseUp);
        };
        return ResizableDivider_1;
    }(_classSuper));
    __setFunctionName(_classThis, "ResizableDivider");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _splitRatio_decorators = [(0, decorators_js_1.property)({ type: Number })];
        _minRatio_decorators = [(0, decorators_js_1.property)({ type: Number })];
        _maxRatio_decorators = [(0, decorators_js_1.property)({ type: Number })];
        __esDecorate(null, null, _splitRatio_decorators, { kind: "field", name: "splitRatio", static: false, private: false, access: { has: function (obj) { return "splitRatio" in obj; }, get: function (obj) { return obj.splitRatio; }, set: function (obj, value) { obj.splitRatio = value; } }, metadata: _metadata }, _splitRatio_initializers, _splitRatio_extraInitializers);
        __esDecorate(null, null, _minRatio_decorators, { kind: "field", name: "minRatio", static: false, private: false, access: { has: function (obj) { return "minRatio" in obj; }, get: function (obj) { return obj.minRatio; }, set: function (obj, value) { obj.minRatio = value; } }, metadata: _metadata }, _minRatio_initializers, _minRatio_extraInitializers);
        __esDecorate(null, null, _maxRatio_decorators, { kind: "field", name: "maxRatio", static: false, private: false, access: { has: function (obj) { return "maxRatio" in obj; }, get: function (obj) { return obj.maxRatio; }, set: function (obj, value) { obj.maxRatio = value; } }, metadata: _metadata }, _maxRatio_initializers, _maxRatio_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ResizableDivider = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.styles = (0, lit_1.css)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    :host {\n      width: 4px;\n      cursor: col-resize;\n      background: var(--border, #333);\n      transition: background 150ms ease-out;\n      flex-shrink: 0;\n      position: relative;\n    }\n    \n    :host::before {\n      content: \"\";\n      position: absolute;\n      top: 0;\n      left: -4px;\n      right: -4px;\n      bottom: 0;\n    }\n    \n    :host(:hover) {\n      background: var(--accent, #007bff);\n    }\n    \n    :host(.dragging) {\n      background: var(--accent, #007bff);\n    }\n  "], ["\n    :host {\n      width: 4px;\n      cursor: col-resize;\n      background: var(--border, #333);\n      transition: background 150ms ease-out;\n      flex-shrink: 0;\n      position: relative;\n    }\n    \n    :host::before {\n      content: \"\";\n      position: absolute;\n      top: 0;\n      left: -4px;\n      right: -4px;\n      bottom: 0;\n    }\n    \n    :host(:hover) {\n      background: var(--accent, #007bff);\n    }\n    \n    :host(.dragging) {\n      background: var(--accent, #007bff);\n    }\n  "])));
    (function () {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ResizableDivider = _classThis;
}();
exports.ResizableDivider = ResizableDivider;
var templateObject_1, templateObject_2;
