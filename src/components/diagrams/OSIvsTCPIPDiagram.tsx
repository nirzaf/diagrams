import React from 'react';
import styled from 'styled-components';
import MermaidDiagram from './MermaidDiagram';

interface OSIvsTCPIPDiagramProps {
  showProtocolExamples?: boolean;
  highlightLayer?: string;
  animateDataFlow?: boolean;
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

const OSIvsTCPIPDiagram: React.FC<OSIvsTCPIPDiagramProps> = ({
  showProtocolExamples = true,
  highlightLayer = '',
  animateDataFlow = true
}) => {
  // Generate Mermaid diagram definition
  const generateMermaidDefinition = () => {
    let definition = '%%{init: {"theme": "neutral", "themeVariables": {"primaryColor": "#f5f5f5", "primaryTextColor": "#333", "primaryBorderColor": "#999", "lineColor": "#666", "secondaryColor": "#fafafa", "tertiaryColor": "#f0f0f0"}} }%%\n';
    definition += 'graph LR\n';
    
    // Define OSI Model subgraph
    definition += '    subgraph OSI["OSI Model"]\n';
    definition += '    direction TB\n';
    definition += '    osi7["7. Application"]\n';
    definition += '    osi6["6. Presentation"]\n';
    definition += '    osi5["5. Session"]\n';
    definition += '    osi4["4. Transport"]\n';
    definition += '    osi3["3. Network"]\n';
    definition += '    osi2["2. Data Link"]\n';
    definition += '    osi1["1. Physical"]\n';
    
    // Connect OSI layers
    definition += '    osi7 --> osi6\n';
    definition += '    osi6 --> osi5\n';
    definition += '    osi5 --> osi4\n';
    definition += '    osi4 --> osi3\n';
    definition += '    osi3 --> osi2\n';
    definition += '    osi2 --> osi1\n';
    definition += '    end\n\n';
    
    // Define TCP/IP Model subgraph
    definition += '    subgraph TCPIP["TCP/IP Model"]\n';
    definition += '    direction TB\n';
    definition += '    tcp4["4. Application"]\n';
    definition += '    tcp3["3. Transport"]\n';
    definition += '    tcp2["2. Internet"]\n';
    definition += '    tcp1["1. Network Interface"]\n';
    
    // Connect TCP/IP layers
    definition += '    tcp4 --> tcp3\n';
    definition += '    tcp3 --> tcp2\n';
    definition += '    tcp2 --> tcp1\n';
    definition += '    end\n\n';
    
    // Add mapping between models
    definition += '    %% Mapping between models\n';
    const connectionType = animateDataFlow ? '==>' : '-->';
    definition += `    osi7 ${connectionType} tcp4\n`;
    definition += `    osi6 ${connectionType} tcp4\n`;
    definition += `    osi5 ${connectionType} tcp4\n`;
    definition += `    osi4 ${connectionType} tcp3\n`;
    definition += `    osi3 ${connectionType} tcp2\n`;
    definition += `    osi2 ${connectionType} tcp1\n`;
    definition += `    osi1 ${connectionType} tcp1\n`;
    
    // Add protocol examples if enabled
    if (showProtocolExamples) {
      definition += '    subgraph Protocols["Protocol Examples"]\n';
      definition += '    direction TB\n';
      definition += '    app["HTTP, FTP, SMTP, DNS"]\n';
      definition += '    pres["SSL/TLS, JPEG, MPEG"]\n';
      definition += '    sess["NetBIOS, RPC, PPTP"]\n';
      definition += '    trans["TCP, UDP, SCTP"]\n';
      definition += '    net["IP, ICMP, OSPF"]\n';
      definition += '    link["Ethernet, PPP, Frame Relay"]\n';
      definition += '    phys["USB, Bluetooth, IEEE 802.11"]\n';
      definition += '    end\n\n';
      
      // Connect protocols to OSI layers
      definition += '    osi7 -.-> app\n';
      definition += '    osi6 -.-> pres\n';
      definition += '    osi5 -.-> sess\n';
      definition += '    osi4 -.-> trans\n';
      definition += '    osi3 -.-> net\n';
      definition += '    osi2 -.-> link\n';
      definition += '    osi1 -.-> phys\n';
    }
    
    // Add styling for nodes
    definition += '    %% Styling\n';
    
    // Style OSI layers
    const osiColors = ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5'];
    for (let i = 1; i <= 7; i++) {
      const color = osiColors[i-1];
      const borderColor = highlightLayer === `osi${i}` ? '#f44336' : '#1976d2';
      const borderWidth = highlightLayer === `osi${i}` ? '3px' : '2px';
      definition += `    style osi${i} fill:${color},stroke:${borderColor},stroke-width:${borderWidth}\n`;
    }
    
    // Style TCP/IP layers
    const tcpColors = ['#fff8e1', '#ffecb3', '#ffe082', '#ffd54f'];
    for (let i = 1; i <= 4; i++) {
      const color = tcpColors[i-1];
      const borderColor = highlightLayer === `tcp${i}` ? '#f44336' : '#ff8f00';
      const borderWidth = highlightLayer === `tcp${i}` ? '3px' : '2px';
      definition += `    style tcp${i} fill:${color},stroke:${borderColor},stroke-width:${borderWidth}\n`;
    }
    
    // Style protocol examples if enabled
    if (showProtocolExamples) {
      definition += '    style app fill:#f3e5f5,stroke:#9c27b0,stroke-width:1px\n';
      definition += '    style pres fill:#f3e5f5,stroke:#9c27b0,stroke-width:1px\n';
      definition += '    style sess fill:#f3e5f5,stroke:#9c27b0,stroke-width:1px\n';
      definition += '    style trans fill:#f3e5f5,stroke:#9c27b0,stroke-width:1px\n';
      definition += '    style net fill:#f3e5f5,stroke:#9c27b0,stroke-width:1px\n';
      definition += '    style link fill:#f3e5f5,stroke:#9c27b0,stroke-width:1px\n';
      definition += '    style phys fill:#f3e5f5,stroke:#9c27b0,stroke-width:1px\n';
    }
    
    // Style subgraphs
    definition += '    style OSI fill:#e3f2fd,stroke:#1976d2,stroke-width:2px\n';
    definition += '    style TCPIP fill:#fff8e1,stroke:#ff8f00,stroke-width:2px\n';
    if (showProtocolExamples) {
      definition += '    style Protocols fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px\n';
    }
    
    return definition;
  };

  const mermaidConfig = {
    theme: 'default',
    flowchart: {
      curve: 'basis',
      useMaxWidth: false,
      htmlLabels: true
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

export default OSIvsTCPIPDiagram;