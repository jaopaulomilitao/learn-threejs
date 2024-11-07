'use client';

import { useEffect, useState, useMemo } from 'react';
import LessonView from "@/components/lesson-viewer/LessonViewer";
import Image from "next/image";
import LessonList from '@/components/lesson-list/LessonList';
import { useLesson } from '@/features/lessons/hooks/useLesson';
import { Skeleton } from "@nextui-org/react";

const LearnPage: React.FC = () => {
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const { lessonData, loading } = useLesson(selectedLessonId || "");

    useEffect(() => {
        // Se necessário, faça o que for apropriado quando a lição mudar
    }, [selectedLessonId]);

    const handleLessonSelect = (lessonId: string) => {
        setSelectedLessonId(lessonId);
    };

    // Memorizar LessonList para evitar re-renderização desnecessária
    const memoizedLessonList = useMemo(() => {
        return (
            <LessonList
                onSelectLesson={handleLessonSelect}
                selectedLessonId={selectedLessonId}
            />
        );
    }, [selectedLessonId]);

    return (
        <div className="container mx-auto p-8 flex gap-10">
            {/* Lesson List - ocupando espaço proporcional */}
            <div className="flex-none w-[20%] min-w-[200px] max-w-[250px]">
                {memoizedLessonList}
            </div>

            {/* Conteúdo principal - ocupando o restante do espaço */}
            <div className="flex-grow flex flex-col items-center gap-9">
                <div className='max-w-[55rem] min-w-[55rem]'>
                    {loading ? (
                        <>
                            {/* Skeleton para o título */}
                            <Skeleton className="w-full h-12 rounded-md" />
                            {/* Skeleton para a descrição */}
                            <Skeleton className="w-full h-8 rounded-md" />
                            {/* Skeleton para a imagem */}
                            <Skeleton className="w-full h-[250px] rounded-lg" />
                            {/* Skeleton para o conteúdo da lição */}
                            <Skeleton className="w-full h-64 rounded-md" />
                        </>
                    ) : (
                        lessonData && (
                            <div className='flex flex-col gap-3 items-center w-full max-w-5xl justify-center'>
                                <div className='flex flex-col gap-3 items-center w-full'>
                                    <div className='w-10 h-2 rounded-md' style={{ backgroundColor: lessonData.colorTag }} />
                                    <h1 className="text-3xl font-bold">{lessonData.title}</h1>
                                    <h3 className="text-sm font-normal text-center max-w-xl">{lessonData.description}</h3>
                                </div>

                                <div className='relative w-full h-[250px] overflow-hidden rounded-lg shadow-md'>
                                    <Image
                                        src={lessonData.bannerImage || "/imgs/background.jpg"} // Remova o "public" do caminho
                                        alt="Imagem da lição"
                                        layout="fill" // Para preencher o contêiner
                                        objectFit="cover" // Para cobrir e centralizar
                                        className="rounded-lg hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {selectedLessonId && (
                                    <div className="w-full bg-white p-6 rounded-lg">
                                        <LessonView lessonId={selectedLessonId} />
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>

            </div>
        </div>
    );
};

export default LearnPage;
