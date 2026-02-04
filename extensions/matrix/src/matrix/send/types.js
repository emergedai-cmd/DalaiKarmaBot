"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = exports.RelationType = exports.MsgType = void 0;
// Message types
exports.MsgType = {
    Text: "m.text",
    Image: "m.image",
    Audio: "m.audio",
    Video: "m.video",
    File: "m.file",
    Notice: "m.notice",
};
// Relation types
exports.RelationType = {
    Annotation: "m.annotation",
    Replace: "m.replace",
    Thread: "m.thread",
};
// Event types
exports.EventType = {
    Direct: "m.direct",
    Reaction: "m.reaction",
    RoomMessage: "m.room.message",
};
