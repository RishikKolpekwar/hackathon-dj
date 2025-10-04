import React from 'react';
import { Handle, Position } from '@xyflow/react';

const SongNode = ({ data }) => {
    const { song } = data;

    return (
        <div style={{
            padding: '16px',
            backgroundColor: '#2d2d2d',
            border: '2px solid #404040',
            borderRadius: '8px',
            color: 'white',
            width: '200px',
            cursor: 'pointer',
        }}>
            <Handle
                type="target"
                position={Position.Top}
                style={{
                    background: '#4CAF50',
                    border: '2px solid #ffffff',
                    width: '12px',
                    height: '12px',
                }}
            />

            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                {song.title}
            </div>
            <div style={{ fontSize: '12px', color: '#aaaaaa', marginBottom: '8px' }}>
                {song.artist}
            </div>
            <div style={{ fontSize: '11px', color: '#888888' }}>
                {song.duration}
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                style={{
                    background: '#4CAF50',
                    border: '2px solid #ffffff',
                    width: '12px',
                    height: '12px',
                }}
            />
        </div>
    );
};

export default SongNode;
