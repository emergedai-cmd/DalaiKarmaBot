"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildChannelConfigSchema = buildChannelConfigSchema;
function buildChannelConfigSchema(schema) {
    return {
        schema: schema.toJSONSchema({
            target: "draft-07",
            unrepresentable: "any",
        }),
    };
}
