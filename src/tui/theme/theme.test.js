"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var theme_js_1 = require("./theme.js");
(0, vitest_1.describe)("markdownTheme", function () {
    (0, vitest_1.describe)("highlightCode", function () {
        (0, vitest_1.it)("should return an array of lines for JavaScript code", function () {
            var code = "const x = 42;";
            var result = theme_js_1.markdownTheme.highlightCode(code, "javascript");
            (0, vitest_1.expect)(result).toBeInstanceOf(Array);
            (0, vitest_1.expect)(result).toHaveLength(1);
            // Result should contain the original code (possibly with ANSI codes)
            (0, vitest_1.expect)(result[0]).toContain("const");
            (0, vitest_1.expect)(result[0]).toContain("42");
        });
        (0, vitest_1.it)("should return correct line count for multi-line code", function () {
            var code = "function greet(name: string) {\n  return \"Hello, \" + name;\n}";
            var result = theme_js_1.markdownTheme.highlightCode(code, "typescript");
            (0, vitest_1.expect)(result).toHaveLength(3);
            (0, vitest_1.expect)(result[0]).toContain("function");
            (0, vitest_1.expect)(result[1]).toContain("return");
            (0, vitest_1.expect)(result[2]).toContain("}");
        });
        (0, vitest_1.it)("should handle Python code", function () {
            var code = "def hello():\n    print(\"world\")";
            var result = theme_js_1.markdownTheme.highlightCode(code, "python");
            (0, vitest_1.expect)(result).toHaveLength(2);
            (0, vitest_1.expect)(result[0]).toContain("def");
            (0, vitest_1.expect)(result[1]).toContain("print");
        });
        (0, vitest_1.it)("should handle unknown languages gracefully", function () {
            var code = "const x = 42;";
            var result = theme_js_1.markdownTheme.highlightCode(code, "not-a-real-language");
            (0, vitest_1.expect)(result).toBeInstanceOf(Array);
            (0, vitest_1.expect)(result).toHaveLength(1);
            // Should still return the code content
            (0, vitest_1.expect)(result[0]).toContain("const");
        });
        (0, vitest_1.it)("should handle code without language specifier", function () {
            var code = "echo \"hello\"";
            var result = theme_js_1.markdownTheme.highlightCode(code, undefined);
            (0, vitest_1.expect)(result).toBeInstanceOf(Array);
            (0, vitest_1.expect)(result).toHaveLength(1);
            (0, vitest_1.expect)(result[0]).toContain("echo");
        });
        (0, vitest_1.it)("should handle empty code", function () {
            var result = theme_js_1.markdownTheme.highlightCode("", "javascript");
            (0, vitest_1.expect)(result).toBeInstanceOf(Array);
            (0, vitest_1.expect)(result).toHaveLength(1);
            (0, vitest_1.expect)(result[0]).toBe("");
        });
        (0, vitest_1.it)("should handle bash/shell code", function () {
            var code = "#!/bin/bash\necho \"Hello\"\nfor i in {1..5}; do\n  echo $i\ndone";
            var result = theme_js_1.markdownTheme.highlightCode(code, "bash");
            (0, vitest_1.expect)(result).toHaveLength(5);
            (0, vitest_1.expect)(result[0]).toContain("#!/bin/bash");
            (0, vitest_1.expect)(result[1]).toContain("echo");
        });
        (0, vitest_1.it)("should handle JSON", function () {
            var code = "{\"name\": \"test\", \"count\": 42, \"active\": true}";
            var result = theme_js_1.markdownTheme.highlightCode(code, "json");
            (0, vitest_1.expect)(result).toHaveLength(1);
            (0, vitest_1.expect)(result[0]).toContain("name");
            (0, vitest_1.expect)(result[0]).toContain("42");
        });
        (0, vitest_1.it)("should handle code with special characters", function () {
            var code = "const regex = /\\d+/g;\nconst str = \"Hello\\nWorld\";";
            var result = theme_js_1.markdownTheme.highlightCode(code, "javascript");
            (0, vitest_1.expect)(result).toHaveLength(2);
            // Should not throw and should return valid output
            (0, vitest_1.expect)(result[0].length).toBeGreaterThan(0);
            (0, vitest_1.expect)(result[1].length).toBeGreaterThan(0);
        });
        (0, vitest_1.it)("should preserve code content through highlighting", function () {
            var code = "const message = \"Hello, World!\";\nconsole.log(message);";
            var result = theme_js_1.markdownTheme.highlightCode(code, "javascript");
            // Strip ANSI codes to verify content is preserved
            var stripAnsi = function (str) {
                return str.replace(new RegExp("".concat(String.fromCharCode(27), "\\[[0-9;]*m"), "g"), "");
            };
            (0, vitest_1.expect)(stripAnsi(result[0])).toBe("const message = \"Hello, World!\";");
            (0, vitest_1.expect)(stripAnsi(result[1])).toBe("console.log(message);");
        });
    });
});
