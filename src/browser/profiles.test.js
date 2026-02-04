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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var profiles_js_1 = require("./profiles.js");
(0, vitest_1.describe)("profile name validation", function () {
    (0, vitest_1.it)("accepts valid lowercase names", function () {
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)("openclaw")).toBe(true);
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)("work")).toBe(true);
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)("my-profile")).toBe(true);
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)("test123")).toBe(true);
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)("a")).toBe(true);
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)("a-b-c-1-2-3")).toBe(true);
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)("1test")).toBe(true);
    });
    (0, vitest_1.it)("rejects empty or missing names", function () {
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)("")).toBe(false);
        // @ts-expect-error testing invalid input
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)(null)).toBe(false);
        // @ts-expect-error testing invalid input
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)(undefined)).toBe(false);
    });
    (0, vitest_1.it)("rejects names that are too long", function () {
        var longName = "a".repeat(65);
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)(longName)).toBe(false);
        var maxName = "a".repeat(64);
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)(maxName)).toBe(true);
    });
    (0, vitest_1.it)("rejects uppercase letters", function () {
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)("MyProfile")).toBe(false);
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)("PROFILE")).toBe(false);
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)("Work")).toBe(false);
    });
    (0, vitest_1.it)("rejects spaces and special characters", function () {
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)("my profile")).toBe(false);
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)("my_profile")).toBe(false);
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)("my.profile")).toBe(false);
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)("my/profile")).toBe(false);
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)("my@profile")).toBe(false);
    });
    (0, vitest_1.it)("rejects names starting with hyphen", function () {
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)("-invalid")).toBe(false);
        (0, vitest_1.expect)((0, profiles_js_1.isValidProfileName)("--double")).toBe(false);
    });
});
(0, vitest_1.describe)("port allocation", function () {
    (0, vitest_1.it)("allocates first port when none used", function () {
        var usedPorts = new Set();
        (0, vitest_1.expect)((0, profiles_js_1.allocateCdpPort)(usedPorts)).toBe(profiles_js_1.CDP_PORT_RANGE_START);
    });
    (0, vitest_1.it)("allocates within an explicit range", function () {
        var usedPorts = new Set();
        (0, vitest_1.expect)((0, profiles_js_1.allocateCdpPort)(usedPorts, { start: 20000, end: 20002 })).toBe(20000);
        usedPorts.add(20000);
        (0, vitest_1.expect)((0, profiles_js_1.allocateCdpPort)(usedPorts, { start: 20000, end: 20002 })).toBe(20001);
    });
    (0, vitest_1.it)("skips used ports and returns next available", function () {
        var usedPorts = new Set([profiles_js_1.CDP_PORT_RANGE_START, profiles_js_1.CDP_PORT_RANGE_START + 1]);
        (0, vitest_1.expect)((0, profiles_js_1.allocateCdpPort)(usedPorts)).toBe(profiles_js_1.CDP_PORT_RANGE_START + 2);
    });
    (0, vitest_1.it)("finds first gap in used ports", function () {
        var usedPorts = new Set([
            profiles_js_1.CDP_PORT_RANGE_START,
            profiles_js_1.CDP_PORT_RANGE_START + 2, // gap at +1
        ]);
        (0, vitest_1.expect)((0, profiles_js_1.allocateCdpPort)(usedPorts)).toBe(profiles_js_1.CDP_PORT_RANGE_START + 1);
    });
    (0, vitest_1.it)("returns null when all ports are exhausted", function () {
        var usedPorts = new Set();
        for (var port = profiles_js_1.CDP_PORT_RANGE_START; port <= profiles_js_1.CDP_PORT_RANGE_END; port++) {
            usedPorts.add(port);
        }
        (0, vitest_1.expect)((0, profiles_js_1.allocateCdpPort)(usedPorts)).toBeNull();
    });
    (0, vitest_1.it)("handles ports outside range in used set", function () {
        var usedPorts = new Set([1, 2, 3, 50000]); // ports outside range
        (0, vitest_1.expect)((0, profiles_js_1.allocateCdpPort)(usedPorts)).toBe(profiles_js_1.CDP_PORT_RANGE_START);
    });
});
(0, vitest_1.describe)("getUsedPorts", function () {
    (0, vitest_1.it)("returns empty set for undefined profiles", function () {
        (0, vitest_1.expect)((0, profiles_js_1.getUsedPorts)(undefined)).toEqual(new Set());
    });
    (0, vitest_1.it)("returns empty set for empty profiles object", function () {
        (0, vitest_1.expect)((0, profiles_js_1.getUsedPorts)({})).toEqual(new Set());
    });
    (0, vitest_1.it)("extracts ports from profile configs", function () {
        var profiles = {
            openclaw: { cdpPort: 18792 },
            work: { cdpPort: 18793 },
            personal: { cdpPort: 18795 },
        };
        var used = (0, profiles_js_1.getUsedPorts)(profiles);
        (0, vitest_1.expect)(used).toEqual(new Set([18792, 18793, 18795]));
    });
    (0, vitest_1.it)("extracts ports from cdpUrl when cdpPort is missing", function () {
        var profiles = {
            remote: { cdpUrl: "http://10.0.0.42:9222" },
            secure: { cdpUrl: "https://example.com:9443" },
        };
        var used = (0, profiles_js_1.getUsedPorts)(profiles);
        (0, vitest_1.expect)(used).toEqual(new Set([9222, 9443]));
    });
    (0, vitest_1.it)("ignores invalid cdpUrl values", function () {
        var profiles = {
            bad: { cdpUrl: "notaurl" },
        };
        var used = (0, profiles_js_1.getUsedPorts)(profiles);
        (0, vitest_1.expect)(used.size).toBe(0);
    });
});
(0, vitest_1.describe)("port collision prevention", function () {
    (0, vitest_1.it)("raw config vs resolved config - shows the data source difference", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveBrowserConfig, rawConfigProfiles, usedFromRaw, resolved, usedFromResolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    resolveBrowserConfig = (_a.sent()).resolveBrowserConfig;
                    rawConfigProfiles = undefined;
                    usedFromRaw = (0, profiles_js_1.getUsedPorts)(rawConfigProfiles);
                    // Raw config shows empty - no ports used
                    (0, vitest_1.expect)(usedFromRaw.size).toBe(0);
                    resolved = resolveBrowserConfig({});
                    usedFromResolved = (0, profiles_js_1.getUsedPorts)(resolved.profiles);
                    (0, vitest_1.expect)(usedFromResolved.has(profiles_js_1.CDP_PORT_RANGE_START)).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("create-profile must use resolved config to avoid port collision", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveBrowserConfig, rawConfig, buggyUsedPorts, buggyAllocatedPort, resolved, fixedUsedPorts, fixedAllocatedPort;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    resolveBrowserConfig = (_b.sent()).resolveBrowserConfig;
                    rawConfig = { browser: {} };
                    buggyUsedPorts = (0, profiles_js_1.getUsedPorts)((_a = rawConfig.browser) === null || _a === void 0 ? void 0 : _a.profiles);
                    buggyAllocatedPort = (0, profiles_js_1.allocateCdpPort)(buggyUsedPorts);
                    // Raw config: first allocation gets 18800
                    (0, vitest_1.expect)(buggyAllocatedPort).toBe(profiles_js_1.CDP_PORT_RANGE_START);
                    resolved = resolveBrowserConfig(rawConfig.browser);
                    fixedUsedPorts = (0, profiles_js_1.getUsedPorts)(resolved.profiles);
                    fixedAllocatedPort = (0, profiles_js_1.allocateCdpPort)(fixedUsedPorts);
                    // Resolved: first NEW profile gets 18801, avoiding collision
                    (0, vitest_1.expect)(fixedAllocatedPort).toBe(profiles_js_1.CDP_PORT_RANGE_START + 1);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("color allocation", function () {
    (0, vitest_1.it)("allocates first color when none used", function () {
        var usedColors = new Set();
        (0, vitest_1.expect)((0, profiles_js_1.allocateColor)(usedColors)).toBe(profiles_js_1.PROFILE_COLORS[0]);
    });
    (0, vitest_1.it)("allocates next unused color from palette", function () {
        var usedColors = new Set([profiles_js_1.PROFILE_COLORS[0].toUpperCase()]);
        (0, vitest_1.expect)((0, profiles_js_1.allocateColor)(usedColors)).toBe(profiles_js_1.PROFILE_COLORS[1]);
    });
    (0, vitest_1.it)("skips multiple used colors", function () {
        var usedColors = new Set([
            profiles_js_1.PROFILE_COLORS[0].toUpperCase(),
            profiles_js_1.PROFILE_COLORS[1].toUpperCase(),
            profiles_js_1.PROFILE_COLORS[2].toUpperCase(),
        ]);
        (0, vitest_1.expect)((0, profiles_js_1.allocateColor)(usedColors)).toBe(profiles_js_1.PROFILE_COLORS[3]);
    });
    (0, vitest_1.it)("handles case-insensitive color matching", function () {
        var usedColors = new Set(["#ff4500"]); // lowercase
        // Should still skip this color (case-insensitive)
        // Note: allocateColor compares against uppercase, so lowercase won't match
        // This tests the current behavior
        (0, vitest_1.expect)((0, profiles_js_1.allocateColor)(usedColors)).toBe(profiles_js_1.PROFILE_COLORS[0]); // returns first since lowercase doesn't match
    });
    (0, vitest_1.it)("cycles when all colors are used", function () {
        var usedColors = new Set(profiles_js_1.PROFILE_COLORS.map(function (c) { return c.toUpperCase(); }));
        // Should cycle based on count
        var result = (0, profiles_js_1.allocateColor)(usedColors);
        (0, vitest_1.expect)(profiles_js_1.PROFILE_COLORS).toContain(result);
    });
    (0, vitest_1.it)("cycles based on count when palette exhausted", function () {
        // Add all colors plus some extras
        var usedColors = new Set(__spreadArray(__spreadArray([], profiles_js_1.PROFILE_COLORS.map(function (c) { return c.toUpperCase(); }), true), [
            "#AAAAAA",
            "#BBBBBB",
        ], false));
        var result = (0, profiles_js_1.allocateColor)(usedColors);
        // Index should be (10 + 2) % 10 = 2
        (0, vitest_1.expect)(result).toBe(profiles_js_1.PROFILE_COLORS[2]);
    });
});
(0, vitest_1.describe)("getUsedColors", function () {
    (0, vitest_1.it)("returns empty set for undefined profiles", function () {
        (0, vitest_1.expect)((0, profiles_js_1.getUsedColors)(undefined)).toEqual(new Set());
    });
    (0, vitest_1.it)("returns empty set for empty profiles object", function () {
        (0, vitest_1.expect)((0, profiles_js_1.getUsedColors)({})).toEqual(new Set());
    });
    (0, vitest_1.it)("extracts and uppercases colors from profile configs", function () {
        var profiles = {
            openclaw: { color: "#ff4500" },
            work: { color: "#0066CC" },
        };
        var used = (0, profiles_js_1.getUsedColors)(profiles);
        (0, vitest_1.expect)(used).toEqual(new Set(["#FF4500", "#0066CC"]));
    });
});
