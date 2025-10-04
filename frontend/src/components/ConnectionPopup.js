import React, { useState } from 'react';
import styled from 'styled-components';

const PopupContainer = styled.div`
  position: absolute;
  top: ${props => props.position.y}px;
  left: ${props => props.position.x}px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, #e92a67 0%, #a853ba 50%, #2a8af6 100%) 1;
  border-radius: 12px;
  padding: 16px;
  min-width: 250px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);

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
    position,
    currentNode,
    allNodes,
    onClose,
    onConnectionPreview,
    onConnectionCreate,
    previewTarget
}) => {
    const [hoveredOption, setHoveredOption] = useState(null);

    const otherNodes = allNodes.filter(node => node.id !== currentNode.id);

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
        <PopupContainer position={position}>
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
        </PopupContainer>
    );
};

export default ConnectionPopup;
