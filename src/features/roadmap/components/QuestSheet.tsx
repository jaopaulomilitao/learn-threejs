"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRoadmapStore } from "../store/useRoadmapStore";
import { useLessonStore } from "@/features/lessons/store/useLessonStore";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useRouter } from "next/navigation";
import { FiPlayCircle, FiCheckCircle, FiLock, FiExternalLink, FiTrash2 } from "react-icons/fi";
import { QuestStatus, QuestType } from "../api/firestore";

export const QuestSheet = () => {
    const router = useRouter();
    const { isSheetOpen, closeQuestSheet, selectedQuest, updateNode, deleteNode } = useRoadmapStore();
    const setSelectedLessonId = useLessonStore((state) => state.setSelectedLessonId);
    
    const { userData } = useAuthStore();
    const isAdmin = userData?.role === 'admin';

    if (!selectedQuest || selectedQuest.type !== 'quest') return null;

    const data = selectedQuest.data;
    const isLocked = data.status === 'locked';
    const isExternal = !!data.externalLink;

    const handleStartQuest = () => {
        if (isExternal && data.externalLink) {
            window.open(data.externalLink as string, '_blank', 'noopener,noreferrer');
        } else if (data.lessonId) {
            setSelectedLessonId(data.lessonId as string);
            closeQuestSheet();
            router.push(`/learn/${data.lessonId}`);
        }
    };

    return (
        <Sheet open={isSheetOpen} onOpenChange={(open) => !open && closeQuestSheet()}>
            <SheetContent className="w-[400px] sm:w-[540px] bg-white border-l border-slate-200 overflow-y-auto p-4">
                <SheetHeader className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        {data.status === 'completed' && <FiCheckCircle className="text-main-green text-2xl shrink-0" />}
                        {data.status === 'active' && <FiPlayCircle className="text-orange-500 text-2xl shrink-0" />}
                        {data.status === 'locked' && <FiLock className="text-slate-400 text-2xl shrink-0" />}
                        
                        {isAdmin ? (
                            <input 
                                type="text"
                                value={data.label}
                                onChange={(e) => updateNode(selectedQuest.id, { label: e.target.value })}
                                className="text-xl font-black text-main-black w-full border-b border-dashed border-slate-300 focus:outline-none focus:border-main-black bg-transparent"
                            />
                        ) : (
                            <SheetTitle className="text-2xl font-black text-main-black">
                                {data.label}
                            </SheetTitle>
                        )}
                    </div>

                    {isAdmin ? (
                        <textarea 
                            value={data.description}
                            onChange={(e) => updateNode(selectedQuest.id, { description: e.target.value })}
                            className="text-slate-500 text-sm leading-relaxed w-full border border-dashed border-slate-300 rounded p-2 focus:outline-none focus:border-main-black min-h-[100px] resize-y"
                            placeholder="Descrição da quest..."
                        />
                    ) : (
                        <SheetDescription className="text-slate-500 text-base leading-relaxed">
                            {data.description || "Nenhuma descrição fornecida."}
                        </SheetDescription>
                    )}
                </SheetHeader>

                {isAdmin ? (
                    // ADMIN CONTROLS
                    <div className="flex flex-col gap-4 mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Controles de Edição</h4>
                        
                        <div className="flex gap-2">
                            <select 
                                value={data.status} 
                                onChange={(e) => updateNode(selectedQuest.id, { status: e.target.value as QuestStatus })}
                                className="flex-1 p-2 rounded border border-slate-200 text-sm font-medium"
                            >
                                <option value="locked">Bloqueado (Locked)</option>
                                <option value="active">Ativo (Active)</option>
                                <option value="completed">Concluído (Completed)</option>
                            </select>

                            <select 
                                value={data.questType} 
                                onChange={(e) => updateNode(selectedQuest.id, { questType: e.target.value as QuestType })}
                                className="flex-1 p-2 rounded border border-slate-200 text-sm font-medium"
                            >
                                <option value="main">Main Quest</option>
                                <option value="side">Side Quest</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-600">ID da Lição (Interno)</label>
                            <input 
                                type="text" 
                                value={data.lessonId || ''} 
                                // sets external link to empty string instead of undefined
                                onChange={(e) => updateNode(selectedQuest.id, { lessonId: e.target.value, externalLink: "" })}
                                className="p-2 rounded border border-slate-200 text-sm" 
                                placeholder="Ex: L1" 
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-600">Link Externo (Youtube, etc)</label>
                            <input 
                                type="text" 
                                value={data.externalLink || ''} 
                                // sets lesson id to empty string instead of undefined
                                onChange={(e) => updateNode(selectedQuest.id, { externalLink: e.target.value, lessonId: "" })}
                                className="p-2 rounded border border-slate-200 text-sm" 
                                placeholder="https://..." 
                            />
                        </div>

                        <Button 
                            onClick={() => deleteNode(selectedQuest.id)} 
                            variant="destructive"
                            className="mt-4 w-full flex items-center justify-center gap-2"
                        >
                            <FiTrash2 /> Apagar Quest
                        </Button>
                    </div>
                ) : (
                    // STUDENT CONTROLS
                    <div className="mt-8 flex flex-col gap-4">
                        <Button 
                            onClick={handleStartQuest} 
                            disabled={isLocked}
                            className="w-full py-6 text-lg font-bold bg-main-black text-white hover:bg-main-black/80 disabled:bg-slate-200 flex items-center justify-center gap-2"
                        >
                            {isLocked 
                                ? "Conteúdo Bloqueado" 
                                : isExternal 
                                    ? <><FiExternalLink /> Acessar conteúdo externo</> 
                                    : "Acessar conteúdo"}
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};