"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProcessedMessageTracker = createProcessedMessageTracker;
function createProcessedMessageTracker(limit) {
    if (limit === void 0) { limit = 2000; }
    var seen = new Set();
    var order = [];
    var mark = function (id) {
        var trimmed = id === null || id === void 0 ? void 0 : id.trim();
        if (!trimmed) {
            return true;
        }
        if (seen.has(trimmed)) {
            return false;
        }
        seen.add(trimmed);
        order.push(trimmed);
        if (order.length > limit) {
            var overflow = order.length - limit;
            for (var i = 0; i < overflow; i += 1) {
                var oldest = order.shift();
                if (oldest) {
                    seen.delete(oldest);
                }
            }
        }
        return true;
    };
    var has = function (id) {
        var trimmed = id === null || id === void 0 ? void 0 : id.trim();
        if (!trimmed) {
            return false;
        }
        return seen.has(trimmed);
    };
    return {
        mark: mark,
        has: has,
        size: function () { return seen.size; },
    };
}
