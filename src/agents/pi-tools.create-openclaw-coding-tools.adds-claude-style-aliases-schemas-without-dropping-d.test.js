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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var sharp_1 = require("sharp");
var vitest_1 = require("vitest");
require("./test-helpers/fast-coding-tools.js");
var pi_tools_js_1 = require("./pi-tools.js");
var defaultTools = (0, pi_tools_js_1.createOpenClawCodingTools)();
(0, vitest_1.describe)("createOpenClawCodingTools", function () {
    (0, vitest_1.it)("keeps read tool image metadata intact", function () { return __awaiter(void 0, void 0, void 0, function () {
        var readTool, tmpDir, imagePath, png, result, text, image;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    readTool = defaultTools.find(function (tool) { return tool.name === "read"; });
                    (0, vitest_1.expect)(readTool).toBeDefined();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-read-"))];
                case 1:
                    tmpDir = _e.sent();
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, , 6, 8]);
                    imagePath = node_path_1.default.join(tmpDir, "sample.png");
                    return [4 /*yield*/, (0, sharp_1.default)({
                            create: {
                                width: 8,
                                height: 8,
                                channels: 3,
                                background: { r: 0, g: 128, b: 255 },
                            },
                        })
                            .png()
                            .toBuffer()];
                case 3:
                    png = _e.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(imagePath, png)];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, (readTool === null || readTool === void 0 ? void 0 : readTool.execute("tool-1", {
                            path: imagePath,
                        }))];
                case 5:
                    result = _e.sent();
                    (0, vitest_1.expect)((_a = result === null || result === void 0 ? void 0 : result.content) === null || _a === void 0 ? void 0 : _a.some(function (block) { return block.type === "image"; })).toBe(true);
                    text = (_b = result === null || result === void 0 ? void 0 : result.content) === null || _b === void 0 ? void 0 : _b.find(function (block) { return block.type === "text"; });
                    (0, vitest_1.expect)((_c = text === null || text === void 0 ? void 0 : text.text) !== null && _c !== void 0 ? _c : "").toContain("Read image file [image/png]");
                    image = (_d = result === null || result === void 0 ? void 0 : result.content) === null || _d === void 0 ? void 0 : _d.find(function (block) { return block.type === "image"; });
                    (0, vitest_1.expect)(image === null || image === void 0 ? void 0 : image.mimeType).toBe("image/png");
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 7:
                    _e.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns text content without image blocks for text files", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tools, readTool, tmpDir, textPath, contents, result, textBlocks, combinedText;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    tools = (0, pi_tools_js_1.createOpenClawCodingTools)();
                    readTool = tools.find(function (tool) { return tool.name === "read"; });
                    (0, vitest_1.expect)(readTool).toBeDefined();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-read-"))];
                case 1:
                    tmpDir = _d.sent();
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, , 5, 7]);
                    textPath = node_path_1.default.join(tmpDir, "sample.txt");
                    contents = "Hello from openclaw read tool.";
                    return [4 /*yield*/, promises_1.default.writeFile(textPath, contents, "utf8")];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, (readTool === null || readTool === void 0 ? void 0 : readTool.execute("tool-2", {
                            path: textPath,
                        }))];
                case 4:
                    result = _d.sent();
                    (0, vitest_1.expect)((_a = result === null || result === void 0 ? void 0 : result.content) === null || _a === void 0 ? void 0 : _a.some(function (block) { return block.type === "image"; })).toBe(false);
                    textBlocks = (_b = result === null || result === void 0 ? void 0 : result.content) === null || _b === void 0 ? void 0 : _b.filter(function (block) { return block.type === "text"; });
                    (0, vitest_1.expect)((_c = textBlocks === null || textBlocks === void 0 ? void 0 : textBlocks.length) !== null && _c !== void 0 ? _c : 0).toBeGreaterThan(0);
                    combinedText = textBlocks === null || textBlocks === void 0 ? void 0 : textBlocks.map(function (block) { var _a; return (_a = block.text) !== null && _a !== void 0 ? _a : ""; }).join("\n");
                    (0, vitest_1.expect)(combinedText).toContain(contents);
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 6:
                    _d.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("filters tools by sandbox policy", function () {
        var sandbox = {
            enabled: true,
            sessionKey: "sandbox:test",
            workspaceDir: node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sandbox"),
            agentWorkspaceDir: node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-workspace"),
            workspaceAccess: "none",
            containerName: "openclaw-sbx-test",
            containerWorkdir: "/workspace",
            docker: {
                image: "openclaw-sandbox:bookworm-slim",
                containerPrefix: "openclaw-sbx-",
                workdir: "/workspace",
                readOnlyRoot: true,
                tmpfs: [],
                network: "none",
                user: "1000:1000",
                capDrop: ["ALL"],
                env: { LANG: "C.UTF-8" },
            },
            tools: {
                allow: ["bash"],
                deny: ["browser"],
            },
            browserAllowHostControl: false,
        };
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({ sandbox: sandbox });
        (0, vitest_1.expect)(tools.some(function (tool) { return tool.name === "exec"; })).toBe(true);
        (0, vitest_1.expect)(tools.some(function (tool) { return tool.name === "read"; })).toBe(false);
        (0, vitest_1.expect)(tools.some(function (tool) { return tool.name === "browser"; })).toBe(false);
    });
    (0, vitest_1.it)("hard-disables write/edit when sandbox workspaceAccess is ro", function () {
        var sandbox = {
            enabled: true,
            sessionKey: "sandbox:test",
            workspaceDir: node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sandbox"),
            agentWorkspaceDir: node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-workspace"),
            workspaceAccess: "ro",
            containerName: "openclaw-sbx-test",
            containerWorkdir: "/workspace",
            docker: {
                image: "openclaw-sandbox:bookworm-slim",
                containerPrefix: "openclaw-sbx-",
                workdir: "/workspace",
                readOnlyRoot: true,
                tmpfs: [],
                network: "none",
                user: "1000:1000",
                capDrop: ["ALL"],
                env: { LANG: "C.UTF-8" },
            },
            tools: {
                allow: ["read", "write", "edit"],
                deny: [],
            },
            browserAllowHostControl: false,
        };
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({ sandbox: sandbox });
        (0, vitest_1.expect)(tools.some(function (tool) { return tool.name === "read"; })).toBe(true);
        (0, vitest_1.expect)(tools.some(function (tool) { return tool.name === "write"; })).toBe(false);
        (0, vitest_1.expect)(tools.some(function (tool) { return tool.name === "edit"; })).toBe(false);
    });
    (0, vitest_1.it)("filters tools by agent tool policy even without sandbox", function () {
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: { tools: { deny: ["browser"] } },
        });
        (0, vitest_1.expect)(tools.some(function (tool) { return tool.name === "exec"; })).toBe(true);
        (0, vitest_1.expect)(tools.some(function (tool) { return tool.name === "browser"; })).toBe(false);
    });
});
