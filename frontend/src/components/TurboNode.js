import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export default memo(({ id, data, selected, onDelete }) => {
    const handleDeleteClick = (e) => {
        e.stopPropagation(); // Prevent node click event
        if (onDelete) {
            onDelete(id);
        }
    };

    return (
        <>
            <div className={`wrapper gradient ${selected ? 'selected' : ''}`}>
                <div className="inner">
                    <div className="body">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img 
                                src={data.song.albumCover || '/Ken_Carson_Project_X_cover.jpeg'} 
                                alt={data.song.title}
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '8px',
                                    objectFit: 'cover',
                                    flexShrink: 0,
                                    border: '2px solid rgba(168, 83, 186, 0.3)',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                                }}
                            />
                            <div style={{ minWidth: 0 }}>
                                <div className="title">{data.song.title}</div>
                                <div className="subtitle">{data.song.artist}</div>
                            </div>
                        </div>
                    </div>

                    {/* Delete button */}
                    <button
                        onClick={handleDeleteClick}
                        style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            background: 'rgba(0, 0, 0, 0.6)',
                            border: 'none',
                            color: '#999',
                            fontSize: '14px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                            zIndex: 10
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(220, 38, 38, 0.8)';
                            e.target.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(0, 0, 0, 0.6)';
                            e.target.style.color = '#999';
                        }}
                    >
                        ×
                    </button>

                    {/* Input handle positioned at center-left */}
                    <Handle
                        type="target"
                        position={Position.Left}
                        id="input"
                        style={{
                            top: '50%',
                            transform: 'translateY(-50%)',
                            left: '-8px'
                        }}
                    />

                    {/* Output handle positioned at center-right */}
                    <Handle
                        type="source"
                        position={Position.Right}
                        id="output"
                        style={{
                            top: '50%',
                            transform: 'translateY(-50%)',
                            right: '-8px'
                        }}
                    />
                </div>
            </div>
        </>
    );
});
