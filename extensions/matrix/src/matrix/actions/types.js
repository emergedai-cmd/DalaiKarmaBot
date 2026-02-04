"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = exports.RelationType = exports.MsgType = void 0;
exports.MsgType = {
    Text: "m.text",
};
exports.RelationType = {
    Replace: "m.replace",
    Annotation: "m.annotation",
};
exports.EventType = {
    RoomMessage: "m.room.message",
    RoomPinnedEvents: "m.room.pinned_events",
    RoomTopic: "m.room.topic",
    Reaction: "m.reaction",
};
