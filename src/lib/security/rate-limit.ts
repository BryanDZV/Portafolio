type RateLimitScope = "login" | "create-project" | "delete-project";

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const RATE_LIMITS: Record<RateLimitScope, RateLimitConfig> = {
  login: {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  },
  "create-project": {
    limit: 10,
    windowMs: 60 * 1000,
  },
  "delete-project": {
    limit: 20,
    windowMs: 60 * 1000,
  },
};

const attemptsStore = new Map<string, RateLimitEntry>();

function buildKey(scope: RateLimitScope, identifier: string) {
  return `${scope}:${identifier}`;
}

function getNow() {
  return Date.now();
}

function cleanupExpiredEntries(now: number) {
  for (const [key, entry] of attemptsStore.entries()) {
    if (entry.resetAt <= now) {
      attemptsStore.delete(key);
    }
  }
}

// QUE HACE: Aplica control de frecuencia por scope e identificador para proteger mutaciones y login frente a abuso.
// POR QUE SE ELIGIO: Un limitador en frontera de acciones reduce riesgo de fuerza bruta y spam sin alterar UX de flujos válidos.
// COMO FUNCIONA: Usa ventana fija en memoria; incrementa contador por clave `scope+identifier`, expira entradas vencidas y bloquea cuando excede límite.
// APRENDE MAS: https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks y https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
export function assertRateLimit(scope: RateLimitScope, identifier: string) {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const now = getNow();
  cleanupExpiredEntries(now);

  if (!normalizedIdentifier) {
    throw new Error("Identificador inválido para rate limit");
  }

  const key = buildKey(scope, normalizedIdentifier);
  const config = RATE_LIMITS[scope];
  const currentEntry = attemptsStore.get(key);

  if (!currentEntry || currentEntry.resetAt <= now) {
    attemptsStore.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    });
    return;
  }

  if (currentEntry.count >= config.limit) {
    throw new Error("Demasiados intentos. Inténtalo más tarde.");
  }

  currentEntry.count += 1;
  attemptsStore.set(key, currentEntry);
}
