import { randomUUID } from "crypto";

const LEVELS = ["debug", "info", "warn", "error"];
const envLevel = (process.env.LOG_LEVEL || "info").toLowerCase();
const minLevelIdx = Math.max(0, LEVELS.indexOf(envLevel));

function write(level, msg, ctx) {
  const rec = {
    ts: new Date().toISOString(),
    level,
    msg,
    ...ctx,
  };
  // eslint-disable-next-line no-console
  (level === "error" ? console.error : console.log)(JSON.stringify(rec));
}

export function createLogger(baseContext = {}) {
  const logger = {};
  LEVELS.forEach((level, idx) => {
    logger[level] = (msg, ctx = {}) => {
      if (idx < minLevelIdx) return;
      write(level, msg, { ...baseContext, ...ctx });
    };
  });
  logger.child = (extra) => createLogger({ ...baseContext, ...extra });
  return logger;
}

export const rootLogger = createLogger({
  service: process.env.SERVICE_NAME || "promptsales",
});

export function requestLogger(req, _res, next) {
  const requestId = req.headers["x-request-id"] || randomUUID();
  req.id = requestId;
  req.log = rootLogger.child({
    requestId,
    path: req.originalUrl,
    method: req.method,
  });
  next();
}