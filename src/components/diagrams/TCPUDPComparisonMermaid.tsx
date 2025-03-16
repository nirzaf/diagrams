import React from 'react';
import styled from 'styled-components';
import MermaidDiagram from './MermaidDiagram';
import { ProtocolFeature } from '../../types';

interface TCPUDPComparisonMermaidProps {
  features: ProtocolFeature[];
  viewType: 'table' | 'bar';
  highlightDifferences: boolean;
  showExamples: boolean;
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

const TCPUDPComparisonMermaid: React.FC<TCPUDPComparisonMermaidProps> = ({ 
  features,
  viewType,
  highlightDifferences,
  showExamples
}) => {
  // Generate Mermaid diagram definition
  const generateMermaidDefinition = () => {
    if (viewType === 'table') {
      return generateTableDefinition();
    } else {
      return generateSequenceDefinition();
    }
  };

  // Generate enhanced table comparison view
  const generateTableDefinition = () => {
    let definition = '%%{init: {"theme": "neutral", "themeVariables": {"primaryColor": "#f5f5f5", "primaryTextColor": "#333", "primaryBorderColor": "#999", "lineColor": "#666", "secondaryColor": "#fafafa", "tertiaryColor": "#f0f0f0"}} }%%\n';
    definition += 'graph TD\n';
    definition += '    subgraph "TCP vs UDP Protocol Comparison"\n';
    
    // Create a more visually appealing table header
    definition += '    header["<b>Feature</b> | <b>TCP</b> | <b>UDP</b>"]\n';
    definition += '    style header fill:linear-gradient(to right, #2196f3, #64b5f6),stroke:#1976d2,stroke-width:2px,color:white,font-weight:bold,border-radius:8px\n';
    
    // Add each feature as a row with enhanced styling
    features.forEach((feature, index) => {
      const id = `row${index}`;
      
      // Format values with better visual indicators
      let tcpValue, udpValue;
      
      if (typeof feature.tcpValue === 'number') {
        // Use filled and empty stars for ratings
        tcpValue = '★'.repeat(feature.tcpValue) + '☆'.repeat(5 - feature.tcpValue);
      } else {
        tcpValue = feature.tcpValue;
      }
      
      if (typeof feature.udpValue === 'number') {
        udpValue = '★'.repeat(feature.udpValue) + '☆'.repeat(5 - feature.udpValue);
      } else {
        udpValue = feature.udpValue;
      }
      
      // Add tooltip with description
      const tooltip = showExamples ? `<i>${feature.description}</i>` : '';
      definition += `    ${id}["<b>${feature.feature}</b> | ${tcpValue} | ${udpValue}<br>${tooltip}"]\n`;
      
      // Connect rows with styled arrows
      if (index === 0) {
        definition += `    header --> ${id}\n`;
      } else {
        definition += `    row${index-1} --> ${id}\n`;
      }
      
      // Enhanced row styling with alternating colors and highlighting
      let rowStyle;
      if (highlightDifferences && feature.tcpValue !== feature.udpValue) {
        // Highlight differences with a more noticeable style
        rowStyle = 'fill:#e3f2fd,stroke:#2196f3,stroke-width:2px,border-radius:6px';
      } else {
        // Alternate row colors for better readability
        rowStyle = index % 2 === 0 ? 
          'fill:#fff,stroke:#ddd,stroke-width:1px,border-radius:6px' : 
          'fill:#f5f5f5,stroke:#ddd,stroke-width:1px,border-radius:6px';
      }
      definition += `    style ${id} ${rowStyle}\n`;
    });
    
    // Add examples if enabled
    if (showExamples) {
      const exampleId = 'examples';
      definition += `    ${exampleId}["Examples: | Web, Email, FTP | Video Streaming, DNS, VoIP"]\n`;
      definition += `    row${features.length-1} --> ${exampleId}\n`;
      definition += `    style ${exampleId} fill:#e8f0fe,stroke:#4285f4,stroke-width:1px,font-style:italic\n`;
    }
    
    definition += '    end\n';
    return definition;
  };

  // Generate sequence diagram showing TCP handshake vs UDP
  const generateSequenceDefinition = () => {
    let definition = 'sequenceDiagram\n';
    definition += '    participant C as Client\n';
    definition += '    participant S as Server\n\n';
    
    // TCP three-way handshake
    definition += '    Note over C,S: TCP Connection Establishment\n';
    definition += '    C->>S: SYN (Synchronize)\n';
    definition += '    Note right of C: Sequence Number = x\n';
    definition += '    S->>C: SYN-ACK (Synchronize-Acknowledge)\n';
    definition += '    Note left of S: Sequence Number = y<br>Acknowledgment Number = x+1\n';
    definition += '    C->>S: ACK (Acknowledge)\n';
    definition += '    Note right of C: Acknowledgment Number = y+1\n';
    definition += '    Note over C,S: Connection Established\n\n';
    
    // Data transfer with TCP
    definition += '    C->>S: Data Packet 1\n';
    definition += '    S->>C: ACK\n';
    definition += '    C->>S: Data Packet 2\n';
    definition += '    S->>C: ACK\n';
    definition += '    Note over C,S: Reliable, ordered delivery\n\n';
    
    // UDP simple communication
    definition += '    Note over C,S: UDP Communication\n';
    definition += '    C->>S: Datagram 1\n';
    definition += '    C->>S: Datagram 2\n';
    definition += '    C->>S: Datagram 3\n';
    definition += '    Note over C,S: No connection setup, no acknowledgments\n';
    definition += '    Note over C,S: Faster but unreliable\n';
    
    return definition;
  };

  const mermaidConfig = {
    theme: 'default',
    sequence: {
      showSequenceNumbers: false,
      actorMargin: 80,
      boxMargin: 10,
      mirrorActors: false,
      bottomMarginAdj: 10,
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

export default TCPUDPComparisonMermaid;