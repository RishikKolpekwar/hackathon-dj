import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export default memo(({ data, selected }) => {
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

                    {/* Input handle positioned at center-top */}
                    <Handle
                        type="target"
                        position={Position.Top}
                        id="input"
                        style={{
                            left: '50%',
                            transform: 'translateX(-50%)',
                            top: '-8px'
                        }}
                    />

                    {/* Output handle positioned at center-bottom */}
                    <Handle
                        type="source"
                        position={Position.Bottom}
                        id="output"
                        style={{
                            left: '50%',
                            transform: 'translateX(-50%)',
                            bottom: '-8px'
                        }}
                    />
                </div>
            </div>
        </>
    );
});
