"use client";

import { Handle, Position, NodeProps } from '@xyflow/react';
import { FiCheck, FiLock, FiStar, FiCompass } from 'react-icons/fi';
// Importamos o QuestNodeType específico
import { QuestNodeType } from '../api/firestore'; 
import { cn } from '@/lib/utils'; 

// Alteramos o NodeProps para usar o QuestNodeType
export const QuestNode = ({ data, selected }: NodeProps<QuestNodeType>) => {
    const isCompleted = data.status === 'completed';
    const isActive = data.status === 'active';
    const isLocked = data.status === 'locked';
    const isSideQuest = data.questType === 'side';

    // defines dynamic sizing based on quest type
    const nodeSize = isSideQuest ? "w-12 h-12" : "w-16 h-16";
    const labelOffset = isSideQuest ? "top-[60px]" : "top-[75px]";

    return (
        <div className="relative group flex justify-center">
            {/* target handle (top) */}
            <Handle 
                type="target" 
                position={Position.Top} 
                className="w-3 h-3 bg-slate-300 border-none opacity-0 group-hover:opacity-100 transition-opacity" 
            />

            {/* node styling based on status and type */}
            <div
                className={cn(
                    // removes bg-white from base classes to prevent color conflicts
                    "flex flex-col items-center justify-center rounded-full border-4 shadow-lg transition-transform z-10",
                    nodeSize,
                    selected ? "scale-110 ring-4 ring-slate-200" : "hover:scale-105",
                    
                    // applies main quest colors
                    !isSideQuest && isCompleted && "bg-main-green border-main-green text-white",
                    !isSideQuest && isActive && "bg-orange-500 border-orange-500 text-white animate-pulse",
                    !isSideQuest && isLocked && "bg-white border-slate-300 text-slate-400 cursor-not-allowed",
                    
                    // applies side quest colors 
                    isSideQuest && isCompleted && "bg-indigo-500 border-indigo-500 text-white",
                    isSideQuest && isActive && "bg-indigo-400 border-indigo-400 text-white animate-pulse",
                    isSideQuest && isLocked && "bg-slate-50 border-dashed border-slate-300 text-slate-400 cursor-not-allowed"
                )}
            >
                {/* renders dynamic icons with forced colors to ensure visibility */}
                {isCompleted && !isSideQuest && <FiCheck size={28} strokeWidth={3} className="text-white" />}
                {isCompleted && isSideQuest && <FiCheck size={20} strokeWidth={3} className="text-white" />}
                
                {isActive && !isSideQuest && <FiStar size={26} strokeWidth={2.5} className="fill-white text-white" />}
                {isActive && isSideQuest && <FiCompass size={22} strokeWidth={2.5} className="text-white" />}
                
                {isLocked && <FiLock size={isSideQuest ? 16 : 22} className="text-slate-400" />}
            </div>

            {/* title label below the node */}
            <div className={cn("absolute left-1/2 -translate-x-1/2 w-40 text-center pointer-events-none", labelOffset)}>
                <span className={cn(
                    "text-[11px] leading-tight font-bold px-2.5 py-1 rounded-md shadow-sm inline-block",
                    isActive && !isSideQuest && "bg-orange-500 text-white",
                    isActive && isSideQuest && "bg-indigo-500 text-white",
                    !isActive && !isLocked && "bg-white text-main-black border border-slate-200",
                    isLocked && "text-slate-400 bg-transparent shadow-none"
                )}>
                    {data.label}
                </span>
            </div>

            {/* source handle (bottom) */}
            <Handle 
                type="source" 
                position={Position.Bottom} 
                className="w-3 h-3 bg-slate-300 border-none opacity-0 group-hover:opacity-100 transition-opacity" 
            />
        </div>
    );
};