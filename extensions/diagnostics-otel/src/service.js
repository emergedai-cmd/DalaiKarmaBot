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
exports.createDiagnosticsOtelService = createDiagnosticsOtelService;
var api_1 = require("@opentelemetry/api");
var exporter_logs_otlp_http_1 = require("@opentelemetry/exporter-logs-otlp-http");
var exporter_metrics_otlp_http_1 = require("@opentelemetry/exporter-metrics-otlp-http");
var exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
var sdk_logs_1 = require("@opentelemetry/sdk-logs");
var sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
var sdk_node_1 = require("@opentelemetry/sdk-node");
var sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
var semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var DEFAULT_SERVICE_NAME = "openclaw";
function normalizeEndpoint(endpoint) {
    var trimmed = endpoint === null || endpoint === void 0 ? void 0 : endpoint.trim();
    return trimmed ? trimmed.replace(/\/+$/, "") : undefined;
}
function resolveOtelUrl(endpoint, path) {
    if (!endpoint) {
        return undefined;
    }
    if (endpoint.includes("/v1/")) {
        return endpoint;
    }
    return "".concat(endpoint, "/").concat(path);
}
function resolveSampleRate(value) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return undefined;
    }
    if (value < 0 || value > 1) {
        return undefined;
    }
    return value;
}
function createDiagnosticsOtelService() {
    var sdk = null;
    var logProvider = null;
    var stopLogTransport = null;
    var unsubscribe = null;
    return {
        id: "diagnostics-otel",
        start: function (ctx) {
            return __awaiter(this, void 0, void 0, function () {
                var cfg, otel, protocol, endpoint, headers, serviceName, sampleRate, tracesEnabled, metricsEnabled, logsEnabled, resource, traceUrl, metricUrl, logUrl, traceExporter, metricExporter, metricReader, logSeverityMap, meter, tracer, tokensCounter, costCounter, durationHistogram, contextHistogram, webhookReceivedCounter, webhookErrorCounter, webhookDurationHistogram, messageQueuedCounter, messageProcessedCounter, messageDurationHistogram, queueDepthHistogram, queueWaitHistogram, laneEnqueueCounter, laneDequeueCounter, sessionStateCounter, sessionStuckCounter, sessionStuckAgeHistogram, runAttemptCounter, logExporter, otelLogger_1, spanWithDuration, recordModelUsage, recordWebhookReceived, recordWebhookProcessed, recordWebhookError, recordMessageQueued, recordMessageProcessed, recordLaneEnqueue, recordLaneDequeue, recordSessionState, recordSessionStuck, recordRunAttempt, recordHeartbeat;
                var _a;
                var _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    cfg = ctx.config.diagnostics;
                    otel = cfg === null || cfg === void 0 ? void 0 : cfg.otel;
                    if (!(cfg === null || cfg === void 0 ? void 0 : cfg.enabled) || !(otel === null || otel === void 0 ? void 0 : otel.enabled)) {
                        return [2 /*return*/];
                    }
                    protocol = (_c = (_b = otel.protocol) !== null && _b !== void 0 ? _b : process.env.OTEL_EXPORTER_OTLP_PROTOCOL) !== null && _c !== void 0 ? _c : "http/protobuf";
                    if (protocol !== "http/protobuf") {
                        ctx.logger.warn("diagnostics-otel: unsupported protocol ".concat(protocol));
                        return [2 /*return*/];
                    }
                    endpoint = normalizeEndpoint((_d = otel.endpoint) !== null && _d !== void 0 ? _d : process.env.OTEL_EXPORTER_OTLP_ENDPOINT);
                    headers = (_e = otel.headers) !== null && _e !== void 0 ? _e : undefined;
                    serviceName = ((_f = otel.serviceName) === null || _f === void 0 ? void 0 : _f.trim()) || process.env.OTEL_SERVICE_NAME || DEFAULT_SERVICE_NAME;
                    sampleRate = resolveSampleRate(otel.sampleRate);
                    tracesEnabled = otel.traces !== false;
                    metricsEnabled = otel.metrics !== false;
                    logsEnabled = otel.logs === true;
                    if (!tracesEnabled && !metricsEnabled && !logsEnabled) {
                        return [2 /*return*/];
                    }
                    resource = new resources_1.Resource((_a = {},
                        _a[semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME] = serviceName,
                        _a));
                    traceUrl = resolveOtelUrl(endpoint, "v1/traces");
                    metricUrl = resolveOtelUrl(endpoint, "v1/metrics");
                    logUrl = resolveOtelUrl(endpoint, "v1/logs");
                    traceExporter = tracesEnabled
                        ? new exporter_trace_otlp_http_1.OTLPTraceExporter(__assign(__assign({}, (traceUrl ? { url: traceUrl } : {})), (headers ? { headers: headers } : {})))
                        : undefined;
                    metricExporter = metricsEnabled
                        ? new exporter_metrics_otlp_http_1.OTLPMetricExporter(__assign(__assign({}, (metricUrl ? { url: metricUrl } : {})), (headers ? { headers: headers } : {})))
                        : undefined;
                    metricReader = metricExporter
                        ? new sdk_metrics_1.PeriodicExportingMetricReader(__assign({ exporter: metricExporter }, (typeof otel.flushIntervalMs === "number"
                            ? { exportIntervalMillis: Math.max(1000, otel.flushIntervalMs) }
                            : {})))
                        : undefined;
                    if (tracesEnabled || metricsEnabled) {
                        sdk = new sdk_node_1.NodeSDK(__assign(__assign(__assign({ resource: resource }, (traceExporter ? { traceExporter: traceExporter } : {})), (metricReader ? { metricReader: metricReader } : {})), (sampleRate !== undefined
                            ? {
                                sampler: new sdk_trace_base_1.ParentBasedSampler({
                                    root: new sdk_trace_base_1.TraceIdRatioBasedSampler(sampleRate),
                                }),
                            }
                            : {})));
                        sdk.start();
                    }
                    logSeverityMap = {
                        TRACE: 1,
                        DEBUG: 5,
                        INFO: 9,
                        WARN: 13,
                        ERROR: 17,
                        FATAL: 21,
                    };
                    meter = api_1.metrics.getMeter("openclaw");
                    tracer = api_1.trace.getTracer("openclaw");
                    tokensCounter = meter.createCounter("openclaw.tokens", {
                        unit: "1",
                        description: "Token usage by type",
                    });
                    costCounter = meter.createCounter("openclaw.cost.usd", {
                        unit: "1",
                        description: "Estimated model cost (USD)",
                    });
                    durationHistogram = meter.createHistogram("openclaw.run.duration_ms", {
                        unit: "ms",
                        description: "Agent run duration",
                    });
                    contextHistogram = meter.createHistogram("openclaw.context.tokens", {
                        unit: "1",
                        description: "Context window size and usage",
                    });
                    webhookReceivedCounter = meter.createCounter("openclaw.webhook.received", {
                        unit: "1",
                        description: "Webhook requests received",
                    });
                    webhookErrorCounter = meter.createCounter("openclaw.webhook.error", {
                        unit: "1",
                        description: "Webhook processing errors",
                    });
                    webhookDurationHistogram = meter.createHistogram("openclaw.webhook.duration_ms", {
                        unit: "ms",
                        description: "Webhook processing duration",
                    });
                    messageQueuedCounter = meter.createCounter("openclaw.message.queued", {
                        unit: "1",
                        description: "Messages queued for processing",
                    });
                    messageProcessedCounter = meter.createCounter("openclaw.message.processed", {
                        unit: "1",
                        description: "Messages processed by outcome",
                    });
                    messageDurationHistogram = meter.createHistogram("openclaw.message.duration_ms", {
                        unit: "ms",
                        description: "Message processing duration",
                    });
                    queueDepthHistogram = meter.createHistogram("openclaw.queue.depth", {
                        unit: "1",
                        description: "Queue depth on enqueue/dequeue",
                    });
                    queueWaitHistogram = meter.createHistogram("openclaw.queue.wait_ms", {
                        unit: "ms",
                        description: "Queue wait time before execution",
                    });
                    laneEnqueueCounter = meter.createCounter("openclaw.queue.lane.enqueue", {
                        unit: "1",
                        description: "Command queue lane enqueue events",
                    });
                    laneDequeueCounter = meter.createCounter("openclaw.queue.lane.dequeue", {
                        unit: "1",
                        description: "Command queue lane dequeue events",
                    });
                    sessionStateCounter = meter.createCounter("openclaw.session.state", {
                        unit: "1",
                        description: "Session state transitions",
                    });
                    sessionStuckCounter = meter.createCounter("openclaw.session.stuck", {
                        unit: "1",
                        description: "Sessions stuck in processing",
                    });
                    sessionStuckAgeHistogram = meter.createHistogram("openclaw.session.stuck_age_ms", {
                        unit: "ms",
                        description: "Age of stuck sessions",
                    });
                    runAttemptCounter = meter.createCounter("openclaw.run.attempt", {
                        unit: "1",
                        description: "Run attempts",
                    });
                    if (logsEnabled) {
                        logExporter = new exporter_logs_otlp_http_1.OTLPLogExporter(__assign(__assign({}, (logUrl ? { url: logUrl } : {})), (headers ? { headers: headers } : {})));
                        logProvider = new sdk_logs_1.LoggerProvider({ resource: resource });
                        logProvider.addLogRecordProcessor(new sdk_logs_1.BatchLogRecordProcessor(logExporter, typeof otel.flushIntervalMs === "number"
                            ? { scheduledDelayMillis: Math.max(1000, otel.flushIntervalMs) }
                            : {}));
                        otelLogger_1 = logProvider.getLogger("openclaw");
                        stopLogTransport = (0, plugin_sdk_1.registerLogTransport)(function (logObj) {
                            var _a, _b, _c, _d, _e, _f, _g, _h;
                            var safeStringify = function (value) {
                                try {
                                    return JSON.stringify(value);
                                }
                                catch (_a) {
                                    return String(value);
                                }
                            };
                            var meta = logObj._meta;
                            var logLevelName = (_a = meta === null || meta === void 0 ? void 0 : meta.logLevelName) !== null && _a !== void 0 ? _a : "INFO";
                            var severityNumber = (_b = logSeverityMap[logLevelName]) !== null && _b !== void 0 ? _b : 9;
                            var numericArgs = Object.entries(logObj)
                                .filter(function (_a) {
                                var key = _a[0];
                                return /^\d+$/.test(key);
                            })
                                .toSorted(function (a, b) { return Number(a[0]) - Number(b[0]); })
                                .map(function (_a) {
                                var value = _a[1];
                                return value;
                            });
                            var bindings;
                            if (typeof numericArgs[0] === "string" && numericArgs[0].trim().startsWith("{")) {
                                try {
                                    var parsed = JSON.parse(numericArgs[0]);
                                    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                                        bindings = parsed;
                                        numericArgs.shift();
                                    }
                                }
                                catch (_j) {
                                    // ignore malformed json bindings
                                }
                            }
                            var message = "";
                            if (numericArgs.length > 0 && typeof numericArgs[numericArgs.length - 1] === "string") {
                                message = String(numericArgs.pop());
                            }
                            else if (numericArgs.length === 1) {
                                message = safeStringify(numericArgs[0]);
                                numericArgs.length = 0;
                            }
                            if (!message) {
                                message = "log";
                            }
                            var attributes = {
                                "openclaw.log.level": logLevelName,
                            };
                            if (meta === null || meta === void 0 ? void 0 : meta.name) {
                                attributes["openclaw.logger"] = meta.name;
                            }
                            if ((_c = meta === null || meta === void 0 ? void 0 : meta.parentNames) === null || _c === void 0 ? void 0 : _c.length) {
                                attributes["openclaw.logger.parents"] = meta.parentNames.join(".");
                            }
                            if (bindings) {
                                for (var _i = 0, _k = Object.entries(bindings); _i < _k.length; _i++) {
                                    var _l = _k[_i], key = _l[0], value = _l[1];
                                    if (typeof value === "string" ||
                                        typeof value === "number" ||
                                        typeof value === "boolean") {
                                        attributes["openclaw.".concat(key)] = value;
                                    }
                                    else if (value != null) {
                                        attributes["openclaw.".concat(key)] = safeStringify(value);
                                    }
                                }
                            }
                            if (numericArgs.length > 0) {
                                attributes["openclaw.log.args"] = safeStringify(numericArgs);
                            }
                            if ((_d = meta === null || meta === void 0 ? void 0 : meta.path) === null || _d === void 0 ? void 0 : _d.filePath) {
                                attributes["code.filepath"] = meta.path.filePath;
                            }
                            if ((_e = meta === null || meta === void 0 ? void 0 : meta.path) === null || _e === void 0 ? void 0 : _e.fileLine) {
                                attributes["code.lineno"] = Number(meta.path.fileLine);
                            }
                            if ((_f = meta === null || meta === void 0 ? void 0 : meta.path) === null || _f === void 0 ? void 0 : _f.method) {
                                attributes["code.function"] = meta.path.method;
                            }
                            if ((_g = meta === null || meta === void 0 ? void 0 : meta.path) === null || _g === void 0 ? void 0 : _g.filePathWithLine) {
                                attributes["openclaw.code.location"] = meta.path.filePathWithLine;
                            }
                            otelLogger_1.emit({
                                body: message,
                                severityText: logLevelName,
                                severityNumber: severityNumber,
                                attributes: attributes,
                                timestamp: (_h = meta === null || meta === void 0 ? void 0 : meta.date) !== null && _h !== void 0 ? _h : new Date(),
                            });
                        });
                    }
                    spanWithDuration = function (name, attributes, durationMs) {
                        var startTime = typeof durationMs === "number" ? Date.now() - Math.max(0, durationMs) : undefined;
                        var span = tracer.startSpan(name, __assign({ attributes: attributes }, (startTime ? { startTime: startTime } : {})));
                        return span;
                    };
                    recordModelUsage = function (evt) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                        var attrs = {
                            "openclaw.channel": (_a = evt.channel) !== null && _a !== void 0 ? _a : "unknown",
                            "openclaw.provider": (_b = evt.provider) !== null && _b !== void 0 ? _b : "unknown",
                            "openclaw.model": (_c = evt.model) !== null && _c !== void 0 ? _c : "unknown",
                        };
                        var usage = evt.usage;
                        if (usage.input) {
                            tokensCounter.add(usage.input, __assign(__assign({}, attrs), { "openclaw.token": "input" }));
                        }
                        if (usage.output) {
                            tokensCounter.add(usage.output, __assign(__assign({}, attrs), { "openclaw.token": "output" }));
                        }
                        if (usage.cacheRead) {
                            tokensCounter.add(usage.cacheRead, __assign(__assign({}, attrs), { "openclaw.token": "cache_read" }));
                        }
                        if (usage.cacheWrite) {
                            tokensCounter.add(usage.cacheWrite, __assign(__assign({}, attrs), { "openclaw.token": "cache_write" }));
                        }
                        if (usage.promptTokens) {
                            tokensCounter.add(usage.promptTokens, __assign(__assign({}, attrs), { "openclaw.token": "prompt" }));
                        }
                        if (usage.total) {
                            tokensCounter.add(usage.total, __assign(__assign({}, attrs), { "openclaw.token": "total" }));
                        }
                        if (evt.costUsd) {
                            costCounter.add(evt.costUsd, attrs);
                        }
                        if (evt.durationMs) {
                            durationHistogram.record(evt.durationMs, attrs);
                        }
                        if ((_d = evt.context) === null || _d === void 0 ? void 0 : _d.limit) {
                            contextHistogram.record(evt.context.limit, __assign(__assign({}, attrs), { "openclaw.context": "limit" }));
                        }
                        if ((_e = evt.context) === null || _e === void 0 ? void 0 : _e.used) {
                            contextHistogram.record(evt.context.used, __assign(__assign({}, attrs), { "openclaw.context": "used" }));
                        }
                        if (!tracesEnabled) {
                            return;
                        }
                        var spanAttrs = __assign(__assign({}, attrs), { "openclaw.sessionKey": (_f = evt.sessionKey) !== null && _f !== void 0 ? _f : "", "openclaw.sessionId": (_g = evt.sessionId) !== null && _g !== void 0 ? _g : "", "openclaw.tokens.input": (_h = usage.input) !== null && _h !== void 0 ? _h : 0, "openclaw.tokens.output": (_j = usage.output) !== null && _j !== void 0 ? _j : 0, "openclaw.tokens.cache_read": (_k = usage.cacheRead) !== null && _k !== void 0 ? _k : 0, "openclaw.tokens.cache_write": (_l = usage.cacheWrite) !== null && _l !== void 0 ? _l : 0, "openclaw.tokens.total": (_m = usage.total) !== null && _m !== void 0 ? _m : 0 });
                        var span = spanWithDuration("openclaw.model.usage", spanAttrs, evt.durationMs);
                        span.end();
                    };
                    recordWebhookReceived = function (evt) {
                        var _a, _b;
                        var attrs = {
                            "openclaw.channel": (_a = evt.channel) !== null && _a !== void 0 ? _a : "unknown",
                            "openclaw.webhook": (_b = evt.updateType) !== null && _b !== void 0 ? _b : "unknown",
                        };
                        webhookReceivedCounter.add(1, attrs);
                    };
                    recordWebhookProcessed = function (evt) {
                        var _a, _b;
                        var attrs = {
                            "openclaw.channel": (_a = evt.channel) !== null && _a !== void 0 ? _a : "unknown",
                            "openclaw.webhook": (_b = evt.updateType) !== null && _b !== void 0 ? _b : "unknown",
                        };
                        if (typeof evt.durationMs === "number") {
                            webhookDurationHistogram.record(evt.durationMs, attrs);
                        }
                        if (!tracesEnabled) {
                            return;
                        }
                        var spanAttrs = __assign({}, attrs);
                        if (evt.chatId !== undefined) {
                            spanAttrs["openclaw.chatId"] = String(evt.chatId);
                        }
                        var span = spanWithDuration("openclaw.webhook.processed", spanAttrs, evt.durationMs);
                        span.end();
                    };
                    recordWebhookError = function (evt) {
                        var _a, _b;
                        var attrs = {
                            "openclaw.channel": (_a = evt.channel) !== null && _a !== void 0 ? _a : "unknown",
                            "openclaw.webhook": (_b = evt.updateType) !== null && _b !== void 0 ? _b : "unknown",
                        };
                        webhookErrorCounter.add(1, attrs);
                        if (!tracesEnabled) {
                            return;
                        }
                        var spanAttrs = __assign(__assign({}, attrs), { "openclaw.error": evt.error });
                        if (evt.chatId !== undefined) {
                            spanAttrs["openclaw.chatId"] = String(evt.chatId);
                        }
                        var span = tracer.startSpan("openclaw.webhook.error", {
                            attributes: spanAttrs,
                        });
                        span.setStatus({ code: api_1.SpanStatusCode.ERROR, message: evt.error });
                        span.end();
                    };
                    recordMessageQueued = function (evt) {
                        var _a, _b;
                        var attrs = {
                            "openclaw.channel": (_a = evt.channel) !== null && _a !== void 0 ? _a : "unknown",
                            "openclaw.source": (_b = evt.source) !== null && _b !== void 0 ? _b : "unknown",
                        };
                        messageQueuedCounter.add(1, attrs);
                        if (typeof evt.queueDepth === "number") {
                            queueDepthHistogram.record(evt.queueDepth, attrs);
                        }
                    };
                    recordMessageProcessed = function (evt) {
                        var _a, _b;
                        var attrs = {
                            "openclaw.channel": (_a = evt.channel) !== null && _a !== void 0 ? _a : "unknown",
                            "openclaw.outcome": (_b = evt.outcome) !== null && _b !== void 0 ? _b : "unknown",
                        };
                        messageProcessedCounter.add(1, attrs);
                        if (typeof evt.durationMs === "number") {
                            messageDurationHistogram.record(evt.durationMs, attrs);
                        }
                        if (!tracesEnabled) {
                            return;
                        }
                        var spanAttrs = __assign({}, attrs);
                        if (evt.sessionKey) {
                            spanAttrs["openclaw.sessionKey"] = evt.sessionKey;
                        }
                        if (evt.sessionId) {
                            spanAttrs["openclaw.sessionId"] = evt.sessionId;
                        }
                        if (evt.chatId !== undefined) {
                            spanAttrs["openclaw.chatId"] = String(evt.chatId);
                        }
                        if (evt.messageId !== undefined) {
                            spanAttrs["openclaw.messageId"] = String(evt.messageId);
                        }
                        if (evt.reason) {
                            spanAttrs["openclaw.reason"] = evt.reason;
                        }
                        var span = spanWithDuration("openclaw.message.processed", spanAttrs, evt.durationMs);
                        if (evt.outcome === "error") {
                            span.setStatus({ code: api_1.SpanStatusCode.ERROR, message: evt.error });
                        }
                        span.end();
                    };
                    recordLaneEnqueue = function (evt) {
                        var attrs = { "openclaw.lane": evt.lane };
                        laneEnqueueCounter.add(1, attrs);
                        queueDepthHistogram.record(evt.queueSize, attrs);
                    };
                    recordLaneDequeue = function (evt) {
                        var attrs = { "openclaw.lane": evt.lane };
                        laneDequeueCounter.add(1, attrs);
                        queueDepthHistogram.record(evt.queueSize, attrs);
                        if (typeof evt.waitMs === "number") {
                            queueWaitHistogram.record(evt.waitMs, attrs);
                        }
                    };
                    recordSessionState = function (evt) {
                        var attrs = { "openclaw.state": evt.state };
                        if (evt.reason) {
                            attrs["openclaw.reason"] = evt.reason;
                        }
                        sessionStateCounter.add(1, attrs);
                    };
                    recordSessionStuck = function (evt) {
                        var _a;
                        var attrs = { "openclaw.state": evt.state };
                        sessionStuckCounter.add(1, attrs);
                        if (typeof evt.ageMs === "number") {
                            sessionStuckAgeHistogram.record(evt.ageMs, attrs);
                        }
                        if (!tracesEnabled) {
                            return;
                        }
                        var spanAttrs = __assign({}, attrs);
                        if (evt.sessionKey) {
                            spanAttrs["openclaw.sessionKey"] = evt.sessionKey;
                        }
                        if (evt.sessionId) {
                            spanAttrs["openclaw.sessionId"] = evt.sessionId;
                        }
                        spanAttrs["openclaw.queueDepth"] = (_a = evt.queueDepth) !== null && _a !== void 0 ? _a : 0;
                        spanAttrs["openclaw.ageMs"] = evt.ageMs;
                        var span = tracer.startSpan("openclaw.session.stuck", { attributes: spanAttrs });
                        span.setStatus({ code: api_1.SpanStatusCode.ERROR, message: "session stuck" });
                        span.end();
                    };
                    recordRunAttempt = function (evt) {
                        runAttemptCounter.add(1, { "openclaw.attempt": evt.attempt });
                    };
                    recordHeartbeat = function (evt) {
                        queueDepthHistogram.record(evt.queued, { "openclaw.channel": "heartbeat" });
                    };
                    unsubscribe = (0, plugin_sdk_1.onDiagnosticEvent)(function (evt) {
                        switch (evt.type) {
                            case "model.usage":
                                recordModelUsage(evt);
                                return;
                            case "webhook.received":
                                recordWebhookReceived(evt);
                                return;
                            case "webhook.processed":
                                recordWebhookProcessed(evt);
                                return;
                            case "webhook.error":
                                recordWebhookError(evt);
                                return;
                            case "message.queued":
                                recordMessageQueued(evt);
                                return;
                            case "message.processed":
                                recordMessageProcessed(evt);
                                return;
                            case "queue.lane.enqueue":
                                recordLaneEnqueue(evt);
                                return;
                            case "queue.lane.dequeue":
                                recordLaneDequeue(evt);
                                return;
                            case "session.state":
                                recordSessionState(evt);
                                return;
                            case "session.stuck":
                                recordSessionStuck(evt);
                                return;
                            case "run.attempt":
                                recordRunAttempt(evt);
                                return;
                            case "diagnostic.heartbeat":
                                recordHeartbeat(evt);
                                return;
                        }
                    });
                    if (logsEnabled) {
                        ctx.logger.info("diagnostics-otel: logs exporter enabled (OTLP/HTTP)");
                    }
                    return [2 /*return*/];
                });
            });
        },
        stop: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            unsubscribe === null || unsubscribe === void 0 ? void 0 : unsubscribe();
                            unsubscribe = null;
                            stopLogTransport === null || stopLogTransport === void 0 ? void 0 : stopLogTransport();
                            stopLogTransport = null;
                            if (!logProvider) return [3 /*break*/, 2];
                            return [4 /*yield*/, logProvider.shutdown().catch(function () { return undefined; })];
                        case 1:
                            _a.sent();
                            logProvider = null;
                            _a.label = 2;
                        case 2:
                            if (!sdk) return [3 /*break*/, 4];
                            return [4 /*yield*/, sdk.shutdown().catch(function () { return undefined; })];
                        case 3:
                            _a.sent();
                            sdk = null;
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
    };
}
