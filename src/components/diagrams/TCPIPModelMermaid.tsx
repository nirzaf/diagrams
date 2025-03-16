import React from 'react';
import styled from 'styled-components';
import MermaidDiagram from './MermaidDiagram';
import { TCPIPLayerInfo } from '../../types';

interface TCPIPModelMermaidProps {
  layers: TCPIPLayerInfo[];
  showComparison: boolean;
  animateDataFlow: boolean;
  highlightLayer?: string;
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

const TCPIPModelMermaid: React.FC<TCPIPModelMermaidProps> = ({ 
  layers,
  showComparison,
  animateDataFlow,
  highlightLayer 
}) => {
  // Generate Mermaid diagram definition
  const generateMermaidDefinition = () => {
    let definition = '%%{init: {"theme": "neutral", "themeVariables": {"primaryColor": "#f5f5f5", "primaryTextColor": "#333", "primaryBorderColor": "#999", "lineColor": "#666", "secondaryColor": "#fafafa", "tertiaryColor": "#f0f0f0"}} }%%\n';
    definition += 'graph TD\n';
    
    // Add TCP/IP model nodes with more detailed information
    layers.forEach((layer, index) => {
      const id = `tcpip${index}`;
      const nextIndex = index + 1;
      const nextId = `tcpip${nextIndex}`;
      
      // Create a more detailed node label with protocols
      const protocolsList = layer.protocols.join(', ');
      const nodeLabel = `${layer.name} Layer<br><hr><i>${layer.description}</i><br><b>Protocols:</b> ${protocolsList}`;
      
      // Add node with enhanced label
      definition += `    ${id}["${nodeLabel}"]\n`;
      
      // Add connection to next layer if not the last one
      if (index < layers.length - 1) {
        const arrow = animateDataFlow ? '==>' : '-->';
        // Add data flow description
        const dataFlowLabel = index === 0 ? '|Data|' : 
                             index === 1 ? '|Segments|' : 
                             index === 2 ? '|Packets|' : '|Frames|';
        definition += `    ${id} ${arrow}${dataFlowLabel} ${nextId}\n`;
      }
      
      // Enhanced styling for the node with gradients
      const colorHues = [340, 20, 200, 120]; // Different hue for each layer
      const lightness = highlightLayer === layer.name ? '80%' : '90%';
      const strokeWidth = highlightLayer === layer.name ? '3px' : '2px';
      const borderColor = highlightLayer === layer.name ? '#f44336' : '#333';
      
      definition += `    style ${id} fill:hsl(${colorHues[index]}, 70%, ${lightness}),stroke:${borderColor},stroke-width:${strokeWidth},border-radius:8px\n`;
    });
    
    // Add a title for the diagram
    definition += '    title["TCP/IP Protocol Suite"]\n';
    definition += '    style title fill:none,stroke:none,color:#333,font-size:18px,font-weight:bold\n';
    
    // Add OSI model comparison if enabled
    if (showComparison) {
      definition += '\n    subgraph "OSI Model"\n';
      
      const osiLayers = [
        'Application', 'Presentation', 'Session', 'Transport', 
        'Network', 'Data Link', 'Physical'
      ];
      
      osiLayers.forEach((layer, index) => {
        const id = `osi${index}`;
        definition += `        ${id}["${layer}"]\n`;
        
        // Connect adjacent OSI layers
        if (index < osiLayers.length - 1) {
          const nextId = `osi${index + 1}`;
          definition += `        ${id} --> ${nextId}\n`;
        }
        
        // Style OSI nodes
        definition += `        style ${id} fill:#f5f5f5,stroke:#666,stroke-width:1px\n`;
      });
      
      definition += '    end\n\n';
      
      // Add connections between TCP/IP and OSI models
      definition += '    %% Connections between models\n';
      definition += '    tcpip0 -.-> osi0\n'; // Application to Application
      definition += '    tcpip0 -.-> osi1\n'; // Application to Presentation
      definition += '    tcpip0 -.-> osi2\n'; // Application to Session
      definition += '    tcpip1 -.-> osi3\n'; // Transport to Transport
      definition += '    tcpip2 -.-> osi4\n'; // Internet to Network
      definition += '    tcpip3 -.-> osi5\n'; // Network Access to Data Link
      definition += '    tcpip3 -.-> osi6\n'; // Network Access to Physical
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

export default TCPIPModelMermaid;