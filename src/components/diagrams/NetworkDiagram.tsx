import React from 'react';
import styled from 'styled-components';
import MermaidDiagram from './MermaidDiagram';

interface NetworkDiagramProps {
  showDetailedProtocols?: boolean;
  highlightSecurityLayers?: boolean;
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

const NetworkDiagram: React.FC<NetworkDiagramProps> = ({
  showDetailedProtocols = true,
  highlightSecurityLayers = false,
  animateDataFlow = true
}) => {
  // Generate Mermaid diagram definition
  const generateMermaidDefinition = () => {
    let definition = '%%{init: {"theme": "neutral", "themeVariables": {"primaryColor": "#f5f5f5", "primaryTextColor": "#333", "primaryBorderColor": "#999", "lineColor": "#666", "secondaryColor": "#fafafa", "tertiaryColor": "#f0f0f0"}} }%%\n';
    definition += 'graph TB\n';
    
    // Define main network components
    definition += '    subgraph "Internet"\n';
    definition += '    cloud["Cloud Services"]\n';
    definition += '    www["World Wide Web"]\n';
    definition += '    dns["DNS Servers"]\n';
    definition += '    end\n\n';
    
    // Define local network
    definition += '    subgraph "Local Network"\n';
    definition += '    router["Router"]\n';
    definition += '    firewall["Firewall"]\n';
    definition += '    switch["Network Switch"]\n';
    definition += '    end\n\n';
    
    // Define devices
    definition += '    subgraph "Devices"\n';
    definition += '    pc["Personal Computer"]\n';
    definition += '    mobile["Mobile Device"]\n';
    definition += '    iot["IoT Devices"]\n';
    definition += '    server["Local Server"]\n';
    definition += '    end\n\n';
    
    // Define connections
    const connectionType = animateDataFlow ? '==>' : '-->';
    
    // Internet to local network connections
    definition += `    cloud ${connectionType} router\n`;
    definition += `    www ${connectionType} router\n`;
    definition += `    dns ${connectionType} router\n`;
    
    // Local network connections
    definition += `    router ${connectionType} firewall\n`;
    definition += `    firewall ${connectionType} switch\n`;
    
    // Device connections
    definition += `    switch ${connectionType} pc\n`;
    definition += `    switch ${connectionType} mobile\n`;
    definition += `    switch ${connectionType} iot\n`;
    definition += `    switch ${connectionType} server\n`;
    
    // Add protocol layers if detailed view is enabled
    if (showDetailedProtocols) {
      definition += '\n    subgraph "Protocol Layers"\n';
      definition += '    app["Application Layer (HTTP, FTP, SMTP)"]\n';
      definition += '    transport["Transport Layer (TCP, UDP)"]\n';
      definition += '    network["Network Layer (IP, ICMP)"]\n';
      definition += '    link["Link Layer (Ethernet, WiFi)"]\n';
      definition += '    physical["Physical Layer (Cables, Radio)"]\n';
      definition += '    end\n\n';
      
      // Connect protocol layers
      definition += '    app --> transport\n';
      definition += '    transport --> network\n';
      definition += '    network --> link\n';
      definition += '    link --> physical\n';
      
      // Connect devices to protocol layers
      definition += '    pc -.-> app\n';
      definition += '    mobile -.-> app\n';
    }
    
    // Highlight security layers if enabled
    if (highlightSecurityLayers) {
      definition += '\n    subgraph "Security Measures"\n';
      definition += '    ssl["SSL/TLS Encryption"]\n';
      definition += '    vpn["VPN Tunneling"]\n';
      definition += '    ids["Intrusion Detection"]\n';
      definition += '    end\n\n';
      
      // Connect security to network components
      definition += '    ssl -.-> app\n';
      definition += '    vpn -.-> network\n';
      definition += '    ids -.-> firewall\n';
      
      // Style security nodes
      definition += '    style ssl fill:#e8f5e9,stroke:#4caf50,stroke-width:2px\n';
      definition += '    style vpn fill:#e8f5e9,stroke:#4caf50,stroke-width:2px\n';
      definition += '    style ids fill:#e8f5e9,stroke:#4caf50,stroke-width:2px\n';
      definition += '    style firewall fill:#ffebee,stroke:#f44336,stroke-width:2px\n';
    }
    
    // Add styling for nodes
    definition += '    style cloud fill:#e3f2fd,stroke:#2196f3,stroke-width:2px\n';
    definition += '    style www fill:#e3f2fd,stroke:#2196f3,stroke-width:2px\n';
    definition += '    style dns fill:#e3f2fd,stroke:#2196f3,stroke-width:2px\n';
    definition += '    style router fill:#fff3e0,stroke:#ff9800,stroke-width:2px\n';
    definition += '    style switch fill:#fff3e0,stroke:#ff9800,stroke-width:2px\n';
    definition += '    style pc fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px\n';
    definition += '    style mobile fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px\n';
    definition += '    style iot fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px\n';
    definition += '    style server fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px\n';
    
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

export default NetworkDiagram;