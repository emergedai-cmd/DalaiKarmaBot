"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var navigation_1 = require("./navigation");
/** All valid tab identifiers derived from TAB_GROUPS */
var ALL_TABS = navigation_1.TAB_GROUPS.flatMap(function (group) { return group.tabs; });
(0, vitest_1.describe)("iconForTab", function () {
    (0, vitest_1.it)("returns a non-empty string for every tab", function () {
        for (var _i = 0, ALL_TABS_1 = ALL_TABS; _i < ALL_TABS_1.length; _i++) {
            var tab = ALL_TABS_1[_i];
            var icon = (0, navigation_1.iconForTab)(tab);
            (0, vitest_1.expect)(icon).toBeTruthy();
            (0, vitest_1.expect)(typeof icon).toBe("string");
            (0, vitest_1.expect)(icon.length).toBeGreaterThan(0);
        }
    });
    (0, vitest_1.it)("returns stable icons for known tabs", function () {
        (0, vitest_1.expect)((0, navigation_1.iconForTab)("chat")).toBe("💬");
        (0, vitest_1.expect)((0, navigation_1.iconForTab)("overview")).toBe("📊");
        (0, vitest_1.expect)((0, navigation_1.iconForTab)("channels")).toBe("🔗");
        (0, vitest_1.expect)((0, navigation_1.iconForTab)("instances")).toBe("📡");
        (0, vitest_1.expect)((0, navigation_1.iconForTab)("sessions")).toBe("📄");
        (0, vitest_1.expect)((0, navigation_1.iconForTab)("cron")).toBe("⏰");
        (0, vitest_1.expect)((0, navigation_1.iconForTab)("skills")).toBe("⚡️");
        (0, vitest_1.expect)((0, navigation_1.iconForTab)("nodes")).toBe("🖥️");
        (0, vitest_1.expect)((0, navigation_1.iconForTab)("config")).toBe("⚙️");
        (0, vitest_1.expect)((0, navigation_1.iconForTab)("debug")).toBe("🐞");
        (0, vitest_1.expect)((0, navigation_1.iconForTab)("logs")).toBe("🧾");
    });
    (0, vitest_1.it)("returns a fallback icon for unknown tab", function () {
        // TypeScript won't allow this normally, but runtime could receive unexpected values
        var unknownTab = "unknown";
        (0, vitest_1.expect)((0, navigation_1.iconForTab)(unknownTab)).toBe("📁");
    });
});
(0, vitest_1.describe)("titleForTab", function () {
    (0, vitest_1.it)("returns a non-empty string for every tab", function () {
        for (var _i = 0, ALL_TABS_2 = ALL_TABS; _i < ALL_TABS_2.length; _i++) {
            var tab = ALL_TABS_2[_i];
            var title = (0, navigation_1.titleForTab)(tab);
            (0, vitest_1.expect)(title).toBeTruthy();
            (0, vitest_1.expect)(typeof title).toBe("string");
        }
    });
    (0, vitest_1.it)("returns expected titles", function () {
        (0, vitest_1.expect)((0, navigation_1.titleForTab)("chat")).toBe("Chat");
        (0, vitest_1.expect)((0, navigation_1.titleForTab)("overview")).toBe("Overview");
        (0, vitest_1.expect)((0, navigation_1.titleForTab)("cron")).toBe("Cron Jobs");
    });
});
(0, vitest_1.describe)("subtitleForTab", function () {
    (0, vitest_1.it)("returns a string for every tab", function () {
        for (var _i = 0, ALL_TABS_3 = ALL_TABS; _i < ALL_TABS_3.length; _i++) {
            var tab = ALL_TABS_3[_i];
            var subtitle = (0, navigation_1.subtitleForTab)(tab);
            (0, vitest_1.expect)(typeof subtitle).toBe("string");
        }
    });
    (0, vitest_1.it)("returns descriptive subtitles", function () {
        (0, vitest_1.expect)((0, navigation_1.subtitleForTab)("chat")).toContain("chat session");
        (0, vitest_1.expect)((0, navigation_1.subtitleForTab)("config")).toContain("openclaw.json");
    });
});
(0, vitest_1.describe)("normalizeBasePath", function () {
    (0, vitest_1.it)("returns empty string for falsy input", function () {
        (0, vitest_1.expect)((0, navigation_1.normalizeBasePath)("")).toBe("");
    });
    (0, vitest_1.it)("adds leading slash if missing", function () {
        (0, vitest_1.expect)((0, navigation_1.normalizeBasePath)("ui")).toBe("/ui");
    });
    (0, vitest_1.it)("removes trailing slash", function () {
        (0, vitest_1.expect)((0, navigation_1.normalizeBasePath)("/ui/")).toBe("/ui");
    });
    (0, vitest_1.it)("returns empty string for root path", function () {
        (0, vitest_1.expect)((0, navigation_1.normalizeBasePath)("/")).toBe("");
    });
    (0, vitest_1.it)("handles nested paths", function () {
        (0, vitest_1.expect)((0, navigation_1.normalizeBasePath)("/apps/openclaw")).toBe("/apps/openclaw");
    });
});
(0, vitest_1.describe)("normalizePath", function () {
    (0, vitest_1.it)("returns / for falsy input", function () {
        (0, vitest_1.expect)((0, navigation_1.normalizePath)("")).toBe("/");
    });
    (0, vitest_1.it)("adds leading slash if missing", function () {
        (0, vitest_1.expect)((0, navigation_1.normalizePath)("chat")).toBe("/chat");
    });
    (0, vitest_1.it)("removes trailing slash except for root", function () {
        (0, vitest_1.expect)((0, navigation_1.normalizePath)("/chat/")).toBe("/chat");
        (0, vitest_1.expect)((0, navigation_1.normalizePath)("/")).toBe("/");
    });
});
(0, vitest_1.describe)("pathForTab", function () {
    (0, vitest_1.it)("returns correct path without base", function () {
        (0, vitest_1.expect)((0, navigation_1.pathForTab)("chat")).toBe("/chat");
        (0, vitest_1.expect)((0, navigation_1.pathForTab)("overview")).toBe("/overview");
    });
    (0, vitest_1.it)("prepends base path", function () {
        (0, vitest_1.expect)((0, navigation_1.pathForTab)("chat", "/ui")).toBe("/ui/chat");
        (0, vitest_1.expect)((0, navigation_1.pathForTab)("sessions", "/apps/openclaw")).toBe("/apps/openclaw/sessions");
    });
});
(0, vitest_1.describe)("tabFromPath", function () {
    (0, vitest_1.it)("returns tab for valid path", function () {
        (0, vitest_1.expect)((0, navigation_1.tabFromPath)("/chat")).toBe("chat");
        (0, vitest_1.expect)((0, navigation_1.tabFromPath)("/overview")).toBe("overview");
        (0, vitest_1.expect)((0, navigation_1.tabFromPath)("/sessions")).toBe("sessions");
    });
    (0, vitest_1.it)("returns chat for root path", function () {
        (0, vitest_1.expect)((0, navigation_1.tabFromPath)("/")).toBe("chat");
    });
    (0, vitest_1.it)("handles base paths", function () {
        (0, vitest_1.expect)((0, navigation_1.tabFromPath)("/ui/chat", "/ui")).toBe("chat");
        (0, vitest_1.expect)((0, navigation_1.tabFromPath)("/apps/openclaw/sessions", "/apps/openclaw")).toBe("sessions");
    });
    (0, vitest_1.it)("returns null for unknown path", function () {
        (0, vitest_1.expect)((0, navigation_1.tabFromPath)("/unknown")).toBeNull();
    });
    (0, vitest_1.it)("is case-insensitive", function () {
        (0, vitest_1.expect)((0, navigation_1.tabFromPath)("/CHAT")).toBe("chat");
        (0, vitest_1.expect)((0, navigation_1.tabFromPath)("/Overview")).toBe("overview");
    });
});
(0, vitest_1.describe)("inferBasePathFromPathname", function () {
    (0, vitest_1.it)("returns empty string for root", function () {
        (0, vitest_1.expect)((0, navigation_1.inferBasePathFromPathname)("/")).toBe("");
    });
    (0, vitest_1.it)("returns empty string for direct tab path", function () {
        (0, vitest_1.expect)((0, navigation_1.inferBasePathFromPathname)("/chat")).toBe("");
        (0, vitest_1.expect)((0, navigation_1.inferBasePathFromPathname)("/overview")).toBe("");
    });
    (0, vitest_1.it)("infers base path from nested paths", function () {
        (0, vitest_1.expect)((0, navigation_1.inferBasePathFromPathname)("/ui/chat")).toBe("/ui");
        (0, vitest_1.expect)((0, navigation_1.inferBasePathFromPathname)("/apps/openclaw/sessions")).toBe("/apps/openclaw");
    });
    (0, vitest_1.it)("handles index.html suffix", function () {
        (0, vitest_1.expect)((0, navigation_1.inferBasePathFromPathname)("/index.html")).toBe("");
        (0, vitest_1.expect)((0, navigation_1.inferBasePathFromPathname)("/ui/index.html")).toBe("/ui");
    });
});
(0, vitest_1.describe)("TAB_GROUPS", function () {
    (0, vitest_1.it)("contains all expected groups", function () {
        var labels = navigation_1.TAB_GROUPS.map(function (g) { return g.label; });
        (0, vitest_1.expect)(labels).toContain("Chat");
        (0, vitest_1.expect)(labels).toContain("Control");
        (0, vitest_1.expect)(labels).toContain("Agent");
        (0, vitest_1.expect)(labels).toContain("Settings");
    });
    (0, vitest_1.it)("all tabs are unique", function () {
        var allTabs = navigation_1.TAB_GROUPS.flatMap(function (g) { return g.tabs; });
        var uniqueTabs = new Set(allTabs);
        (0, vitest_1.expect)(uniqueTabs.size).toBe(allTabs.length);
    });
});
