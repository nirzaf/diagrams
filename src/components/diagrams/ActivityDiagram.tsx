import React, { useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  Node,
  Edge,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import styled from 'styled-components';
import { WorkflowStep } from '../../types';

interface ActivityDiagramProps {
  workflowSteps: WorkflowStep[];
  highlightStep?: string;
  showDataFlowLabels: boolean;
}

const DiagramContainer = styled.div`
  width: 100%;
  height: 600px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const NodeContent = styled.div<{ type: string; isHighlighted: boolean }>`
  padding: 10px;
  border-radius: ${props => props.type === 'decision' ? '0' : '4px'};
  background-color: ${props => {
    if (props.isHighlighted) return '#e3f2fd';
    switch (props.type) {
      case 'start': return '#e8f5e9';
      case 'process': return '#f5f5f5';
      case 'decision': return '#fff3e0';
      case 'data': return '#f3e5f5';
      case 'end': return '#ffebee';
      default: return 'white';
    }
  }};
  border: 1px solid ${props => {
    if (props.isHighlighted) return '#2196f3';
    switch (props.type) {
      case 'start': return '#4caf50';
      case 'process': return '#9e9e9e';
      case 'decision': return '#ff9800';
      case 'data': return '#9c27b0';
      case 'end': return '#f44336';
      default: return '#ddd';
    }
  }};
  width: ${props => props.type === 'decision' ? '150px' : '180px'};
  height: ${props => props.type === 'decision' ? '150px' : 'auto'};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform: ${props => props.type === 'decision' ? 'rotate(45deg)' : 'none'};
  text-align: center;
`;

const NodeContentInner = styled.div<{ type: string }>`
  transform: ${props => props.type === 'decision' ? 'rotate(-45deg)' : 'none'};
  width: 100%;
`;

const NodeTitle = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
`;

const NodeDescription = styled.div`
  font-size: 12px;
  color: #666;
`;

const NodeCondition = styled.div`
  font-size: 11px;
  font-style: italic;
  color: #ff9800;
  margin-top: 5px;
`;

const EdgeLabel = styled.div`
  background-color: white;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid #ddd;
  pointer-events: none;
`;

// Custom node types
const nodeTypes = {
  start: ({ data }: { data: any }) => (
    <NodeContent type="start" isHighlighted={data.isHighlighted}>
      <NodeContentInner type="start">
        <NodeTitle>{data.label}</NodeTitle>
        <NodeDescription>{data.description}</NodeDescription>
      </NodeContentInner>
    </NodeContent>
  ),
  process: ({ data }: { data: any }) => (
    <NodeContent type="process" isHighlighted={data.isHighlighted}>
      <NodeContentInner type="process">
        <NodeTitle>{data.label}</NodeTitle>
        <NodeDescription>{data.description}</NodeDescription>
      </NodeContentInner>
    </NodeContent>
  ),
  decision: ({ data }: { data: any }) => (
    <NodeContent type="decision" isHighlighted={data.isHighlighted}>
      <NodeContentInner type="decision">
        <NodeTitle>{data.label}</NodeTitle>
        <NodeDescription>{data.description}</NodeDescription>
        {data.condition && <NodeCondition>{data.condition}</NodeCondition>}
      </NodeContentInner>
    </NodeContent>
  ),
  data: ({ data }: { data: any }) => (
    <NodeContent type="data" isHighlighted={data.isHighlighted}>
      <NodeContentInner type="data">
        <NodeTitle>{data.label}</NodeTitle>
        <NodeDescription>{data.description}</NodeDescription>
      </NodeContentInner>
    </NodeContent>
  ),
  end: ({ data }: { data: any }) => (
    <NodeContent type="end" isHighlighted={data.isHighlighted}>
      <NodeContentInner type="end">
        <NodeTitle>{data.label}</NodeTitle>
        <NodeDescription>{data.description}</NodeDescription>
      </NodeContentInner>
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
        {data?.label && (
          <foreignObject
            width={80}
            height={40}
            x={edgeCenterX - 40}
            y={edgeCenterY - 20}
            className="edgebutton-foreignobject"
            requiredExtensions="http://www.w3.org/1999/xhtml"
          >
            <EdgeLabel>
              {data.label}
            </EdgeLabel>
          </foreignObject>
        )}
      </>
    );
  },
};

const ActivityDiagram: React.FC<ActivityDiagramProps> = ({
  workflowSteps,
  highlightStep,
  showDataFlowLabels
}) => {
  // Calculate positions for nodes in a flowchart layout
  const calculateNodePositions = (steps: WorkflowStep[]): Node[] => {
    const nodeMap = new Map<string, WorkflowStep>();
    steps.forEach(step => nodeMap.set(step.id, step));
    
    // Find start node
    const startNode = steps.find(step => step.type === 'start');
    if (!startNode) return [];
    
    const positions = new Map<string, { x: number, y: number }>();
    const visited = new Set<string>();
    
    // Position start node
    positions.set(startNode.id, { x: 250, y: 50 });
    
    // BFS to position other nodes
    const queue: { id: string; level: number; column: number }[] = [
      { id: startNode.id, level: 0, column: 0 }
    ];
    
    const levelNodes = new Map<number, number>(); // level -> count
    const columnWidth = 300;
    const rowHeight = 200;
    
    while (queue.length > 0) {
      const { id, level, column } = queue.shift()!;
      const node = nodeMap.get(id);
      
      if (!node || visited.has(id)) continue;
      visited.add(id);
      
      // Set position based on level and column
      positions.set(id, { x: column * columnWidth + 250, y: level * rowHeight + 50 });
      
      // Add next nodes to queue
      if (node.nextSteps) {
        let currentColumn = column - Math.floor(node.nextSteps.length / 2);
        
        node.nextSteps.forEach(nextId => {
          if (!visited.has(nextId)) {
            queue.push({ id: nextId, level: level + 1, column: currentColumn });
            currentColumn++;
          }
        });
      }
    }
    
    // Create nodes with calculated positions
    return steps.map(step => ({
      id: step.id,
      type: step.type,
      position: positions.get(step.id) || { x: 0, y: 0 },
      data: {
        label: step.label,
        description: step.description,
        condition: step.condition,
        isHighlighted: step.id === highlightStep
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    }));
  };
  
  // Create edges from workflow steps
  const createEdges = (steps: WorkflowStep[]): Edge[] => {
    const edges: Edge[] = [];
    
    steps.forEach(step => {
      if (step.nextSteps) {
        step.nextSteps.forEach(targetId => {
          edges.push({
            id: `${step.id}-${targetId}`,
            source: step.id,
            target: targetId,
            type: 'custom',
            data: showDataFlowLabels ? { label: 'flow' } : undefined,
          });
        });
      }
    });
    
    return edges;
  };
  
  const nodes = calculateNodePositions(workflowSteps);
  const edges = createEdges(workflowSteps);

  return (
    <DiagramContainer>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background color="#f8f8f8" gap={16} />
      </ReactFlow>
    </DiagramContainer>
  );
};

export default ActivityDiagram;