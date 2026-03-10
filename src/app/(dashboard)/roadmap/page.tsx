"use client";

import { useEffect, useMemo } from "react";
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // CRITICAL: REQUIRED FOR REACT FLOW

import { useRoadmapStore } from "@/features/roadmap/store/useRoadmapStore";
import { QuestNode } from "@/features/roadmap/components/QuestNode";
import { QuestSheet } from "@/features/roadmap/components/QuestSheet";
import { saveRoadmap } from "@/features/roadmap/api/firestore";
import { DividerNode } from "@/features/roadmap/components/DividerNode"; // <-- IMPORT AQUI
// maps the custom node string to our react component
const nodeTypes = {
    quest: QuestNode,
    divider: DividerNode,
};

export default function RoadmapPage() {
    const { 
        nodes, edges, isLoading, loadRoadmap, 
        onNodesChange, onEdgesChange, onConnect, openQuestSheet 
    } = useRoadmapStore();

    // loads data on mount
    useEffect(() => {
        loadRoadmap();
    }, [loadRoadmap]);

    // checks if user is admin to allow dragging/editing
    const isAdmin = false; // TODO: Replace with your actual auth/role logic

    // saves the current layout to firestore
    const handleSaveLayout = async () => {
        await saveRoadmap(nodes, edges);
        alert("Roadmap salvo com sucesso!");
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Carregando mapa...</div>;
    }

    return (
        <div className="w-full h-screen bg-slate-50 relative">
            {/* Top Admin Bar */}
            {isAdmin && (
                <div className="absolute top-4 right-4 z-10">
                    <button 
                        onClick={handleSaveLayout}
                        className="bg-main-black text-white px-4 py-2 rounded-md font-bold shadow-md hover:bg-main-black/80 transition-colors"
                    >
                        Salvar Posições
                    </button>
                </div>
            )}

            {/* React Flow Canvas */}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onNodeClick={(_, node) => openQuestSheet(node)} // opens side sheet on click
                nodesDraggable={isAdmin} // only admin can move nodes
                nodesConnectable={isAdmin} // only admin can create lines
                elementsSelectable={true}
                fitView
            >
                {/* Visual grid dots */}
                <Background color="#ccc" gap={24} />
                {/* Zoom controls */}
                <Controls showInteractive={false} />
                {/* Small map on bottom corner */}
                <MiniMap nodeStrokeWidth={3} zoomable pannable />
            </ReactFlow>

            {/* Slide-out Sheet Component */}
            <QuestSheet />
        </div>
    );
}