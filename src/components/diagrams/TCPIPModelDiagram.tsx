import React, { useState } from 'react';
import { TCPIPLayerInfo } from '../../types';
import styled from 'styled-components';

interface TCPIPModelDiagramProps {
  showComparison: boolean;
  highlightLayer?: string;
  animateDataFlow: boolean;
  layers: TCPIPLayerInfo[];
}

const DiagramContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const Layer = styled.div<{ isHighlighted: boolean }>`
  padding: 16px;
  border-radius: 4px;
  background-color: ${props => props.isHighlighted ? '#e3f2fd' : '#f5f5f5'};
  border: 1px solid ${props => props.isHighlighted ? '#2196f3' : '#ddd'};
  margin-bottom: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background-color: #e3f2fd;
    transform: scale(1.01);
  }
`;

const LayerTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
`;

const LayerDescription = styled.p`
  margin: 0 0 12px 0;
  color: #666;
`;

const ProtocolList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const Protocol = styled.span`
  background-color: #2196f3;
  color: white;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 12px;
`;

const ResponsibilityList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: #555;
`;

const ResponsibilityItem = styled.li`
  margin-bottom: 4px;
`;

const DataFlow = styled.div<{ animate: boolean }>`
  height: 20px;
  position: relative;
  margin: 4px 0;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #2196f3;
    transform: translateY(-50%);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: ${props => props.animate ? '0%' : '100%'};
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #2196f3;
    transform: translateY(-50%);
    animation: ${props => props.animate ? 'flowAnimation 2s infinite linear' : 'none'};
  }
  
  @keyframes flowAnimation {
    0% {
      left: 0%;
    }
    100% {
      left: 100%;
    }
  }
`;

const ComparisonContainer = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
`;

const ModelColumn = styled.div`
  flex: 1;
`;

const ModelTitle = styled.h2`
  text-align: center;
  margin-bottom: 16px;
  color: #333;
`;

const OSILayers = [
  {
    name: 'Application',
    description: 'Provides network services directly to end-users',
    protocols: ['HTTP', 'FTP', 'SMTP', 'Telnet'],
    responsibilities: ['User interface', 'Data representation']
  },
  {
    name: 'Presentation',
    description: 'Handles data formatting, encryption, and compression',
    protocols: ['SSL/TLS', 'JPEG', 'MPEG'],
    responsibilities: ['Data translation', 'Encryption/Decryption', 'Compression']
  },
  {
    name: 'Session',
    description: 'Manages sessions between applications',
    protocols: ['NetBIOS', 'RPC', 'PPTP'],
    responsibilities: ['Session establishment', 'Session maintenance', 'Session termination']
  },
  {
    name: 'Transport',
    description: 'Provides end-to-end communication and data flow control',
    protocols: ['TCP', 'UDP', 'SCTP'],
    responsibilities: ['Segmentation', 'Flow control', 'Error recovery']
  },
  {
    name: 'Network',
    description: 'Handles routing of data packets between networks',
    protocols: ['IP', 'ICMP', 'OSPF'],
    responsibilities: ['Logical addressing', 'Routing', 'Path determination']
  },
  {
    name: 'Data Link',
    description: 'Provides node-to-node data transfer',
    protocols: ['Ethernet', 'PPP', 'Frame Relay'],
    responsibilities: ['Physical addressing', 'Error detection', 'Media access control']
  },
  {
    name: 'Physical',
    description: 'Transmits raw bit stream over physical medium',
    protocols: ['USB', 'Bluetooth', 'IEEE 802.11'],
    responsibilities: ['Bit transmission', 'Physical connections', 'Topology']
  }
];

const TCPIPModelDiagram: React.FC<TCPIPModelDiagramProps> = ({
  showComparison,
  highlightLayer,
  animateDataFlow,
  layers
}) => {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(highlightLayer || null);

  const handleLayerClick = (layerName: string) => {
    setSelectedLayer(layerName === selectedLayer ? null : layerName);
  };

  const renderLayer = (layer: TCPIPLayerInfo, index: number, isOSI = false) => (
    <React.Fragment key={`${isOSI ? 'osi' : 'tcpip'}-${layer.name}`}>
      <Layer 
        isHighlighted={layer.name === selectedLayer}
        onClick={() => handleLayerClick(layer.name)}
      >
        <LayerTitle>{layer.name} Layer</LayerTitle>
        <LayerDescription>{layer.description}</LayerDescription>
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#444' }}>Key Protocols:</h4>
          <ProtocolList>
            {layer.protocols.map(protocol => (
              <Protocol key={protocol}>{protocol}</Protocol>
            ))}
          </ProtocolList>
        </div>
        <ResponsibilityList>
          {layer.responsibilities.map(responsibility => (
            <ResponsibilityItem key={responsibility}>{responsibility}</ResponsibilityItem>
          ))}
        </ResponsibilityList>
      </Layer>
      {index < (isOSI ? OSILayers.length - 1 : layers.length - 1) && <DataFlow animate={animateDataFlow} />}
    </React.Fragment>
  );

  return (
    <div>
      {showComparison ? (
        <ComparisonContainer>
          <ModelColumn>
            <ModelTitle>TCP/IP Model</ModelTitle>
            <DiagramContainer>
              {layers.map((layer, index) => renderLayer(layer, index))}
            </DiagramContainer>
          </ModelColumn>
          <ModelColumn>
            <ModelTitle>OSI Model</ModelTitle>
            <DiagramContainer>
              {OSILayers.map((layer, index) => renderLayer(layer, index, true))}
            </DiagramContainer>
          </ModelColumn>
        </ComparisonContainer>
      ) : (
        <DiagramContainer>
          {layers.map((layer, index) => renderLayer(layer, index))}
        </DiagramContainer>
      )}
    </div>
  );
};

export default TCPIPModelDiagram;