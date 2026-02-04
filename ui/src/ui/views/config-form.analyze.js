"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeConfigSchema = analyzeConfigSchema;
var config_form_shared_1 = require("./config-form.shared");
var META_KEYS = new Set(["title", "description", "default", "nullable"]);
function isAnySchema(schema) {
    var keys = Object.keys(schema !== null && schema !== void 0 ? schema : {}).filter(function (key) { return !META_KEYS.has(key); });
    return keys.length === 0;
}
function normalizeEnum(values) {
    var filtered = values.filter(function (value) { return value != null; });
    var nullable = filtered.length !== values.length;
    var enumValues = [];
    var _loop_1 = function (value) {
        if (!enumValues.some(function (existing) { return Object.is(existing, value); })) {
            enumValues.push(value);
        }
    };
    for (var _i = 0, filtered_1 = filtered; _i < filtered_1.length; _i++) {
        var value = filtered_1[_i];
        _loop_1(value);
    }
    return { enumValues: enumValues, nullable: nullable };
}
function analyzeConfigSchema(raw) {
    if (!raw || typeof raw !== "object") {
        return { schema: null, unsupportedPaths: ["<root>"] };
    }
    return normalizeSchemaNode(raw, []);
}
function normalizeSchemaNode(schema, path) {
    var _a, _b, _c, _d;
    var unsupported = new Set();
    var normalized = __assign({}, schema);
    var pathLabel = (0, config_form_shared_1.pathKey)(path) || "<root>";
    if (schema.anyOf || schema.oneOf || schema.allOf) {
        var union = normalizeUnion(schema, path);
        if (union) {
            return union;
        }
        return { schema: schema, unsupportedPaths: [pathLabel] };
    }
    var nullable = Array.isArray(schema.type) && schema.type.includes("null");
    var type = (_a = (0, config_form_shared_1.schemaType)(schema)) !== null && _a !== void 0 ? _a : (schema.properties || schema.additionalProperties ? "object" : undefined);
    normalized.type = type !== null && type !== void 0 ? type : schema.type;
    normalized.nullable = nullable || schema.nullable;
    if (normalized.enum) {
        var _e = normalizeEnum(normalized.enum), enumValues = _e.enumValues, enumNullable = _e.nullable;
        normalized.enum = enumValues;
        if (enumNullable) {
            normalized.nullable = true;
        }
        if (enumValues.length === 0) {
            unsupported.add(pathLabel);
        }
    }
    if (type === "object") {
        var properties = (_b = schema.properties) !== null && _b !== void 0 ? _b : {};
        var normalizedProps = {};
        for (var _i = 0, _f = Object.entries(properties); _i < _f.length; _i++) {
            var _g = _f[_i], key = _g[0], value = _g[1];
            var res = normalizeSchemaNode(value, __spreadArray(__spreadArray([], path, true), [key], false));
            if (res.schema) {
                normalizedProps[key] = res.schema;
            }
            for (var _h = 0, _j = res.unsupportedPaths; _h < _j.length; _h++) {
                var entry = _j[_h];
                unsupported.add(entry);
            }
        }
        normalized.properties = normalizedProps;
        if (schema.additionalProperties === true) {
            unsupported.add(pathLabel);
        }
        else if (schema.additionalProperties === false) {
            normalized.additionalProperties = false;
        }
        else if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
            if (!isAnySchema(schema.additionalProperties)) {
                var res = normalizeSchemaNode(schema.additionalProperties, __spreadArray(__spreadArray([], path, true), ["*"], false));
                normalized.additionalProperties = (_c = res.schema) !== null && _c !== void 0 ? _c : schema.additionalProperties;
                if (res.unsupportedPaths.length > 0) {
                    unsupported.add(pathLabel);
                }
            }
        }
    }
    else if (type === "array") {
        var itemsSchema = Array.isArray(schema.items) ? schema.items[0] : schema.items;
        if (!itemsSchema) {
            unsupported.add(pathLabel);
        }
        else {
            var res = normalizeSchemaNode(itemsSchema, __spreadArray(__spreadArray([], path, true), ["*"], false));
            normalized.items = (_d = res.schema) !== null && _d !== void 0 ? _d : itemsSchema;
            if (res.unsupportedPaths.length > 0) {
                unsupported.add(pathLabel);
            }
        }
    }
    else if (type !== "string" &&
        type !== "number" &&
        type !== "integer" &&
        type !== "boolean" &&
        !normalized.enum) {
        unsupported.add(pathLabel);
    }
    return {
        schema: normalized,
        unsupportedPaths: Array.from(unsupported),
    };
}
function normalizeUnion(schema, path) {
    var _a;
    if (schema.allOf) {
        return null;
    }
    var union = (_a = schema.anyOf) !== null && _a !== void 0 ? _a : schema.oneOf;
    if (!union) {
        return null;
    }
    var literals = [];
    var remaining = [];
    var nullable = false;
    for (var _i = 0, union_1 = union; _i < union_1.length; _i++) {
        var entry = union_1[_i];
        if (!entry || typeof entry !== "object") {
            return null;
        }
        if (Array.isArray(entry.enum)) {
            var _b = normalizeEnum(entry.enum), enumValues = _b.enumValues, enumNullable = _b.nullable;
            literals.push.apply(literals, enumValues);
            if (enumNullable) {
                nullable = true;
            }
            continue;
        }
        if ("const" in entry) {
            if (entry.const == null) {
                nullable = true;
                continue;
            }
            literals.push(entry.const);
            continue;
        }
        if ((0, config_form_shared_1.schemaType)(entry) === "null") {
            nullable = true;
            continue;
        }
        remaining.push(entry);
    }
    if (literals.length > 0 && remaining.length === 0) {
        var unique = [];
        var _loop_2 = function (value) {
            if (!unique.some(function (existing) { return Object.is(existing, value); })) {
                unique.push(value);
            }
        };
        for (var _c = 0, literals_1 = literals; _c < literals_1.length; _c++) {
            var value = literals_1[_c];
            _loop_2(value);
        }
        return {
            schema: __assign(__assign({}, schema), { enum: unique, nullable: nullable, anyOf: undefined, oneOf: undefined, allOf: undefined }),
            unsupportedPaths: [],
        };
    }
    if (remaining.length === 1) {
        var res = normalizeSchemaNode(remaining[0], path);
        if (res.schema) {
            res.schema.nullable = nullable || res.schema.nullable;
        }
        return res;
    }
    var primitiveTypes = new Set(["string", "number", "integer", "boolean"]);
    if (remaining.length > 0 &&
        literals.length === 0 &&
        remaining.every(function (entry) { return entry.type && primitiveTypes.has(String(entry.type)); })) {
        return {
            schema: __assign(__assign({}, schema), { nullable: nullable }),
            unsupportedPaths: [],
        };
    }
    return null;
}
