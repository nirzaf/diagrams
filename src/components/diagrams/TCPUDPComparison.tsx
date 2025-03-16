import React, { useState } from 'react';
import { ProtocolFeature } from '../../types';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface TCPUDPComparisonProps {
  viewType: 'bar' | 'radar' | 'table';
  highlightDifferences: boolean;
  showExamples: boolean;
  features: ProtocolFeature[];
}

const ComparisonContainer = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ViewTypeSelector = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  justify-content: center;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const ViewButton = styled.button<{ isActive: boolean }>`
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  background-color: ${props => props.isActive ? '#2196f3' : 'white'};
  color: ${props => props.isActive ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${props => props.isActive ? '600' : '400'};
  box-shadow: ${props => props.isActive ? '0 4px 8px rgba(33, 150, 243, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.05)'};
  
  &:hover {
    background-color: ${props => props.isActive ? '#1976d2' : '#f5f5f5'};
    transform: translateY(-2px);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  padding: 15px;
  text-align: left;
  background-color: #2196f3;
  color: white;
  font-weight: 600;
  border: none;
  position: relative;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 25%;
    height: 50%;
    width: 1px;
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const TableCell = styled.td<{ highlight?: boolean }>`
  padding: 15px;
  border-bottom: 1px solid #eee;
  background-color: ${props => props.highlight ? '#e3f2fd' : 'white'};
  transition: background-color 0.2s ease;
  position: relative;
  
  &:first-child {
    font-weight: 500;
  }
  
  &:not(:last-child) {
    border-right: 1px solid #eee;
  }
  
  tr:hover & {
    background-color: ${props => props.highlight ? '#bbdefb' : '#f5f5f5'};
  }
`;

const ChartContainer = styled.div`
  height: 450px;
  margin-top: 25px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const TCPUDPComparison: React.FC<TCPUDPComparisonProps> = ({
  viewType: initialViewType,
  highlightDifferences,
  showExamples,
  features
}) => {
  const [viewType, setViewType] = useState<'bar' | 'radar' | 'table'>(initialViewType);

  // Transform data for charts
  const chartData = features.map(feature => {
    // For numeric values, use as is; for string values, assign a numeric value for visualization
    const tcpNumericValue = typeof feature.tcpValue === 'number' 
      ? feature.tcpValue 
      : feature.tcpValue === 'Yes' ? 5 : feature.tcpValue === 'No' ? 0 : 3;
    
    const udpNumericValue = typeof feature.udpValue === 'number' 
      ? feature.udpValue 
      : feature.udpValue === 'Yes' ? 5 : feature.udpValue === 'No' ? 0 : 3;

    return {
      feature: feature.feature,
      TCP: tcpNumericValue,
      UDP: udpNumericValue,
      description: feature.description,
      tcpOriginal: feature.tcpValue,
      udpOriginal: feature.udpValue
    };
  });

  // Determine if values are significantly different for highlighting
  const isDifferent = (tcp: number | string, udp: number | string) => {
    if (typeof tcp === 'number' && typeof udp === 'number') {
      return Math.abs(tcp - udp) >= 2;
    }
    return tcp !== udp;
  };

  return (
    <ComparisonContainer>
      <ViewTypeSelector>
        <ViewButton 
          isActive={viewType === 'bar'} 
          onClick={() => setViewType('bar')}
        >
          Bar Chart
        </ViewButton>
        <ViewButton 
          isActive={viewType === 'radar'} 
          onClick={() => setViewType('radar')}
        >
          Radar Chart
        </ViewButton>
        <ViewButton 
          isActive={viewType === 'table'} 
          onClick={() => setViewType('table')}
        >
          Table View
        </ViewButton>
      </ViewTypeSelector>

      {viewType === 'bar' && (
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="feature" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip 
                formatter={(_value, name, props) => {
                  const originalItem = features.find(f => f.feature === props.payload.feature);
                  return name === 'TCP' 
                    ? [originalItem?.tcpValue, 'TCP'] 
                    : [originalItem?.udpValue, 'UDP'];
                }}
              />
              <Legend />
              <Bar dataKey="TCP" fill="#8884d8" />
              <Bar dataKey="UDP" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}

      {viewType === 'radar' && (
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={150} data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="feature" />
              <PolarRadiusAxis />
              <Radar
                name="TCP"
                dataKey="TCP"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Radar
                name="UDP"
                dataKey="UDP"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
              <Legend />
              <Tooltip 
                formatter={(_value, name, props) => {
                  const originalItem = features.find(f => f.feature === props.payload.feature);
                  return name === 'TCP' 
                    ? [originalItem?.tcpValue, 'TCP'] 
                    : [originalItem?.udpValue, 'UDP'];
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}

      {viewType === 'table' && (
        <Table>
          <thead>
            <tr>
              <TableHeader>Feature</TableHeader>
              <TableHeader>TCP</TableHeader>
              <TableHeader>UDP</TableHeader>
              {showExamples && <TableHeader>Description</TableHeader>}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => {
              const shouldHighlight = highlightDifferences && 
                isDifferent(feature.tcpValue, feature.udpValue);
              
              return (
                <tr key={index}>
                  <TableCell>{feature.feature}</TableCell>
                  <TableCell highlight={shouldHighlight}>{feature.tcpValue.toString()}</TableCell>
                  <TableCell highlight={shouldHighlight}>{feature.udpValue.toString()}</TableCell>
                  {showExamples && (
                    <TableCell>
                      {feature.description}
                    </TableCell>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </ComparisonContainer>
  );
};

export default TCPUDPComparison;