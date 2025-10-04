import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export default memo(({ data, selected }) => {
    return (
        <>
            <div className={`cloud gradient ${selected ? 'selected' : ''}`}>
                <div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
            <div className={`wrapper gradient ${selected ? 'selected' : ''}`}>
                <div className="inner">
                    <div className="body">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #e92a67 0%, #a853ba 100%)',
                                flexShrink: 0
                            }} />
                            <div>
                                <div className="title">{data.song.title}</div>
                                <div className="subtitle">{data.song.artist}</div>
                            </div>
                        </div>
                    </div>
                    <Handle type="target" position={Position.Top} id="input" />
                    <Handle type="source" position={Position.Bottom} id="output" />
                </div>
            </div>
        </>
    );
});
