"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRoadmapStore } from "../store/useRoadmapStore";
import { useLessonStore } from "@/features/lessons/store/useLessonStore";
import { useRouter } from "next/navigation";
import { FiPlayCircle, FiCheckCircle, FiLock, FiExternalLink } from "react-icons/fi";

export const QuestSheet = () => {
    const router = useRouter();
    const { isSheetOpen, closeQuestSheet, selectedQuest } = useRoadmapStore();
    const setSelectedLessonId = useLessonStore((state) => state.setSelectedLessonId);

    // SEGURANÇA TYPESCRIPT: Garante que a gaveta só renderiza se o nó existir E se for do tipo 'quest'
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
            // Muda a rota dinâmica apontando para o ID da lição
            router.push(`/learn/${data.lessonId}`); 
        }
    };

    return (
        <Sheet open={isSheetOpen} onOpenChange={(open) => !open && closeQuestSheet()}>
            <SheetContent className="w-[400px] sm:w-[540px] bg-white border-l border-slate-200 p-4">
                <SheetHeader className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        {data.status === 'completed' && <FiCheckCircle className="text-main-green text-2xl" />}
                        {data.status === 'active' && <FiPlayCircle className="text-orange-500 text-2xl" />}
                        {data.status === 'locked' && <FiLock className="text-slate-400 text-2xl" />}
                        <SheetTitle className="text-2xl font-black text-main-black">
                            {data.label}
                        </SheetTitle>
                    </div>
                    <SheetDescription className="text-slate-500 text-base leading-relaxed">
                        {data.description || "Nenhuma descrição fornecida para esta quest."}
                    </SheetDescription>
                </SheetHeader>

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
            </SheetContent>
        </Sheet>
    );
};