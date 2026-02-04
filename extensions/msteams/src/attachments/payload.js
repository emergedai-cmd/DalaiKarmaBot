"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMSTeamsMediaPayload = buildMSTeamsMediaPayload;
function buildMSTeamsMediaPayload(mediaList) {
    var first = mediaList[0];
    var mediaPaths = mediaList.map(function (media) { return media.path; });
    var mediaTypes = mediaList.map(function (media) { var _a; return (_a = media.contentType) !== null && _a !== void 0 ? _a : ""; });
    return {
        MediaPath: first === null || first === void 0 ? void 0 : first.path,
        MediaType: first === null || first === void 0 ? void 0 : first.contentType,
        MediaUrl: first === null || first === void 0 ? void 0 : first.path,
        MediaPaths: mediaPaths.length > 0 ? mediaPaths : undefined,
        MediaUrls: mediaPaths.length > 0 ? mediaPaths : undefined,
        MediaTypes: mediaPaths.length > 0 ? mediaTypes : undefined,
    };
}
