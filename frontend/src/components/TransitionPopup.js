import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

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

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${slideUp} 0.2s ease-out;
`;

const PopupContainer = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 2px solid #e92a67;
  border-radius: 12px;
  padding: 24px;
  min-width: 350px;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(233, 42, 103, 0.5);
  animation: ${slideUp} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const PopupTitle = styled.div`
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ConnectionInfo = styled.div`
  color: #888;
  font-size: 12px;
  margin-bottom: 20px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border-left: 3px solid #a853ba;
`;

const TransitionOption = styled.div`
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isSelected ? 'rgba(233, 42, 103, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 2px solid ${props => props.isSelected ? '#e92a67' : 'transparent'};

  &:hover {
    background: ${props => props.isSelected ? 'rgba(233, 42, 103, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
    border-color: ${props => props.isSelected ? '#e92a67' : '#444'};
  }
`;

const TransitionName = styled.div`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TransitionDetails = styled.div`
  color: #aaa;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CheckMark = styled.span`
  color: #e92a67;
  font-size: 16px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #aaa;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TransitionPopup = ({
    edge,
    sourceSong,
    targetSong,
    selectedTransition,
    onSelectTransition,
    onClose
}) => {
    const [hoveredOption, setHoveredOption] = useState(null);

    // Find available transitions from source song to target song
    const availableTransitions = React.useMemo(() => {
        if (!sourceSong || !sourceSong.transitions) return [];

        return sourceSong.transitions.filter(t =>
            t.TransitionTo === targetSong.id || t.TransitionTo === 'ANY'
        );
    }, [sourceSong, targetSong]);

    const handleSelectTransition = (transition) => {
        onSelectTransition(edge.id, transition);
        onClose();
    };

    return (
        <PopupOverlay onClick={onClose}>
            <PopupContainer onClick={(e) => e.stopPropagation()}>
                <PopupHeader>
                    <PopupTitle>
                        ⚡ Select Transition
                    </PopupTitle>
                    <CloseButton onClick={onClose}>×</CloseButton>
                </PopupHeader>

                <ConnectionInfo>
                    <strong>{sourceSong.title}</strong> → <strong>{targetSong.title}</strong>
                </ConnectionInfo>

                {availableTransitions.length === 0 ? (
                    <div style={{ color: '#888', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                        No transitions available for this connection
                    </div>
                ) : (
                    availableTransitions.map((transition, index) => (
                        <TransitionOption
                            key={index}
                            isSelected={selectedTransition?.Name === transition.Name}
                            onMouseEnter={() => setHoveredOption(index)}
                            onMouseLeave={() => setHoveredOption(null)}
                            onClick={() => handleSelectTransition(transition)}
                        >
                            <TransitionName>
                                {selectedTransition?.Name === transition.Name && <CheckMark>✓</CheckMark>}
                                {transition.Name}
                            </TransitionName>
                            <TransitionDetails>
                                <div>🎵 {transition.Songs}</div>
                                {transition.endTimethisSong && (
                                    <div>⏱ Transition at: {transition.endTimethisSong}</div>
                                )}
                                {transition.startTime && (
                                    <div>⏱ Start at: {transition.startTime}</div>
                                )}
                            </TransitionDetails>
                        </TransitionOption>
                    ))
                )}
            </PopupContainer>
        </PopupOverlay>
    );
};

export default TransitionPopup;
