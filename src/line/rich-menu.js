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
exports.createRichMenu = createRichMenu;
exports.uploadRichMenuImage = uploadRichMenuImage;
exports.setDefaultRichMenu = setDefaultRichMenu;
exports.cancelDefaultRichMenu = cancelDefaultRichMenu;
exports.getDefaultRichMenuId = getDefaultRichMenuId;
exports.linkRichMenuToUser = linkRichMenuToUser;
exports.linkRichMenuToUsers = linkRichMenuToUsers;
exports.unlinkRichMenuFromUser = unlinkRichMenuFromUser;
exports.unlinkRichMenuFromUsers = unlinkRichMenuFromUsers;
exports.getRichMenuIdOfUser = getRichMenuIdOfUser;
exports.getRichMenuList = getRichMenuList;
exports.getRichMenu = getRichMenu;
exports.deleteRichMenu = deleteRichMenu;
exports.createRichMenuAlias = createRichMenuAlias;
exports.deleteRichMenuAlias = deleteRichMenuAlias;
exports.createGridLayout = createGridLayout;
exports.messageAction = messageAction;
exports.uriAction = uriAction;
exports.postbackAction = postbackAction;
exports.datetimePickerAction = datetimePickerAction;
exports.createDefaultMenuConfig = createDefaultMenuConfig;
var bot_sdk_1 = require("@line/bot-sdk");
var promises_1 = require("node:fs/promises");
var config_js_1 = require("../config/config.js");
var globals_js_1 = require("../globals.js");
var accounts_js_1 = require("./accounts.js");
function resolveToken(explicit, params) {
    if (explicit === null || explicit === void 0 ? void 0 : explicit.trim()) {
        return explicit.trim();
    }
    if (!params.channelAccessToken) {
        throw new Error("LINE channel access token missing for account \"".concat(params.accountId, "\" (set channels.line.channelAccessToken or LINE_CHANNEL_ACCESS_TOKEN)."));
    }
    return params.channelAccessToken.trim();
}
function getClient(opts) {
    if (opts === void 0) { opts = {}; }
    var cfg = (0, config_js_1.loadConfig)();
    var account = (0, accounts_js_1.resolveLineAccount)({
        cfg: cfg,
        accountId: opts.accountId,
    });
    var token = resolveToken(opts.channelAccessToken, account);
    return new bot_sdk_1.messagingApi.MessagingApiClient({
        channelAccessToken: token,
    });
}
function getBlobClient(opts) {
    if (opts === void 0) { opts = {}; }
    var cfg = (0, config_js_1.loadConfig)();
    var account = (0, accounts_js_1.resolveLineAccount)({
        cfg: cfg,
        accountId: opts.accountId,
    });
    var token = resolveToken(opts.channelAccessToken, account);
    return new bot_sdk_1.messagingApi.MessagingApiBlobClient({
        channelAccessToken: token,
    });
}
/**
 * Create a new rich menu
 * @returns The rich menu ID
 */
function createRichMenu(menu_1) {
    return __awaiter(this, arguments, void 0, function (menu, opts) {
        var client, richMenuRequest, response;
        var _a;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    client = getClient(opts);
                    richMenuRequest = {
                        size: menu.size,
                        selected: (_a = menu.selected) !== null && _a !== void 0 ? _a : false,
                        name: menu.name.slice(0, 300), // LINE limit
                        chatBarText: menu.chatBarText.slice(0, 14), // LINE limit
                        areas: menu.areas,
                    };
                    return [4 /*yield*/, client.createRichMenu(richMenuRequest)];
                case 1:
                    response = _b.sent();
                    if (opts.verbose) {
                        (0, globals_js_1.logVerbose)("line: created rich menu ".concat(response.richMenuId));
                    }
                    return [2 /*return*/, response.richMenuId];
            }
        });
    });
}
/**
 * Upload an image for a rich menu
 * Image requirements:
 * - Format: JPEG or PNG
 * - Size: Must match the rich menu size (2500x1686 or 2500x843)
 * - Max file size: 1MB
 */
