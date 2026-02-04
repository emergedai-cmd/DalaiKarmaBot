"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_https_1 = require("node:https");
var node_net_1 = require("node:net");
var vitest_1 = require("vitest");
var ws_1 = require("ws");
var ws_js_1 = require("../infra/ws.js");
var client_js_1 = require("./client.js");
// Find a free localhost port for ad-hoc WS servers.
function getFreePort() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var server = (0, node_net_1.createServer)();
                        server.listen(0, "127.0.0.1", function () {
                            var port = server.address().port;
                            server.close(function (err) { return (err ? reject(err) : resolve(port)); });
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
(0, vitest_1.describe)("GatewayClient", function () {
    var wss = null;
    var httpsServer = null;
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, client;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!wss) return [3 /*break*/, 2];
                    for (_i = 0, _a = wss.clients; _i < _a.length; _i++) {
                        client = _a[_i];
                        client.terminate();
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return wss === null || wss === void 0 ? void 0 : wss.close(function () { return resolve(); }); })];
                case 1:
                    _d.sent();
                    wss = null;
                    _d.label = 2;
                case 2:
                    if (!httpsServer) return [3 /*break*/, 4];
                    (_b = httpsServer.closeAllConnections) === null || _b === void 0 ? void 0 : _b.call(httpsServer);
                    (_c = httpsServer.closeIdleConnections) === null || _c === void 0 ? void 0 : _c.call(httpsServer);
                    return [4 /*yield*/, new Promise(function (resolve) { return httpsServer === null || httpsServer === void 0 ? void 0 : httpsServer.close(function () { return resolve(); }); })];
                case 3:
                    _d.sent();
                    httpsServer = null;
                    _d.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("closes on missing ticks", function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, closed, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getFreePort()];
                case 1:
                    port = _a.sent();
                    wss = new ws_1.WebSocketServer({ port: port, host: "127.0.0.1" });
                    wss.on("connection", function (socket) {
                        socket.once("message", function (data) {
                            var _a;
                            var first = JSON.parse((0, ws_js_1.rawDataToString)(data));
                            var id = (_a = first.id) !== null && _a !== void 0 ? _a : "connect";
                            // Respond with tiny tick interval to trigger watchdog quickly.
                            var helloOk = {
                                type: "hello-ok",
                                protocol: 2,
                                server: { version: "dev", connId: "c1" },
                                features: { methods: [], events: [] },
                                snapshot: {
                                    presence: [],
                                    health: {},
                                    stateVersion: { presence: 1, health: 1 },
                                    uptimeMs: 1,
                                },
                                policy: {
                                    maxPayload: 512 * 1024,
                                    maxBufferedBytes: 1024 * 1024,
                                    tickIntervalMs: 5,
                                },
                            };
                            socket.send(JSON.stringify({ type: "res", id: id, ok: true, payload: helloOk }));
                        });
                    });
                    closed = new Promise(function (resolve) {
                        var client = new client_js_1.GatewayClient({
                            url: "ws://127.0.0.1:".concat(port),
                            onClose: function (code, reason) { return resolve({ code: code, reason: reason }); },
                        });
                        client.start();
                    });
                    return [4 /*yield*/, closed];
                case 2:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.code).toBe(4000);
                    (0, vitest_1.expect)(res.reason).toContain("tick timeout");
                    return [2 /*return*/];
            }
        });
    }); }, 4000);
    (0, vitest_1.test)("rejects mismatched tls fingerprint", function () { return __awaiter(void 0, void 0, void 0, function () {
        var key, cert, port, client, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDrur5CWp4psMMb\nDTPY1aN46HPDxRchGgh8XedNkrlc4z1KFiyLUsXpVIhuyoXq1fflpTDz7++pGEDJ\nQ5pEdChn3fuWgi7gC+pvd5VQ1eAX/7qVE72fhx14NxhaiZU3hCzXjG2SflTEEExk\nUkQTm0rdHSjgLVMhTM3Pqm6Kzfdgtm9ZyXwlAsorE/pvgbUxG3Q4xKNBGzbirZ+1\nEzPDwsjf3fitNtakZJkymu6Kg5lsUihQVXOP0U7f989FmevoTMvJmkvJzsoTRd7s\nXNSOjzOwJr8da8C4HkXi21md1yEccyW0iSh7tWvDrpWDAgW6RMuMHC0tW4bkpDGr\nFpbQOgzVAgMBAAECggEAIMhwf8Ve9CDVTWyNXpU9fgnj2aDOCeg3MGaVzaO/XCPt\nKOHDEaAyDnRXYgMP0zwtFNafo3klnSBWmDbq3CTEXseQHtsdfkKh+J0KmrqXxval\nYeikKSyvBEIzRJoYMqeS3eo1bddcXgT/Pr9zIL/qzivpPJ4JDttBzyTeaTbiNaR9\nKphGNueo+MTQMLreMqw5VAyJ44gy7Z/2TMiMEc/d95wfubcOSsrIfpOKnMvWd/rl\nvxIS33s95L7CjREkixskj5Yo5Wpt3Yf5b0Zi70YiEsCfAZUDrPW7YzMlylzmhMzm\nMARZKfN1Tmo74SGpxUrBury+iPwf1sYcRnsHR+zO8QKBgQD6ISQHRzPboZ3J/60+\nfRLETtrBa9WkvaH9c+woF7l47D4DIlvlv9D3N1KGkUmhMnp2jNKLIlalBNDxBdB+\niwZP1kikGz4629Ch3/KF/VYscLTlAQNPE42jOo7Hj7VrdQx9zQrK9ZBLteXmSvOh\nbB3aXwXPF3HoTMt9gQ9thhXZJQKBgQDxQxUnQSw43dRlqYOHzPUEwnJkGkuW/qxn\naRc8eopP5zUaebiDFmqhY36x2Wd+HnXrzufy2o4jkXkWTau8Ns+OLhnIG3PIU9L/\nLYzJMckGb75QYiK1YKMUUSQzlNCS8+TFVCTAvG2u2zCCk7oTIe8aT516BQNjWDjK\ngWo2f87N8QKBgHoVANO4kfwJxszXyMPuIeHEpwquyijNEap2EPaEldcKXz4CYB4j\n4Cc5TkM12F0gGRuRohWcnfOPBTgOYXPSATOoX+4RCe+KaCsJ9gIl4xBvtirrsqS+\n42ue4h9O6fpXt9AS6sii0FnTnzEmtgC8l1mE9X3dcJA0I0HPYytOvY0tAoGAAYJj\n7Xzw4+IvY/ttgTn9BmyY/ptTgbxSI8t6g7xYhStzH5lHWDqZrCzNLBuqFBXosvL2\nbISFgx9z3Hnb6y+EmOUc8C2LyeMMXOBSEygmk827KRGUGgJiwsvHKDN0Ipc4BSwD\nltkW7pMceJSoA1qg/k8lMxA49zQkFtA8c97U0mECgYEAk2DDN78sRQI8RpSECJWy\nl1O1ikVUAYVeh5HdZkpt++ddfpo695Op9OeD2Eq27Y5EVj8Xl58GFxNk0egLUnYq\nYzSbjcNkR2SbVvuLaV1zlQKm6M5rfvhj4//YrzrrPUQda7Q4eR0as/3q91uzAO2O\n++pfnSCVCyp/TxSkhEDEawU=\n-----END PRIVATE KEY-----";
                    cert = "-----BEGIN CERTIFICATE-----\nMIIDCTCCAfGgAwIBAgIUel0Lv05cjrViyI/H3tABBJxM7NgwDQYJKoZIhvcNAQEL\nBQAwFDESMBAGA1UEAwwJbG9jYWxob3N0MB4XDTI2MDEyMDEyMjEzMloXDTI2MDEy\nMTEyMjEzMlowFDESMBAGA1UEAwwJbG9jYWxob3N0MIIBIjANBgkqhkiG9w0BAQEF\nAAOCAQ8AMIIBCgKCAQEA67q+QlqeKbDDGw0z2NWjeOhzw8UXIRoIfF3nTZK5XOM9\nShYsi1LF6VSIbsqF6tX35aUw8+/vqRhAyUOaRHQoZ937loIu4Avqb3eVUNXgF/+6\nlRO9n4cdeDcYWomVN4Qs14xtkn5UxBBMZFJEE5tK3R0o4C1TIUzNz6puis33YLZv\nWcl8JQLKKxP6b4G1MRt0OMSjQRs24q2ftRMzw8LI3934rTbWpGSZMpruioOZbFIo\nUFVzj9FO3/fPRZnr6EzLyZpLyc7KE0Xe7FzUjo8zsCa/HWvAuB5F4ttZndchHHMl\ntIkoe7Vrw66VgwIFukTLjBwtLVuG5KQxqxaW0DoM1QIDAQABo1MwUTAdBgNVHQ4E\nFgQUwNdNkEQtd0n/aofzN7/EeYPPPbIwHwYDVR0jBBgwFoAUwNdNkEQtd0n/aofz\nN7/EeYPPPbIwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAnOnw\no8Az/bL0A6bGHTYra3L9ArIIljMajT6KDHxylR4LhliuVNAznnhP3UkcZbUdjqjp\nMNOM0lej2pNioondtQdXUskZtqWy6+dLbTm1RYQh1lbCCZQ26o7o/oENzjPksLAb\njRM47DYxRweTyRWQ5t9wvg/xL0Yi1tWq4u4FCNZlBMgdwAEnXNwVWTzRR9RHwy20\nlmUzM8uQ/p42bk4EvPEV4PI1h5G0khQ6x9CtkadCTDs/ZqoUaJMwZBIDSrdJJSLw\n4Vh8Lqzia1CFB4um9J4S1Gm/VZMBjjeGGBJk7VSYn4ZmhPlbPM+6z39lpQGEG0x4\nr1USnb+wUdA7Zoj/mQ==\n-----END CERTIFICATE-----";
                    httpsServer = (0, node_https_1.createServer)({ key: key, cert: cert });
                    wss = new ws_1.WebSocketServer({ server: httpsServer, maxPayload: 1024 * 1024 });
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            httpsServer === null || httpsServer === void 0 ? void 0 : httpsServer.once("error", reject);
                            httpsServer === null || httpsServer === void 0 ? void 0 : httpsServer.listen(0, "127.0.0.1", function () {
                                var address = httpsServer === null || httpsServer === void 0 ? void 0 : httpsServer.address();
                                if (!address || typeof address === "string") {
                                    reject(new Error("https server address unavailable"));
                                    return;
                                }
                                resolve(address.port);
                            });
                        })];
                case 1:
                    port = _a.sent();
                    client = null;
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var settled = false;
                            var finish = function (err) {
                                if (settled) {
                                    return;
                                }
                                settled = true;
                                resolve(err);
                            };
                            var timeout = setTimeout(function () {
                                client === null || client === void 0 ? void 0 : client.stop();
                                finish(new Error("timeout waiting for tls error"));
                            }, 2000);
                            client = new client_js_1.GatewayClient({
                                url: "wss://127.0.0.1:".concat(port),
                                tlsFingerprint: "deadbeef",
                                onConnectError: function (err) {
                                    clearTimeout(timeout);
                                    client === null || client === void 0 ? void 0 : client.stop();
                                    finish(err);
                                },
                                onClose: function () {
                                    clearTimeout(timeout);
                                    client === null || client === void 0 ? void 0 : client.stop();
                                    finish(new Error("closed without tls error"));
                                },
                            });
                            client.start();
                        })];
                case 2:
                    error = _a.sent();
                    (0, vitest_1.expect)(String(error)).toContain("tls fingerprint mismatch");
                    return [2 /*return*/];
            }
        });
    }); });
});
