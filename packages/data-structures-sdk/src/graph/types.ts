export interface Vertex<T = unknown> {
  /**
   * Unique identifier of the vertex.
   */
  key: string;

  /**
   * Value of the vertex.
   */
  value: T;
}0

/**
 * TODOs:
 *  - Add interface for weighted edges.
 *  - Add support for directed graph, this should be optional and undirected by default.
 *  - Add `clear` method to clear all vertices and edges.
 *  - Add `hasEdge` method to the graph.
 *  - Add `hasVertex` method to the graph.
 *  - Add optional callback on discovered vertex to the `breadthFirstTraversal` method.
 *  - Add optional callback on discovered array of vertices AND their depth to the
 *    `depthFirstTraversal` method.
 *  - Add internal Djikstra's Algorithm to find the shortest path between two vertices,
 *    this will be used by the `query` API.
 *  - Add `query` API to query if certain vertices are connected, or filtering by weight
 *    (i.e. added/accumulated weight), or resolving all vertices connected to a
 *    certain vertex (although the traversals already achieve this). 
 *  - Add events on vertex added, on vertex removed, on edge added, and on edge removed.
 */
export interface IGraph<T = unknown> {
  /**
   * Boolean member that decides whether the results of the graph traversals
   * should be cached.
   */
  shouldCacheTraversals: boolean;

  /**
   * Map of vertices mapped to their respective keys. A map is needed to avoid circular
   * vertices within the adjacency list values. Using a JavaScript `Map` to take advantage
   * of the extra functionalities such as `Map<T>.size`, etc.
   */
  verticesMap: Map<Vertex<T>['key'], Vertex<T>>;

  /**
   * List of vertex keys stored with nested arrays that represent the edges from
   * the respective vertices.
   *
   * Using a JavaScript `Map` for the keys (origin vertex) to take advantage of the
   * extra functionalities such as `Map<T>.size`, etc.
   *
   * Using JavaScript `Set` for the values (connected edges) data structures to make sure
   * that the edges are unique respective to the interconnected vertices.
   */
  adjacencyList: Map<Vertex<T>['key'], Set<Vertex<T>['key']>>;

  /**
   * Cache of depth first traversal results mapped to the respective origin vertex key.
   * The respective cached results are removed at any time that the origin vertex edges change.
   */
  depthFirstTraversalCache?: Map<T, Vertex<T>[]>;

  /**
   * Cache of depth first traversal results mapped to the respective origin vertex key.
   * The respective cached results are removed at any time that the origin vertex edges change.
   */
  breadthFirstTraversalCache?: Map<T, Vertex<T>[]>;

  /**
   * Adds a vertex to the vertices map, and its key to the adjacency list setting
   * its edges to be an empty array. Returns the graph.
   * @param vertex - Vertex to be added.
   */
  addVertex(vertex: Vertex<T>): IGraph<T>;

  /**
   * Add an edge between two vertices. Returns `false` if any of the vertex
   * identifiers are invalid, otherwise returns `true` if the vertices were connected
   * correctly.
   * @param fromVertexKey - (from) Vertex identifier.
   * @param toVertexKey - (to) Vertex identifier.
   */
  addEdge(fromVertexKey: Vertex<T>['key'], toVertexKey: Vertex<T>['key']): boolean; // TODO: Add optional weights parameter

  /**
   * Removes a vertex and all edges connecting to this vertex. Returns `undefined` if the
   * key is invalid, otherwise the removed vertex is returned.
   * @param key - Vertex identifier.
   */
  removeVertex(key: Vertex<T>['key']): Vertex<T> | undefined;

  /**
   * Remove an edge between two vertices. Returns `false` if any of the vertex
   * identifiers are invalid, otherwise returns `true` if the edge was removed correctly.
   * @param fromVertexKey - (from) Vertex identifier.
   * @param toVertexKey - (to) Vertex identifier.
   */
  removeEdge(fromVertexKey: Vertex<T>['key'], toVertexKey: Vertex<T>['key']): boolean;

  // TODO: hasEdge

  // TODO: hasVertex

  /**
   * Breath First Recursive Traversal of the graph. Returns every
   * vertex that is connected (directly or indirectly) to the starting
   * vertex.
   * @param key - Vertex identifier.
   */
  breadthFirstTraversal(key: Vertex<T>['key']): Vertex<T>[];

  /**
   * Depth First Recursive Traversal of the graph. Returns every
   * vertex that is connected (directly or indirectly) to the starting
   * vertex.
   * @param key - Vertex identifier.
   */
  depthFirstTraversal(key: Vertex<T>['key']): Vertex<T>[];
}
