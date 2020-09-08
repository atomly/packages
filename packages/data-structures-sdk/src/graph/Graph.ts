// Types
import { IGraph, Vertex } from './types';

/**
 * An undirected and unweighted graph data structure using an adjacency list to store vertices
 * and edges.
 */
export class Graph<T> implements IGraph<T> {
  public shouldCacheTraversals: boolean;

  public verticesMap: Map<Vertex<T>['key'], Vertex<T>>;

  public adjacencyList: Map<Vertex<T>['key'], Set<Vertex<T>['key']>>;

  public depthFirstTraversalCache?: Map<T, Vertex<T>[]>;

  public breadthFirstTraversalCache?: Map<T, Vertex<T>[]>;

  constructor(args: {
    shouldCacheTraversals?: boolean;
    verticesMap?: Map<Vertex<T>['key'], Vertex<T>>;
    adjacencyList?: Map<Vertex<T>['key'], Set<Vertex<T>['key']>>;
    depthFirstTraversalCache?: Map<T, Vertex<T>[]>;
    breadthFirstTraversalCache?: Map<T, Vertex<T>[]>;
  } = {}) {
    this.shouldCacheTraversals = args.shouldCacheTraversals ?? false;
    this.verticesMap = args.verticesMap ?? new Map();
    this.adjacencyList = args.adjacencyList ?? new Map();
    this.depthFirstTraversalCache = args.depthFirstTraversalCache;
    this.breadthFirstTraversalCache = args.breadthFirstTraversalCache;
  }

  public addVertex(vertex: Vertex<T>): Graph<T> {
    this.verticesMap.set(vertex.key, vertex);
    if (!this.adjacencyList.get(vertex.key)) {
      this.adjacencyList.set(vertex.key, new Set<Vertex<T>['key']>());
    }
    return this;
  }

  public addEdge(fromVertexKey: Vertex<T>['key'], toVertexKey: Vertex<T>['key']): boolean {
    // Checking if the vertices exist in the list.
    const shouldAddEdge = Boolean(
      this.adjacencyList.get(fromVertexKey) &&
      this.adjacencyList.get(toVertexKey),
    );
    // Using JavaScript `Set` data structures to make sure that the edges
    // are unique respective to the interconnected vertices.
    if (shouldAddEdge) {
      // TODO: Add BOTH edges if undirected, otherwise add only
      // one edge; from vertex key to vertex key.
      this.adjacencyList.get(fromVertexKey)!.add(toVertexKey);
      this.adjacencyList.get(toVertexKey)!.add(fromVertexKey);
    }
    return shouldAddEdge;
  }

  public removeVertex(key: Vertex<T>['key']): Vertex<T> | undefined {
    const removedVertex = this.verticesMap.get(key);
    if (removedVertex) {
      // Using JavaScript `Set` data structures to make sure that the edges
      // are unique respective to the interconnected vertices.
      const set = this.adjacencyList.get(key);
      if (set) {
        // Removing all all edges connecting to this vertex:
        set.forEach(connectedVertexKey => {
          const connectedEdges = this.adjacencyList.get(connectedVertexKey);
          if (connectedEdges) {
            connectedEdges.delete(key);
          }
        });
      }
      this.verticesMap.delete(key);
      this.adjacencyList.delete(key);
    }
    return removedVertex;
  }

  public removeEdge(fromVertexKey: Vertex<T>['key'], toVertexKey: Vertex<T>['key']): boolean {
    // Checking if the vertices exist in the list.
    const shouldRemoveEdge = Boolean(
      this.adjacencyList.get(fromVertexKey) &&
      this.adjacencyList.get(toVertexKey),
    );
    // Using JavaScript `Set` data structures to make sure that the edges
    // are unique respective to the interconnected vertices.
    if (shouldRemoveEdge) {
      this.adjacencyList.get(fromVertexKey)!.delete(toVertexKey);
      this.adjacencyList.get(toVertexKey)!.delete(fromVertexKey);
    }
    return shouldRemoveEdge;
  }

  public breadthFirstTraversal(key: Vertex<T>['key']): Vertex<T>[] {
    const vertices: Vertex<T>[] = [];
    const resultsCache: Record<Vertex<T>['key'], null> = {}; // Cache hash table.
    const queue: string[] = [key];
    resultsCache[key] = null; // Caching the first vertex as visited.
    while (queue.length) { // TODO: Use a `Queue` data structure here.
      const vertexKey = queue.shift() as Vertex<T>['key'];
      const vertex = this.verticesMap.get(vertexKey);
      if (vertex) {
        vertices.push(vertex);
        const edges = this.adjacencyList.get(vertexKey);
        if (edges?.size) {
          edges.forEach((connectedVertexKey: Vertex<T>['key']) => {
            // If the connected vertex is not in the results list (not visited)
            if (!(connectedVertexKey in resultsCache)) {
              resultsCache[connectedVertexKey] = null; // Caching the neighbors as visited.
              queue.push(connectedVertexKey);
            }
          });
        }
      }
    }
    return vertices;
  }

  public depthFirstTraversal(key: Vertex<T>['key']): Vertex<T>[] {
    const vertices: Vertex<T>[] = [];
    const resultsCache: Record<Vertex<T>['key'], null> = {}; // Cache hash table.
    const traverse = (vertexKey: Vertex<T>['key']): void => {
      const edges = this.adjacencyList.get(vertexKey);
      const vertex = this.verticesMap.get(vertexKey);
      if (vertex) {
        vertices.push(vertex);
        if (!edges || edges.size === 0) {
          return;
        }
        resultsCache[vertexKey] = null;
        edges.forEach(connectedVertexKey => {
          // If the connected vertex is not in the results list (not visited)
          if (!(connectedVertexKey in resultsCache)) {
            traverse(connectedVertexKey);
          }
        });
      }
    }
    traverse(key);
    return vertices;
  }
}
