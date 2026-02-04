"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBunRuntime = isBunRuntime;
function isBunRuntime() {
    var versions = process.versions;
    return typeof versions.bun === "string";
}
