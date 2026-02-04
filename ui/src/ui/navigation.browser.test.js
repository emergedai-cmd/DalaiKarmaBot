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
var app_1 = require("./app");
require("../styles.css");
// oxlint-disable-next-line typescript/unbound-method
var originalConnect = app_1.OpenClawApp.prototype.connect;
function mountApp(pathname) {
    window.history.replaceState({}, "", pathname);
    var app = document.createElement("openclaw-app");
    document.body.append(app);
    return app;
}
function nextFrame() {
    return new Promise(function (resolve) {
        requestAnimationFrame(function () { return resolve(); });
    });
}
(0, vitest_1.beforeEach)(function () {
    app_1.OpenClawApp.prototype.connect = function () {
        // no-op: avoid real gateway WS connections in browser tests
    };
    window.__OPENCLAW_CONTROL_UI_BASE_PATH__ = undefined;
    localStorage.clear();
    document.body.innerHTML = "";
});
(0, vitest_1.afterEach)(function () {
    app_1.OpenClawApp.prototype.connect = originalConnect;
    window.__OPENCLAW_CONTROL_UI_BASE_PATH__ = undefined;
    localStorage.clear();
    document.body.innerHTML = "";
});
(0, vitest_1.describe)("control UI routing", function () {
    (0, vitest_1.it)("hydrates the tab from the location", function () { return __awaiter(void 0, void 0, void 0, function () {
        var app;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = mountApp("/sessions");
                    return [4 /*yield*/, app.updateComplete];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(app.tab).toBe("sessions");
                    (0, vitest_1.expect)(window.location.pathname).toBe("/sessions");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("respects /ui base paths", function () { return __awaiter(void 0, void 0, void 0, function () {
        var app;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = mountApp("/ui/cron");
                    return [4 /*yield*/, app.updateComplete];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(app.basePath).toBe("/ui");
                    (0, vitest_1.expect)(app.tab).toBe("cron");
                    (0, vitest_1.expect)(window.location.pathname).toBe("/ui/cron");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("infers nested base paths", function () { return __awaiter(void 0, void 0, void 0, function () {
        var app;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = mountApp("/apps/openclaw/cron");
                    return [4 /*yield*/, app.updateComplete];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(app.basePath).toBe("/apps/openclaw");
                    (0, vitest_1.expect)(app.tab).toBe("cron");
                    (0, vitest_1.expect)(window.location.pathname).toBe("/apps/openclaw/cron");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("honors explicit base path overrides", function () { return __awaiter(void 0, void 0, void 0, function () {
        var app;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    window.__OPENCLAW_CONTROL_UI_BASE_PATH__ = "/openclaw";
                    app = mountApp("/openclaw/sessions");
                    return [4 /*yield*/, app.updateComplete];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(app.basePath).toBe("/openclaw");
                    (0, vitest_1.expect)(app.tab).toBe("sessions");
                    (0, vitest_1.expect)(window.location.pathname).toBe("/openclaw/sessions");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updates the URL when clicking nav items", function () { return __awaiter(void 0, void 0, void 0, function () {
        var app, link;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = mountApp("/chat");
                    return [4 /*yield*/, app.updateComplete];
                case 1:
                    _a.sent();
                    link = app.querySelector('a.nav-item[href="/channels"]');
                    (0, vitest_1.expect)(link).not.toBeNull();
                    link === null || link === void 0 ? void 0 : link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));
                    return [4 /*yield*/, app.updateComplete];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(app.tab).toBe("channels");
                    (0, vitest_1.expect)(window.location.pathname).toBe("/channels");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps chat and nav usable on narrow viewports", function () { return __awaiter(void 0, void 0, void 0, function () {
        var app, split, chatMain;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = mountApp("/chat");
                    return [4 /*yield*/, app.updateComplete];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(window.matchMedia("(max-width: 768px)").matches).toBe(true);
                    split = app.querySelector(".chat-split-container");
                    (0, vitest_1.expect)(split).not.toBeNull();
                    if (split) {
                        (0, vitest_1.expect)(getComputedStyle(split).position).not.toBe("fixed");
                    }
                    chatMain = app.querySelector(".chat-main");
                    (0, vitest_1.expect)(chatMain).not.toBeNull();
                    if (chatMain) {
                        (0, vitest_1.expect)(getComputedStyle(chatMain).display).not.toBe("none");
                    }
                    if (!split) return [3 /*break*/, 3];
                    split.classList.add("chat-split-container--open");
                    return [4 /*yield*/, app.updateComplete];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(getComputedStyle(split).position).toBe("fixed");
                    _a.label = 3;
                case 3:
                    if (chatMain) {
                        (0, vitest_1.expect)(getComputedStyle(chatMain).display).toBe("none");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("auto-scrolls chat history to the latest message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var app, initialContainer, i, container, maxScroll, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = mountApp("/chat");
                    return [4 /*yield*/, app.updateComplete];
                case 1:
                    _a.sent();
                    initialContainer = app.querySelector(".chat-thread");
                    (0, vitest_1.expect)(initialContainer).not.toBeNull();
                    if (!initialContainer) {
                        return [2 /*return*/];
                    }
                    initialContainer.style.maxHeight = "180px";
                    initialContainer.style.overflow = "auto";
                    app.chatMessages = Array.from({ length: 60 }, function (_, index) { return ({
                        role: "assistant",
                        content: "Line ".concat(index, " - ").concat("x".repeat(200)),
                        timestamp: Date.now() + index,
                    }); });
                    return [4 /*yield*/, app.updateComplete];
                case 2:
                    _a.sent();
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < 6)) return [3 /*break*/, 6];
                    return [4 /*yield*/, nextFrame()];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 3];
                case 6:
                    container = app.querySelector(".chat-thread");
                    (0, vitest_1.expect)(container).not.toBeNull();
                    if (!container) {
                        return [2 /*return*/];
                    }
                    maxScroll = container.scrollHeight - container.clientHeight;
                    (0, vitest_1.expect)(maxScroll).toBeGreaterThan(0);
                    i = 0;
                    _a.label = 7;
                case 7:
                    if (!(i < 10)) return [3 /*break*/, 10];
                    if (container.scrollTop === maxScroll) {
                        return [3 /*break*/, 10];
                    }
                    return [4 /*yield*/, nextFrame()];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 7];
                case 10:
                    (0, vitest_1.expect)(container.scrollTop).toBe(maxScroll);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("hydrates token from URL params and strips it", function () { return __awaiter(void 0, void 0, void 0, function () {
        var app;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = mountApp("/ui/overview?token=abc123");
                    return [4 /*yield*/, app.updateComplete];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(app.settings.token).toBe("abc123");
                    (0, vitest_1.expect)(window.location.pathname).toBe("/ui/overview");
                    (0, vitest_1.expect)(window.location.search).toBe("");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("hydrates password from URL params and strips it", function () { return __awaiter(void 0, void 0, void 0, function () {
        var app;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = mountApp("/ui/overview?password=sekret");
                    return [4 /*yield*/, app.updateComplete];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(app.password).toBe("sekret");
                    (0, vitest_1.expect)(window.location.pathname).toBe("/ui/overview");
                    (0, vitest_1.expect)(window.location.search).toBe("");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("hydrates token from URL params even when settings already set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var app;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localStorage.setItem("openclaw.control.settings.v1", JSON.stringify({ token: "existing-token" }));
                    app = mountApp("/ui/overview?token=abc123");
                    return [4 /*yield*/, app.updateComplete];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(app.settings.token).toBe("abc123");
                    (0, vitest_1.expect)(window.location.pathname).toBe("/ui/overview");
                    (0, vitest_1.expect)(window.location.search).toBe("");
                    return [2 /*return*/];
            }
        });
    }); });
});
