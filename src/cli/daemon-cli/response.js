"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitDaemonActionJson = emitDaemonActionJson;
exports.buildDaemonServiceSnapshot = buildDaemonServiceSnapshot;
exports.createNullWriter = createNullWriter;
var node_stream_1 = require("node:stream");
var runtime_js_1 = require("../../runtime.js");
function emitDaemonActionJson(payload) {
    runtime_js_1.defaultRuntime.log(JSON.stringify(payload, null, 2));
}
function buildDaemonServiceSnapshot(service, loaded) {
    return {
        label: service.label,
        loaded: loaded,
        loadedText: service.loadedText,
        notLoadedText: service.notLoadedText,
    };
}
function createNullWriter() {
    return new node_stream_1.Writable({
        write: function (_chunk, _encoding, callback) {
            callback();
        },
    });
}
