"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Test setup file for nostr extension
var vitest_1 = require("vitest");
// Mock console.error to suppress noise in tests
vitest_1.vi.spyOn(console, "error").mockImplementation(function () { });
