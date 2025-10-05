import React from 'react';
import { getBezierPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';

export default function TurboEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
}) {
    const xEqual = sourceX === targetX;
    const yEqual = sourceY === targetY;

    const [edgePath, labelX, labelY] = getBezierPath({
        // we need this little hack in order to display the gradient for a straight line
        sourceX: xEqual ? sourceX + 0.0001 : sourceX,
        sourceY: yEqual ? sourceY + 0.0001 : sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const isTransitioning = data?.isTransitioning || false;
    const hasTransitionSelected = data?.selectedTransition;
    const onEdgeClick = data?.onEdgeClick;

    const handleClick = (event) => {
        event.stopPropagation();
        if (onEdgeClick) {
            onEdgeClick(id);
        }
    };

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    stroke: 'url(#edge-gradient)',
                    strokeWidth: 2,
                    cursor: 'pointer',
                }}
                className={`react-flow__edge-path ${isTransitioning ? 'transition-playing' : ''}`}
            />
            {/* Invisible wider path for easier clicking */}
            <path
                d={edgePath}
                fill="none"
                stroke="transparent"
                strokeWidth={20}
                onClick={handleClick}
                style={{ cursor: 'pointer' }}
            />
            <EdgeLabelRenderer>
                {hasTransitionSelected && (
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            background: data.selectedTransition.Name === 'Default Transition'
                                ? 'rgba(168, 83, 186, 0.8)'
                                : 'rgba(233, 42, 103, 0.9)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '600',
                            pointerEvents: 'all',
                            cursor: 'pointer',
                            boxShadow: data.selectedTransition.Name === 'Default Transition'
                                ? '0 2px 8px rgba(168, 83, 186, 0.4)'
                                : '0 2px 8px rgba(233, 42, 103, 0.4)',
                            whiteSpace: 'nowrap',
                        }}
                        onClick={handleClick}
                    >
                        {data.selectedTransition.Name === 'Default Transition'
                            ? '🎵 Default'
                            : `⚡ ${data.selectedTransition.Name}`}
                    </div>
                )}
            </EdgeLabelRenderer>
        </>
    );
}
