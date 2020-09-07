/**
 * Asynchronous function to wait for a specified number of milliseconds.
 * @param timer - Milliseconds to wait for. Defaults to 1000.
 */
export async function wait(timer = 1000): Promise<void> {
  await new Promise((resolve) => setTimeout(() => resolve(), timer));
}