function uploadRichMenuImage(richMenuId_1, imagePath_1) {
    return __awaiter(this, arguments, void 0, function (richMenuId, imagePath, opts) {
        var blobClient, imageData, contentType;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blobClient = getBlobClient(opts);
                    return [4 /*yield*/, (0, promises_1.readFile)(imagePath)];
                case 1:
                    imageData = _a.sent();
                    contentType = imagePath.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
                    return [4 /*yield*/, blobClient.setRichMenuImage(richMenuId, new Blob([imageData], { type: contentType }))];
                case 2:
                    _a.sent();
                    if (opts.verbose) {
                        (0, globals_js_1.logVerbose)("line: uploaded image to rich menu ".concat(richMenuId));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Set the default rich menu for all users
 */
function setDefaultRichMenu(richMenuId_1) {
    return __awaiter(this, arguments, void 0, function (richMenuId, opts) {
        var client;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = getClient(opts);
                    return [4 /*yield*/, client.setDefaultRichMenu(richMenuId)];
                case 1:
                    _a.sent();
                    if (opts.verbose) {
                        (0, globals_js_1.logVerbose)("line: set default rich menu to ".concat(richMenuId));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Cancel the default rich menu
 */
function cancelDefaultRichMenu() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var client;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = getClient(opts);
                    return [4 /*yield*/, client.cancelDefaultRichMenu()];
                case 1:
                    _a.sent();
                    if (opts.verbose) {
                        (0, globals_js_1.logVerbose)("line: cancelled default rich menu");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Get the default rich menu ID
 */
function getDefaultRichMenuId() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var client, response, _a;
        var _b;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    client = getClient(opts);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.getDefaultRichMenuId()];
                case 2:
                    response = _c.sent();
                    return [2 /*return*/, (_b = response.richMenuId) !== null && _b !== void 0 ? _b : null];
                case 3:
                    _a = _c.sent();
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Link a rich menu to a specific user
 */
function linkRichMenuToUser(userId_1, richMenuId_1) {
    return __awaiter(this, arguments, void 0, function (userId, richMenuId, opts) {
        var client;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = getClient(opts);
                    return [4 /*yield*/, client.linkRichMenuIdToUser(userId, richMenuId)];
                case 1:
                    _a.sent();
                    if (opts.verbose) {
                        (0, globals_js_1.logVerbose)("line: linked rich menu ".concat(richMenuId, " to user ").concat(userId));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Link a rich menu to multiple users (up to 500)
 */
function linkRichMenuToUsers(userIds_1, richMenuId_1) {
    return __awaiter(this, arguments, void 0, function (userIds, richMenuId, opts) {
        var client, batches, i, _i, batches_1, batch;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = getClient(opts);
                    batches = [];
                    for (i = 0; i < userIds.length; i += 500) {
                        batches.push(userIds.slice(i, i + 500));
                    }
                    _i = 0, batches_1 = batches;
                    _a.label = 1;
                case 1:
                    if (!(_i < batches_1.length)) return [3 /*break*/, 4];
                    batch = batches_1[_i];
                    return [4 /*yield*/, client.linkRichMenuIdToUsers({
                            richMenuId: richMenuId,
                            userIds: batch,
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (opts.verbose) {
                        (0, globals_js_1.logVerbose)("line: linked rich menu ".concat(richMenuId, " to ").concat(userIds.length, " users"));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Unlink a rich menu from a specific user
 */
function unlinkRichMenuFromUser(userId_1) {
    return __awaiter(this, arguments, void 0, function (userId, opts) {
        var client;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = getClient(opts);
                    return [4 /*yield*/, client.unlinkRichMenuIdFromUser(userId)];
                case 1:
                    _a.sent();
                    if (opts.verbose) {
                        (0, globals_js_1.logVerbose)("line: unlinked rich menu from user ".concat(userId));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Unlink rich menus from multiple users (up to 500)
 */
function unlinkRichMenuFromUsers(userIds_1) {
    return __awaiter(this, arguments, void 0, function (userIds, opts) {
        var client, batches, i, _i, batches_2, batch;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = getClient(opts);
                    batches = [];
                    for (i = 0; i < userIds.length; i += 500) {
                        batches.push(userIds.slice(i, i + 500));
                    }
                    _i = 0, batches_2 = batches;
                    _a.label = 1;
                case 1:
                    if (!(_i < batches_2.length)) return [3 /*break*/, 4];
                    batch = batches_2[_i];
                    return [4 /*yield*/, client.unlinkRichMenuIdFromUsers({
                            userIds: batch,
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (opts.verbose) {
                        (0, globals_js_1.logVerbose)("line: unlinked rich menu from ".concat(userIds.length, " users"));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Get the rich menu linked to a specific user
 */
function getRichMenuIdOfUser(userId_1) {
    return __awaiter(this, arguments, void 0, function (userId, opts) {
        var client, response, _a;
        var _b;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    client = getClient(opts);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.getRichMenuIdOfUser(userId)];
                case 2:
                    response = _c.sent();
                    return [2 /*return*/, (_b = response.richMenuId) !== null && _b !== void 0 ? _b : null];
                case 3:
                    _a = _c.sent();
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get a list of all rich menus
 */
function getRichMenuList() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var client, response;
        var _a;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    client = getClient(opts);
                    return [4 /*yield*/, client.getRichMenuList()];
                case 1:
                    response = _b.sent();
                    return [2 /*return*/, (_a = response.richmenus) !== null && _a !== void 0 ? _a : []];
            }
        });
    });
}
/**
 * Get a specific rich menu by ID
 */
function getRichMenu(richMenuId_1) {
    return __awaiter(this, arguments, void 0, function (richMenuId, opts) {
        var client, _a;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    client = getClient(opts);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.getRichMenu(richMenuId)];
                case 2: return [2 /*return*/, _b.sent()];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Delete a rich menu
 */
function deleteRichMenu(richMenuId_1) {
    return __awaiter(this, arguments, void 0, function (richMenuId, opts) {
        var client;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = getClient(opts);
                    return [4 /*yield*/, client.deleteRichMenu(richMenuId)];
                case 1:
                    _a.sent();
                    if (opts.verbose) {
                        (0, globals_js_1.logVerbose)("line: deleted rich menu ".concat(richMenuId));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Create a rich menu alias
 */
function createRichMenuAlias(richMenuId_1, aliasId_1) {
    return __awaiter(this, arguments, void 0, function (richMenuId, aliasId, opts) {
        var client;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = getClient(opts);
                    return [4 /*yield*/, client.createRichMenuAlias({
                            richMenuId: richMenuId,
                            richMenuAliasId: aliasId,
                        })];
                case 1:
                    _a.sent();
                    if (opts.verbose) {
                        (0, globals_js_1.logVerbose)("line: created alias ".concat(aliasId, " for rich menu ").concat(richMenuId));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Delete a rich menu alias
 */
function deleteRichMenuAlias(aliasId_1) {
    return __awaiter(this, arguments, void 0, function (aliasId, opts) {
        var client;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = getClient(opts);
                    return [4 /*yield*/, client.deleteRichMenuAlias(aliasId)];
                case 1:
                    _a.sent();
                    if (opts.verbose) {
                        (0, globals_js_1.logVerbose)("line: deleted alias ".concat(aliasId));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// Default Menu Template Helpers
// ============================================================================
/**
 * Create a standard 2x3 grid layout for rich menu areas
 * Returns 6 areas in a 2-row, 3-column layout
 */
function createGridLayout(height, actions) {
    var colWidth = Math.floor(2500 / 3);
    var rowHeight = Math.floor(height / 2);
    return [
        // Top row
        { bounds: { x: 0, y: 0, width: colWidth, height: rowHeight }, action: actions[0] },
        { bounds: { x: colWidth, y: 0, width: colWidth, height: rowHeight }, action: actions[1] },
        { bounds: { x: colWidth * 2, y: 0, width: colWidth, height: rowHeight }, action: actions[2] },
        // Bottom row
        { bounds: { x: 0, y: rowHeight, width: colWidth, height: rowHeight }, action: actions[3] },
        {
            bounds: { x: colWidth, y: rowHeight, width: colWidth, height: rowHeight },
            action: actions[4],
        },
        {
            bounds: { x: colWidth * 2, y: rowHeight, width: colWidth, height: rowHeight },
            action: actions[5],
        },
    ];
}
/**
 * Create a message action (sends text when tapped)
 */
function messageAction(label, text) {
    return {
        type: "message",
        label: label.slice(0, 20),
        text: text !== null && text !== void 0 ? text : label,
    };
}
/**
 * Create a URI action (opens a URL when tapped)
 */
function uriAction(label, uri) {
    return {
        type: "uri",
        label: label.slice(0, 20),
        uri: uri,
    };
}
/**
 * Create a postback action (sends data to webhook when tapped)
 */
function postbackAction(label, data, displayText) {
    return {
        type: "postback",
        label: label.slice(0, 20),
        data: data.slice(0, 300),
        displayText: displayText === null || displayText === void 0 ? void 0 : displayText.slice(0, 300),
    };
}
/**
 * Create a datetime picker action
 */
function datetimePickerAction(label, data, mode, options) {
    return {
        type: "datetimepicker",
        label: label.slice(0, 20),
        data: data.slice(0, 300),
        mode: mode,
        initial: options === null || options === void 0 ? void 0 : options.initial,
        max: options === null || options === void 0 ? void 0 : options.max,
        min: options === null || options === void 0 ? void 0 : options.min,
    };
}
/**
 * Create a default help/status/settings menu
 * This is a convenience function to quickly set up a standard menu
 */
function createDefaultMenuConfig() {
    return {
        size: { width: 2500, height: 843 },
        selected: false,
        name: "Default Menu",
        chatBarText: "Menu",
        areas: createGridLayout(843, [
            messageAction("Help", "/help"),
            messageAction("Status", "/status"),
            messageAction("Settings", "/settings"),
            messageAction("About", "/about"),
            messageAction("Feedback", "/feedback"),
            messageAction("Contact", "/contact"),
        ]),
    };
}
