// Types
import { IEdgesMap, IVertex } from './types';

// Dependencies
import { __DEFAULT_EDGE_WEIGHT } from './constants';
import { Edge } from './Edge';

/**
 * Implementation of a "multi-key" map for the edges between vertices.
 * The combinations of the vertex keys (e.g. from, to) are meant to be unique.
 */
export class EdgesMap<T> implements IEdgesMap<T> {
  static __DEFAULT_EDGE_WEIGHT = __DEFAULT_EDGE_WEIGHT;

  public from: {
    // (unique) Edge<T>['from] -> (unique) Edge<T>['to'][]
    [key: string]: {
      to: {
        [key: string]: Edge<T>;
      }
    }
  };

  constructor() {
    this.from = {};
  }

  public addEdge(
    fromVertexKey: IVertex<T>['key'],
    toVertexKey: IVertex<T>['key'],
    weight: Edge<T>['weight'] = EdgesMap.__DEFAULT_EDGE_WEIGHT,
  ): Edge<T> {
    if (!this.from[fromVertexKey]) {
      this.from[fromVertexKey] = { to: {} };
    }
    const edge = new Edge(fromVertexKey, toVertexKey, weight);
    this.from[fromVertexKey].to[toVertexKey] = edge;
    return edge;
  }

  public getEdge(fromVertexKey: IVertex<T>['key'], toVertexKey: IVertex<T>['key']): Edge<T> | undefined {
    if (this.hasEdge(fromVertexKey, toVertexKey)) {
      return this.from![fromVertexKey]!.to![toVertexKey]!;
    }
    return undefined;
  }

  public hasEdge(fromVertexKey: IVertex<T>['key'], toVertexKey: IVertex<T>['key']): boolean {
    if (!this.from[fromVertexKey]) {
      return false;
    }
    return Boolean(this.from[fromVertexKey].to[toVertexKey]);
  }

  public removeEdge(fromVertexKey: IVertex<T>['key'], toVertexKey: IVertex<T>['key']): Edge<T> | undefined {
    if (this.hasEdge(fromVertexKey, toVertexKey)) {
      const removedEdge = this.from![fromVertexKey]!.to![toVertexKey]!;
      delete this.from![fromVertexKey]!.to![toVertexKey];
      return removedEdge;
    }
    return undefined;
  }

  clear(): EdgesMap<T> {
    this.from = {};
    return this;
  }

  values(): Edge<T>[] {
    const edges = Object
      .values(this.from)
      .reduce(
        (acc, { to }) => {
          return acc.concat(Object.values(to));
        },
        [] as Edge<T>[],
      )
    return edges;
  }
}
