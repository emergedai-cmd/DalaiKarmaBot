"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
vitest_1.vi.mock("@slack/web-api", function () {
    var WebClient = vitest_1.vi.fn(function WebClientMock(token, options) {
        this.token = token;
        this.options = options;
    });
    return { WebClient: WebClient };
});
var slackWebApi = await Promise.resolve().then(function () { return require("@slack/web-api"); });
var _a = await Promise.resolve().then(function () { return require("./client.js"); }), createSlackWebClient = _a.createSlackWebClient, resolveSlackWebClientOptions = _a.resolveSlackWebClientOptions, SLACK_DEFAULT_RETRY_OPTIONS = _a.SLACK_DEFAULT_RETRY_OPTIONS;
var WebClient = slackWebApi.WebClient;
(0, vitest_1.describe)("slack web client config", function () {
    (0, vitest_1.it)("applies the default retry config when none is provided", function () {
        var options = resolveSlackWebClientOptions();
        (0, vitest_1.expect)(options.retryConfig).toEqual(SLACK_DEFAULT_RETRY_OPTIONS);
    });
    (0, vitest_1.it)("respects explicit retry config overrides", function () {
        var customRetry = { retries: 0 };
        var options = resolveSlackWebClientOptions({ retryConfig: customRetry });
        (0, vitest_1.expect)(options.retryConfig).toBe(customRetry);
    });
    (0, vitest_1.it)("passes merged options into WebClient", function () {
        createSlackWebClient("xoxb-test", { timeout: 1234 });
        (0, vitest_1.expect)(WebClient).toHaveBeenCalledWith("xoxb-test", vitest_1.expect.objectContaining({
            timeout: 1234,
            retryConfig: SLACK_DEFAULT_RETRY_OPTIONS,
        }));
    });
});
