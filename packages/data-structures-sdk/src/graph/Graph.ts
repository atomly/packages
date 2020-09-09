// Types
import { IGraph, Vertex, Edge } from './types';

/**
 * Graph data structure using an adjacency list to store edges. The graph can be configured
 * to be a combination of the following: undirectional or directional, and unweighted or weighted.
 * **Please note** that if the graph is unweighted, the internal Djikstra's Algorithm will not return
 * any nodes.
 */
export class Graph<T> implements IGraph<T> {
  static __DEFAULT_EDGE_WEIGHT = 0;

  static __DEFAULT_IS_DIRECTED_GRAPH = false;

  /**
   * Generates a unique key of the edge based on the connected vertices' key values.
   * Returns the serialized key.
   * @param fromVertexKey - (from) Vertex identifier.
   * @param toVertexKey - (to) Vertex identifier.
   */
  static serializeEdgeKey(fromVertexKey: Vertex<unknown>['key'], toVertexKey: Vertex<unknown>['key']): string {
    return `${fromVertexKey}_${toVertexKey}`;
  }

  public isDirectedGraph: boolean;

  public verticesMap: Map<Vertex<T>['key'], Vertex<T>>;

  public edgesMap: Map<Edge<T>['key'], Edge<T>>;

  public adjacencyList: Map<Vertex<T>['key'], Set<Edge<T>['key']>>;

  constructor(args: {
    isDirectedGraph?: boolean;
    verticesMap?: Map<Vertex<T>['key'], Vertex<T>>;
    edgesMap?: Map<Edge<T>['key'], Edge<T>>;
    adjacencyList?: Map<Vertex<T>['key'], Set<Vertex<T>['key']>>;
  } = {}) {
    // Setting up the graph "metadata" configuration:
    this.isDirectedGraph = args.isDirectedGraph ?? Graph.__DEFAULT_IS_DIRECTED_GRAPH;
    // Instantiating and binding maps of vertices and edges:
    this.verticesMap = args.verticesMap ?? new Map();
    this.edgesMap = args.edgesMap ?? new Map();
    // Instantiating adjacency list:
    this.adjacencyList = args.adjacencyList ?? new Map();
    // Binding traversals:
    this.traversal = {
      breadthFirst: this._breadthFirstTraversal.bind(this),
      depthFirst: this._depthFirstTraversal.bind(this),
    };
  }

  public addVertex(key: Vertex<T>['key'], value: Vertex<T>['value']): Vertex<T> {
    const vertex = { key, value };
    this.verticesMap.set(key, { key, value });
    if (!this.adjacencyList.get(key)) {
      this.adjacencyList.set(key, new Set<Edge<T>['key']>());
    }
    return vertex;
  }

  public addEdge(
    fromVertexKey: Vertex<T>['key'],
    toVertexKey: Vertex<T>['key'],
    weight: Edge<T>['weight'] = Graph.__DEFAULT_EDGE_WEIGHT,
  ): boolean {
    // Checking if the vertices exist.
    const shouldAddEdge = (
      this.hasVertex(fromVertexKey) &&
      this.hasVertex(toVertexKey)
    );
    // Using JavaScript `Set` data structures to make sure that the edges
    // are unique respective to the interconnected vertices.
    if (shouldAddEdge) {
      this.adjacencyList.get(fromVertexKey)!.add(toVertexKey);
      // Adding the outgoing Edge:
      const outgoingEdgeKey = Graph.serializeEdgeKey(fromVertexKey, toVertexKey);
      this.edgesMap.set(
        outgoingEdgeKey,
        { key: outgoingEdgeKey, from: fromVertexKey, to: toVertexKey, weight },
      );
      // If it's an undirected graph, also add the incoming Edge:
      if (!this.isDirectedGraph) {
        this.adjacencyList.get(toVertexKey)!.add(fromVertexKey);
        const incomingEdgeKey = Graph.serializeEdgeKey(toVertexKey, fromVertexKey);
        this.edgesMap.set(
          incomingEdgeKey,
          { key: incomingEdgeKey, from: toVertexKey, to: fromVertexKey, weight },
        );
      }
    }
    return shouldAddEdge;
  }

  public getVertex(key: Vertex<T>['key']): Vertex<T> | undefined {
    return this.verticesMap.get(key);
  }

  public getEdge(fromVertexKey: Vertex<T>['key'], toVertexKey: Vertex<T>['key']): Edge<T> | undefined {
    return this.edgesMap.get(Graph.serializeEdgeKey(fromVertexKey, toVertexKey));
  }

  public hasVertex(key: Vertex<T>['key']): boolean {
    return this.verticesMap.has(key);
  }

  public hasEdge(fromVertexKey: Vertex<T>['key'], toVertexKey: Vertex<T>['key']): boolean {
    return this.edgesMap.has(Graph.serializeEdgeKey(fromVertexKey, toVertexKey));
  }

