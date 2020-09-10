// Types
import { IEdge, IVertex } from './types';

/**
 * Connections between vertices.
 */
export class Edge<T> implements IEdge<T> {
  from: IVertex<T>['key'];

  to: IVertex<T>['key'];

  weight?: number;

  constructor(from: IVertex<T>['key'], to: IVertex<T>['key'], weight?: number) {
    this.from = from;
    this.to = to;
    this.weight = weight;
  }
}
