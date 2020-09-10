export interface IVertex<T = unknown> {
  /**
   * Unique identifier of the vertex.
   */
  key: string;

  /**
   * Value of the vertex.
   */
  value?: T;
}

export interface IEdge<T> {
  /**
   * Unique identifier of the starting vertex.
   */
  from: IVertex<T>['key'];

  /**
   * Unique identifier of the ending vertex.
   */
  to: IVertex<T>['key'];

  /**
   * 
   */
  weight?: number;
}

export interface IEdgesMap<T> {
  from: {
    // (unique) IEdge<T>['from] -> (unique) IEdge<T>['to'][]
    [key: string]: {
      to: {
        [key: string]: IEdge<T>;
      }
    }
  };

  /**
   * Add an edge between two vertices. Returns `false` if any of the vertex
   * identifiers are invalid, otherwise returns `true` if the vertices were connected
   * correctly.
   * @param fromVertexKey - (from) Vertex identifier.
   * @param toVertexKey - (to) Vertex identifier.
   */
  addEdge(fromVertexKey: IVertex<T>['key'], toVertexKey: IVertex<T>['key'], weight: IEdge<T>['weight']): IEdge<T>; // TODO: Add optional weights parameter


  /**
   * Gets an edge related to the passed identifier.
   * @param fromVertexKey - (from) Vertex identifier.
   * @param toVertexKey - (to) Vertex identifier.
   */
  getEdge(fromVertexKey: IVertex<T>['key'], toVertexKey: IVertex<T>['key']): IEdge<T> | undefined;


  /**
   * Checks if an edge related to the passed identifier exists.
   * @param fromVertexKey - (from) Vertex identifier.
   * @param toVertexKey - (to) Vertex identifier.
   */
  hasEdge(fromVertexKey: IVertex<T>['key'], toVertexKey: IVertex<T>['key']): boolean;

  /**
   * Remove an edge between two vertices. Returns `undefined` if any of the vertex
   * identifiers are invalid, otherwise returns the edge that was removed correctly.
   * @param fromVertexKey - (from) Vertex identifier.
   * @param toVertexKey - (to) Vertex identifier.
   */
  removeEdge(fromVertexKey: IVertex<T>['key'], toVertexKey: IVertex<T>['key']): IEdge<T> | undefined;

  /**
   * Clears all edges from the map. Returns the map object.
   */
  clear(): IEdgesMap<T>;

  /**
   * Returns an array for all of the edges stored in the map.
   */
  values(): IEdge<T>[];
}

/**
 * TODOs for v2:
 *  - [ ] Add an optimized `Queue` data structure for the traversals.
 *  - [ ] Add internal Djikstra's Algorithm to find the shortest path between two vertices,
 *    this will be used by the `query` API (this will need a `PriorityQueue` data structure).
 *  - [ ] Add internal Bellman-Ford algorithm, similar to Djikstra's Algorithm except it supports
 *    negative edge weights and edge weights equal to zero.
 *  - [ ] Add `query` API to: query if certain vertices are connected, or filtering by weight
 *    (i.e. added/accumulated weight), or resolving all vertices connected to a certain vertex
 *    (although the traversals already achieve this, so maybe merge both APIs?). 
 *  - [ ] Add events on vertex added, on vertex removed, on edge added, and on edge removed.
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
  verticesMap: Map<IVertex<T>['key'], IVertex<T>>;

  /**
   * Map of edges mapped from their starting vertices to their destination vertices.
   */
  edgesMap: IEdgesMap<T>;

  /**
   * Adds a vertex to the vertices map, and its key to the adjacency list setting
   * its edges to be an empty array. Returns the graph.
   * @param vertex - Vertex to be added.
   */
  addVertex(key: IVertex<T>['key'], value: IVertex<T>['value']): IVertex<T>;

  /**
   * Add an edge between two vertices. Returns `false` if any of the vertex
   * identifiers are invalid, otherwise returns `true` if the vertices were connected
   * correctly.
   * @param fromVertexKey - (from) Vertex identifier.
   * @param toVertexKey - (to) Vertex identifier.
   */
  addEdge(fromVertexKey: IVertex<T>['key'], toVertexKey: IVertex<T>['key'], weight: IEdge<T>['weight']): IEdge<T> | undefined;

  /**
   * Gets a vertex related to the passed identifier.
   * @param key - Vertex identifier.
   */
  getVertex(key: IVertex<T>['key']): IVertex<T> | undefined;

  /**
   * Gets an edge related to the passed identifier.
   * @param fromVertexKey - (from) Vertex identifier.
   * @param toVertexKey - (to) Vertex identifier.
   */
  getEdge(fromVertexKey: IVertex<T>['key'], toVertexKey: IVertex<T>['key']): IEdge<T> | undefined;

  /**
   * Checks if a vertex related to the passed identifier exists.
   * @param key - Vertex identifier.
   */
  hasVertex(key: IVertex<T>['key']): boolean;

  /**
   * Checks if an edge related to the passed identifier exists.
   * @param fromVertexKey - (from) Vertex identifier.
   * @param toVertexKey - (to) Vertex identifier.
   */
  hasEdge(fromVertexKey: IVertex<T>['key'], toVertexKey: IVertex<T>['key']): boolean;

  /**
   * Removes a vertex and all edges connecting to this vertex. Returns `undefined` if the
   * key is invalid, otherwise the removed vertex is returned.
   * @param key - Vertex identifier.
   */
  removeVertex(key: IVertex<T>['key']): IVertex<T> | undefined;

  /**
   * Remove an edge between two vertices. Returns `false` if any of the vertex
   * identifiers are invalid, otherwise returns the edge that was removed correctly.
   * @param fromVertexKey - (from) Vertex identifier.
   * @param toVertexKey - (to) Vertex identifier.
   */
  removeEdge(fromVertexKey: IVertex<T>['key'], toVertexKey: IVertex<T>['key']): IEdge<T> | undefined;

  /**
   * Updates a vertex related to the passed identifier with a new value.
   * @param key - Vertex identifier.
   */
  updateVertexValue(key: IVertex<T>['key'], value: IVertex<T>['value']): IVertex<T> | undefined;

  /**
   * Clears all vertices and edges from the graph. Returns the graph object.
   */
  clear(): IGraph<T>;

  /**
   * Returns an object of all of the vertices and edges stored in the graph.
   */
  values(): { vertices: IVertex<T>[], edges: IEdge<T>[] };

  /**
   * Traversal API. Contains **Breadth First** and **Depth First** traversal of the graph functions.
   * These returns every vertex that is connected (directly or indirectly) to the starting vertex.
   */
  traversal: {
    breadthFirst<U = unknown>(key: IVertex<T>['key'], callback?: (adjacentVertices: IVertex<T>[], depth: number) => U): IVertex<T>[];
    depthFirst<U = unknown>(key: IVertex<T>['key'], callback?: (vertex: IVertex<T>) => U): IVertex<T>[];
  };
}
