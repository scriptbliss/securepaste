const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /token/i,
  /access[_-]?token/i,
  /refresh[_-]?token/i,
  /secret/i,
  /api[_-]?key/i,
  /authorization/i,
  /credential/i,
  /passphrase/i,
  /session[_-]?id/i,
  /cookie/i,
  /jwt/i,
  /ssn/i,
  /credit[_-]?card/i,
  /card[_-]?number/i,
  /cvv/i,
];

const SENSITIVE_VALUE_PATTERNS = [
  /(?:\d[ -]*?){13,16}/, // Credit card number patterns
];

export function redactSensitive(
  value: unknown,
  seen = new WeakSet(),
  depth = 0,
  maxDepth = 10,
  warnings: string[] = [],
): unknown {
  if (depth > maxDepth) {
    warnings.push('[Max Depth Reached]');
    return '[Max Depth Reached]';
  }

  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    for (const pattern of SENSITIVE_VALUE_PATTERNS) {
      if (pattern.test(value)) {
        return '[REDACTED]';
      }
    }
    if (value.length > 1000) {
      warnings.push('[Truncated Large String]');
      return '[Truncated]';
    }
    return value;
  }

  if (typeof value === 'object') {
    if (seen.has(value)) {
      return '[Circular]';
    }
    seen.add(value);

    if (Array.isArray(value)) {
      if (value.length > 50) {
        warnings.push('[Pruned Large Array]');
        return '[Pruned Large Array]';
      }
      return value.map((v) =>
        redactSensitive(v, seen, depth + 1, maxDepth, warnings),
      );
    }
    const obj = value as Record<string, unknown>;

    if (Object.keys(obj).length > 50) {
      warnings.push('[Pruned Large Object]');
      return '[Pruned Large Object]';
    }

    return Object.fromEntries(
      Object.entries(obj).map(([key, val]) => {
        const isSensitiveKey = SENSITIVE_KEY_PATTERNS.some((pattern) =>
          pattern.test(key),
        );
        return [
          key,
          isSensitiveKey
            ? '[REDACTED]'
            : redactSensitive(val, seen, depth + 1, maxDepth, warnings),
        ];
      }),
    );
  }

  // Primitive types (number, boolean, symbol, bigint)
  return value;
}

/** research on using fast-redact for performance
 *  
import fastRedact from 'fast-redact';

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
}

function discoverSensitivePaths(obj: unknown, basePath = ''): string[] {
  const paths: string[] = [];

  if (typeof obj !== 'object' || obj === null) return paths;

  for (const [key, value] of Object.entries(obj)) {
    const path = basePath ? `${basePath}.${key}` : key;

    if (isSensitiveKey(key)) {
      paths.push(path);
    }

    if (typeof value === 'object' && value !== null) {
      paths.push(...discoverSensitivePaths(value, path));
    }
  }

  return paths;
}

export function autoRedact(obj: unknown): unknown {
  const paths = discoverSensitivePaths(obj);
  const redact = fastRedact({ paths, censor: '[REDACTED]' });

  try {
    return JSON.parse(redact(obj));
  } catch {
    return '[Redaction Failed]';
  }
}
*/
