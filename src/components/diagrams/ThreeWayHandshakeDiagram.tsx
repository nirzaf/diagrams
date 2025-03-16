import React from 'react';
import styled from 'styled-components';
import MermaidDiagram from './MermaidDiagram';

interface ThreeWayHandshakeDiagramProps {
  showDetailedExplanations?: boolean;
  animateHandshake?: boolean;
  highlightStep?: number;
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

const ThreeWayHandshakeDiagram: React.FC<ThreeWayHandshakeDiagramProps> = ({
  showDetailedExplanations = true,
  animateHandshake = true,
  highlightStep = 0
}) => {
  // Generate Mermaid diagram definition
  const generateMermaidDefinition = () => {
    let definition = '%%{init: {"theme": "neutral", "themeVariables": {"primaryColor": "#f5f5f5", "primaryTextColor": "#333", "primaryBorderColor": "#999", "lineColor": "#666", "secondaryColor": "#fafafa", "tertiaryColor": "#f0f0f0"}} }%%\n';
    
    // Use sequence diagram for handshake visualization
    definition += 'sequenceDiagram\n';
    definition += '    participant Client\n';
    definition += '    participant Server\n\n';
    
    // Add title
    definition += '    Note over Client,Server: TCP Three-Way Handshake\n\n';
    
    // Step 1: SYN
    const step1Arrow = animateHandshake ? '->>>' : '->>';
    const step1Style = highlightStep === 1 ? ',#e3f2fd' : '';
    definition += `    Client${step1Arrow}Server: SYN (Synchronize)${step1Style}\n`;
    if (showDetailedExplanations) {
      definition += '    Note right of Client: Sequence Number = x<br>SYN Flag = 1<br>ACK Flag = 0\n';
    }
    
    // Step 2: SYN-ACK
    const step2Arrow = animateHandshake ? '->>>' : '->>';
    const step2Style = highlightStep === 2 ? ',#e3f2fd' : '';
    definition += `    Server${step2Arrow}Client: SYN-ACK (Synchronize-Acknowledge)${step2Style}\n`;
    if (showDetailedExplanations) {
      definition += '    Note left of Server: Sequence Number = y<br>Acknowledgment Number = x+1<br>SYN Flag = 1<br>ACK Flag = 1\n';
    }
    
    // Step 3: ACK
    const step3Arrow = animateHandshake ? '->>>' : '->>';
    const step3Style = highlightStep === 3 ? ',#e3f2fd' : '';
    definition += `    Client${step3Arrow}Server: ACK (Acknowledge)${step3Style}\n`;
    if (showDetailedExplanations) {
      definition += '    Note right of Client: Sequence Number = x+1<br>Acknowledgment Number = y+1<br>SYN Flag = 0<br>ACK Flag = 1\n';
    }
    
    // Connection established
    definition += '    Note over Client,Server: Connection Established\n';
    
    // Add data transfer if needed
    if (showDetailedExplanations) {
      definition += '\n    Note over Client,Server: Data Transfer Phase\n';
      definition += '    Client->>Server: Data Packet\n';
      definition += '    Server->>Client: ACK\n';
      definition += '    Server->>Client: Data Packet\n';
      definition += '    Client->>Server: ACK\n';
    }
    
    // Add connection termination if detailed explanations are enabled
    if (showDetailedExplanations) {
      definition += '\n    Note over Client,Server: Connection Termination (Four-Way Handshake)\n';
      definition += '    Client->>Server: FIN\n';
      definition += '    Server->>Client: ACK\n';
      definition += '    Server->>Client: FIN\n';
      definition += '    Client->>Server: ACK\n';
      definition += '    Note over Client,Server: Connection Closed\n';
    }
    
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
      useMaxWidth: false,
      noteMargin: 10
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

export default ThreeWayHandshakeDiagram;