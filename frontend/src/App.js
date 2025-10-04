
import React, { useState } from 'react';
import styled from 'styled-components';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import { songs as initialSongs } from './data/songs';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #1a1a1a;
  color: white;
`;

const LeftPanel = styled.div`
  width: 300px;
  background-color: #2d2d2d;
  border-right: 1px solid #404040;
  overflow-y: auto;
`;

const RightPanel = styled.div`
  flex: 1;
  position: relative;
`;

// Helper function to find a non-colliding position for new songs
const getNonCollidingPosition = (desiredPosition, existingSongs, width, height) => {
  const { x, y } = desiredPosition;

  // Check if the desired position collides with any existing song
  const hasCollision = existingSongs.some(song => {
    const songRight = (song.position?.x || 0) + width;
    const songBottom = (song.position?.y || 0) + height;
    const desiredRight = x + width;
    const desiredBottom = y + height;

    return !(desiredRight <= (song.position?.x || 0) ||
      desiredPosition.x >= songRight ||
      desiredBottom <= (song.position?.y || 0) ||
      desiredPosition.y >= songBottom);
  });

  if (!hasCollision) {
    return desiredPosition;
  }

  // If there's a collision, try to find a nearby position
  const offset = 30; // pixels to offset when collision detected
  const attempts = [
    { x: x + offset, y: y + offset },
    { x: x - offset, y: y - offset },
    { x: x + offset, y: y - offset },
    { x: x - offset, y: y + offset },
    { x: x + offset * 2, y: y },
    { x: x - offset * 2, y: y },
    { x: x, y: y + offset * 2 },
    { x: x, y: y - offset * 2 },
  ];

  for (const attempt of attempts) {
    const attemptHasCollision = existingSongs.some(song => {
      const songRight = (song.position?.x || 0) + width;
      const songBottom = (song.position?.y || 0) + height;
      const attemptRight = attempt.x + width;
      const attemptBottom = attempt.y + height;

      return !(attemptRight <= (song.position?.x || 0) ||
        attempt.x >= songRight ||
        attemptBottom <= (song.position?.y || 0) ||
        attempt.y >= songBottom);
    });

    if (!attemptHasCollision) {
      return attempt;
    }
  }

  // If all attempts fail, return the original position
  return desiredPosition;
};

function App() {
  const [canvasSongs, setCanvasSongs] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over, delta } = event;
    setActiveId(null);

    if (over && over.id === 'canvas-drop-zone') {
      const draggedSong = initialSongs.find(song => song.id === active.id) ||
        canvasSongs.find(song => song.id === active.id);

      if (draggedSong) {
        // If it's from the sidebar, create a new instance at drop position
        if (initialSongs.find(song => song.id === active.id)) {
          // Calculate position relative to canvas
          const canvasRect = document.querySelector('[data-canvas]').getBoundingClientRect();
          const dropX = event.activatorEvent.clientX - canvasRect.left - 100; // Center the song horizontally
          const dropY = event.activatorEvent.clientY - canvasRect.top - 40; // Center the song vertically

          // Check for collisions with existing songs and adjust position if needed
          const adjustedPosition = getNonCollidingPosition(
            { x: Math.max(0, dropX), y: Math.max(0, dropY) },
            canvasSongs,
            220, // song width + some padding
            80   // song height + some padding
          );

          const newSong = {
            ...draggedSong,
            id: `${draggedSong.id}-${Date.now()}`,
            position: adjustedPosition,
          };
          setCanvasSongs(prev => [...prev, newSong]);
        } else {
          // If it's already on canvas, update its position
          setCanvasSongs(prev => prev.map(song =>
            song.id === active.id
              ? { ...song, position: { x: song.position.x + delta.x, y: song.position.y + delta.y } }
              : song
          ));
        }
      }
    }
  };

  const handleCanvasSongUpdate = (updatedSongs) => {
    setCanvasSongs(updatedSongs);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <AppContainer>
        <LeftPanel>
          <Sidebar songs={initialSongs} />
        </LeftPanel>
        <RightPanel>
          <Canvas songs={canvasSongs} onSongsUpdate={handleCanvasSongUpdate} />
        </RightPanel>
      </AppContainer>
      <DragOverlay>
        {activeId ? (
          <div style={{ opacity: 0.5 }}>
            {initialSongs.find(song => song.id === activeId) && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#3a3a3a',
                borderRadius: '6px',
                color: 'white',
                width: '200px',
              }}>
                {initialSongs.find(song => song.id === activeId).title}
              </div>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
