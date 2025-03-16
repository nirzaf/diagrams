import React, { useState } from 'react';
import styled from 'styled-components';
import { ViewType, DeviceType, Annotation } from '../../types';

interface WireframeCreatorProps {
  viewType: ViewType;
  deviceType: DeviceType;
  showAnnotations: boolean;
  gridVisible: boolean;
  annotations?: Annotation[];
}

const WireframeContainer = styled.div<{ deviceType: DeviceType }>`
  width: ${props => props.deviceType === 'mobile' ? '375px' : '1024px'};
  height: ${props => props.deviceType === 'mobile' ? '667px' : '768px'};
  margin: 0 auto;
  border: 2px solid #bbb;
  border-radius: ${props => props.deviceType === 'mobile' ? '30px' : '6px'};
  position: relative;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
  
  ${props => props.deviceType === 'mobile' && `
    &::before {
      content: '';
      position: absolute;
      top: 15px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 10px;
      background-color: #ddd;
      border-radius: 5px;
      z-index: 10;
    }
  `}
`;

const Grid = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: ${props => props.visible ? 'linear-gradient(#ddd 1px, transparent 1px), linear-gradient(90deg, #ddd 1px, transparent 1px)' : 'none'};
  background-size: 20px 20px;
  opacity: 0.3;
  pointer-events: none;
`;

const AnnotationMarker = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: 28px;
  height: 28px;
  background-color: #ff9800;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 152, 0, 0.6);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -5px;
    right: -5px;
    bottom: -5px;
    left: -5px;
    border: 2px solid rgba(255, 152, 0, 0.3);
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.3);
      opacity: 0;
    }
  }
`;

const AnnotationTooltip = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x + 35}px;
  top: ${props => props.y}px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px;
  max-width: 250px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 11;
  font-size: 13px;
  line-height: 1.5;
  color: #333;
  
  &::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 50%;
    transform: translateY(-50%);
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid white;
    filter: drop-shadow(-3px 0px 2px rgba(0, 0, 0, 0.1));
  }
`;

const ControlPanel = styled.div`
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const Button = styled.button<{ isActive?: boolean }>`
  padding: 10px 18px;
  background-color: ${props => props.isActive ? '#2196f3' : 'white'};
  color: ${props => props.isActive ? 'white' : '#333'};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: ${props => props.isActive ? '600' : '400'};
  box-shadow: ${props => props.isActive ? '0 4px 8px rgba(33, 150, 243, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.05)'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.isActive ? '#1976d2' : '#f5f5f5'};
    transform: translateY(-2px);
    box-shadow: ${props => props.isActive ? '0 6px 12px rgba(33, 150, 243, 0.4)' : '0 4px 8px rgba(0, 0, 0, 0.1)'};
  }
`;

// Master Page Components
const Header = styled.div`
  height: 70px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  padding: 0 25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
`;

const Logo = styled.div`
  width: 120px;
  height: 40px;
  background-color: #ddd;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%);
  }
`;

const SearchBar = styled.div`
  flex: 1;
  height: 40px;
  margin: 0 25px;
  background-color: #ddd;
  border-radius: 20px;
  position: relative;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    background-color: #bbb;
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 27px;
    top: 65%;
    width: 8px;
    height: 2px;
    background-color: #bbb;
    transform: rotate(45deg);
  }
`;

const UserMenu = styled.div`
  width: 40px;
  height: 40px;
  background-color: #ddd;
  border-radius: 50%;
`;

const Navigation = styled.div`
  height: 50px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 20px;
`;

const NavItem = styled.div`
  width: 80px;
  height: 30px;
  background-color: #ddd;
  border-radius: 4px;
  margin: 0 5px;
`;

const ContentArea = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const MovieCard = styled.div`
  width: 160px;
  height: 240px;
  background-color: #ddd;
  border-radius: 4px;
`;

const MovieDetailHeader = styled.div`
  height: 300px;
  background-color: #ddd;
  position: relative;
`;

const MovieInfo = styled.div`
  padding: 20px;
`;

const MovieTitle = styled.div`
  height: 30px;
  width: 70%;
  background-color: #ddd;
  margin-bottom: 10px;
`;

const MovieMeta = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const MetaItem = styled.div`
  height: 20px;
  width: 80px;
  background-color: #ddd;
  border-radius: 4px;
`;

const MovieDescription = styled.div`
  height: 100px;
  background-color: #ddd;
  margin-bottom: 20px;
  border-radius: 4px;
`;

const ReviewSection = styled.div`
  margin-top: 20px;
`;

const ReviewTitle = styled.div`
  height: 24px;
  width: 150px;
  background-color: #ddd;
  margin-bottom: 10px;
`;

const ReviewItem = styled.div`
  height: 80px;
  background-color: #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
`;

const RankingTable = styled.div`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  height: 40px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  display: flex;
`;

const TableHeaderCell = styled.div`
  flex: 1;
  padding: 10px;
  border-right: 1px solid #ddd;
  &:last-child {
    border-right: none;
  }
`;

const TableRow = styled.div`
  height: 60px;
  display: flex;
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.div`
  flex: 1;
  padding: 10px;
  border-right: 1px solid #ddd;
  display: flex;
  align-items: center;
  &:last-child {
    border-right: none;
  }
