import React from 'react';
import styled from 'styled-components';
import { useDraggable } from '@dnd-kit/core';

const SongCard = styled.div`
  position: absolute;
  width: 200px;
  padding: 16px;
  background-color: #2d2d2d;
  border-radius: 8px;
  border: 2px solid ${props => props.isConnecting ? '#4CAF50' : '#404040'};
  cursor: ${props => props.isConnecting ? 'crosshair' : 'grab'};
  user-select: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;

  &:hover {
    border-color: #5a5a5a;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  }

  &:active {
    cursor: grabbing;
  }
`;

const SongTitle = styled.div`
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
`;

const SongArtist = styled.div`
  font-size: 12px;
  color: #aaaaaa;
  margin-bottom: 8px;
`;

const SongDuration = styled.div`
  font-size: 11px;
  color: #888888;
`;

const ConnectionDot = styled.div`
  position: absolute;
  top: 50%;
  right: -8px;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background-color: #4CAF50;
  border-radius: 50%;
  display: ${props => props.isConnecting ? 'block' : 'none'};
  border: 2px solid #ffffff;
`;

export const DraggableSong = ({
    song,
    onPositionChange,
    onDoubleClick,
    onCanvasClick,
    isConnecting = false
}) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: song.id,
        data: {
            type: 'canvas-song',
            song,
        },
    });

    // Handle position updates during drag
    React.useEffect(() => {
        if (transform && onPositionChange) {
            const newX = song.position?.x || 0 + transform.x;
            const newY = song.position?.y || 0 + transform.y;
            onPositionChange(song.id, { x: newX, y: newY });
        }
    }, [transform, song.position, song.id, onPositionChange]);

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (onDoubleClick) {
            onDoubleClick(song);
        }
    };

    const handleClick = (e) => {
        e.stopPropagation();
        if (onCanvasClick && isConnecting) {
            onCanvasClick(e);
        }
    };

    return (
        <SongCard
            ref={setNodeRef}
            style={{
                left: song.position?.x || 0,
                top: song.position?.y || 0,
            }}
            {...listeners}
            {...attributes}
            onDoubleClick={handleDoubleClick}
            onClick={handleClick}
            isConnecting={isConnecting}
            data-is-dragging={isDragging}
        >
            <SongTitle>{song.title}</SongTitle>
            <SongArtist>{song.artist}</SongArtist>
            <SongDuration>{song.duration}</SongDuration>
            <ConnectionDot isConnecting={isConnecting} />
        </SongCard>
    );
};
