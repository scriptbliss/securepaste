export function sanitizeStackTrace(stack?: string): string | undefined {
  if (!stack) {
    return stack;
  }

  // Remove absolute file paths(Unix and Windows), env variables, and user info
  let sanitized = stack.replace(
    /(\bat\s.+\()?(\/|[a-zA-Z]:\\)[^():]+/g,
    '<redacted_path>',
  );
  sanitized = sanitized.replace(/(process\.env\.[A-Z_]+)/gi, '<redacted_env>');
  sanitized = sanitized.replace(/user:\s*\w+/gi, 'user:<redacted>');
  return sanitized;
}