`;

const WireframeCreator: React.FC<WireframeCreatorProps> = ({
  viewType,
  deviceType,
  showAnnotations,
  gridVisible,
  annotations = []
}) => {
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  const [currentViewType, setCurrentViewType] = useState<ViewType>(viewType);
  const [currentDeviceType, setCurrentDeviceType] = useState<DeviceType>(deviceType);

  const handleAnnotationClick = (id: string) => {
    setActiveAnnotation(activeAnnotation === id ? null : id);
  };

  const renderMasterPage = () => (
    <>
      <Header>
        <Logo />
        <SearchBar />
        <UserMenu />
      </Header>
      <Navigation>
        {Array.from({ length: deviceType === 'mobile' ? 3 : 5 }).map((_, index) => (
          <NavItem key={index} />
        ))}
      </Navigation>
      <ContentArea>
        {Array.from({ length: deviceType === 'mobile' ? 4 : 12 }).map((_, index) => (
          <MovieCard key={index} />
        ))}
      </ContentArea>
    </>
  );

  const renderNavigation = () => (
    <>
      <Header>
        <Logo />
        <SearchBar />
        <UserMenu />
      </Header>
      <Navigation>
        {Array.from({ length: deviceType === 'mobile' ? 3 : 5 }).map((_, index) => (
          <NavItem key={index} style={{ backgroundColor: index === 0 ? '#2196f3' : '#ddd' }} />
        ))}
      </Navigation>
      {deviceType === 'mobile' && (
        <div style={{ padding: '20px' }}>
          <div style={{ height: '40px', backgroundColor: '#f5f5f5', marginBottom: '10px', borderRadius: '4px' }} />
          <div style={{ height: '40px', backgroundColor: '#f5f5f5', marginBottom: '10px', borderRadius: '4px' }} />
          <div style={{ height: '40px', backgroundColor: '#f5f5f5', marginBottom: '10px', borderRadius: '4px' }} />
        </div>
      )}
    </>
  );

  const renderMovieDetail = () => (
    <>
      <MovieDetailHeader />
      <MovieInfo>
        <MovieTitle />
        <MovieMeta>
          <MetaItem />
          <MetaItem />
          <MetaItem />
        </MovieMeta>
        <MovieDescription />
        <ReviewSection>
          <ReviewTitle />
          <ReviewItem />
          <ReviewItem />
        </ReviewSection>
      </MovieInfo>
    </>
  );

  const renderRankingView = () => (
    <>
      <Header>
        <Logo />
        <SearchBar />
        <UserMenu />
      </Header>
      <Navigation>
        {Array.from({ length: deviceType === 'mobile' ? 3 : 5 }).map((_, index) => (
          <NavItem key={index} style={{ backgroundColor: index === 1 ? '#2196f3' : '#ddd' }} />
        ))}
      </Navigation>
      <div style={{ padding: '20px' }}>
        <RankingTable>
          <TableHeader>
            <TableHeaderCell>Rank</TableHeaderCell>
            <TableHeaderCell>Movie</TableHeaderCell>
            <TableHeaderCell>Rating</TableHeaderCell>
            {deviceType === 'desktop' && <TableHeaderCell>Votes</TableHeaderCell>}
          </TableHeader>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell style={{ justifyContent: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#ddd', marginRight: '10px', borderRadius: '4px' }} />
                <div style={{ width: '100px', height: '20px', backgroundColor: '#ddd', borderRadius: '4px' }} />
              </TableCell>
              <TableCell>★★★★☆</TableCell>
              {deviceType === 'desktop' && <TableCell>1,234</TableCell>}
            </TableRow>
          ))}
        </RankingTable>
      </div>
    </>
  );

  const renderContent = () => {
    switch (currentViewType) {
      case 'masterPage':
        return renderMasterPage();
      case 'navigation':
        return renderNavigation();
      case 'movieDetail':
        return renderMovieDetail();
      case 'rankingView':
        return renderRankingView();
      default:
        return renderMasterPage();
    }
  };

  return (
    <div>
      <ControlPanel>
        <Button 
          isActive={currentViewType === 'masterPage'} 
          onClick={() => setCurrentViewType('masterPage')}
        >
          Master Page
        </Button>
        <Button 
          isActive={currentViewType === 'navigation'} 
          onClick={() => setCurrentViewType('navigation')}
        >
          Navigation
        </Button>
        <Button 
          isActive={currentViewType === 'movieDetail'} 
          onClick={() => setCurrentViewType('movieDetail')}
        >
          Movie Detail
        </Button>
        <Button 
          isActive={currentViewType === 'rankingView'} 
          onClick={() => setCurrentViewType('rankingView')}
        >
          Ranking View
        </Button>
        <Button 
          isActive={currentDeviceType === 'desktop'} 
          onClick={() => setCurrentDeviceType('desktop')}
        >
          Desktop
        </Button>
        <Button 
          isActive={currentDeviceType === 'mobile'} 
          onClick={() => setCurrentDeviceType('mobile')}
        >
          Mobile
        </Button>
      </ControlPanel>
      
      <WireframeContainer deviceType={currentDeviceType}>
        <Grid visible={gridVisible} />
        {renderContent()}
        
        {showAnnotations && annotations.map((annotation, index) => (
          <React.Fragment key={annotation.id}>
            <AnnotationMarker 
              x={annotation.x} 
              y={annotation.y}
              onClick={() => handleAnnotationClick(annotation.id)}
            >
              {index + 1}
            </AnnotationMarker>
            {activeAnnotation === annotation.id && (
              <AnnotationTooltip x={annotation.x} y={annotation.y}>
                {annotation.text}
              </AnnotationTooltip>
            )}
          </React.Fragment>
        ))}
      </WireframeContainer>
    </div>
  );
};

export default WireframeCreator;