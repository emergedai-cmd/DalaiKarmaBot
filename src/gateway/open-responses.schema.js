"use strict";
/**
 * OpenResponses API Zod Schemas
 *
 * Zod schemas for the OpenResponses `/v1/responses` endpoint.
 * This module is isolated from gateway imports to enable future codegen and prevent drift.
 *
 * @see https://www.open-responses.com/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputTextDoneEventSchema = exports.OutputTextDeltaEventSchema = exports.ContentPartDoneEventSchema = exports.ContentPartAddedEventSchema = exports.OutputItemDoneEventSchema = exports.OutputItemAddedEventSchema = exports.ResponseFailedEventSchema = exports.ResponseCompletedEventSchema = exports.ResponseInProgressEventSchema = exports.ResponseCreatedEventSchema = exports.ResponseResourceSchema = exports.UsageSchema = exports.OutputItemSchema = exports.ResponseStatusSchema = exports.CreateResponseBodySchema = exports.ToolChoiceSchema = exports.ToolDefinitionSchema = exports.FunctionToolDefinitionSchema = exports.ItemParamSchema = exports.ItemReferenceItemSchema = exports.ReasoningItemSchema = exports.FunctionCallOutputItemSchema = exports.FunctionCallItemSchema = exports.MessageItemSchema = exports.MessageItemRoleSchema = exports.ContentPartSchema = exports.InputFileContentPartSchema = exports.InputFileSourceSchema = exports.InputImageContentPartSchema = exports.InputImageSourceSchema = exports.OutputTextContentPartSchema = exports.InputTextContentPartSchema = void 0;
var zod_1 = require("zod");
// ─────────────────────────────────────────────────────────────────────────────
// Content Parts
// ─────────────────────────────────────────────────────────────────────────────
exports.InputTextContentPartSchema = zod_1.z
    .object({
    type: zod_1.z.literal("input_text"),
    text: zod_1.z.string(),
})
    .strict();
exports.OutputTextContentPartSchema = zod_1.z
    .object({
    type: zod_1.z.literal("output_text"),
    text: zod_1.z.string(),
})
    .strict();
// OpenResponses Image Content: Supports URL or base64 sources
exports.InputImageSourceSchema = zod_1.z.discriminatedUnion("type", [
    zod_1.z.object({
        type: zod_1.z.literal("url"),
        url: zod_1.z.string().url(),
    }),
    zod_1.z.object({
        type: zod_1.z.literal("base64"),
        media_type: zod_1.z.enum(["image/jpeg", "image/png", "image/gif", "image/webp"]),
        data: zod_1.z.string().min(1), // base64-encoded
    }),
]);
exports.InputImageContentPartSchema = zod_1.z
    .object({
    type: zod_1.z.literal("input_image"),
    source: exports.InputImageSourceSchema,
})
    .strict();
// OpenResponses File Content: Supports URL or base64 sources
exports.InputFileSourceSchema = zod_1.z.discriminatedUnion("type", [
    zod_1.z.object({
        type: zod_1.z.literal("url"),
        url: zod_1.z.string().url(),
    }),
    zod_1.z.object({
        type: zod_1.z.literal("base64"),
        media_type: zod_1.z.string().min(1), // MIME type
        data: zod_1.z.string().min(1), // base64-encoded
        filename: zod_1.z.string().optional(),
    }),
]);
exports.InputFileContentPartSchema = zod_1.z
    .object({
    type: zod_1.z.literal("input_file"),
    source: exports.InputFileSourceSchema,
})
    .strict();
exports.ContentPartSchema = zod_1.z.discriminatedUnion("type", [
    exports.InputTextContentPartSchema,
    exports.OutputTextContentPartSchema,
    exports.InputImageContentPartSchema,
    exports.InputFileContentPartSchema,
]);
// ─────────────────────────────────────────────────────────────────────────────
// Item Types (ItemParam)
// ─────────────────────────────────────────────────────────────────────────────
exports.MessageItemRoleSchema = zod_1.z.enum(["system", "developer", "user", "assistant"]);
exports.MessageItemSchema = zod_1.z
    .object({
    type: zod_1.z.literal("message"),
    role: exports.MessageItemRoleSchema,
    content: zod_1.z.union([zod_1.z.string(), zod_1.z.array(exports.ContentPartSchema)]),
})
    .strict();
exports.FunctionCallItemSchema = zod_1.z
    .object({
    type: zod_1.z.literal("function_call"),
    id: zod_1.z.string().optional(),
    call_id: zod_1.z.string().optional(),
    name: zod_1.z.string(),
    arguments: zod_1.z.string(),
})
    .strict();
exports.FunctionCallOutputItemSchema = zod_1.z
    .object({
    type: zod_1.z.literal("function_call_output"),
    call_id: zod_1.z.string(),
    output: zod_1.z.string(),
})
    .strict();
exports.ReasoningItemSchema = zod_1.z
    .object({
    type: zod_1.z.literal("reasoning"),
    content: zod_1.z.string().optional(),
    encrypted_content: zod_1.z.string().optional(),
    summary: zod_1.z.string().optional(),
})
    .strict();
exports.ItemReferenceItemSchema = zod_1.z
    .object({
    type: zod_1.z.literal("item_reference"),
    id: zod_1.z.string(),
})
    .strict();
exports.ItemParamSchema = zod_1.z.discriminatedUnion("type", [
    exports.MessageItemSchema,
    exports.FunctionCallItemSchema,
    exports.FunctionCallOutputItemSchema,
    exports.ReasoningItemSchema,
    exports.ItemReferenceItemSchema,
]);
// ─────────────────────────────────────────────────────────────────────────────
// Tool Definitions
// ─────────────────────────────────────────────────────────────────────────────
exports.FunctionToolDefinitionSchema = zod_1.z
    .object({
    type: zod_1.z.literal("function"),
    function: zod_1.z.object({
        name: zod_1.z.string().min(1, "Tool name cannot be empty"),
        description: zod_1.z.string().optional(),
        parameters: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    }),
})
    .strict();
// OpenResponses tool definitions match internal ToolDefinition structure
exports.ToolDefinitionSchema = exports.FunctionToolDefinitionSchema;
// ─────────────────────────────────────────────────────────────────────────────
// Request Body
// ─────────────────────────────────────────────────────────────────────────────
exports.ToolChoiceSchema = zod_1.z.union([
    zod_1.z.literal("auto"),
    zod_1.z.literal("none"),
    zod_1.z.literal("required"),
    zod_1.z.object({
        type: zod_1.z.literal("function"),
        function: zod_1.z.object({ name: zod_1.z.string() }),
    }),
]);
exports.CreateResponseBodySchema = zod_1.z
    .object({
    model: zod_1.z.string(),
    input: zod_1.z.union([zod_1.z.string(), zod_1.z.array(exports.ItemParamSchema)]),
    instructions: zod_1.z.string().optional(),
    tools: zod_1.z.array(exports.ToolDefinitionSchema).optional(),
    tool_choice: exports.ToolChoiceSchema.optional(),
    stream: zod_1.z.boolean().optional(),
    max_output_tokens: zod_1.z.number().int().positive().optional(),
    max_tool_calls: zod_1.z.number().int().positive().optional(),
    user: zod_1.z.string().optional(),
    // Phase 1: ignore but accept these fields
    temperature: zod_1.z.number().optional(),
    top_p: zod_1.z.number().optional(),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    store: zod_1.z.boolean().optional(),
    previous_response_id: zod_1.z.string().optional(),
    reasoning: zod_1.z
        .object({
        effort: zod_1.z.enum(["low", "medium", "high"]).optional(),
        summary: zod_1.z.enum(["auto", "concise", "detailed"]).optional(),
    })
        .optional(),
    truncation: zod_1.z.enum(["auto", "disabled"]).optional(),
})
    .strict();
// ─────────────────────────────────────────────────────────────────────────────
// Response Resource
// ─────────────────────────────────────────────────────────────────────────────
exports.ResponseStatusSchema = zod_1.z.enum([
    "in_progress",
    "completed",
    "failed",
    "cancelled",
    "incomplete",
]);
exports.OutputItemSchema = zod_1.z.discriminatedUnion("type", [
    zod_1.z
        .object({
        type: zod_1.z.literal("message"),
        id: zod_1.z.string(),
        role: zod_1.z.literal("assistant"),
        content: zod_1.z.array(exports.OutputTextContentPartSchema),
        status: zod_1.z.enum(["in_progress", "completed"]).optional(),
    })
        .strict(),
    zod_1.z
        .object({
        type: zod_1.z.literal("function_call"),
        id: zod_1.z.string(),
        call_id: zod_1.z.string(),
        name: zod_1.z.string(),
        arguments: zod_1.z.string(),
        status: zod_1.z.enum(["in_progress", "completed"]).optional(),
    })
        .strict(),
    zod_1.z
        .object({
        type: zod_1.z.literal("reasoning"),
        id: zod_1.z.string(),
        content: zod_1.z.string().optional(),
        summary: zod_1.z.string().optional(),
    })
        .strict(),
]);
exports.UsageSchema = zod_1.z.object({
    input_tokens: zod_1.z.number().int().nonnegative(),
    output_tokens: zod_1.z.number().int().nonnegative(),
    total_tokens: zod_1.z.number().int().nonnegative(),
});
exports.ResponseResourceSchema = zod_1.z.object({
    id: zod_1.z.string(),
    object: zod_1.z.literal("response"),
    created_at: zod_1.z.number().int(),
    status: exports.ResponseStatusSchema,
    model: zod_1.z.string(),
    output: zod_1.z.array(exports.OutputItemSchema),
    usage: exports.UsageSchema,
    // Optional fields for future phases
    error: zod_1.z
        .object({
        code: zod_1.z.string(),
        message: zod_1.z.string(),
    })
        .optional(),
});
// ─────────────────────────────────────────────────────────────────────────────
// Streaming Event Types
// ─────────────────────────────────────────────────────────────────────────────
exports.ResponseCreatedEventSchema = zod_1.z.object({
    type: zod_1.z.literal("response.created"),
    response: exports.ResponseResourceSchema,
});
exports.ResponseInProgressEventSchema = zod_1.z.object({
    type: zod_1.z.literal("response.in_progress"),
    response: exports.ResponseResourceSchema,
});
exports.ResponseCompletedEventSchema = zod_1.z.object({
    type: zod_1.z.literal("response.completed"),
    response: exports.ResponseResourceSchema,
});
exports.ResponseFailedEventSchema = zod_1.z.object({
    type: zod_1.z.literal("response.failed"),
    response: exports.ResponseResourceSchema,
});
exports.OutputItemAddedEventSchema = zod_1.z.object({
    type: zod_1.z.literal("response.output_item.added"),
    output_index: zod_1.z.number().int().nonnegative(),
    item: exports.OutputItemSchema,
});
exports.OutputItemDoneEventSchema = zod_1.z.object({
    type: zod_1.z.literal("response.output_item.done"),
    output_index: zod_1.z.number().int().nonnegative(),
    item: exports.OutputItemSchema,
});
exports.ContentPartAddedEventSchema = zod_1.z.object({
    type: zod_1.z.literal("response.content_part.added"),
    item_id: zod_1.z.string(),
    output_index: zod_1.z.number().int().nonnegative(),
    content_index: zod_1.z.number().int().nonnegative(),
    part: exports.OutputTextContentPartSchema,
});
exports.ContentPartDoneEventSchema = zod_1.z.object({
    type: zod_1.z.literal("response.content_part.done"),
    item_id: zod_1.z.string(),
    output_index: zod_1.z.number().int().nonnegative(),
    content_index: zod_1.z.number().int().nonnegative(),
    part: exports.OutputTextContentPartSchema,
});
exports.OutputTextDeltaEventSchema = zod_1.z.object({
    type: zod_1.z.literal("response.output_text.delta"),
    item_id: zod_1.z.string(),
    output_index: zod_1.z.number().int().nonnegative(),
    content_index: zod_1.z.number().int().nonnegative(),
    delta: zod_1.z.string(),
});
exports.OutputTextDoneEventSchema = zod_1.z.object({
    type: zod_1.z.literal("response.output_text.done"),
    item_id: zod_1.z.string(),
    output_index: zod_1.z.number().int().nonnegative(),
    content_index: zod_1.z.number().int().nonnegative(),
    text: zod_1.z.string(),
});
