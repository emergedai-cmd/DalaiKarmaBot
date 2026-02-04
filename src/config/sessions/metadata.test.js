"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var metadata_js_1 = require("./metadata.js");
(0, vitest_1.describe)("deriveSessionMetaPatch", function () {
    (0, vitest_1.it)("captures origin + group metadata", function () {
        var _a, _b;
        var patch = (0, metadata_js_1.deriveSessionMetaPatch)({
            ctx: {
                Provider: "whatsapp",
                ChatType: "group",
                GroupSubject: "Family",
                From: "123@g.us",
            },
            sessionKey: "agent:main:whatsapp:group:123@g.us",
        });
        (0, vitest_1.expect)((_a = patch === null || patch === void 0 ? void 0 : patch.origin) === null || _a === void 0 ? void 0 : _a.label).toBe("Family id:123@g.us");
        (0, vitest_1.expect)((_b = patch === null || patch === void 0 ? void 0 : patch.origin) === null || _b === void 0 ? void 0 : _b.provider).toBe("whatsapp");
        (0, vitest_1.expect)(patch === null || patch === void 0 ? void 0 : patch.subject).toBe("Family");
        (0, vitest_1.expect)(patch === null || patch === void 0 ? void 0 : patch.channel).toBe("whatsapp");
        (0, vitest_1.expect)(patch === null || patch === void 0 ? void 0 : patch.groupId).toBe("123@g.us");
    });
});
