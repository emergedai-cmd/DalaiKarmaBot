"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildA2UITextJsonl = buildA2UITextJsonl;
exports.validateA2UIJsonl = validateA2UIJsonl;
var A2UI_ACTION_KEYS = [
    "beginRendering",
    "surfaceUpdate",
    "dataModelUpdate",
    "deleteSurface",
    "createSurface",
];
function buildA2UITextJsonl(text) {
    var surfaceId = "main";
    var rootId = "root";
    var textId = "text";
    var payloads = [
        {
            surfaceUpdate: {
                surfaceId: surfaceId,
                components: [
                    {
                        id: rootId,
                        component: { Column: { children: { explicitList: [textId] } } },
                    },
                    {
                        id: textId,
                        component: {
                            Text: { text: { literalString: text }, usageHint: "body" },
                        },
                    },
                ],
            },
        },
        { beginRendering: { surfaceId: surfaceId, root: rootId } },
    ];
    return payloads.map(function (payload) { return JSON.stringify(payload); }).join("\n");
}
function validateA2UIJsonl(jsonl) {
    var lines = jsonl.split(/\r?\n/);
    var errors = [];
    var sawV08 = false;
    var sawV09 = false;
    var messageCount = 0;
    lines.forEach(function (line, idx) {
        var trimmed = line.trim();
        if (!trimmed) {
            return;
        }
        messageCount += 1;
        var obj;
        try {
            obj = JSON.parse(trimmed);
        }
        catch (err) {
            errors.push("line ".concat(idx + 1, ": ").concat(String(err)));
            return;
        }
        if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
            errors.push("line ".concat(idx + 1, ": expected JSON object"));
            return;
        }
        var record = obj;
        var actionKeys = A2UI_ACTION_KEYS.filter(function (key) { return key in record; });
        if (actionKeys.length !== 1) {
            errors.push("line ".concat(idx + 1, ": expected exactly one action key (").concat(A2UI_ACTION_KEYS.join(", "), ")"));
            return;
        }
        if (actionKeys[0] === "createSurface") {
            sawV09 = true;
        }
        else {
            sawV08 = true;
        }
    });
    if (messageCount === 0) {
        errors.push("no JSONL messages found");
    }
    if (sawV08 && sawV09) {
        errors.push("mixed A2UI v0.8 and v0.9 messages in one file");
    }
    if (errors.length > 0) {
        throw new Error("Invalid A2UI JSONL:\n- ".concat(errors.join("\n- ")));
    }
    var version = sawV09 ? "v0.9" : "v0.8";
    return { version: version, messageCount: messageCount };
}
