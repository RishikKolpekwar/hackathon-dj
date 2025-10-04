import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
  border-top: 2px solid #e92a67;
  z-index: 1000;
  box-shadow: 0 -4px 20px rgba(233, 42, 103, 0.3);
  display: flex;
  flex-direction: column;
`;

const ControlsBar = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  gap: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const PlayButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #e92a67, #a853ba);
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(233, 42, 103, 0.4);
  flex-shrink: 0;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(233, 42, 103, 0.6);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    &:hover {
      transform: scale(1);
    }
  }
`;

const TimelineContainer = styled.div`
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(168, 83, 186, 0.5);
    border-radius: 3px;
    
    &:hover {
      background: rgba(168, 83, 186, 0.7);
    }
  }
`;

const Timeline = styled.div`
  display: flex;
  height: 100%;
  min-width: 100%;
  position: relative;
  cursor: pointer;
`;

const SongClip = styled.div`
  position: relative;
  height: 100%;
  background: ${props => props.isPlaying
        ? 'linear-gradient(135deg, rgba(233, 42, 103, 0.3), rgba(168, 83, 186, 0.3))'
        : 'rgba(255, 255, 255, 0.05)'};
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  border-left: ${props => props.isPlaying ? '2px solid #e92a67' : 'none'};
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 250px;
  
  &:hover {
    background: ${props => props.isPlaying
        ? 'linear-gradient(135deg, rgba(233, 42, 103, 0.4), rgba(168, 83, 186, 0.4))'
        : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const AlbumCover = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 6px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
`;

const SongInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SongTitle = styled.div`
  color: ${props => props.isPlaying ? '#ffffff' : '#cccccc'};
  font-size: 13px;
  font-weight: ${props => props.isPlaying ? '600' : '500'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SongArtist = styled.div`
  color: #888888;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SongDuration = styled.div`
  color: #666666;
  font-size: 10px;
  font-family: 'Courier New', monospace;
  flex-shrink: 0;
`;

const Playhead = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e92a67;
  box-shadow: 0 0 10px rgba(233, 42, 103, 0.8);
  z-index: 10;
  pointer-events: none;
  left: ${props => props.position}px;
  
  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    width: 10px;
    height: 10px;
    background: #e92a67;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(233, 42, 103, 1);
  }
`;

const NoSongsText = styled.div`
  color: #666666;
  font-size: 13px;
  font-style: italic;
  padding: 15px 20px;
  text-align: center;
`;

const CurrentTimeDisplay = styled.div`
  color: #888888;
  font-size: 12px;
  font-family: 'Courier New', monospace;
  min-width: 80px;
  text-align: center;
`;

const TransitionBox = styled.div`
  position: relative;
  height: 100%;
  width: 60px;
  min-width: 60px;
  background: rgba(0, 0, 0, 0.5);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: not-allowed;
  
  &::before {
    content: '✕';
    color: #e92a67;
    font-size: 24px;
    font-weight: bold;
    opacity: 0.5;
  }
  
  &.playing {
    background: rgba(233, 42, 103, 0.2);
    animation: transitionPulse 1.5s ease-in-out infinite;
    
    &::before {
      opacity: 1;
      animation: transitionSpin 2s linear infinite;
    }
  }
`;

const transitionStyles = `
@keyframes transitionPulse {
  0%, 100% {
    background: rgba(233, 42, 103, 0.2);
  }
  50% {
    background: rgba(233, 42, 103, 0.4);
  }
}

@keyframes transitionSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`;

