import React from 'react';
import styled from 'styled-components';
import MermaidDiagram from './MermaidDiagram';
import { PageNode, PageConnection } from '../../types';

interface SiteMapMermaidProps {
  nodes: PageNode[];
  connections: PageConnection[];
  showDataFlow: boolean;
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

const SiteMapMermaid: React.FC<SiteMapMermaidProps> = ({ 
  nodes,
  connections,
  showDataFlow
}) => {
  // Generate enhanced Mermaid diagram definition
  const generateMermaidDefinition = () => {
    let definition = '%%{init: {"theme": "neutral", "themeVariables": {"primaryColor": "#f5f5f5", "primaryTextColor": "#333", "primaryBorderColor": "#999", "lineColor": "#666", "secondaryColor": "#fafafa", "tertiaryColor": "#f0f0f0"}} }%%\n';
    definition += 'graph TD\n';
    
    // Add title
    definition += '    title["Site Map & Navigation Flow"]\n';
    definition += '    style title fill:none,stroke:none,color:#333,font-size:18px,font-weight:bold\n';
    
    // Add nodes with enhanced styling and information
    nodes.forEach(node => {
      const id = node.id;
      const label = node.data.label;
      const description = node.data.description;
      const functionality = node.data.functionality.join('<br>• ');
      
      // Add node with more detailed information
      definition += `    ${id}["<b>${label}</b><br><i>${description}</i><hr><b>Features:</b><br>• ${functionality}"]\n`;
      
      // Enhanced styling based on node type with gradients and rounded corners
      let nodeStyle = '';
      switch (node.type) {
        case 'home':
          nodeStyle = 'fill:linear-gradient(to bottom, #e3f2fd, #bbdefb),stroke:#2196f3,stroke-width:2px,border-radius:8px';
          break;
        case 'detail':
          nodeStyle = 'fill:linear-gradient(to bottom, #f3e5f5, #e1bee7),stroke:#9c27b0,stroke-width:2px,border-radius:8px';
          break;
        case 'ranking':
          nodeStyle = 'fill:linear-gradient(to bottom, #e8f5e9, #c8e6c9),stroke:#4caf50,stroke-width:2px,border-radius:8px';
          break;
        case 'service':
          nodeStyle = 'fill:linear-gradient(to bottom, #fff3e0, #ffe0b2),stroke:#ff9800,stroke-width:2px,border-radius:8px';
          break;
        case 'login':
          nodeStyle = 'fill:linear-gradient(to bottom, #ffebee, #ffcdd2),stroke:#f44336,stroke-width:2px,border-radius:8px';
          break;
      }
      
      if (nodeStyle) {
        definition += `    style ${id} ${nodeStyle}\n`;
      }
    });
    
    // Add connections with enhanced styling and information
    connections.forEach(connection => {
      const source = connection.source;
      const target = connection.target;
      const label = connection.label || '';
      
      // Determine connection style based on type with improved visual indicators
      let connectionStyle = '-->';
      let labelText = label ? `|${label}|` : '';
      let connectionThickness = '';
      
      // Add data flow indicators if enabled with more detailed information
      if (showDataFlow && connection.type) {
        if (connection.type === 'POST') {
          connectionStyle = '==>';
          labelText = `|${connection.type}: ${label}|`;
          connectionThickness = ',thickness=2px,color=#f44336';
        } else {
          labelText = `|${connection.type}: ${label}|`;
          connectionThickness = ',thickness=2px,color=#2196f3';
        }
      }
      
      definition += `    ${source} ${connectionStyle}${labelText} ${target}${connectionThickness}\n`;
    });
    
    // Add legend for connection types if data flow is shown
    if (showDataFlow) {
      definition += '\n    subgraph Legend["Connection Types"]\n';
      definition += '    get["GET: Data Retrieval"]\n';
      definition += '    post["POST: Data Submission"]\n';
      definition += '    end\n';
      definition += '    style get fill:#e3f2fd,stroke:#2196f3,stroke-width:1px,border-radius:4px\n';
      definition += '    style post fill:#ffebee,stroke:#f44336,stroke-width:1px,border-radius:4px\n';
      definition += '    style Legend fill:#f5f5f5,stroke:#333,stroke-width:1px,border-radius:4px\n';
    }
    
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

export default SiteMapMermaid;