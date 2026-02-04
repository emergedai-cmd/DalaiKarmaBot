"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.renderCron = renderCron;
var lit_1 = require("lit");
var format_1 = require("../format");
var presenter_1 = require("../presenter");
function buildChannelOptions(props) {
    var _a;
    var options = __spreadArray(["last"], props.channels.filter(Boolean), true);
    var current = (_a = props.form.channel) === null || _a === void 0 ? void 0 : _a.trim();
    if (current && !options.includes(current)) {
        options.push(current);
    }
    var seen = new Set();
    return options.filter(function (value) {
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
}
function resolveChannelLabel(props, channel) {
    var _a, _b, _c;
    if (channel === "last") {
        return "last";
    }
    var meta = (_a = props.channelMeta) === null || _a === void 0 ? void 0 : _a.find(function (entry) { return entry.id === channel; });
    if (meta === null || meta === void 0 ? void 0 : meta.label) {
        return meta.label;
    }
    return (_c = (_b = props.channelLabels) === null || _b === void 0 ? void 0 : _b[channel]) !== null && _c !== void 0 ? _c : channel;
}
function renderCron(props) {
    var _a, _b, _c, _d, _e;
    var channelOptions = buildChannelOptions(props);
    return (0, lit_1.html)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n    <section class=\"grid grid-cols-2\">\n      <div class=\"card\">\n        <div class=\"card-title\">Scheduler</div>\n        <div class=\"card-sub\">Gateway-owned cron scheduler status.</div>\n        <div class=\"stat-grid\" style=\"margin-top: 16px;\">\n          <div class=\"stat\">\n            <div class=\"stat-label\">Enabled</div>\n            <div class=\"stat-value\">\n              ", "\n            </div>\n          </div>\n          <div class=\"stat\">\n            <div class=\"stat-label\">Jobs</div>\n            <div class=\"stat-value\">", "</div>\n          </div>\n          <div class=\"stat\">\n            <div class=\"stat-label\">Next wake</div>\n            <div class=\"stat-value\">", "</div>\n          </div>\n        </div>\n        <div class=\"row\" style=\"margin-top: 12px;\">\n          <button class=\"btn\" ?disabled=", " @click=", ">\n            ", "\n          </button>\n          ", "\n        </div>\n      </div>\n\n      <div class=\"card\">\n        <div class=\"card-title\">New Job</div>\n        <div class=\"card-sub\">Create a scheduled wakeup or agent run.</div>\n        <div class=\"form-grid\" style=\"margin-top: 16px;\">\n          <label class=\"field\">\n            <span>Name</span>\n            <input\n              .value=", "\n              @input=", "\n            />\n          </label>\n          <label class=\"field\">\n            <span>Description</span>\n            <input\n              .value=", "\n              @input=", "\n            />\n          </label>\n          <label class=\"field\">\n            <span>Agent ID</span>\n            <input\n              .value=", "\n              @input=", "\n              placeholder=\"default\"\n            />\n          </label>\n          <label class=\"field checkbox\">\n            <span>Enabled</span>\n            <input\n              type=\"checkbox\"\n              .checked=", "\n              @change=", "\n            />\n          </label>\n          <label class=\"field\">\n            <span>Schedule</span>\n            <select\n              .value=", "\n              @change=", "\n            >\n              <option value=\"every\">Every</option>\n              <option value=\"at\">At</option>\n              <option value=\"cron\">Cron</option>\n            </select>\n          </label>\n        </div>\n        ", "\n        <div class=\"form-grid\" style=\"margin-top: 12px;\">\n          <label class=\"field\">\n            <span>Session</span>\n            <select\n              .value=", "\n              @change=", "\n            >\n              <option value=\"main\">Main</option>\n              <option value=\"isolated\">Isolated</option>\n            </select>\n          </label>\n          <label class=\"field\">\n            <span>Wake mode</span>\n            <select\n              .value=", "\n              @change=", "\n            >\n              <option value=\"next-heartbeat\">Next heartbeat</option>\n              <option value=\"now\">Now</option>\n            </select>\n          </label>\n          <label class=\"field\">\n            <span>Payload</span>\n            <select\n              .value=", "\n              @change=", "\n            >\n              <option value=\"systemEvent\">System event</option>\n              <option value=\"agentTurn\">Agent turn</option>\n            </select>\n          </label>\n        </div>\n        <label class=\"field\" style=\"margin-top: 12px;\">\n          <span>", "</span>\n          <textarea\n            .value=", "\n            @input=", "\n            rows=\"4\"\n          ></textarea>\n        </label>\n\t          ", "\n        <div class=\"row\" style=\"margin-top: 14px;\">\n          <button class=\"btn primary\" ?disabled=", " @click=", ">\n            ", "\n          </button>\n        </div>\n      </div>\n    </section>\n\n    <section class=\"card\" style=\"margin-top: 18px;\">\n      <div class=\"card-title\">Jobs</div>\n      <div class=\"card-sub\">All scheduled jobs stored in the gateway.</div>\n      ", "\n    </section>\n\n    <section class=\"card\" style=\"margin-top: 18px;\">\n      <div class=\"card-title\">Run history</div>\n      <div class=\"card-sub\">Latest runs for ", ".</div>\n      ", "\n    </section>\n  "], ["\n    <section class=\"grid grid-cols-2\">\n      <div class=\"card\">\n        <div class=\"card-title\">Scheduler</div>\n        <div class=\"card-sub\">Gateway-owned cron scheduler status.</div>\n        <div class=\"stat-grid\" style=\"margin-top: 16px;\">\n          <div class=\"stat\">\n            <div class=\"stat-label\">Enabled</div>\n            <div class=\"stat-value\">\n              ", "\n            </div>\n          </div>\n          <div class=\"stat\">\n            <div class=\"stat-label\">Jobs</div>\n            <div class=\"stat-value\">", "</div>\n          </div>\n          <div class=\"stat\">\n            <div class=\"stat-label\">Next wake</div>\n            <div class=\"stat-value\">", "</div>\n          </div>\n        </div>\n        <div class=\"row\" style=\"margin-top: 12px;\">\n          <button class=\"btn\" ?disabled=", " @click=", ">\n            ", "\n          </button>\n          ", "\n        </div>\n      </div>\n\n      <div class=\"card\">\n        <div class=\"card-title\">New Job</div>\n        <div class=\"card-sub\">Create a scheduled wakeup or agent run.</div>\n        <div class=\"form-grid\" style=\"margin-top: 16px;\">\n          <label class=\"field\">\n            <span>Name</span>\n            <input\n              .value=", "\n              @input=", "\n            />\n          </label>\n          <label class=\"field\">\n            <span>Description</span>\n            <input\n              .value=", "\n              @input=", "\n            />\n          </label>\n          <label class=\"field\">\n            <span>Agent ID</span>\n            <input\n              .value=", "\n              @input=", "\n              placeholder=\"default\"\n            />\n          </label>\n          <label class=\"field checkbox\">\n            <span>Enabled</span>\n            <input\n              type=\"checkbox\"\n              .checked=", "\n              @change=", "\n            />\n          </label>\n          <label class=\"field\">\n            <span>Schedule</span>\n            <select\n              .value=", "\n              @change=", "\n            >\n              <option value=\"every\">Every</option>\n              <option value=\"at\">At</option>\n              <option value=\"cron\">Cron</option>\n            </select>\n          </label>\n        </div>\n        ", "\n        <div class=\"form-grid\" style=\"margin-top: 12px;\">\n          <label class=\"field\">\n            <span>Session</span>\n            <select\n              .value=", "\n              @change=", "\n            >\n              <option value=\"main\">Main</option>\n              <option value=\"isolated\">Isolated</option>\n            </select>\n          </label>\n          <label class=\"field\">\n            <span>Wake mode</span>\n            <select\n              .value=", "\n              @change=", "\n            >\n              <option value=\"next-heartbeat\">Next heartbeat</option>\n              <option value=\"now\">Now</option>\n            </select>\n          </label>\n          <label class=\"field\">\n            <span>Payload</span>\n            <select\n              .value=", "\n              @change=", "\n            >\n              <option value=\"systemEvent\">System event</option>\n              <option value=\"agentTurn\">Agent turn</option>\n            </select>\n          </label>\n        </div>\n        <label class=\"field\" style=\"margin-top: 12px;\">\n          <span>", "</span>\n          <textarea\n            .value=", "\n            @input=", "\n            rows=\"4\"\n          ></textarea>\n        </label>\n\t          ", "\n        <div class=\"row\" style=\"margin-top: 14px;\">\n          <button class=\"btn primary\" ?disabled=", " @click=", ">\n            ", "\n          </button>\n        </div>\n      </div>\n    </section>\n\n    <section class=\"card\" style=\"margin-top: 18px;\">\n      <div class=\"card-title\">Jobs</div>\n      <div class=\"card-sub\">All scheduled jobs stored in the gateway.</div>\n      ", "\n    </section>\n\n    <section class=\"card\" style=\"margin-top: 18px;\">\n      <div class=\"card-title\">Run history</div>\n      <div class=\"card-sub\">Latest runs for ", ".</div>\n      ", "\n    </section>\n  "])), props.status ? (props.status.enabled ? "Yes" : "No") : "n/a", (_b = (_a = props.status) === null || _a === void 0 ? void 0 : _a.jobs) !== null && _b !== void 0 ? _b : "n/a", (0, presenter_1.formatNextRun)((_d = (_c = props.status) === null || _c === void 0 ? void 0 : _c.nextWakeAtMs) !== null && _d !== void 0 ? _d : null), props.loading, props.onRefresh, props.loading ? "Refreshing…" : "Refresh", props.error ? (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<span class=\"muted\">", "</span>"], ["<span class=\"muted\">", "</span>"])), props.error) : lit_1.nothing, props.form.name, function (e) {
        return props.onFormChange({ name: e.target.value });
    }, props.form.description, function (e) {
        return props.onFormChange({ description: e.target.value });
    }, props.form.agentId, function (e) {
        return props.onFormChange({ agentId: e.target.value });
    }, props.form.enabled, function (e) {
        return props.onFormChange({ enabled: e.target.checked });
    }, props.form.scheduleKind, function (e) {
        return props.onFormChange({
            scheduleKind: e.target
                .value,
        });
    }, renderScheduleFields(props), props.form.sessionTarget, function (e) {
        return props.onFormChange({
            sessionTarget: e.target
                .value,
        });
    }, props.form.wakeMode, function (e) {
        return props.onFormChange({
            wakeMode: e.target.value,
        });
    }, props.form.payloadKind, function (e) {
        return props.onFormChange({
            payloadKind: e.target
                .value,
        });
    }, props.form.payloadKind === "systemEvent" ? "System text" : "Agent message", props.form.payloadText, function (e) {
        return props.onFormChange({
            payloadText: e.target.value,
        });
    }, props.form.payloadKind === "agentTurn"
        ? (0, lit_1.html)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n\t              <div class=\"form-grid\" style=\"margin-top: 12px;\">\n                <label class=\"field checkbox\">\n                  <span>Deliver</span>\n                  <input\n                    type=\"checkbox\"\n                    .checked=", "\n                    @change=", "\n                  />\n\t                </label>\n\t                <label class=\"field\">\n\t                  <span>Channel</span>\n\t                  <select\n\t                    .value=", "\n\t                    @change=", "\n\t                  >\n\t                    ", "\n                  </select>\n                </label>\n                <label class=\"field\">\n                  <span>To</span>\n                  <input\n                    .value=", "\n                    @input=", "\n                    placeholder=\"+1555\u2026 or chat id\"\n                  />\n                </label>\n                <label class=\"field\">\n                  <span>Timeout (seconds)</span>\n                  <input\n                    .value=", "\n                    @input=", "\n                  />\n                </label>\n                ", "\n              </div>\n            "], ["\n\t              <div class=\"form-grid\" style=\"margin-top: 12px;\">\n                <label class=\"field checkbox\">\n                  <span>Deliver</span>\n                  <input\n                    type=\"checkbox\"\n                    .checked=", "\n                    @change=", "\n                  />\n\t                </label>\n\t                <label class=\"field\">\n\t                  <span>Channel</span>\n\t                  <select\n\t                    .value=", "\n\t                    @change=", "\n\t                  >\n\t                    ", "\n                  </select>\n                </label>\n                <label class=\"field\">\n                  <span>To</span>\n                  <input\n                    .value=", "\n                    @input=", "\n                    placeholder=\"+1555\u2026 or chat id\"\n                  />\n                </label>\n                <label class=\"field\">\n                  <span>Timeout (seconds)</span>\n                  <input\n                    .value=", "\n                    @input=", "\n                  />\n                </label>\n                ", "\n              </div>\n            "])), props.form.deliver, function (e) {
            return props.onFormChange({
                deliver: e.target.checked,
            });
        }, props.form.channel || "last", function (e) {
            return props.onFormChange({
                channel: e.target.value,
            });
        }, channelOptions.map(function (channel) {
            return (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<option value=", ">\n                            ", "\n                          </option>"], ["<option value=", ">\n                            ", "\n                          </option>"])), channel, resolveChannelLabel(props, channel));
        }), props.form.to, function (e) {
            return props.onFormChange({ to: e.target.value });
        }, props.form.timeoutSeconds, function (e) {
            return props.onFormChange({
                timeoutSeconds: e.target.value,
            });
        }, props.form.sessionTarget === "isolated"
            ? (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n                      <label class=\"field\">\n                        <span>Post to main prefix</span>\n                        <input\n                          .value=", "\n                          @input=", "\n                        />\n                      </label>\n                    "], ["\n                      <label class=\"field\">\n                        <span>Post to main prefix</span>\n                        <input\n                          .value=", "\n                          @input=", "\n                        />\n                      </label>\n                    "])), props.form.postToMainPrefix, function (e) {
                return props.onFormChange({
                    postToMainPrefix: e.target.value,
                });
            }) : lit_1.nothing) : lit_1.nothing, props.busy, props.onAdd, props.busy ? "Saving…" : "Add job", props.jobs.length === 0
        ? (0, lit_1.html)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n              <div class=\"muted\" style=\"margin-top: 12px\">No jobs yet.</div>\n            "], ["\n              <div class=\"muted\" style=\"margin-top: 12px\">No jobs yet.</div>\n            "]))) : (0, lit_1.html)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n            <div class=\"list\" style=\"margin-top: 12px;\">\n              ", "\n            </div>\n          "], ["\n            <div class=\"list\" style=\"margin-top: 12px;\">\n              ", "\n            </div>\n          "])), props.jobs.map(function (job) { return renderJob(job, props); })), (_e = props.runsJobId) !== null && _e !== void 0 ? _e : "(select a job)", props.runsJobId == null
        ? (0, lit_1.html)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n              <div class=\"muted\" style=\"margin-top: 12px\">Select a job to inspect run history.</div>\n            "], ["\n              <div class=\"muted\" style=\"margin-top: 12px\">Select a job to inspect run history.</div>\n            "]))) : props.runs.length === 0
        ? (0, lit_1.html)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n                <div class=\"muted\" style=\"margin-top: 12px\">No runs yet.</div>\n              "], ["\n                <div class=\"muted\" style=\"margin-top: 12px\">No runs yet.</div>\n              "]))) : (0, lit_1.html)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n              <div class=\"list\" style=\"margin-top: 12px;\">\n                ", "\n              </div>\n            "], ["\n              <div class=\"list\" style=\"margin-top: 12px;\">\n                ", "\n              </div>\n            "])), props.runs.map(function (entry) { return renderRun(entry); })));
}
function renderScheduleFields(props) {
    var form = props.form;
    if (form.scheduleKind === "at") {
        return (0, lit_1.html)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n      <label class=\"field\" style=\"margin-top: 12px;\">\n        <span>Run at</span>\n        <input\n          type=\"datetime-local\"\n          .value=", "\n          @input=", "\n        />\n      </label>\n    "], ["\n      <label class=\"field\" style=\"margin-top: 12px;\">\n        <span>Run at</span>\n        <input\n          type=\"datetime-local\"\n          .value=", "\n          @input=", "\n        />\n      </label>\n    "])), form.scheduleAt, function (e) {
            return props.onFormChange({
                scheduleAt: e.target.value,
            });
        });
    }
    if (form.scheduleKind === "every") {
        return (0, lit_1.html)(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n      <div class=\"form-grid\" style=\"margin-top: 12px;\">\n        <label class=\"field\">\n          <span>Every</span>\n          <input\n            .value=", "\n            @input=", "\n          />\n        </label>\n        <label class=\"field\">\n          <span>Unit</span>\n          <select\n            .value=", "\n            @change=", "\n          >\n            <option value=\"minutes\">Minutes</option>\n            <option value=\"hours\">Hours</option>\n            <option value=\"days\">Days</option>\n          </select>\n        </label>\n      </div>\n    "], ["\n      <div class=\"form-grid\" style=\"margin-top: 12px;\">\n        <label class=\"field\">\n          <span>Every</span>\n          <input\n            .value=", "\n            @input=", "\n          />\n        </label>\n        <label class=\"field\">\n          <span>Unit</span>\n          <select\n            .value=", "\n            @change=", "\n          >\n            <option value=\"minutes\">Minutes</option>\n            <option value=\"hours\">Hours</option>\n            <option value=\"days\">Days</option>\n          </select>\n        </label>\n      </div>\n    "])), form.everyAmount, function (e) {
            return props.onFormChange({
                everyAmount: e.target.value,
            });
        }, form.everyUnit, function (e) {
            return props.onFormChange({
                everyUnit: e.target.value,
            });
        });
    }
    return (0, lit_1.html)(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n    <div class=\"form-grid\" style=\"margin-top: 12px;\">\n      <label class=\"field\">\n        <span>Expression</span>\n        <input\n          .value=", "\n          @input=", "\n        />\n      </label>\n      <label class=\"field\">\n        <span>Timezone (optional)</span>\n        <input\n          .value=", "\n          @input=", "\n        />\n      </label>\n    </div>\n  "], ["\n    <div class=\"form-grid\" style=\"margin-top: 12px;\">\n      <label class=\"field\">\n        <span>Expression</span>\n        <input\n          .value=", "\n          @input=", "\n        />\n      </label>\n      <label class=\"field\">\n        <span>Timezone (optional)</span>\n        <input\n          .value=", "\n          @input=", "\n        />\n      </label>\n    </div>\n  "])), form.cronExpr, function (e) {
        return props.onFormChange({ cronExpr: e.target.value });
    }, form.cronTz, function (e) {
        return props.onFormChange({ cronTz: e.target.value });
    });
}
function renderJob(job, props) {
    var isSelected = props.runsJobId === job.id;
    var itemClass = "list-item list-item-clickable".concat(isSelected ? " list-item-selected" : "");
    return (0, lit_1.html)(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n    <div class=", " @click=", ">\n      <div class=\"list-main\">\n        <div class=\"list-title\">", "</div>\n        <div class=\"list-sub\">", "</div>\n        <div class=\"muted\">", "</div>\n        ", "\n        <div class=\"chip-row\" style=\"margin-top: 6px;\">\n          <span class=\"chip\">", "</span>\n          <span class=\"chip\">", "</span>\n          <span class=\"chip\">", "</span>\n        </div>\n      </div>\n      <div class=\"list-meta\">\n        <div>", "</div>\n        <div class=\"row\" style=\"justify-content: flex-end; margin-top: 8px;\">\n          <button\n            class=\"btn\"\n            ?disabled=", "\n            @click=", "\n          >\n            ", "\n          </button>\n          <button\n            class=\"btn\"\n            ?disabled=", "\n            @click=", "\n          >\n            Run\n          </button>\n          <button\n            class=\"btn\"\n            ?disabled=", "\n            @click=", "\n          >\n            Runs\n          </button>\n          <button\n            class=\"btn danger\"\n            ?disabled=", "\n            @click=", "\n          >\n            Remove\n          </button>\n        </div>\n      </div>\n    </div>\n  "], ["\n    <div class=", " @click=", ">\n      <div class=\"list-main\">\n        <div class=\"list-title\">", "</div>\n        <div class=\"list-sub\">", "</div>\n        <div class=\"muted\">", "</div>\n        ", "\n        <div class=\"chip-row\" style=\"margin-top: 6px;\">\n          <span class=\"chip\">", "</span>\n          <span class=\"chip\">", "</span>\n          <span class=\"chip\">", "</span>\n        </div>\n      </div>\n      <div class=\"list-meta\">\n        <div>", "</div>\n        <div class=\"row\" style=\"justify-content: flex-end; margin-top: 8px;\">\n          <button\n            class=\"btn\"\n            ?disabled=", "\n            @click=", "\n          >\n            ", "\n          </button>\n          <button\n            class=\"btn\"\n            ?disabled=", "\n            @click=", "\n          >\n            Run\n          </button>\n          <button\n            class=\"btn\"\n            ?disabled=", "\n            @click=", "\n          >\n            Runs\n          </button>\n          <button\n            class=\"btn danger\"\n            ?disabled=", "\n            @click=", "\n          >\n            Remove\n          </button>\n        </div>\n      </div>\n    </div>\n  "])), itemClass, function () { return props.onLoadRuns(job.id); }, job.name, (0, presenter_1.formatCronSchedule)(job), (0, presenter_1.formatCronPayload)(job), job.agentId ? (0, lit_1.html)(templateObject_14 || (templateObject_14 = __makeTemplateObject(["<div class=\"muted\">Agent: ", "</div>"], ["<div class=\"muted\">Agent: ", "</div>"])), job.agentId) : lit_1.nothing, job.enabled ? "enabled" : "disabled", job.sessionTarget, job.wakeMode, (0, presenter_1.formatCronState)(job), props.busy, function (event) {
        event.stopPropagation();
        props.onToggle(job, !job.enabled);
    }, job.enabled ? "Disable" : "Enable", props.busy, function (event) {
        event.stopPropagation();
        props.onRun(job);
    }, props.busy, function (event) {
        event.stopPropagation();
        props.onLoadRuns(job.id);
    }, props.busy, function (event) {
        event.stopPropagation();
        props.onRemove(job);
    });
}
function renderRun(entry) {
    var _a, _b;
    return (0, lit_1.html)(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n    <div class=\"list-item\">\n      <div class=\"list-main\">\n        <div class=\"list-title\">", "</div>\n        <div class=\"list-sub\">", "</div>\n      </div>\n      <div class=\"list-meta\">\n        <div>", "</div>\n        <div class=\"muted\">", "ms</div>\n        ", "\n      </div>\n    </div>\n  "], ["\n    <div class=\"list-item\">\n      <div class=\"list-main\">\n        <div class=\"list-title\">", "</div>\n        <div class=\"list-sub\">", "</div>\n      </div>\n      <div class=\"list-meta\">\n        <div>", "</div>\n        <div class=\"muted\">", "ms</div>\n        ", "\n      </div>\n    </div>\n  "])), entry.status, (_a = entry.summary) !== null && _a !== void 0 ? _a : "", (0, format_1.formatMs)(entry.ts), (_b = entry.durationMs) !== null && _b !== void 0 ? _b : 0, entry.error ? (0, lit_1.html)(templateObject_16 || (templateObject_16 = __makeTemplateObject(["<div class=\"muted\">", "</div>"], ["<div class=\"muted\">", "</div>"])), entry.error) : lit_1.nothing);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17;
