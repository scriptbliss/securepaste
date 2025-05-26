export async function withMinimumDelay<T>(
  promise: Promise<T>,
  delayMs: number,
): Promise<T> {
  const delay = new Promise((resolve) => setTimeout(resolve, delayMs));
  const [result] = await Promise.all([promise, delay]);
  return result;
}
