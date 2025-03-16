import React, { useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  Node,
  Edge
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
  height: 650px;
  border: 2px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
`;

const NodeContent = styled.div<{ type: string; isHighlighted: boolean }>`
  padding: 15px;
  border-radius: ${props => props.type === 'decision' ? '0' : '8px'};
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
  border: 2px solid ${props => {
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
  width: ${props => props.type === 'decision' ? '160px' : '200px'};
  height: ${props => props.type === 'decision' ? '160px' : 'auto'};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform: ${props => props.type === 'decision' ? 'rotate(45deg)' : 'none'};
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: ${props => props.type === 'decision' ? 'rotate(45deg) translateY(-3px)' : 'translateY(-3px)'};
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const NodeContentInner = styled.div<{ type: string }>`
  transform: ${props => props.type === 'decision' ? 'rotate(-45deg)' : 'none'};
  width: 100%;
`;

const NodeTitle = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 16px;
  color: #333;
  position: relative;
  padding-bottom: 6px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background-color: #2196f3;
  }
`;

const NodeDescription = styled.div`
  font-size: 13px;
  color: #555;
  line-height: 1.4;
  margin-top: 5px;
`;

const NodeCondition = styled.div`
  font-size: 12px;
  font-style: italic;
  color: #ff9800;
  margin-top: 8px;
  padding: 4px 8px;
  background-color: rgba(255, 152, 0, 0.1);
  border-radius: 4px;
  font-weight: 500;
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
  color: #444;
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
  custom: ({ id, sourceX, sourceY, targetX, targetY, data, style = {}, markerEnd }: any) => {
    // Use bezier curve for smoother edges instead of straight lines
    const controlX = (sourceX + targetX) / 2;
    const controlY = (sourceY + targetY) / 2;
    
    // Add slight offset to avoid overlapping with nodes
    const offset = 20;
    const adjustedControlX = controlX + offset;
    const adjustedControlY = controlY - offset;
    
    // Create a bezier curve path
    const edgePath = `M${sourceX},${sourceY} Q${adjustedControlX},${adjustedControlY} ${targetX},${targetY}`;
    const [edgeCenterX, edgeCenterY] = [adjustedControlX, adjustedControlY];
    
    return (
      <>
        <path
          id={id}
          style={{
            ...style,
            strokeWidth: 2.5, // Thicker lines for better visibility
            stroke: '#555', // Darker color for better contrast
            strokeDasharray: data?.label?.includes('Data Flow') ? '5,5' : 'none' // Dashed lines for data flow
          }}
          className="react-flow__edge-path"
          d={edgePath}
          markerEnd={markerEnd}
        />
        {data?.label && (
          <foreignObject
            width={100} // Wider to accommodate text
            height={40}
            x={edgeCenterX - 50}
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
  // Transform workflow steps to ReactFlow nodes and edges
  const { nodes, edges } = useMemo(() => {
    const nodesArray: Node[] = [];
    const edgesArray: Edge[] = [];
    const nodePositions: Record<string, { x: number; y: number }> = {};
    
    // First pass: create nodes and determine positions with improved layout
    workflowSteps.forEach((step, index) => {
      // Enhanced positioning logic with horizontal offset for better flow visualization
      let xPosition = 250;
      
      // Add horizontal offset for decision branches to prevent overlapping
      if (step.id === 'request-login' || step.id === 'end-no-auth') {
        xPosition = 100; // Position these nodes to the left
      } else if (step.id === 'fetch-preferences' || step.id === 'fetch-movie-data' || 
                 step.id === 'apply-algorithm' || step.id === 'return-results' || 
                 step.id === 'end-success') {
        xPosition = 400; // Position these nodes to the right
      }
      
      const position = { x: xPosition, y: index * 180 }; // Increased vertical spacing
      nodePositions[step.id] = position;
      
      nodesArray.push({
        id: step.id,
        type: step.type,
        position,
        data: {
          label: step.label,
          description: step.description,
          condition: step.condition,
          isHighlighted: step.id === highlightStep
        }
      });
    });
    
    // Second pass: create edges based on nextSteps
    workflowSteps.forEach(step => {
      if (step.nextSteps) {
        step.nextSteps.forEach(targetId => {
          edgesArray.push({
            id: `${step.id}-${targetId}`,
            source: step.id,
            target: targetId,
            type: 'custom',
            data: {
              label: showDataFlowLabels ? 'Data Flow' : undefined
            }
          });
        });
      }
    });
    
    return { nodes: nodesArray, edges: edgesArray };
  }, [workflowSteps, highlightStep, showDataFlowLabels]);

  return (
    <DiagramContainer>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        attributionPosition="bottom-left"
      >
        <Controls />
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.type === 'decision') return '#ff9800';
            if (n.type === 'start') return '#4caf50';
            if (n.type === 'end') return '#f44336';
            return '#9e9e9e';
          }}
          nodeColor={(n) => {
            if (n.type === 'decision') return '#fff3e0';
            if (n.type === 'start') return '#e8f5e9';
            if (n.type === 'end') return '#ffebee';
            return '#f5f5f5';
          }}
        />
        <Background color="#f8f8f8" gap={16} />
      </ReactFlow>
    </DiagramContainer>
  );
};

export default ActivityDiagram;