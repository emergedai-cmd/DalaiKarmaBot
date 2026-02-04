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
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreGatewayHandlers = void 0;
exports.handleGatewayRequest = handleGatewayRequest;
var index_js_1 = require("./protocol/index.js");
var agent_js_1 = require("./server-methods/agent.js");
var agents_js_1 = require("./server-methods/agents.js");
var browser_js_1 = require("./server-methods/browser.js");
var channels_js_1 = require("./server-methods/channels.js");
var chat_js_1 = require("./server-methods/chat.js");
var config_js_1 = require("./server-methods/config.js");
var connect_js_1 = require("./server-methods/connect.js");
var cron_js_1 = require("./server-methods/cron.js");
var devices_js_1 = require("./server-methods/devices.js");
var exec_approvals_js_1 = require("./server-methods/exec-approvals.js");
var health_js_1 = require("./server-methods/health.js");
var logs_js_1 = require("./server-methods/logs.js");
var models_js_1 = require("./server-methods/models.js");
var nodes_js_1 = require("./server-methods/nodes.js");
var send_js_1 = require("./server-methods/send.js");
var sessions_js_1 = require("./server-methods/sessions.js");
var skills_js_1 = require("./server-methods/skills.js");
var system_js_1 = require("./server-methods/system.js");
var talk_js_1 = require("./server-methods/talk.js");
var tts_js_1 = require("./server-methods/tts.js");
var update_js_1 = require("./server-methods/update.js");
var usage_js_1 = require("./server-methods/usage.js");
var voicewake_js_1 = require("./server-methods/voicewake.js");
var web_js_1 = require("./server-methods/web.js");
var wizard_js_1 = require("./server-methods/wizard.js");
var ADMIN_SCOPE = "operator.admin";
var READ_SCOPE = "operator.read";
var WRITE_SCOPE = "operator.write";
var APPROVALS_SCOPE = "operator.approvals";
var PAIRING_SCOPE = "operator.pairing";
var APPROVAL_METHODS = new Set(["exec.approval.request", "exec.approval.resolve"]);
var NODE_ROLE_METHODS = new Set(["node.invoke.result", "node.event", "skills.bins"]);
var PAIRING_METHODS = new Set([
    "node.pair.request",
    "node.pair.list",
    "node.pair.approve",
    "node.pair.reject",
    "node.pair.verify",
    "device.pair.list",
    "device.pair.approve",
    "device.pair.reject",
    "device.token.rotate",
    "device.token.revoke",
    "node.rename",
]);
var ADMIN_METHOD_PREFIXES = ["exec.approvals."];
var READ_METHODS = new Set([
    "health",
    "logs.tail",
    "channels.status",
    "status",
    "usage.status",
    "usage.cost",
    "tts.status",
    "tts.providers",
    "models.list",
    "agents.list",
    "agent.identity.get",
    "skills.status",
    "voicewake.get",
    "sessions.list",
    "sessions.preview",
    "cron.list",
    "cron.status",
    "cron.runs",
    "system-presence",
    "last-heartbeat",
    "node.list",
    "node.describe",
    "chat.history",
]);
var WRITE_METHODS = new Set([
    "send",
    "agent",
    "agent.wait",
    "wake",
    "talk.mode",
    "tts.enable",
    "tts.disable",
    "tts.convert",
    "tts.setProvider",
    "voicewake.set",
    "node.invoke",
    "chat.send",
    "chat.abort",
    "browser.request",
]);
function authorizeGatewayMethod(method, client) {
    var _a, _b;
    if (!(client === null || client === void 0 ? void 0 : client.connect)) {
        return null;
    }
    var role = (_a = client.connect.role) !== null && _a !== void 0 ? _a : "operator";
    var scopes = (_b = client.connect.scopes) !== null && _b !== void 0 ? _b : [];
    if (NODE_ROLE_METHODS.has(method)) {
        if (role === "node") {
            return null;
        }
        return (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "unauthorized role: ".concat(role));
    }
    if (role === "node") {
        return (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "unauthorized role: ".concat(role));
    }
    if (role !== "operator") {
        return (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "unauthorized role: ".concat(role));
    }
    if (scopes.includes(ADMIN_SCOPE)) {
        return null;
    }
    if (APPROVAL_METHODS.has(method) && !scopes.includes(APPROVALS_SCOPE)) {
        return (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "missing scope: operator.approvals");
    }
    if (PAIRING_METHODS.has(method) && !scopes.includes(PAIRING_SCOPE)) {
        return (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "missing scope: operator.pairing");
    }
    if (READ_METHODS.has(method) && !(scopes.includes(READ_SCOPE) || scopes.includes(WRITE_SCOPE))) {
        return (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "missing scope: operator.read");
    }
    if (WRITE_METHODS.has(method) && !scopes.includes(WRITE_SCOPE)) {
        return (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "missing scope: operator.write");
    }
    if (APPROVAL_METHODS.has(method)) {
        return null;
    }
    if (PAIRING_METHODS.has(method)) {
        return null;
    }
    if (READ_METHODS.has(method)) {
        return null;
    }
    if (WRITE_METHODS.has(method)) {
        return null;
    }
    if (ADMIN_METHOD_PREFIXES.some(function (prefix) { return method.startsWith(prefix); })) {
        return (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "missing scope: operator.admin");
    }
    if (method.startsWith("config.") ||
        method.startsWith("wizard.") ||
        method.startsWith("update.") ||
        method === "channels.logout" ||
        method === "skills.install" ||
        method === "skills.update" ||
        method === "cron.add" ||
        method === "cron.update" ||
        method === "cron.remove" ||
        method === "cron.run" ||
        method === "sessions.patch" ||
        method === "sessions.reset" ||
        method === "sessions.delete" ||
        method === "sessions.compact") {
        return (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "missing scope: operator.admin");
    }
    return (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "missing scope: operator.admin");
}
exports.coreGatewayHandlers = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, connect_js_1.connectHandlers), logs_js_1.logsHandlers), voicewake_js_1.voicewakeHandlers), health_js_1.healthHandlers), channels_js_1.channelsHandlers), chat_js_1.chatHandlers), cron_js_1.cronHandlers), devices_js_1.deviceHandlers), exec_approvals_js_1.execApprovalsHandlers), web_js_1.webHandlers), models_js_1.modelsHandlers), config_js_1.configHandlers), wizard_js_1.wizardHandlers), talk_js_1.talkHandlers), tts_js_1.ttsHandlers), skills_js_1.skillsHandlers), sessions_js_1.sessionsHandlers), system_js_1.systemHandlers), update_js_1.updateHandlers), nodes_js_1.nodeHandlers), send_js_1.sendHandlers), usage_js_1.usageHandlers), agent_js_1.agentHandlers), agents_js_1.agentsHandlers), browser_js_1.browserHandlers);
function handleGatewayRequest(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var req, respond, client, isWebchatConnect, context, authError, handler;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    req = opts.req, respond = opts.respond, client = opts.client, isWebchatConnect = opts.isWebchatConnect, context = opts.context;
                    authError = authorizeGatewayMethod(req.method, client);
                    if (authError) {
                        respond(false, undefined, authError);
                        return [2 /*return*/];
                    }
                    handler = (_b = (_a = opts.extraHandlers) === null || _a === void 0 ? void 0 : _a[req.method]) !== null && _b !== void 0 ? _b : exports.coreGatewayHandlers[req.method];
                    if (!handler) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "unknown method: ".concat(req.method)));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, handler({
                            req: req,
                            params: ((_c = req.params) !== null && _c !== void 0 ? _c : {}),
                            client: client,
                            isWebchatConnect: isWebchatConnect,
                            respond: respond,
                            context: context,
                        })];
                case 1:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
}
