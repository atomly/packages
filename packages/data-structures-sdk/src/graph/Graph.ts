// Types
import { IGraph, IEdge } from './types';

// Dependencies
import {
  __DEFAULT_EDGE_WEIGHT,
  __DEFAULT_IS_DIRECTED_GRAPH,
} from './constants';
import { Vertex } from './Vertex';
import { Edge } from './Edge';
import { EdgesMap } from './EdgesMap';

/**
 * Graph data structure using an adjacency list to store edges. The graph can be configured
 * to be a combination of the following: undirectional or directional, and unweighted or weighted.
 * **Please note** that if the graph is unweighted, the internal Djikstra's Algorithm will not return
 * any nodes.
 */
export class Graph<T> implements IGraph<T> {
  static __DEFAULT_EDGE_WEIGHT = __DEFAULT_EDGE_WEIGHT;

  static __DEFAULT_IS_DIRECTED_GRAPH = __DEFAULT_IS_DIRECTED_GRAPH;

  static Vertex = Vertex

  static Edge = Edge

  public isDirectedGraph: boolean;

  public verticesMap: Map<Vertex<T>['key'], Vertex<T>>;

  public edgesMap: EdgesMap<T>;

  protected adjacencyList: Map<Vertex<T>['key'], Set<Vertex<T>['key']>>;

  constructor(args: {
    isDirectedGraph?: boolean;
    vertices?: Vertex<T>[];
    edges?: IEdge<T>[];
  } = {}) {
    // Setting up the graph "metadata" configuration:
    this.isDirectedGraph = args.isDirectedGraph ?? Graph.__DEFAULT_IS_DIRECTED_GRAPH;
    // Instantiating adjacency list:
    this.adjacencyList = new Map();
    // Instantiating and binding maps of vertices and edges:
    this.verticesMap = new Map();
    if (args.vertices) {
      args.vertices.forEach(vertex => {
        this.addVertex(vertex.key, vertex.value);
      });
    }
    this.edgesMap = new EdgesMap();
    if (args.edges) {
      args.edges.forEach(edge => {
        this.addEdge(edge.from, edge.to, edge.weight);
      });
    }
    // Binding traversals:
    this.traversal = {
      breadthFirst: this._breadthFirstTraversal.bind(this),
      depthFirst: this._depthFirstTraversal.bind(this),
    };
  }

  public addVertex(key: Vertex<T>['key'], value: Vertex<T>['value']): Vertex<T> {
    const vertex = new Vertex(key, value);
    this.verticesMap.set(vertex.key, vertex);
    if (!this.adjacencyList.get(vertex.key)) {
      this.adjacencyList.set(vertex.key, new Set<Vertex<T>['key']>());
    }
    return vertex;
  }

  public addEdge(
    fromVertexKey: Vertex<T>['key'],
    toVertexKey: Vertex<T>['key'],
    weight: IEdge<T>['weight'] = Graph.__DEFAULT_EDGE_WEIGHT,
  ): IEdge<T> | undefined {
    // Checking if the vertices exist and if the edge already exists.
    const shouldAddEdge = (
      this.hasVertex(fromVertexKey) &&
      this.hasVertex(toVertexKey) &&
      !this.edgesMap.hasEdge(fromVertexKey, toVertexKey)
    );
    // Using JavaScript `Set` data structures to make sure that the edges
    // are unique respective to the interconnected vertices.
    if (shouldAddEdge) {
      this.adjacencyList.get(fromVertexKey)!.add(toVertexKey);
      // Adding the outgoing Edge:
      const addedEdge = this.edgesMap.addEdge(fromVertexKey, toVertexKey, weight);
      // If it's NOT a directed graph, also add the incoming Edge:
      if (!this.isDirectedGraph) {
        this.adjacencyList.get(toVertexKey)!.add(fromVertexKey);
        this.edgesMap.addEdge(toVertexKey, fromVertexKey, weight);
      }
      return addedEdge;
    }
    return undefined;
  }

  public getVertex(key: Vertex<T>['key']): Vertex<T> | undefined {
    return this.verticesMap.get(key);
  }

  public getEdge(fromVertexKey: Vertex<T>['key'], toVertexKey: Vertex<T>['key']): IEdge<T> | undefined {
    return this.edgesMap.getEdge(fromVertexKey, toVertexKey);
  }

  public hasVertex(key: Vertex<T>['key']): boolean {
    return this.verticesMap.has(key);
  }

  public hasEdge(fromVertexKey: Vertex<T>['key'], toVertexKey: Vertex<T>['key']): boolean {
    return this.edgesMap.hasEdge(fromVertexKey, toVertexKey);
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

  public removeEdge(fromVertexKey: Vertex<T>['key'], toVertexKey: Vertex<T>['key']): IEdge<T> | undefined {
    // Checking if the vertices exist in the list.
    const shouldRemoveEdge = (
      this.hasVertex(fromVertexKey) &&
      this.hasVertex(toVertexKey)
    );
    if (shouldRemoveEdge) {
      this.adjacencyList.get(fromVertexKey)!.delete(toVertexKey);
      const removedEdge = this.edgesMap.removeEdge(fromVertexKey, toVertexKey);
      if (!this.isDirectedGraph) {
        this.adjacencyList.get(toVertexKey)!.delete(fromVertexKey);
        this.edgesMap.removeEdge(toVertexKey, fromVertexKey);
      }
      return removedEdge;
    }
    return undefined;
  }

  public updateVertexValue(key: Vertex<T>['key'], value: Vertex<T>['value']): Vertex<T> | undefined {
    const updatedVertex = this.getVertex(key);
    if (updatedVertex) {
      updatedVertex.value = value;
      return updatedVertex;
    }
    return undefined;
  }

  public clear(): Graph<T> {
    this.verticesMap.clear();
    this.edgesMap.clear();
    this.adjacencyList.clear();
    return this;
  }

  public values(): { vertices: Vertex<T>[], edges: IEdge<T>[] } {
    return {
      vertices: Array.from(this.verticesMap.values()),
      edges: this.edgesMap.values(),
    };
  }

  public traversal: IGraph<T>['traversal'];

  /**
   * Breadth First Traversal of the graph. Returns every
   * vertex that is connected (directly or indirectly) to the starting
   * vertex.
   * @param key - Vertex identifier.
   * @param callback - Optional callback invoked on every level of the BF traversal. All of the  vertices of the level as well as the depth are passed as parameters.
   */
  protected _breadthFirstTraversal<U = unknown>(key: Vertex<T>['key'], callback?: (adjacentVertices: Vertex<T>[], depth: number) => U): Vertex<T>[] {
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
  protected _depthFirstTraversal<U = unknown>(key: Vertex<T>['key'], callback?: (vertex: Vertex<T>) => U): Vertex<T>[] {
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
