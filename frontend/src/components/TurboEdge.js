import React from 'react';
import { getBezierPath } from '@xyflow/react';

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

    const [edgePath] = getBezierPath({
        // we need this little hack in order to display the gradient for a straight line
        sourceX: xEqual ? sourceX + 0.0001 : sourceX,
        sourceY: yEqual ? sourceY + 0.0001 : sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const isTransitioning = data?.isTransitioning || false;

    return (
        <>
            <path
                id={id}
                style={style}
                className={`react-flow__edge-path ${isTransitioning ? 'transition-playing' : ''}`}
                d={edgePath}
                markerEnd={markerEnd}
            />
        </>
    );
}
