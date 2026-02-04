"use strict";
/**
 * Conversation store for MS Teams proactive messaging.
 *
 * Stores ConversationReference-like objects keyed by conversation ID so we can
 * send proactive messages later (after the webhook turn has completed).
 */
Object.defineProperty(exports, "__esModule", { value: true });
