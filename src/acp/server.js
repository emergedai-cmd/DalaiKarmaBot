#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveAcpGateway = serveAcpGateway;
var sdk_1 = require("@agentclientprotocol/sdk");
var node_stream_1 = require("node:stream");
var node_url_1 = require("node:url");
var config_js_1 = require("../config/config.js");
var auth_js_1 = require("../gateway/auth.js");
var call_js_1 = require("../gateway/call.js");
var client_js_1 = require("../gateway/client.js");
var is_main_js_1 = require("../infra/is-main.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var translator_js_1 = require("./translator.js");
function serveAcpGateway(opts) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    if (opts === void 0) { opts = {}; }
    var cfg = (0, config_js_1.loadConfig)();
    var connection = (0, call_js_1.buildGatewayConnectionDetails)({
        config: cfg,
        url: opts.gatewayUrl,
    });
    var isRemoteMode = ((_a = cfg.gateway) === null || _a === void 0 ? void 0 : _a.mode) === "remote";
    var remote = isRemoteMode ? (_b = cfg.gateway) === null || _b === void 0 ? void 0 : _b.remote : undefined;
    var auth = (0, auth_js_1.resolveGatewayAuth)({ authConfig: (_c = cfg.gateway) === null || _c === void 0 ? void 0 : _c.auth, env: process.env });
    var token = (_g = (_f = (_d = opts.gatewayToken) !== null && _d !== void 0 ? _d : (isRemoteMode ? (_e = remote === null || remote === void 0 ? void 0 : remote.token) === null || _e === void 0 ? void 0 : _e.trim() : undefined)) !== null && _f !== void 0 ? _f : process.env.OPENCLAW_GATEWAY_TOKEN) !== null && _g !== void 0 ? _g : auth.token;
    var password = (_l = (_k = (_h = opts.gatewayPassword) !== null && _h !== void 0 ? _h : (isRemoteMode ? (_j = remote === null || remote === void 0 ? void 0 : remote.password) === null || _j === void 0 ? void 0 : _j.trim() : undefined)) !== null && _k !== void 0 ? _k : process.env.OPENCLAW_GATEWAY_PASSWORD) !== null && _l !== void 0 ? _l : auth.password;
    var agent = null;
    var gateway = new client_js_1.GatewayClient({
        url: connection.url,
        token: token || undefined,
        password: password || undefined,
        clientName: message_channel_js_1.GATEWAY_CLIENT_NAMES.CLI,
        clientDisplayName: "ACP",
        clientVersion: "acp",
        mode: message_channel_js_1.GATEWAY_CLIENT_MODES.CLI,
        onEvent: function (evt) {
            void (agent === null || agent === void 0 ? void 0 : agent.handleGatewayEvent(evt));
        },
        onHelloOk: function () {
            agent === null || agent === void 0 ? void 0 : agent.handleGatewayReconnect();
        },
        onClose: function (code, reason) {
            agent === null || agent === void 0 ? void 0 : agent.handleGatewayDisconnect("".concat(code, ": ").concat(reason));
        },
    });
    var input = node_stream_1.Writable.toWeb(process.stdout);
    var output = node_stream_1.Readable.toWeb(process.stdin);
    var stream = (0, sdk_1.ndJsonStream)(input, output);
    new sdk_1.AgentSideConnection(function (conn) {
        agent = new translator_js_1.AcpGatewayAgent(conn, gateway, opts);
        agent.start();
        return agent;
    }, stream);
    gateway.start();
}
function parseArgs(args) {
    var opts = {};
    for (var i = 0; i < args.length; i += 1) {
        var arg = args[i];
        if (arg === "--url" || arg === "--gateway-url") {
            opts.gatewayUrl = args[i + 1];
            i += 1;
            continue;
        }
        if (arg === "--token" || arg === "--gateway-token") {
            opts.gatewayToken = args[i + 1];
            i += 1;
            continue;
        }
        if (arg === "--password" || arg === "--gateway-password") {
            opts.gatewayPassword = args[i + 1];
            i += 1;
            continue;
        }
        if (arg === "--session") {
            opts.defaultSessionKey = args[i + 1];
            i += 1;
            continue;
        }
        if (arg === "--session-label") {
            opts.defaultSessionLabel = args[i + 1];
            i += 1;
            continue;
        }
        if (arg === "--require-existing") {
            opts.requireExistingSession = true;
            continue;
        }
        if (arg === "--reset-session") {
            opts.resetSession = true;
            continue;
        }
        if (arg === "--no-prefix-cwd") {
            opts.prefixCwd = false;
            continue;
        }
        if (arg === "--verbose" || arg === "-v") {
            opts.verbose = true;
            continue;
        }
        if (arg === "--help" || arg === "-h") {
            printHelp();
            process.exit(0);
        }
    }
    return opts;
}
function printHelp() {
    console.log("Usage: openclaw acp [options]\n\nGateway-backed ACP server for IDE integration.\n\nOptions:\n  --url <url>             Gateway WebSocket URL\n  --token <token>         Gateway auth token\n  --password <password>   Gateway auth password\n  --session <key>         Default session key (e.g. \"agent:main:main\")\n  --session-label <label> Default session label to resolve\n  --require-existing      Fail if the session key/label does not exist\n  --reset-session         Reset the session key before first use\n  --no-prefix-cwd         Do not prefix prompts with the working directory\n  --verbose, -v           Verbose logging to stderr\n  --help, -h              Show this help message\n");
}
if ((0, is_main_js_1.isMainModule)({ currentFile: (0, node_url_1.fileURLToPath)(import.meta.url) })) {
    var opts = parseArgs(process.argv.slice(2));
    serveAcpGateway(opts);
}
