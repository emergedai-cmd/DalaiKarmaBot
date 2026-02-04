"use strict";
/**
 * Nostr Profile Management (NIP-01 kind:0)
 *
 * Profile events are "replaceable" - the latest created_at wins.
 * This module handles profile event creation and publishing.
 */
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
exports.profileToContent = profileToContent;
exports.contentToProfile = contentToProfile;
exports.createProfileEvent = createProfileEvent;
exports.publishProfileEvent = publishProfileEvent;
exports.publishProfile = publishProfile;
exports.validateProfile = validateProfile;
exports.sanitizeProfileForDisplay = sanitizeProfileForDisplay;
var nostr_tools_1 = require("nostr-tools");
var config_schema_js_1 = require("./config-schema.js");
// ============================================================================
// Profile Content Conversion
// ============================================================================
/**
 * Convert our config profile schema to NIP-01 content format.
 * Strips undefined fields and validates URLs.
 */
function profileToContent(profile) {
    var validated = config_schema_js_1.NostrProfileSchema.parse(profile);
    var content = {};
    if (validated.name !== undefined) {
        content.name = validated.name;
    }
    if (validated.displayName !== undefined) {
        content.display_name = validated.displayName;
    }
    if (validated.about !== undefined) {
        content.about = validated.about;
    }
    if (validated.picture !== undefined) {
        content.picture = validated.picture;
    }
    if (validated.banner !== undefined) {
        content.banner = validated.banner;
    }
    if (validated.website !== undefined) {
        content.website = validated.website;
    }
    if (validated.nip05 !== undefined) {
        content.nip05 = validated.nip05;
    }
    if (validated.lud16 !== undefined) {
        content.lud16 = validated.lud16;
    }
    return content;
}
/**
 * Convert NIP-01 content format back to our config profile schema.
 * Useful for importing existing profiles from relays.
 */
function contentToProfile(content) {
    var profile = {};
    if (content.name !== undefined) {
        profile.name = content.name;
    }
    if (content.display_name !== undefined) {
        profile.displayName = content.display_name;
    }
    if (content.about !== undefined) {
        profile.about = content.about;
    }
    if (content.picture !== undefined) {
        profile.picture = content.picture;
    }
    if (content.banner !== undefined) {
        profile.banner = content.banner;
    }
    if (content.website !== undefined) {
        profile.website = content.website;
    }
    if (content.nip05 !== undefined) {
        profile.nip05 = content.nip05;
    }
    if (content.lud16 !== undefined) {
        profile.lud16 = content.lud16;
    }
    return profile;
}
// ============================================================================
// Event Creation
// ============================================================================
/**
 * Create a signed kind:0 profile event.
 *
 * @param sk - Private key as Uint8Array (32 bytes)
 * @param profile - Profile data to include
 * @param lastPublishedAt - Previous profile timestamp (for monotonic guarantee)
 * @returns Signed Nostr event
 */
function createProfileEvent(sk, profile, lastPublishedAt) {
    var content = profileToContent(profile);
    var contentJson = JSON.stringify(content);
    // Ensure monotonic timestamp (new event > previous)
    var now = Math.floor(Date.now() / 1000);
    var createdAt = lastPublishedAt !== undefined ? Math.max(now, lastPublishedAt + 1) : now;
    var event = (0, nostr_tools_1.finalizeEvent)({
        kind: 0,
        content: contentJson,
        tags: [],
        created_at: createdAt,
    }, sk);
    return event;
}
// ============================================================================
// Profile Publishing
// ============================================================================
/** Per-relay publish timeout (ms) */
var RELAY_PUBLISH_TIMEOUT_MS = 5000;
/**
 * Publish a profile event to multiple relays.
 *
 * Best-effort: publishes to all relays in parallel, reports per-relay results.
 * Does NOT retry automatically - caller should handle retries if needed.
 *
 * @param pool - SimplePool instance for relay connections
 * @param relays - Array of relay WebSocket URLs
 * @param event - Signed profile event (kind:0)
 * @returns Publish results with successes and failures
 */
function publishProfileEvent(pool, relays, event) {
    return __awaiter(this, void 0, void 0, function () {
        var successes, failures, publishPromises;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    successes = [];
                    failures = [];
                    publishPromises = relays.map(function (relay) { return __awaiter(_this, void 0, void 0, function () {
                        var timeoutPromise, err_1, errorMessage;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    timeoutPromise = new Promise(function (_, reject) {
                                        setTimeout(function () { return reject(new Error("timeout")); }, RELAY_PUBLISH_TIMEOUT_MS);
                                    });
                                    // oxlint-disable-next-line typescript/no-floating-promises
                                    return [4 /*yield*/, Promise.race([pool.publish([relay], event), timeoutPromise])];
                                case 1:
                                    // oxlint-disable-next-line typescript/no-floating-promises
                                    _a.sent();
                                    successes.push(relay);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_1 = _a.sent();
                                    errorMessage = err_1 instanceof Error ? err_1.message : String(err_1);
                                    failures.push({ relay: relay, error: errorMessage });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(publishPromises)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, {
                            eventId: event.id,
                            successes: successes,
                            failures: failures,
                            createdAt: event.created_at,
                        }];
            }
        });
    });
}
/**
 * Create and publish a profile event in one call.
 *
 * @param pool - SimplePool instance
 * @param sk - Private key as Uint8Array
 * @param relays - Array of relay URLs
 * @param profile - Profile data
 * @param lastPublishedAt - Previous timestamp for monotonic ordering
 * @returns Publish results
 */
function publishProfile(pool, sk, relays, profile, lastPublishedAt) {
    return __awaiter(this, void 0, void 0, function () {
        var event;
        return __generator(this, function (_a) {
            event = createProfileEvent(sk, profile, lastPublishedAt);
            return [2 /*return*/, publishProfileEvent(pool, relays, event)];
        });
    });
}
// ============================================================================
// Profile Validation Helpers
// ============================================================================
/**
 * Validate a profile without throwing (returns result object).
 */
function validateProfile(profile) {
    var result = config_schema_js_1.NostrProfileSchema.safeParse(profile);
    if (result.success) {
        return { valid: true, profile: result.data };
    }
    return {
        valid: false,
        errors: result.error.issues.map(function (e) { return "".concat(e.path.join("."), ": ").concat(e.message); }),
    };
}
/**
 * Sanitize profile text fields to prevent XSS when displaying in UI.
 * Escapes HTML special characters.
 */
function sanitizeProfileForDisplay(profile) {
    var escapeHtml = function (str) {
        if (str === undefined) {
            return undefined;
        }
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };
    return {
        name: escapeHtml(profile.name),
        displayName: escapeHtml(profile.displayName),
        about: escapeHtml(profile.about),
        picture: profile.picture, // URLs already validated by schema
        banner: profile.banner,
        website: profile.website,
        nip05: escapeHtml(profile.nip05),
        lud16: escapeHtml(profile.lud16),
    };
}
