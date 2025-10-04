
import React, { useCallback } from 'react';
import styled from 'styled-components';
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/base.css';

import Sidebar from './components/Sidebar';
import TurboNode from './components/TurboNode.js';
import TurboEdge from './components/TurboEdge.js';
import { songs as initialSongs } from './data/songs';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%);
`;

const LeftPanel = styled.div`
  width: 300px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-right: 2px solid transparent;
  overflow-y: auto;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(
      to bottom,
      #e92a67 0%,
      #a853ba 33%,
      #2a8af6 66%,
      #e92a67 100%
    );
    animation: pulse 2s ease-in-out infinite alternate;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  position: relative;
  background: radial-gradient(
    ellipse at center,
    rgba(42, 138, 246, 0.1) 0%,
    rgba(17, 17, 17, 0.8) 70%,
    #111111 100%
  );
`;

const nodeTypes = {
  turbo: TurboNode,
};

const edgeTypes = {
  turbo: TurboEdge,
};

const defaultEdgeOptions = {
  type: 'turbo',
  markerEnd: 'edge-circle',
};

const initialNodes = [];
const initialEdges = [];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const songData = event.dataTransfer.getData('application/reactflow');
      if (typeof songData === 'undefined' || !songData) {
        return;
      }

      const song = JSON.parse(songData);

      // Get the ReactFlow instance bounds to calculate relative position
      const reactFlowBounds = document.querySelector('.react-flow__viewport').getBoundingClientRect();

      const position = {
        x: event.clientX - reactFlowBounds.left - 75, // Center the turbo node
        y: event.clientY - reactFlowBounds.top - 35,  // Center the turbo node
      };

      const newNode = {
        id: `${song.id}-${Date.now()}`,
        type: 'turbo',
        position,
        data: { song },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  return (
    <AppContainer>
      <LeftPanel>
        <Sidebar songs={initialSongs} />
      </LeftPanel>
      <RightPanel>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls showInteractive={false} />
          <svg>
            <defs>
              <linearGradient id="edge-gradient">
                <stop offset="0%" stopColor="#ae53ba" />
                <stop offset="100%" stopColor="#2a8af6" />
              </linearGradient>

              <marker
                id="edge-circle"
                viewBox="-5 -5 10 10"
                refX="0"
                refY="0"
                markerUnits="strokeWidth"
                markerWidth="10"
                markerHeight="10"
                orient="auto"
              >
                <circle stroke="#2a8af6" strokeOpacity="0.75" r="2" cx="0" cy="0" />
              </marker>
            </defs>
          </svg>
        </ReactFlow>
      </RightPanel>
    </AppContainer>
  );
}

export default App;
