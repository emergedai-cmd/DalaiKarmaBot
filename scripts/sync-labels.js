"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_child_process_1 = require("node:child_process");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var COLOR_BY_PREFIX = new Map([
    ["channel", "1d76db"],
    ["app", "6f42c1"],
    ["extensions", "0e8a16"],
    ["docs", "0075ca"],
    ["cli", "f9d0c4"],
    ["gateway", "d4c5f9"],
]);
var configPath = (0, node_path_1.resolve)(".github/labeler.yml");
var labelNames = extractLabelNames((0, node_fs_1.readFileSync)(configPath, "utf8"));
if (!labelNames.length) {
    throw new Error("labeler.yml must declare at least one label.");
}
var repo = resolveRepo();
var existing = fetchExistingLabels(repo);
var missing = labelNames.filter(function (label) { return !existing.has(label); });
if (!missing.length) {
    console.log("All labeler labels already exist.");
    process.exit(0);
}
for (var _i = 0, missing_1 = missing; _i < missing_1.length; _i++) {
    var label = missing_1[_i];
    var color = pickColor(label);
    (0, node_child_process_1.execFileSync)("gh", ["api", "-X", "POST", "repos/".concat(repo, "/labels"), "-f", "name=".concat(label), "-f", "color=".concat(color)], { stdio: "inherit" });
    console.log("Created label: ".concat(label));
}
function extractLabelNames(contents) {
    var _a, _b, _c;
    var labels = [];
    for (var _i = 0, _d = contents.split("\n"); _i < _d.length; _i++) {
        var line = _d[_i];
        if (!line.trim() || line.trimStart().startsWith("#")) {
            continue;
        }
        if (/^\s/.test(line)) {
            continue;
        }
        var match = (_a = line.match(/^(["'])(.+)\1\s*:/)) !== null && _a !== void 0 ? _a : line.match(/^([^:]+):/);
        if (match) {
            var name_1 = ((_c = (_b = match[2]) !== null && _b !== void 0 ? _b : match[1]) !== null && _c !== void 0 ? _c : "").trim();
            if (name_1) {
                labels.push(name_1);
            }
        }
    }
    return labels;
}
function pickColor(label) {
    var _a;
    var prefix = label.includes(":") ? label.split(":", 1)[0].trim() : label.trim();
    return (_a = COLOR_BY_PREFIX.get(prefix)) !== null && _a !== void 0 ? _a : "ededed";
}
function resolveRepo() {
    var remote = (0, node_child_process_1.execFileSync)("git", ["config", "--get", "remote.origin.url"], {
        encoding: "utf8",
    }).trim();
    if (!remote) {
        throw new Error("Unable to determine repository from git remote.");
    }
    if (remote.startsWith("git@github.com:")) {
        return remote.replace("git@github.com:", "").replace(/\.git$/, "");
    }
    if (remote.startsWith("https://github.com/")) {
        return remote.replace("https://github.com/", "").replace(/\.git$/, "");
    }
    throw new Error("Unsupported GitHub remote: ".concat(remote));
}
function fetchExistingLabels(repo) {
    var raw = (0, node_child_process_1.execFileSync)("gh", ["api", "repos/".concat(repo, "/labels?per_page=100"), "--paginate"], {
        encoding: "utf8",
    });
    var labels = JSON.parse(raw);
    return new Map(labels.map(function (label) { return [label.name, label]; }));
}
