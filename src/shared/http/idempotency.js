import crypto from "crypto";

export const IDEMPOTENCY_HEADER = "Idempotency-Key";

export function stableStringify(obj) {
  // stringify determinístico (ordena claves para hash estable)
  const allKeys = new Set();
  JSON.stringify(obj, (k, v) => (allKeys.add(k), v));
  return JSON.stringify(obj, [...allKeys].sort());
}

export function keyFrom(payload) {
  const str = typeof payload === "string" ? payload : stableStringify(payload);
  return crypto.createHash("sha256").update(str).digest("hex");
}

// Store TTL en memoria (reemplazar por Redis)
export class TTLStore {
  constructor(defaultTtlSec = 3600) {
    this.ttl = defaultTtlSec;
    this.map = new Map(); // key -> { value, exp }
  }
  get(key) {
    const rec = this.map.get(key);
    if (!rec) return null;
    if (rec.exp < Date.now()) {
      this.map.delete(key);
      return null;
    }
    return rec.value;
  }
  set(key, value, ttlSec = this.ttl) {
    this.map.set(key, { value, exp: Date.now() + ttlSec * 1000 });
  }
}

// Middleware de idempotencia
// options: { store, ttlSec, deriveKey(req) }
export function makeIdempotencyMiddleware({
  store = new TTLStore(3600),
  ttlSec = 3600,
  deriveKey,
} = {}) {
  return async function idempotency(req, res, next) {
    try {
      const incomingKey =
        req.header(IDEMPOTENCY_HEADER) ||
        (deriveKey
          ? deriveKey(req)
          : // por defecto: método + url + cuerpo
            keyFrom({ m: req.method, u: req.originalUrl, b: req.body }));

      if (!incomingKey) return next();

      // hit?
      const cached = store.get(incomingKey);
      if (cached) {
        res.setHeader("X-Idempotency-Cache", "hit");
        if (cached.headers) {
          for (const [h, v] of Object.entries(cached.headers)) res.setHeader(h, v);
        }
        return res.status(cached.status).send(cached.body);
      }

      // miss: interceptar body para cachearlo al terminar
      res.setHeader("X-Idempotency-Cache", "miss");
      const _json = res.json.bind(res);
      const _send = res.send.bind(res);
      res.json = (data) => {
        res.__body = data;
        return _json(data);
      };
      res.send = (data) => {
        res.__body = data;
        return _send(data);
      };

      res.on("finish", () => {
        // solo cachear respuestas exitosas (2xx)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const headers = { "content-type": res.getHeader("content-type") };
          store.set(
            incomingKey,
            { status: res.statusCode, body: res.__body, headers },
            ttlSec
          );
        }
      });

      return next();
    } catch (err) {
      return next(err);
    }
  };
}