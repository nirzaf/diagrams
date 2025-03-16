import React from 'react';
import styled from 'styled-components';
import MermaidDiagram from './MermaidDiagram';
import { WorkflowStep } from '../../types';

interface ActivityDiagramMermaidProps {
  workflowSteps: WorkflowStep[];
  highlightStep?: string;
  showDataFlowLabels: boolean;
}

const DiagramWrapper = styled.div`
  width: 100%;
  height: 650px;
  border: 2px solid #ddd;
  border-radius: 10px;
  overflow: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  
  .mermaid-container {
    min-height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const ActivityDiagramMermaid: React.FC<ActivityDiagramMermaidProps> = ({ 
  workflowSteps,
  highlightStep,
  showDataFlowLabels 
}) => {
  // Generate Mermaid diagram definition from workflow steps
  const generateMermaidDefinition = () => {
    let definition = 'graph TD\n';
    
    // Add nodes
    workflowSteps.forEach(step => {
      let nodeStyle = '';
      
      // Apply different styles based on node type
      switch (step.type) {
        case 'start':
          nodeStyle = 'fill:#e8f5e9,stroke:#4caf50,stroke-width:2px';
          break;
        case 'process':
          nodeStyle = 'fill:#f5f5f5,stroke:#9e9e9e,stroke-width:2px';
          break;
        case 'decision':
          nodeStyle = 'fill:#fff3e0,stroke:#ff9800,stroke-width:2px';
          break;
        case 'data':
          nodeStyle = 'fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px';
          break;
        case 'end':
          nodeStyle = 'fill:#ffebee,stroke:#f44336,stroke-width:2px';
          break;
      }
      
      // Highlight the selected step if specified
      if (highlightStep && step.id === highlightStep) {
        nodeStyle = 'fill:#e3f2fd,stroke:#2196f3,stroke-width:3px';
      }
      
      // Add node with label and style
      definition += `    ${step.id}["${step.label}"]`;
      if (nodeStyle) {
        definition += ` style ${step.id} ${nodeStyle}`;
      }
      definition += '\n';
    });
    
    // Add connections between nodes
    workflowSteps.forEach(step => {
      if (step.nextSteps && step.nextSteps.length > 0) {
        step.nextSteps.forEach(nextStep => {
          const targetStep = workflowSteps.find(s => s.id === nextStep);
          if (targetStep) {
            let connectionLabel = '';
            
            // Add labels for decision paths
            if (step.type === 'decision' && step.condition) {
              if (targetStep.id === step.nextSteps?.[0]) {
                connectionLabel = '|Yes|';
              } else {
                connectionLabel = '|No|';
              }
            }
            
            // Add data flow labels if enabled
            if (showDataFlowLabels && (step.type === 'data' || targetStep.type === 'data')) {
              connectionLabel = '|Data Flow|';
            }
            
            definition += `    ${step.id} -->${connectionLabel} ${targetStep.id}\n`;
          }
        });
      }
    });
    
    return definition;
  };

  const mermaidConfig = {
    theme: 'default',
    flowchart: {
      curve: 'basis',
      useMaxWidth: false
    }
  };

  return (
    <DiagramWrapper>
      <div className="mermaid-container">
        <MermaidDiagram 
          chartDefinition={generateMermaidDefinition()} 
          config={mermaidConfig}
        />
      </div>
    </DiagramWrapper>
  );
};

export default ActivityDiagramMermaid;