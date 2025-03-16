import React from 'react';
import styled from 'styled-components';
import MermaidDiagram from './MermaidDiagram';
import { ClassFields } from '../../types';

interface ClassDiagramMermaidProps {
  classFields: ClassFields;
  showRelationships: boolean;
  highlightClass?: string;
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

const ClassDiagramMermaid: React.FC<ClassDiagramMermaidProps> = ({ 
  classFields,
  showRelationships,
  highlightClass 
}) => {
  // Apply highlighting to the specified class if provided
  // Generate enhanced Mermaid class diagram definition
  const generateMermaidDefinition = () => {
    let definition = '%%{init: {"theme": "neutral", "themeVariables": {"primaryColor": "#f5f5f5", "primaryTextColor": "#333", "primaryBorderColor": "#999", "lineColor": "#666", "secondaryColor": "#fafafa", "tertiaryColor": "#f0f0f0"}} }%%\n';
    definition += 'classDiagram\n';
    definition += '    title "Movie Recommendation System Class Diagram"\n';
    
    // Define classes and their fields with enhanced documentation
    Object.entries(classFields).forEach(([className, fields]) => {
      // Start class definition
      definition += `    class ${className} {\n`;
      
      // Add fields with better formatting and documentation
      fields.forEach(field => {
        const prefix = field.dataType.includes('()') ? '+' : field.dataType.startsWith('private') ? '-' : '+';
        const dataType = field.dataType.replace('private ', '');
        // Add example as a comment if available
        const example = field.examples && field.examples.length > 0 ? ` %% Example: ${field.examples[0]}` : '';
        definition += `        ${prefix}${field.name} ${dataType}${example}\n`;
      });
      
      // End class definition
      definition += '    }\n';
      
      // Add class description as a note
      const classDescription = className === 'Movie' ? 'Core entity representing movies in the system' :
                              className === 'User' ? 'Represents system users with preferences' :
                              className === 'Actor' ? 'Represents actors appearing in movies' :
                              className === 'UserReview' ? 'User-generated movie reviews' :
                              className === 'ExternalReview' ? 'Reviews from external sources' : '';
      
      if (classDescription) {
        definition += `    note for ${className} "${classDescription}"\n`;
      }
    });
    
    // Add relationships if enabled with enhanced styling
    if (showRelationships) {
      // Movie to Actor relationship (many-to-many)
      definition += '    Movie "1..n" <--> "1..n" Actor: appears in\n';
      
      // Movie to UserReview relationship (one-to-many)
      definition += '    Movie "1" <-- "0..n" UserReview: reviews\n';
      
      // Movie to ExternalReview relationship (one-to-many)
      definition += '    Movie "1" <-- "0..n" ExternalReview: critiques\n';
      
      // User to UserReview relationship (one-to-many)
      definition += '    User "1" --> "0..n" UserReview: writes\n';
      
      // User to Movie relationship (many-to-many for watchlist)
      definition += '    User "1..n" <--> "1..n" Movie: watches\n';
    }
    
    // Add enhanced styling for all classes
    definition += '    style Movie fill:linear-gradient(to bottom, #e3f2fd, #bbdefb),stroke:#2196f3,stroke-width:2px\n';
    definition += '    style User fill:linear-gradient(to bottom, #e8f5e9, #c8e6c9),stroke:#4caf50,stroke-width:2px\n';
    definition += '    style Actor fill:linear-gradient(to bottom, #f3e5f5, #e1bee7),stroke:#9c27b0,stroke-width:2px\n';
    definition += '    style UserReview fill:linear-gradient(to bottom, #fff3e0, #ffe0b2),stroke:#ff9800,stroke-width:2px\n';
    definition += '    style ExternalReview fill:linear-gradient(to bottom, #fff3e0, #ffe0b2),stroke:#ff9800,stroke-width:2px\n';
    
    // Apply highlighting to the specified class if provided
    if (highlightClass) {
      definition += `    style ${highlightClass} fill:#e3f2fd,stroke:#2196f3,stroke-width:3px\n`;
    }
    
    return definition;
  };

  const mermaidConfig = {
    theme: 'default',
    themeVariables: {
      primaryColor: '#f5f5f5',
      primaryTextColor: '#333',
      primaryBorderColor: '#999',
      lineColor: '#666',
      secondaryColor: '#fafafa',
      tertiaryColor: '#f0f0f0'
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

export default ClassDiagramMermaid;