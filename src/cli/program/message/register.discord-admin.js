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
exports.registerMessageDiscordAdminCommands = registerMessageDiscordAdminCommands;
function registerMessageDiscordAdminCommands(message, helpers) {
    var _this = this;
    var role = message.command("role").description("Role actions");
    helpers
        .withMessageBase(role.command("info").description("List roles").requiredOption("--guild-id <id>", "Guild id"))
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, helpers.runMessageAction("role-info", opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    helpers
        .withMessageBase(role
        .command("add")
        .description("Add role to a member")
        .requiredOption("--guild-id <id>", "Guild id")
        .requiredOption("--user-id <id>", "User id")
        .requiredOption("--role-id <id>", "Role id"))
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, helpers.runMessageAction("role-add", opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    helpers
        .withMessageBase(role
        .command("remove")
        .description("Remove role from a member")
        .requiredOption("--guild-id <id>", "Guild id")
        .requiredOption("--user-id <id>", "User id")
        .requiredOption("--role-id <id>", "Role id"))
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, helpers.runMessageAction("role-remove", opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var channel = message.command("channel").description("Channel actions");
    helpers
        .withMessageBase(helpers.withRequiredMessageTarget(channel.command("info").description("Fetch channel info")))
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, helpers.runMessageAction("channel-info", opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    helpers
        .withMessageBase(channel
        .command("list")
        .description("List channels")
        .requiredOption("--guild-id <id>", "Guild id"))
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, helpers.runMessageAction("channel-list", opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var member = message.command("member").description("Member actions");
    helpers
        .withMessageBase(member
        .command("info")
        .description("Fetch member info")
        .requiredOption("--user-id <id>", "User id"))
        .option("--guild-id <id>", "Guild id (Discord)")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, helpers.runMessageAction("member-info", opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var voice = message.command("voice").description("Voice actions");
    helpers
        .withMessageBase(voice
        .command("status")
        .description("Fetch voice status")
        .requiredOption("--guild-id <id>", "Guild id")
        .requiredOption("--user-id <id>", "User id"))
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, helpers.runMessageAction("voice-status", opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var event = message.command("event").description("Event actions");
    helpers
        .withMessageBase(event
        .command("list")
        .description("List scheduled events")
        .requiredOption("--guild-id <id>", "Guild id"))
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, helpers.runMessageAction("event-list", opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    helpers
        .withMessageBase(event
        .command("create")
        .description("Create a scheduled event")
        .requiredOption("--guild-id <id>", "Guild id")
        .requiredOption("--event-name <name>", "Event name")
        .requiredOption("--start-time <iso>", "Event start time"))
        .option("--end-time <iso>", "Event end time")
        .option("--desc <text>", "Event description")
        .option("--channel-id <id>", "Channel id")
        .option("--location <text>", "Event location")
        .option("--event-type <stage|external|voice>", "Event type")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, helpers.runMessageAction("event-create", opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    helpers
        .withMessageBase(message
        .command("timeout")
        .description("Timeout a member")
        .requiredOption("--guild-id <id>", "Guild id")
        .requiredOption("--user-id <id>", "User id"))
        .option("--duration-min <n>", "Timeout duration minutes")
        .option("--until <iso>", "Timeout until")
        .option("--reason <text>", "Moderation reason")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, helpers.runMessageAction("timeout", opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    helpers
        .withMessageBase(message
        .command("kick")
        .description("Kick a member")
        .requiredOption("--guild-id <id>", "Guild id")
        .requiredOption("--user-id <id>", "User id"))
        .option("--reason <text>", "Moderation reason")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, helpers.runMessageAction("kick", opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    helpers
        .withMessageBase(message
        .command("ban")
        .description("Ban a member")
        .requiredOption("--guild-id <id>", "Guild id")
        .requiredOption("--user-id <id>", "User id"))
        .option("--reason <text>", "Moderation reason")
        .option("--delete-days <n>", "Ban delete message days")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, helpers.runMessageAction("ban", opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
