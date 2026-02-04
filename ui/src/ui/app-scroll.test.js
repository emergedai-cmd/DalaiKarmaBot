"use strict";
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
var app_scroll_1 = require("./app-scroll");
/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
/** Minimal ScrollHost stub for unit tests. */
function createScrollHost(overrides) {
    if (overrides === void 0) { overrides = {}; }
    var _a = overrides.scrollHeight, scrollHeight = _a === void 0 ? 2000 : _a, _b = overrides.scrollTop, scrollTop = _b === void 0 ? 1500 : _b, _c = overrides.clientHeight, clientHeight = _c === void 0 ? 500 : _c, _d = overrides.overflowY, overflowY = _d === void 0 ? "auto" : _d;
    var container = {
        scrollHeight: scrollHeight,
        scrollTop: scrollTop,
        clientHeight: clientHeight,
        style: { overflowY: overflowY },
    };
    // Make getComputedStyle return the overflowY value
    vitest_1.vi.spyOn(window, "getComputedStyle").mockReturnValue({
        overflowY: overflowY,
    });
    var host = {
        updateComplete: Promise.resolve(),
        querySelector: vitest_1.vi.fn().mockReturnValue(container),
        style: { setProperty: vitest_1.vi.fn() },
        chatScrollFrame: null,
        chatScrollTimeout: null,
        chatHasAutoScrolled: false,
        chatUserNearBottom: true,
        chatNewMessagesBelow: false,
        logsScrollFrame: null,
        logsAtBottom: true,
        topbarObserver: null,
    };
    return { host: host, container: container };
}
function createScrollEvent(scrollHeight, scrollTop, clientHeight) {
    return {
        currentTarget: { scrollHeight: scrollHeight, scrollTop: scrollTop, clientHeight: clientHeight },
    };
}
/* ------------------------------------------------------------------ */
/*  handleChatScroll – threshold tests                                 */
/* ------------------------------------------------------------------ */
(0, vitest_1.describe)("handleChatScroll", function () {
    (0, vitest_1.it)("sets chatUserNearBottom=true when within the 450px threshold", function () {
        var host = createScrollHost({}).host;
        // distanceFromBottom = 2000 - 1600 - 400 = 0 → clearly near bottom
        var event = createScrollEvent(2000, 1600, 400);
        (0, app_scroll_1.handleChatScroll)(host, event);
        (0, vitest_1.expect)(host.chatUserNearBottom).toBe(true);
    });
    (0, vitest_1.it)("sets chatUserNearBottom=true when distance is just under threshold", function () {
        var host = createScrollHost({}).host;
        // distanceFromBottom = 2000 - 1151 - 400 = 449 → just under threshold
        var event = createScrollEvent(2000, 1151, 400);
        (0, app_scroll_1.handleChatScroll)(host, event);
        (0, vitest_1.expect)(host.chatUserNearBottom).toBe(true);
    });
    (0, vitest_1.it)("sets chatUserNearBottom=false when distance is exactly at threshold", function () {
        var host = createScrollHost({}).host;
        // distanceFromBottom = 2000 - 1150 - 400 = 450 → at threshold (uses strict <)
        var event = createScrollEvent(2000, 1150, 400);
        (0, app_scroll_1.handleChatScroll)(host, event);
        (0, vitest_1.expect)(host.chatUserNearBottom).toBe(false);
    });
    (0, vitest_1.it)("sets chatUserNearBottom=false when scrolled well above threshold", function () {
        var host = createScrollHost({}).host;
        // distanceFromBottom = 2000 - 500 - 400 = 1100 → way above threshold
        var event = createScrollEvent(2000, 500, 400);
        (0, app_scroll_1.handleChatScroll)(host, event);
        (0, vitest_1.expect)(host.chatUserNearBottom).toBe(false);
    });
    (0, vitest_1.it)("sets chatUserNearBottom=false when user scrolled up past one long message (>200px <450px)", function () {
        var host = createScrollHost({}).host;
        // distanceFromBottom = 2000 - 1250 - 400 = 350 → old threshold would say "near", new says "near"
        // distanceFromBottom = 2000 - 1100 - 400 = 500 → old threshold would say "not near", new also "not near"
        var event = createScrollEvent(2000, 1100, 400);
        (0, app_scroll_1.handleChatScroll)(host, event);
        (0, vitest_1.expect)(host.chatUserNearBottom).toBe(false);
    });
});
/* ------------------------------------------------------------------ */
/*  scheduleChatScroll – respects user scroll position                 */
/* ------------------------------------------------------------------ */
(0, vitest_1.describe)("scheduleChatScroll", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.useFakeTimers();
        vitest_1.vi.spyOn(window, "requestAnimationFrame").mockImplementation(function (cb) {
            cb(0);
            return 1;
        });
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.useRealTimers();
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)("scrolls to bottom when user is near bottom (no force)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, host, container;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createScrollHost({
                        scrollHeight: 2000,
                        scrollTop: 1600,
                        clientHeight: 400,
                    }), host = _a.host, container = _a.container;
                    // distanceFromBottom = 2000 - 1600 - 400 = 0 → near bottom
                    host.chatUserNearBottom = true;
                    (0, app_scroll_1.scheduleChatScroll)(host);
                    return [4 /*yield*/, host.updateComplete];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(container.scrollTop).toBe(container.scrollHeight);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does NOT scroll when user is scrolled up and no force", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, host, container, originalScrollTop;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createScrollHost({
                        scrollHeight: 2000,
                        scrollTop: 500,
                        clientHeight: 400,
                    }), host = _a.host, container = _a.container;
                    // distanceFromBottom = 2000 - 500 - 400 = 1100 → not near bottom
                    host.chatUserNearBottom = false;
                    originalScrollTop = container.scrollTop;
                    (0, app_scroll_1.scheduleChatScroll)(host);
                    return [4 /*yield*/, host.updateComplete];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(container.scrollTop).toBe(originalScrollTop);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does NOT scroll with force=true when user has explicitly scrolled up", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, host, container, originalScrollTop;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createScrollHost({
                        scrollHeight: 2000,
                        scrollTop: 500,
                        clientHeight: 400,
                    }), host = _a.host, container = _a.container;
                    // User has scrolled up — chatUserNearBottom is false
                    host.chatUserNearBottom = false;
                    host.chatHasAutoScrolled = true; // Already past initial load
                    originalScrollTop = container.scrollTop;
                    (0, app_scroll_1.scheduleChatScroll)(host, true);
                    return [4 /*yield*/, host.updateComplete];
                case 1:
                    _b.sent();
                    // force=true should still NOT override explicit user scroll-up after initial load
                    (0, vitest_1.expect)(container.scrollTop).toBe(originalScrollTop);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("DOES scroll with force=true on initial load (chatHasAutoScrolled=false)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, host, container;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createScrollHost({
                        scrollHeight: 2000,
                        scrollTop: 500,
                        clientHeight: 400,
                    }), host = _a.host, container = _a.container;
                    host.chatUserNearBottom = false;
                    host.chatHasAutoScrolled = false; // Initial load
                    (0, app_scroll_1.scheduleChatScroll)(host, true);
                    return [4 /*yield*/, host.updateComplete];
                case 1:
                    _b.sent();
                    // On initial load, force should work regardless
                    (0, vitest_1.expect)(container.scrollTop).toBe(container.scrollHeight);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sets chatNewMessagesBelow when not scrolling due to user position", function () { return __awaiter(void 0, void 0, void 0, function () {
        var host;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    host = createScrollHost({
                        scrollHeight: 2000,
                        scrollTop: 500,
                        clientHeight: 400,
                    }).host;
                    host.chatUserNearBottom = false;
                    host.chatHasAutoScrolled = true;
                    host.chatNewMessagesBelow = false;
                    (0, app_scroll_1.scheduleChatScroll)(host);
                    return [4 /*yield*/, host.updateComplete];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(host.chatNewMessagesBelow).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
