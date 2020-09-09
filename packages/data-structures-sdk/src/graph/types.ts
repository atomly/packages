export interface Vertex<T = unknown> {
  /**
   * Unique identifier of the vertex.
   */
  key: string;

  /**
   * Value of the vertex.
   */
  value?: T;
}

export interface Edge<T> {
  /**
   * Unique identifier of the edge.
   */
  key: string;

  /**
   * Unique identifier of the starting vertex.
   */
  from: Vertex<T>['key'];

  /**
   * Unique identifier of the ending vertex.
   */
  to: Vertex<T>['key'];

  /**
   * 
   */
  weight?: number;
}

/**
 * TODOs for v1:
 *  - [x] Add interface for weighted edges.
 *  - [x] Add support for weighted graphs by implementing weighted edges, this should be
 *        optional by default by having all edges be the same default value.
 *  - [x] Add support for directed graph, this should be optional and undirected by default.
 *  - [x] Add `hasVertex` API.
 *  - [x] Add `hasEdge` API.
 *  - [x] Add `clear` method to clear all vertices and edges.
 *  - [x] Refactor `addVertex` API to send a `key` parameter and an optional `value` parameter
 *    instead of just one parameter structured as a `Vertex`.
 *  - [x] Add optional callback on discovered array of vertices AND their depth to the
 *    `breadthFirstTraversal` method.
 *  - [x] Add optional callback on discovered vertex to the `depthFirstTraversal` method.
 *  - [x] Add `traversal` API to better scale up the different ways of Graph Traversal within the class.
 *        This API should work with enums to decide which method of traversal to use.
 *  - [x] Add `getVertex` API.
 *  - [x] Add `getEdge` API.
 *  - [ ] Make the edges map a private member.
 * 
 * TODOs for v2:
 *  - [ ] Add internal Djikstra's Algorithm to find the shortest path between two vertices,
 *    this will be used by the `query` API.
 *  - [ ] Add `query` API to query if certain vertices are connected, or filtering by weight
 *    (i.e. added/accumulated weight), or resolving all vertices connected to a
 *    certain vertex (although the traversals already achieve this). 
 *  - [ ] Add events on vertex added, on vertex removed, on edge added, and on edge removed.
 *  - [ ] Maybe add support for Graph Traversal caching.
 */
export interface IGraph<T = unknown> {
  /**
   * Parameterized member that decides whether the graph is undirected or directed. Defaults to false.
   */
  isDirectedGraph: boolean;

  /**
   * Map of vertices mapped to their respective keys. A map is needed to avoid circular
   * vertices within the adjacency list values. Using a JavaScript `Map` to take advantage
   * of the extra functionalities such as `Map<T>.size`, etc.
   */
  verticesMap: Map<Vertex<T>['key'], Vertex<T>>;

  /**
   * Map of edges mapped to their respective keys. Using a JavaScript `Map` to take advantage
   * of the extra functionalities such as `Map<T>.size`, etc.
   */
  edgesMap: Map<Edge<T>['key'], Edge<T>>;

  /**
   * List of vertex keys stored with nested arrays that represent the edges from
   * the respective vertices.
   *
   * Using a JavaScript `Map` for the keys (origin vertex) to take advantage of the
   * extra functionalities such as `Map<T>.size`, etc.
   *
   * Using JavaScript `Set` for the values (connected edges) data structures to make sure
   * that these edges are unique and respective to the interconnected vertices.
   */
  adjacencyList: Map<Vertex<T>['key'], Set<Edge<T>['key']>>;

  /**
   * Adds a vertex to the vertices map, and its key to the adjacency list setting
   * its edges to be an empty array. Returns the graph.
   * @param vertex - Vertex to be added.
   */
  addVertex(key: Vertex<T>['key'], value: Vertex<T>['value']): Vertex<T>;

  /**
   * Add an edge between two vertices. Returns `false` if any of the vertex
   * identifiers are invalid, otherwise returns `true` if the vertices were connected
   * correctly.
   * @param fromVertexKey - (from) Vertex identifier.
   * @param toVertexKey - (to) Vertex identifier.
   */
  addEdge(fromVertexKey: Vertex<T>['key'], toVertexKey: Vertex<T>['key'], weight: Edge<T>['weight']): boolean; // TODO: Add optional weights parameter

  /**
   * Gets a vertex related to the passed identifier.
   * @param key - Vertex identifier.
   */
  getVertex(key: Vertex<T>['key']): Vertex<T> | undefined;

  /**
   * Gets an edge related to the passed identifier.
   * @param fromVertexKey - (from) Vertex identifier.
   * @param toVertexKey - (to) Vertex identifier.
   */
  getEdge(fromVertexKey: Vertex<T>['key'], toVertexKey: Vertex<T>['key']): Edge<T> | undefined;
  
  /**
   * Checks if a vertex related to the passed identifier exists.
   * @param key - Vertex identifier.
   */
  hasVertex(key: Vertex<T>['key']): boolean;

  /**
   * Checks if an edge related to the passed identifier exists.
   * @param fromVertexKey - (from) Vertex identifier.
   * @param toVertexKey - (to) Vertex identifier.
   */
  hasEdge(fromVertexKey: Vertex<T>['key'], toVertexKey: Vertex<T>['key']): boolean;

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
  removeEdge(fromVertexKey: Vertex<T>['key'], toVertexKey: Vertex<T>['key']): Edge<T> | undefined;

  /**
   * Clears all vertices and edges from the graph. Returns the graph object.
   */
  clear(): IGraph<T>;

  /**
   * Traversal API. Contains **Breadth First** and **Depth First** traversal of the graph functions.
   * These returns every vertex that is connected (directly or indirectly) to the starting vertex.
   */
  traversal: {
    breadthFirst<U = unknown>(key: Vertex<T>['key'], callback?: (adjacentVertices: Vertex<T>[], depth: number) => U): Vertex<T>[];
    depthFirst<U = unknown>(key: Vertex<T>['key'], callback?: (vertex: Vertex<T>) => U): Vertex<T>[];
  };
}
