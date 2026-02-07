/**
 * DalaiKarmaBot CLI error taxonomy (audit-first, deterministic).
 *
 * Goals:
 * - Normalize provider/network/timeout/auth errors into a stable model.
 * - Enable strict JSON output that is explainable and CI-testable.
 * - Keep all logic deterministic (no random ids, no timestamps).
 */

export type CliErrorKind =
  | "AUTH" // 401/403
  | "NOT_FOUND" // 404
  | "RATE_LIMIT" // 429
  | "PROVIDER_5XX" // 5xx
  | "NETWORK" // DNS/connect/reset
  | "TIMEOUT" // abort/timeout
  | "BAD_RESPONSE" // invalid JSON / schema mismatch
  | "CONFIG" // missing env / unsupported provider
  | "VALIDATION" // invalid user args
  | "INTERNAL"; // unexpected

export type CliError = {
  kind: CliErrorKind;
  provider?: string;
  status?: number;
  code?: string;
  message: string;
  retryable: boolean;
  detail?: string;
  request?: { method?: string; url?: string };
  responseTextPreview?: string;
};

export function isRetryableHttpStatus(status: number): boolean {
  return status === 429 || (status >= 500 && status <= 599);
}

export function safePreview(text: unknown, maxLen = 800): string | undefined {
  const s = String(text ?? "");
  if (!s) return undefined;
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen) + "…(truncated)";
}

function coerceMessage(e: unknown): string {
  if (e instanceof Error) return e.message || "";
  return String(e ?? "");
}

/**
 * Structural normalization of thrown errors.
 *
 * This avoids importing provider-specific classes here.
 * The caller can pass through provider + request context.
 */
export function normalizeThrownError(args: {
  provider?: string;
  error: unknown;
}): CliError {
  const { provider, error } = args;
  const e: any = error;

  // AbortController timeouts (fetch abort) often surface as DOMException/AbortError.
  if (e?.name === "TimeoutError") {
    return {
      kind: "TIMEOUT",
      provider,
      message: e?.message || "Request timed out",
      retryable: true
    };
  }

  if (e?.name === "AbortError") {
    return {
      kind: "TIMEOUT",
      provider,
      message: "Request timed out",
      retryable: true
    };
  }

  if (e?.name === "NetworkError") {
    return {
      kind: "NETWORK",
      provider,
      message: e?.message || "Network error",
      code: e?.code,
      retryable: true
    };
  }

  // Many node fetch implementations throw TypeError with a cause/code for network issues.
  const code = e?.code || e?.cause?.code;
  if (code && typeof code === "string") {
    const networkish =
      code === "ENOTFOUND" ||
      code === "ECONNRESET" ||
      code === "ECONNREFUSED" ||
      code === "EAI_AGAIN" ||
      code === "ETIMEDOUT";
    if (networkish) {
      return {
        kind: code === "ETIMEDOUT" ? "TIMEOUT" : "NETWORK",
        provider,
        message: coerceMessage(error) || "Network error",
        code,
        retryable: true
      };
    }
  }

  if (e?.name === "HttpError") {
    const status = Number(e?.status);
    const method = e?.method;
    const url = e?.url;
    const responseText = e?.responseText;

    if (status === 401 || status === 403) {
      return {
        kind: "AUTH",
        provider,
        status,
        code: status === 401 ? "AUTH_INVALID" : "AUTH_FORBIDDEN",
        message: e?.message || `HTTP ${status}`,
        retryable: false,
        request: { method, url },
        responseTextPreview: safePreview(responseText)
      };
    }

    if (status === 404) {
      return {
        kind: "NOT_FOUND",
        provider,
        status,
        code: "NOT_FOUND",
        message: e?.message || "Not found",
        retryable: false,
        request: { method, url },
        responseTextPreview: safePreview(responseText)
      };
    }

    if (status === 429) {
      return {
        kind: "RATE_LIMIT",
        provider,
        status,
        code: "RATE_LIMITED",
        message: e?.message || "Rate limited",
        retryable: true,
        request: { method, url },
        responseTextPreview: safePreview(responseText)
      };
    }

    if (status >= 500 && status <= 599) {
      return {
        kind: "PROVIDER_5XX",
        provider,
        status,
        code: "PROVIDER_UNAVAILABLE",
        message: e?.message || `HTTP ${status}`,
        retryable: true,
        request: { method, url },
        responseTextPreview: safePreview(responseText)
      };
    }

    return {
      kind: "INTERNAL",
      provider,
      status,
      message: e?.message || `HTTP ${status}`,
      retryable: false,
      request: { method, url },
      responseTextPreview: safePreview(responseText)
    };
  }

  if (e instanceof Error) {
    return {
      kind: "INTERNAL",
      provider,
      message: e.message || "Internal error",
      retryable: false
    };
  }

  return {
    kind: "INTERNAL",
    provider,
    message: String(error ?? "Internal error"),
    retryable: false
  };
}

/**
 * Map CliError into the current run-cli.ts RunError["error"] structure.
 *
 * NOTE: This keeps backward compatibility while we harden providers.
 */
export function toRunCliErrorShape(cliErr: CliError): {
  kind: "network" | "timeout" | "provider" | "config" | "validation" | "unknown";
  message: string;
  httpStatus?: number;
  code?: string;
  retryable?: boolean;
  details?: {
    request?: { method: string; url: string };
    responseTextPreview?: string;
  };
} {
  const details =
    cliErr.request || cliErr.responseTextPreview
      ? {
          request: cliErr.request?.method && cliErr.request?.url ? { method: cliErr.request.method, url: cliErr.request.url } : undefined,
          responseTextPreview: cliErr.responseTextPreview
        }
      : undefined;

  if (cliErr.kind === "NETWORK") {
    return { kind: "network", message: cliErr.message, code: cliErr.code, retryable: cliErr.retryable, details };
  }
  if (cliErr.kind === "TIMEOUT") {
    return { kind: "timeout", message: cliErr.message, retryable: cliErr.retryable, details };
  }
  if (cliErr.kind === "CONFIG") {
    return { kind: "config", message: cliErr.message, retryable: cliErr.retryable, details };
  }
  if (cliErr.kind === "VALIDATION") {
    return { kind: "validation", message: cliErr.message, retryable: cliErr.retryable, details };
  }

  // Provider-ish (AUTH/NOT_FOUND/RATE_LIMIT/PROVIDER_5XX) and everything else
  const providerKind = cliErr.kind === "INTERNAL" ? "unknown" : "provider";
  return {
    kind: providerKind,
    message: cliErr.message,
    httpStatus: cliErr.status,
    code: cliErr.code,
    retryable: cliErr.retryable,
    details
  };
}
