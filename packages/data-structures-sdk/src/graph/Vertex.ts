// Types
import { IVertex } from './types';

/**
 * Basic vertex (also known as node) containing data stored in the `value` property,
 * and a `key` property to link it to other vertices.
 */
export class Vertex<T> implements IVertex<T> {
  public key: string;

  public value?: T;

  constructor(key: string, value?: T) {
    this.key = key;
    this.value = value;
  }
}
