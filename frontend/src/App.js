
import React, { useCallback } from 'react';
import styled from 'styled-components';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Sidebar from './components/Sidebar';
import SongNode from './components/SongNode.js';
import { songs as initialSongs } from './data/songs';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #1a1a1a;
`;

const LeftPanel = styled.div`
  width: 300px;
  background-color: #2d2d2d;
  border-right: 1px solid #404040;
  overflow-y: auto;
`;

const RightPanel = styled.div`
  flex: 1;
  position: relative;

  .react-flow__node {
    background: #2d2d2d;
    border: 2px solid #404040;
    border-radius: 8px;
    color: white;
    padding: 16px;
    width: 200px;
    cursor: pointer;

    &:hover {
      border-color: #5a5a5a;
    }

    &.selected {
      border-color: #4CAF50;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    }
  }

  .react-flow__edge {
    &.selected {
      .react-flow__edge-path {
        stroke: #4CAF50;
        stroke-width: 3;
      }
    }
  }

  .react-flow__handle {
    background: #4CAF50;
    border: 2px solid #ffffff;
    width: 12px;
    height: 12px;

    &.react-flow__handle-valid {
      background: #4CAF50;
    }
  }
`;

const nodeTypes = {
  songNode: SongNode,
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
        x: event.clientX - reactFlowBounds.left - 100, // Center the node horizontally
        y: event.clientY - reactFlowBounds.top - 40,   // Center the node vertically
      };

      const newNode = {
        id: `${song.id}-${Date.now()}`,
        type: 'songNode',
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
          fitView
          attributionPosition="bottom-left"
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.1}
          maxZoom={2}
        >
          <Controls />
          <MiniMap
            nodeColor="#2d2d2d"
            maskColor="rgba(0, 0, 0, 0.5)"
            style={{ backgroundColor: '#1a1a1a' }}
          />
          <Background
            variant={BackgroundVariant.Dots}
            gap={50}
            size={1}
            color="#333"
          />
        </ReactFlow>
      </RightPanel>
    </AppContainer>
  );
}

export default App;
