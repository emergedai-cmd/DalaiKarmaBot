"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleChatScroll = scheduleChatScroll;
exports.scheduleLogsScroll = scheduleLogsScroll;
exports.handleChatScroll = handleChatScroll;
exports.handleLogsScroll = handleLogsScroll;
exports.resetChatScroll = resetChatScroll;
exports.exportLogs = exportLogs;
exports.observeTopbar = observeTopbar;
/** Distance (px) from the bottom within which we consider the user "near bottom". */
var NEAR_BOTTOM_THRESHOLD = 450;
function scheduleChatScroll(host, force) {
    if (force === void 0) { force = false; }
    if (host.chatScrollFrame) {
        cancelAnimationFrame(host.chatScrollFrame);
    }
    if (host.chatScrollTimeout != null) {
        clearTimeout(host.chatScrollTimeout);
        host.chatScrollTimeout = null;
    }
    var pickScrollTarget = function () {
        var _a;
        var container = host.querySelector(".chat-thread");
        if (container) {
            var overflowY = getComputedStyle(container).overflowY;
            var canScroll = overflowY === "auto" ||
                overflowY === "scroll" ||
                container.scrollHeight - container.clientHeight > 1;
            if (canScroll) {
                return container;
            }
        }
        return ((_a = document.scrollingElement) !== null && _a !== void 0 ? _a : document.documentElement);
    };
    // Wait for Lit render to complete, then scroll
    void host.updateComplete.then(function () {
        host.chatScrollFrame = requestAnimationFrame(function () {
            host.chatScrollFrame = null;
            var target = pickScrollTarget();
            if (!target) {
                return;
            }
            var distanceFromBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
            // force=true only overrides when we haven't auto-scrolled yet (initial load).
            // After initial load, respect the user's scroll position.
            var effectiveForce = force && !host.chatHasAutoScrolled;
            var shouldStick = effectiveForce || host.chatUserNearBottom || distanceFromBottom < NEAR_BOTTOM_THRESHOLD;
            if (!shouldStick) {
                // User is scrolled up — flag that new content arrived below.
                host.chatNewMessagesBelow = true;
                return;
            }
            if (effectiveForce) {
                host.chatHasAutoScrolled = true;
            }
            target.scrollTop = target.scrollHeight;
            host.chatUserNearBottom = true;
            host.chatNewMessagesBelow = false;
            var retryDelay = effectiveForce ? 150 : 120;
            host.chatScrollTimeout = window.setTimeout(function () {
                host.chatScrollTimeout = null;
                var latest = pickScrollTarget();
                if (!latest) {
                    return;
                }
                var latestDistanceFromBottom = latest.scrollHeight - latest.scrollTop - latest.clientHeight;
                var shouldStickRetry = effectiveForce ||
                    host.chatUserNearBottom ||
                    latestDistanceFromBottom < NEAR_BOTTOM_THRESHOLD;
                if (!shouldStickRetry) {
                    return;
                }
                latest.scrollTop = latest.scrollHeight;
                host.chatUserNearBottom = true;
            }, retryDelay);
        });
    });
}
function scheduleLogsScroll(host, force) {
    if (force === void 0) { force = false; }
    if (host.logsScrollFrame) {
        cancelAnimationFrame(host.logsScrollFrame);
    }
    void host.updateComplete.then(function () {
        host.logsScrollFrame = requestAnimationFrame(function () {
            host.logsScrollFrame = null;
            var container = host.querySelector(".log-stream");
            if (!container) {
                return;
            }
            var distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
            var shouldStick = force || distanceFromBottom < 80;
            if (!shouldStick) {
                return;
            }
            container.scrollTop = container.scrollHeight;
        });
    });
}
function handleChatScroll(host, event) {
    var container = event.currentTarget;
    if (!container) {
        return;
    }
    var distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    host.chatUserNearBottom = distanceFromBottom < NEAR_BOTTOM_THRESHOLD;
    // Clear the "new messages below" indicator when user scrolls back to bottom.
    if (host.chatUserNearBottom) {
        host.chatNewMessagesBelow = false;
    }
}
function handleLogsScroll(host, event) {
    var container = event.currentTarget;
    if (!container) {
        return;
    }
    var distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    host.logsAtBottom = distanceFromBottom < 80;
}
function resetChatScroll(host) {
    host.chatHasAutoScrolled = false;
    host.chatUserNearBottom = true;
    host.chatNewMessagesBelow = false;
}
function exportLogs(lines, label) {
    if (lines.length === 0) {
        return;
    }
    var blob = new Blob(["".concat(lines.join("\n"), "\n")], { type: "text/plain" });
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    var stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    anchor.href = url;
    anchor.download = "openclaw-logs-".concat(label, "-").concat(stamp, ".log");
    anchor.click();
    URL.revokeObjectURL(url);
}
function observeTopbar(host) {
    if (typeof ResizeObserver === "undefined") {
        return;
    }
    var topbar = host.querySelector(".topbar");
    if (!topbar) {
        return;
    }
    var update = function () {
        var height = topbar.getBoundingClientRect().height;
        host.style.setProperty("--topbar-height", "".concat(height, "px"));
    };
    update();
    host.topbarObserver = new ResizeObserver(function () { return update(); });
    host.topbarObserver.observe(topbar);
}
