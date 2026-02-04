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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getA2uiPaths = getA2uiPaths;
exports.copyA2uiAssets = copyA2uiAssets;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var repoRoot = node_path_1.default.resolve(node_path_1.default.dirname((0, node_url_1.fileURLToPath)(import.meta.url)), "..");
function getA2uiPaths(env) {
    var _a, _b;
    if (env === void 0) { env = process.env; }
    var srcDir = (_a = env.OPENCLAW_A2UI_SRC_DIR) !== null && _a !== void 0 ? _a : node_path_1.default.join(repoRoot, "src", "canvas-host", "a2ui");
    var outDir = (_b = env.OPENCLAW_A2UI_OUT_DIR) !== null && _b !== void 0 ? _b : node_path_1.default.join(repoRoot, "dist", "canvas-host", "a2ui");
    return { srcDir: srcDir, outDir: outDir };
}
function copyA2uiAssets(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var skipMissing, err_1, message;
        var srcDir = _b.srcDir, outDir = _b.outDir;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    skipMissing = process.env.OPENCLAW_A2UI_SKIP_MISSING === "1";
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, promises_1.default.stat(node_path_1.default.join(srcDir, "index.html"))];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.stat(node_path_1.default.join(srcDir, "a2ui.bundle.js"))];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _c.sent();
                    message = 'Missing A2UI bundle assets. Run "pnpm canvas:a2ui:bundle" and retry.';
                    if (skipMissing) {
                        console.warn("".concat(message, " Skipping copy (OPENCLAW_A2UI_SKIP_MISSING=1)."));
                        return [2 /*return*/];
                    }
                    throw new Error(message, { cause: err_1 });
                case 5: return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(outDir), { recursive: true })];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.cp(srcDir, outDir, { recursive: true })];
                case 7:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, srcDir, outDir;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = getA2uiPaths(), srcDir = _a.srcDir, outDir = _a.outDir;
                    return [4 /*yield*/, copyA2uiAssets({ srcDir: srcDir, outDir: outDir })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
if (import.meta.url === (0, node_url_1.pathToFileURL)((_a = process.argv[1]) !== null && _a !== void 0 ? _a : "").href) {
    main().catch(function (err) {
        console.error(String(err));
        process.exit(1);
    });
}
