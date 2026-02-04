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
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var utils_js_1 = require("./utils.js");
(0, vitest_1.describe)("normalizePath", function () {
    (0, vitest_1.it)("adds leading slash when missing", function () {
        (0, vitest_1.expect)((0, utils_js_1.normalizePath)("foo")).toBe("/foo");
    });
    (0, vitest_1.it)("keeps existing slash", function () {
        (0, vitest_1.expect)((0, utils_js_1.normalizePath)("/bar")).toBe("/bar");
    });
});
(0, vitest_1.describe)("withWhatsAppPrefix", function () {
    (0, vitest_1.it)("adds whatsapp prefix", function () {
        (0, vitest_1.expect)((0, utils_js_1.withWhatsAppPrefix)("+1555")).toBe("whatsapp:+1555");
    });
    (0, vitest_1.it)("leaves prefixed intact", function () {
        (0, vitest_1.expect)((0, utils_js_1.withWhatsAppPrefix)("whatsapp:+1555")).toBe("whatsapp:+1555");
    });
});
(0, vitest_1.describe)("ensureDir", function () {
    (0, vitest_1.it)("creates nested directory", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmp, target;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, node_fs_1.default.promises.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-test-"))];
                case 1:
                    tmp = _a.sent();
                    target = node_path_1.default.join(tmp, "nested", "dir");
                    return [4 /*yield*/, (0, utils_js_1.ensureDir)(target)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(target)).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("sleep", function () {
    (0, vitest_1.it)("resolves after delay using fake timers", function () { return __awaiter(void 0, void 0, void 0, function () {
        var promise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    promise = (0, utils_js_1.sleep)(1000);
                    vitest_1.vi.advanceTimersByTime(1000);
                    return [4 /*yield*/, (0, vitest_1.expect)(promise).resolves.toBeUndefined()];
                case 1:
                    _a.sent();
                    vitest_1.vi.useRealTimers();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("assertWebChannel", function () {
    (0, vitest_1.it)("throws for invalid channel", function () {
        (0, vitest_1.expect)(function () { return (0, utils_js_1.assertWebChannel)("bad"); }).toThrow();
    });
});
(0, vitest_1.describe)("normalizeE164 & toWhatsappJid", function () {
    (0, vitest_1.it)("strips formatting and prefixes", function () {
        (0, vitest_1.expect)((0, utils_js_1.normalizeE164)("whatsapp:(555) 123-4567")).toBe("+5551234567");
        (0, vitest_1.expect)((0, utils_js_1.toWhatsappJid)("whatsapp:+555 123 4567")).toBe("5551234567@s.whatsapp.net");
    });
    (0, vitest_1.it)("preserves existing JIDs", function () {
        (0, vitest_1.expect)((0, utils_js_1.toWhatsappJid)("123456789-987654321@g.us")).toBe("123456789-987654321@g.us");
        (0, vitest_1.expect)((0, utils_js_1.toWhatsappJid)("whatsapp:123456789-987654321@g.us")).toBe("123456789-987654321@g.us");
        (0, vitest_1.expect)((0, utils_js_1.toWhatsappJid)("1555123@s.whatsapp.net")).toBe("1555123@s.whatsapp.net");
    });
});
(0, vitest_1.describe)("jidToE164", function () {
    (0, vitest_1.it)("maps @lid using reverse mapping file", function () {
        var mappingPath = node_path_1.default.join(utils_js_1.CONFIG_DIR, "credentials", "lid-mapping-123_reverse.json");
        var original = node_fs_1.default.readFileSync;
        var spy = vitest_1.vi
            .spyOn(node_fs_1.default, "readFileSync")
            // oxlint-disable-next-line typescript/no-explicit-any
            .mockImplementation(function (path, encoding) {
            if (path === mappingPath) {
                return "\"5551234\"";
            }
            return original(path, encoding);
        });
        (0, vitest_1.expect)((0, utils_js_1.jidToE164)("123@lid")).toBe("+5551234");
        spy.mockRestore();
    });
    (0, vitest_1.it)("maps @lid from authDir mapping files", function () {
        var authDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"));
        var mappingPath = node_path_1.default.join(authDir, "lid-mapping-456_reverse.json");
        node_fs_1.default.writeFileSync(mappingPath, JSON.stringify("5559876"));
        (0, vitest_1.expect)((0, utils_js_1.jidToE164)("456@lid", { authDir: authDir })).toBe("+5559876");
        node_fs_1.default.rmSync(authDir, { recursive: true, force: true });
    });
    (0, vitest_1.it)("maps @hosted.lid from authDir mapping files", function () {
        var authDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"));
        var mappingPath = node_path_1.default.join(authDir, "lid-mapping-789_reverse.json");
        node_fs_1.default.writeFileSync(mappingPath, JSON.stringify(4440001));
        (0, vitest_1.expect)((0, utils_js_1.jidToE164)("789@hosted.lid", { authDir: authDir })).toBe("+4440001");
        node_fs_1.default.rmSync(authDir, { recursive: true, force: true });
    });
    (0, vitest_1.it)("accepts hosted PN JIDs", function () {
        (0, vitest_1.expect)((0, utils_js_1.jidToE164)("1555000:2@hosted")).toBe("+1555000");
    });
    (0, vitest_1.it)("falls back through lidMappingDirs in order", function () {
        var first = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-lid-a-"));
        var second = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-lid-b-"));
        var mappingPath = node_path_1.default.join(second, "lid-mapping-321_reverse.json");
        node_fs_1.default.writeFileSync(mappingPath, JSON.stringify("123321"));
        (0, vitest_1.expect)((0, utils_js_1.jidToE164)("321@lid", { lidMappingDirs: [first, second] })).toBe("+123321");
        node_fs_1.default.rmSync(first, { recursive: true, force: true });
        node_fs_1.default.rmSync(second, { recursive: true, force: true });
    });
});
(0, vitest_1.describe)("resolveConfigDir", function () {
    (0, vitest_1.it)("prefers ~/.openclaw when legacy dir is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, newDir, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, node_fs_1.default.promises.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-config-dir-"))];
                case 1:
                    root = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 6]);
                    newDir = node_path_1.default.join(root, ".openclaw");
                    return [4 /*yield*/, node_fs_1.default.promises.mkdir(newDir, { recursive: true })];
                case 3:
                    _a.sent();
                    resolved = (0, utils_js_1.resolveConfigDir)({}, function () { return root; });
                    (0, vitest_1.expect)(resolved).toBe(newDir);
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, node_fs_1.default.promises.rm(root, { recursive: true, force: true })];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("resolveJidToE164", function () {
    (0, vitest_1.it)("resolves @lid via lidLookup when mapping file is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var lidLookup;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lidLookup = {
                        getPNForLID: vitest_1.vi.fn().mockResolvedValue("777:0@s.whatsapp.net"),
                    };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, utils_js_1.resolveJidToE164)("777@lid", { lidLookup: lidLookup })).resolves.toBe("+777")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(lidLookup.getPNForLID).toHaveBeenCalledWith("777@lid");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips lidLookup for non-lid JIDs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var lidLookup;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lidLookup = {
                        getPNForLID: vitest_1.vi.fn().mockResolvedValue("888:0@s.whatsapp.net"),
                    };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, utils_js_1.resolveJidToE164)("888@s.whatsapp.net", { lidLookup: lidLookup })).resolves.toBe("+888")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(lidLookup.getPNForLID).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("resolveUserPath", function () {
    (0, vitest_1.it)("expands ~ to home dir", function () {
        (0, vitest_1.expect)((0, utils_js_1.resolveUserPath)("~")).toBe(node_path_1.default.resolve(node_os_1.default.homedir()));
    });
    (0, vitest_1.it)("expands ~/ to home dir", function () {
        (0, vitest_1.expect)((0, utils_js_1.resolveUserPath)("~/openclaw")).toBe(node_path_1.default.resolve(node_os_1.default.homedir(), "openclaw"));
    });
    (0, vitest_1.it)("resolves relative paths", function () {
        (0, vitest_1.expect)((0, utils_js_1.resolveUserPath)("tmp/dir")).toBe(node_path_1.default.resolve("tmp/dir"));
    });
});
