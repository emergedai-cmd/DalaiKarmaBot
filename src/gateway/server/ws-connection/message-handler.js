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
exports.attachGatewayWsMessageHandler = attachGatewayWsMessageHandler;
var node_os_1 = require("node:os");
var config_js_1 = require("../../../config/config.js");
var device_identity_js_1 = require("../../../infra/device-identity.js");
var device_pairing_js_1 = require("../../../infra/device-pairing.js");
var node_pairing_js_1 = require("../../../infra/node-pairing.js");
var skills_remote_js_1 = require("../../../infra/skills-remote.js");
var system_presence_js_1 = require("../../../infra/system-presence.js");
var voicewake_js_1 = require("../../../infra/voicewake.js");
var ws_js_1 = require("../../../infra/ws.js");
var message_channel_js_1 = require("../../../utils/message-channel.js");
var auth_js_1 = require("../../auth.js");
var device_auth_js_1 = require("../../device-auth.js");
var net_js_1 = require("../../net.js");
var node_command_policy_js_1 = require("../../node-command-policy.js");
var client_info_js_1 = require("../../protocol/client-info.js");
var index_js_1 = require("../../protocol/index.js");
var server_constants_js_1 = require("../../server-constants.js");
var server_methods_js_1 = require("../../server-methods.js");
var server_utils_js_1 = require("../../server-utils.js");
var ws_log_js_1 = require("../../ws-log.js");
var close_reason_js_1 = require("../close-reason.js");
var health_state_js_1 = require("../health-state.js");
var DEVICE_SIGNATURE_SKEW_MS = 10 * 60 * 1000;
function resolveHostName(hostHeader) {
    var host = (hostHeader !== null && hostHeader !== void 0 ? hostHeader : "").trim().toLowerCase();
    if (!host) {
        return "";
    }
    if (host.startsWith("[")) {
        var end = host.indexOf("]");
        if (end !== -1) {
            return host.slice(1, end);
        }
    }
    var name = host.split(":")[0];
    return name !== null && name !== void 0 ? name : "";
}
function formatGatewayAuthFailureMessage(params) {
    var authMode = params.authMode, authProvided = params.authProvided, reason = params.reason, client = params.client;
    var isCli = (0, message_channel_js_1.isGatewayCliClient)(client);
    var isControlUi = (client === null || client === void 0 ? void 0 : client.id) === client_info_js_1.GATEWAY_CLIENT_IDS.CONTROL_UI;
    var isWebchat = (0, message_channel_js_1.isWebchatClient)(client);
    var uiHint = "open a tokenized dashboard URL or paste token in Control UI settings";
    var tokenHint = isCli
        ? "set gateway.remote.token to match gateway.auth.token"
        : isControlUi || isWebchat
            ? uiHint
            : "provide gateway auth token";
    var passwordHint = isCli
        ? "set gateway.remote.password to match gateway.auth.password"
        : isControlUi || isWebchat
            ? "enter the password in Control UI settings"
            : "provide gateway auth password";
    switch (reason) {
        case "token_missing":
            return "unauthorized: gateway token missing (".concat(tokenHint, ")");
        case "token_mismatch":
            return "unauthorized: gateway token mismatch (".concat(tokenHint, ")");
        case "token_missing_config":
            return "unauthorized: gateway token not configured on gateway (set gateway.auth.token)";
        case "password_missing":
            return "unauthorized: gateway password missing (".concat(passwordHint, ")");
        case "password_mismatch":
            return "unauthorized: gateway password mismatch (".concat(passwordHint, ")");
        case "password_missing_config":
            return "unauthorized: gateway password not configured on gateway (set gateway.auth.password)";
        case "tailscale_user_missing":
            return "unauthorized: tailscale identity missing (use Tailscale Serve auth or gateway token/password)";
        case "tailscale_proxy_missing":
            return "unauthorized: tailscale proxy headers missing (use Tailscale Serve or gateway token/password)";
        case "tailscale_whois_failed":
            return "unauthorized: tailscale identity check failed (use Tailscale Serve auth or gateway token/password)";
        case "tailscale_user_mismatch":
            return "unauthorized: tailscale identity mismatch (use Tailscale Serve auth or gateway token/password)";
        default:
            break;
    }
    if (authMode === "token" && authProvided === "none") {
        return "unauthorized: gateway token missing (".concat(tokenHint, ")");
    }
    if (authMode === "password" && authProvided === "none") {
        return "unauthorized: gateway password missing (".concat(passwordHint, ")");
    }
    return "unauthorized";
}
function attachGatewayWsMessageHandler(params) {
    var _this = this;
    var _a, _b;
    var socket = params.socket, upgradeReq = params.upgradeReq, connId = params.connId, remoteAddr = params.remoteAddr, forwardedFor = params.forwardedFor, realIp = params.realIp, requestHost = params.requestHost, requestOrigin = params.requestOrigin, requestUserAgent = params.requestUserAgent, canvasHostUrl = params.canvasHostUrl, connectNonce = params.connectNonce, resolvedAuth = params.resolvedAuth, gatewayMethods = params.gatewayMethods, events = params.events, extraHandlers = params.extraHandlers, buildRequestContext = params.buildRequestContext, send = params.send, close = params.close, isClosed = params.isClosed, clearHandshakeTimer = params.clearHandshakeTimer, getClient = params.getClient, setClient = params.setClient, setHandshakeState = params.setHandshakeState, setCloseCause = params.setCloseCause, setLastFrameMeta = params.setLastFrameMeta, logGateway = params.logGateway, logHealth = params.logHealth, logWsControl = params.logWsControl;
    var configSnapshot = (0, config_js_1.loadConfig)();
    var trustedProxies = (_b = (_a = configSnapshot.gateway) === null || _a === void 0 ? void 0 : _a.trustedProxies) !== null && _b !== void 0 ? _b : [];
    var clientIp = (0, net_js_1.resolveGatewayClientIp)({ remoteAddr: remoteAddr, forwardedFor: forwardedFor, realIp: realIp, trustedProxies: trustedProxies });
    // If proxy headers are present but the remote address isn't trusted, don't treat
    // the connection as local. This prevents auth bypass when running behind a reverse
    // proxy without proper configuration - the proxy's loopback connection would otherwise
    // cause all external requests to be treated as trusted local clients.
    var hasProxyHeaders = Boolean(forwardedFor || realIp);
    var remoteIsTrustedProxy = (0, net_js_1.isTrustedProxyAddress)(remoteAddr, trustedProxies);
    var hasUntrustedProxyHeaders = hasProxyHeaders && !remoteIsTrustedProxy;
    var hostName = resolveHostName(requestHost);
    var hostIsLocal = hostName === "localhost" || hostName === "127.0.0.1" || hostName === "::1";
    var hostIsTailscaleServe = hostName.endsWith(".ts.net");
    var hostIsLocalish = hostIsLocal || hostIsTailscaleServe;
    var isLocalClient = (0, auth_js_1.isLocalDirectRequest)(upgradeReq, trustedProxies);
    var reportedClientIp = isLocalClient || hasUntrustedProxyHeaders
        ? undefined
        : clientIp && !(0, net_js_1.isLoopbackAddress)(clientIp)
            ? clientIp
            : undefined;
    if (hasUntrustedProxyHeaders) {
        logWsControl.warn("Proxy headers detected from untrusted address. " +
            "Connection will not be treated as local. " +
            "Configure gateway.trustedProxies to restore local client detection behind your proxy.");
    }
    if (!hostIsLocalish && (0, net_js_1.isLoopbackAddress)(remoteAddr) && !hasProxyHeaders) {
        logWsControl.warn("Loopback connection with non-local Host header. " +
            "Treating it as remote. If you're behind a reverse proxy, " +
            "set gateway.trustedProxies and forward X-Forwarded-For/X-Real-IP.");
    }
    var isWebchatConnect = function (p) { return (0, message_channel_js_1.isWebchatClient)(p === null || p === void 0 ? void 0 : p.client); };
    socket.on("message", function (data) { return __awaiter(_this, void 0, void 0, function () {
        var text, parsed, frameType, frameMethod, frameId, client_1, isRequestFrame, handshakeError, req_1, closeReason_1, frame_1, connectParams_1, clientLabel, minProtocol, maxProtocol, roleRaw, role_1, requestedScopes, scopes_1, deviceRaw, devicePublicKey_1, hasTokenAuth, hasPasswordAuth, hasSharedAuth, isControlUi, allowInsecureControlUi, disableControlUiDeviceAuth, allowControlUiBypass, device_1, canSkipDevice, errorMessage, derivedId, signedAt, nonceRequired, providedNonce, payload, signatureOk, allowLegacy, legacyPayload, authResult, authOk, authMethod, tokenCheck, authProvided, authMessage, skipPairing, requirePairing, paired, isPaired, ok, allowedRoles, ok, ok, pairedScopes, ok, allowedScopes_1, missingScope, ok, deviceToken, _a, cfg, allowlist_1, declared, filtered, shouldTrackPresence, clientId, instanceId, presenceKey, snapshot, cachedHealth, helloOk, nextClient, context_1, nodeSession_1, instanceIdRaw, instanceId_1, nodeIdsForPairing, _loop_1, _i, nodeIdsForPairing_1, nodeId, req_2, respond_1, err_1;
        var _this = this;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
        return __generator(this, function (_3) {
            switch (_3.label) {
                case 0:
                    if (isClosed()) {
                        return [2 /*return*/];
                    }
                    text = (0, ws_js_1.rawDataToString)(data);
                    _3.label = 1;
                case 1:
                    _3.trys.push([1, 22, , 23]);
                    parsed = JSON.parse(text);
                    frameType = parsed && typeof parsed === "object" && "type" in parsed
                        ? typeof parsed.type === "string"
                            ? String(parsed.type)
                            : undefined
                        : undefined;
                    frameMethod = parsed && typeof parsed === "object" && "method" in parsed
                        ? typeof parsed.method === "string"
                            ? String(parsed.method)
                            : undefined
                        : undefined;
                    frameId = parsed && typeof parsed === "object" && "id" in parsed
                        ? typeof parsed.id === "string"
                            ? String(parsed.id)
                            : undefined
                        : undefined;
                    if (frameType || frameMethod || frameId) {
                        setLastFrameMeta({ type: frameType, method: frameMethod, id: frameId });
                    }
                    client_1 = getClient();
                    if (!!client_1) return [3 /*break*/, 21];
                    isRequestFrame = (0, index_js_1.validateRequestFrame)(parsed);
                    if (!isRequestFrame ||
                        parsed.method !== "connect" ||
                        !(0, index_js_1.validateConnectParams)(parsed.params)) {
                        handshakeError = isRequestFrame
                            ? parsed.method === "connect"
                                ? "invalid connect params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateConnectParams.errors))
                                : "invalid handshake: first request must be connect"
                            : "invalid request frame";
                        setHandshakeState("failed");
                        setCloseCause("invalid-handshake", {
                            frameType: frameType,
                            frameMethod: frameMethod,
                            frameId: frameId,
                            handshakeError: handshakeError,
                        });
                        if (isRequestFrame) {
                            req_1 = parsed;
                            send({
                                type: "res",
                                id: req_1.id,
                                ok: false,
                                error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, handshakeError),
                            });
                        }
                        else {
                            logWsControl.warn("invalid handshake conn=".concat(connId, " remote=").concat(remoteAddr !== null && remoteAddr !== void 0 ? remoteAddr : "?", " fwd=").concat(forwardedFor !== null && forwardedFor !== void 0 ? forwardedFor : "n/a", " origin=").concat(requestOrigin !== null && requestOrigin !== void 0 ? requestOrigin : "n/a", " host=").concat(requestHost !== null && requestHost !== void 0 ? requestHost : "n/a", " ua=").concat(requestUserAgent !== null && requestUserAgent !== void 0 ? requestUserAgent : "n/a"));
                        }
                        closeReason_1 = (0, close_reason_js_1.truncateCloseReason)(handshakeError || "invalid handshake");
                        if (isRequestFrame) {
                            queueMicrotask(function () { return close(1008, closeReason_1); });
                        }
                        else {
                            close(1008, closeReason_1);
                        }
                        return [2 /*return*/];
                    }
                    frame_1 = parsed;
                    connectParams_1 = frame_1.params;
                    clientLabel = (_b = connectParams_1.client.displayName) !== null && _b !== void 0 ? _b : connectParams_1.client.id;
                    minProtocol = connectParams_1.minProtocol, maxProtocol = connectParams_1.maxProtocol;
                    if (maxProtocol < index_js_1.PROTOCOL_VERSION || minProtocol > index_js_1.PROTOCOL_VERSION) {
                        setHandshakeState("failed");
                        logWsControl.warn("protocol mismatch conn=".concat(connId, " remote=").concat(remoteAddr !== null && remoteAddr !== void 0 ? remoteAddr : "?", " client=").concat(clientLabel, " ").concat(connectParams_1.client.mode, " v").concat(connectParams_1.client.version));
                        setCloseCause("protocol-mismatch", {
                            minProtocol: minProtocol,
                            maxProtocol: maxProtocol,
                            expectedProtocol: index_js_1.PROTOCOL_VERSION,
                            client: connectParams_1.client.id,
                            clientDisplayName: connectParams_1.client.displayName,
                            mode: connectParams_1.client.mode,
                            version: connectParams_1.client.version,
                        });
                        send({
                            type: "res",
                            id: frame_1.id,
                            ok: false,
                            error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "protocol mismatch", {
                                details: { expectedProtocol: index_js_1.PROTOCOL_VERSION },
                            }),
                        });
                        close(1002, "protocol mismatch");
                        return [2 /*return*/];
                    }
                    roleRaw = (_c = connectParams_1.role) !== null && _c !== void 0 ? _c : "operator";
                    role_1 = roleRaw === "operator" || roleRaw === "node" ? roleRaw : null;
                    if (!role_1) {
                        setHandshakeState("failed");
                        setCloseCause("invalid-role", {
                            role: roleRaw,
                            client: connectParams_1.client.id,
                            clientDisplayName: connectParams_1.client.displayName,
                            mode: connectParams_1.client.mode,
                            version: connectParams_1.client.version,
                        });
                        send({
                            type: "res",
                            id: frame_1.id,
                            ok: false,
                            error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid role"),
                        });
                        close(1008, "invalid role");
                        return [2 /*return*/];
                    }
                    requestedScopes = Array.isArray(connectParams_1.scopes) ? connectParams_1.scopes : [];
                    scopes_1 = requestedScopes.length > 0
                        ? requestedScopes
                        : role_1 === "operator"
                            ? ["operator.admin"]
                            : [];
                    connectParams_1.role = role_1;
                    connectParams_1.scopes = scopes_1;
                    deviceRaw = connectParams_1.device;
                    devicePublicKey_1 = null;
                    hasTokenAuth = Boolean((_d = connectParams_1.auth) === null || _d === void 0 ? void 0 : _d.token);
                    hasPasswordAuth = Boolean((_e = connectParams_1.auth) === null || _e === void 0 ? void 0 : _e.password);
                    hasSharedAuth = hasTokenAuth || hasPasswordAuth;
                    isControlUi = connectParams_1.client.id === client_info_js_1.GATEWAY_CLIENT_IDS.CONTROL_UI;
                    allowInsecureControlUi = isControlUi && ((_g = (_f = configSnapshot.gateway) === null || _f === void 0 ? void 0 : _f.controlUi) === null || _g === void 0 ? void 0 : _g.allowInsecureAuth) === true;
                    disableControlUiDeviceAuth = isControlUi && ((_j = (_h = configSnapshot.gateway) === null || _h === void 0 ? void 0 : _h.controlUi) === null || _j === void 0 ? void 0 : _j.dangerouslyDisableDeviceAuth) === true;
                    allowControlUiBypass = allowInsecureControlUi || disableControlUiDeviceAuth;
                    device_1 = disableControlUiDeviceAuth ? null : deviceRaw;
                    if (!device_1) {
                        canSkipDevice = allowControlUiBypass ? hasSharedAuth : hasTokenAuth;
                        if (isControlUi && !allowControlUiBypass) {
                            errorMessage = "control ui requires HTTPS or localhost (secure context)";
                            setHandshakeState("failed");
                            setCloseCause("control-ui-insecure-auth", {
                                client: connectParams_1.client.id,
                                clientDisplayName: connectParams_1.client.displayName,
                                mode: connectParams_1.client.mode,
                                version: connectParams_1.client.version,
                            });
                            send({
                                type: "res",
                                id: frame_1.id,
                                ok: false,
                                error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, errorMessage),
                            });
                            close(1008, errorMessage);
                            return [2 /*return*/];
                        }
                        // Allow token-authenticated connections (e.g., control-ui) to skip device identity
                        if (!canSkipDevice) {
                            setHandshakeState("failed");
                            setCloseCause("device-required", {
                                client: connectParams_1.client.id,
                                clientDisplayName: connectParams_1.client.displayName,
                                mode: connectParams_1.client.mode,
                                version: connectParams_1.client.version,
                            });
                            send({
                                type: "res",
                                id: frame_1.id,
                                ok: false,
                                error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.NOT_PAIRED, "device identity required"),
                            });
                            close(1008, "device identity required");
                            return [2 /*return*/];
                        }
                    }
                    if (device_1) {
                        derivedId = (0, device_identity_js_1.deriveDeviceIdFromPublicKey)(device_1.publicKey);
                        if (!derivedId || derivedId !== device_1.id) {
                            setHandshakeState("failed");
                            setCloseCause("device-auth-invalid", {
                                reason: "device-id-mismatch",
                                client: connectParams_1.client.id,
                                deviceId: device_1.id,
                            });
                            send({
                                type: "res",
                                id: frame_1.id,
                                ok: false,
                                error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "device identity mismatch"),
                            });
                            close(1008, "device identity mismatch");
                            return [2 /*return*/];
                        }
                        signedAt = device_1.signedAt;
                        if (typeof signedAt !== "number" ||
                            Math.abs(Date.now() - signedAt) > DEVICE_SIGNATURE_SKEW_MS) {
                            setHandshakeState("failed");
                            setCloseCause("device-auth-invalid", {
                                reason: "device-signature-stale",
                                client: connectParams_1.client.id,
                                deviceId: device_1.id,
                            });
                            send({
                                type: "res",
                                id: frame_1.id,
                                ok: false,
                                error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "device signature expired"),
                            });
                            close(1008, "device signature expired");
                            return [2 /*return*/];
                        }
                        nonceRequired = !isLocalClient;
                        providedNonce = typeof device_1.nonce === "string" ? device_1.nonce.trim() : "";
                        if (nonceRequired && !providedNonce) {
                            setHandshakeState("failed");
                            setCloseCause("device-auth-invalid", {
                                reason: "device-nonce-missing",
                                client: connectParams_1.client.id,
                                deviceId: device_1.id,
                            });
                            send({
                                type: "res",
                                id: frame_1.id,
                                ok: false,
                                error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "device nonce required"),
                            });
                            close(1008, "device nonce required");
                            return [2 /*return*/];
                        }
                        if (providedNonce && providedNonce !== connectNonce) {
                            setHandshakeState("failed");
                            setCloseCause("device-auth-invalid", {
                                reason: "device-nonce-mismatch",
                                client: connectParams_1.client.id,
                                deviceId: device_1.id,
                            });
                            send({
                                type: "res",
                                id: frame_1.id,
                                ok: false,
                                error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "device nonce mismatch"),
                            });
                            close(1008, "device nonce mismatch");
                            return [2 /*return*/];
                        }
                        payload = (0, device_auth_js_1.buildDeviceAuthPayload)({
                            deviceId: device_1.id,
                            clientId: connectParams_1.client.id,
                            clientMode: connectParams_1.client.mode,
                            role: role_1,
                            scopes: requestedScopes,
                            signedAtMs: signedAt,
                            token: (_l = (_k = connectParams_1.auth) === null || _k === void 0 ? void 0 : _k.token) !== null && _l !== void 0 ? _l : null,
                            nonce: providedNonce || undefined,
                            version: providedNonce ? "v2" : "v1",
                        });
                        signatureOk = (0, device_identity_js_1.verifyDeviceSignature)(device_1.publicKey, payload, device_1.signature);
                        allowLegacy = !nonceRequired && !providedNonce;
                        if (!signatureOk && allowLegacy) {
                            legacyPayload = (0, device_auth_js_1.buildDeviceAuthPayload)({
                                deviceId: device_1.id,
                                clientId: connectParams_1.client.id,
                                clientMode: connectParams_1.client.mode,
                                role: role_1,
                                scopes: requestedScopes,
                                signedAtMs: signedAt,
                                token: (_o = (_m = connectParams_1.auth) === null || _m === void 0 ? void 0 : _m.token) !== null && _o !== void 0 ? _o : null,
                                version: "v1",
                            });
                            if ((0, device_identity_js_1.verifyDeviceSignature)(device_1.publicKey, legacyPayload, device_1.signature)) {
                                // accepted legacy loopback signature
                            }
                            else {
                                setHandshakeState("failed");
                                setCloseCause("device-auth-invalid", {
                                    reason: "device-signature",
                                    client: connectParams_1.client.id,
                                    deviceId: device_1.id,
                                });
                                send({
                                    type: "res",
                                    id: frame_1.id,
                                    ok: false,
                                    error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "device signature invalid"),
                                });
                                close(1008, "device signature invalid");
                                return [2 /*return*/];
                            }
                        }
                        else if (!signatureOk) {
                            setHandshakeState("failed");
                            setCloseCause("device-auth-invalid", {
                                reason: "device-signature",
                                client: connectParams_1.client.id,
                                deviceId: device_1.id,
                            });
                            send({
                                type: "res",
                                id: frame_1.id,
                                ok: false,
                                error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "device signature invalid"),
                            });
                            close(1008, "device signature invalid");
                            return [2 /*return*/];
                        }
                        devicePublicKey_1 = (0, device_identity_js_1.normalizeDevicePublicKeyBase64Url)(device_1.publicKey);
                        if (!devicePublicKey_1) {
                            setHandshakeState("failed");
                            setCloseCause("device-auth-invalid", {
                                reason: "device-public-key",
                                client: connectParams_1.client.id,
                                deviceId: device_1.id,
                            });
                            send({
                                type: "res",
                                id: frame_1.id,
                                ok: false,
                                error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "device public key invalid"),
                            });
                            close(1008, "device public key invalid");
                            return [2 /*return*/];
                        }
                    }
                    return [4 /*yield*/, (0, auth_js_1.authorizeGatewayConnect)({
                            auth: resolvedAuth,
                            connectAuth: connectParams_1.auth,
                            req: upgradeReq,
                            trustedProxies: trustedProxies,
                        })];
                case 2:
                    authResult = _3.sent();
                    authOk = authResult.ok;
                    authMethod = (_p = authResult.method) !== null && _p !== void 0 ? _p : (resolvedAuth.mode === "password" ? "password" : "token");
                    if (!(!authOk && ((_q = connectParams_1.auth) === null || _q === void 0 ? void 0 : _q.token) && device_1)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, device_pairing_js_1.verifyDeviceToken)({
                            deviceId: device_1.id,
                            token: connectParams_1.auth.token,
                            role: role_1,
                            scopes: scopes_1,
                        })];
                case 3:
                    tokenCheck = _3.sent();
                    if (tokenCheck.ok) {
                        authOk = true;
                        authMethod = "device-token";
                    }
                    _3.label = 4;
                case 4:
                    if (!authOk) {
                        setHandshakeState("failed");
                        logWsControl.warn("unauthorized conn=".concat(connId, " remote=").concat(remoteAddr !== null && remoteAddr !== void 0 ? remoteAddr : "?", " client=").concat(clientLabel, " ").concat(connectParams_1.client.mode, " v").concat(connectParams_1.client.version, " reason=").concat((_r = authResult.reason) !== null && _r !== void 0 ? _r : "unknown"));
                        authProvided = ((_s = connectParams_1.auth) === null || _s === void 0 ? void 0 : _s.token)
                            ? "token"
                            : ((_t = connectParams_1.auth) === null || _t === void 0 ? void 0 : _t.password)
                                ? "password"
                                : "none";
                        authMessage = formatGatewayAuthFailureMessage({
                            authMode: resolvedAuth.mode,
                            authProvided: authProvided,
                            reason: authResult.reason,
                            client: connectParams_1.client,
                        });
                        setCloseCause("unauthorized", {
                            authMode: resolvedAuth.mode,
                            authProvided: authProvided,
                            authReason: authResult.reason,
                            allowTailscale: resolvedAuth.allowTailscale,
                            client: connectParams_1.client.id,
                            clientDisplayName: connectParams_1.client.displayName,
                            mode: connectParams_1.client.mode,
                            version: connectParams_1.client.version,
                        });
                        send({
                            type: "res",
                            id: frame_1.id,
                            ok: false,
                            error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, authMessage),
                        });
                        close(1008, (0, close_reason_js_1.truncateCloseReason)(authMessage));
                        return [2 /*return*/];
                    }
                    skipPairing = allowControlUiBypass && hasSharedAuth;
                    if (!(device_1 && devicePublicKey_1 && !skipPairing)) return [3 /*break*/, 17];
                    requirePairing = function (reason, _paired) { return __awaiter(_this, void 0, void 0, function () {
                        var pairing, context, approved;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, (0, device_pairing_js_1.requestDevicePairing)({
                                        deviceId: device_1.id,
                                        publicKey: devicePublicKey_1,
                                        displayName: connectParams_1.client.displayName,
                                        platform: connectParams_1.client.platform,
                                        clientId: connectParams_1.client.id,
                                        clientMode: connectParams_1.client.mode,
                                        role: role_1,
                                        scopes: scopes_1,
                                        remoteIp: reportedClientIp,
                                        silent: isLocalClient,
                                    })];
                                case 1:
                                    pairing = _b.sent();
                                    context = buildRequestContext();
                                    if (!(pairing.request.silent === true)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, (0, device_pairing_js_1.approveDevicePairing)(pairing.request.requestId)];
                                case 2:
                                    approved = _b.sent();
                                    if (approved) {
                                        logGateway.info("device pairing auto-approved device=".concat(approved.device.deviceId, " role=").concat((_a = approved.device.role) !== null && _a !== void 0 ? _a : "unknown"));
                                        context.broadcast("device.pair.resolved", {
                                            requestId: pairing.request.requestId,
                                            deviceId: approved.device.deviceId,
                                            decision: "approved",
                                            ts: Date.now(),
                                        }, { dropIfSlow: true });
                                    }
                                    return [3 /*break*/, 4];
                                case 3:
                                    if (pairing.created) {
                                        context.broadcast("device.pair.requested", pairing.request, { dropIfSlow: true });
                                    }
                                    _b.label = 4;
                                case 4:
                                    if (pairing.request.silent !== true) {
                                        setHandshakeState("failed");
                                        setCloseCause("pairing-required", {
                                            deviceId: device_1.id,
                                            requestId: pairing.request.requestId,
                                            reason: reason,
                                        });
                                        send({
                                            type: "res",
                                            id: frame_1.id,
                                            ok: false,
                                            error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.NOT_PAIRED, "pairing required", {
                                                details: { requestId: pairing.request.requestId },
                                            }),
                                        });
                                        close(1008, "pairing required");
                                        return [2 /*return*/, false];
                                    }
                                    return [2 /*return*/, true];
                            }
                        });
                    }); };
                    return [4 /*yield*/, (0, device_pairing_js_1.getPairedDevice)(device_1.id)];
                case 5:
                    paired = _3.sent();
                    isPaired = (paired === null || paired === void 0 ? void 0 : paired.publicKey) === devicePublicKey_1;
                    if (!!isPaired) return [3 /*break*/, 7];
                    return [4 /*yield*/, requirePairing("not-paired")];
                case 6:
                    ok = _3.sent();
                    if (!ok) {
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 17];
                case 7:
                    allowedRoles = new Set(Array.isArray(paired.roles) ? paired.roles : paired.role ? [paired.role] : []);
                    if (!(allowedRoles.size === 0)) return [3 /*break*/, 9];
                    return [4 /*yield*/, requirePairing("role-upgrade", paired)];
                case 8:
                    ok = _3.sent();
                    if (!ok) {
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 11];
                case 9:
                    if (!!allowedRoles.has(role_1)) return [3 /*break*/, 11];
                    return [4 /*yield*/, requirePairing("role-upgrade", paired)];
                case 10:
                    ok = _3.sent();
                    if (!ok) {
                        return [2 /*return*/];
                    }
                    _3.label = 11;
                case 11:
                    pairedScopes = Array.isArray(paired.scopes) ? paired.scopes : [];
                    if (!(scopes_1.length > 0)) return [3 /*break*/, 15];
                    if (!(pairedScopes.length === 0)) return [3 /*break*/, 13];
                    return [4 /*yield*/, requirePairing("scope-upgrade", paired)];
                case 12:
                    ok = _3.sent();
                    if (!ok) {
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 15];
                case 13:
                    allowedScopes_1 = new Set(pairedScopes);
                    missingScope = scopes_1.find(function (scope) { return !allowedScopes_1.has(scope); });
                    if (!missingScope) return [3 /*break*/, 15];
                    return [4 /*yield*/, requirePairing("scope-upgrade", paired)];
                case 14:
                    ok = _3.sent();
                    if (!ok) {
                        return [2 /*return*/];
                    }
                    _3.label = 15;
                case 15: return [4 /*yield*/, (0, device_pairing_js_1.updatePairedDeviceMetadata)(device_1.id, {
                        displayName: connectParams_1.client.displayName,
                        platform: connectParams_1.client.platform,
                        clientId: connectParams_1.client.id,
                        clientMode: connectParams_1.client.mode,
                        role: role_1,
                        scopes: scopes_1,
                        remoteIp: reportedClientIp,
                    })];
                case 16:
                    _3.sent();
                    _3.label = 17;
                case 17:
                    if (!device_1) return [3 /*break*/, 19];
                    return [4 /*yield*/, (0, device_pairing_js_1.ensureDeviceToken)({ deviceId: device_1.id, role: role_1, scopes: scopes_1 })];
                case 18:
                    _a = _3.sent();
                    return [3 /*break*/, 20];
                case 19:
                    _a = null;
                    _3.label = 20;
                case 20:
                    deviceToken = _a;
                    if (role_1 === "node") {
                        cfg = (0, config_js_1.loadConfig)();
                        allowlist_1 = (0, node_command_policy_js_1.resolveNodeCommandAllowlist)(cfg, {
                            platform: connectParams_1.client.platform,
                            deviceFamily: connectParams_1.client.deviceFamily,
                        });
                        declared = Array.isArray(connectParams_1.commands) ? connectParams_1.commands : [];
                        filtered = declared
                            .map(function (cmd) { return cmd.trim(); })
                            .filter(function (cmd) { return cmd.length > 0 && allowlist_1.has(cmd); });
                        connectParams_1.commands = filtered;
                    }
                    shouldTrackPresence = !(0, message_channel_js_1.isGatewayCliClient)(connectParams_1.client);
                    clientId = connectParams_1.client.id;
                    instanceId = connectParams_1.client.instanceId;
                    presenceKey = shouldTrackPresence ? ((_v = (_u = device_1 === null || device_1 === void 0 ? void 0 : device_1.id) !== null && _u !== void 0 ? _u : instanceId) !== null && _v !== void 0 ? _v : connId) : undefined;
                    (0, ws_log_js_1.logWs)("in", "connect", {
                        connId: connId,
                        client: connectParams_1.client.id,
                        clientDisplayName: connectParams_1.client.displayName,
                        version: connectParams_1.client.version,
                        mode: connectParams_1.client.mode,
                        clientId: clientId,
                        platform: connectParams_1.client.platform,
                        auth: authMethod,
                    });
                    if (isWebchatConnect(connectParams_1)) {
                        logWsControl.info("webchat connected conn=".concat(connId, " remote=").concat(remoteAddr !== null && remoteAddr !== void 0 ? remoteAddr : "?", " client=").concat(clientLabel, " ").concat(connectParams_1.client.mode, " v").concat(connectParams_1.client.version));
                    }
                    if (presenceKey) {
                        (0, system_presence_js_1.upsertPresence)(presenceKey, {
                            host: (_x = (_w = connectParams_1.client.displayName) !== null && _w !== void 0 ? _w : connectParams_1.client.id) !== null && _x !== void 0 ? _x : node_os_1.default.hostname(),
                            ip: isLocalClient ? undefined : reportedClientIp,
                            version: connectParams_1.client.version,
                            platform: connectParams_1.client.platform,
                            deviceFamily: connectParams_1.client.deviceFamily,
                            modelIdentifier: connectParams_1.client.modelIdentifier,
                            mode: connectParams_1.client.mode,
                            deviceId: device_1 === null || device_1 === void 0 ? void 0 : device_1.id,
                            roles: [role_1],
                            scopes: scopes_1,
                            instanceId: (_y = device_1 === null || device_1 === void 0 ? void 0 : device_1.id) !== null && _y !== void 0 ? _y : instanceId,
                            reason: "connect",
                        });
                        (0, health_state_js_1.incrementPresenceVersion)();
                    }
                    snapshot = (0, health_state_js_1.buildGatewaySnapshot)();
                    cachedHealth = (0, health_state_js_1.getHealthCache)();
                    if (cachedHealth) {
                        snapshot.health = cachedHealth;
                        snapshot.stateVersion.health = (0, health_state_js_1.getHealthVersion)();
                    }
                    helloOk = {
                        type: "hello-ok",
                        protocol: index_js_1.PROTOCOL_VERSION,
                        server: {
                            version: (_0 = (_z = process.env.OPENCLAW_VERSION) !== null && _z !== void 0 ? _z : process.env.npm_package_version) !== null && _0 !== void 0 ? _0 : "dev",
                            commit: process.env.GIT_COMMIT,
                            host: node_os_1.default.hostname(),
                            connId: connId,
                        },
                        features: { methods: gatewayMethods, events: events },
                        snapshot: snapshot,
                        canvasHostUrl: canvasHostUrl,
                        auth: deviceToken
                            ? {
                                deviceToken: deviceToken.token,
                                role: deviceToken.role,
                                scopes: deviceToken.scopes,
                                issuedAtMs: (_1 = deviceToken.rotatedAtMs) !== null && _1 !== void 0 ? _1 : deviceToken.createdAtMs,
                            }
                            : undefined,
                        policy: {
                            maxPayload: server_constants_js_1.MAX_PAYLOAD_BYTES,
                            maxBufferedBytes: server_constants_js_1.MAX_BUFFERED_BYTES,
                            tickIntervalMs: server_constants_js_1.TICK_INTERVAL_MS,
                        },
                    };
                    clearHandshakeTimer();
                    nextClient = {
                        socket: socket,
                        connect: connectParams_1,
                        connId: connId,
                        presenceKey: presenceKey,
                    };
                    setClient(nextClient);
                    setHandshakeState("connected");
                    if (role_1 === "node") {
                        context_1 = buildRequestContext();
                        nodeSession_1 = context_1.nodeRegistry.register(nextClient, {
                            remoteIp: reportedClientIp,
                        });
                        instanceIdRaw = connectParams_1.client.instanceId;
                        instanceId_1 = typeof instanceIdRaw === "string" ? instanceIdRaw.trim() : "";
                        nodeIdsForPairing = new Set([nodeSession_1.nodeId]);
                        if (instanceId_1) {
                            nodeIdsForPairing.add(instanceId_1);
                        }
                        _loop_1 = function (nodeId) {
                            void (0, node_pairing_js_1.updatePairedNodeMetadata)(nodeId, {
                                lastConnectedAtMs: nodeSession_1.connectedAtMs,
                            }).catch(function (err) {
                                return logGateway.warn("failed to record last connect for ".concat(nodeId, ": ").concat((0, ws_log_js_1.formatForLog)(err)));
                            });
                        };
                        for (_i = 0, nodeIdsForPairing_1 = nodeIdsForPairing; _i < nodeIdsForPairing_1.length; _i++) {
                            nodeId = nodeIdsForPairing_1[_i];
                            _loop_1(nodeId);
                        }
                        (0, skills_remote_js_1.recordRemoteNodeInfo)({
                            nodeId: nodeSession_1.nodeId,
                            displayName: nodeSession_1.displayName,
                            platform: nodeSession_1.platform,
                            deviceFamily: nodeSession_1.deviceFamily,
                            commands: nodeSession_1.commands,
                            remoteIp: nodeSession_1.remoteIp,
                        });
                        void (0, skills_remote_js_1.refreshRemoteNodeBins)({
                            nodeId: nodeSession_1.nodeId,
                            platform: nodeSession_1.platform,
                            deviceFamily: nodeSession_1.deviceFamily,
                            commands: nodeSession_1.commands,
                            cfg: (0, config_js_1.loadConfig)(),
                        }).catch(function (err) {
                            return logGateway.warn("remote bin probe failed for ".concat(nodeSession_1.nodeId, ": ").concat((0, ws_log_js_1.formatForLog)(err)));
                        });
                        void (0, voicewake_js_1.loadVoiceWakeConfig)()
                            .then(function (cfg) {
                            context_1.nodeRegistry.sendEvent(nodeSession_1.nodeId, "voicewake.changed", {
                                triggers: cfg.triggers,
                            });
                        })
                            .catch(function (err) {
                            return logGateway.warn("voicewake snapshot failed for ".concat(nodeSession_1.nodeId, ": ").concat((0, ws_log_js_1.formatForLog)(err)));
                        });
                    }
                    (0, ws_log_js_1.logWs)("out", "hello-ok", {
                        connId: connId,
                        methods: gatewayMethods.length,
                        events: events.length,
                        presence: snapshot.presence.length,
                        stateVersion: snapshot.stateVersion.presence,
                    });
                    send({ type: "res", id: frame_1.id, ok: true, payload: helloOk });
                    void (0, health_state_js_1.refreshGatewayHealthSnapshot)({ probe: true }).catch(function (err) {
                        return logHealth.error("post-connect health refresh failed: ".concat((0, server_utils_js_1.formatError)(err)));
                    });
                    return [2 /*return*/];
                case 21:
                    // After handshake, accept only req frames
                    if (!(0, index_js_1.validateRequestFrame)(parsed)) {
                        send({
                            type: "res",
                            id: (_2 = parsed === null || parsed === void 0 ? void 0 : parsed.id) !== null && _2 !== void 0 ? _2 : "invalid",
                            ok: false,
                            error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid request frame: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateRequestFrame.errors))),
                        });
                        return [2 /*return*/];
                    }
                    req_2 = parsed;
                    (0, ws_log_js_1.logWs)("in", "req", { connId: connId, id: req_2.id, method: req_2.method });
                    respond_1 = function (ok, payload, error, meta) {
                        send({ type: "res", id: req_2.id, ok: ok, payload: payload, error: error });
                        (0, ws_log_js_1.logWs)("out", "res", __assign({ connId: connId, id: req_2.id, ok: ok, method: req_2.method, errorCode: error === null || error === void 0 ? void 0 : error.code, errorMessage: error === null || error === void 0 ? void 0 : error.message }, meta));
                    };
                    void (function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, server_methods_js_1.handleGatewayRequest)({
                                        req: req_2,
                                        respond: respond_1,
                                        client: client_1,
                                        isWebchatConnect: isWebchatConnect,
                                        extraHandlers: extraHandlers,
                                        context: buildRequestContext(),
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })().catch(function (err) {
                        logGateway.error("request handler failed: ".concat((0, ws_log_js_1.formatForLog)(err)));
                        respond_1(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, (0, ws_log_js_1.formatForLog)(err)));
                    });
                    return [3 /*break*/, 23];
                case 22:
                    err_1 = _3.sent();
                    logGateway.error("parse/handle error: ".concat(String(err_1)));
                    (0, ws_log_js_1.logWs)("out", "parse-error", { connId: connId, error: (0, ws_log_js_1.formatForLog)(err_1) });
                    if (!getClient()) {
                        close();
                    }
                    return [3 /*break*/, 23];
                case 23: return [2 /*return*/];
            }
        });
    }); });
}
