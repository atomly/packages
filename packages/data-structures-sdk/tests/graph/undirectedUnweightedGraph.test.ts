// Libraries
import faker from 'faker';

// Dependencies
import { Graph, Vertex } from '../../src';

//
// TYPES
//

interface Question {
  id: string;
  type: 'question';
  value: string;
}

interface Answer {
  id: string;
  type: 'answer';
  value: string;
}

interface Final {
  id: string;
  type: 'end';
  value: string;
}

//
// FIXTURES
//

const vertices = [
  // First question and its answers:
  {
    key: 'Foo.A',
    value: { id: faker.random.uuid(), type: 'question', value: faker.random.words() },
  },
  {
    key: '1.A',
    value: { id: faker.random.uuid(), type: 'answer', value: faker.random.words() },
  },
  {
    key: '2.A',
    value: { id: faker.random.uuid(), type: 'answer', value: faker.random.words() },
  },
  {
    key: '3.A',
    value: { id: faker.random.uuid(), type: 'answer', value: faker.random.words() },
  },
  // Second question and its answers:
  {
    key: 'Foo.B',
    value: { id: faker.random.uuid(), type: 'question', value: faker.random.words() },
  },
  {
    key: '1.B',
    value: { id: faker.random.uuid(), type: 'answer', value: faker.random.words() },
  },
  {
    key: '2.B',
    value: { id: faker.random.uuid(), type: 'answer', value: faker.random.words() },
  },
  // Third question and its answers:
  {
    key: 'Foo.C',
    value: { id: faker.random.uuid(), type: 'question', value: faker.random.words() },
  },
  {
    key: '1.C',
    value: { id: faker.random.uuid(), type: 'answer', value: faker.random.words() },
  },
  {
    key: '2.C',
    value: { id: faker.random.uuid(), type: 'answer', value: faker.random.words() },
  },
  {
    key: '3.C',
    value: { id: faker.random.uuid(), type: 'answer', value: faker.random.words() },
  },
  {
    key: '4.C',
    value: { id: faker.random.uuid(), type: 'answer', value: faker.random.words() },
  },
  // Fourth question and its answers:
  {
    key: 'Foo.D',
    value: { id: faker.random.uuid(), type: 'question', value: faker.random.words() },
  },
  {
    key: '1.D',
    value: { id: faker.random.uuid(), type: 'answer', value: faker.random.words() },
  },
  {
    key: '2.D',
    value: { id: faker.random.uuid(), type: 'answer', value: faker.random.words() },
  },
  // Fifth question and its answers:
  {
    key: 'Foo.E',
    value: { id: faker.random.uuid(), type: 'question', value: faker.random.words() },
  },
  {
    key: '1.E',
    value: { id: faker.random.uuid(), type: 'answer', value: faker.random.words() },
  },
  {
    key: '2.E',
    value: { id: faker.random.uuid(), type: 'answer', value: faker.random.words() },
  },
  {
    key: '3.E',
    value: { id: faker.random.uuid(), type: 'answer', value: faker.random.words() },
  },
  // Final vertex:
  {
    key: 'Bar',
    value: { id: faker.random.uuid(), type: 'end', value: faker.random.words() },
  },
];

const edges = [ // Array of unique edges
  { from: 'Foo.A', to: '1.A' },
  { from: 'Foo.A', to: '2.A' },
  { from: 'Foo.A', to: '3.A' },
  { from: '1.A', to: 'Foo.B' },
  { from: '2.A', to: 'Foo.B' },
  { from: '3.A', to: 'Foo.C' },
  { from: 'Foo.B', to: '1.B' },
  { from: 'Foo.B', to: '2.B' },
  { from: 'Foo.C', to: '1.C' },
  { from: 'Foo.C', to: '2.C' },
  { from: 'Foo.C', to: '3.C' },
  { from: 'Foo.C', to: '4.C' },
  { from: '1.B', to: 'Foo.D' },
  { from: '2.B', to: 'Foo.C' },
  { from: '1.C', to: 'Foo.E' },
  { from: '2.C', to: 'Foo.E' },
  { from: '3.C', to: 'Bar' },
  // { from: '4.C', to: 'Foo.A' },
  { from: 'Foo.D', to: '1.D' },
  { from: 'Foo.D', to: '2.D' },
  { from: '1.D', to: 'Bar' },
  { from: '2.D', to: 'Foo.E' },
  { from: 'Foo.E', to: '1.E' },
  { from: 'Foo.E', to: '2.E' },
  { from: 'Foo.E', to: '3.E' },
  { from: '1.E', to: 'Bar' },
  { from: '2.E', to: 'Bar' },
  { from: '3.E', to: 'Bar' },
];

