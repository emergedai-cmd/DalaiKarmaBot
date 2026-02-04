"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultAcpSessionStore = void 0;
exports.createInMemorySessionStore = createInMemorySessionStore;
var node_crypto_1 = require("node:crypto");
function createInMemorySessionStore() {
    var sessions = new Map();
    var runIdToSessionId = new Map();
    var createSession = function (params) {
        var _a;
        var sessionId = (_a = params.sessionId) !== null && _a !== void 0 ? _a : (0, node_crypto_1.randomUUID)();
        var session = {
            sessionId: sessionId,
            sessionKey: params.sessionKey,
            cwd: params.cwd,
            createdAt: Date.now(),
            abortController: null,
            activeRunId: null,
        };
        sessions.set(sessionId, session);
        return session;
    };
    var getSession = function (sessionId) { return sessions.get(sessionId); };
    var getSessionByRunId = function (runId) {
        var sessionId = runIdToSessionId.get(runId);
        return sessionId ? sessions.get(sessionId) : undefined;
    };
    var setActiveRun = function (sessionId, runId, abortController) {
        var session = sessions.get(sessionId);
        if (!session) {
            return;
        }
        session.activeRunId = runId;
        session.abortController = abortController;
        runIdToSessionId.set(runId, sessionId);
    };
    var clearActiveRun = function (sessionId) {
        var session = sessions.get(sessionId);
        if (!session) {
            return;
        }
        if (session.activeRunId) {
            runIdToSessionId.delete(session.activeRunId);
        }
        session.activeRunId = null;
        session.abortController = null;
    };
    var cancelActiveRun = function (sessionId) {
        var session = sessions.get(sessionId);
        if (!(session === null || session === void 0 ? void 0 : session.abortController)) {
            return false;
        }
        session.abortController.abort();
        if (session.activeRunId) {
            runIdToSessionId.delete(session.activeRunId);
        }
        session.abortController = null;
        session.activeRunId = null;
        return true;
    };
    var clearAllSessionsForTest = function () {
        var _a;
        for (var _i = 0, _b = sessions.values(); _i < _b.length; _i++) {
            var session = _b[_i];
            (_a = session.abortController) === null || _a === void 0 ? void 0 : _a.abort();
        }
        sessions.clear();
        runIdToSessionId.clear();
    };
    return {
        createSession: createSession,
        getSession: getSession,
        getSessionByRunId: getSessionByRunId,
        setActiveRun: setActiveRun,
        clearActiveRun: clearActiveRun,
        cancelActiveRun: cancelActiveRun,
        clearAllSessionsForTest: clearAllSessionsForTest,
    };
}
exports.defaultAcpSessionStore = createInMemorySessionStore();
