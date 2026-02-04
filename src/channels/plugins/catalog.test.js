"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var catalog_js_1 = require("./catalog.js");
(0, vitest_1.describe)("channel plugin catalog", function () {
    (0, vitest_1.it)("includes Microsoft Teams", function () {
        var entry = (0, catalog_js_1.getChannelPluginCatalogEntry)("msteams");
        (0, vitest_1.expect)(entry === null || entry === void 0 ? void 0 : entry.install.npmSpec).toBe("@openclaw/msteams");
        (0, vitest_1.expect)(entry === null || entry === void 0 ? void 0 : entry.meta.aliases).toContain("teams");
    });
    (0, vitest_1.it)("lists plugin catalog entries", function () {
        var ids = (0, catalog_js_1.listChannelPluginCatalogEntries)().map(function (entry) { return entry.id; });
        (0, vitest_1.expect)(ids).toContain("msteams");
    });
    (0, vitest_1.it)("includes external catalog entries", function () {
        var dir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-catalog-"));
        var catalogPath = node_path_1.default.join(dir, "catalog.json");
        node_fs_1.default.writeFileSync(catalogPath, JSON.stringify({
            entries: [
                {
                    name: "@openclaw/demo-channel",
                    openclaw: {
                        channel: {
                            id: "demo-channel",
                            label: "Demo Channel",
                            selectionLabel: "Demo Channel",
                            docsPath: "/channels/demo-channel",
                            blurb: "Demo entry",
                            order: 999,
                        },
                        install: {
                            npmSpec: "@openclaw/demo-channel",
                        },
                    },
                },
            ],
        }));
        var ids = (0, catalog_js_1.listChannelPluginCatalogEntries)({ catalogPaths: [catalogPath] }).map(function (entry) { return entry.id; });
        (0, vitest_1.expect)(ids).toContain("demo-channel");
    });
});
