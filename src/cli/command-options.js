"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasExplicitOptions = hasExplicitOptions;
function hasExplicitOptions(command, names) {
    if (typeof command.getOptionValueSource !== "function") {
        return false;
    }
    return names.some(function (name) { return command.getOptionValueSource(name) === "cli"; });
}
