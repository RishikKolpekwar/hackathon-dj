import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useReactFlow } from '@xyflow/react';

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 999;
`;

const DrawerPositioner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(${props => props.position.x}px, ${props => props.position.y}px) scale(${props => props.position.zoom});
  transform-origin: top center;
  z-index: 1000;
  pointer-events: none;
`;

const DrawerContainer = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
  min-width: 280px;
  max-width: 320px;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: ${slideUp} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: auto;
`;

const Connector = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 20px;
  background: linear-gradient(to bottom, rgba(168, 83, 186, 0.8), rgba(168, 83, 186, 0.3));
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #a853ba;
    box-shadow: 0 0 8px rgba(168, 83, 186, 0.6);
  }
`;

const PopupTitle = styled.div`
  color: #888;
  font-size: 11px;
  font-weight: 500;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ConnectionInfo = styled.div`
  color: #999;
  font-size: 11px;
  margin-bottom: 12px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  border-left: 2px solid #a853ba;
`;

const TransitionOption = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 10px;
  margin-bottom: 2px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  background: ${props => props.isSelected ? 'rgba(168, 83, 186, 0.2)' : (props.isHovered ? '#252525' : 'transparent')};
  border: 1px solid ${props => props.isSelected ? '#a853ba' : (props.isHovered ? '#444' : 'transparent')};

  &:hover {
    background: ${props => props.isSelected ? 'rgba(168, 83, 186, 0.25)' : '#252525'};
    border: 1px solid ${props => props.isSelected ? '#a853ba' : '#444'};
  }
`;

const TransitionName = styled.div`
  color: ${props => props.isSelected ? '#ddd' : '#ccc'};
  font-size: 12px;
  font-weight: ${props => props.isSelected ? '500' : '400'};
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.3;
`;

const TransitionDetails = styled.div`
  color: #777;
  font-size: 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.3;
`;

const CheckMark = styled.span`
  color: #a853ba;
  font-size: 12px;
  width: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  background: none;
  border: none;
  color: #666;
  font-size: 18px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  line-height: 1;
  transition: all 0.2s ease;

  &:hover {
    color: #aaa;
    background: #252525;
  }
`;

const TransitionPopup = ({
  edge,
  sourceSong,
  targetSong,
  selectedTransition,
  onSelectTransition,
  onClose
}) => {
  const [hoveredOption, setHoveredOption] = useState(null);
  const [, forceUpdate] = useState({});
  const { getViewport, getNode } = useReactFlow();

  // Force re-render on animation frames to keep position in sync
  React.useEffect(() => {
    let animationFrameId;
    const updatePosition = () => {
      forceUpdate({});
      animationFrameId = requestAnimationFrame(updatePosition);
    };
    animationFrameId = requestAnimationFrame(updatePosition);
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Find available transitions from source song to target song
  const availableTransitions = React.useMemo(() => {
    if (!sourceSong || !sourceSong.transitions) return [];

    return sourceSong.transitions.filter(t =>
      t.TransitionTo === targetSong.id || t.TransitionTo === 'ANY'
    );
  }, [sourceSong, targetSong]);

  const handleSelectTransition = (transition) => {
    onSelectTransition(edge.id, transition);
    onClose();
  };

  // Get source and target nodes
  const sourceNode = getNode(edge.source);
  const targetNode = getNode(edge.target);

  if (!sourceNode || !targetNode) return null;

  // Calculate position at edge midpoint
  const viewport = getViewport();
  const sourceElement = document.querySelector(`[data-id="${edge.source}"]`);
  const targetElement = document.querySelector(`[data-id="${edge.target}"]`);

  if (!sourceElement || !targetElement) return null;

  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();
  const reactFlowElement = document.querySelector('.react-flow');

  if (!reactFlowElement) return null;

  const reactFlowRect = reactFlowElement.getBoundingClientRect();

  // Calculate midpoint between source and target nodes
  const sourceCenterX = sourceRect.left + (sourceRect.width / 2);
  const sourceCenterY = sourceRect.top + (sourceRect.height / 2);
  const targetCenterX = targetRect.left + (targetRect.width / 2);
  const targetCenterY = targetRect.top + (targetRect.height / 2);

  const midX = (sourceCenterX + targetCenterX) / 2;
  const midY = (sourceCenterY + targetCenterY) / 2;

  // Position popup at edge midpoint, centered horizontally
  const drawerWidth = 280;
  const drawerCenterX = drawerWidth / 2;
  const x = midX - reactFlowRect.left - drawerCenterX;
  const y = midY - reactFlowRect.top + (20 * viewport.zoom);

  const position = { x, y, zoom: viewport.zoom };

  return (
    <>
      <Backdrop onClick={onClose} />
      <DrawerPositioner position={position}>
        <DrawerContainer>
          <Connector />
          <CloseButton onClick={onClose}>×</CloseButton>
          <PopupTitle>Select Transition</PopupTitle>

          <ConnectionInfo>
            {sourceSong.title} → {targetSong.title}
          </ConnectionInfo>

          {availableTransitions.length === 0 ? (
            <div style={{ color: '#777', fontSize: '11px', textAlign: 'center', padding: '12px 0' }}>
              No transitions available
            </div>
          ) : (
            availableTransitions.map((transition, index) => (
              <TransitionOption
                key={index}
                isSelected={selectedTransition?.Name === transition.Name}
                isHovered={hoveredOption === index}
                onMouseEnter={() => setHoveredOption(index)}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => handleSelectTransition(transition)}
              >
                <TransitionName isSelected={selectedTransition?.Name === transition.Name}>
                  <CheckMark>{selectedTransition?.Name === transition.Name ? '✓' : '○'}</CheckMark>
                  {transition.Name}
                </TransitionName>
                <TransitionDetails>
                  <div>{transition.Songs}</div>
                  {transition.endTimethisSong && (
                    <div>Cut at: {transition.endTimethisSong}</div>
                  )}
                  {transition.startTimeOtherSong && (
                    <div>Start: {transition.startTimeOtherSong}</div>
                  )}
                </TransitionDetails>
              </TransitionOption>
            ))
          )}
        </DrawerContainer>
      </DrawerPositioner>
    </>
  );
};

export default TransitionPopup;
