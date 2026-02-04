"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCallByProviderCallId = getCallByProviderCallId;
exports.findCall = findCall;
function getCallByProviderCallId(params) {
    var callId = params.providerCallIdMap.get(params.providerCallId);
    if (callId) {
        return params.activeCalls.get(callId);
    }
    for (var _i = 0, _a = params.activeCalls.values(); _i < _a.length; _i++) {
        var call = _a[_i];
        if (call.providerCallId === params.providerCallId) {
            return call;
        }
    }
    return undefined;
}
function findCall(params) {
    var directCall = params.activeCalls.get(params.callIdOrProviderCallId);
    if (directCall) {
        return directCall;
    }
    return getCallByProviderCallId({
        activeCalls: params.activeCalls,
        providerCallIdMap: params.providerCallIdMap,
        providerCallId: params.callIdOrProviderCallId,
    });
}