const MusicPlayer = ({ songQueue, currentSong, setCurrentSong, nodes, edges, setTransitioningEdgeId }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const audioRef = useRef(null);
    const timelineRef = useRef(null);
    const clipRefs = useRef([]);

    // Initialize audio element
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.volume = 1.0; // Max volume
        }

        const audio = audioRef.current;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleEnded = () => {
            // Auto-advance to next song
            const nextIndex = currentSongIndex + 1;
            if (nextIndex < songQueue.length) {
                setCurrentSongIndex(nextIndex);
                setCurrentSong(songQueue[nextIndex]);
            } else {
                setIsPlaying(false);
                setCurrentTime(0);
                setCurrentSongIndex(0);
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentSongIndex, songQueue, setCurrentSong]);

    // Handle song changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (currentSong) {
            const audioPath = `/songs/${currentSong.filename}`;
            audio.src = audioPath;
            audio.load();

            // Auto-play when new song is set
            audio.play().catch(err => console.error('Error playing audio:', err));
            setIsPlaying(true);

            // Find index in queue
            const index = songQueue.findIndex(s => s.id === currentSong.id);
            if (index !== -1) {
                setCurrentSongIndex(index);
            }
        } else {
            audio.pause();
            audio.src = '';
            setIsPlaying(false);
            setCurrentTime(0);
            setDuration(0);
        }
    }, [currentSong, songQueue]);

    const togglePlayPause = () => {
        const audio = audioRef.current;

        if (songQueue.length === 0) return;

        if (!currentSong && songQueue.length > 0) {
            // Start playing first song in queue
            setCurrentSong(songQueue[0]);
            setCurrentSongIndex(0);
            return;
        }

        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(err => console.error('Error playing audio:', err));
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Calculate playhead position
    const calculatePlayheadPosition = () => {
        if (!currentSong || !timelineRef.current || !clipRefs.current[currentSongIndex]) return 0;
        
        const transitionBoxWidth = 60;
        
        // Calculate cumulative width of all clips and transitions before current one
        let cumulativeWidth = 0;
        for (let i = 0; i < currentSongIndex; i++) {
            if (clipRefs.current[i]) {
                cumulativeWidth += clipRefs.current[i].offsetWidth;
            }
            // Add transition box width (between songs)
            cumulativeWidth += transitionBoxWidth;
        }
        
        // Add progress within current clip
        const currentClipWidth = clipRefs.current[currentSongIndex]?.offsetWidth || 250;
        const progressInCurrentClip = duration > 0 ? (currentTime / duration) * currentClipWidth : 0;
        
        return cumulativeWidth + progressInCurrentClip;
    };

    const handleTimelineClick = (e) => {
        if (!timelineRef.current || songQueue.length === 0) return;
        
        const audio = audioRef.current;
        if (!audio) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left + timelineRef.current.scrollLeft;
        
        const transitionBoxWidth = 60;
        
        // Find which song was clicked
        let cumulativeWidth = 0;
        for (let i = 0; i < songQueue.length; i++) {
            const clipWidth = clipRefs.current[i]?.offsetWidth || 250;
            
            if (clickX >= cumulativeWidth && clickX < cumulativeWidth + clipWidth) {
                // Clicked within this song
                const clickPositionInClip = clickX - cumulativeWidth;
                const percentage = clickPositionInClip / clipWidth;
                
                // If clicking a different song, switch to it
                if (i !== currentSongIndex) {
                    setCurrentSong(songQueue[i]);
                    setCurrentSongIndex(i);
                    // The time will be set when the song loads via useEffect
                } else if (duration > 0) {
                    // Same song - just seek
                    const newTime = percentage * duration;
                    audio.currentTime = newTime;
                    setCurrentTime(newTime);
                }
                
                return;
            }
            
            cumulativeWidth += clipWidth;
            
            // Skip transition box area (can't click on it)
            if (i < songQueue.length - 1) {
                cumulativeWidth += transitionBoxWidth;
            }
        }
    };

    return (
        <>
            <style>{transitionStyles}</style>
            <PlayerContainer>
                <ControlsBar>
                    <PlayButton onClick={togglePlayPause} disabled={songQueue.length === 0}>
                        {isPlaying ? '⏸' : '▶'}
                    </PlayButton>
                    <CurrentTimeDisplay>
                        {currentSong ? `${formatTime(currentTime)} / ${formatTime(duration)}` : '--:-- / --:--'}
                    </CurrentTimeDisplay>
                    {currentSong && (
                        <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600' }}>
                            {currentSong.title} - {currentSong.artist}
                        </div>
                    )}
                </ControlsBar>

                <TimelineContainer ref={timelineRef}>
                    {songQueue.length === 0 ? (
                        <NoSongsText>Add songs to the canvas to build your queue</NoSongsText>
                    ) : (
                        <Timeline onClick={handleTimelineClick}>
                            {songQueue.map((song, index) => (
                                <React.Fragment key={`segment-${song.id}-${index}`}>
                                    <SongClip
                                        ref={(el) => (clipRefs.current[index] = el)}
                                        isPlaying={currentSong?.id === song.id}
                                    >
                                        <AlbumCover
                                            src={song.albumCover || '/Ken_Carson_Project_X_cover.jpeg'}
                                            alt={song.title}
                                        />
                                        <SongInfo>
                                            <SongTitle isPlaying={currentSong?.id === song.id}>
                                                {song.title}
                                            </SongTitle>
                                            <SongArtist>{song.artist}</SongArtist>
                                        </SongInfo>
                                        <SongDuration>{song.duration}</SongDuration>
                                    </SongClip>
                                    {index < songQueue.length - 1 && (
                                        <TransitionBox
                                            className=""
                                            title="Transition (feature coming soon)"
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                            {currentSong && <Playhead position={calculatePlayheadPosition()} />}
                        </Timeline>
                    )}
                </TimelineContainer>
            </PlayerContainer>
        </>
    );
};

export default MusicPlayer;
