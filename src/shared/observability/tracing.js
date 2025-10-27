import { randomUUID } from "crypto";

export function extractTraceId(req) {
  const tp = req.headers["traceparent"];
  // formato muy simple: 00-<traceId>-<spanId>-01
  if (typeof tp === "string") {
    const parts = tp.split("-");
    if (parts.length >= 2 && parts[1]) return parts[1];
  }
  // fallback: usa x-trace-id o genera uno
  return req.headers["x-trace-id"] || randomUUID().replace(/-/g, "");
}

export function tracingMiddleware(req, res, next) {
  const traceId = extractTraceId(req);
  req.traceId = traceId;
  res.setHeader("x-trace-id", traceId);
  // opcional: reflejar traceparent mínimo
  if (!req.headers["traceparent"]) {
    const spanId = randomUUID().replace(/-/g, "").slice(0, 16);
    res.setHeader("traceparent", `00-${traceId}-${spanId}-01`);
  }
  next();
}

// Helper para envolver funciones con spans lógicos (no-OTEL)
export async function withSpan(name, fn, { logger, attrs } = {}) {
  const start = Date.now();
  try {
    logger?.debug?.(`span.start ${name}`, attrs || {});
    const out = await fn();
    logger?.debug?.(`span.end ${name}`, { dur_ms: Date.now() - start, ...attrs });
    return out;
  } catch (err) {
    logger?.error?.(`span.error ${name}`, {
      dur_ms: Date.now() - start,
      err: err?.message,
      stack: err?.stack,
      ...attrs,
    });
    throw err;
  }
}