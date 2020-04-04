/**
 * Returns an async generator constructed an array type object in order to iterate
 * through the array asynchronously.
 * @param array - Array that will be used to return an async generator.
 */
export async function* generateAsyncIterator<T>(array: Array<T>): AsyncGenerator<T> {
  for (let i = 0; i < array.length; i++) {
    yield array[i]
  }
}
