import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useReactFlow } from '@xyflow/react';

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
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
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, #e92a67 0%, #a853ba 50%, #2a8af6 100%) 1;
  border-radius: 12px;
  padding: 16px;
  min-width: 250px;
  max-width: 300px;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  animation: ${slideDown} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: auto;

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(135deg, #e92a67 0%, #a853ba 50%, #2a8af6 100%);
    border-radius: 12px;
    z-index: -1;
    opacity: 0.3;
  }
`;

const Connector = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 20px;
  background: linear-gradient(to bottom, rgba(42, 138, 246, 0.8), rgba(42, 138, 246, 0.3));
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #2a8af6;
    box-shadow: 0 0 10px rgba(42, 138, 246, 0.8);
  }
`;

const PopupTitle = styled.div`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
  background: linear-gradient(135deg, #e92a67 0%, #a853ba 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ConnectionOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isHovered ? 'rgba(42, 138, 246, 0.1)' : 'transparent'};
  border: ${props => props.isHovered ? '1px solid rgba(42, 138, 246, 0.3)' : '1px solid transparent'};

  &:hover {
    background: rgba(42, 138, 246, 0.1);
    border: 1px solid rgba(42, 138, 246, 0.3);
    transform: translateX(2px);
  }
`;

const SongIcon = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e92a67 0%, #a853ba 100%);
  flex-shrink: 0;
`;

const SongInfo = styled.div`
  flex: 1;
`;

const SongTitle = styled.div`
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
`;

const SongArtist = styled.div`
  color: #888;
  font-size: 11px;
  line-height: 1.2;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: #888;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
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
    
    // Calculate position below the node, centered
    const drawerWidth = 250;
    const x = nodeRect.left - reactFlowRect.left + (nodeRect.width / 2) - ((drawerWidth * viewport.zoom) / 2);
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
