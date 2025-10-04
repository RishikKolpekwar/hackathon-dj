
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/base.css';

import Sidebar from './components/Sidebar';
import TurboNode from './components/TurboNode.js';
import TurboEdge from './components/TurboEdge.js';
import ConnectionPopup from './components/ConnectionPopup.js';
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

const edgeTypes = {
  turbo: TurboEdge,
};

const defaultEdgeOptions = {
  type: 'turbo',
  markerEnd: 'edge-circle',
};

const initialNodes = [];
const initialEdges = [];

// Inner component that uses React Flow hooks
function FlowContent({ nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, popupState, setPopupState, previewEdge, setPreviewEdge }) {
  const { screenToFlowPosition } = useReactFlow();

  const nodeTypes = {
    turbo: TurboNode,
  };

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

      // Convert screen coordinates to flow coordinates
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${song.id}-${Date.now()}`,
        type: 'turbo',
        position,
        data: { song },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes, screenToFlowPosition]
  );

  const handleNodeClick = useCallback((event, node) => {
    // Get the node element to calculate screen position
    const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
    if (!nodeElement) return;

    const nodeRect = nodeElement.getBoundingClientRect();
    const reactFlowElement = document.querySelector('.react-flow');
    if (!reactFlowElement) return;

    const reactFlowRect = reactFlowElement.getBoundingClientRect();

    // Position popup to the right of the node, accounting for React Flow container offset
    const popupPosition = {
      x: nodeRect.right - reactFlowRect.left + 20,
      y: nodeRect.top - reactFlowRect.top
    };

    setPopupState({
      show: true,
      position: popupPosition,
      currentNode: node
    });
  }, [setPopupState]);

  const handleClosePopup = useCallback(() => {
    setPopupState({
      show: false,
      position: { x: 0, y: 0 },
      currentNode: null
    });
    setPreviewEdge(null);
  }, [setPopupState, setPreviewEdge]);

  const handleConnectionPreview = useCallback((sourceNode, targetNode) => {
    if (!sourceNode || !targetNode) {
      setPreviewEdge(null);
      return;
    }

    const newPreviewEdge = {
      id: `preview-${sourceNode.id}-${targetNode.id}`,
      source: sourceNode.id,
      target: targetNode.id,
      type: 'turbo',
      animated: true,
      style: {
        stroke: '#2a8af6',
        strokeWidth: 3,
        strokeDasharray: '5,5',
        opacity: 0.7
      }
    };

    setPreviewEdge(newPreviewEdge);
  }, [setPreviewEdge]);

  const handleConnectionCreate = useCallback((sourceNode, targetNode) => {
    const newEdge = {
      id: `edge-${sourceNode.id}-${targetNode.id}-${Date.now()}`,
      source: sourceNode.id,
      target: targetNode.id,
      type: 'turbo'
    };

    setEdges((eds) => [...eds, newEdge]);
    setPreviewEdge(null);
  }, [setEdges, setPreviewEdge]);

  const handlePaneClick = useCallback((event) => {
    // Close popup when clicking on the pane (background)
    if (popupState.show) {
      handleClosePopup();
    }
  }, [popupState.show, handleClosePopup]);

  // Combine regular edges with preview edge
  const allEdges = [...edges];
  if (previewEdge) {
    allEdges.push(previewEdge);
  }

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={allEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
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

      {popupState.show && popupState.currentNode && (
        <ConnectionPopup
          position={popupState.position}
          currentNode={popupState.currentNode}
          allNodes={nodes}
          onClose={handleClosePopup}
          onConnectionPreview={handleConnectionPreview}
          onConnectionCreate={handleConnectionCreate}
          previewTarget={previewEdge?.target}
        />
      )}
    </>
  );
}

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [popupState, setPopupState] = useState({
    show: false,
    position: { x: 0, y: 0 },
    currentNode: null
  });
  const [previewEdge, setPreviewEdge] = useState(null);

  return (
    <AppContainer>
      <LeftPanel>
        <Sidebar songs={initialSongs} />
      </LeftPanel>
      <RightPanel>
        <ReactFlowProvider>
          <FlowContent
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            popupState={popupState}
            setPopupState={setPopupState}
            previewEdge={previewEdge}
            setPreviewEdge={setPreviewEdge}
          />
        </ReactFlowProvider>
      </RightPanel>
    </AppContainer>
  );
}

export default App;
