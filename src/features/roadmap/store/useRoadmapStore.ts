import { create } from "zustand";
import {
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Edge,
  Connection,
  addEdge,
} from "@xyflow/react";
import { CustomNode, fetchRoadmap, QuestNodeData } from "../api/firestore";

interface RoadmapState {
  nodes: CustomNode[];
  edges: Edge[];
  selectedQuest: CustomNode | null;
  isSheetOpen: boolean;
  isLoading: boolean;

  loadRoadmap: () => Promise<void>;
  onNodesChange: (changes: NodeChange<CustomNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  openQuestSheet: (node: CustomNode) => void;
  closeQuestSheet: () => void;
  
  // NEW ADMIN ACTIONS
  addNode: (type: 'quest' | 'divider') => void;
  updateNode: (id: string, data: Partial<QuestNodeData>) => void;
  deleteNode: (id: string) => void;
}

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedQuest: null,
  isSheetOpen: false,
  isLoading: true,

  // loads data from database
  loadRoadmap: async () => {
    // sets loading to true before starting the fetch
    set({ isLoading: true });
    
    try {
      // fetches the roadmap data from firestore
      const roadmapData = await fetchRoadmap();
      
      set({ 
        nodes: roadmapData.nodes || [], 
        edges: roadmapData.edges || [], 
        isLoading: false 
      });
    } catch (error) {
      // logs the error and resets loading state to prevent infinite loading screens
      console.error('failed to load roadmap:', error);
      set({ isLoading: false });
    }
  },

  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) as CustomNode[] }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
  
  openQuestSheet: (node) => set({ selectedQuest: node, isSheetOpen: true }),
  closeQuestSheet: () => set({ isSheetOpen: false, selectedQuest: null }),

  // ADDS A NEW NODE AT THE CENTER OF THE SCREEN
  addNode: (type) => {
    const id = `node-${Date.now()}`;
    const newNode: CustomNode = type === 'quest' 
      ? {
          id,
          type: 'quest',
          position: { x: 400, y: 100 },
          data: { label: 'Nova Quest', description: '', status: 'locked', questType: 'main' }
        }
      : {
          id,
          type: 'divider',
          position: { x: 0, y: 100 },
          data: { label: 'Novo Módulo' },
          selectable: false,
        };

    set({ nodes: [...get().nodes, newNode] });
  },

  // UPDATES SPECIFIC DATA OF A NODE
  updateNode: (id, newData) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === id) {
          // updates both the global node list and the currently selected node in the sheet
          const updatedNode = { ...node, data: { ...node.data, ...newData } };
          if (state.selectedQuest?.id === id) {
             state.selectedQuest = updatedNode as CustomNode;
          }
          return updatedNode as CustomNode;
        }
        return node;
      }),
    }));
  },

  // DELETES A NODE AND ITS CONNECTED EDGES
  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
      isSheetOpen: false,
      selectedQuest: null,
    }));
  },
}));