/**
 * Based on surveys offered and hosted by [SurveyShark](http://surveyshark.app).
 */
const surveyGraph = new Graph<Question | Answer | Final>();

describe('Undirected & Unweighted Graph works correctly', () => {
  it('should add a vertex correctly', () => {
    const vertexKey = 'Foo.A';
    const vertexValue: Question = {
      id: faker.random.uuid(),
      type: 'question',
      value: faker.random.words(),
    };
    surveyGraph.addVertex(
      vertexKey,
      vertexValue,
    );
    expect(surveyGraph.verticesMap.get(vertexKey)).toMatchObject({ key: vertexKey, value: vertexValue });
    expect(surveyGraph.adjacencyList.get(vertexKey)).toMatchObject(new Set());
    expect(surveyGraph.adjacencyList.size).toBe(1);
  });

  it('should NOT duplicate already added vertices', () => {
    const vertexKey = 'Foo.A';
    const vertexValue: Question = {
      id: faker.random.uuid(),
      type: 'question',
      value: faker.random.words(),
    };
    surveyGraph.addVertex(
      vertexKey,
      vertexValue,
    );
    expect(surveyGraph.verticesMap.get(vertexKey)).toMatchObject({ key: vertexKey, value: vertexValue });
    expect(surveyGraph.adjacencyList.get(vertexKey)).toMatchObject(new Set());
    expect(surveyGraph.adjacencyList.size).toBe(1);
  });

  it('should add multiple vertex correctly (edges will be added later)', () => {
    vertices.forEach(vertex => {
      surveyGraph.addVertex(vertex.key, vertex.value as Question | Answer | Final);
    })
    expect(surveyGraph.verticesMap.size).toBe(vertices.length);
    expect(surveyGraph.adjacencyList.size).toBe(vertices.length);
  });

  it('should add edges', () => {
    const edges = [
      { from: 'Foo.A', to: '1.A' },
      { from: 'Foo.A', to: '2.A' },
      { from: 'Foo.A', to: '3.A' },
    ];
    edges.forEach(edge => {
      const isAdded = surveyGraph.addEdge(edge.from, edge.to);
      expect(isAdded).toBe(true);
    });
    expect(surveyGraph.adjacencyList.get('Foo.A')!.size).toBe(edges.length);
  });

  it('should NOT add edges for vertices that don\'t exist', () => {
    const edges = [
      { from: faker.random.uuid(), to: faker.random.uuid() },
      { from: faker.random.uuid(), to: faker.random.uuid() },
      { from: faker.random.uuid(), to: faker.random.uuid() },
    ];
    edges.forEach(edge => {
      const isAdded = surveyGraph.addEdge(edge.from, edge.to);
      expect(isAdded).toBe(false);
    });
  });

  it('should NOT duplicate already added edges', () => {
    const edges = [
      { from: 'Foo.A', to: '1.A' },
      { from: 'Foo.A', to: '2.A' },
      { from: 'Foo.A', to: '3.A' },
    ];
    edges.forEach(edge => {
      const isAdded = surveyGraph.addEdge(edge.from, edge.to);
      expect(isAdded).toBe(true);
    });
    expect(surveyGraph.adjacencyList.get('Foo.A')!.size).toBe(edges.length);
  });

  it('should add multiple edges', () => {
    const edges = [ // Array of unique edges
      { from: 'Foo.A', to: '1.A' },
      { from: 'Foo.A', to: '2.A' },
      { from: 'Foo.A', to: '3.A' },
      { from: '1.A', to: 'Foo.B' },
      { from: '2.A', to: 'Foo.B' },
      { from: '3.A', to: 'Foo.C' },
      { from: 'Foo.B', to: '1.B' },
      { from: 'Foo.B', to: '2.B' },
      { from: 'Foo.C', to: '1.C' },
      { from: 'Foo.C', to: '2.C' },
      { from: 'Foo.C', to: '3.C' },
      { from: 'Foo.C', to: '4.C' },
      { from: '1.B', to: 'Foo.D' },
      { from: '2.B', to: 'Foo.C' },
      { from: '1.C', to: 'Foo.E' },
      { from: '2.C', to: 'Foo.E' },
      { from: '3.C', to: 'Bar' },
      // { from: '4.C', to: 'Foo.A' },
      { from: 'Foo.D', to: '1.D' },
      { from: 'Foo.D', to: '2.D' },
      { from: '1.D', to: 'Bar' },
      { from: '2.D', to: 'Foo.E' },
      { from: 'Foo.E', to: '1.E' },
      { from: 'Foo.E', to: '2.E' },
      { from: 'Foo.E', to: '3.E' },
      { from: '1.E', to: 'Bar' },
      { from: '2.E', to: 'Bar' },
      { from: '3.E', to: 'Bar' },
    ];
    // Adding edges:
    edges.forEach(edge => {
      surveyGraph.addEdge(edge.from, edge.to);
    });
    // Counting unique vertices:
    const uniqueAmountOfVertices = edges.reduce(
      (acc, edge) => {
        acc.add(edge.from);
        acc.add(edge.to);
        return acc;
      },
      new Set(),
    ).size;
    // Amount of vertices from the added edges should match to the existing amount of vertices:
    expect(surveyGraph.verticesMap.size).toBe(uniqueAmountOfVertices);
    expect(surveyGraph.adjacencyList.size).toBe(uniqueAmountOfVertices);
    const vertexKeys = Array.from(surveyGraph.adjacencyList.keys());
    // Every vertex should contain the correct amount of respective (added) unique edges:
    vertexKeys.forEach(vertexKey => {
      const addedEges = edges.filter(edge => edge.from === vertexKey || edge.to === vertexKey);
      const adjacentVertexKeys = surveyGraph.adjacencyList.get(vertexKey);
      expect(addedEges).toHaveLength(adjacentVertexKeys!.size);
    });
  });

  it('should NOT duplicate multiple edges that were already added', () => {
    // Adding edges:
    edges.forEach(edge => {
      surveyGraph.addEdge(edge.from, edge.to);
    });
    // Counting unique vertices:
    const uniqueAmountOfVertices = edges.reduce(
      (acc, edge) => {
        acc.add(edge.from);
        acc.add(edge.to);
        return acc;
      },
      new Set(),
    ).size;
    // Amount of vertices from the added edges should match to the existing amount of vertices:
    expect(surveyGraph.verticesMap.size).toBe(uniqueAmountOfVertices);
    expect(surveyGraph.adjacencyList.size).toBe(uniqueAmountOfVertices);
    const vertexKeys = Array.from(surveyGraph.adjacencyList.keys());
    // Every vertex should contain the correct amount of respective (added) unique edges:
    vertexKeys.forEach(vertexKey => {
      const addedEges = edges.filter(edge => edge.from === vertexKey || edge.to === vertexKey);
      const adjacentVertexKeys = surveyGraph.adjacencyList.get(vertexKey);
      expect(addedEges).toHaveLength(adjacentVertexKeys!.size);
    });
  });

  it('should correctly find vertices', () => {
    const vertexKey = 'Foo.A';
    expect(surveyGraph.getVertex(vertexKey)).toBeTruthy();
  });

  it('should NOT find vertices that don\'t exist', () => {
    const vertexKey = faker.random.uuid();
    expect(surveyGraph.getVertex(vertexKey)).toBe(undefined);
  });

  it('should correctly find edges', () => {
    const edges = [
      { from: 'Foo.A', to: '1.A' },
      { from: 'Foo.A', to: '2.A' },
      { from: 'Foo.A', to: '3.A' },
    ];
    edges.forEach(edge => {
      expect(surveyGraph.getEdge(edge.from, edge.to)).toBeTruthy();
      expect(surveyGraph.getEdge(edge.to, edge.from)).toBeTruthy();
    });
  });

  it('should NOT find edges that don\'t exist', () => {
    const edges = [
      { from: faker.random.uuid(), to: faker.random.uuid() },
      { from: faker.random.uuid(), to: faker.random.uuid() },
      { from: faker.random.uuid(), to: faker.random.uuid() },
    ];
    edges.forEach(edge => {
      expect(surveyGraph.getEdge(edge.from, edge.to)).toBe(undefined);
      expect(surveyGraph.getEdge(edge.to, edge.from)).toBe(undefined);
    });
  });

  it('should correctly validate whether a vertex exists', () => {
    // Valid vertex:
    const vertexKey = 'Foo.A';
    expect(surveyGraph.hasVertex(vertexKey)).toBe(true);
    // Invalid vertex:
    const invalidVertexKey = faker.random.uuid();
    expect(surveyGraph.hasVertex(invalidVertexKey)).toBe(false);
  });

  it('should correctly validate whether an edge exists', () => {
    // Valid edges:
    const edges = [
      { from: 'Foo.A', to: '1.A' },
      { from: 'Foo.A', to: '2.A' },
      { from: 'Foo.A', to: '3.A' },
    ];
    edges.forEach(edge => {
      expect(surveyGraph.hasEdge(edge.from, edge.to)).toBe(true);
      expect(surveyGraph.hasEdge(edge.to, edge.from)).toBe(true);
    });
    // Invalid edges:
    const invalidEdges = [
      { from: faker.random.uuid(), to: faker.random.uuid() },
      { from: faker.random.uuid(), to: faker.random.uuid() },
      { from: faker.random.uuid(), to: faker.random.uuid() },
    ];
    invalidEdges.forEach(edge => {
      expect(surveyGraph.hasEdge(edge.from, edge.to)).toBe(false);
      expect(surveyGraph.hasEdge(edge.to, edge.from)).toBe(false);
    });
  });

  it('should correctly return vertices using Breadth First Traversal starting from vertex "Foo.A"', () => {
    const startingVertexKey = 'Foo.A';
    const breadthFirstTraversalVertices = surveyGraph.traversal.breadthFirst(startingVertexKey);
    // console.debug('DEBUG: breadthFirstTraversalVertices: ', breadthFirstTraversalVertices);
    // Should've found all nodes:
    expect(breadthFirstTraversalVertices).toHaveLength(vertices.length);
    // Testing the order of the BF traversal:
    expect(breadthFirstTraversalVertices.map(({ key }) => key)).toMatchObject([
      'Foo.A',
      '1.A',
      '2.A',
      '3.A',
      'Foo.B',
      'Foo.C',
      '1.B',
      '2.B',
      '1.C',
      '2.C',
      '3.C',
      '4.C',
      'Foo.D',
      'Foo.E',
      'Bar',
      '1.D',
      '2.D',
      '1.E',
      '2.E',
      '3.E',
    ]);
  });

  it('should correctly invoke the callback during the previous BF traversal', () => {
    const startingVertexKey = 'Foo.A';
    const onLevelCallback = jest.fn((vertices: Vertex<Question | Answer | Final>[], depth: number) => {
      expect(vertices).toBeInstanceOf(Array);
      expect(vertices.length).toBeGreaterThan(0);
      expect(vertices[0].key).toBeTruthy();
      expect(vertices[0].value).toBeTruthy();
      expect(typeof depth === 'number').toBe(true);
    });
    surveyGraph.traversal.breadthFirst(
      startingVertexKey,
      onLevelCallback,
    );
  })

  // TODO: should correctly return empty array of vertices using BFT from an invalid vertex or a vertex with no edges

  it('should correctly return vertices using Depth First Traversal starting from vertex "Foo.A"', () => {
    const startingVertexKey = 'Foo.A';
    const depthFirstTraversalVertices = surveyGraph.traversal.depthFirst(startingVertexKey);
    // console.debug('DEBUG: depthFirstTraversalVertices: ', depthFirstTraversalVertices);
    expect(depthFirstTraversalVertices).toHaveLength(vertices.length);
    // Testing the order of the BF traversal:
    expect(depthFirstTraversalVertices.map(({ key }) => key)).toMatchObject([
      'Foo.A',
      '1.A',
      'Foo.B',
      '2.A',
      '1.B',
      'Foo.D',
      '1.D',
      'Bar',
      '3.C',
      'Foo.C',
      '3.A',
      '1.C',
      'Foo.E',
      '2.C',
      '2.D',
      '1.E',
      '2.E',
      '3.E',
      '4.C',
      '2.B',
    ]);
  });

  it('should correctly invoke the callback during the previous DF traversal', () => {
    const startingVertexKey = 'Foo.A';
    const onVertexCallback = jest.fn((vertex: Vertex<Question | Answer | Final>) => {
      expect(vertex.key).toBeTruthy();
      expect(vertex.value).toBeTruthy();
    });
    const vertices = surveyGraph.traversal.depthFirst(
      startingVertexKey,
      onVertexCallback,
    );
    expect(vertices).toHaveLength(onVertexCallback.mock.calls.length);
  })

  // TODO: should correctly return empty array of vertices using DFT from an invalid vertex or a vertex with no edges

  it('should correctly remove vertices', () => {
    const vertexKey = 'Foo.E';
    const edgesBeforeRemoval = Array.from(surveyGraph.edgesMap.values());
    const amountOfVertexEdges = surveyGraph.adjacencyList.get(vertexKey)!.size * 2; // NOTE: The edges are multiplied by 2 because it's an undirected graph.
    expect(surveyGraph.removeVertex(vertexKey)).toBeTruthy();
    // Checking if the related edges were also removed:
    const edgesAfterRemoval = Array.from(surveyGraph.edgesMap.values());
    edgesAfterRemoval.forEach(edge => {
      expect(edge.key).not.toContain(vertexKey);
      expect(edge.from).not.toBe(vertexKey);
      expect(edge.to).not.toBe(vertexKey);
    });
    // Checking that other edges are left intact:
    expect(edgesBeforeRemoval).toHaveLength(edgesAfterRemoval.length + amountOfVertexEdges);
  });

  it('should correctly "remove" vertices that don\'t exist', () => {
    const vertexKey = faker.random.uuid();
    expect(surveyGraph.removeVertex(vertexKey)).toBe(undefined);
  });

  it('should correctly remove edges', () => {
    const edges = [
      { from: 'Foo.A', to: '1.A' },
      { from: 'Foo.A', to: '2.A' },
      { from: 'Foo.A', to: '3.A' },
    ];
    edges.forEach(edge => {
      expect(surveyGraph.removeEdge(edge.from, edge.to)).toBeTruthy();
      // NOTE: Because this graph is undirected, the incoming edge is also automatically
      // removed.
      // expect(surveyGraph.removeEdge(edge.to, edge.from)).toBeTruthy();
    });
  });

  it('should correctly "remove" edges that don\'t exist', () => {
    const edges = [
      { from: faker.random.uuid(), to: faker.random.uuid() },
      { from: faker.random.uuid(), to: faker.random.uuid() },
      { from: faker.random.uuid(), to: faker.random.uuid() },
    ];
    edges.forEach(edge => {
      expect(surveyGraph.removeEdge(edge.from, edge.to)).toBe(undefined);
      expect(surveyGraph.removeEdge(edge.to, edge.from)).toBe(undefined);
    });
  });

  it('should correctly clear the graph', () => {
    surveyGraph.clear();
    expect(surveyGraph.verticesMap.size).toBe(0);
    expect(surveyGraph.adjacencyList.size).toBe(0);
  });

  it('should correctly clear an empty graph', () => {
    surveyGraph.clear();
    expect(surveyGraph.verticesMap.size).toBe(0);
    expect(surveyGraph.adjacencyList.size).toBe(0);
  });
});

describe('should correctly instantiate the graph when initialized with non-default parameters', () => {

});
