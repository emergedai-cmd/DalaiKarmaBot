"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWizardSessionTracker = createWizardSessionTracker;
function createWizardSessionTracker() {
    var wizardSessions = new Map();
    var findRunningWizard = function () {
        for (var _i = 0, wizardSessions_1 = wizardSessions; _i < wizardSessions_1.length; _i++) {
            var _a = wizardSessions_1[_i], id = _a[0], session = _a[1];
            if (session.getStatus() === "running") {
                return id;
            }
        }
        return null;
    };
    var purgeWizardSession = function (id) {
        var session = wizardSessions.get(id);
        if (!session) {
            return;
        }
        if (session.getStatus() === "running") {
            return;
        }
        wizardSessions.delete(id);
    };
    return { wizardSessions: wizardSessions, findRunningWizard: findRunningWizard, purgeWizardSession: purgeWizardSession };
}
