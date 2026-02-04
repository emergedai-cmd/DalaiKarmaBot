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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.removeChannelConfigWizard = removeChannelConfigWizard;
var index_js_1 = require("../channels/plugins/index.js");
var command_format_js_1 = require("../cli/command-format.js");
var config_js_1 = require("../config/config.js");
var note_js_1 = require("../terminal/note.js");
var utils_js_1 = require("../utils.js");
var configure_shared_js_1 = require("./configure.shared.js");
var onboard_helpers_js_1 = require("./onboard-helpers.js");
function removeChannelConfigWizard(cfg, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var next, listConfiguredChannels, configured, channel, _a, label, confirmed, _b, nextChannels;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    next = __assign({}, cfg);
                    listConfiguredChannels = function () {
                        return (0, index_js_1.listChannelPlugins)()
                            .map(function (plugin) { return plugin.meta; })
                            .filter(function (meta) { var _a; return ((_a = next.channels) === null || _a === void 0 ? void 0 : _a[meta.id]) !== undefined; });
                    };
                    _e.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 4];
                    configured = listConfiguredChannels();
                    if (configured.length === 0) {
                        (0, note_js_1.note)([
                            "No channel config found in openclaw.json.",
                            "Tip: `".concat((0, command_format_js_1.formatCliCommand)("openclaw channels status"), "` shows what is configured and enabled."),
                        ].join("\n"), "Remove channel");
                        return [2 /*return*/, next];
                    }
                    _a = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.select)({
                            message: "Remove which channel config?",
                            options: __spreadArray(__spreadArray([], configured.map(function (meta) { return ({
                                value: meta.id,
                                label: meta.label,
                                hint: "Deletes tokens + settings from config (credentials stay on disk)",
                            }); }), true), [
                                { value: "done", label: "Done" },
                            ], false),
                        })];
                case 2:
                    channel = _a.apply(void 0, [_e.sent(), runtime]);
                    if (channel === "done") {
                        return [2 /*return*/, next];
                    }
                    label = (_d = (_c = (0, index_js_1.getChannelPlugin)(channel)) === null || _c === void 0 ? void 0 : _c.meta.label) !== null && _d !== void 0 ? _d : channel;
                    _b = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.confirm)({
                            message: "Delete ".concat(label, " configuration from ").concat((0, utils_js_1.shortenHomePath)(config_js_1.CONFIG_PATH), "?"),
                            initialValue: false,
                        })];
                case 3:
                    confirmed = _b.apply(void 0, [_e.sent(), runtime]);
                    if (!confirmed) {
                        return [3 /*break*/, 1];
                    }
                    nextChannels = __assign({}, next.channels);
                    delete nextChannels[channel];
                    next = __assign(__assign({}, next), { channels: Object.keys(nextChannels).length
                            ? nextChannels
                            : undefined });
                    (0, note_js_1.note)(["".concat(label, " removed from config."), "Note: credentials/sessions on disk are unchanged."].join("\n"), "Channel removed");
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
