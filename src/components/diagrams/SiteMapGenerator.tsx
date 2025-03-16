import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import styled from 'styled-components';
import { PageNode, PageConnection } from '../../types';

interface SiteMapGeneratorProps {
  initialNodes: PageNode[];
  initialEdges: PageConnection[];
  showDataFlow: boolean;
  allowEditing: boolean;
}

const SiteMapContainer = styled.div`
  width: 100%;
  height: 650px;
  border: 2px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
`;

const EdgeLabel = styled.div`
  background-color: white;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 12px;
  border: 1px solid #ddd;
  pointer-events: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 500;
`;

const NodeContent = styled.div`
  padding: 15px;
  border-radius: 8px;
  background-color: white;
  border: 2px solid #ddd;
  width: 220px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const NodeTitle = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 16px;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`;

const NodeDescription = styled.div`
  font-size: 13px;
  color: #555;
  margin-bottom: 12px;
  line-height: 1.4;
  font-style: italic;
`;

const FunctionalityList = styled.ul`
  margin: 0;
  padding-left: 5px;
  font-size: 12px;
  list-style-type: none;
`;

const FunctionalityItem = styled.li`
  margin-bottom: 6px;
  padding-left: 18px;
  position: relative;
  
  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #2196f3;
    font-weight: bold;
    font-size: 16px;
  }
`;

// Custom node types
const nodeTypes = {
  home: ({ data }: { data: PageNode['data'] }) => (
    <NodeContent style={{ borderColor: '#4caf50', backgroundColor: '#e8f5e9' }}>
      <NodeTitle>{data.label}</NodeTitle>
      <NodeDescription>{data.description}</NodeDescription>
      <FunctionalityList>
        {data.functionality.map((item, index) => (
          <FunctionalityItem key={index}>{item}</FunctionalityItem>
        ))}
      </FunctionalityList>
    </NodeContent>
  ),
  detail: ({ data }: { data: PageNode['data'] }) => (
    <NodeContent style={{ borderColor: '#2196f3', backgroundColor: '#e3f2fd' }}>
      <NodeTitle>{data.label}</NodeTitle>
      <NodeDescription>{data.description}</NodeDescription>
      <FunctionalityList>
        {data.functionality.map((item, index) => (
          <FunctionalityItem key={index}>{item}</FunctionalityItem>
        ))}
      </FunctionalityList>
    </NodeContent>
  ),
  ranking: ({ data }: { data: PageNode['data'] }) => (
    <NodeContent style={{ borderColor: '#ff9800', backgroundColor: '#fff3e0' }}>
      <NodeTitle>{data.label}</NodeTitle>
      <NodeDescription>{data.description}</NodeDescription>
      <FunctionalityList>
        {data.functionality.map((item, index) => (
          <FunctionalityItem key={index}>{item}</FunctionalityItem>
        ))}
      </FunctionalityList>
    </NodeContent>
  ),
  service: ({ data }: { data: PageNode['data'] }) => (
    <NodeContent style={{ borderColor: '#9c27b0', backgroundColor: '#f3e5f5' }}>
      <NodeTitle>{data.label}</NodeTitle>
      <NodeDescription>{data.description}</NodeDescription>
      <FunctionalityList>
        {data.functionality.map((item, index) => (
          <FunctionalityItem key={index}>{item}</FunctionalityItem>
        ))}
      </FunctionalityList>
    </NodeContent>
  ),
  login: ({ data }: { data: PageNode['data'] }) => (
    <NodeContent style={{ borderColor: '#f44336', backgroundColor: '#ffebee' }}>
      <NodeTitle>{data.label}</NodeTitle>
      <NodeDescription>{data.description}</NodeDescription>
      <FunctionalityList>
        {data.functionality.map((item, index) => (
          <FunctionalityItem key={index}>{item}</FunctionalityItem>
        ))}
      </FunctionalityList>
    </NodeContent>
  ),
};

// Custom edge with label
const edgeTypes = {
  custom: ({ id, sourceX, sourceY, targetX, targetY, data, style = {}, markerEnd }: any) => {
    // Use bezier curve for smoother edges
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;
    
    // Add offset to create a curved path
    const offset = 50;
    const controlX = midX;
    const controlY = midY - offset;
    
    // Create a bezier curve path
    const edgePath = `M${sourceX},${sourceY} Q${controlX},${controlY} ${targetX},${targetY}`;
    
    return (
      <>
        <path
          id={id}
          style={{
            ...style,
            strokeWidth: 2.5, // Thicker lines for better visibility
            stroke: data?.type === 'GET' ? '#4caf50' : '#f44336', // Color based on request type
            opacity: 0.8
          }}
          className="react-flow__edge-path"
          d={edgePath}
          markerEnd={markerEnd}
        />
        <foreignObject
          width={100} // Wider to accommodate text
          height={50}
          x={controlX - 50}
          y={controlY - 25}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <EdgeLabel>
            {data?.label}
            {data?.type && <div style={{ fontSize: '10px', color: data.type === 'GET' ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>{data.type}</div>}
          </EdgeLabel>
        </foreignObject>
      </>
    );
  },
};

const SiteMapGenerator: React.FC<SiteMapGeneratorProps> = ({
  initialNodes,
  initialEdges,
  showDataFlow,
  allowEditing
}) => {
  // Transform PageNode to ReactFlow Node format
  const transformNodes = (nodes: PageNode[]): Node[] => {
    return nodes.map(node => ({
      id: node.id,
      type: node.type,
      data: node.data,
      position: node.position,
      draggable: allowEditing,
    }));
  };

  // Transform PageConnection to ReactFlow Edge format
  const transformEdges = (edges: PageConnection[]): Edge[] => {
    return edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'custom',
      data: showDataFlow ? { label: edge.label, type: edge.type } : { label: edge.label },
    }));
  };

  const [nodes, setNodes] = useState<Node[]>(transformNodes(initialNodes));
  const [edges, setEdges] = useState<Edge[]>(transformEdges(initialEdges));

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (allowEditing) {
        const newEdge = {
          ...connection,
          type: 'custom',
          data: { label: 'New Connection', type: 'GET' },
        };
        setEdges((eds) => addEdge(newEdge, eds));
      }
    },
    [allowEditing]
  );

  return (
    <SiteMapContainer>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background color="#f8f8f8" gap={16} />
      </ReactFlow>
    </SiteMapContainer>
  );
};

export default SiteMapGenerator;