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
var jszip_1 = require("jszip");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var sharp_1 = require("sharp");
var vitest_1 = require("vitest");
var paths_js_1 = require("../../test/helpers/paths.js");
(0, vitest_1.describe)("media store", function () {
    var store;
    var home = "";
    var envSnapshot = {};
    var snapshotEnv = function () {
        for (var _i = 0, _a = ["HOME", "USERPROFILE", "HOMEDRIVE", "HOMEPATH", "OPENCLAW_STATE_DIR"]; _i < _a.length; _i++) {
            var key = _a[_i];
            envSnapshot[key] = process.env[key];
        }
    };
    var restoreEnv = function () {
        for (var _i = 0, _a = Object.entries(envSnapshot); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (value === undefined) {
                delete process.env[key];
            }
            else {
                process.env[key] = value;
            }
        }
    };
    (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var match;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    snapshotEnv();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-test-home-"))];
                case 1:
                    home = _a.sent();
                    process.env.HOME = home;
                    process.env.USERPROFILE = home;
                    process.env.OPENCLAW_STATE_DIR = node_path_1.default.join(home, ".openclaw");
                    if (process.platform === "win32") {
                        match = home.match(/^([A-Za-z]:)(.*)$/);
                        if (match) {
                            process.env.HOMEDRIVE = match[1];
                            process.env.HOMEPATH = match[2] || "\\";
                        }
                    }
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.join(home, ".openclaw"), { recursive: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./store.js"); })];
                case 3:
                    store = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    restoreEnv();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.rm(home, { recursive: true, force: true })];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    function withTempStore(fn) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fn(store, home)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    (0, vitest_1.it)("creates and returns media directory", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempStore(function (store, home) { return __awaiter(void 0, void 0, void 0, function () {
                        var dir, stat;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, store.ensureMediaDir()];
                                case 1:
                                    dir = _a.sent();
                                    (0, vitest_1.expect)((0, paths_js_1.isPathWithinBase)(home, dir)).toBe(true);
                                    (0, vitest_1.expect)(node_path_1.default.normalize(dir)).toContain("".concat(node_path_1.default.sep, ".openclaw").concat(node_path_1.default.sep, "media"));
                                    return [4 /*yield*/, promises_1.default.stat(dir)];
                                case 2:
                                    stat = _a.sent();
                                    (0, vitest_1.expect)(stat.isDirectory()).toBe(true);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("saves buffers and enforces size limit", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempStore(function (store) { return __awaiter(void 0, void 0, void 0, function () {
                        var buf, saved, savedStat, jpeg, savedJpeg, huge;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    buf = Buffer.from("hello");
                                    return [4 /*yield*/, store.saveMediaBuffer(buf, "text/plain")];
                                case 1:
                                    saved = _a.sent();
                                    return [4 /*yield*/, promises_1.default.stat(saved.path)];
                                case 2:
                                    savedStat = _a.sent();
                                    (0, vitest_1.expect)(savedStat.size).toBe(buf.length);
                                    (0, vitest_1.expect)(saved.contentType).toBe("text/plain");
                                    (0, vitest_1.expect)(saved.path.endsWith(".txt")).toBe(true);
                                    return [4 /*yield*/, (0, sharp_1.default)({
                                            create: { width: 2, height: 2, channels: 3, background: "#123456" },
                                        })
                                            .jpeg({ quality: 80 })
                                            .toBuffer()];
                                case 3:
                                    jpeg = _a.sent();
                                    return [4 /*yield*/, store.saveMediaBuffer(jpeg, "image/jpeg")];
                                case 4:
                                    savedJpeg = _a.sent();
                                    (0, vitest_1.expect)(savedJpeg.contentType).toBe("image/jpeg");
                                    (0, vitest_1.expect)(savedJpeg.path.endsWith(".jpg")).toBe(true);
                                    huge = Buffer.alloc(5 * 1024 * 1024 + 1);
                                    return [4 /*yield*/, (0, vitest_1.expect)(store.saveMediaBuffer(huge)).rejects.toThrow("Media exceeds 5MB limit")];
                                case 5:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("copies local files and cleans old media", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempStore(function (store, home) { return __awaiter(void 0, void 0, void 0, function () {
                        var srcFile, saved, savedStat, past;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    srcFile = node_path_1.default.join(home, "tmp-src.txt");
                                    return [4 /*yield*/, promises_1.default.mkdir(home, { recursive: true })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(srcFile, "local file")];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, store.saveMediaSource(srcFile)];
                                case 3:
                                    saved = _a.sent();
                                    (0, vitest_1.expect)(saved.size).toBe(10);
                                    return [4 /*yield*/, promises_1.default.stat(saved.path)];
                                case 4:
                                    savedStat = _a.sent();
                                    (0, vitest_1.expect)(savedStat.isFile()).toBe(true);
                                    (0, vitest_1.expect)(node_path_1.default.extname(saved.path)).toBe(".txt");
                                    past = Date.now() - 10000;
                                    return [4 /*yield*/, promises_1.default.utimes(saved.path, past / 1000, past / 1000)];
                                case 5:
                                    _a.sent();
                                    return [4 /*yield*/, store.cleanOldMedia(1)];
                                case 6:
                                    _a.sent();
                                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.stat(saved.path)).rejects.toThrow()];
                                case 7:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sets correct mime for xlsx by extension", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempStore(function (store, home) { return __awaiter(void 0, void 0, void 0, function () {
                        var xlsxPath, saved;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    xlsxPath = node_path_1.default.join(home, "sheet.xlsx");
                                    return [4 /*yield*/, promises_1.default.mkdir(home, { recursive: true })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(xlsxPath, "not really an xlsx")];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, store.saveMediaSource(xlsxPath)];
                                case 3:
                                    saved = _a.sent();
                                    (0, vitest_1.expect)(saved.contentType).toBe("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                                    (0, vitest_1.expect)(node_path_1.default.extname(saved.path)).toBe(".xlsx");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("renames media based on detected mime even when extension is wrong", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempStore(function (store, home) { return __awaiter(void 0, void 0, void 0, function () {
                        var pngBytes, bogusExt, saved, buf;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, sharp_1.default)({
                                        create: { width: 2, height: 2, channels: 3, background: "#00ff00" },
                                    })
                                        .png()
                                        .toBuffer()];
                                case 1:
                                    pngBytes = _a.sent();
                                    bogusExt = node_path_1.default.join(home, "image-wrong.bin");
                                    return [4 /*yield*/, promises_1.default.writeFile(bogusExt, pngBytes)];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, store.saveMediaSource(bogusExt)];
                                case 3:
                                    saved = _a.sent();
                                    (0, vitest_1.expect)(saved.contentType).toBe("image/png");
                                    (0, vitest_1.expect)(node_path_1.default.extname(saved.path)).toBe(".png");
                                    return [4 /*yield*/, promises_1.default.readFile(saved.path)];
                                case 4:
                                    buf = _a.sent();
                                    (0, vitest_1.expect)(buf.equals(pngBytes)).toBe(true);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sniffs xlsx mime for zip buffers and renames extension", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempStore(function (store, home) { return __awaiter(void 0, void 0, void 0, function () {
                        var zip, fakeXlsx, bogusExt, saved;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    zip = new jszip_1.default();
                                    zip.file("[Content_Types].xml", '<Types><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/></Types>');
                                    zip.file("xl/workbook.xml", "<workbook/>");
                                    return [4 /*yield*/, zip.generateAsync({ type: "nodebuffer" })];
                                case 1:
                                    fakeXlsx = _a.sent();
                                    bogusExt = node_path_1.default.join(home, "sheet.bin");
                                    return [4 /*yield*/, promises_1.default.writeFile(bogusExt, fakeXlsx)];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, store.saveMediaSource(bogusExt)];
                                case 3:
                                    saved = _a.sent();
                                    (0, vitest_1.expect)(saved.contentType).toBe("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                                    (0, vitest_1.expect)(node_path_1.default.extname(saved.path)).toBe(".xlsx");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.describe)("extractOriginalFilename", function () {
        (0, vitest_1.it)("extracts original filename from embedded pattern", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, withTempStore(function (store) { return __awaiter(void 0, void 0, void 0, function () {
                            var filename, result;
                            return __generator(this, function (_a) {
                                filename = "report---a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf";
                                result = store.extractOriginalFilename("/path/to/".concat(filename));
                                (0, vitest_1.expect)(result).toBe("report.pdf");
                                return [2 /*return*/];
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("handles uppercase UUID pattern", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, withTempStore(function (store) { return __awaiter(void 0, void 0, void 0, function () {
                            var filename, result;
                            return __generator(this, function (_a) {
                                filename = "Document---A1B2C3D4-E5F6-7890-ABCD-EF1234567890.docx";
                                result = store.extractOriginalFilename("/media/inbound/".concat(filename));
                                (0, vitest_1.expect)(result).toBe("Document.docx");
                                return [2 /*return*/];
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("falls back to basename for non-matching patterns", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, withTempStore(function (store) { return __awaiter(void 0, void 0, void 0, function () {
                            var uuidOnly;
                            return __generator(this, function (_a) {
                                uuidOnly = "a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf";
                                (0, vitest_1.expect)(store.extractOriginalFilename("/path/".concat(uuidOnly))).toBe(uuidOnly);
                                // Regular filename without embedded pattern
                                (0, vitest_1.expect)(store.extractOriginalFilename("/path/to/regular.txt")).toBe("regular.txt");
                                // Filename with --- but invalid UUID part
                                (0, vitest_1.expect)(store.extractOriginalFilename("/path/to/foo---bar.txt")).toBe("foo---bar.txt");
                                return [2 /*return*/];
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("preserves original name with special characters", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, withTempStore(function (store) { return __awaiter(void 0, void 0, void 0, function () {
                            var filename, result;
                            return __generator(this, function (_a) {
                                filename = "报告_2024---a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf";
                                result = store.extractOriginalFilename("/media/".concat(filename));
                                (0, vitest_1.expect)(result).toBe("报告_2024.pdf");
                                return [2 /*return*/];
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("saveMediaBuffer with originalFilename", function () {
        (0, vitest_1.it)("embeds original filename in stored path when provided", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, withTempStore(function (store) { return __awaiter(void 0, void 0, void 0, function () {
                            var buf, saved, extracted;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        buf = Buffer.from("test content");
                                        return [4 /*yield*/, store.saveMediaBuffer(buf, "text/plain", "inbound", 5 * 1024 * 1024, "report.txt")];
                                    case 1:
                                        saved = _a.sent();
                                        // Should contain the original name and a UUID pattern
                                        (0, vitest_1.expect)(saved.id).toMatch(/^report---[a-f0-9-]{36}\.txt$/);
                                        (0, vitest_1.expect)(saved.path).toContain("report---");
                                        extracted = store.extractOriginalFilename(saved.path);
                                        (0, vitest_1.expect)(extracted).toBe("report.txt");
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("sanitizes unsafe characters in original filename", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, withTempStore(function (store) { return __awaiter(void 0, void 0, void 0, function () {
                            var buf, saved;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        buf = Buffer.from("test");
                                        return [4 /*yield*/, store.saveMediaBuffer(buf, "text/plain", "inbound", 5 * 1024 * 1024, "my<file>:test.txt")];
                                    case 1:
                                        saved = _a.sent();
                                        // Unsafe chars should be replaced with underscores
                                        (0, vitest_1.expect)(saved.id).toMatch(/^my_file_test---[a-f0-9-]{36}\.txt$/);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("truncates long original filenames", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, withTempStore(function (store) { return __awaiter(void 0, void 0, void 0, function () {
                            var buf, longName, saved, baseName;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        buf = Buffer.from("test");
                                        longName = "a".repeat(100) + ".txt";
                                        return [4 /*yield*/, store.saveMediaBuffer(buf, "text/plain", "inbound", 5 * 1024 * 1024, longName)];
                                    case 1:
                                        saved = _a.sent();
                                        baseName = node_path_1.default.parse(saved.id).name.split("---")[0];
                                        (0, vitest_1.expect)(baseName.length).toBeLessThanOrEqual(60);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("falls back to UUID-only when originalFilename not provided", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, withTempStore(function (store) { return __awaiter(void 0, void 0, void 0, function () {
                            var buf, saved;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        buf = Buffer.from("test");
                                        return [4 /*yield*/, store.saveMediaBuffer(buf, "text/plain", "inbound")];
                                    case 1:
                                        saved = _a.sent();
                                        // Should be UUID-only pattern (legacy behavior)
                                        (0, vitest_1.expect)(saved.id).toMatch(/^[a-f0-9-]{36}\.txt$/);
                                        (0, vitest_1.expect)(saved.id).not.toContain("---");
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
