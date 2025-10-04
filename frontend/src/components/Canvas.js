import React, { useState } from 'react';
import styled from 'styled-components';
import { useDroppable } from '@dnd-kit/core';
import { DraggableSong } from './DraggableSong';

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #1a1a1a;
  background-image:
    radial-gradient(circle at 25% 25%, #333 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, #333 2px, transparent 2px);
  background-size: 50px 50px;
`;

const CanvasTitle = styled.h2`
  position: absolute;
  top: 20px;
  left: 20px;
  margin: 0;
  color: #ffffff;
  font-size: 18px;
  z-index: 10;
`;

const StatusText = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  color: ${props => props.isConnecting ? '#4CAF50' : '#aaaaaa'};
  font-size: 14px;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 8px 12px;
  border-radius: 4px;
`;

const DropZone = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const ConnectionLine = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const CanvasSong = ({ song, onPositionChange, onDoubleClick, isConnecting, onCanvasClick }) => {
    return (
        <DraggableSong
            song={song}
            onPositionChange={onPositionChange}
            onDoubleClick={onDoubleClick}
            onCanvasClick={onCanvasClick}
            isConnecting={isConnecting}
        />
    );
};

const Canvas = ({ songs, onSongsUpdate }) => {
    const { setNodeRef } = useDroppable({
        id: 'canvas-drop-zone',
    });

    const [connections, setConnections] = useState([]);
    const [connectingSong, setConnectingSong] = useState(null);

    const handleSongPositionChange = (songId, position) => {
        // Position changes are handled by the drag system
        // We don't need to do anything here as the position is already updated
    };

    const handleSongDoubleClick = (song) => {
        if (connectingSong && connectingSong.id !== song.id) {
            // Create connection between songs
            setConnections(prev => [...prev, {
                from: connectingSong.id,
                to: song.id,
                id: `${connectingSong.id}-${song.id}-${Date.now()}`
            }]);
            setConnectingSong(null);
        } else if (connectingSong && connectingSong.id === song.id) {
            // Cancel connection mode if clicking the same song
            setConnectingSong(null);
        } else {
            // Start connection mode
            setConnectingSong(song);
        }
    };

    const handleCanvasClick = (e) => {
        // Cancel connection mode when clicking on empty canvas
        if (connectingSong) {
            setConnectingSong(null);
        }
    };

    const handleConnectionContextMenu = (e, connectionId) => {
        e.preventDefault();
        e.stopPropagation();
        // Remove connection on right-click
        setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    };

    return (
        <CanvasContainer data-canvas>
            <CanvasTitle>Canvas</CanvasTitle>
            <StatusText isConnecting={!!connectingSong}>
                {connectingSong ? `Connecting from: ${connectingSong.title}` : 'Double-click songs to connect them'}
            </StatusText>
            <DropZone ref={setNodeRef} onClick={handleCanvasClick}>
                {songs.map((song) => (
                    <CanvasSong
                        key={song.id}
                        song={song}
                        onPositionChange={handleSongPositionChange}
                        onDoubleClick={handleSongDoubleClick}
                        onCanvasClick={handleCanvasClick}
                        isConnecting={connectingSong?.id === song.id}
                    />
                ))}

                <ConnectionLine>
                    {connections.map((connection) => {
                        const fromSong = songs.find(s => s.id === connection.from);
                        const toSong = songs.find(s => s.id === connection.to);

                        if (!fromSong || !toSong) return null;

                        const fromX = fromSong.position.x + 100; // Approximate center of song card
                        const fromY = fromSong.position.y + 40;
                        const toX = toSong.position.x + 100;
                        const toY = toSong.position.y + 40;

                        return (
                            <line
                                key={connection.id}
                                x1={fromX}
                                y1={fromY}
                                x2={toX}
                                y2={toY}
                                stroke="#4CAF50"
                                strokeWidth="3"
                                strokeDasharray="8,4"
                                markerEnd="url(#arrowhead)"
                                style={{ cursor: 'pointer' }}
                                onContextMenu={(e) => handleConnectionContextMenu(e, connection.id)}
                                title="Right-click to remove connection"
                            />
                        );
                    })}
                </ConnectionLine>

                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill="#4CAF50"
                        />
                    </marker>
                </defs>
            </DropZone>
        </CanvasContainer>
    );
};

export default Canvas;
