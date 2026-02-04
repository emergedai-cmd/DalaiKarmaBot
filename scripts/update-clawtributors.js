"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
Object.defineProperty(exports, "__esModule", { value: true });
var node_child_process_1 = require("node:child_process");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var REPO = "openclaw/openclaw";
var PER_LINE = 10;
var mapPath = (0, node_path_1.resolve)("scripts/clawtributors-map.json");
var mapConfig = JSON.parse((0, node_fs_1.readFileSync)(mapPath, "utf8"));
var displayName = (_a = mapConfig.displayName) !== null && _a !== void 0 ? _a : {};
var nameToLogin = normalizeMap((_b = mapConfig.nameToLogin) !== null && _b !== void 0 ? _b : {});
var emailToLogin = normalizeMap((_c = mapConfig.emailToLogin) !== null && _c !== void 0 ? _c : {});
var ensureLogins = ((_d = mapConfig.ensureLogins) !== null && _d !== void 0 ? _d : []).map(function (login) { return login.toLowerCase(); });
var readmePath = (0, node_path_1.resolve)("README.md");
var placeholderAvatar = (_e = mapConfig.placeholderAvatar) !== null && _e !== void 0 ? _e : "assets/avatar-placeholder.svg";
var seedCommit = (_f = mapConfig.seedCommit) !== null && _f !== void 0 ? _f : null;
var seedEntries = seedCommit ? parseReadmeEntries(run("git show ".concat(seedCommit, ":README.md"))) : [];
var raw = run("gh api \"repos/".concat(REPO, "/contributors?per_page=100&anon=1\" --paginate"));
var contributors = parsePaginatedJson(raw);
var apiByLogin = new Map();
var contributionsByLogin = new Map();
for (var _i = 0, contributors_1 = contributors; _i < contributors_1.length; _i++) {
    var item = contributors_1[_i];
    if (!(item === null || item === void 0 ? void 0 : item.login) || !(item === null || item === void 0 ? void 0 : item.html_url) || !(item === null || item === void 0 ? void 0 : item.avatar_url)) {
        continue;
    }
    if (typeof item.contributions === "number") {
        contributionsByLogin.set(item.login.toLowerCase(), item.contributions);
    }
    apiByLogin.set(item.login.toLowerCase(), {
        login: item.login,
        html_url: item.html_url,
        avatar_url: normalizeAvatar(item.avatar_url),
    });
}
for (var _3 = 0, ensureLogins_1 = ensureLogins; _3 < ensureLogins_1.length; _3++) {
    var login = ensureLogins_1[_3];
    if (!apiByLogin.has(login)) {
        var user = fetchUser(login);
        if (user) {
            apiByLogin.set(user.login.toLowerCase(), user);
        }
    }
}
var log = run("git log --format=%aN%x7c%aE --numstat");
var linesByLogin = new Map();
var currentName = null;
var currentEmail = null;
for (var _4 = 0, _5 = log.split("\n"); _4 < _5.length; _4++) {
    var line = _5[_4];
    if (!line.trim()) {
        continue;
    }
    if (line.includes("|") && !/^[0-9-]/.test(line)) {
        var _6 = line.split("|", 2), name_1 = _6[0], email = _6[1];
        currentName = (_g = name_1 === null || name_1 === void 0 ? void 0 : name_1.trim()) !== null && _g !== void 0 ? _g : null;
        currentEmail = (_h = email === null || email === void 0 ? void 0 : email.trim().toLowerCase()) !== null && _h !== void 0 ? _h : null;
        continue;
    }
    if (!currentName) {
        continue;
    }
    var parts = line.split("\t");
    if (parts.length < 2) {
        continue;
    }
    var adds = parseCount(parts[0]);
    var dels = parseCount(parts[1]);
    var total = adds + dels;
    if (!total) {
        continue;
    }
    var login = resolveLogin(currentName, currentEmail, apiByLogin, nameToLogin, emailToLogin);
    if (!login) {
        continue;
    }
    var key = login.toLowerCase();
    linesByLogin.set(key, ((_j = linesByLogin.get(key)) !== null && _j !== void 0 ? _j : 0) + total);
}
for (var _7 = 0, ensureLogins_2 = ensureLogins; _7 < ensureLogins_2.length; _7++) {
    var login = ensureLogins_2[_7];
    if (!linesByLogin.has(login)) {
        linesByLogin.set(login, 0);
    }
}
var entriesByKey = new Map();
for (var _8 = 0, seedEntries_1 = seedEntries; _8 < seedEntries_1.length; _8++) {
    var seed = seedEntries_1[_8];
    var login = loginFromUrl(seed.html_url);
    var resolvedLogin = login !== null && login !== void 0 ? login : resolveLogin(seed.display, null, apiByLogin, nameToLogin, emailToLogin);
    var key = resolvedLogin ? resolvedLogin.toLowerCase() : "name:".concat(normalizeName(seed.display));
    var avatar = seed.avatar_url && !isGhostAvatar(seed.avatar_url)
        ? normalizeAvatar(seed.avatar_url)
        : placeholderAvatar;
    var existing = entriesByKey.get(key);
    if (!existing) {
        var user = resolvedLogin ? apiByLogin.get(key) : null;
        entriesByKey.set(key, {
            key: key,
            login: (_k = resolvedLogin !== null && resolvedLogin !== void 0 ? resolvedLogin : login) !== null && _k !== void 0 ? _k : undefined,
            display: seed.display,
            html_url: (_l = user === null || user === void 0 ? void 0 : user.html_url) !== null && _l !== void 0 ? _l : seed.html_url,
            avatar_url: (_m = user === null || user === void 0 ? void 0 : user.avatar_url) !== null && _m !== void 0 ? _m : avatar,
            lines: 0,
        });
    }
    else {
        existing.display = existing.display || seed.display;
        if (existing.avatar_url === placeholderAvatar || !existing.avatar_url) {
            existing.avatar_url = avatar;
        }
        if (!existing.html_url || existing.html_url.includes("/search?q=")) {
            existing.html_url = seed.html_url;
        }
    }
}
for (var _9 = 0, contributors_2 = contributors; _9 < contributors_2.length; _9++) {
    var item = contributors_2[_9];
    var baseName = ((_o = item.name) === null || _o === void 0 ? void 0 : _o.trim()) || ((_p = item.email) === null || _p === void 0 ? void 0 : _p.trim()) || ((_q = item.login) === null || _q === void 0 ? void 0 : _q.trim());
    if (!baseName) {
        continue;
    }
    var resolvedLogin = item.login
        ? item.login
        : resolveLogin(baseName, (_r = item.email) !== null && _r !== void 0 ? _r : null, apiByLogin, nameToLogin, emailToLogin);
    if (resolvedLogin) {
        var key = resolvedLogin.toLowerCase();
        var existing = entriesByKey.get(key);
        if (!existing) {
            var user = (_s = apiByLogin.get(key)) !== null && _s !== void 0 ? _s : fetchUser(resolvedLogin);
            if (user) {
                var lines_1 = (_t = linesByLogin.get(key)) !== null && _t !== void 0 ? _t : 0;
                var contributions = (_u = contributionsByLogin.get(key)) !== null && _u !== void 0 ? _u : 0;
                entriesByKey.set(key, {
                    key: key,
                    login: user.login,
                    display: pickDisplay(baseName, user.login, existing === null || existing === void 0 ? void 0 : existing.display),
                    html_url: user.html_url,
                    avatar_url: normalizeAvatar(user.avatar_url),
                    lines: lines_1 > 0 ? lines_1 : contributions,
                });
            }
        }
        else if (existing) {
            existing.login = (_v = existing.login) !== null && _v !== void 0 ? _v : resolvedLogin;
            existing.display = pickDisplay(baseName, existing.login, existing.display);
            if (existing.avatar_url === placeholderAvatar || !existing.avatar_url) {
                var user = (_w = apiByLogin.get(key)) !== null && _w !== void 0 ? _w : fetchUser(resolvedLogin);
                if (user) {
                    existing.html_url = user.html_url;
                    existing.avatar_url = normalizeAvatar(user.avatar_url);
                }
            }
            var lines_2 = (_x = linesByLogin.get(key)) !== null && _x !== void 0 ? _x : 0;
            var contributions = (_y = contributionsByLogin.get(key)) !== null && _y !== void 0 ? _y : 0;
            existing.lines = Math.max(existing.lines, lines_2 > 0 ? lines_2 : contributions);
        }
        continue;
    }
    var anonKey = "name:".concat(normalizeName(baseName));
    var existingAnon = entriesByKey.get(anonKey);
    if (!existingAnon) {
        entriesByKey.set(anonKey, {
            key: anonKey,
            display: baseName,
            html_url: fallbackHref(baseName),
            avatar_url: placeholderAvatar,
            lines: (_z = item.contributions) !== null && _z !== void 0 ? _z : 0,
        });
    }
    else {
        existingAnon.lines = Math.max(existingAnon.lines, (_0 = item.contributions) !== null && _0 !== void 0 ? _0 : 0);
    }
}
for (var _10 = 0, _11 = linesByLogin.entries(); _10 < _11.length; _10++) {
    var _12 = _11[_10], login = _12[0], lines_3 = _12[1];
    if (entriesByKey.has(login)) {
        continue;
    }
    var user = apiByLogin.get(login);
    if (!user) {
        user = fetchUser(login) || undefined;
    }
    if (user) {
        var contributions = (_1 = contributionsByLogin.get(login)) !== null && _1 !== void 0 ? _1 : 0;
        entriesByKey.set(login, {
            key: login,
            login: user.login,
            display: (_2 = displayName[user.login.toLowerCase()]) !== null && _2 !== void 0 ? _2 : user.login,
            html_url: user.html_url,
            avatar_url: normalizeAvatar(user.avatar_url),
            lines: lines_3 > 0 ? lines_3 : contributions,
        });
    }
    else {
        entriesByKey.set(login, {
            key: login,
            display: login,
            html_url: fallbackHref(login),
            avatar_url: placeholderAvatar,
            lines: lines_3,
        });
    }
}
var entries = Array.from(entriesByKey.values());
entries.sort(function (a, b) {
    if (b.lines !== a.lines) {
        return b.lines - a.lines;
    }
    return a.display.localeCompare(b.display);
});
var lines = [];
for (var i = 0; i < entries.length; i += PER_LINE) {
    var chunk = entries.slice(i, i + PER_LINE);
    var parts = chunk.map(function (entry) {
        return "<a href=\"".concat(entry.html_url, "\"><img src=\"").concat(entry.avatar_url, "\" width=\"48\" height=\"48\" alt=\"").concat(entry.display, "\" title=\"").concat(entry.display, "\"/></a>");
    });
    lines.push("  ".concat(parts.join(" ")));
}
var block = "".concat(lines.join("\n"), "\n");
var readme = (0, node_fs_1.readFileSync)(readmePath, "utf8");
var start = readme.indexOf('<p align="left">');
var end = readme.indexOf("</p>", start);
if (start === -1 || end === -1) {
    throw new Error("README.md missing clawtributors block");
}
var next = "".concat(readme.slice(0, start), "<p align=\"left\">\n").concat(block).concat(readme.slice(end));
(0, node_fs_1.writeFileSync)(readmePath, next);
console.log("Updated README clawtributors: ".concat(entries.length, " entries"));
function run(cmd) {
    return (0, node_child_process_1.execSync)(cmd, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        maxBuffer: 1024 * 1024 * 200,
    }).trim();
}
// oxlint-disable-next-line typescript/no-explicit-any
function parsePaginatedJson(raw) {
    // oxlint-disable-next-line typescript/no-explicit-any
    var items = [];
    for (var _i = 0, _a = raw.split("\n"); _i < _a.length; _i++) {
        var line = _a[_i];
        if (!line.trim()) {
            continue;
        }
        var parsed = JSON.parse(line);
        if (Array.isArray(parsed)) {
            items.push.apply(items, parsed);
        }
        else {
            items.push(parsed);
        }
    }
    return items;
}
function normalizeMap(map) {
    var out = {};
    for (var _i = 0, _a = Object.entries(map); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        out[normalizeName(key)] = value;
    }
    return out;
}
function normalizeName(value) {
    return value.trim().toLowerCase().replace(/\s+/g, " ");
}
function parseCount(value) {
    return /^\d+$/.test(value) ? Number(value) : 0;
}
function normalizeAvatar(url) {
    if (!/^https?:/i.test(url)) {
        return url;
    }
    var lower = url.toLowerCase();
    if (lower.includes("s=") || lower.includes("size=")) {
        return url;
    }
    var sep = url.includes("?") ? "&" : "?";
    return "".concat(url).concat(sep, "s=48");
}
function isGhostAvatar(url) {
    return url.toLowerCase().includes("ghost.png");
}
function fetchUser(login) {
    try {
        var data = (0, node_child_process_1.execSync)("gh api users/".concat(login), {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"],
        });
        var parsed = JSON.parse(data);
        if (!(parsed === null || parsed === void 0 ? void 0 : parsed.login) || !(parsed === null || parsed === void 0 ? void 0 : parsed.html_url) || !(parsed === null || parsed === void 0 ? void 0 : parsed.avatar_url)) {
            return null;
        }
        return {
            login: parsed.login,
            html_url: parsed.html_url,
            avatar_url: normalizeAvatar(parsed.avatar_url),
        };
    }
    catch (_a) {
        return null;
    }
}
function resolveLogin(name, email, apiByLogin, nameToLogin, emailToLogin) {
    if (email && emailToLogin[email]) {
        return emailToLogin[email];
    }
    if (email && name) {
        var guessed = guessLoginFromEmailName(name, email, apiByLogin);
        if (guessed) {
            return guessed;
        }
    }
    if (email && email.endsWith("@users.noreply.github.com")) {
        var local = email.split("@", 1)[0];
        var login = local.includes("+") ? local.split("+")[1] : local;
        return login || null;
    }
    if (email && email.endsWith("@github.com")) {
        var login = email.split("@", 1)[0];
        if (apiByLogin.has(login.toLowerCase())) {
            return login;
        }
    }
    var normalized = normalizeName(name);
    if (nameToLogin[normalized]) {
        return nameToLogin[normalized];
    }
    var compact = normalized.replace(/\s+/g, "");
    if (nameToLogin[compact]) {
        return nameToLogin[compact];
    }
    if (apiByLogin.has(normalized)) {
        return normalized;
    }
    if (apiByLogin.has(compact)) {
        return compact;
    }
    return null;
}
function guessLoginFromEmailName(name, email, apiByLogin) {
    var _a;
    var local = (_a = email.split("@", 1)[0]) === null || _a === void 0 ? void 0 : _a.trim();
    if (!local) {
        return null;
    }
    var normalizedName = normalizeIdentifier(name);
    if (!normalizedName) {
        return null;
    }
    var candidates = new Set([local, local.replace(/[._-]/g, "")]);
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var candidate = candidates_1[_i];
        if (!candidate) {
            continue;
        }
        if (normalizeIdentifier(candidate) !== normalizedName) {
            continue;
        }
        var key = candidate.toLowerCase();
        if (apiByLogin.has(key)) {
            return key;
        }
    }
    return null;
}
function normalizeIdentifier(value) {
    return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}
