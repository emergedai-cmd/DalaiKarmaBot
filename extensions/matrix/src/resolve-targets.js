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
exports.resolveMatrixTargets = resolveMatrixTargets;
var directory_live_js_1 = require("./directory-live.js");
function pickBestGroupMatch(matches, query) {
    if (matches.length === 0) {
        return undefined;
    }
    var normalized = query.trim().toLowerCase();
    if (normalized) {
        var exact = matches.find(function (match) {
            var _a, _b;
            var name = (_a = match.name) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
            var handle = (_b = match.handle) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase();
            var id = match.id.trim().toLowerCase();
            return name === normalized || handle === normalized || id === normalized;
        });
        if (exact) {
            return exact;
        }
    }
    return matches[0];
}
function resolveMatrixTargets(params) {
    return __awaiter(this, void 0, void 0, function () {
        var results, _i, _a, input, trimmed, matches, best, err_1, matches, best, err_2;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    results = [];
                    _i = 0, _a = params.inputs;
                    _f.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 10];
                    input = _a[_i];
                    trimmed = input.trim();
                    if (!trimmed) {
                        results.push({ input: input, resolved: false, note: "empty input" });
                        return [3 /*break*/, 9];
                    }
                    if (!(params.kind === "user")) return [3 /*break*/, 6];
                    if (trimmed.startsWith("@") && trimmed.includes(":")) {
                        results.push({ input: input, resolved: true, id: trimmed });
                        return [3 /*break*/, 9];
                    }
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, directory_live_js_1.listMatrixDirectoryPeersLive)({
                            cfg: params.cfg,
                            query: trimmed,
                            limit: 5,
                        })];
                case 3:
                    matches = _f.sent();
                    best = matches[0];
                    results.push({
                        input: input,
                        resolved: Boolean(best === null || best === void 0 ? void 0 : best.id),
                        id: best === null || best === void 0 ? void 0 : best.id,
                        name: best === null || best === void 0 ? void 0 : best.name,
                        note: matches.length > 1 ? "multiple matches; chose first" : undefined,
                    });
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _f.sent();
                    (_c = (_b = params.runtime) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.call(_b, "matrix resolve failed: ".concat(String(err_1)));
                    results.push({ input: input, resolved: false, note: "lookup failed" });
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 9];
                case 6:
                    _f.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, (0, directory_live_js_1.listMatrixDirectoryGroupsLive)({
                            cfg: params.cfg,
                            query: trimmed,
                            limit: 5,
                        })];
                case 7:
                    matches = _f.sent();
                    best = pickBestGroupMatch(matches, trimmed);
                    results.push({
                        input: input,
                        resolved: Boolean(best === null || best === void 0 ? void 0 : best.id),
                        id: best === null || best === void 0 ? void 0 : best.id,
                        name: best === null || best === void 0 ? void 0 : best.name,
                        note: matches.length > 1 ? "multiple matches; chose first" : undefined,
                    });
                    return [3 /*break*/, 9];
                case 8:
                    err_2 = _f.sent();
                    (_e = (_d = params.runtime) === null || _d === void 0 ? void 0 : _d.error) === null || _e === void 0 ? void 0 : _e.call(_d, "matrix resolve failed: ".concat(String(err_2)));
                    results.push({ input: input, resolved: false, note: "lookup failed" });
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 1];
                case 10: return [2 /*return*/, results];
            }
        });
    });
}