  public removeVertex(key: Vertex<T>['key']): Vertex<T> | undefined {
    const removedVertex = this.getVertex(key);
    if (removedVertex) {
      const set = this.adjacencyList.get(key);
      if (set) {
        // Removing all all edges connecting to this vertex:
        set.forEach(connectedVertexKey => {
          const connectedEdges = this.adjacencyList.get(connectedVertexKey);
          if (connectedEdges) {
            connectedEdges.delete(key);
            this.removeEdge(key, connectedVertexKey);
          }
        });
      }
      this.verticesMap.delete(key);
      this.adjacencyList.delete(key);
    }
    return removedVertex;
  }

  public removeEdge(fromVertexKey: Vertex<T>['key'], toVertexKey: Vertex<T>['key']): Edge<T> | undefined {
    // Checking if the vertices exist in the list.
    const shouldRemoveEdge = (
      this.hasVertex(fromVertexKey) &&
      this.hasVertex(toVertexKey)
    );
    if (shouldRemoveEdge) {
      this.adjacencyList.get(fromVertexKey)!.delete(toVertexKey);
      const outgoingEdgeKey = Graph.serializeEdgeKey(fromVertexKey, toVertexKey);
      const removedEdge = this.edgesMap.get(outgoingEdgeKey)
      this.edgesMap.delete(Graph.serializeEdgeKey(fromVertexKey, toVertexKey));
      if (!this.isDirectedGraph) {
        this.adjacencyList.get(toVertexKey)!.delete(fromVertexKey);
        const incomingEdgeKey = Graph.serializeEdgeKey(toVertexKey, fromVertexKey);
        this.edgesMap.delete(incomingEdgeKey);
      }
      return removedEdge;
    }
    return undefined;
  }

  public clear(): Graph<T> {
    this.verticesMap.clear();
    this.edgesMap.clear();
    this.adjacencyList.clear();
    return this;
  }

  public traversal: IGraph<T>['traversal'];

  /**
   * Breadth First Traversal of the graph. Returns every
   * vertex that is connected (directly or indirectly) to the starting
   * vertex.
   * @param key - Vertex identifier.
   * @param callback - Optional callback invoked on every level of the BF traversal. All of the  vertices of the level as well as the depth are passed as parameters.
   */
  private _breadthFirstTraversal<U = unknown>(key: Vertex<T>['key'], callback?: (adjacentVertices: Vertex<T>[], depth: number) => U): Vertex<T>[] {
    if (!this.hasVertex(key)) { return []; }

    const startingVertex = this.getVertex(key)!;
    const visitedVerticesHashTable: Record<Vertex<T>['key'], null> = {}; // Cache hash table.
    const queue: Array<Vertex<T>[]> = [];

    // The starting vertex of the traversal always starts at depth zero.
    // The traversal will begin here and the vertex will be flagged as visited.
    let depth = 0;
    let vertices = [startingVertex];

    queue.push(vertices); // TODO: Add a Queue data-structure

    if (callback) { callback(vertices, depth); }

    visitedVerticesHashTable[startingVertex.key] = null;

    while (queue.length > 0) {
      const level = queue.shift()!;
      const adjacentVertices: Vertex<T>[] = [];
      level.forEach((vertex) => {
        const edges = this.adjacencyList.get(vertex.key)!;
        edges.forEach(vertexKey => {
          if (!(vertexKey in visitedVerticesHashTable)) {
            visitedVerticesHashTable[vertexKey] = null;
            const vertex = this.getVertex(vertexKey)!;
            adjacentVertices.push(vertex);
          }
        });
        queue.push(adjacentVertices);
      });
      vertices = vertices.concat(adjacentVertices);
      if (adjacentVertices.length && callback) {
        depth += 1;
        callback(adjacentVertices, depth);
      }
    }

    return vertices;
  }

  /**
   * Depth First Traversal of the graph. Returns every
   * vertex that is connected (directly or indirectly) to the starting
   * vertex.
   * @param key - Vertex identifier.
   * @param callback - Optional callback invoked on every vertex of the DF traversal.
   */
  private _depthFirstTraversal<U = unknown>(key: Vertex<T>['key'], callback?: (vertex: Vertex<T>) => U): Vertex<T>[] {
    if (!this.hasVertex(key)) { return []; }

    const vertices: Vertex<T>[] = [];
    const visitedVerticesHashTable: Record<Vertex<T>['key'], null> = {}; // Cache hash table.

    const traverse = (vertexKey: Vertex<T>['key']): void => {
      const edges = this.adjacencyList.get(vertexKey);
      const vertex = this.getVertex(vertexKey);
      if (vertex) {
        vertices.push(vertex);
        visitedVerticesHashTable[vertexKey] = null;
        if (callback) { callback(vertex); }
        if (!edges || edges.size === 0) { return; }
        edges.forEach(connectedVertexKey => {
          // If the connected vertex is not in the results list (not visited)
          if (!(connectedVertexKey in visitedVerticesHashTable)) {
            traverse(connectedVertexKey);
          }
        });
      }
    };

    traverse(key);

    return vertices;
  }
}
