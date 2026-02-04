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
exports.createExecApprovalHandlers = createExecApprovalHandlers;
var index_js_1 = require("../protocol/index.js");
function createExecApprovalHandlers(manager, opts) {
    var _this = this;
    return {
        "exec.approval.request": function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var p, timeoutMs, explicitId, request, record, decisionPromise, decision;
            var _c, _d, _e, _f, _g, _h, _j, _k;
            var params = _b.params, respond = _b.respond, context = _b.context;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        if (!(0, index_js_1.validateExecApprovalRequestParams)(params)) {
                            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid exec.approval.request params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateExecApprovalRequestParams.errors))));
                            return [2 /*return*/];
                        }
                        p = params;
                        timeoutMs = typeof p.timeoutMs === "number" ? p.timeoutMs : 120000;
                        explicitId = typeof p.id === "string" && p.id.trim().length > 0 ? p.id.trim() : null;
                        if (explicitId && manager.getSnapshot(explicitId)) {
                            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "approval id already pending"));
                            return [2 /*return*/];
                        }
                        request = {
                            command: p.command,
                            cwd: (_c = p.cwd) !== null && _c !== void 0 ? _c : null,
                            host: (_d = p.host) !== null && _d !== void 0 ? _d : null,
                            security: (_e = p.security) !== null && _e !== void 0 ? _e : null,
                            ask: (_f = p.ask) !== null && _f !== void 0 ? _f : null,
                            agentId: (_g = p.agentId) !== null && _g !== void 0 ? _g : null,
                            resolvedPath: (_h = p.resolvedPath) !== null && _h !== void 0 ? _h : null,
                            sessionKey: (_j = p.sessionKey) !== null && _j !== void 0 ? _j : null,
                        };
                        record = manager.create(request, timeoutMs, explicitId);
                        decisionPromise = manager.waitForDecision(record, timeoutMs);
                        context.broadcast("exec.approval.requested", {
                            id: record.id,
                            request: record.request,
                            createdAtMs: record.createdAtMs,
                            expiresAtMs: record.expiresAtMs,
                        }, { dropIfSlow: true });
                        void ((_k = opts === null || opts === void 0 ? void 0 : opts.forwarder) === null || _k === void 0 ? void 0 : _k.handleRequested({
                            id: record.id,
                            request: record.request,
                            createdAtMs: record.createdAtMs,
                            expiresAtMs: record.expiresAtMs,
                        }).catch(function (err) {
                            var _a, _b;
                            (_b = (_a = context.logGateway) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, "exec approvals: forward request failed: ".concat(String(err)));
                        }));
                        return [4 /*yield*/, decisionPromise];
                    case 1:
                        decision = _l.sent();
                        respond(true, {
                            id: record.id,
                            decision: decision,
                            createdAtMs: record.createdAtMs,
                            expiresAtMs: record.expiresAtMs,
                        }, undefined);
                        return [2 /*return*/];
                }
            });
        }); },
        "exec.approval.resolve": function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var p, decision, resolvedBy, ok;
            var _c, _d, _e, _f, _g, _h;
            var params = _b.params, respond = _b.respond, client = _b.client, context = _b.context;
            return __generator(this, function (_j) {
                if (!(0, index_js_1.validateExecApprovalResolveParams)(params)) {
                    respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid exec.approval.resolve params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateExecApprovalResolveParams.errors))));
                    return [2 /*return*/];
                }
                p = params;
                decision = p.decision;
                if (decision !== "allow-once" && decision !== "allow-always" && decision !== "deny") {
                    respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid decision"));
                    return [2 /*return*/];
                }
                resolvedBy = (_e = (_d = (_c = client === null || client === void 0 ? void 0 : client.connect) === null || _c === void 0 ? void 0 : _c.client) === null || _d === void 0 ? void 0 : _d.displayName) !== null && _e !== void 0 ? _e : (_g = (_f = client === null || client === void 0 ? void 0 : client.connect) === null || _f === void 0 ? void 0 : _f.client) === null || _g === void 0 ? void 0 : _g.id;
                ok = manager.resolve(p.id, decision, resolvedBy !== null && resolvedBy !== void 0 ? resolvedBy : null);
                if (!ok) {
                    respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "unknown approval id"));
                    return [2 /*return*/];
                }
                context.broadcast("exec.approval.resolved", { id: p.id, decision: decision, resolvedBy: resolvedBy, ts: Date.now() }, { dropIfSlow: true });
                void ((_h = opts === null || opts === void 0 ? void 0 : opts.forwarder) === null || _h === void 0 ? void 0 : _h.handleResolved({ id: p.id, decision: decision, resolvedBy: resolvedBy, ts: Date.now() }).catch(function (err) {
                    var _a, _b;
                    (_b = (_a = context.logGateway) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, "exec approvals: forward resolve failed: ".concat(String(err)));
                }));
                respond(true, { ok: true }, undefined);
                return [2 /*return*/];
            });
        }); },
    };
}
