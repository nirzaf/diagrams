import React, { useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import TCPIPModelMermaid from './diagrams/TCPIPModelMermaid';
import TCPUDPComparisonMermaid from './diagrams/TCPUDPComparisonMermaid';
import SiteMapMermaid from './diagrams/SiteMapMermaid';
import ActivityDiagramMermaid from './diagrams/ActivityDiagramMermaid';
import ClassDiagramMermaid from './diagrams/ClassDiagramMermaid';
import WireframeCreator from './diagrams/WireframeCreator';
import ThreeWayHandshakeDiagram from './diagrams/ThreeWayHandshakeDiagram';
import OSIvsTCPIPDiagram from './diagrams/OSIvsTCPIPDiagram';
import NetworkDiagram from './diagrams/NetworkDiagram';
import { toPng } from 'html-to-image';
import styled from 'styled-components';

// Import sample data
import { tcpipLayers, protocolFeatures, pageNodes, pageConnections, workflowSteps, classFields } from '../data';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f9f9f9;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  font-size: 32px;
  font-weight: 700;
  position: relative;
  padding-bottom: 15px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(to right, #2196f3, #64b5f6);
    border-radius: 3px;
  }
`;

const TabsContainer = styled.div`
  margin-bottom: 30px;
  .MuiTabs-flexContainer {
    justify-content: center;
  }
  .MuiTabs-root {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 5px;
  }
  .MuiTab-root {
    font-weight: 500;
    min-width: 120px;
    transition: all 0.3s ease;
  }
  .Mui-selected {
    font-weight: 600;
  }
  .MuiTabs-indicator {
    height: 3px;
    border-radius: 3px;
  }
`;

const DiagramContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 700px; /* Ensure consistent height */
  
  /* Improved rendering quality */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ExportOptions = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  padding: 15px;
`;

const ExportButton = styled.button`
  padding: 12px 20px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
  
  &:hover {
    background-color: #1976d2;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(33, 150, 243, 0.4);
  }
  
  &::before {
    content: '📥';
    margin-right: 8px;
    font-size: 16px;
  }
`;

const DiagramDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const exportAsPng = () => {
    const element = document.getElementById('diagram-container');
    if (element) {
      toPng(element)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `diagram-${activeTab}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error('Error exporting diagram:', error);
        });
    }
  };

  return (
    <DashboardContainer>
      <Title>Technical Design Report Diagrams</Title>
      
      <TabsContainer>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="TCP/IP Model" />
          <Tab label="TCP vs UDP" />
          <Tab label="OSI vs TCP/IP" />
          <Tab label="TCP Handshake" />
          <Tab label="Network Diagram" />
          <Tab label="Site Map" />
          <Tab label="Activity Diagram" />
          <Tab label="Class Data" />
          <Tab label="Wireframe - Master" />
          <Tab label="Wireframe - Navigation" />
          <Tab label="Wireframe - Movie Detail" />
          <Tab label="Wireframe - Ranking" />
        </Tabs>
      </TabsContainer>
      
      <DiagramContainer id="diagram-container">
        {activeTab === 0 && (
          <TCPIPModelMermaid 
            showComparison={false} 
            animateDataFlow={true} 
            layers={tcpipLayers} 
          />
        )}
        {activeTab === 1 && (
          <TCPUDPComparisonMermaid 
            viewType="table" 
            highlightDifferences={true} 
            showExamples={true} 
            features={protocolFeatures} 
          />
        )}
        {activeTab === 2 && (
          <OSIvsTCPIPDiagram 
            showProtocolExamples={true} 
            animateDataFlow={true} 
          />
        )}
        {activeTab === 3 && (
          <ThreeWayHandshakeDiagram 
            showDetailedExplanations={true} 
            animateHandshake={true} 
          />
        )}
        {activeTab === 4 && (
          <NetworkDiagram 
            showDetailedProtocols={true} 
            highlightSecurityLayers={true} 
            animateDataFlow={true} 
          />
        )}
        {activeTab === 5 && (
          <SiteMapMermaid 
            nodes={pageNodes} 
            connections={pageConnections} 
            showDataFlow={true} 
          />
        )}
        {activeTab === 6 && (
          <ActivityDiagramMermaid 
            workflowSteps={workflowSteps} 
            showDataFlowLabels={true} 
          />
        )}
        {activeTab === 7 && (
          <ClassDiagramMermaid 
            classFields={classFields} 
            showRelationships={true} 
            highlightClass="MovieTVShow" 
          />
        )}
        {activeTab === 8 && (
          <WireframeCreator 
            viewType="masterPage" 
            deviceType="desktop" 
            showAnnotations={true} 
            gridVisible={true} 
            annotations={[
              { id: '1', x: 100, y: 100, text: 'Main navigation menu' },
              { id: '2', x: 300, y: 200, text: 'Featured movies carousel' }
            ]}
          />
        )}
        {activeTab === 9 && (
          <WireframeCreator 
            viewType="navigation" 
            deviceType="desktop" 
            showAnnotations={true} 
            gridVisible={true} 
            annotations={[
              { id: '1', x: 100, y: 70, text: 'Active navigation item' },
              { id: '2', x: 300, y: 70, text: 'Dropdown menu' }
            ]}
          />
        )}
        {activeTab === 10 && (
          <WireframeCreator 
            viewType="movieDetail" 
            deviceType="desktop" 
            showAnnotations={true} 
            gridVisible={true} 
            annotations={[
              { id: '1', x: 200, y: 150, text: 'Movie poster and backdrop' },
              { id: '2', x: 200, y: 350, text: 'User reviews section' }
            ]}
          />
        )}
        {activeTab === 11 && (
          <WireframeCreator 
            viewType="rankingView" 
            deviceType="desktop" 
            showAnnotations={true} 
            gridVisible={true} 
            annotations={[
              { id: '1', x: 100, y: 150, text: 'Ranking filters' },
              { id: '2', x: 300, y: 250, text: 'Sortable columns' }
            ]}
          />
        )}
      </DiagramContainer>
      
      <ExportOptions>
        <ExportButton onClick={exportAsPng}>Export as PNG</ExportButton>
        <ExportButton>Export as JPEG</ExportButton>
        <ExportButton>Export as SVG</ExportButton>
      </ExportOptions>
    </DashboardContainer>
  );
};

export default DiagramDashboard;