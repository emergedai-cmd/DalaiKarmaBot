"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setActiveMatrixClient = setActiveMatrixClient;
exports.getActiveMatrixClient = getActiveMatrixClient;
var activeClient = null;
function setActiveMatrixClient(client) {
    activeClient = client;
}
function getActiveMatrixClient() {
    return activeClient;
}
