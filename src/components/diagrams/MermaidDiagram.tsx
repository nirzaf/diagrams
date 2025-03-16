import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import styled from 'styled-components';

interface MermaidDiagramProps {
  chartDefinition: string;
  config?: any;
  className?: string;
}

const DiagramContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  svg {
    max-width: 100%;
    height: auto;
  }
`;

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chartDefinition, config, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Clear previous diagram
      containerRef.current.innerHTML = '';
      
      // Configure mermaid
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        ...config
      });

      // Generate unique ID for the diagram
      const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
      
      // Render the diagram
      try {
        mermaid.render(id, chartDefinition).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        });
      } catch (error) {
        console.error('Error rendering mermaid diagram:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div style="color: red;">Error rendering diagram: ${error}</div>`;
        }
      }
    }
  }, [chartDefinition, config]);

  return (
    <DiagramContainer ref={containerRef} className={className} />
  );
};

export default MermaidDiagram;