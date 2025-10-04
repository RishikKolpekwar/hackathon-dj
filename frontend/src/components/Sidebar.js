import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  color: #ffffff;
  font-size: 18px;
`;

const SongList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SongItem = styled.div`
  padding: 12px 16px;
  background-color: #3a3a3a;
  border-radius: 6px;
  cursor: grab;
  border: 1px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    background-color: #4a4a4a;
    border-color: #5a5a5a;
  }

  &:active {
    cursor: grabbing;
  }
`;

const SongTitle = styled.div`
  font-weight: 600;
  color: #ffffff;
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
      <SongTitle>{song.title}</SongTitle>
      <SongArtist>{song.artist}</SongArtist>
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
