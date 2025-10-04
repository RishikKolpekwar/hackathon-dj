import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
  border-top: 2px solid #e92a67;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 20px;
  z-index: 1000;
  box-shadow: 0 -4px 20px rgba(233, 42, 103, 0.3);
`;

const SongInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  min-width: 250px;
`;

const AlbumCover = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #e92a67, #a853ba);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 10px rgba(233, 42, 103, 0.4);
`;

const SongDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SongTitle = styled.div`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
`;

const SongArtist = styled.div`
  color: #888888;
  font-size: 12px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
  justify-content: center;
`;

const PlayButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #e92a67, #a853ba);
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(233, 42, 103, 0.4);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(233, 42, 103, 0.6);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: scale(1);
    }
  }
`;

const TimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 200px;
`;

const TimeText = styled.span`
  color: #888888;
  font-size: 12px;
  font-family: 'Courier New', monospace;
  min-width: 45px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  position: relative;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    height: 8px;
  }
`;

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #e92a67, #a853ba, #2a8af6);
  border-radius: 3px;
  transition: width 0.1s linear;
  box-shadow: 0 0 10px rgba(233, 42, 103, 0.6);
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 150px;
`;

const VolumeSlider = styled.input`
  width: 100px;
  cursor: pointer;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #e92a67;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(233, 42, 103, 0.6);
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
`;

const NoSongText = styled.div`
  color: #888888;
  font-size: 14px;
  font-style: italic;
`;

const MusicPlayer = ({ currentSong, onSongEnd }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const audioRef = useRef(null);

    // Initialize audio element
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.volume = volume;
        }

        const audio = audioRef.current;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            if (onSongEnd) {
                onSongEnd();
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
    }, [onSongEnd, volume]);

    // Handle song changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (currentSong) {
            // Construct the path to the audio file
            const audioPath = `/songs/${currentSong.filename}`;
            audio.src = audioPath;
            audio.load();

            // Auto-play when new song is set
            audio.play().catch(err => console.error('Error playing audio:', err));
            setIsPlaying(true);
        } else {
            audio.pause();
            audio.src = '';
            setIsPlaying(false);
            setCurrentTime(0);
            setDuration(0);
        }
    }, [currentSong]);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(err => console.error('Error playing audio:', err));
        }
        setIsPlaying(!isPlaying);
    };

    const handleProgressClick = (e) => {
        const audio = audioRef.current;
        if (!audio || !duration) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const newTime = percentage * duration;

        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <PlayerContainer>
            <SongInfo>
                {currentSong ? (
                    <>
                        <AlbumCover>🎵</AlbumCover>
                        <SongDetails>
                            <SongTitle>{currentSong.title}</SongTitle>
                            <SongArtist>{currentSong.artist}</SongArtist>
                        </SongDetails>
                    </>
                ) : (
                    <NoSongText>No song selected</NoSongText>
                )}
            </SongInfo>

            <Controls>
                <PlayButton onClick={togglePlayPause} disabled={!currentSong}>
                    {isPlaying ? '⏸' : '▶'}
                </PlayButton>

                <TimeInfo>
                    <TimeText>{formatTime(currentTime)}</TimeText>
                    <ProgressBar onClick={handleProgressClick}>
                        <Progress style={{ width: `${progressPercentage}%` }} />
                    </ProgressBar>
                    <TimeText>{formatTime(duration)}</TimeText>
                </TimeInfo>
            </Controls>

            <VolumeControl>
                <span style={{ color: '#888', fontSize: '18px' }}>
                    {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                </span>
                <VolumeSlider
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                />
            </VolumeControl>
        </PlayerContainer>
    );
};

export default MusicPlayer;
