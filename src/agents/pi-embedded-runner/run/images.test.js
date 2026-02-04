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
var images_js_1 = require("./images.js");
(0, vitest_1.describe)("detectImageReferences", function () {
    (0, vitest_1.it)("detects absolute file paths with common extensions", function () {
        var prompt = "Check this image /path/to/screenshot.png and tell me what you see";
        var refs = (0, images_js_1.detectImageReferences)(prompt);
        (0, vitest_1.expect)(refs).toHaveLength(1);
        (0, vitest_1.expect)(refs[0]).toEqual({
            raw: "/path/to/screenshot.png",
            type: "path",
            resolved: "/path/to/screenshot.png",
        });
    });
    (0, vitest_1.it)("detects relative paths starting with ./", function () {
        var _a, _b;
        var prompt = "Look at ./images/photo.jpg";
        var refs = (0, images_js_1.detectImageReferences)(prompt);
        (0, vitest_1.expect)(refs).toHaveLength(1);
        (0, vitest_1.expect)((_a = refs[0]) === null || _a === void 0 ? void 0 : _a.raw).toBe("./images/photo.jpg");
        (0, vitest_1.expect)((_b = refs[0]) === null || _b === void 0 ? void 0 : _b.type).toBe("path");
    });
    (0, vitest_1.it)("detects relative paths starting with ../", function () {
        var _a, _b;
        var prompt = "The file is at ../screenshots/test.jpeg";
        var refs = (0, images_js_1.detectImageReferences)(prompt);
        (0, vitest_1.expect)(refs).toHaveLength(1);
        (0, vitest_1.expect)((_a = refs[0]) === null || _a === void 0 ? void 0 : _a.raw).toBe("../screenshots/test.jpeg");
        (0, vitest_1.expect)((_b = refs[0]) === null || _b === void 0 ? void 0 : _b.type).toBe("path");
    });
    (0, vitest_1.it)("detects home directory paths starting with ~/", function () {
        var _a, _b, _c, _d;
        var prompt = "My photo is at ~/Pictures/vacation.png";
        var refs = (0, images_js_1.detectImageReferences)(prompt);
        (0, vitest_1.expect)(refs).toHaveLength(1);
        (0, vitest_1.expect)((_a = refs[0]) === null || _a === void 0 ? void 0 : _a.raw).toBe("~/Pictures/vacation.png");
        (0, vitest_1.expect)((_b = refs[0]) === null || _b === void 0 ? void 0 : _b.type).toBe("path");
        // Resolved path should expand ~
        (0, vitest_1.expect)((_d = (_c = refs[0]) === null || _c === void 0 ? void 0 : _c.resolved) === null || _d === void 0 ? void 0 : _d.startsWith("~")).toBe(false);
    });
    (0, vitest_1.it)("detects multiple image references in a prompt", function () {
        var prompt = "\n      Compare these two images:\n      1. /home/user/photo1.png\n      2. https://mysite.com/photo2.jpg\n    ";
        var refs = (0, images_js_1.detectImageReferences)(prompt);
        (0, vitest_1.expect)(refs).toHaveLength(1);
        (0, vitest_1.expect)(refs.some(function (r) { return r.type === "path"; })).toBe(true);
        (0, vitest_1.expect)(refs.some(function (r) { return r.type === "url"; })).toBe(false);
    });
    (0, vitest_1.it)("handles various image extensions", function () {
        var _a;
        var extensions = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "tiff", "heic"];
        for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
            var ext = extensions_1[_i];
            var prompt_1 = "Image: /test/image.".concat(ext);
            var refs = (0, images_js_1.detectImageReferences)(prompt_1);
            (0, vitest_1.expect)(refs.length).toBeGreaterThanOrEqual(1);
            (0, vitest_1.expect)((_a = refs[0]) === null || _a === void 0 ? void 0 : _a.raw).toContain(".".concat(ext));
        }
    });
    (0, vitest_1.it)("deduplicates repeated image references", function () {
        var prompt = "Look at /path/image.png and also /path/image.png again";
        var refs = (0, images_js_1.detectImageReferences)(prompt);
        (0, vitest_1.expect)(refs).toHaveLength(1);
    });
    (0, vitest_1.it)("returns empty array when no images found", function () {
        var prompt = "Just some text without any image references";
        var refs = (0, images_js_1.detectImageReferences)(prompt);
        (0, vitest_1.expect)(refs).toHaveLength(0);
    });
    (0, vitest_1.it)("ignores non-image file extensions", function () {
        var prompt = "Check /path/to/document.pdf and /code/file.ts";
        var refs = (0, images_js_1.detectImageReferences)(prompt);
        (0, vitest_1.expect)(refs).toHaveLength(0);
    });
    (0, vitest_1.it)("handles paths inside quotes (without spaces)", function () {
        var _a;
        var prompt = 'The file is at "/path/to/image.png"';
        var refs = (0, images_js_1.detectImageReferences)(prompt);
        (0, vitest_1.expect)(refs).toHaveLength(1);
        (0, vitest_1.expect)((_a = refs[0]) === null || _a === void 0 ? void 0 : _a.raw).toBe("/path/to/image.png");
    });
    (0, vitest_1.it)("handles paths in parentheses", function () {
        var _a;
        var prompt = "See the image (./screenshot.png) for details";
        var refs = (0, images_js_1.detectImageReferences)(prompt);
        (0, vitest_1.expect)(refs).toHaveLength(1);
        (0, vitest_1.expect)((_a = refs[0]) === null || _a === void 0 ? void 0 : _a.raw).toBe("./screenshot.png");
    });
    (0, vitest_1.it)("detects [Image: source: ...] format from messaging systems", function () {
        var _a, _b;
        var prompt = "What does this image show?\n[Image: source: /Users/tyleryust/Library/Messages/Attachments/IMG_0043.jpeg]";
        var refs = (0, images_js_1.detectImageReferences)(prompt);
        (0, vitest_1.expect)(refs).toHaveLength(1);
        (0, vitest_1.expect)((_a = refs[0]) === null || _a === void 0 ? void 0 : _a.raw).toBe("/Users/tyleryust/Library/Messages/Attachments/IMG_0043.jpeg");
        (0, vitest_1.expect)((_b = refs[0]) === null || _b === void 0 ? void 0 : _b.type).toBe("path");
    });
    (0, vitest_1.it)("handles complex message attachment paths", function () {
        var _a;
        var prompt = "[Image: source: /Users/tyleryust/Library/Messages/Attachments/23/03/AA4726EA-DB27-4269-BA56-1436936CC134/5E3E286A-F585-4E5E-9043-5BC2AFAFD81BIMG_0043.jpeg]";
        var refs = (0, images_js_1.detectImageReferences)(prompt);
        (0, vitest_1.expect)(refs).toHaveLength(1);
        (0, vitest_1.expect)((_a = refs[0]) === null || _a === void 0 ? void 0 : _a.resolved).toContain("IMG_0043.jpeg");
    });
    (0, vitest_1.it)("detects multiple images in [media attached: ...] format", function () {
        var _a, _b;
        // Multi-file format uses separate brackets on separate lines
        var prompt = "[media attached: 2 files]\n[media attached 1/2: /Users/tyleryust/.openclaw/media/IMG_6430.jpeg (image/jpeg)]\n[media attached 2/2: /Users/tyleryust/.openclaw/media/IMG_6431.jpeg (image/jpeg)]\nwhat about these images?";
        var refs = (0, images_js_1.detectImageReferences)(prompt);
        (0, vitest_1.expect)(refs).toHaveLength(2);
        (0, vitest_1.expect)((_a = refs[0]) === null || _a === void 0 ? void 0 : _a.resolved).toContain("IMG_6430.jpeg");
        (0, vitest_1.expect)((_b = refs[1]) === null || _b === void 0 ? void 0 : _b.resolved).toContain("IMG_6431.jpeg");
    });
    (0, vitest_1.it)("does not double-count path and url in same bracket", function () {
        var _a;
        // Single file with URL (| separates path from url, not multiple files)
        var prompt = "[media attached: /cache/IMG_6430.jpeg (image/jpeg) | /cache/IMG_6430.jpeg]";
        var refs = (0, images_js_1.detectImageReferences)(prompt);
        (0, vitest_1.expect)(refs).toHaveLength(1);
        (0, vitest_1.expect)((_a = refs[0]) === null || _a === void 0 ? void 0 : _a.resolved).toContain("IMG_6430.jpeg");
    });
    (0, vitest_1.it)("ignores remote URLs entirely (local-only)", function () {
        var _a;
        var prompt = "To send an image: MEDIA:https://example.com/image.jpg\nHere is my actual image: /path/to/real.png\nAlso https://cdn.mysite.com/img.jpg";
        var refs = (0, images_js_1.detectImageReferences)(prompt);
        (0, vitest_1.expect)(refs).toHaveLength(1);
        (0, vitest_1.expect)((_a = refs[0]) === null || _a === void 0 ? void 0 : _a.raw).toBe("/path/to/real.png");
    });
    (0, vitest_1.it)("handles single file format with URL (no index)", function () {
        var _a;
        var prompt = "[media attached: /cache/photo.jpeg (image/jpeg) | https://example.com/url]\nwhat is this?";
        var refs = (0, images_js_1.detectImageReferences)(prompt);
        (0, vitest_1.expect)(refs).toHaveLength(1);
        (0, vitest_1.expect)((_a = refs[0]) === null || _a === void 0 ? void 0 : _a.resolved).toContain("photo.jpeg");
    });
    (0, vitest_1.it)("handles paths with spaces in filename", function () {
        var _a;
        // URL after | is https, not a local path, so only the local path should be detected
        var prompt = "[media attached: /Users/test/.openclaw/media/ChatGPT Image Apr 21, 2025.png (image/png) | https://example.com/same.png]\nwhat is this?";
        var refs = (0, images_js_1.detectImageReferences)(prompt);
        // Only 1 ref - the local path (example.com URLs are skipped)
        (0, vitest_1.expect)(refs).toHaveLength(1);
        (0, vitest_1.expect)((_a = refs[0]) === null || _a === void 0 ? void 0 : _a.resolved).toContain("ChatGPT Image Apr 21, 2025.png");
    });
});
(0, vitest_1.describe)("modelSupportsImages", function () {
    (0, vitest_1.it)("returns true when model input includes image", function () {
        var model = { input: ["text", "image"] };
        (0, vitest_1.expect)((0, images_js_1.modelSupportsImages)(model)).toBe(true);
    });
    (0, vitest_1.it)("returns false when model input does not include image", function () {
        var model = { input: ["text"] };
        (0, vitest_1.expect)((0, images_js_1.modelSupportsImages)(model)).toBe(false);
    });
    (0, vitest_1.it)("returns false when model input is undefined", function () {
        var model = {};
        (0, vitest_1.expect)((0, images_js_1.modelSupportsImages)(model)).toBe(false);
    });
    (0, vitest_1.it)("returns false when model input is empty", function () {
        var model = { input: [] };
        (0, vitest_1.expect)((0, images_js_1.modelSupportsImages)(model)).toBe(false);
    });
});
(0, vitest_1.describe)("detectAndLoadPromptImages", function () {
    (0, vitest_1.it)("returns no images for non-vision models even when existing images are provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, images_js_1.detectAndLoadPromptImages)({
                        prompt: "ignore",
                        workspaceDir: "/tmp",
                        model: { input: ["text"] },
                        existingImages: [{ type: "image", data: "abc", mimeType: "image/png" }],
                    })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.images).toHaveLength(0);
                    (0, vitest_1.expect)(result.detectedRefs).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips history messages that already include image content", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, images_js_1.detectAndLoadPromptImages)({
                        prompt: "no images here",
                        workspaceDir: "/tmp",
                        model: { input: ["text", "image"] },
                        historyMessages: [
                            {
                                role: "user",
                                content: [
                                    { type: "text", text: "See /tmp/should-not-load.png" },
                                    { type: "image", data: "abc", mimeType: "image/png" },
                                ],
                            },
                        ],
                    })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.detectedRefs).toHaveLength(0);
                    (0, vitest_1.expect)(result.images).toHaveLength(0);
                    (0, vitest_1.expect)(result.historyImagesByIndex.size).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
});
