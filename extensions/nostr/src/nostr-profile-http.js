"use strict";
/**
 * Nostr Profile HTTP Handler
 *
 * Handles HTTP requests for profile management:
 * - PUT /api/channels/nostr/:accountId/profile - Update and publish profile
 * - POST /api/channels/nostr/:accountId/profile/import - Import from relays
 * - GET /api/channels/nostr/:accountId/profile - Get current profile state
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
exports.validateUrlSafety = validateUrlSafety;
exports.createNostrProfileHttpHandler = createNostrProfileHttpHandler;
var zod_1 = require("zod");
var channel_js_1 = require("./channel.js");
var config_schema_js_1 = require("./config-schema.js");
var nostr_profile_import_js_1 = require("./nostr-profile-import.js");
var rateLimitMap = new Map();
var RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
var RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute
function checkRateLimit(accountId) {
    var now = Date.now();
    var entry = rateLimitMap.get(accountId);
    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(accountId, { count: 1, windowStart: now });
        return true;
    }
    if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }
    entry.count++;
    return true;
}
// ============================================================================
// Mutex for Concurrent Publish Prevention
// ============================================================================
var publishLocks = new Map();
function withPublishLock(accountId, fn) {
    return __awaiter(this, void 0, void 0, function () {
        var prev, resolve, next;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    prev = (_a = publishLocks.get(accountId)) !== null && _a !== void 0 ? _a : Promise.resolve();
                    next = new Promise(function (r) {
                        resolve = r;
                    });
                    // Atomically replace the lock before awaiting - any concurrent request
                    // will now wait on our `next` promise
                    publishLocks.set(accountId, next);
                    // Wait for previous operation to complete
                    return [4 /*yield*/, prev.catch(function () { })];
                case 1:
                    // Wait for previous operation to complete
                    _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 4, 5]);
                    return [4 /*yield*/, fn()];
                case 3: return [2 /*return*/, _b.sent()];
                case 4:
                    resolve();
                    // Clean up if we're the last in chain
                    if (publishLocks.get(accountId) === next) {
                        publishLocks.delete(accountId);
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// SSRF Protection
// ============================================================================
// Block common private/internal hostnames (quick string check)
var BLOCKED_HOSTNAMES = new Set([
    "localhost",
    "localhost.localdomain",
    "127.0.0.1",
    "::1",
    "[::1]",
    "0.0.0.0",
]);
// Check if an IP address (resolved) is in a private range
function isPrivateIp(ip) {
    // Handle IPv4
    var ipv4Match = ip.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
    if (ipv4Match) {
        var _a = ipv4Match.map(Number), a = _a[1], b = _a[2];
        // 127.0.0.0/8 (loopback)
        if (a === 127) {
            return true;
        }
        // 10.0.0.0/8 (private)
        if (a === 10) {
            return true;
        }
        // 172.16.0.0/12 (private)
        if (a === 172 && b >= 16 && b <= 31) {
            return true;
        }
        // 192.168.0.0/16 (private)
        if (a === 192 && b === 168) {
            return true;
        }
        // 169.254.0.0/16 (link-local)
        if (a === 169 && b === 254) {
            return true;
        }
        // 0.0.0.0/8
        if (a === 0) {
            return true;
        }
        return false;
    }
    // Handle IPv6
    var ipLower = ip.toLowerCase().replace(/^\[|\]$/g, "");
    // ::1 (loopback)
    if (ipLower === "::1") {
        return true;
    }
    // fe80::/10 (link-local)
    if (ipLower.startsWith("fe80:")) {
        return true;
    }
    // fc00::/7 (unique local)
    if (ipLower.startsWith("fc") || ipLower.startsWith("fd")) {
        return true;
    }
    // ::ffff:x.x.x.x (IPv4-mapped IPv6) - extract and check IPv4
    var v4Mapped = ipLower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (v4Mapped) {
        return isPrivateIp(v4Mapped[1]);
    }
    return false;
}
function validateUrlSafety(urlStr) {
    try {
        var url = new URL(urlStr);
        if (url.protocol !== "https:") {
            return { ok: false, error: "URL must use https:// protocol" };
        }
        var hostname = url.hostname.toLowerCase();
        // Quick hostname block check
        if (BLOCKED_HOSTNAMES.has(hostname)) {
            return { ok: false, error: "URL must not point to private/internal addresses" };
        }
        // Check if hostname is an IP address directly
        if (isPrivateIp(hostname)) {
            return { ok: false, error: "URL must not point to private/internal addresses" };
        }
        // Block suspicious TLDs that resolve to localhost
        if (hostname.endsWith(".localhost") || hostname.endsWith(".local")) {
            return { ok: false, error: "URL must not point to private/internal addresses" };
        }
        return { ok: true };
    }
    catch (_a) {
        return { ok: false, error: "Invalid URL format" };
    }
}
// ============================================================================
// Validation Schemas
// ============================================================================
// NIP-05 format: user@domain.com
var nip05FormatSchema = zod_1.z
    .string()
    .regex(/^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, "Invalid NIP-05 format (user@domain.com)")
    .optional();
// LUD-16 Lightning address format: user@domain.com
var lud16FormatSchema = zod_1.z
    .string()
    .regex(/^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, "Invalid Lightning address format")
    .optional();
// Extended profile schema with additional format validation
var ProfileUpdateSchema = config_schema_js_1.NostrProfileSchema.extend({
    nip05: nip05FormatSchema,
    lud16: lud16FormatSchema,
});
// ============================================================================
// Request Helpers
// ============================================================================
function sendJson(res, status, body) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(body));
}
function readJsonBody(req_1) {
    return __awaiter(this, arguments, void 0, function (req, maxBytes) {
        if (maxBytes === void 0) { maxBytes = 64 * 1024; }
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var chunks = [];
                    var totalBytes = 0;
                    req.on("data", function (chunk) {
                        totalBytes += chunk.length;
                        if (totalBytes > maxBytes) {
                            reject(new Error("Request body too large"));
                            req.destroy();
                            return;
                        }
                        chunks.push(chunk);
                    });
                    req.on("end", function () {
                        try {
                            var body = Buffer.concat(chunks).toString("utf-8");
                            resolve(body ? JSON.parse(body) : {});
                        }
                        catch (_a) {
                            reject(new Error("Invalid JSON"));
                        }
                    });
                    req.on("error", reject);
                })];
        });
    });
}
function parseAccountIdFromPath(pathname) {
    var _a;
    // Match: /api/channels/nostr/:accountId/profile
    var match = pathname.match(/^\/api\/channels\/nostr\/([^/]+)\/profile/);
    return (_a = match === null || match === void 0 ? void 0 : match[1]) !== null && _a !== void 0 ? _a : null;
}
// ============================================================================
// HTTP Handler
// ============================================================================
function createNostrProfileHttpHandler(ctx) {
    var _this = this;
    return function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var url, accountId, isImport, isProfilePath, err_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    url = new URL((_a = req.url) !== null && _a !== void 0 ? _a : "/", "http://".concat((_b = req.headers.host) !== null && _b !== void 0 ? _b : "localhost"));
                    // Only handle /api/channels/nostr/:accountId/profile paths
                    if (!url.pathname.startsWith("/api/channels/nostr/")) {
                        return [2 /*return*/, false];
                    }
                    accountId = parseAccountIdFromPath(url.pathname);
                    if (!accountId) {
                        return [2 /*return*/, false];
                    }
                    isImport = url.pathname.endsWith("/profile/import");
                    isProfilePath = url.pathname.endsWith("/profile") || isImport;
                    if (!isProfilePath) {
                        return [2 /*return*/, false];
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 8, , 9]);
                    if (!(req.method === "GET" && !isImport)) return [3 /*break*/, 3];
                    return [4 /*yield*/, handleGetProfile(accountId, ctx, res)];
                case 2: return [2 /*return*/, _d.sent()];
                case 3:
                    if (!(req.method === "PUT" && !isImport)) return [3 /*break*/, 5];
                    return [4 /*yield*/, handleUpdateProfile(accountId, ctx, req, res)];
                case 4: return [2 /*return*/, _d.sent()];
                case 5:
                    if (!(req.method === "POST" && isImport)) return [3 /*break*/, 7];
                    return [4 /*yield*/, handleImportProfile(accountId, ctx, req, res)];
                case 6: return [2 /*return*/, _d.sent()];
                case 7:
                    // Method not allowed
                    sendJson(res, 405, { ok: false, error: "Method not allowed" });
                    return [2 /*return*/, true];
                case 8:
                    err_1 = _d.sent();
                    (_c = ctx.log) === null || _c === void 0 ? void 0 : _c.error("Profile HTTP error: ".concat(String(err_1)));
                    sendJson(res, 500, { ok: false, error: "Internal server error" });
                    return [2 /*return*/, true];
                case 9: return [2 /*return*/];
            }
        });
    }); };
}
// ============================================================================
// GET /api/channels/nostr/:accountId/profile
// ============================================================================
function handleGetProfile(accountId, ctx, res) {
    return __awaiter(this, void 0, void 0, function () {
        var configProfile, publishState;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    configProfile = ctx.getConfigProfile(accountId);
                    return [4 /*yield*/, (0, channel_js_1.getNostrProfileState)(accountId)];
                case 1:
                    publishState = _a.sent();
                    sendJson(res, 200, {
                        ok: true,
                        profile: configProfile !== null && configProfile !== void 0 ? configProfile : null,
                        publishState: publishState !== null && publishState !== void 0 ? publishState : null,
                    });
                    return [2 /*return*/, true];
            }
        });
    });
}
// ============================================================================
// PUT /api/channels/nostr/:accountId/profile
// ============================================================================
function handleUpdateProfile(accountId, ctx, req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var body, err_2, parseResult, errors, profile, pictureCheck, bannerCheck, websiteCheck, existingProfile, mergedProfile, result, err_3;
        var _this = this;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    // Rate limiting
                    if (!checkRateLimit(accountId)) {
                        sendJson(res, 429, { ok: false, error: "Rate limit exceeded (5 requests/minute)" });
                        return [2 /*return*/, true];
                    }
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, readJsonBody(req)];
                case 2:
                    body = _e.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _e.sent();
                    sendJson(res, 400, { ok: false, error: String(err_2) });
                    return [2 /*return*/, true];
                case 4:
                    parseResult = ProfileUpdateSchema.safeParse(body);
                    if (!parseResult.success) {
                        errors = parseResult.error.issues.map(function (i) { return "".concat(i.path.join("."), ": ").concat(i.message); });
                        sendJson(res, 400, { ok: false, error: "Validation failed", details: errors });
                        return [2 /*return*/, true];
                    }
                    profile = parseResult.data;
                    // SSRF check for picture URL
                    if (profile.picture) {
                        pictureCheck = validateUrlSafety(profile.picture);
                        if (!pictureCheck.ok) {
                            sendJson(res, 400, { ok: false, error: "picture: ".concat(pictureCheck.error) });
                            return [2 /*return*/, true];
                        }
                    }
                    // SSRF check for banner URL
                    if (profile.banner) {
                        bannerCheck = validateUrlSafety(profile.banner);
                        if (!bannerCheck.ok) {
                            sendJson(res, 400, { ok: false, error: "banner: ".concat(bannerCheck.error) });
                            return [2 /*return*/, true];
                        }
                    }
                    // SSRF check for website URL
                    if (profile.website) {
                        websiteCheck = validateUrlSafety(profile.website);
                        if (!websiteCheck.ok) {
                            sendJson(res, 400, { ok: false, error: "website: ".concat(websiteCheck.error) });
                            return [2 /*return*/, true];
                        }
                    }
                    existingProfile = (_a = ctx.getConfigProfile(accountId)) !== null && _a !== void 0 ? _a : {};
                    mergedProfile = __assign(__assign({}, existingProfile), profile);
                    _e.label = 5;
                case 5:
                    _e.trys.push([5, 10, , 11]);
                    return [4 /*yield*/, withPublishLock(accountId, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, channel_js_1.publishNostrProfile)(accountId, mergedProfile)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 6:
                    result = _e.sent();
                    if (!(result.successes.length > 0)) return [3 /*break*/, 8];
                    return [4 /*yield*/, ctx.updateConfigProfile(accountId, mergedProfile)];
                case 7:
                    _e.sent();
                    (_b = ctx.log) === null || _b === void 0 ? void 0 : _b.info("[".concat(accountId, "] Profile published to ").concat(result.successes.length, " relay(s)"));
                    return [3 /*break*/, 9];
                case 8:
                    (_c = ctx.log) === null || _c === void 0 ? void 0 : _c.warn("[".concat(accountId, "] Profile publish failed on all relays"));
                    _e.label = 9;
                case 9:
                    sendJson(res, 200, {
                        ok: true,
                        eventId: result.eventId,
                        createdAt: result.createdAt,
                        successes: result.successes,
                        failures: result.failures,
                        persisted: result.successes.length > 0,
                    });
                    return [3 /*break*/, 11];
                case 10:
                    err_3 = _e.sent();
                    (_d = ctx.log) === null || _d === void 0 ? void 0 : _d.error("[".concat(accountId, "] Profile publish error: ").concat(String(err_3)));
                    sendJson(res, 500, { ok: false, error: "Publish failed: ".concat(String(err_3)) });
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/, true];
            }
        });
    });
}
// ============================================================================
// POST /api/channels/nostr/:accountId/profile/import
// ============================================================================
function handleImportProfile(accountId, ctx, req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var accountInfo, pubkey, relays, autoMerge, body, _a, result, localProfile, merged;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    accountInfo = ctx.getAccountInfo(accountId);
                    if (!accountInfo) {
                        sendJson(res, 404, { ok: false, error: "Account not found: ".concat(accountId) });
                        return [2 /*return*/, true];
                    }
                    pubkey = accountInfo.pubkey, relays = accountInfo.relays;
                    if (!pubkey) {
                        sendJson(res, 400, { ok: false, error: "Account has no public key configured" });
                        return [2 /*return*/, true];
                    }
                    autoMerge = false;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, readJsonBody(req)];
                case 2:
                    body = _d.sent();
                    if (typeof body === "object" && body !== null) {
                        autoMerge = body.autoMerge === true;
                    }
                    return [3 /*break*/, 4];
                case 3:
                    _a = _d.sent();
                    return [3 /*break*/, 4];
                case 4:
                    (_b = ctx.log) === null || _b === void 0 ? void 0 : _b.info("[".concat(accountId, "] Importing profile for ").concat(pubkey.slice(0, 8), "..."));
                    return [4 /*yield*/, (0, nostr_profile_import_js_1.importProfileFromRelays)({
                            pubkey: pubkey,
                            relays: relays,
                            timeoutMs: 10000, // 10 seconds for import
                        })];
                case 5:
                    result = _d.sent();
                    if (!result.ok) {
                        sendJson(res, 200, {
                            ok: false,
                            error: result.error,
                            relaysQueried: result.relaysQueried,
                        });
                        return [2 /*return*/, true];
                    }
                    if (!(autoMerge && result.profile)) return [3 /*break*/, 7];
                    localProfile = ctx.getConfigProfile(accountId);
                    merged = (0, nostr_profile_import_js_1.mergeProfiles)(localProfile, result.profile);
                    return [4 /*yield*/, ctx.updateConfigProfile(accountId, merged)];
                case 6:
                    _d.sent();
                    (_c = ctx.log) === null || _c === void 0 ? void 0 : _c.info("[".concat(accountId, "] Profile imported and merged"));
                    sendJson(res, 200, {
                        ok: true,
                        imported: result.profile,
                        merged: merged,
                        saved: true,
                        event: result.event,
                        sourceRelay: result.sourceRelay,
                        relaysQueried: result.relaysQueried,
                    });
                    return [2 /*return*/, true];
                case 7:
                    // Otherwise, just return the imported profile for review
                    sendJson(res, 200, {
                        ok: true,
                        imported: result.profile,
                        saved: false,
                        event: result.event,
                        sourceRelay: result.sourceRelay,
                        relaysQueried: result.relaysQueried,
                    });
                    return [2 /*return*/, true];
            }
        });
    });
}
