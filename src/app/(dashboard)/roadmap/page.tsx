"use client";

import { useEffect } from "react";
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css'; 

import { useRoadmapStore } from "@/features/roadmap/store/useRoadmapStore";
import { QuestNode } from "@/features/roadmap/components/QuestNode";
import { QuestSheet } from "@/features/roadmap/components/QuestSheet";
import { saveRoadmap } from "@/features/roadmap/api/firestore";
import { DividerNode } from "@/features/roadmap/components/DividerNode";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { FiSave, FiPlusCircle, FiMinus } from "react-icons/fi";

const nodeTypes = {
    quest: QuestNode,
    divider: DividerNode,
};

export default function RoadmapPage() {
    const { 
        nodes, edges, isLoading, loadRoadmap, 
        onNodesChange, onEdgesChange, onConnect, openQuestSheet,
        addNode 
    } = useRoadmapStore();

    const { userData } = useAuthStore();
    const isAdmin = userData?.role === 'admin';

    useEffect(() => {
        loadRoadmap();
    }, [loadRoadmap]);

    const handleSaveLayout = async () => {
        await saveRoadmap(nodes, edges);
        alert("Roadmap salvo com sucesso!");
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Carregando mapa...</div>;
    }

    return (
        <div className="w-full h-screen bg-slate-50 relative">
            
            {/* Top Admin Tools Panel */}
            {isAdmin && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white p-2 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2">
                    <button 
                        onClick={() => addNode('quest')}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-lg text-sm font-bold text-main-black transition-colors"
                    >
                        <FiPlusCircle className="text-lg" /> Quest
                    </button>
                    <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>
                    <button 
                        onClick={() => addNode('divider')}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-lg text-sm font-bold text-slate-500 transition-colors"
                    >
                        <FiMinus className="text-lg" /> Módulo
                    </button>
                    <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>
                    <button 
                        onClick={handleSaveLayout}
                        className="flex items-center gap-2 bg-main-green text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-main-green/90 transition-colors ml-2"
                    >
                        <FiSave className="text-lg" /> Salvar Mapa
                    </button>
                </div>
            )}

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onNodeClick={(_, node) => openQuestSheet(node)} 
                nodesDraggable={isAdmin} 
                nodesConnectable={isAdmin} 
                elementsSelectable={true}
                fitView
            >
                <Background color="#cbd5e1" gap={24} />
                <Controls showInteractive={false} />
                <MiniMap nodeStrokeWidth={3} zoomable pannable />
            </ReactFlow>

            <QuestSheet />
        </div>
    );
}