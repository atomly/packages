/**
 * Utility type to get the element type of an array.
 */
export type Unpack<T> = T extends(infer U)[] ? U : never;

/**
 * the value for a key is can only be the elements of the array whose __name property matches the type of that key. But if the key type is just string this won't narrow at all.
 */
export type KeyedByName<U extends { __name: string }[]> = {
  [K in Unpack<U>['__name']]: (
    Omit<
      Extract<Unpack<U>, { __name: K }>,
      (
        '__name' |
        '__validate' |
        '__fileLocationUri'
      )
    >
  )
}
