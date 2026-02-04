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
var session_js_1 = require("./session.js");
function noteRunner() {
    var _this = this;
    return new session_js_1.WizardSession(function (prompter) { return __awaiter(_this, void 0, void 0, function () {
        var name;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prompter.note("Welcome")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, prompter.text({ message: "Name" })];
                case 2:
                    name = _a.sent();
                    return [4 /*yield*/, prompter.note("Hello ".concat(name))];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
(0, vitest_1.describe)("WizardSession", function () {
    (0, vitest_1.test)("steps progress in order", function () { return __awaiter(void 0, void 0, void 0, function () {
        var session, first, secondPeek, second, third, done;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    session = noteRunner();
                    return [4 /*yield*/, session.next()];
                case 1:
                    first = _f.sent();
                    (0, vitest_1.expect)(first.done).toBe(false);
                    (0, vitest_1.expect)((_a = first.step) === null || _a === void 0 ? void 0 : _a.type).toBe("note");
                    return [4 /*yield*/, session.next()];
                case 2:
                    secondPeek = _f.sent();
                    (0, vitest_1.expect)((_b = secondPeek.step) === null || _b === void 0 ? void 0 : _b.id).toBe((_c = first.step) === null || _c === void 0 ? void 0 : _c.id);
                    if (!first.step) {
                        throw new Error("expected first step");
                    }
                    return [4 /*yield*/, session.answer(first.step.id, null)];
                case 3:
                    _f.sent();
                    return [4 /*yield*/, session.next()];
                case 4:
                    second = _f.sent();
                    (0, vitest_1.expect)(second.done).toBe(false);
                    (0, vitest_1.expect)((_d = second.step) === null || _d === void 0 ? void 0 : _d.type).toBe("text");
                    if (!second.step) {
                        throw new Error("expected second step");
                    }
                    return [4 /*yield*/, session.answer(second.step.id, "Peter")];
                case 5:
                    _f.sent();
                    return [4 /*yield*/, session.next()];
                case 6:
                    third = _f.sent();
                    (0, vitest_1.expect)((_e = third.step) === null || _e === void 0 ? void 0 : _e.type).toBe("note");
                    if (!third.step) {
                        throw new Error("expected third step");
                    }
                    return [4 /*yield*/, session.answer(third.step.id, null)];
                case 7:
                    _f.sent();
                    return [4 /*yield*/, session.next()];
                case 8:
                    done = _f.sent();
                    (0, vitest_1.expect)(done.done).toBe(true);
                    (0, vitest_1.expect)(done.status).toBe("done");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("invalid answers throw", function () { return __awaiter(void 0, void 0, void 0, function () {
        var session, first;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    session = noteRunner();
                    return [4 /*yield*/, session.next()];
                case 1:
                    first = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(session.answer("bad-id", null)).rejects.toThrow(/wizard: no pending step/i)];
                case 2:
                    _a.sent();
                    if (!first.step) {
                        throw new Error("expected first step");
                    }
                    return [4 /*yield*/, session.answer(first.step.id, null)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("cancel marks session and unblocks", function () { return __awaiter(void 0, void 0, void 0, function () {
        var session, step, done;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    session = new session_js_1.WizardSession(function (prompter) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, prompter.text({ message: "Name" })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, session.next()];
                case 1:
                    step = _b.sent();
                    (0, vitest_1.expect)((_a = step.step) === null || _a === void 0 ? void 0 : _a.type).toBe("text");
                    session.cancel();
                    return [4 /*yield*/, session.next()];
                case 2:
                    done = _b.sent();
                    (0, vitest_1.expect)(done.done).toBe(true);
                    (0, vitest_1.expect)(done.status).toBe("cancelled");
                    return [2 /*return*/];
            }
        });
    }); });
});
