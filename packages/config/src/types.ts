export interface TypeName {
  __name: string;
}

export type Data<T, K> = Omit<
  Extract<Unpack<T>, { __name: K }>,
  (
    '__name' |
    '__fileLocationUri' |
    '__load' |
    '__loadFile' |
    '__loadFileJson' |
    '__validate'
  )
>

/**
 * Utility type to get the element type of an array.
 */
export type Unpack<T> = T extends(infer U)[] ? U : never;

/**
 * The value for a key is can only be the elements of the array whose __name property matches the type of that key. But if the key type is just string this won't narrow at all.
 */
export type KeyedByName<T extends TypeName[]> = {
  [K in Unpack<T>['__name']]: Data<T, K>;
}
