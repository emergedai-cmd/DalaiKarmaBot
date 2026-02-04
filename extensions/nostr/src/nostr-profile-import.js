"use strict";
/**
 * Nostr Profile Import
 *
 * Fetches and verifies kind:0 profile events from relays.
 * Used to import existing profiles before editing.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.importProfileFromRelays = importProfileFromRelays;
exports.mergeProfiles = mergeProfiles;
var nostr_tools_1 = require("nostr-tools");
var nostr_profile_http_js_1 = require("./nostr-profile-http.js");
var nostr_profile_js_1 = require("./nostr-profile.js");
// ============================================================================
// Constants
// ============================================================================
var DEFAULT_TIMEOUT_MS = 5000;
// ============================================================================
// Profile Import
// ============================================================================
/**
 * Sanitize URLs in an imported profile to prevent SSRF attacks.
 * Removes any URLs that don't pass SSRF validation.
 */
function sanitizeProfileUrls(profile) {
    var result = __assign({}, profile);
    var urlFields = ["picture", "banner", "website"];
    for (var _i = 0, urlFields_1 = urlFields; _i < urlFields_1.length; _i++) {
        var field = urlFields_1[_i];
        var value = result[field];
        if (value && typeof value === "string") {
            var validation = (0, nostr_profile_http_js_1.validateUrlSafety)(value);
            if (!validation.ok) {
                // Remove unsafe URL
                delete result[field];
            }
        }
    }
    return result;
}
/**
 * Fetch the latest kind:0 profile event for a pubkey from relays.
 *
 * - Queries all relays in parallel
 * - Takes the event with the highest created_at
 * - Verifies the event signature
 * - Parses and returns the profile
 */
function importProfileFromRelays(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var pubkey, relays, _a, timeoutMs, pool, relaysQueried, events_2, timeoutPromise, subscriptionPromise, bestEvent, _i, events_1, item, isValid, content, profile, sanitizedProfile;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    pubkey = opts.pubkey, relays = opts.relays, _a = opts.timeoutMs, timeoutMs = _a === void 0 ? DEFAULT_TIMEOUT_MS : _a;
                    if (!pubkey || !/^[0-9a-fA-F]{64}$/.test(pubkey)) {
                        return [2 /*return*/, {
                                ok: false,
                                error: "Invalid pubkey format (must be 64 hex characters)",
                                relaysQueried: [],
                            }];
                    }
                    if (relays.length === 0) {
                        return [2 /*return*/, {
                                ok: false,
                                error: "No relays configured",
                                relaysQueried: [],
                            }];
                    }
                    pool = new nostr_tools_1.SimplePool();
                    relaysQueried = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 3, 4]);
                    events_2 = [];
                    timeoutPromise = new Promise(function (resolve) {
                        setTimeout(resolve, timeoutMs);
                    });
                    subscriptionPromise = new Promise(function (resolve) {
                        var completed = 0;
                        var _loop_1 = function (relay) {
                            relaysQueried.push(relay);
                            var sub = pool.subscribeMany([relay], [
                                {
                                    kinds: [0],
                                    authors: [pubkey],
                                    limit: 1,
                                },
                            ], {
                                onevent: function (event) {
                                    events_2.push({ event: event, relay: relay });
                                },
                                oneose: function () {
                                    completed++;
                                    if (completed >= relays.length) {
                                        resolve();
                                    }
                                },
                                onclose: function () {
                                    completed++;
                                    if (completed >= relays.length) {
                                        resolve();
                                    }
                                },
                            });
                            // Clean up subscription after timeout
                            setTimeout(function () {
                                sub.close();
                            }, timeoutMs);
                        };
                        for (var _i = 0, relays_1 = relays; _i < relays_1.length; _i++) {
                            var relay = relays_1[_i];
                            _loop_1(relay);
                        }
                    });
                    // Wait for either all relays to respond or timeout
                    return [4 /*yield*/, Promise.race([subscriptionPromise, timeoutPromise])];
                case 2:
                    // Wait for either all relays to respond or timeout
                    _b.sent();
                    // No events found
                    if (events_2.length === 0) {
                        return [2 /*return*/, {
                                ok: false,
                                error: "No profile found on any relay",
                                relaysQueried: relaysQueried,
                            }];
                    }
                    bestEvent = null;
                    for (_i = 0, events_1 = events_2; _i < events_1.length; _i++) {
                        item = events_1[_i];
                        if (!bestEvent || item.event.created_at > bestEvent.event.created_at) {
                            bestEvent = item;
                        }
                    }
                    if (!bestEvent) {
                        return [2 /*return*/, {
                                ok: false,
                                error: "No valid profile event found",
                                relaysQueried: relaysQueried,
                            }];
                    }
                    isValid = (0, nostr_tools_1.verifyEvent)(bestEvent.event);
                    if (!isValid) {
                        return [2 /*return*/, {
                                ok: false,
                                error: "Profile event has invalid signature",
                                relaysQueried: relaysQueried,
                                sourceRelay: bestEvent.relay,
                            }];
                    }
                    content = void 0;
                    try {
                        content = JSON.parse(bestEvent.event.content);
                    }
                    catch (_c) {
                        return [2 /*return*/, {
                                ok: false,
                                error: "Profile event has invalid JSON content",
                                relaysQueried: relaysQueried,
                                sourceRelay: bestEvent.relay,
                            }];
                    }
                    profile = (0, nostr_profile_js_1.contentToProfile)(content);
                    sanitizedProfile = sanitizeProfileUrls(profile);
                    return [2 /*return*/, {
                            ok: true,
                            profile: sanitizedProfile,
                            event: {
                                id: bestEvent.event.id,
                                pubkey: bestEvent.event.pubkey,
                                created_at: bestEvent.event.created_at,
                            },
                            relaysQueried: relaysQueried,
                            sourceRelay: bestEvent.relay,
                        }];
                case 3:
                    pool.close(relays);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Merge imported profile with local profile.
 *
 * Strategy:
 * - For each field, prefer local if set, otherwise use imported
 * - This preserves user customizations while filling in missing data
 */
function mergeProfiles(local, imported) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (!imported) {
        return local !== null && local !== void 0 ? local : {};
    }
    if (!local) {
        return imported;
    }
    return {
        name: (_a = local.name) !== null && _a !== void 0 ? _a : imported.name,
        displayName: (_b = local.displayName) !== null && _b !== void 0 ? _b : imported.displayName,
        about: (_c = local.about) !== null && _c !== void 0 ? _c : imported.about,
        picture: (_d = local.picture) !== null && _d !== void 0 ? _d : imported.picture,
        banner: (_e = local.banner) !== null && _e !== void 0 ? _e : imported.banner,
        website: (_f = local.website) !== null && _f !== void 0 ? _f : imported.website,
        nip05: (_g = local.nip05) !== null && _g !== void 0 ? _g : imported.nip05,
        lud16: (_h = local.lud16) !== null && _h !== void 0 ? _h : imported.lud16,
    };
}
