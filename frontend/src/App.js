import React, { useCallback, useState, useMemo } from 'react';
import styled from 'styled-components';
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/base.css';

import Sidebar from './components/Sidebar';
import TurboNode from './components/TurboNode.js';
import TurboEdge from './components/TurboEdge.js';
import ConnectionPopup from './components/ConnectionPopup.js';
import MusicPlayer from './components/MusicPlayer';
import { songs as initialSongs } from './data/songs';

const AppContainer = styled.div`
  display: flex;
  height: calc(100vh - 130px);
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%);
`;

const LeftPanel = styled.div`
  width: 300px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-right: 2px solid transparent;
  overflow-y: auto;
  position: relative;

  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* For Firefox */
  scrollbar-width: none;

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
  updatable: false,
};

const initialNodes = [];
const initialEdges = [];

// Inner component that uses React Flow hooks
function FlowContent({ nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, popupState, setPopupState, previewEdge, setPreviewEdge, setCurrentSong, currentSong, transitioningEdgeId }) {
  const { screenToFlowPosition } = useReactFlow();

  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const nodeTypes = useMemo(() => ({
    turbo: (props) => <TurboNode {...props} onDelete={handleDeleteNode} onPlay={setCurrentSong} currentSong={currentSong} />,
  }), [handleDeleteNode, setCurrentSong, currentSong]);

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
    setPopupState({
      show: true,
      currentNodeId: node.id
    });
  }, [setPopupState]);

  const handleClosePopup = useCallback(() => {
    setPopupState({
      show: false,
      currentNodeId: null
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
      sourceHandle: 'output',
      targetHandle: 'input',
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
    if (!sourceNode || !targetNode) return;
    if (sourceNode.id === targetNode.id) return;

    // Replace any existing connection to target
    const updatedEdges = edges.filter((e) => e.target !== targetNode.id);

    // Remove any existing outgoing from source
    const finalEdges = updatedEdges.filter((e) => e.source !== sourceNode.id);

    const newEdge = {
      id: `edge-${sourceNode.id}-${targetNode.id}-${Date.now()}`,
      source: sourceNode.id,
      target: targetNode.id,
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'turbo',
      updatable: false
    };

    setEdges((eds) => [...finalEdges, newEdge]);
    setPreviewEdge(null);
  }, [edges, setEdges, setPreviewEdge]);


  const handlePaneClick = useCallback((event) => {
    // Close popup when clicking on the pane (background)
    if (popupState.show) {
      handleClosePopup();
    }
  }, [popupState.show, handleClosePopup]);

  // Combine regular edges with preview edge, and mark transitioning edge
  const allEdges = edges.map(edge => ({
    ...edge,
    data: {
      ...edge.data,
      isTransitioning: edge.id === transitioningEdgeId
    }
  }));
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
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        nodesConnectable={false}
        edgesUpdatable={false}
        connectOnClick={false}
        panOnDrag={[2]}
        defaultViewport={{ x: 0, y: 0, zoom: 1.2 }}
        minZoom={0.8}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Controls
          showInteractive={false}
          fitViewOptions={{ padding: 0.1, includeHiddenNodes: false }}
        />
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

      {popupState.show && popupState.currentNodeId && (
        <ConnectionPopup
          currentNodeId={popupState.currentNodeId}
          allNodes={nodes}
          edges={edges}
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
    currentNodeId: null
  });
  const [previewEdge, setPreviewEdge] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [transitioningEdgeId, setTransitioningEdgeId] = useState(null);

  // Build song queue from connected nodes with transition info
  const songQueue = useMemo(() => {
    if (nodes.length === 0) return [];

    // Find all nodes that have no incoming edges (starting points)
    const nodesWithIncoming = new Set(edges.map(e => e.target));
    const startNodes = nodes.filter(n => !nodesWithIncoming.has(n.id));

    // If no start node found, just return empty queue
    if (startNodes.length === 0) return [];

    // Build queue by following edges from start node
    const queue = [];
    const visited = new Set();

    const buildQueue = (nodeId) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        // Find the edge that connects this node to the next
        const nextEdge = edges.find(e => e.source === nodeId);

        queue.push({
          song: node.data.song,
          edgeToNext: nextEdge ? nextEdge.id : null,
          hasTransition: nextEdge && node.data.song.postTransition ? true : false,
          transitionFile: node.data.song.postTransition || null
        });

        if (nextEdge) {
          buildQueue(nextEdge.target);
        }
      }
    };

    // Start from first start node
    buildQueue(startNodes[0].id);

    return queue;
  }, [nodes, edges]);

  // Get songs that are currently on the canvas
  const songsOnCanvas = useMemo(() => {
    return nodes.map(node => node.data.song.id);
  }, [nodes]);

  // Filter out songs that are already on the canvas
  const availableSongs = useMemo(() => {
    return initialSongs.filter(song => !songsOnCanvas.includes(song.id));
  }, [songsOnCanvas]);

  return (
    <>
      <AppContainer>
        <LeftPanel>
          <Sidebar songs={availableSongs} />
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
              setCurrentSong={setCurrentSong}
              currentSong={currentSong}
              transitioningEdgeId={transitioningEdgeId}
            />
          </ReactFlowProvider>
        </RightPanel>
      </AppContainer>
      <MusicPlayer
        songQueue={songQueue}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        nodes={nodes}
        edges={edges}
        setTransitioningEdgeId={setTransitioningEdgeId}
      />
    </>
  );
}

export default App;