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
var node_child_process_1 = require("node:child_process");
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var mask = function (value) {
    var compact = value.trim();
    if (!compact) {
        return "missing";
    }
    var edge = compact.length >= 12 ? 6 : 4;
    return "".concat(compact.slice(0, edge), "\u2026").concat(compact.slice(-edge));
};
var parseArgs = function () {
    var args = process.argv.slice(2);
    var agentId = "main";
    var reveal = false;
    var sessionKey;
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        if (arg === "--agent" && args[i + 1]) {
            agentId = String(args[++i]).trim() || "main";
            continue;
        }
        if (arg === "--reveal") {
            reveal = true;
            continue;
        }
        if (arg === "--session-key" && args[i + 1]) {
            sessionKey = String(args[++i]).trim() || undefined;
            continue;
        }
    }
    return { agentId: agentId, reveal: reveal, sessionKey: sessionKey };
};
var loadAuthProfiles = function (agentId) {
    var _a, _b;
    var stateRoot = ((_a = process.env.OPENCLAW_STATE_DIR) === null || _a === void 0 ? void 0 : _a.trim()) ||
        ((_b = process.env.CLAWDBOT_STATE_DIR) === null || _b === void 0 ? void 0 : _b.trim()) ||
        node_path_1.default.join(node_os_1.default.homedir(), ".openclaw");
    var authPath = node_path_1.default.join(stateRoot, "agents", agentId, "agent", "auth-profiles.json");
    if (!node_fs_1.default.existsSync(authPath)) {
        throw new Error("Missing: ".concat(authPath));
    }
    var store = JSON.parse(node_fs_1.default.readFileSync(authPath, "utf8"));
    return { authPath: authPath, store: store };
};
var pickAnthropicTokens = function (store) {
    var _a, _b;
    var profiles = (_a = store.profiles) !== null && _a !== void 0 ? _a : {};
    var found = [];
    for (var _i = 0, _c = Object.entries(profiles); _i < _c.length; _i++) {
        var _d = _c[_i], id = _d[0], cred = _d[1];
        if ((cred === null || cred === void 0 ? void 0 : cred.provider) !== "anthropic") {
            continue;
        }
        var token = cred.type === "token" ? (_b = cred.token) === null || _b === void 0 ? void 0 : _b.trim() : undefined;
        if (token) {
            found.push({ profileId: id, token: token });
        }
    }
    return found;
};
var fetchAnthropicOAuthUsage = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var res, text;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("https://api.anthropic.com/api/oauth/usage", {
                    headers: {
                        Authorization: "Bearer ".concat(token),
                        Accept: "application/json",
                        "anthropic-version": "2023-06-01",
                        "anthropic-beta": "oauth-2025-04-20",
                        "User-Agent": "openclaw-debug",
                    },
                })];
            case 1:
                res = _a.sent();
                return [4 /*yield*/, res.text()];
            case 2:
                text = _a.sent();
                return [2 /*return*/, { status: res.status, contentType: res.headers.get("content-type"), text: text }];
        }
    });
}); };
var readClaudeCliKeychain = function () {
    if (process.platform !== "darwin") {
        return null;
    }
    try {
        var raw = (0, node_child_process_1.execFileSync)("security", ["find-generic-password", "-s", "Claude Code-credentials", "-w"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 5000 });
        var parsed = JSON.parse(raw.trim());
        var oauth = parsed === null || parsed === void 0 ? void 0 : parsed.claudeAiOauth;
        if (!oauth || typeof oauth !== "object") {
            return null;
        }
        var accessToken = oauth.accessToken;
        if (typeof accessToken !== "string" || !accessToken.trim()) {
            return null;
        }
        var expiresAt = typeof oauth.expiresAt === "number" ? oauth.expiresAt : undefined;
        var scopes = Array.isArray(oauth.scopes)
            ? oauth.scopes.filter(function (v) { return typeof v === "string"; })
            : undefined;
        return { accessToken: accessToken, expiresAt: expiresAt, scopes: scopes };
    }
    catch (_a) {
        return null;
    }
};
var chromeServiceNameForPath = function (cookiePath) {
    if (cookiePath.includes("/Arc/")) {
        return "Arc Safe Storage";
    }
    if (cookiePath.includes("/BraveSoftware/")) {
        return "Brave Safe Storage";
    }
    if (cookiePath.includes("/Microsoft Edge/")) {
        return "Microsoft Edge Safe Storage";
    }
    if (cookiePath.includes("/Chromium/")) {
        return "Chromium Safe Storage";
    }
    return "Chrome Safe Storage";
};
var readKeychainPassword = function (service) {
    try {
        var out = (0, node_child_process_1.execFileSync)("security", ["find-generic-password", "-w", "-s", service], {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
            timeout: 5000,
        });
        var pw = out.trim();
        return pw ? pw : null;
    }
    catch (_a) {
        return null;
    }
};
var decryptChromeCookieValue = function (encrypted, service) {
    if (encrypted.length < 4) {
        return null;
    }
    var prefix = encrypted.subarray(0, 3).toString("utf8");
    if (prefix !== "v10" && prefix !== "v11") {
        return null;
    }
    var password = readKeychainPassword(service);
    if (!password) {
        return null;
    }
    var key = node_crypto_1.default.pbkdf2Sync(password, "saltysalt", 1003, 16, "sha1");
    var iv = Buffer.alloc(16, 0x20);
    var data = encrypted.subarray(3);
    try {
        var decipher = node_crypto_1.default.createDecipheriv("aes-128-cbc", key, iv);
        decipher.setAutoPadding(true);
        var decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
        var text = decrypted.toString("utf8").trim();
        return text ? text : null;
    }
    catch (_a) {
        return null;
    }
};
var queryChromeCookieDb = function (cookieDb) {
    try {
        var out = (0, node_child_process_1.execFileSync)("sqlite3", [
            "-readonly",
            cookieDb,
            "\n          SELECT\n            COALESCE(NULLIF(value,''), hex(encrypted_value))\n          FROM cookies\n          WHERE (host_key LIKE '%claude.ai%' OR host_key = '.claude.ai')\n            AND name = 'sessionKey'\n          LIMIT 1;\n        ",
        ], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 5000 }).trim();
        if (!out) {
            return null;
        }
        if (out.startsWith("sk-ant-")) {
            return out;
        }
        var hex = out.replace(/[^0-9A-Fa-f]/g, "");
        if (!hex) {
            return null;
        }
        var buf = Buffer.from(hex, "hex");
        var service = chromeServiceNameForPath(cookieDb);
        var decrypted = decryptChromeCookieValue(buf, service);
        return decrypted && decrypted.startsWith("sk-ant-") ? decrypted : null;
    }
    catch (_a) {
        return null;
    }
};
var queryFirefoxCookieDb = function (cookieDb) {
    try {
        var out = (0, node_child_process_1.execFileSync)("sqlite3", [
            "-readonly",
            cookieDb,
            "\n          SELECT value\n          FROM moz_cookies\n          WHERE (host LIKE '%claude.ai%' OR host = '.claude.ai')\n            AND name = 'sessionKey'\n          LIMIT 1;\n        ",
        ], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 5000 }).trim();
        return out && out.startsWith("sk-ant-") ? out : null;
    }
    catch (_a) {
        return null;
    }
};
var findClaudeSessionKey = function () {
    if (process.platform !== "darwin") {
        return null;
    }
    var firefoxRoot = node_path_1.default.join(node_os_1.default.homedir(), "Library", "Application Support", "Firefox", "Profiles");
    if (node_fs_1.default.existsSync(firefoxRoot)) {
        for (var _i = 0, _a = node_fs_1.default.readdirSync(firefoxRoot); _i < _a.length; _i++) {
            var entry = _a[_i];
            var db = node_path_1.default.join(firefoxRoot, entry, "cookies.sqlite");
            if (!node_fs_1.default.existsSync(db)) {
                continue;
            }
            var value = queryFirefoxCookieDb(db);
            if (value) {
                return { sessionKey: value, source: "firefox:".concat(db) };
            }
        }
    }
    var chromeCandidates = [
        node_path_1.default.join(node_os_1.default.homedir(), "Library", "Application Support", "Google", "Chrome"),
        node_path_1.default.join(node_os_1.default.homedir(), "Library", "Application Support", "Chromium"),
        node_path_1.default.join(node_os_1.default.homedir(), "Library", "Application Support", "Arc"),
        node_path_1.default.join(node_os_1.default.homedir(), "Library", "Application Support", "BraveSoftware", "Brave-Browser"),
        node_path_1.default.join(node_os_1.default.homedir(), "Library", "Application Support", "Microsoft Edge"),
    ];
    for (var _b = 0, chromeCandidates_1 = chromeCandidates; _b < chromeCandidates_1.length; _b++) {
        var root = chromeCandidates_1[_b];
        if (!node_fs_1.default.existsSync(root)) {
            continue;
        }
        var profiles = node_fs_1.default
            .readdirSync(root)
            .filter(function (name) { return name === "Default" || name.startsWith("Profile "); });
        for (var _c = 0, profiles_1 = profiles; _c < profiles_1.length; _c++) {
            var profile = profiles_1[_c];
            var db = node_path_1.default.join(root, profile, "Cookies");
            if (!node_fs_1.default.existsSync(db)) {
                continue;
            }
            var value = queryChromeCookieDb(db);
            if (value) {
                return { sessionKey: value, source: "chromium:".concat(db) };
            }
        }
    }
    return null;
};
var fetchClaudeWebUsage = function (sessionKey) { return __awaiter(void 0, void 0, void 0, function () {
    var headers, orgRes, orgText, orgs, orgId, usageRes, usageText;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                headers = {
                    Cookie: "sessionKey=".concat(sessionKey),
                    Accept: "application/json",
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
                };
                return [4 /*yield*/, fetch("https://claude.ai/api/organizations", { headers: headers })];
            case 1:
                orgRes = _b.sent();
                return [4 /*yield*/, orgRes.text()];
            case 2:
                orgText = _b.sent();
                if (!orgRes.ok) {
                    return [2 /*return*/, { ok: false, step: "organizations", status: orgRes.status, body: orgText }];
                }
                orgs = JSON.parse(orgText);
                orgId = (_a = orgs === null || orgs === void 0 ? void 0 : orgs[0]) === null || _a === void 0 ? void 0 : _a.uuid;
                if (!orgId) {
                    return [2 /*return*/, { ok: false, step: "organizations", status: 200, body: orgText }];
                }
                return [4 /*yield*/, fetch("https://claude.ai/api/organizations/".concat(orgId, "/usage"), { headers: headers })];
            case 3:
                usageRes = _b.sent();
                return [4 /*yield*/, usageRes.text()];
            case 4:
                usageText = _b.sent();
                return [2 /*return*/, usageRes.ok
                        ? { ok: true, orgId: orgId, body: usageText }
                        : { ok: false, step: "usage", status: usageRes.status, body: usageText }];
        }
    });
}); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var opts, _a, authPath, store, keychain, oauth, anthropic, _i, anthropic_1, entry, oauth, sessionKey, source, web;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                opts = parseArgs();
                _a = loadAuthProfiles(opts.agentId), authPath = _a.authPath, store = _a.store;
                console.log("Auth file: ".concat(authPath));
                keychain = readClaudeCliKeychain();
                if (!keychain) return [3 /*break*/, 2];
                console.log("Claude Code CLI keychain: accessToken=".concat(opts.reveal ? keychain.accessToken : mask(keychain.accessToken), " scopes=").concat((_c = (_b = keychain.scopes) === null || _b === void 0 ? void 0 : _b.join(",")) !== null && _c !== void 0 ? _c : "(unknown)"));
                return [4 /*yield*/, fetchAnthropicOAuthUsage(keychain.accessToken)];
            case 1:
                oauth = _m.sent();
                console.log("OAuth usage (keychain): HTTP ".concat(oauth.status, " (").concat((_d = oauth.contentType) !== null && _d !== void 0 ? _d : "no content-type", ")"));
                console.log(oauth.text.slice(0, 200).replace(/\s+/g, " ").trim());
                return [3 /*break*/, 3];
            case 2:
                console.log("Claude Code CLI keychain: missing/unreadable");
                _m.label = 3;
            case 3:
                anthropic = pickAnthropicTokens(store);
                if (!(anthropic.length === 0)) return [3 /*break*/, 4];
                console.log("Auth profiles: no Anthropic token profiles found");
                return [3 /*break*/, 8];
            case 4:
                _i = 0, anthropic_1 = anthropic;
                _m.label = 5;
            case 5:
                if (!(_i < anthropic_1.length)) return [3 /*break*/, 8];
                entry = anthropic_1[_i];
                console.log("Auth profiles: ".concat(entry.profileId, " token=").concat(opts.reveal ? entry.token : mask(entry.token)));
                return [4 /*yield*/, fetchAnthropicOAuthUsage(entry.token)];
            case 6:
                oauth = _m.sent();
                console.log("OAuth usage (".concat(entry.profileId, "): HTTP ").concat(oauth.status, " (").concat((_e = oauth.contentType) !== null && _e !== void 0 ? _e : "no content-type", ")"));
                console.log(oauth.text.slice(0, 200).replace(/\s+/g, " ").trim());
                _m.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8:
                sessionKey = ((_f = opts.sessionKey) === null || _f === void 0 ? void 0 : _f.trim()) ||
                    ((_g = process.env.CLAUDE_AI_SESSION_KEY) === null || _g === void 0 ? void 0 : _g.trim()) ||
                    ((_h = process.env.CLAUDE_WEB_SESSION_KEY) === null || _h === void 0 ? void 0 : _h.trim()) ||
                    ((_j = findClaudeSessionKey()) === null || _j === void 0 ? void 0 : _j.sessionKey);
                source = opts.sessionKey
                    ? "--session-key"
                    : process.env.CLAUDE_AI_SESSION_KEY || process.env.CLAUDE_WEB_SESSION_KEY
                        ? "env"
                        : ((_l = (_k = findClaudeSessionKey()) === null || _k === void 0 ? void 0 : _k.source) !== null && _l !== void 0 ? _l : "auto");
                if (!sessionKey) {
                    console.log("Claude web: no sessionKey found (try --session-key or export CLAUDE_AI_SESSION_KEY)");
                    return [2 /*return*/];
                }
                console.log("Claude web: sessionKey=".concat(opts.reveal ? sessionKey : mask(sessionKey), " (source: ").concat(source, ")"));
                return [4 /*yield*/, fetchClaudeWebUsage(sessionKey)];
            case 9:
                web = _m.sent();
                if (!web.ok) {
                    console.log("Claude web: ".concat(web.step, " HTTP ").concat(web.status));
                    console.log(String(web.body).slice(0, 400).replace(/\s+/g, " ").trim());
                    return [2 /*return*/];
                }
                console.log("Claude web: org=".concat(web.orgId, " OK"));
                console.log(web.body.slice(0, 400).replace(/\s+/g, " ").trim());
                return [2 /*return*/];
        }
    });
}); };
await main();
