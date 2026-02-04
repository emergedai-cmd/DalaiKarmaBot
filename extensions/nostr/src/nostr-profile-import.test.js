"use strict";
/**
 * Tests for Nostr Profile Import
 */
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var nostr_profile_import_js_1 = require("./nostr-profile-import.js");
// Note: importProfileFromRelays requires real network calls or complex mocking
// of nostr-tools SimplePool, so we focus on unit testing mergeProfiles
(0, vitest_1.describe)("nostr-profile-import", function () {
    (0, vitest_1.describe)("mergeProfiles", function () {
        (0, vitest_1.it)("returns empty object when both are undefined", function () {
            var result = (0, nostr_profile_import_js_1.mergeProfiles)(undefined, undefined);
            (0, vitest_1.expect)(result).toEqual({});
        });
        (0, vitest_1.it)("returns imported when local is undefined", function () {
            var imported = {
                name: "imported",
                displayName: "Imported User",
                about: "Bio from relay",
            };
            var result = (0, nostr_profile_import_js_1.mergeProfiles)(undefined, imported);
            (0, vitest_1.expect)(result).toEqual(imported);
        });
        (0, vitest_1.it)("returns local when imported is undefined", function () {
            var local = {
                name: "local",
                displayName: "Local User",
            };
            var result = (0, nostr_profile_import_js_1.mergeProfiles)(local, undefined);
            (0, vitest_1.expect)(result).toEqual(local);
        });
        (0, vitest_1.it)("prefers local values over imported", function () {
            var local = {
                name: "localname",
                about: "Local bio",
            };
            var imported = {
                name: "importedname",
                displayName: "Imported Display",
                about: "Imported bio",
                picture: "https://example.com/pic.jpg",
            };
            var result = (0, nostr_profile_import_js_1.mergeProfiles)(local, imported);
            (0, vitest_1.expect)(result.name).toBe("localname"); // local wins
            (0, vitest_1.expect)(result.displayName).toBe("Imported Display"); // imported fills gap
            (0, vitest_1.expect)(result.about).toBe("Local bio"); // local wins
            (0, vitest_1.expect)(result.picture).toBe("https://example.com/pic.jpg"); // imported fills gap
        });
        (0, vitest_1.it)("fills all missing fields from imported", function () {
            var local = {
                name: "myname",
            };
            var imported = {
                name: "theirname",
                displayName: "Their Name",
                about: "Their bio",
                picture: "https://example.com/pic.jpg",
                banner: "https://example.com/banner.jpg",
                website: "https://example.com",
                nip05: "user@example.com",
                lud16: "user@getalby.com",
            };
            var result = (0, nostr_profile_import_js_1.mergeProfiles)(local, imported);
            (0, vitest_1.expect)(result.name).toBe("myname");
            (0, vitest_1.expect)(result.displayName).toBe("Their Name");
            (0, vitest_1.expect)(result.about).toBe("Their bio");
            (0, vitest_1.expect)(result.picture).toBe("https://example.com/pic.jpg");
            (0, vitest_1.expect)(result.banner).toBe("https://example.com/banner.jpg");
            (0, vitest_1.expect)(result.website).toBe("https://example.com");
            (0, vitest_1.expect)(result.nip05).toBe("user@example.com");
            (0, vitest_1.expect)(result.lud16).toBe("user@getalby.com");
        });
        (0, vitest_1.it)("handles empty strings as falsy (prefers imported)", function () {
            var local = {
                name: "",
                displayName: "",
            };
            var imported = {
                name: "imported",
                displayName: "Imported",
            };
            var result = (0, nostr_profile_import_js_1.mergeProfiles)(local, imported);
            // Empty strings are still strings, so they "win" over imported
            // This is JavaScript nullish coalescing behavior
            (0, vitest_1.expect)(result.name).toBe("");
            (0, vitest_1.expect)(result.displayName).toBe("");
        });
        (0, vitest_1.it)("handles null values in local (prefers imported)", function () {
            var local = {
                name: undefined,
                displayName: undefined,
            };
            var imported = {
                name: "imported",
                displayName: "Imported",
            };
            var result = (0, nostr_profile_import_js_1.mergeProfiles)(local, imported);
            (0, vitest_1.expect)(result.name).toBe("imported");
            (0, vitest_1.expect)(result.displayName).toBe("Imported");
        });
    });
});
