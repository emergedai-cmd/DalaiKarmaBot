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
exports.renderNodes = renderNodes;
var lit_1 = require("lit");
var format_1 = require("../format");
function renderNodes(props) {
    var bindingState = resolveBindingsState(props);
    var approvalsState = resolveExecApprovalsState(props);
    return (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    ", "\n    ", "\n    ", "\n    <section class=\"card\">\n      <div class=\"row\" style=\"justify-content: space-between;\">\n        <div>\n          <div class=\"card-title\">Nodes</div>\n          <div class=\"card-sub\">Paired devices and live links.</div>\n        </div>\n        <button class=\"btn\" ?disabled=", " @click=", ">\n          ", "\n        </button>\n      </div>\n      <div class=\"list\" style=\"margin-top: 16px;\">\n        ", "\n      </div>\n    </section>\n  "], ["\n    ", "\n    ", "\n    ", "\n    <section class=\"card\">\n      <div class=\"row\" style=\"justify-content: space-between;\">\n        <div>\n          <div class=\"card-title\">Nodes</div>\n          <div class=\"card-sub\">Paired devices and live links.</div>\n        </div>\n        <button class=\"btn\" ?disabled=", " @click=", ">\n          ", "\n        </button>\n      </div>\n      <div class=\"list\" style=\"margin-top: 16px;\">\n        ", "\n      </div>\n    </section>\n  "])), renderExecApprovals(approvalsState), renderBindings(bindingState), renderDevices(props), props.loading, props.onRefresh, props.loading ? "Loading…" : "Refresh", props.nodes.length === 0
        ? (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n                <div class=\"muted\">No nodes found.</div>\n              "], ["\n                <div class=\"muted\">No nodes found.</div>\n              "]))) : props.nodes.map(function (n) { return renderNode(n); }));
}
function renderDevices(props) {
    var _a;
    var list = (_a = props.devicesList) !== null && _a !== void 0 ? _a : { pending: [], paired: [] };
    var pending = Array.isArray(list.pending) ? list.pending : [];
    var paired = Array.isArray(list.paired) ? list.paired : [];
    return (0, lit_1.html)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n    <section class=\"card\">\n      <div class=\"row\" style=\"justify-content: space-between;\">\n        <div>\n          <div class=\"card-title\">Devices</div>\n          <div class=\"card-sub\">Pairing requests + role tokens.</div>\n        </div>\n        <button class=\"btn\" ?disabled=", " @click=", ">\n          ", "\n        </button>\n      </div>\n      ", "\n      <div class=\"list\" style=\"margin-top: 16px;\">\n        ", "\n        ", "\n        ", "\n      </div>\n    </section>\n  "], ["\n    <section class=\"card\">\n      <div class=\"row\" style=\"justify-content: space-between;\">\n        <div>\n          <div class=\"card-title\">Devices</div>\n          <div class=\"card-sub\">Pairing requests + role tokens.</div>\n        </div>\n        <button class=\"btn\" ?disabled=", " @click=", ">\n          ", "\n        </button>\n      </div>\n      ", "\n      <div class=\"list\" style=\"margin-top: 16px;\">\n        ", "\n        ", "\n        ", "\n      </div>\n    </section>\n  "])), props.devicesLoading, props.onDevicesRefresh, props.devicesLoading ? "Loading…" : "Refresh", props.devicesError
        ? (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["<div class=\"callout danger\" style=\"margin-top: 12px;\">", "</div>"], ["<div class=\"callout danger\" style=\"margin-top: 12px;\">", "</div>"])), props.devicesError) : lit_1.nothing, pending.length > 0
        ? (0, lit_1.html)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n              <div class=\"muted\" style=\"margin-bottom: 8px;\">Pending</div>\n              ", "\n            "], ["\n              <div class=\"muted\" style=\"margin-bottom: 8px;\">Pending</div>\n              ", "\n            "])), pending.map(function (req) { return renderPendingDevice(req, props); })) : lit_1.nothing, paired.length > 0
        ? (0, lit_1.html)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n              <div class=\"muted\" style=\"margin-top: 12px; margin-bottom: 8px;\">Paired</div>\n              ", "\n            "], ["\n              <div class=\"muted\" style=\"margin-top: 12px; margin-bottom: 8px;\">Paired</div>\n              ", "\n            "])), paired.map(function (device) { return renderPairedDevice(device, props); })) : lit_1.nothing, pending.length === 0 && paired.length === 0
        ? (0, lit_1.html)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n                <div class=\"muted\">No paired devices.</div>\n              "], ["\n                <div class=\"muted\">No paired devices.</div>\n              "]))) : lit_1.nothing);
}
function renderPendingDevice(req, props) {
    var _a, _b;
    var name = ((_a = req.displayName) === null || _a === void 0 ? void 0 : _a.trim()) || req.deviceId;
    var age = typeof req.ts === "number" ? (0, format_1.formatAgo)(req.ts) : "n/a";
    var role = ((_b = req.role) === null || _b === void 0 ? void 0 : _b.trim()) ? "role: ".concat(req.role) : "role: -";
    var repair = req.isRepair ? " · repair" : "";
    var ip = req.remoteIp ? " \u00B7 ".concat(req.remoteIp) : "";
    return (0, lit_1.html)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n    <div class=\"list-item\">\n      <div class=\"list-main\">\n        <div class=\"list-title\">", "</div>\n        <div class=\"list-sub\">", "", "</div>\n        <div class=\"muted\" style=\"margin-top: 6px;\">\n          ", " \u00B7 requested ", "", "\n        </div>\n      </div>\n      <div class=\"list-meta\">\n        <div class=\"row\" style=\"justify-content: flex-end; gap: 8px; flex-wrap: wrap;\">\n          <button class=\"btn btn--sm primary\" @click=", ">\n            Approve\n          </button>\n          <button class=\"btn btn--sm\" @click=", ">\n            Reject\n          </button>\n        </div>\n      </div>\n    </div>\n  "], ["\n    <div class=\"list-item\">\n      <div class=\"list-main\">\n        <div class=\"list-title\">", "</div>\n        <div class=\"list-sub\">", "", "</div>\n        <div class=\"muted\" style=\"margin-top: 6px;\">\n          ", " \u00B7 requested ", "", "\n        </div>\n      </div>\n      <div class=\"list-meta\">\n        <div class=\"row\" style=\"justify-content: flex-end; gap: 8px; flex-wrap: wrap;\">\n          <button class=\"btn btn--sm primary\" @click=", ">\n            Approve\n          </button>\n          <button class=\"btn btn--sm\" @click=", ">\n            Reject\n          </button>\n        </div>\n      </div>\n    </div>\n  "])), name, req.deviceId, ip, role, age, repair, function () { return props.onDeviceApprove(req.requestId); }, function () { return props.onDeviceReject(req.requestId); });
}
function renderPairedDevice(device, props) {
    var _a;
    var name = ((_a = device.displayName) === null || _a === void 0 ? void 0 : _a.trim()) || device.deviceId;
    var ip = device.remoteIp ? " \u00B7 ".concat(device.remoteIp) : "";
    var roles = "roles: ".concat((0, format_1.formatList)(device.roles));
    var scopes = "scopes: ".concat((0, format_1.formatList)(device.scopes));
    var tokens = Array.isArray(device.tokens) ? device.tokens : [];
    return (0, lit_1.html)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n    <div class=\"list-item\">\n      <div class=\"list-main\">\n        <div class=\"list-title\">", "</div>\n        <div class=\"list-sub\">", "", "</div>\n        <div class=\"muted\" style=\"margin-top: 6px;\">", " \u00B7 ", "</div>\n        ", "\n      </div>\n    </div>\n  "], ["\n    <div class=\"list-item\">\n      <div class=\"list-main\">\n        <div class=\"list-title\">", "</div>\n        <div class=\"list-sub\">", "", "</div>\n        <div class=\"muted\" style=\"margin-top: 6px;\">", " \u00B7 ", "</div>\n        ", "\n      </div>\n    </div>\n  "])), name, device.deviceId, ip, roles, scopes, tokens.length === 0
        ? (0, lit_1.html)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n                <div class=\"muted\" style=\"margin-top: 6px\">Tokens: none</div>\n              "], ["\n                <div class=\"muted\" style=\"margin-top: 6px\">Tokens: none</div>\n              "]))) : (0, lit_1.html)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n              <div class=\"muted\" style=\"margin-top: 10px;\">Tokens</div>\n              <div style=\"display: flex; flex-direction: column; gap: 8px; margin-top: 6px;\">\n                ", "\n              </div>\n            "], ["\n              <div class=\"muted\" style=\"margin-top: 10px;\">Tokens</div>\n              <div style=\"display: flex; flex-direction: column; gap: 8px; margin-top: 6px;\">\n                ", "\n              </div>\n            "])), tokens.map(function (token) { return renderTokenRow(device.deviceId, token, props); })));
}
function renderTokenRow(deviceId, token, props) {
    var _a, _b, _c;
    var status = token.revokedAtMs ? "revoked" : "active";
    var scopes = "scopes: ".concat((0, format_1.formatList)(token.scopes));
    var when = (0, format_1.formatAgo)((_c = (_b = (_a = token.rotatedAtMs) !== null && _a !== void 0 ? _a : token.createdAtMs) !== null && _b !== void 0 ? _b : token.lastUsedAtMs) !== null && _c !== void 0 ? _c : null);
    return (0, lit_1.html)(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n    <div class=\"row\" style=\"justify-content: space-between; gap: 8px;\">\n      <div class=\"list-sub\">", " \u00B7 ", " \u00B7 ", " \u00B7 ", "</div>\n      <div class=\"row\" style=\"justify-content: flex-end; gap: 6px; flex-wrap: wrap;\">\n        <button\n          class=\"btn btn--sm\"\n          @click=", "\n        >\n          Rotate\n        </button>\n        ", "\n      </div>\n    </div>\n  "], ["\n    <div class=\"row\" style=\"justify-content: space-between; gap: 8px;\">\n      <div class=\"list-sub\">", " \u00B7 ", " \u00B7 ", " \u00B7 ", "</div>\n      <div class=\"row\" style=\"justify-content: flex-end; gap: 6px; flex-wrap: wrap;\">\n        <button\n          class=\"btn btn--sm\"\n          @click=", "\n        >\n          Rotate\n        </button>\n        ", "\n      </div>\n    </div>\n  "])), token.role, status, scopes, when, function () { return props.onDeviceRotate(deviceId, token.role, token.scopes); }, token.revokedAtMs
        ? lit_1.nothing
        : (0, lit_1.html)(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n              <button\n                class=\"btn btn--sm danger\"\n                @click=", "\n              >\n                Revoke\n              </button>\n            "], ["\n              <button\n                class=\"btn btn--sm danger\"\n                @click=", "\n              >\n                Revoke\n              </button>\n            "])), function () { return props.onDeviceRevoke(deviceId, token.role); }));
}
var EXEC_APPROVALS_DEFAULT_SCOPE = "__defaults__";
var SECURITY_OPTIONS = [
    { value: "deny", label: "Deny" },
    { value: "allowlist", label: "Allowlist" },
    { value: "full", label: "Full" },
];
var ASK_OPTIONS = [
    { value: "off", label: "Off" },
    { value: "on-miss", label: "On miss" },
    { value: "always", label: "Always" },
];
function resolveBindingsState(props) {
    var config = props.configForm;
    var nodes = resolveExecNodes(props.nodes);
    var _a = resolveAgentBindings(config), defaultBinding = _a.defaultBinding, agents = _a.agents;
    var ready = Boolean(config);
    var disabled = props.configSaving || props.configFormMode === "raw";
    return {
        ready: ready,
        disabled: disabled,
        configDirty: props.configDirty,
        configLoading: props.configLoading,
        configSaving: props.configSaving,
        defaultBinding: defaultBinding,
        agents: agents,
        nodes: nodes,
        onBindDefault: props.onBindDefault,
        onBindAgent: props.onBindAgent,
        onSave: props.onSaveBindings,
        onLoadConfig: props.onLoadConfig,
        formMode: props.configFormMode,
    };
}
function normalizeSecurity(value) {
    if (value === "allowlist" || value === "full" || value === "deny") {
        return value;
    }
    return "deny";
}
function normalizeAsk(value) {
    if (value === "always" || value === "off" || value === "on-miss") {
        return value;
    }
    return "on-miss";
}
function resolveExecApprovalsDefaults(form) {
    var _a, _b, _c;
    var defaults = (_a = form === null || form === void 0 ? void 0 : form.defaults) !== null && _a !== void 0 ? _a : {};
    return {
        security: normalizeSecurity(defaults.security),
        ask: normalizeAsk(defaults.ask),
        askFallback: normalizeSecurity((_b = defaults.askFallback) !== null && _b !== void 0 ? _b : "deny"),
        autoAllowSkills: Boolean((_c = defaults.autoAllowSkills) !== null && _c !== void 0 ? _c : false),
    };
}
function resolveConfigAgents(config) {
    var _a;
    var agentsNode = ((_a = config === null || config === void 0 ? void 0 : config.agents) !== null && _a !== void 0 ? _a : {});
    var list = Array.isArray(agentsNode.list) ? agentsNode.list : [];
    var agents = [];
    list.forEach(function (entry) {
        if (!entry || typeof entry !== "object") {
            return;
        }
        var record = entry;
        var id = typeof record.id === "string" ? record.id.trim() : "";
        if (!id) {
            return;
        }
        var name = typeof record.name === "string" ? record.name.trim() : undefined;
        var isDefault = record.default === true;
        agents.push({ id: id, name: name || undefined, isDefault: isDefault });
    });
    return agents;
}
function resolveExecApprovalsAgents(config, form) {
    var _a;
    var configAgents = resolveConfigAgents(config);
    var approvalsAgents = Object.keys((_a = form === null || form === void 0 ? void 0 : form.agents) !== null && _a !== void 0 ? _a : {});
    var merged = new Map();
    configAgents.forEach(function (agent) { return merged.set(agent.id, agent); });
    approvalsAgents.forEach(function (id) {
        if (merged.has(id)) {
            return;
        }
        merged.set(id, { id: id });
    });
    var agents = Array.from(merged.values());
    if (agents.length === 0) {
        agents.push({ id: "main", isDefault: true });
    }
    agents.sort(function (a, b) {
        var _a, _b;
        if (a.isDefault && !b.isDefault) {
            return -1;
        }
        if (!a.isDefault && b.isDefault) {
            return 1;
        }
        var aLabel = ((_a = a.name) === null || _a === void 0 ? void 0 : _a.trim()) ? a.name : a.id;
        var bLabel = ((_b = b.name) === null || _b === void 0 ? void 0 : _b.trim()) ? b.name : b.id;
        return aLabel.localeCompare(bLabel);
    });
    return agents;
}
function resolveExecApprovalsScope(selected, agents) {
    if (selected === EXEC_APPROVALS_DEFAULT_SCOPE) {
        return EXEC_APPROVALS_DEFAULT_SCOPE;
    }
    if (selected && agents.some(function (agent) { return agent.id === selected; })) {
        return selected;
    }
    return EXEC_APPROVALS_DEFAULT_SCOPE;
}
function resolveExecApprovalsState(props) {
    var _a, _b, _c, _d, _e, _f;
    var form = (_c = (_a = props.execApprovalsForm) !== null && _a !== void 0 ? _a : (_b = props.execApprovalsSnapshot) === null || _b === void 0 ? void 0 : _b.file) !== null && _c !== void 0 ? _c : null;
    var ready = Boolean(form);
    var defaults = resolveExecApprovalsDefaults(form);
    var agents = resolveExecApprovalsAgents(props.configForm, form);
    var targetNodes = resolveExecApprovalsNodes(props.nodes);
    var target = props.execApprovalsTarget;
    var targetNodeId = target === "node" && props.execApprovalsTargetNodeId ? props.execApprovalsTargetNodeId : null;
    if (target === "node" && targetNodeId && !targetNodes.some(function (node) { return node.id === targetNodeId; })) {
        targetNodeId = null;
    }
    var selectedScope = resolveExecApprovalsScope(props.execApprovalsSelectedAgent, agents);
    var selectedAgent = selectedScope !== EXEC_APPROVALS_DEFAULT_SCOPE
        ? ((_e = ((_d = form === null || form === void 0 ? void 0 : form.agents) !== null && _d !== void 0 ? _d : {})[selectedScope]) !== null && _e !== void 0 ? _e : null)
        : null;
    var allowlist = Array.isArray(selectedAgent === null || selectedAgent === void 0 ? void 0 : selectedAgent.allowlist)
        ? ((_f = selectedAgent.allowlist) !== null && _f !== void 0 ? _f : [])
        : [];
    return {
        ready: ready,
        disabled: props.execApprovalsSaving || props.execApprovalsLoading,
        dirty: props.execApprovalsDirty,
        loading: props.execApprovalsLoading,
        saving: props.execApprovalsSaving,
        form: form,
        defaults: defaults,
        selectedScope: selectedScope,
        selectedAgent: selectedAgent,
        agents: agents,
        allowlist: allowlist,
        target: target,
        targetNodeId: targetNodeId,
        targetNodes: targetNodes,
        onSelectScope: props.onExecApprovalsSelectAgent,
        onSelectTarget: props.onExecApprovalsTargetChange,
        onPatch: props.onExecApprovalsPatch,
        onRemove: props.onExecApprovalsRemove,
        onLoad: props.onLoadExecApprovals,
        onSave: props.onSaveExecApprovals,
    };
}
function renderBindings(state) {
    var _a;
    var supportsBinding = state.nodes.length > 0;
    var defaultValue = (_a = state.defaultBinding) !== null && _a !== void 0 ? _a : "";
    return (0, lit_1.html)(templateObject_20 || (templateObject_20 = __makeTemplateObject(["\n    <section class=\"card\">\n      <div class=\"row\" style=\"justify-content: space-between; align-items: center;\">\n        <div>\n          <div class=\"card-title\">Exec node binding</div>\n          <div class=\"card-sub\">\n            Pin agents to a specific node when using <span class=\"mono\">exec host=node</span>.\n          </div>\n        </div>\n        <button\n          class=\"btn\"\n          ?disabled=", "\n          @click=", "\n        >\n          ", "\n        </button>\n      </div>\n\n      ", "\n\n      ", "\n    </section>\n  "], ["\n    <section class=\"card\">\n      <div class=\"row\" style=\"justify-content: space-between; align-items: center;\">\n        <div>\n          <div class=\"card-title\">Exec node binding</div>\n          <div class=\"card-sub\">\n            Pin agents to a specific node when using <span class=\"mono\">exec host=node</span>.\n          </div>\n        </div>\n        <button\n          class=\"btn\"\n          ?disabled=", "\n          @click=", "\n        >\n          ", "\n        </button>\n      </div>\n\n      ", "\n\n      ", "\n    </section>\n  "])), state.disabled || !state.configDirty, state.onSave, state.configSaving ? "Saving…" : "Save", state.formMode === "raw"
        ? (0, lit_1.html)(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n              <div class=\"callout warn\" style=\"margin-top: 12px\">\n                Switch the Config tab to <strong>Form</strong> mode to edit bindings here.\n              </div>\n            "], ["\n              <div class=\"callout warn\" style=\"margin-top: 12px\">\n                Switch the Config tab to <strong>Form</strong> mode to edit bindings here.\n              </div>\n            "]))) : lit_1.nothing, !state.ready
        ? (0, lit_1.html)(templateObject_15 || (templateObject_15 = __makeTemplateObject(["<div class=\"row\" style=\"margin-top: 12px; gap: 12px;\">\n            <div class=\"muted\">Load config to edit bindings.</div>\n            <button class=\"btn\" ?disabled=", " @click=", ">\n              ", "\n            </button>\n          </div>"], ["<div class=\"row\" style=\"margin-top: 12px; gap: 12px;\">\n            <div class=\"muted\">Load config to edit bindings.</div>\n            <button class=\"btn\" ?disabled=", " @click=", ">\n              ", "\n            </button>\n          </div>"])), state.configLoading, state.onLoadConfig, state.configLoading ? "Loading…" : "Load config") : (0, lit_1.html)(templateObject_19 || (templateObject_19 = __makeTemplateObject(["\n            <div class=\"list\" style=\"margin-top: 16px;\">\n              <div class=\"list-item\">\n                <div class=\"list-main\">\n                  <div class=\"list-title\">Default binding</div>\n                  <div class=\"list-sub\">Used when agents do not override a node binding.</div>\n                </div>\n                <div class=\"list-meta\">\n                  <label class=\"field\">\n                    <span>Node</span>\n                    <select\n                      ?disabled=", "\n                      @change=", "\n                    >\n                      <option value=\"\" ?selected=", ">Any node</option>\n                      ", "\n                    </select>\n                  </label>\n                  ", "\n                </div>\n              </div>\n\n              ", "\n            </div>\n          "], ["\n            <div class=\"list\" style=\"margin-top: 16px;\">\n              <div class=\"list-item\">\n                <div class=\"list-main\">\n                  <div class=\"list-title\">Default binding</div>\n                  <div class=\"list-sub\">Used when agents do not override a node binding.</div>\n                </div>\n                <div class=\"list-meta\">\n                  <label class=\"field\">\n                    <span>Node</span>\n                    <select\n                      ?disabled=", "\n                      @change=", "\n                    >\n                      <option value=\"\" ?selected=", ">Any node</option>\n                      ", "\n                    </select>\n                  </label>\n                  ", "\n                </div>\n              </div>\n\n              ", "\n            </div>\n          "])), state.disabled || !supportsBinding, function (event) {
        var target = event.target;
        var value = target.value.trim();
        state.onBindDefault(value ? value : null);
    }, defaultValue === "", state.nodes.map(function (node) {
        return (0, lit_1.html)(templateObject_16 || (templateObject_16 = __makeTemplateObject(["<option\n                            value=", "\n                            ?selected=", "\n                          >\n                            ", "\n                          </option>"], ["<option\n                            value=", "\n                            ?selected=", "\n                          >\n                            ", "\n                          </option>"])), node.id, defaultValue === node.id, node.label);
    }), !supportsBinding
        ? (0, lit_1.html)(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n                          <div class=\"muted\">No nodes with system.run available.</div>\n                        "], ["\n                          <div class=\"muted\">No nodes with system.run available.</div>\n                        "]))) : lit_1.nothing, state.agents.length === 0
        ? (0, lit_1.html)(templateObject_18 || (templateObject_18 = __makeTemplateObject(["\n                      <div class=\"muted\">No agents found.</div>\n                    "], ["\n                      <div class=\"muted\">No agents found.</div>\n                    "]))) : state.agents.map(function (agent) { return renderAgentBinding(agent, state); })));
}
function renderExecApprovals(state) {
    var ready = state.ready;
    var targetReady = state.target !== "node" || Boolean(state.targetNodeId);
    return (0, lit_1.html)(templateObject_23 || (templateObject_23 = __makeTemplateObject(["\n    <section class=\"card\">\n      <div class=\"row\" style=\"justify-content: space-between; align-items: center;\">\n        <div>\n          <div class=\"card-title\">Exec approvals</div>\n          <div class=\"card-sub\">\n            Allowlist and approval policy for <span class=\"mono\">exec host=gateway/node</span>.\n          </div>\n        </div>\n        <button\n          class=\"btn\"\n          ?disabled=", "\n          @click=", "\n        >\n          ", "\n        </button>\n      </div>\n\n      ", "\n\n      ", "\n    </section>\n  "], ["\n    <section class=\"card\">\n      <div class=\"row\" style=\"justify-content: space-between; align-items: center;\">\n        <div>\n          <div class=\"card-title\">Exec approvals</div>\n          <div class=\"card-sub\">\n            Allowlist and approval policy for <span class=\"mono\">exec host=gateway/node</span>.\n          </div>\n        </div>\n        <button\n          class=\"btn\"\n          ?disabled=", "\n          @click=", "\n        >\n          ", "\n        </button>\n      </div>\n\n      ", "\n\n      ", "\n    </section>\n  "])), state.disabled || !state.dirty || !targetReady, state.onSave, state.saving ? "Saving…" : "Save", renderExecApprovalsTarget(state), !ready
        ? (0, lit_1.html)(templateObject_21 || (templateObject_21 = __makeTemplateObject(["<div class=\"row\" style=\"margin-top: 12px; gap: 12px;\">\n            <div class=\"muted\">Load exec approvals to edit allowlists.</div>\n            <button class=\"btn\" ?disabled=", " @click=", ">\n              ", "\n            </button>\n          </div>"], ["<div class=\"row\" style=\"margin-top: 12px; gap: 12px;\">\n            <div class=\"muted\">Load exec approvals to edit allowlists.</div>\n            <button class=\"btn\" ?disabled=", " @click=", ">\n              ", "\n            </button>\n          </div>"])), state.loading || !targetReady, state.onLoad, state.loading ? "Loading…" : "Load approvals") : (0, lit_1.html)(templateObject_22 || (templateObject_22 = __makeTemplateObject(["\n            ", "\n            ", "\n            ", "\n          "], ["\n            ", "\n            ", "\n            ", "\n          "])), renderExecApprovalsTabs(state), renderExecApprovalsPolicy(state), state.selectedScope === EXEC_APPROVALS_DEFAULT_SCOPE
        ? lit_1.nothing
        : renderExecApprovalsAllowlist(state)));
}
function renderExecApprovalsTarget(state) {
    var _a;
    var hasNodes = state.targetNodes.length > 0;
    var nodeValue = (_a = state.targetNodeId) !== null && _a !== void 0 ? _a : "";
    return (0, lit_1.html)(templateObject_27 || (templateObject_27 = __makeTemplateObject(["\n    <div class=\"list\" style=\"margin-top: 12px;\">\n      <div class=\"list-item\">\n        <div class=\"list-main\">\n          <div class=\"list-title\">Target</div>\n          <div class=\"list-sub\">\n            Gateway edits local approvals; node edits the selected node.\n          </div>\n        </div>\n        <div class=\"list-meta\">\n          <label class=\"field\">\n            <span>Host</span>\n            <select\n              ?disabled=", "\n              @change=", "\n            >\n              <option value=\"gateway\" ?selected=", ">Gateway</option>\n              <option value=\"node\" ?selected=", ">Node</option>\n            </select>\n          </label>\n          ", "\n        </div>\n      </div>\n      ", "\n    </div>\n  "], ["\n    <div class=\"list\" style=\"margin-top: 12px;\">\n      <div class=\"list-item\">\n        <div class=\"list-main\">\n          <div class=\"list-title\">Target</div>\n          <div class=\"list-sub\">\n            Gateway edits local approvals; node edits the selected node.\n          </div>\n        </div>\n        <div class=\"list-meta\">\n          <label class=\"field\">\n            <span>Host</span>\n            <select\n              ?disabled=", "\n              @change=", "\n            >\n              <option value=\"gateway\" ?selected=", ">Gateway</option>\n              <option value=\"node\" ?selected=", ">Node</option>\n            </select>\n          </label>\n          ", "\n        </div>\n      </div>\n      ", "\n    </div>\n  "])), state.disabled, function (event) {
        var _a, _b;
        var target = event.target;
        var value = target.value;
        if (value === "node") {
            var first = (_b = (_a = state.targetNodes[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
            state.onSelectTarget("node", nodeValue || first);
        }
        else {
            state.onSelectTarget("gateway", null);
        }
    }, state.target === "gateway", state.target === "node", state.target === "node"
        ? (0, lit_1.html)(templateObject_25 || (templateObject_25 = __makeTemplateObject(["\n                <label class=\"field\">\n                  <span>Node</span>\n                  <select\n                    ?disabled=", "\n                    @change=", "\n                  >\n                    <option value=\"\" ?selected=", ">Select node</option>\n                    ", "\n                  </select>\n                </label>\n              "], ["\n                <label class=\"field\">\n                  <span>Node</span>\n                  <select\n                    ?disabled=", "\n                    @change=", "\n                  >\n                    <option value=\"\" ?selected=", ">Select node</option>\n                    ", "\n                  </select>\n                </label>\n              "])), state.disabled || !hasNodes, function (event) {
            var target = event.target;
            var value = target.value.trim();
            state.onSelectTarget("node", value ? value : null);
        }, nodeValue === "", state.targetNodes.map(function (node) {
            return (0, lit_1.html)(templateObject_24 || (templateObject_24 = __makeTemplateObject(["<option\n                          value=", "\n                          ?selected=", "\n                        >\n                          ", "\n                        </option>"], ["<option\n                          value=", "\n                          ?selected=", "\n                        >\n                          ", "\n                        </option>"])), node.id, nodeValue === node.id, node.label);
        })) : lit_1.nothing, state.target === "node" && !hasNodes
        ? (0, lit_1.html)(templateObject_26 || (templateObject_26 = __makeTemplateObject(["\n              <div class=\"muted\">No nodes advertise exec approvals yet.</div>\n            "], ["\n              <div class=\"muted\">No nodes advertise exec approvals yet.</div>\n            "]))) : lit_1.nothing);
}
function renderExecApprovalsTabs(state) {
    return (0, lit_1.html)(templateObject_29 || (templateObject_29 = __makeTemplateObject(["\n    <div class=\"row\" style=\"margin-top: 12px; gap: 8px; flex-wrap: wrap;\">\n      <span class=\"label\">Scope</span>\n      <div class=\"row\" style=\"gap: 8px; flex-wrap: wrap;\">\n        <button\n          class=\"btn btn--sm ", "\"\n          @click=", "\n        >\n          Defaults\n        </button>\n        ", "\n      </div>\n    </div>\n  "], ["\n    <div class=\"row\" style=\"margin-top: 12px; gap: 8px; flex-wrap: wrap;\">\n      <span class=\"label\">Scope</span>\n      <div class=\"row\" style=\"gap: 8px; flex-wrap: wrap;\">\n        <button\n          class=\"btn btn--sm ", "\"\n          @click=", "\n        >\n          Defaults\n        </button>\n        ", "\n      </div>\n    </div>\n  "])), state.selectedScope === EXEC_APPROVALS_DEFAULT_SCOPE ? "active" : "", function () { return state.onSelectScope(EXEC_APPROVALS_DEFAULT_SCOPE); }, state.agents.map(function (agent) {
        var _a;
        var label = ((_a = agent.name) === null || _a === void 0 ? void 0 : _a.trim()) ? "".concat(agent.name, " (").concat(agent.id, ")") : agent.id;
        return (0, lit_1.html)(templateObject_28 || (templateObject_28 = __makeTemplateObject(["\n            <button\n              class=\"btn btn--sm ", "\"\n              @click=", "\n            >\n              ", "\n            </button>\n          "], ["\n            <button\n              class=\"btn btn--sm ", "\"\n              @click=", "\n            >\n              ", "\n            </button>\n          "])), state.selectedScope === agent.id ? "active" : "", function () { return state.onSelectScope(agent.id); }, label);
    }));
}
function renderExecApprovalsPolicy(state) {
    var _a;
    var isDefaults = state.selectedScope === EXEC_APPROVALS_DEFAULT_SCOPE;
    var defaults = state.defaults;
    var agent = (_a = state.selectedAgent) !== null && _a !== void 0 ? _a : {};
    var basePath = isDefaults ? ["defaults"] : ["agents", state.selectedScope];
    var agentSecurity = typeof agent.security === "string" ? agent.security : undefined;
    var agentAsk = typeof agent.ask === "string" ? agent.ask : undefined;
    var agentAskFallback = typeof agent.askFallback === "string" ? agent.askFallback : undefined;
    var securityValue = isDefaults ? defaults.security : (agentSecurity !== null && agentSecurity !== void 0 ? agentSecurity : "__default__");
    var askValue = isDefaults ? defaults.ask : (agentAsk !== null && agentAsk !== void 0 ? agentAsk : "__default__");
    var askFallbackValue = isDefaults ? defaults.askFallback : (agentAskFallback !== null && agentAskFallback !== void 0 ? agentAskFallback : "__default__");
    var autoOverride = typeof agent.autoAllowSkills === "boolean" ? agent.autoAllowSkills : undefined;
    var autoEffective = autoOverride !== null && autoOverride !== void 0 ? autoOverride : defaults.autoAllowSkills;
    var autoIsDefault = autoOverride == null;
    return (0, lit_1.html)(templateObject_37 || (templateObject_37 = __makeTemplateObject(["\n    <div class=\"list\" style=\"margin-top: 16px;\">\n      <div class=\"list-item\">\n        <div class=\"list-main\">\n          <div class=\"list-title\">Security</div>\n          <div class=\"list-sub\">\n            ", "\n          </div>\n        </div>\n        <div class=\"list-meta\">\n          <label class=\"field\">\n            <span>Mode</span>\n            <select\n              ?disabled=", "\n              @change=", "\n            >\n              ", "\n              ", "\n            </select>\n          </label>\n        </div>\n      </div>\n\n      <div class=\"list-item\">\n        <div class=\"list-main\">\n          <div class=\"list-title\">Ask</div>\n          <div class=\"list-sub\">\n            ", "\n          </div>\n        </div>\n        <div class=\"list-meta\">\n          <label class=\"field\">\n            <span>Mode</span>\n            <select\n              ?disabled=", "\n              @change=", "\n            >\n              ", "\n              ", "\n            </select>\n          </label>\n        </div>\n      </div>\n\n      <div class=\"list-item\">\n        <div class=\"list-main\">\n          <div class=\"list-title\">Ask fallback</div>\n          <div class=\"list-sub\">\n            ", "\n          </div>\n        </div>\n        <div class=\"list-meta\">\n          <label class=\"field\">\n            <span>Fallback</span>\n            <select\n              ?disabled=", "\n              @change=", "\n            >\n              ", "\n              ", "\n            </select>\n          </label>\n        </div>\n      </div>\n\n      <div class=\"list-item\">\n        <div class=\"list-main\">\n          <div class=\"list-title\">Auto-allow skill CLIs</div>\n          <div class=\"list-sub\">\n            ", "\n          </div>\n        </div>\n        <div class=\"list-meta\">\n          <label class=\"field\">\n            <span>Enabled</span>\n            <input\n              type=\"checkbox\"\n              ?disabled=", "\n              .checked=", "\n              @change=", "\n            />\n          </label>\n          ", "\n        </div>\n      </div>\n    </div>\n  "], ["\n    <div class=\"list\" style=\"margin-top: 16px;\">\n      <div class=\"list-item\">\n        <div class=\"list-main\">\n          <div class=\"list-title\">Security</div>\n          <div class=\"list-sub\">\n            ", "\n          </div>\n        </div>\n        <div class=\"list-meta\">\n          <label class=\"field\">\n            <span>Mode</span>\n            <select\n              ?disabled=", "\n              @change=", "\n            >\n              ", "\n              ", "\n            </select>\n          </label>\n        </div>\n      </div>\n\n      <div class=\"list-item\">\n        <div class=\"list-main\">\n          <div class=\"list-title\">Ask</div>\n          <div class=\"list-sub\">\n            ", "\n          </div>\n        </div>\n        <div class=\"list-meta\">\n          <label class=\"field\">\n            <span>Mode</span>\n            <select\n              ?disabled=", "\n              @change=", "\n            >\n              ", "\n              ", "\n            </select>\n          </label>\n        </div>\n      </div>\n\n      <div class=\"list-item\">\n        <div class=\"list-main\">\n          <div class=\"list-title\">Ask fallback</div>\n          <div class=\"list-sub\">\n            ", "\n          </div>\n        </div>\n        <div class=\"list-meta\">\n          <label class=\"field\">\n            <span>Fallback</span>\n            <select\n              ?disabled=", "\n              @change=", "\n            >\n              ", "\n              ", "\n            </select>\n          </label>\n        </div>\n      </div>\n\n      <div class=\"list-item\">\n        <div class=\"list-main\">\n          <div class=\"list-title\">Auto-allow skill CLIs</div>\n          <div class=\"list-sub\">\n            ", "\n          </div>\n        </div>\n        <div class=\"list-meta\">\n          <label class=\"field\">\n            <span>Enabled</span>\n            <input\n              type=\"checkbox\"\n              ?disabled=", "\n              .checked=", "\n              @change=", "\n            />\n          </label>\n          ", "\n        </div>\n      </div>\n    </div>\n  "])), isDefaults ? "Default security mode." : "Default: ".concat(defaults.security, "."), state.disabled, function (event) {
        var target = event.target;
        var value = target.value;
        if (!isDefaults && value === "__default__") {
            state.onRemove(__spreadArray(__spreadArray([], basePath, true), ["security"], false));
        }
        else {
            state.onPatch(__spreadArray(__spreadArray([], basePath, true), ["security"], false), value);
        }
    }, !isDefaults
        ? (0, lit_1.html)(templateObject_30 || (templateObject_30 = __makeTemplateObject(["<option value=\"__default__\" ?selected=", ">\n                    Use default (", ")\n                  </option>"], ["<option value=\"__default__\" ?selected=", ">\n                    Use default (", ")\n                  </option>"])), securityValue === "__default__", defaults.security) : lit_1.nothing, SECURITY_OPTIONS.map(function (option) {
        return (0, lit_1.html)(templateObject_31 || (templateObject_31 = __makeTemplateObject(["<option\n                    value=", "\n                    ?selected=", "\n                  >\n                    ", "\n                  </option>"], ["<option\n                    value=", "\n                    ?selected=", "\n                  >\n                    ", "\n                  </option>"])), option.value, securityValue === option.value, option.label);
    }), isDefaults ? "Default prompt policy." : "Default: ".concat(defaults.ask, "."), state.disabled, function (event) {
        var target = event.target;
        var value = target.value;
        if (!isDefaults && value === "__default__") {
            state.onRemove(__spreadArray(__spreadArray([], basePath, true), ["ask"], false));
        }
        else {
            state.onPatch(__spreadArray(__spreadArray([], basePath, true), ["ask"], false), value);
        }
    }, !isDefaults
        ? (0, lit_1.html)(templateObject_32 || (templateObject_32 = __makeTemplateObject(["<option value=\"__default__\" ?selected=", ">\n                    Use default (", ")\n                  </option>"], ["<option value=\"__default__\" ?selected=", ">\n                    Use default (", ")\n                  </option>"])), askValue === "__default__", defaults.ask) : lit_1.nothing, ASK_OPTIONS.map(function (option) {
        return (0, lit_1.html)(templateObject_33 || (templateObject_33 = __makeTemplateObject(["<option\n                    value=", "\n                    ?selected=", "\n                  >\n                    ", "\n                  </option>"], ["<option\n                    value=", "\n                    ?selected=", "\n                  >\n                    ", "\n                  </option>"])), option.value, askValue === option.value, option.label);
    }), isDefaults
        ? "Applied when the UI prompt is unavailable."
        : "Default: ".concat(defaults.askFallback, "."), state.disabled, function (event) {
        var target = event.target;
        var value = target.value;
        if (!isDefaults && value === "__default__") {
            state.onRemove(__spreadArray(__spreadArray([], basePath, true), ["askFallback"], false));
        }
        else {
            state.onPatch(__spreadArray(__spreadArray([], basePath, true), ["askFallback"], false), value);
        }
    }, !isDefaults
        ? (0, lit_1.html)(templateObject_34 || (templateObject_34 = __makeTemplateObject(["<option value=\"__default__\" ?selected=", ">\n                    Use default (", ")\n                  </option>"], ["<option value=\"__default__\" ?selected=", ">\n                    Use default (", ")\n                  </option>"])), askFallbackValue === "__default__", defaults.askFallback) : lit_1.nothing, SECURITY_OPTIONS.map(function (option) {
        return (0, lit_1.html)(templateObject_35 || (templateObject_35 = __makeTemplateObject(["<option\n                    value=", "\n                    ?selected=", "\n                  >\n                    ", "\n                  </option>"], ["<option\n                    value=", "\n                    ?selected=", "\n                  >\n                    ", "\n                  </option>"])), option.value, askFallbackValue === option.value, option.label);
    }), isDefaults
        ? "Allow skill executables listed by the Gateway."
        : autoIsDefault
            ? "Using default (".concat(defaults.autoAllowSkills ? "on" : "off", ").")
            : "Override (".concat(autoEffective ? "on" : "off", ")."), state.disabled, autoEffective, function (event) {
        var target = event.target;
        state.onPatch(__spreadArray(__spreadArray([], basePath, true), ["autoAllowSkills"], false), target.checked);
    }, !isDefaults && !autoIsDefault
        ? (0, lit_1.html)(templateObject_36 || (templateObject_36 = __makeTemplateObject(["<button\n                class=\"btn btn--sm\"\n                ?disabled=", "\n                @click=", "\n              >\n                Use default\n              </button>"], ["<button\n                class=\"btn btn--sm\"\n                ?disabled=", "\n                @click=", "\n              >\n                Use default\n              </button>"])), state.disabled, function () { return state.onRemove(__spreadArray(__spreadArray([], basePath, true), ["autoAllowSkills"], false)); }) : lit_1.nothing);
}
function renderExecApprovalsAllowlist(state) {
    var allowlistPath = ["agents", state.selectedScope, "allowlist"];
    var entries = state.allowlist;
    return (0, lit_1.html)(templateObject_39 || (templateObject_39 = __makeTemplateObject(["\n    <div class=\"row\" style=\"margin-top: 18px; justify-content: space-between;\">\n      <div>\n        <div class=\"card-title\">Allowlist</div>\n        <div class=\"card-sub\">Case-insensitive glob patterns.</div>\n      </div>\n      <button\n        class=\"btn btn--sm\"\n        ?disabled=", "\n        @click=", "\n      >\n        Add pattern\n      </button>\n    </div>\n    <div class=\"list\" style=\"margin-top: 12px;\">\n      ", "\n    </div>\n  "], ["\n    <div class=\"row\" style=\"margin-top: 18px; justify-content: space-between;\">\n      <div>\n        <div class=\"card-title\">Allowlist</div>\n        <div class=\"card-sub\">Case-insensitive glob patterns.</div>\n      </div>\n      <button\n        class=\"btn btn--sm\"\n        ?disabled=", "\n        @click=", "\n      >\n        Add pattern\n      </button>\n    </div>\n    <div class=\"list\" style=\"margin-top: 12px;\">\n      ", "\n    </div>\n  "])), state.disabled, function () {
        var next = __spreadArray(__spreadArray([], entries, true), [{ pattern: "" }], false);
        state.onPatch(allowlistPath, next);
    }, entries.length === 0
        ? (0, lit_1.html)(templateObject_38 || (templateObject_38 = __makeTemplateObject(["\n              <div class=\"muted\">No allowlist entries yet.</div>\n            "], ["\n              <div class=\"muted\">No allowlist entries yet.</div>\n            "]))) : entries.map(function (entry, index) { return renderAllowlistEntry(state, entry, index); }));
}
function renderAllowlistEntry(state, entry, index) {
    var _a, _b;
    var lastUsed = entry.lastUsedAt ? (0, format_1.formatAgo)(entry.lastUsedAt) : "never";
    var lastCommand = entry.lastUsedCommand ? (0, format_1.clampText)(entry.lastUsedCommand, 120) : null;
    var lastPath = entry.lastResolvedPath ? (0, format_1.clampText)(entry.lastResolvedPath, 120) : null;
    return (0, lit_1.html)(templateObject_42 || (templateObject_42 = __makeTemplateObject(["\n    <div class=\"list-item\">\n      <div class=\"list-main\">\n        <div class=\"list-title\">", "</div>\n        <div class=\"list-sub\">Last used: ", "</div>\n        ", "\n        ", "\n      </div>\n      <div class=\"list-meta\">\n        <label class=\"field\">\n          <span>Pattern</span>\n          <input\n            type=\"text\"\n            .value=", "\n            ?disabled=", "\n            @input=", "\n          />\n        </label>\n        <button\n          class=\"btn btn--sm danger\"\n          ?disabled=", "\n          @click=", "\n        >\n          Remove\n        </button>\n      </div>\n    </div>\n  "], ["\n    <div class=\"list-item\">\n      <div class=\"list-main\">\n        <div class=\"list-title\">", "</div>\n        <div class=\"list-sub\">Last used: ", "</div>\n        ", "\n        ", "\n      </div>\n      <div class=\"list-meta\">\n        <label class=\"field\">\n          <span>Pattern</span>\n          <input\n            type=\"text\"\n            .value=", "\n            ?disabled=", "\n            @input=", "\n          />\n        </label>\n        <button\n          class=\"btn btn--sm danger\"\n          ?disabled=", "\n          @click=", "\n        >\n          Remove\n        </button>\n      </div>\n    </div>\n  "])), ((_a = entry.pattern) === null || _a === void 0 ? void 0 : _a.trim()) ? entry.pattern : "New pattern", lastUsed, lastCommand ? (0, lit_1.html)(templateObject_40 || (templateObject_40 = __makeTemplateObject(["<div class=\"list-sub mono\">", "</div>"], ["<div class=\"list-sub mono\">", "</div>"])), lastCommand) : lit_1.nothing, lastPath ? (0, lit_1.html)(templateObject_41 || (templateObject_41 = __makeTemplateObject(["<div class=\"list-sub mono\">", "</div>"], ["<div class=\"list-sub mono\">", "</div>"])), lastPath) : lit_1.nothing, (_b = entry.pattern) !== null && _b !== void 0 ? _b : "", state.disabled, function (event) {
        var target = event.target;
        state.onPatch(["agents", state.selectedScope, "allowlist", index, "pattern"], target.value);
    }, state.disabled, function () {
        if (state.allowlist.length <= 1) {
            state.onRemove(["agents", state.selectedScope, "allowlist"]);
            return;
        }
        state.onRemove(["agents", state.selectedScope, "allowlist", index]);
    });
}
function renderAgentBinding(agent, state) {
    var _a, _b, _c;
    var bindingValue = (_a = agent.binding) !== null && _a !== void 0 ? _a : "__default__";
    var label = ((_b = agent.name) === null || _b === void 0 ? void 0 : _b.trim()) ? "".concat(agent.name, " (").concat(agent.id, ")") : agent.id;
    var supportsBinding = state.nodes.length > 0;
    return (0, lit_1.html)(templateObject_44 || (templateObject_44 = __makeTemplateObject(["\n    <div class=\"list-item\">\n      <div class=\"list-main\">\n        <div class=\"list-title\">", "</div>\n        <div class=\"list-sub\">\n          ", " \u00B7\n          ", "\n        </div>\n      </div>\n      <div class=\"list-meta\">\n        <label class=\"field\">\n          <span>Binding</span>\n          <select\n            ?disabled=", "\n            @change=", "\n          >\n            <option value=\"__default__\" ?selected=", ">\n              Use default\n            </option>\n            ", "\n          </select>\n        </label>\n      </div>\n    </div>\n  "], ["\n    <div class=\"list-item\">\n      <div class=\"list-main\">\n        <div class=\"list-title\">", "</div>\n        <div class=\"list-sub\">\n          ", " \u00B7\n          ", "\n        </div>\n      </div>\n      <div class=\"list-meta\">\n        <label class=\"field\">\n          <span>Binding</span>\n          <select\n            ?disabled=", "\n            @change=", "\n          >\n            <option value=\"__default__\" ?selected=", ">\n              Use default\n            </option>\n            ", "\n          </select>\n        </label>\n      </div>\n    </div>\n  "])), label, agent.isDefault ? "default agent" : "agent", bindingValue === "__default__"
        ? "uses default (".concat((_c = state.defaultBinding) !== null && _c !== void 0 ? _c : "any", ")")
        : "override: ".concat(agent.binding), state.disabled || !supportsBinding, function (event) {
        var target = event.target;
        var value = target.value.trim();
        state.onBindAgent(agent.index, value === "__default__" ? null : value);
    }, bindingValue === "__default__", state.nodes.map(function (node) {
        return (0, lit_1.html)(templateObject_43 || (templateObject_43 = __makeTemplateObject(["<option\n                  value=", "\n                  ?selected=", "\n                >\n                  ", "\n                </option>"], ["<option\n                  value=", "\n                  ?selected=", "\n                >\n                  ", "\n                </option>"])), node.id, bindingValue === node.id, node.label);
    }));
}
function resolveExecNodes(nodes) {
    var list = [];
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var node = nodes_1[_i];
        var commands = Array.isArray(node.commands) ? node.commands : [];
        var supports = commands.some(function (cmd) { return String(cmd) === "system.run"; });
        if (!supports) {
            continue;
        }
        var nodeId = typeof node.nodeId === "string" ? node.nodeId.trim() : "";
        if (!nodeId) {
            continue;
        }
        var displayName = typeof node.displayName === "string" && node.displayName.trim()
            ? node.displayName.trim()
            : nodeId;
        list.push({
            id: nodeId,
            label: displayName === nodeId ? nodeId : "".concat(displayName, " \u00B7 ").concat(nodeId),
        });
    }
    list.sort(function (a, b) { return a.label.localeCompare(b.label); });
    return list;
}
function resolveExecApprovalsNodes(nodes) {
    var list = [];
    for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
        var node = nodes_2[_i];
        var commands = Array.isArray(node.commands) ? node.commands : [];
        var supports = commands.some(function (cmd) {
            return String(cmd) === "system.execApprovals.get" || String(cmd) === "system.execApprovals.set";
        });
        if (!supports) {
            continue;
        }
        var nodeId = typeof node.nodeId === "string" ? node.nodeId.trim() : "";
        if (!nodeId) {
            continue;
        }
        var displayName = typeof node.displayName === "string" && node.displayName.trim()
            ? node.displayName.trim()
            : nodeId;
        list.push({
            id: nodeId,
            label: displayName === nodeId ? nodeId : "".concat(displayName, " \u00B7 ").concat(nodeId),
        });
    }
    list.sort(function (a, b) { return a.label.localeCompare(b.label); });
    return list;
}
function resolveAgentBindings(config) {
    var _a, _b, _c;
    var fallbackAgent = {
        id: "main",
        name: undefined,
        index: 0,
        isDefault: true,
        binding: null,
    };
    if (!config || typeof config !== "object") {
        return { defaultBinding: null, agents: [fallbackAgent] };
    }
    var tools = ((_a = config.tools) !== null && _a !== void 0 ? _a : {});
    var exec = ((_b = tools.exec) !== null && _b !== void 0 ? _b : {});
    var defaultBinding = typeof exec.node === "string" && exec.node.trim() ? exec.node.trim() : null;
    var agentsNode = ((_c = config.agents) !== null && _c !== void 0 ? _c : {});
    var list = Array.isArray(agentsNode.list) ? agentsNode.list : [];
    if (list.length === 0) {
        return { defaultBinding: defaultBinding, agents: [fallbackAgent] };
    }
    var agents = [];
    list.forEach(function (entry, index) {
        var _a, _b;
        if (!entry || typeof entry !== "object") {
            return;
        }
        var record = entry;
        var id = typeof record.id === "string" ? record.id.trim() : "";
        if (!id) {
            return;
        }
        var name = typeof record.name === "string" ? record.name.trim() : undefined;
        var isDefault = record.default === true;
        var toolsEntry = ((_a = record.tools) !== null && _a !== void 0 ? _a : {});
        var execEntry = ((_b = toolsEntry.exec) !== null && _b !== void 0 ? _b : {});
        var binding = typeof execEntry.node === "string" && execEntry.node.trim() ? execEntry.node.trim() : null;
        agents.push({
            id: id,
            name: name || undefined,
            index: index,
            isDefault: isDefault,
            binding: binding,
        });
    });
    if (agents.length === 0) {
        agents.push(fallbackAgent);
    }
    return { defaultBinding: defaultBinding, agents: agents };
}
function renderNode(node) {
    var connected = Boolean(node.connected);
    var paired = Boolean(node.paired);
    var title = (typeof node.displayName === "string" && node.displayName.trim()) ||
        (typeof node.nodeId === "string" ? node.nodeId : "unknown");
    var caps = Array.isArray(node.caps) ? node.caps : [];
    var commands = Array.isArray(node.commands) ? node.commands : [];
    return (0, lit_1.html)(templateObject_47 || (templateObject_47 = __makeTemplateObject(["\n    <div class=\"list-item\">\n      <div class=\"list-main\">\n        <div class=\"list-title\">", "</div>\n        <div class=\"list-sub\">\n          ", "\n          ", "\n          ", "\n        </div>\n        <div class=\"chip-row\" style=\"margin-top: 6px;\">\n          <span class=\"chip\">", "</span>\n          <span class=\"chip ", "\">\n            ", "\n          </span>\n          ", "\n          ", "\n        </div>\n      </div>\n    </div>\n  "], ["\n    <div class=\"list-item\">\n      <div class=\"list-main\">\n        <div class=\"list-title\">", "</div>\n        <div class=\"list-sub\">\n          ", "\n          ", "\n          ", "\n        </div>\n        <div class=\"chip-row\" style=\"margin-top: 6px;\">\n          <span class=\"chip\">", "</span>\n          <span class=\"chip ", "\">\n            ", "\n          </span>\n          ", "\n          ", "\n        </div>\n      </div>\n    </div>\n  "])), title, typeof node.nodeId === "string" ? node.nodeId : "", typeof node.remoteIp === "string" ? " \u00B7 ".concat(node.remoteIp) : "", typeof node.version === "string" ? " \u00B7 ".concat(node.version) : "", paired ? "paired" : "unpaired", connected ? "chip-ok" : "chip-warn", connected ? "connected" : "offline", caps.slice(0, 12).map(function (c) { return (0, lit_1.html)(templateObject_45 || (templateObject_45 = __makeTemplateObject(["<span class=\"chip\">", "</span>"], ["<span class=\"chip\">", "</span>"])), String(c)); }), commands.slice(0, 8).map(function (c) { return (0, lit_1.html)(templateObject_46 || (templateObject_46 = __makeTemplateObject(["<span class=\"chip\">", "</span>"], ["<span class=\"chip\">", "</span>"])), String(c)); }));
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32, templateObject_33, templateObject_34, templateObject_35, templateObject_36, templateObject_37, templateObject_38, templateObject_39, templateObject_40, templateObject_41, templateObject_42, templateObject_43, templateObject_44, templateObject_45, templateObject_46, templateObject_47;
