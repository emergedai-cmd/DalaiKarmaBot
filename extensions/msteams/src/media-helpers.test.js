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
var vitest_1 = require("vitest");
var media_helpers_js_1 = require("./media-helpers.js");
(0, vitest_1.describe)("msteams media-helpers", function () {
    (0, vitest_1.describe)("getMimeType", function () {
        (0, vitest_1.it)("detects png from URL", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("https://example.com/image.png")];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe("image/png");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("detects jpeg from URL (both extensions)", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("https://example.com/photo.jpg")];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).toBe("image/jpeg");
                        _b = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("https://example.com/photo.jpeg")];
                    case 2:
                        _b.apply(void 0, [_c.sent()]).toBe("image/jpeg");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("detects gif from URL", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("https://example.com/anim.gif")];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe("image/gif");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("detects webp from URL", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("https://example.com/modern.webp")];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe("image/webp");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("handles URLs with query strings", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("https://example.com/image.png?v=123")];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe("image/png");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("handles data URLs", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("data:image/png;base64,iVBORw0KGgo=")];
                    case 1:
                        _a.apply(void 0, [_d.sent()]).toBe("image/png");
                        _b = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("data:image/jpeg;base64,/9j/4AAQ")];
                    case 2:
                        _b.apply(void 0, [_d.sent()]).toBe("image/jpeg");
                        _c = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("data:image/gif;base64,R0lGOD")];
                    case 3:
                        _c.apply(void 0, [_d.sent()]).toBe("image/gif");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("handles data URLs without base64", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("data:image/svg+xml,%3Csvg")];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe("image/svg+xml");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("handles local paths", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("/tmp/image.png")];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).toBe("image/png");
                        _b = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("/Users/test/photo.jpg")];
                    case 2:
                        _b.apply(void 0, [_c.sent()]).toBe("image/jpeg");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("handles tilde paths", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("~/Downloads/image.gif")];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe("image/gif");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("defaults to application/octet-stream for unknown extensions", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("https://example.com/image")];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).toBe("application/octet-stream");
                        _b = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("https://example.com/image.unknown")];
                    case 2:
                        _b.apply(void 0, [_c.sent()]).toBe("application/octet-stream");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("is case-insensitive", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("https://example.com/IMAGE.PNG")];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).toBe("image/png");
                        _b = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("https://example.com/Photo.JPEG")];
                    case 2:
                        _b.apply(void 0, [_c.sent()]).toBe("image/jpeg");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("detects document types", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("https://example.com/doc.pdf")];
                    case 1:
                        _a.apply(void 0, [_d.sent()]).toBe("application/pdf");
                        _b = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("https://example.com/doc.docx")];
                    case 2:
                        _b.apply(void 0, [_d.sent()]).toBe("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                        _c = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)("https://example.com/spreadsheet.xlsx")];
                    case 3:
                        _c.apply(void 0, [_d.sent()]).toBe("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("extractFilename", function () {
        (0, vitest_1.it)("extracts filename from URL with extension", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.extractFilename)("https://example.com/photo.jpg")];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe("photo.jpg");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("extracts filename from URL with path", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.extractFilename)("https://example.com/images/2024/photo.png")];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe("photo.png");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("handles URLs without extension by deriving from MIME", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Now defaults to application/octet-stream → .bin fallback
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.extractFilename)("https://example.com/images/photo")];
                    case 1:
                        // Now defaults to application/octet-stream → .bin fallback
                        _a.apply(void 0, [_b.sent()]).toBe("photo.bin");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("handles data URLs", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.extractFilename)("data:image/png;base64,iVBORw0KGgo=")];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).toBe("image.png");
                        _b = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.extractFilename)("data:image/jpeg;base64,/9j/4AAQ")];
                    case 2:
                        _b.apply(void 0, [_c.sent()]).toBe("image.jpg");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("handles document data URLs", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.extractFilename)("data:application/pdf;base64,JVBERi0")];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe("file.pdf");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("handles local paths", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.extractFilename)("/tmp/screenshot.png")];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).toBe("screenshot.png");
                        _b = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.extractFilename)("/Users/test/photo.jpg")];
                    case 2:
                        _b.apply(void 0, [_c.sent()]).toBe("photo.jpg");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("handles tilde paths", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.extractFilename)("~/Downloads/image.gif")];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe("image.gif");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("returns fallback for empty URL", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.extractFilename)("")];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe("file.bin");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("extracts original filename from embedded pattern", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Pattern: {original}---{uuid}.{ext}
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.extractFilename)("/media/inbound/report---a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf")];
                    case 1:
                        // Pattern: {original}---{uuid}.{ext}
                        _a.apply(void 0, [_b.sent()]).toBe("report.pdf");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("extracts original filename with uppercase UUID", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.extractFilename)("/media/inbound/Document---A1B2C3D4-E5F6-7890-ABCD-EF1234567890.docx")];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe("Document.docx");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("falls back to UUID filename for legacy paths", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // UUID-only filename (legacy format, no embedded name)
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.extractFilename)("/media/inbound/a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf")];
                    case 1:
                        // UUID-only filename (legacy format, no embedded name)
                        _a.apply(void 0, [_b.sent()]).toBe("a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("handles --- in filename without valid UUID pattern", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // foo---bar.txt (bar is not a valid UUID)
                        _a = vitest_1.expect;
                        return [4 /*yield*/, (0, media_helpers_js_1.extractFilename)("/media/inbound/foo---bar.txt")];
                    case 1:
                        // foo---bar.txt (bar is not a valid UUID)
                        _a.apply(void 0, [_b.sent()]).toBe("foo---bar.txt");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("isLocalPath", function () {
        (0, vitest_1.it)("returns true for file:// URLs", function () {
            (0, vitest_1.expect)((0, media_helpers_js_1.isLocalPath)("file:///tmp/image.png")).toBe(true);
            (0, vitest_1.expect)((0, media_helpers_js_1.isLocalPath)("file://localhost/tmp/image.png")).toBe(true);
        });
        (0, vitest_1.it)("returns true for absolute paths", function () {
            (0, vitest_1.expect)((0, media_helpers_js_1.isLocalPath)("/tmp/image.png")).toBe(true);
            (0, vitest_1.expect)((0, media_helpers_js_1.isLocalPath)("/Users/test/photo.jpg")).toBe(true);
        });
        (0, vitest_1.it)("returns true for tilde paths", function () {
            (0, vitest_1.expect)((0, media_helpers_js_1.isLocalPath)("~/Downloads/image.png")).toBe(true);
        });
        (0, vitest_1.it)("returns false for http URLs", function () {
            (0, vitest_1.expect)((0, media_helpers_js_1.isLocalPath)("http://example.com/image.png")).toBe(false);
            (0, vitest_1.expect)((0, media_helpers_js_1.isLocalPath)("https://example.com/image.png")).toBe(false);
        });
        (0, vitest_1.it)("returns false for data URLs", function () {
            (0, vitest_1.expect)((0, media_helpers_js_1.isLocalPath)("data:image/png;base64,iVBORw0KGgo=")).toBe(false);
        });
    });
    (0, vitest_1.describe)("extractMessageId", function () {
        (0, vitest_1.it)("extracts id from valid response", function () {
            (0, vitest_1.expect)((0, media_helpers_js_1.extractMessageId)({ id: "msg123" })).toBe("msg123");
        });
        (0, vitest_1.it)("returns null for missing id", function () {
            (0, vitest_1.expect)((0, media_helpers_js_1.extractMessageId)({ foo: "bar" })).toBeNull();
        });
        (0, vitest_1.it)("returns null for empty id", function () {
            (0, vitest_1.expect)((0, media_helpers_js_1.extractMessageId)({ id: "" })).toBeNull();
        });
        (0, vitest_1.it)("returns null for non-string id", function () {
            (0, vitest_1.expect)((0, media_helpers_js_1.extractMessageId)({ id: 123 })).toBeNull();
            (0, vitest_1.expect)((0, media_helpers_js_1.extractMessageId)({ id: null })).toBeNull();
        });
        (0, vitest_1.it)("returns null for null response", function () {
            (0, vitest_1.expect)((0, media_helpers_js_1.extractMessageId)(null)).toBeNull();
        });
        (0, vitest_1.it)("returns null for undefined response", function () {
            (0, vitest_1.expect)((0, media_helpers_js_1.extractMessageId)(undefined)).toBeNull();
        });
        (0, vitest_1.it)("returns null for non-object response", function () {
            (0, vitest_1.expect)((0, media_helpers_js_1.extractMessageId)("string")).toBeNull();
            (0, vitest_1.expect)((0, media_helpers_js_1.extractMessageId)(123)).toBeNull();
        });
    });
});
