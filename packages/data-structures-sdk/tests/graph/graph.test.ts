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

interface End {
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
const surveyGraph = new Graph<Question | Answer | End>();

describe('Graph works correctly', () => {
  it('should add a vertex correctly', () => {
    const vertex = {
      key: 'Foo.A',
      value: {
        id: faker.random.uuid(),
        type: 'question',
        value: faker.random.words(),
      } as Question,
    };
    surveyGraph.addVertex(vertex);
    expect(surveyGraph.verticesMap.get(vertex.key)).toMatchObject(vertex);
    expect(surveyGraph.adjacencyList.get(vertex.key)).toMatchObject(new Set());
    expect(surveyGraph.adjacencyList.size).toBe(1);
  });

  it('should NOT duplicate already added vertices', () => {
    const vertex = {
      key: 'Foo.A',
      value: {
        id: faker.random.uuid(),
        type: 'question',
        value: faker.random.words(),
      } as Question,
    };
    surveyGraph.addVertex(vertex);
    expect(surveyGraph.verticesMap.get(vertex.key)).toMatchObject(vertex);
    expect(surveyGraph.adjacencyList.get(vertex.key)).toMatchObject(new Set());
    expect(surveyGraph.adjacencyList.size).toBe(1);
  });

  it('should add multiple vertex correctly (edges will be added later)', () => {
    vertices.forEach(vertex => {
      surveyGraph.addVertex(vertex as Vertex<Question | Answer | End>);
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

  it('should correctly return vertices using Breadth First Traversal from origin vertex "Foo.A"', () => {
    const originVertexKey = 'Foo.A';
    const breadthFirstTraversalVertices = surveyGraph.breadthFirstTraversal(originVertexKey);
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

  it('should correctly return vertices using Depth First Traversal from origin vertex "Foo.A"', () => {
    const originVertexKey = 'Foo.A';
    const depthFirstTraversalVertices = surveyGraph.depthFirstTraversal(originVertexKey);
    // console.debug('DEBUG: depthFirstTraversalVertices: ', depthFirstTraversalVertices);
    expect(depthFirstTraversalVertices).toHaveLength(vertices.length);
    expect(false).toBeTruthy();
  });
});
