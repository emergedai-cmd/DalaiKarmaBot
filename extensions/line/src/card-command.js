"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLineCardCommand = registerLineCardCommand;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var CARD_USAGE = "Usage: /card <type> \"title\" \"body\" [options]\n\nTypes:\n  info \"Title\" \"Body\" [\"Footer\"]\n  image \"Title\" \"Caption\" --url <image-url>\n  action \"Title\" \"Body\" --actions \"Btn1|url1,Btn2|text2\"\n  list \"Title\" \"Item1|Desc1,Item2|Desc2\"\n  receipt \"Title\" \"Item1:$10,Item2:$20\" --total \"$30\"\n  confirm \"Question?\" --yes \"Yes|data\" --no \"No|data\"\n  buttons \"Title\" \"Text\" --actions \"Btn1|url1,Btn2|data2\"\n\nExamples:\n  /card info \"Welcome\" \"Thanks for joining!\"\n  /card image \"Product\" \"Check it out\" --url https://example.com/img.jpg\n  /card action \"Menu\" \"Choose an option\" --actions \"Order|/order,Help|/help\"";
function buildLineReply(lineData) {
    return {
        channelData: {
            line: lineData,
        },
    };
}
/**
 * Parse action string format: "Label|data,Label2|data2"
 * Data can be a URL (uri action) or plain text (message action) or key=value (postback)
 */
function parseActions(actionsStr) {
    if (!actionsStr) {
        return [];
    }
    var results = [];
    for (var _i = 0, _a = actionsStr.split(","); _i < _a.length; _i++) {
        var part = _a[_i];
        var _b = part
            .trim()
            .split("|")
            .map(function (s) { return s.trim(); }), label = _b[0], data = _b[1];
        if (!label) {
            continue;
        }
        var actionData = data || label;
        if (actionData.startsWith("http://") || actionData.startsWith("https://")) {
            results.push({
                label: label,
                action: { type: "uri", label: label.slice(0, 20), uri: actionData },
            });
        }
        else if (actionData.includes("=")) {
            results.push({
                label: label,
                action: {
                    type: "postback",
                    label: label.slice(0, 20),
                    data: actionData.slice(0, 300),
                    displayText: label,
                },
            });
        }
        else {
            results.push({
                label: label,
                action: { type: "message", label: label.slice(0, 20), text: actionData },
            });
        }
    }
    return results;
}
/**
 * Parse list items format: "Item1|Subtitle1,Item2|Subtitle2"
 */
function parseListItems(itemsStr) {
    return itemsStr
        .split(",")
        .map(function (part) {
        var _a = part
            .trim()
            .split("|")
            .map(function (s) { return s.trim(); }), title = _a[0], subtitle = _a[1];
        return { title: title || "", subtitle: subtitle };
    })
        .filter(function (item) { return item.title; });
}
/**
 * Parse receipt items format: "Item1:$10,Item2:$20"
 */
function parseReceiptItems(itemsStr) {
    return itemsStr
        .split(",")
        .map(function (part) {
        var colonIndex = part.lastIndexOf(":");
        if (colonIndex === -1) {
            return { name: part.trim(), value: "" };
        }
        return {
            name: part.slice(0, colonIndex).trim(),
            value: part.slice(colonIndex + 1).trim(),
        };
    })
        .filter(function (item) { return item.name; });
}
/**
 * Parse quoted arguments from command string
 * Supports: /card type "arg1" "arg2" "arg3" --flag value
 */
