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
  min-width: 250px;
  max-width: 300px;
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
  background: linear-gradient(to bottom, rgba(102, 102, 102, 0.8), rgba(102, 102, 102, 0.3));
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #666;
    box-shadow: 0 0 8px rgba(102, 102, 102, 0.6);
  }
`;

const PopupTitle = styled.div`
  color: #888;
  font-size: 11px;
  font-weight: 500;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ConnectionOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  margin-bottom: 2px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  background: ${props => props.isHovered ? '#252525' : 'transparent'};
  border: 1px solid ${props => props.isHovered ? '#444' : 'transparent'};

  &:hover {
    background: #252525;
    border: 1px solid #444;
  }
`;

const SongIcon = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #666;
  flex-shrink: 0;
`;

const SongInfo = styled.div`
  flex: 1;
`;

const SongTitle = styled.div`
  color: #ddd;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
`;

const SongArtist = styled.div`
  color: #777;
  font-size: 10px;
  line-height: 1.3;
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

const ConnectionPopup = ({
    currentNodeId,
    allNodes,
    onClose,
    onConnectionPreview,
    onConnectionCreate,
    previewTarget
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

    const currentNode = getNode(currentNodeId);
    const otherNodes = allNodes.filter(node => node.id !== currentNodeId);

    if (!currentNode) return null;

    // Calculate position dynamically based on node position and viewport
    const viewport = getViewport();
    const nodeElement = document.querySelector(`[data-id="${currentNodeId}"]`);
    
    if (!nodeElement) return null;

    const nodeRect = nodeElement.getBoundingClientRect();
    const reactFlowElement = document.querySelector('.react-flow');
    
    if (!reactFlowElement) return null;

    const reactFlowRect = reactFlowElement.getBoundingClientRect();
    
    // Calculate position below the node, perfectly centered horizontally
    const drawerWidth = 250;
    const nodeCenterX = nodeRect.left + (nodeRect.width / 2);
    const drawerCenterX = (drawerWidth * viewport.zoom) / 2;
    const x = nodeCenterX - reactFlowRect.left - drawerCenterX;
    const y = nodeRect.bottom - reactFlowRect.top + (20 * viewport.zoom);

    const position = { x, y, zoom: viewport.zoom };

    const handleMouseEnter = (targetNode) => {
        setHoveredOption(targetNode.id);
        onConnectionPreview(currentNode, targetNode);
    };

    const handleMouseLeave = () => {
        setHoveredOption(null);
        onConnectionPreview(null, null);
    };

    const handleConnectionClick = (targetNode) => {
        onConnectionCreate(currentNode, targetNode);
        onClose();
    };

    return (
        <DrawerPositioner position={position}>
            <DrawerContainer>
                <Connector />
                <CloseButton onClick={onClose}>×</CloseButton>
                <PopupTitle>Connect to other songs</PopupTitle>
                {otherNodes.map(node => (
                    <ConnectionOption
                        key={node.id}
                        isHovered={hoveredOption === node.id}
                        onMouseEnter={() => handleMouseEnter(node)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleConnectionClick(node)}
                    >
                        <SongIcon />
                        <SongInfo>
                            <SongTitle>{node.data.song.title}</SongTitle>
                            <SongArtist>{node.data.song.artist}</SongArtist>
                        </SongInfo>
                    </ConnectionOption>
                ))}
            </DrawerContainer>
        </DrawerPositioner>
    );
};

export default ConnectionPopup;
