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
var vitest_1 = require("vitest");
var registerLogTransportMock = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(); });
var telemetryState = vitest_1.vi.hoisted(function () {
    var counters = new Map();
    var histograms = new Map();
    var tracer = {
        startSpan: vitest_1.vi.fn(function (_name, _opts) { return ({
            end: vitest_1.vi.fn(),
            setStatus: vitest_1.vi.fn(),
        }); }),
    };
    var meter = {
        createCounter: vitest_1.vi.fn(function (name) {
            var counter = { add: vitest_1.vi.fn() };
            counters.set(name, counter);
            return counter;
        }),
        createHistogram: vitest_1.vi.fn(function (name) {
            var histogram = { record: vitest_1.vi.fn() };
            histograms.set(name, histogram);
            return histogram;
        }),
    };
    return { counters: counters, histograms: histograms, tracer: tracer, meter: meter };
});
var sdkStart = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn().mockResolvedValue(undefined); });
var sdkShutdown = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn().mockResolvedValue(undefined); });
var logEmit = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(); });
var logShutdown = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn().mockResolvedValue(undefined); });
vitest_1.vi.mock("@opentelemetry/api", function () { return ({
    metrics: {
        getMeter: function () { return telemetryState.meter; },
    },
    trace: {
        getTracer: function () { return telemetryState.tracer; },
    },
    SpanStatusCode: {
        ERROR: 2,
    },
}); });
vitest_1.vi.mock("@opentelemetry/sdk-node", function () { return ({
    NodeSDK: /** @class */ (function () {
        function class_1() {
            this.start = sdkStart;
            this.shutdown = sdkShutdown;
        }
        return class_1;
    }()),
}); });
vitest_1.vi.mock("@opentelemetry/exporter-metrics-otlp-http", function () { return ({
    OTLPMetricExporter: /** @class */ (function () {
        function OTLPMetricExporter() {
        }
        return OTLPMetricExporter;
    }()),
}); });
vitest_1.vi.mock("@opentelemetry/exporter-trace-otlp-http", function () { return ({
    OTLPTraceExporter: /** @class */ (function () {
        function OTLPTraceExporter() {
        }
        return OTLPTraceExporter;
    }()),
}); });
vitest_1.vi.mock("@opentelemetry/exporter-logs-otlp-http", function () { return ({
    OTLPLogExporter: /** @class */ (function () {
        function OTLPLogExporter() {
        }
        return OTLPLogExporter;
    }()),
}); });
vitest_1.vi.mock("@opentelemetry/sdk-logs", function () { return ({
    BatchLogRecordProcessor: /** @class */ (function () {
        function BatchLogRecordProcessor() {
        }
        return BatchLogRecordProcessor;
    }()),
    LoggerProvider: /** @class */ (function () {
        function class_2() {
            this.addLogRecordProcessor = vitest_1.vi.fn();
            this.getLogger = vitest_1.vi.fn(function () { return ({
                emit: logEmit,
            }); });
            this.shutdown = logShutdown;
        }
        return class_2;
    }()),
}); });
vitest_1.vi.mock("@opentelemetry/sdk-metrics", function () { return ({
    PeriodicExportingMetricReader: /** @class */ (function () {
        function PeriodicExportingMetricReader() {
        }
        return PeriodicExportingMetricReader;
    }()),
}); });
vitest_1.vi.mock("@opentelemetry/sdk-trace-base", function () { return ({
    ParentBasedSampler: /** @class */ (function () {
        function ParentBasedSampler() {
        }
        return ParentBasedSampler;
    }()),
    TraceIdRatioBasedSampler: /** @class */ (function () {
        function TraceIdRatioBasedSampler() {
        }
        return TraceIdRatioBasedSampler;
    }()),
}); });
vitest_1.vi.mock("@opentelemetry/resources", function () { return ({
    Resource: /** @class */ (function () {
        // eslint-disable-next-line @typescript-eslint/no-useless-constructor
        function class_3(_value) {
        }
        return class_3;
    }()),
}); });
vitest_1.vi.mock("@opentelemetry/semantic-conventions", function () { return ({
    SemanticResourceAttributes: {
        SERVICE_NAME: "service.name",
    },
}); });
vitest_1.vi.mock("openclaw/plugin-sdk", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("openclaw/plugin-sdk")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { registerLogTransport: registerLogTransportMock })];
        }
    });
}); });
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var service_js_1 = require("./service.js");
(0, vitest_1.describe)("diagnostics-otel service", function () {
    (0, vitest_1.beforeEach)(function () {
        telemetryState.counters.clear();
        telemetryState.histograms.clear();
        telemetryState.tracer.startSpan.mockClear();
        telemetryState.meter.createCounter.mockClear();
        telemetryState.meter.createHistogram.mockClear();
        sdkStart.mockClear();
        sdkShutdown.mockClear();
        logEmit.mockClear();
        logShutdown.mockClear();
        registerLogTransportMock.mockReset();
    });
    (0, vitest_1.test)("records message-flow metrics and spans", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registeredTransports, stopTransport, service, spanNames;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    registeredTransports = [];
                    stopTransport = vitest_1.vi.fn();
                    registerLogTransportMock.mockImplementation(function (transport) {
                        registeredTransports.push(transport);
                        return stopTransport;
                    });
                    service = (0, service_js_1.createDiagnosticsOtelService)();
                    return [4 /*yield*/, service.start({
                            config: {
                                diagnostics: {
                                    enabled: true,
                                    otel: {
                                        enabled: true,
                                        endpoint: "http://otel-collector:4318",
                                        protocol: "http/protobuf",
                                        traces: true,
                                        metrics: true,
                                        logs: true,
                                    },
                                },
                            },
                            logger: {
                                info: vitest_1.vi.fn(),
                                warn: vitest_1.vi.fn(),
                                error: vitest_1.vi.fn(),
                                debug: vitest_1.vi.fn(),
                            },
                        })];
                case 1:
                    _m.sent();
                    (0, plugin_sdk_1.emitDiagnosticEvent)({
                        type: "webhook.received",
                        channel: "telegram",
                        updateType: "telegram-post",
                    });
                    (0, plugin_sdk_1.emitDiagnosticEvent)({
                        type: "webhook.processed",
                        channel: "telegram",
                        updateType: "telegram-post",
                        durationMs: 120,
                    });
                    (0, plugin_sdk_1.emitDiagnosticEvent)({
                        type: "message.queued",
                        channel: "telegram",
                        source: "telegram",
                        queueDepth: 2,
                    });
                    (0, plugin_sdk_1.emitDiagnosticEvent)({
                        type: "message.processed",
                        channel: "telegram",
                        outcome: "completed",
                        durationMs: 55,
                    });
                    (0, plugin_sdk_1.emitDiagnosticEvent)({
                        type: "queue.lane.dequeue",
                        lane: "main",
                        queueSize: 3,
                        waitMs: 10,
                    });
                    (0, plugin_sdk_1.emitDiagnosticEvent)({
                        type: "session.stuck",
                        state: "processing",
                        ageMs: 125000,
                    });
                    (0, plugin_sdk_1.emitDiagnosticEvent)({
                        type: "run.attempt",
                        runId: "run-1",
                        attempt: 2,
                    });
                    (0, vitest_1.expect)((_a = telemetryState.counters.get("openclaw.webhook.received")) === null || _a === void 0 ? void 0 : _a.add).toHaveBeenCalled();
                    (0, vitest_1.expect)((_b = telemetryState.histograms.get("openclaw.webhook.duration_ms")) === null || _b === void 0 ? void 0 : _b.record).toHaveBeenCalled();
                    (0, vitest_1.expect)((_c = telemetryState.counters.get("openclaw.message.queued")) === null || _c === void 0 ? void 0 : _c.add).toHaveBeenCalled();
                    (0, vitest_1.expect)((_d = telemetryState.counters.get("openclaw.message.processed")) === null || _d === void 0 ? void 0 : _d.add).toHaveBeenCalled();
                    (0, vitest_1.expect)((_e = telemetryState.histograms.get("openclaw.message.duration_ms")) === null || _e === void 0 ? void 0 : _e.record).toHaveBeenCalled();
                    (0, vitest_1.expect)((_f = telemetryState.histograms.get("openclaw.queue.wait_ms")) === null || _f === void 0 ? void 0 : _f.record).toHaveBeenCalled();
                    (0, vitest_1.expect)((_g = telemetryState.counters.get("openclaw.session.stuck")) === null || _g === void 0 ? void 0 : _g.add).toHaveBeenCalled();
                    (0, vitest_1.expect)((_h = telemetryState.histograms.get("openclaw.session.stuck_age_ms")) === null || _h === void 0 ? void 0 : _h.record).toHaveBeenCalled();
                    (0, vitest_1.expect)((_j = telemetryState.counters.get("openclaw.run.attempt")) === null || _j === void 0 ? void 0 : _j.add).toHaveBeenCalled();
                    spanNames = telemetryState.tracer.startSpan.mock.calls.map(function (call) { return call[0]; });
                    (0, vitest_1.expect)(spanNames).toContain("openclaw.webhook.processed");
                    (0, vitest_1.expect)(spanNames).toContain("openclaw.message.processed");
                    (0, vitest_1.expect)(spanNames).toContain("openclaw.session.stuck");
                    (0, vitest_1.expect)(registerLogTransportMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(registeredTransports).toHaveLength(1);
                    (_k = registeredTransports[0]) === null || _k === void 0 ? void 0 : _k.call(registeredTransports, {
                        0: '{"subsystem":"diagnostic"}',
                        1: "hello",
                        _meta: { logLevelName: "INFO", date: new Date() },
                    });
                    (0, vitest_1.expect)(logEmit).toHaveBeenCalled();
                    return [4 /*yield*/, ((_l = service.stop) === null || _l === void 0 ? void 0 : _l.call(service))];
                case 2:
                    _m.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
