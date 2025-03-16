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
  height: 600px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const EdgeLabel = styled.div`
  background-color: white;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid #ddd;
  pointer-events: none;
`;

const NodeContent = styled.div`
  padding: 10px;
  border-radius: 4px;
  background-color: white;
  border: 1px solid #ddd;
  width: 180px;
`;

const NodeTitle = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
`;

const NodeDescription = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
`;

const FunctionalityList = styled.ul`
  margin: 0;
  padding-left: 15px;
  font-size: 11px;
`;

const FunctionalityItem = styled.li`
  margin-bottom: 2px;
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
  custom: ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, style = {}, markerEnd }: any) => {
    const edgePath = `M${sourceX},${sourceY} L${targetX},${targetY}`;
    const [edgeCenterX, edgeCenterY] = [(sourceX + targetX) / 2, (sourceY + targetY) / 2];
    
    return (
      <>
        <path
          id={id}
          style={style}
          className="react-flow__edge-path"
          d={edgePath}
          markerEnd={markerEnd}
        />
        <foreignObject
          width={80}
          height={40}
          x={edgeCenterX - 40}
          y={edgeCenterY - 20}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <EdgeLabel>
            {data?.label}
            {data?.type && <div style={{ fontSize: '10px', color: data.type === 'GET' ? '#4caf50' : '#f44336' }}>{data.type}</div>}
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