/* ------------------------------------------------------------------ */
/*  Streaming: rapid chatStream changes should not reset scroll        */
/* ------------------------------------------------------------------ */
(0, vitest_1.describe)("streaming scroll behavior", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.useFakeTimers();
        vitest_1.vi.spyOn(window, "requestAnimationFrame").mockImplementation(function (cb) {
            cb(0);
            return 1;
        });
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.useRealTimers();
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)("multiple rapid scheduleChatScroll calls do not scroll when user is scrolled up", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, host, container, originalScrollTop;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createScrollHost({
                        scrollHeight: 2000,
                        scrollTop: 500,
                        clientHeight: 400,
                    }), host = _a.host, container = _a.container;
                    host.chatUserNearBottom = false;
                    host.chatHasAutoScrolled = true;
                    originalScrollTop = container.scrollTop;
                    // Simulate rapid streaming token updates
                    (0, app_scroll_1.scheduleChatScroll)(host);
                    (0, app_scroll_1.scheduleChatScroll)(host);
                    (0, app_scroll_1.scheduleChatScroll)(host);
                    return [4 /*yield*/, host.updateComplete];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(container.scrollTop).toBe(originalScrollTop);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("streaming scrolls correctly when user IS at bottom", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, host, container;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createScrollHost({
                        scrollHeight: 2000,
                        scrollTop: 1600,
                        clientHeight: 400,
                    }), host = _a.host, container = _a.container;
                    host.chatUserNearBottom = true;
                    host.chatHasAutoScrolled = true;
                    // Simulate streaming
                    (0, app_scroll_1.scheduleChatScroll)(host);
                    return [4 /*yield*/, host.updateComplete];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(container.scrollTop).toBe(container.scrollHeight);
                    return [2 /*return*/];
            }
        });
    }); });
});
/* ------------------------------------------------------------------ */
/*  resetChatScroll                                                    */
/* ------------------------------------------------------------------ */
(0, vitest_1.describe)("resetChatScroll", function () {
    (0, vitest_1.it)("resets state for new chat session", function () {
        var host = createScrollHost({}).host;
        host.chatHasAutoScrolled = true;
        host.chatUserNearBottom = false;
        (0, app_scroll_1.resetChatScroll)(host);
        (0, vitest_1.expect)(host.chatHasAutoScrolled).toBe(false);
        (0, vitest_1.expect)(host.chatUserNearBottom).toBe(true);
    });
});
