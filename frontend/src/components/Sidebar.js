import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-right: 2px solid transparent;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: conic-gradient(
      from 45deg at 50% 50%,
      #e92a67 0deg,
      #a853ba 90deg,
      #2a8af6 180deg,
      #e92a67 270deg,
      transparent 360deg
    );
    border-radius: 0;
    padding: 2px;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: xor;
    -webkit-mask-composite: xor;
    z-index: -1;
  }
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(174, 83, 186, 0.5);
  background: linear-gradient(135deg, #ffffff 0%, #ae53ba 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SongList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SongItem = styled.div`
  padding: 16px 20px;
  background: linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%);
  border-radius: 10px;
  cursor: grab;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: conic-gradient(
      from 0deg at 50% 50%,
      #e92a67 0deg,
      #a853ba 120deg,
      #2a8af6 240deg,
      #e92a67 360deg
    );
    border-radius: 10px;
    padding: 2px;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: xor;
    -webkit-mask-composite: xor;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover {
    background: linear-gradient(135deg, #3a3a3a 0%, #4a4a4a 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(174, 83, 186, 0.3);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    cursor: grabbing;
    transform: translateY(0px);
  }
`;

const SongTitle = styled.div`
  font-weight: 600;
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 4px;
`;

const SongArtist = styled.div`
  font-size: 12px;
  color: #aaaaaa;
  margin-top: 2px;
`;

const DraggableSong = ({ song, onDragStart }) => {
  const handleDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(song));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <SongItem
      draggable
      onDragStart={handleDragStart}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e92a67 0%, #a853ba 100%)',
          flexShrink: 0
        }} />
        <div>
          <SongTitle>{song.title}</SongTitle>
          <SongArtist>{song.artist}</SongArtist>
        </div>
      </div>
    </SongItem>
  );
};

const Sidebar = ({ songs }) => {
  return (
    <SidebarContainer>
      <Title>Songs</Title>
      <SongList>
        {songs.map((song) => (
          <DraggableSong key={song.id} song={song} />
        ))}
      </SongList>
    </SidebarContainer>
  );
};

export default Sidebar;
