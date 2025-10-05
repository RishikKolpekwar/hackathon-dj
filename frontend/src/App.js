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
import TransitionPopup from './components/TransitionPopup.js';
import MusicPlayer from './components/MusicPlayer';
import UploadForm from './components/UploadForm';
import { songs as initialSongs } from './data/songs';

const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TabBar = styled.div`
  display: flex;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-bottom: 2px solid transparent;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: linear-gradient(
      to right,
      #e92a67 0%,
      #a853ba 33%,
      #2a8af6 66%,
      #e92a67 100%
    );
  }
`;

const Tab = styled.button`
  padding: 20px 40px;
  background: ${props => props.active ?
    'linear-gradient(135deg, rgba(233, 42, 103, 0.2) 0%, rgba(42, 138, 246, 0.2) 100%)' :
    'transparent'};
  border: none;
  color: ${props => props.active ? '#f3f4f6' : '#999'};
  font-family: 'Fira Mono', monospace;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  letter-spacing: -0.3px;
  
  &:hover {
    color: #f3f4f6;
    background: linear-gradient(135deg, rgba(233, 42, 103, 0.1) 0%, rgba(42, 138, 246, 0.1) 100%);
  }
  
  ${props => props.active && `
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -2px;
      height: 2px;
      background: linear-gradient(to right, #e92a67 0%, #2a8af6 100%);
      z-index: 1;
    }
  `}
`;

const AppContainer = styled.div`
  display: flex;
  height: calc(100vh - 64px);
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
function FlowContent({ nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, popupState, setPopupState, previewEdge, setPreviewEdge, setCurrentSong, currentSong, transitioningEdgeId, edgeTransitions, setEdgeTransitions, transitionPopupState, setTransitionPopupState }) {
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

    const newEdgeId = `edge-${sourceNode.id}-${targetNode.id}-${Date.now()}`;
    const newEdge = {
      id: newEdgeId,
      source: sourceNode.id,
      target: targetNode.id,
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'turbo',
      updatable: false
    };

    setEdges((eds) => [...finalEdges, newEdge]);
    setPreviewEdge(null);

    // Auto-select default transition
    const sourceSong = sourceNode.data.song;
    const targetSong = targetNode.data.song;

    if (sourceSong && sourceSong.transitions) {
      // Find a default transition or any matching transition
      const defaultTransition = sourceSong.transitions.find(t =>
        t.Name === 'Default Transition' && (t.TransitionTo === targetSong.id || t.TransitionTo === 'ANY')
      );

      // If no default, try to find any matching transition
      const anyTransition = defaultTransition || sourceSong.transitions.find(t =>
        t.TransitionTo === targetSong.id || t.TransitionTo === 'ANY'
      );

      if (anyTransition) {
        setEdgeTransitions(prev => ({
          ...prev,
          [newEdgeId]: anyTransition
        }));
      }
    }
  }, [edges, setEdges, setPreviewEdge, setEdgeTransitions]);


  const handlePaneClick = useCallback((event) => {
    // Close popup when clicking on the pane (background)
    if (popupState.show) {
      handleClosePopup();
    }
  }, [popupState.show, handleClosePopup]);

  const handleEdgeClick = useCallback((edgeId) => {
    const edge = edges.find(e => e.id === edgeId);
    if (!edge) return;

    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    if (!sourceNode || !targetNode) return;

    setTransitionPopupState({
      show: true,
      edge: edge,
      sourceSong: sourceNode.data.song,
      targetSong: targetNode.data.song,
      selectedTransition: edgeTransitions[edgeId] || null
    });
  }, [edges, nodes, edgeTransitions, setTransitionPopupState]);

  const handleCloseTransitionPopup = useCallback(() => {
    setTransitionPopupState({
      show: false,
      edge: null,
      sourceSong: null,
      targetSong: null,
      selectedTransition: null
    });
  }, [setTransitionPopupState]);

  const handleSelectTransition = useCallback((edgeId, transition) => {
    setEdgeTransitions(prev => ({
      ...prev,
      [edgeId]: transition
    }));
  }, [setEdgeTransitions]);

  // Combine regular edges with preview edge, and mark transitioning edge
  const allEdges = edges.map(edge => ({
    ...edge,
    data: {
      ...edge.data,
      isTransitioning: edge.id === transitioningEdgeId,
      selectedTransition: edgeTransitions[edge.id] || null,
      onEdgeClick: handleEdgeClick
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

      {transitionPopupState.show && transitionPopupState.edge && (
        <TransitionPopup
          edge={transitionPopupState.edge}
          sourceSong={transitionPopupState.sourceSong}
          targetSong={transitionPopupState.targetSong}
          selectedTransition={transitionPopupState.selectedTransition}
          onSelectTransition={handleSelectTransition}
          onClose={handleCloseTransitionPopup}
        />
      )}
    </>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('dj'); // 'dj' or 'upload'
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [popupState, setPopupState] = useState({
    show: false,
    currentNodeId: null
  });
  const [previewEdge, setPreviewEdge] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [transitioningEdgeId, setTransitioningEdgeId] = useState(null);
  const [edgeTransitions, setEdgeTransitions] = useState({});
  const [transitionPopupState, setTransitionPopupState] = useState({
    show: false,
    edge: null,
    sourceSong: null,
    targetSong: null,
    selectedTransition: null
  });

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
        const nextNode = nextEdge ? nodes.find(n => n.id === nextEdge.target) : null;

        // Get the selected transition for this edge
        const selectedTransition = nextEdge ? edgeTransitions[nextEdge.id] : null;

        queue.push({
          song: node.data.song,
          edgeToNext: nextEdge ? nextEdge.id : null,
          nextSong: nextNode ? nextNode.data.song : null,
          hasTransition: selectedTransition ? true : false,
          transition: selectedTransition || null
        });

        if (nextEdge) {
          buildQueue(nextEdge.target);
        }
      }
    };

    // Start from first start node
    buildQueue(startNodes[0].id);

    return queue;
  }, [nodes, edges, edgeTransitions]);

  // Get songs that are currently on the canvas
  const songsOnCanvas = useMemo(() => {
    return nodes.map(node => node.data.song.id);
  }, [nodes]);

  // Filter out songs that are already on the canvas
  const availableSongs = useMemo(() => {
    return initialSongs.filter(song => !songsOnCanvas.includes(song.id));
  }, [songsOnCanvas]);

  return (
    <MainContainer>
      <TabBar>
        <Tab
          active={activeTab === 'dj'}
          onClick={() => setActiveTab('dj')}
        >
          🎧 DJ Workflow
        </Tab>
        <Tab
          active={activeTab === 'upload'}
          onClick={() => setActiveTab('upload')}
        >
          💰 Upload & Earn
        </Tab>
      </TabBar>

      {activeTab === 'dj' ? (
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
                  edgeTransitions={edgeTransitions}
                  setEdgeTransitions={setEdgeTransitions}
                  transitionPopupState={transitionPopupState}
                  setTransitionPopupState={setTransitionPopupState}
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
      ) : (
        <UploadForm />
      )}
    </MainContainer>
  );
}

export default App;