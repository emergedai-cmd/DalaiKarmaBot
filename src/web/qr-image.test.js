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
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var qr_image_js_1 = require("./qr-image.js");
(0, vitest_1.describe)("renderQrPngBase64", function () {
    (0, vitest_1.it)("renders a PNG data payload", function () { return __awaiter(void 0, void 0, void 0, function () {
        var b64, buf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, qr_image_js_1.renderQrPngBase64)("openclaw")];
                case 1:
                    b64 = _a.sent();
                    buf = Buffer.from(b64, "base64");
                    (0, vitest_1.expect)(buf.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("avoids dynamic require of qrcode-terminal vendor modules", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sourcePath, source;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sourcePath = (0, node_path_1.resolve)(process.cwd(), "src/web/qr-image.ts");
                    return [4 /*yield*/, (0, promises_1.readFile)(sourcePath, "utf-8")];
                case 1:
                    source = _a.sent();
                    (0, vitest_1.expect)(source).not.toContain("createRequire(");
                    (0, vitest_1.expect)(source).not.toContain('require("qrcode-terminal/vendor/QRCode")');
                    (0, vitest_1.expect)(source).toContain("qrcode-terminal/vendor/QRCode/index.js");
                    (0, vitest_1.expect)(source).toContain("qrcode-terminal/vendor/QRCode/QRErrorCorrectLevel.js");
                    return [2 /*return*/];
            }
        });
    }); });
});
