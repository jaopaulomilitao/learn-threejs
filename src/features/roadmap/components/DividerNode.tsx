"use client";

import { NodeProps } from '@xyflow/react';
// Importamos o DividerNodeType específico
import { DividerNodeType } from '../api/firestore';

// Passamos a tipagem correta
export const DividerNode = ({ data }: NodeProps<DividerNodeType>) => {
    return (
        <div className="flex items-center justify-center w-[800px] h-10 pointer-events-none opacity-60">
            <div className="absolute w-full border-t-2 border-dashed border-slate-300"></div>
            <div className="relative bg-slate-50 px-4 text-slate-400 font-bold tracking-widest uppercase text-sm z-10">
                {data.label as string}
            </div>
        </div>
    );
};