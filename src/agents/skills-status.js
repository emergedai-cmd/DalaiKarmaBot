"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWorkspaceSkillStatus = buildWorkspaceSkillStatus;
var node_path_1 = require("node:path");
var utils_js_1 = require("../utils.js");
var skills_js_1 = require("./skills.js");
function resolveSkillKey(entry) {
    var _a, _b;
    return (_b = (_a = entry.metadata) === null || _a === void 0 ? void 0 : _a.skillKey) !== null && _b !== void 0 ? _b : entry.skill.name;
}
function selectPreferredInstallSpec(install, prefs) {
    if (install.length === 0) {
        return undefined;
    }
    var indexed = install.map(function (spec, index) { return ({ spec: spec, index: index }); });
    var findKind = function (kind) {
        return indexed.find(function (item) { return item.spec.kind === kind; });
    };
    var brewSpec = findKind("brew");
    var nodeSpec = findKind("node");
    var goSpec = findKind("go");
    var uvSpec = findKind("uv");
    if (prefs.preferBrew && (0, skills_js_1.hasBinary)("brew") && brewSpec) {
        return brewSpec;
    }
    if (uvSpec) {
        return uvSpec;
    }
    if (nodeSpec) {
        return nodeSpec;
    }
    if (brewSpec) {
        return brewSpec;
    }
    if (goSpec) {
        return goSpec;
    }
    return indexed[0];
}
function normalizeInstallOptions(entry, prefs) {
    var _a, _b;
    var install = (_b = (_a = entry.metadata) === null || _a === void 0 ? void 0 : _a.install) !== null && _b !== void 0 ? _b : [];
    if (install.length === 0) {
        return [];
    }
    var platform = process.platform;
    var filtered = install.filter(function (spec) {
        var _a;
        var osList = (_a = spec.os) !== null && _a !== void 0 ? _a : [];
        return osList.length === 0 || osList.includes(platform);
    });
    if (filtered.length === 0) {
        return [];
    }
    var toOption = function (spec, index) {
        var _a, _b, _c;
        var id = ((_a = spec.id) !== null && _a !== void 0 ? _a : "".concat(spec.kind, "-").concat(index)).trim();
        var bins = (_b = spec.bins) !== null && _b !== void 0 ? _b : [];
        var label = ((_c = spec.label) !== null && _c !== void 0 ? _c : "").trim();
        if (spec.kind === "node" && spec.package) {
            label = "Install ".concat(spec.package, " (").concat(prefs.nodeManager, ")");
        }
        if (!label) {
            if (spec.kind === "brew" && spec.formula) {
                label = "Install ".concat(spec.formula, " (brew)");
            }
            else if (spec.kind === "node" && spec.package) {
                label = "Install ".concat(spec.package, " (").concat(prefs.nodeManager, ")");
            }
            else if (spec.kind === "go" && spec.module) {
                label = "Install ".concat(spec.module, " (go)");
            }
            else if (spec.kind === "uv" && spec.package) {
                label = "Install ".concat(spec.package, " (uv)");
            }
            else if (spec.kind === "download" && spec.url) {
                var url = spec.url.trim();
                var last = url.split("/").pop();
                label = "Download ".concat(last && last.length > 0 ? last : url);
            }
            else {
                label = "Run installer";
            }
        }
        return { id: id, kind: spec.kind, label: label, bins: bins };
    };
    var allDownloads = filtered.every(function (spec) { return spec.kind === "download"; });
    if (allDownloads) {
        return filtered.map(function (spec, index) { return toOption(spec, index); });
    }
    var preferred = selectPreferredInstallSpec(filtered, prefs);
    if (!preferred) {
        return [];
    }
    return [toOption(preferred.spec, preferred.index)];
}
function buildSkillStatus(entry, config, prefs, eligibility) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
    var skillKey = resolveSkillKey(entry);
    var skillConfig = (0, skills_js_1.resolveSkillConfig)(config, skillKey);
    var disabled = (skillConfig === null || skillConfig === void 0 ? void 0 : skillConfig.enabled) === false;
    var allowBundled = (0, skills_js_1.resolveBundledAllowlist)(config);
    var blockedByAllowlist = !(0, skills_js_1.isBundledSkillAllowed)(entry, allowBundled);
    var always = ((_a = entry.metadata) === null || _a === void 0 ? void 0 : _a.always) === true;
    var emoji = (_c = (_b = entry.metadata) === null || _b === void 0 ? void 0 : _b.emoji) !== null && _c !== void 0 ? _c : entry.frontmatter.emoji;
    var homepageRaw = (_g = (_f = (_e = (_d = entry.metadata) === null || _d === void 0 ? void 0 : _d.homepage) !== null && _e !== void 0 ? _e : entry.frontmatter.homepage) !== null && _f !== void 0 ? _f : entry.frontmatter.website) !== null && _g !== void 0 ? _g : entry.frontmatter.url;
    var homepage = (homepageRaw === null || homepageRaw === void 0 ? void 0 : homepageRaw.trim()) ? homepageRaw.trim() : undefined;
    var requiredBins = (_k = (_j = (_h = entry.metadata) === null || _h === void 0 ? void 0 : _h.requires) === null || _j === void 0 ? void 0 : _j.bins) !== null && _k !== void 0 ? _k : [];
    var requiredAnyBins = (_o = (_m = (_l = entry.metadata) === null || _l === void 0 ? void 0 : _l.requires) === null || _m === void 0 ? void 0 : _m.anyBins) !== null && _o !== void 0 ? _o : [];
    var requiredEnv = (_r = (_q = (_p = entry.metadata) === null || _p === void 0 ? void 0 : _p.requires) === null || _q === void 0 ? void 0 : _q.env) !== null && _r !== void 0 ? _r : [];
    var requiredConfig = (_u = (_t = (_s = entry.metadata) === null || _s === void 0 ? void 0 : _s.requires) === null || _t === void 0 ? void 0 : _t.config) !== null && _u !== void 0 ? _u : [];
    var requiredOs = (_w = (_v = entry.metadata) === null || _v === void 0 ? void 0 : _v.os) !== null && _w !== void 0 ? _w : [];
    var missingBins = requiredBins.filter(function (bin) {
        var _a, _b;
        if ((0, skills_js_1.hasBinary)(bin)) {
            return false;
        }
        if ((_b = (_a = eligibility === null || eligibility === void 0 ? void 0 : eligibility.remote) === null || _a === void 0 ? void 0 : _a.hasBin) === null || _b === void 0 ? void 0 : _b.call(_a, bin)) {
            return false;
        }
        return true;
    });
    var missingAnyBins = requiredAnyBins.length > 0 &&
        !(requiredAnyBins.some(function (bin) { return (0, skills_js_1.hasBinary)(bin); }) ||
            ((_y = (_x = eligibility === null || eligibility === void 0 ? void 0 : eligibility.remote) === null || _x === void 0 ? void 0 : _x.hasAnyBin) === null || _y === void 0 ? void 0 : _y.call(_x, requiredAnyBins)))
        ? requiredAnyBins
        : [];
    var missingOs = requiredOs.length > 0 &&
        !requiredOs.includes(process.platform) &&
        !((_0 = (_z = eligibility === null || eligibility === void 0 ? void 0 : eligibility.remote) === null || _z === void 0 ? void 0 : _z.platforms) === null || _0 === void 0 ? void 0 : _0.some(function (platform) { return requiredOs.includes(platform); }))
        ? requiredOs
        : [];
    var missingEnv = [];
    for (var _i = 0, requiredEnv_1 = requiredEnv; _i < requiredEnv_1.length; _i++) {
        var envName = requiredEnv_1[_i];
        if (process.env[envName]) {
            continue;
        }
        if ((_1 = skillConfig === null || skillConfig === void 0 ? void 0 : skillConfig.env) === null || _1 === void 0 ? void 0 : _1[envName]) {
            continue;
        }
        if ((skillConfig === null || skillConfig === void 0 ? void 0 : skillConfig.apiKey) && ((_2 = entry.metadata) === null || _2 === void 0 ? void 0 : _2.primaryEnv) === envName) {
            continue;
        }
        missingEnv.push(envName);
    }
    var configChecks = requiredConfig.map(function (pathStr) {
        var value = (0, skills_js_1.resolveConfigPath)(config, pathStr);
        var satisfied = (0, skills_js_1.isConfigPathTruthy)(config, pathStr);
        return { path: pathStr, value: value, satisfied: satisfied };
    });
    var missingConfig = configChecks.filter(function (check) { return !check.satisfied; }).map(function (check) { return check.path; });
    var missing = always
        ? { bins: [], anyBins: [], env: [], config: [], os: [] }
        : {
            bins: missingBins,
            anyBins: missingAnyBins,
            env: missingEnv,
            config: missingConfig,
            os: missingOs,
        };
    var eligible = !disabled &&
        !blockedByAllowlist &&
        (always ||
            (missing.bins.length === 0 &&
                missing.anyBins.length === 0 &&
                missing.env.length === 0 &&
                missing.config.length === 0 &&
                missing.os.length === 0));
    return {
        name: entry.skill.name,
        description: entry.skill.description,
        source: entry.skill.source,
        filePath: entry.skill.filePath,
        baseDir: entry.skill.baseDir,
        skillKey: skillKey,
        primaryEnv: (_3 = entry.metadata) === null || _3 === void 0 ? void 0 : _3.primaryEnv,
        emoji: emoji,
        homepage: homepage,
        always: always,
        disabled: disabled,
        blockedByAllowlist: blockedByAllowlist,
        eligible: eligible,
        requirements: {
            bins: requiredBins,
            anyBins: requiredAnyBins,
            env: requiredEnv,
            config: requiredConfig,
            os: requiredOs,
        },
        missing: missing,
        configChecks: configChecks,
        install: normalizeInstallOptions(entry, prefs !== null && prefs !== void 0 ? prefs : (0, skills_js_1.resolveSkillsInstallPreferences)(config)),
    };
}
function buildWorkspaceSkillStatus(workspaceDir, opts) {
    var _a, _b;
    var managedSkillsDir = (_a = opts === null || opts === void 0 ? void 0 : opts.managedSkillsDir) !== null && _a !== void 0 ? _a : node_path_1.default.join(utils_js_1.CONFIG_DIR, "skills");
    var skillEntries = (_b = opts === null || opts === void 0 ? void 0 : opts.entries) !== null && _b !== void 0 ? _b : (0, skills_js_1.loadWorkspaceSkillEntries)(workspaceDir, opts);
    var prefs = (0, skills_js_1.resolveSkillsInstallPreferences)(opts === null || opts === void 0 ? void 0 : opts.config);
    return {
        workspaceDir: workspaceDir,
        managedSkillsDir: managedSkillsDir,
        skills: skillEntries.map(function (entry) {
            return buildSkillStatus(entry, opts === null || opts === void 0 ? void 0 : opts.config, prefs, opts === null || opts === void 0 ? void 0 : opts.eligibility);
        }),
    };
}
