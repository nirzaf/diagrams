import React, { useState } from 'react';
import styled from 'styled-components';
import { ClassField, ClassType } from '../../types';

interface ClassDataTableProps {
  classType: ClassType;
  showDataTypes: boolean;
  showExamples: boolean;
  enableFiltering: boolean;
  fields: ClassField[];
}

const TableContainer = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
`;

const TableHeader = styled.th`
  padding: 15px 20px;
  text-align: left;
  background-color: #2196f3;
  color: white;
  font-weight: 600;
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

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  &:hover {
    background-color: #e3f2fd;
  }
  
  transition: background-color 0.2s ease;
`;

const TableCell = styled.td`
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  vertical-align: top;
  position: relative;
  
  &:not(:last-child) {
    border-right: 1px solid #eee;
  }
  
  ${TableRow}:last-child & {
    border-bottom: none;
  }
`;

const DataTypeCell = styled(TableCell)`
  color: #0d47a1;
  font-family: monospace;
  font-size: 14px;
  background-color: rgba(33, 150, 243, 0.05);
  font-weight: 500;
`;

const ExamplesList = styled.ul`
  margin: 0;
  padding-left: 5px;
  list-style-type: none;
`;

const ExampleItem = styled.li`
  margin-bottom: 8px;
  font-family: monospace;
  font-size: 13px;
  color: #555;
  padding: 6px 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  border-left: 3px solid #2196f3;
  position: relative;
  padding-left: 20px;
  
  &::before {
    content: '→';
    position: absolute;
    left: 8px;
    color: #2196f3;
    font-weight: bold;
  }
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  flex: 1;
  max-width: 300px;
`;

const ClassSelector = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ClassButton = styled.button<{ isActive: boolean }>`
  padding: 8px 16px;
  background-color: ${props => props.isActive ? '#2196f3' : 'white'};
  color: ${props => props.isActive ? 'white' : '#333'};
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.isActive ? '#1976d2' : '#f5f5f5'};
  }
`;

const ClassDataTable: React.FC<ClassDataTableProps> = ({
  classType: initialClassType,
  showDataTypes: initialShowDataTypes,
  showExamples: initialShowExamples,
  enableFiltering: initialEnableFiltering,
  fields
}) => {
  const [classType, setClassType] = useState<ClassType>(initialClassType);
  const [showDataTypes, setShowDataTypes] = useState<boolean>(initialShowDataTypes);
  const [showExamples, setShowExamples] = useState<boolean>(initialShowExamples);
  const [enableFiltering, setEnableFiltering] = useState<boolean>(initialEnableFiltering);
  const [filterText, setFilterText] = useState<string>('');

  const classTypes: ClassType[] = ['Actor', 'Movie', 'User', 'UserReview', 'ExternalReview'];

  // Filter fields based on search text
  const filteredFields = fields.filter(field => {
    if (!enableFiltering || filterText.trim() === '') return true;
    
    const searchText = filterText.toLowerCase();
    return (
      field.name.toLowerCase().includes(searchText) ||
      field.dataType.toLowerCase().includes(searchText) ||
      field.description.toLowerCase().includes(searchText) ||
      field.examples.some(example => example.toLowerCase().includes(searchText))
    );
  });

  return (
    <TableContainer>
      <ClassSelector>
        {classTypes.map(type => (
          <ClassButton
            key={type}
            isActive={classType === type}
            onClick={() => setClassType(type)}
          >
            {type}
          </ClassButton>
        ))}
      </ClassSelector>

      <FilterContainer>
        <FilterInput
          type="text"
          placeholder="Search fields..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          disabled={!enableFiltering}
        />
        <ClassButton
          isActive={enableFiltering}
          onClick={() => setEnableFiltering(!enableFiltering)}
        >
          {enableFiltering ? 'Disable Filter' : 'Enable Filter'}
        </ClassButton>
        <ClassButton
          isActive={showDataTypes}
          onClick={() => setShowDataTypes(!showDataTypes)}
        >
          {showDataTypes ? 'Hide Data Types' : 'Show Data Types'}
        </ClassButton>
        <ClassButton
          isActive={showExamples}
          onClick={() => setShowExamples(!showExamples)}
        >
          {showExamples ? 'Hide Examples' : 'Show Examples'}
        </ClassButton>
      </FilterContainer>

      <Table>
        <thead>
          <tr>
            <TableHeader>Field Name</TableHeader>
            {showDataTypes && <TableHeader>Data Type</TableHeader>}
            <TableHeader>Description</TableHeader>
            {showExamples && <TableHeader>Examples</TableHeader>}
          </tr>
        </thead>
        <tbody>
          {filteredFields.map((field, index) => (
            <TableRow key={index}>
              <TableCell>{field.name}</TableCell>
              {showDataTypes && <DataTypeCell>{field.dataType}</DataTypeCell>}
              <TableCell>{field.description}</TableCell>
              {showExamples && (
                <TableCell>
                  <ExamplesList>
                    {field.examples.map((example, i) => (
                      <ExampleItem key={i}>{example}</ExampleItem>
                    ))}
                  </ExamplesList>
                </TableCell>
              )}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default ClassDataTable;