function parseReadmeEntries(content) {
    var start = content.indexOf('<p align="left">');
    var end = content.indexOf("</p>", start);
    if (start === -1 || end === -1) {
        return [];
    }
    var block = content.slice(start, end);
    var entries = [];
    var linked = /<a href="([^"]+)"><img src="([^"]+)"[^>]*alt="([^"]+)"[^>]*>/g;
    for (var _i = 0, _a = block.matchAll(linked); _i < _a.length; _i++) {
        var match = _a[_i];
        var href = match[1], src = match[2], alt = match[3];
        if (!href || !src || !alt) {
            continue;
        }
        entries.push({ html_url: href, avatar_url: src, display: alt });
    }
    var standalone = /<img src="([^"]+)"[^>]*alt="([^"]+)"[^>]*>/g;
    var _loop_1 = function (match) {
        var src = match[1], alt = match[2];
        if (!src || !alt) {
            return "continue";
        }
        if (entries.some(function (entry) { return entry.display === alt && entry.avatar_url === src; })) {
            return "continue";
        }
        entries.push({ html_url: fallbackHref(alt), avatar_url: src, display: alt });
    };
    for (var _b = 0, _c = block.matchAll(standalone); _b < _c.length; _b++) {
        var match = _c[_b];
        _loop_1(match);
    }
    return entries;
}
function loginFromUrl(url) {
    var match = /^https?:\/\/github\.com\/([^/?#]+)/i.exec(url);
    if (!match) {
        return null;
    }
    var login = match[1];
    if (!login || login.toLowerCase() === "search") {
        return null;
    }
    return login;
}
function fallbackHref(value) {
    var encoded = encodeURIComponent(value.trim());
    return encoded ? "https://github.com/search?q=".concat(encoded) : "https://github.com";
}
function pickDisplay(baseName, login, existing) {
    var key = login.toLowerCase();
    if (displayName[key]) {
        return displayName[key];
    }
    if (existing) {
        return existing;
    }
    if (baseName) {
        return baseName;
    }
    return login;
}