function parseCardArgs(argsStr) {
    var _a;
    var result = {
        type: "",
        args: [],
        flags: {},
    };
    // Extract type (first word)
    var typeMatch = argsStr.match(/^(\w+)/);
    if (typeMatch) {
        result.type = typeMatch[1].toLowerCase();
        argsStr = argsStr.slice(typeMatch[0].length).trim();
    }
    // Extract quoted arguments
    var quotedRegex = /"([^"]*?)"/g;
    var match;
    while ((match = quotedRegex.exec(argsStr)) !== null) {
        result.args.push(match[1]);
    }
    // Extract flags (--key value or --key "value")
    var flagRegex = /--(\w+)\s+(?:"([^"]*?)"|(\S+))/g;
    while ((match = flagRegex.exec(argsStr)) !== null) {
        result.flags[match[1]] = (_a = match[2]) !== null && _a !== void 0 ? _a : match[3];
    }
    return result;
}
function registerLineCardCommand(api) {
    var _this = this;
    api.registerCommand({
        name: "card",
        description: "Send a rich card message (LINE).",
        acceptsArgs: true,
        requireAuth: false,
        handler: function (ctx) { return __awaiter(_this, void 0, void 0, function () {
            var argsStr, parsed, type, args, flags, fallbackText, _a, title, _b, body, footer, bubble, _c, title, _d, caption, imageUrl, bubble, _e, title, _f, body, actions, bubble, _g, title, _h, itemsStr, items, bubble, _j, title, _k, itemsStr, items, total, footer, bubble, _l, question, yesStr, noStr, _m, yesLabel, yesData, _o, noLabel, noData, _p, title, _q, text, actionsStr, actionParts, templateActions;
            var _r, _s;
            return __generator(this, function (_t) {
                argsStr = (_s = (_r = ctx.args) === null || _r === void 0 ? void 0 : _r.trim()) !== null && _s !== void 0 ? _s : "";
                if (!argsStr) {
                    return [2 /*return*/, { text: CARD_USAGE }];
                }
                parsed = parseCardArgs(argsStr);
                type = parsed.type, args = parsed.args, flags = parsed.flags;
                if (!type) {
                    return [2 /*return*/, { text: CARD_USAGE }];
                }
                // Only LINE supports rich cards; fallback to text elsewhere.
                if (ctx.channel !== "line") {
                    fallbackText = args.join(" - ");
                    return [2 /*return*/, { text: "[".concat(type, " card] ").concat(fallbackText).trim() }];
                }
                try {
                    switch (type) {
                        case "info": {
                            _a = args[0], title = _a === void 0 ? "Info" : _a, _b = args[1], body = _b === void 0 ? "" : _b, footer = args[2];
                            bubble = (0, plugin_sdk_1.createInfoCard)(title, body, footer);
                            return [2 /*return*/, buildLineReply({
                                    flexMessage: {
                                        altText: "".concat(title, ": ").concat(body).slice(0, 400),
                                        contents: bubble,
                                    },
                                })];
                        }
                        case "image": {
                            _c = args[0], title = _c === void 0 ? "Image" : _c, _d = args[1], caption = _d === void 0 ? "" : _d;
                            imageUrl = flags.url || flags.image;
                            if (!imageUrl) {
                                return [2 /*return*/, { text: "Error: Image card requires --url <image-url>" }];
                            }
                            bubble = (0, plugin_sdk_1.createImageCard)(imageUrl, title, caption);
                            return [2 /*return*/, buildLineReply({
                                    flexMessage: {
                                        altText: "".concat(title, ": ").concat(caption).slice(0, 400),
                                        contents: bubble,
                                    },
                                })];
                        }
                        case "action": {
                            _e = args[0], title = _e === void 0 ? "Actions" : _e, _f = args[1], body = _f === void 0 ? "" : _f;
                            actions = parseActions(flags.actions);
                            if (actions.length === 0) {
                                return [2 /*return*/, { text: 'Error: Action card requires --actions "Label1|data1,Label2|data2"' }];
                            }
                            bubble = (0, plugin_sdk_1.createActionCard)(title, body, actions, {
                                imageUrl: flags.url || flags.image,
                            });
                            return [2 /*return*/, buildLineReply({
                                    flexMessage: {
                                        altText: "".concat(title, ": ").concat(body).slice(0, 400),
                                        contents: bubble,
                                    },
                                })];
                        }
                        case "list": {
                            _g = args[0], title = _g === void 0 ? "List" : _g, _h = args[1], itemsStr = _h === void 0 ? "" : _h;
                            items = parseListItems(itemsStr || flags.items || "");
                            if (items.length === 0) {
                                return [2 /*return*/, {
                                        text: 'Error: List card requires items. Usage: /card list "Title" "Item1|Desc1,Item2|Desc2"',
                                    }];
                            }
                            bubble = (0, plugin_sdk_1.createListCard)(title, items);
                            return [2 /*return*/, buildLineReply({
                                    flexMessage: {
                                        altText: "".concat(title, ": ").concat(items.map(function (i) { return i.title; }).join(", ")).slice(0, 400),
                                        contents: bubble,
                                    },
                                })];
                        }
                        case "receipt": {
                            _j = args[0], title = _j === void 0 ? "Receipt" : _j, _k = args[1], itemsStr = _k === void 0 ? "" : _k;
                            items = parseReceiptItems(itemsStr || flags.items || "");
                            total = flags.total ? { label: "Total", value: flags.total } : undefined;
                            footer = flags.footer;
                            if (items.length === 0) {
                                return [2 /*return*/, {
                                        text: 'Error: Receipt card requires items. Usage: /card receipt "Title" "Item1:$10,Item2:$20" --total "$30"',
                                    }];
                            }
                            bubble = (0, plugin_sdk_1.createReceiptCard)({ title: title, items: items, total: total, footer: footer });
                            return [2 /*return*/, buildLineReply({
                                    flexMessage: {
                                        altText: "".concat(title, ": ").concat(items.map(function (i) { return "".concat(i.name, " ").concat(i.value); }).join(", ")).slice(0, 400),
                                        contents: bubble,
                                    },
                                })];
                        }
                        case "confirm": {
                            _l = args[0], question = _l === void 0 ? "Confirm?" : _l;
                            yesStr = flags.yes || "Yes|yes";
                            noStr = flags.no || "No|no";
                            _m = yesStr.split("|").map(function (s) { return s.trim(); }), yesLabel = _m[0], yesData = _m[1];
                            _o = noStr.split("|").map(function (s) { return s.trim(); }), noLabel = _o[0], noData = _o[1];
                            return [2 /*return*/, buildLineReply({
                                    templateMessage: {
                                        type: "confirm",
                                        text: question,
                                        confirmLabel: yesLabel || "Yes",
                                        confirmData: yesData || "yes",
                                        cancelLabel: noLabel || "No",
                                        cancelData: noData || "no",
                                        altText: question,
                                    },
                                })];
                        }
                        case "buttons": {
                            _p = args[0], title = _p === void 0 ? "Menu" : _p, _q = args[1], text = _q === void 0 ? "Choose an option" : _q;
                            actionsStr = flags.actions || "";
                            actionParts = parseActions(actionsStr);
                            if (actionParts.length === 0) {
                                return [2 /*return*/, { text: 'Error: Buttons card requires --actions "Label1|data1,Label2|data2"' }];
                            }
                            templateActions = actionParts.map(function (a) {
                                var _a;
                                var action = a.action;
                                var label = (_a = action.label) !== null && _a !== void 0 ? _a : a.label;
                                if (action.type === "uri") {
                                    return { type: "uri", label: label, uri: action.uri };
                                }
                                if (action.type === "postback") {
                                    return {
                                        type: "postback",
                                        label: label,
                                        data: action.data,
                                    };
                                }
                                return {
                                    type: "message",
                                    label: label,
                                    data: action.text,
                                };
                            });
                            return [2 /*return*/, buildLineReply({
                                    templateMessage: {
                                        type: "buttons",
                                        title: title,
                                        text: text,
                                        thumbnailImageUrl: flags.url || flags.image,
                                        actions: templateActions,
                                    },
                                })];
                        }
                        default:
                            return [2 /*return*/, {
                                    text: "Unknown card type: \"".concat(type, "\". Available types: info, image, action, list, receipt, confirm, buttons"),
                                }];
                    }
                }
                catch (err) {
                    return [2 /*return*/, { text: "Error creating card: ".concat(String(err)) }];
                }
                return [2 /*return*/];
            });
        }); },
    });
}
