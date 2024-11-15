'use client';

import { useEffect, useState, useMemo } from 'react';
import LessonView from "@/components/lesson-viewer/LessonViewer";
import Image from "next/image";
import LessonList from '@/components/lesson-list/LessonList';
import { useLesson } from '@/features/lessons/hooks/useLesson';
import Skeleton from "@/components/skeleton/Skeleton";
import Lottie from 'react-lottie'; // Importando Lottie
import animationData from '@/../../public/looties/duck-talk.json'; // Caminho para o arquivo Lottie

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

    // Configuração da animação Lottie
    const lottieOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData, // Caminho para o arquivo Lottie
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return (
        <div className="container mx-auto flex flex-col lg:flex-row gap-10 py-8 px-8 w-full">
            <div className="flex-none w-full lg:w-[20%] min-w-[200px] max-w-[250px] hidden 2xl:block">
                {memoizedLessonList}
            </div>

            <div className="flex-none w-full lg:w-[20%] min-w-[200px] max-w-[250px] block fixed -mx-4 md:-mx-7 z-20 2xl:hidden">
                {memoizedLessonList}
            </div>

            {/* Conteúdo principal, adaptável ao tamanho da tela */}
            <div className="flex-grow flex flex-col items-center gap-9 w-full" id="content">
                <div className='w-full flex justify-center items-center'>
                    {loading ? (
                        <div className='flex flex-col gap-3 items-center w-full justify-center'>
                            <Skeleton className="w-full h-12 rounded-md" />
                            <Skeleton className="w-full h-8 rounded-md" />
                            <Skeleton className="w-full h-[250px] rounded-lg" />
                            <Skeleton className="w-full h-64 rounded-md" />
                        </div>
                    ) : selectedLessonId === null ? (
                        // Caso nenhum ID de lição seja selecionado
                        <div className="flex flex-col items-center justify-center w-full h-full text-gray-500 opacity-40 mt-8">
                            <p className="text-md font-bold text-center -mb-4">Escolha alguma prática para
                                <br />fazer no menu lateral.</p>
                            <div style={{ width: '150px', height: '150px' }}>
                                <Lottie options={lottieOptions} />
                            </div>
                        </div>
                    ) : (
                        // Exibir a lição selecionada
                        lessonData && (
                            <div className='flex flex-col gap-3 items-center w-full max-w-6xl justify-center'>
                                <div className='flex flex-col gap-3 items-center w-full'>
                                    <div className='w-10 h-2 rounded-md' style={{ backgroundColor: lessonData.colorTag }} />
                                    <h1 className="text-3xl font-bold">{lessonData.title}</h1>
                                    <h3 className="text-sm font-normal text-center max-w-xl">{lessonData.description}</h3>
                                </div>

                                <div className='relative w-full h-[250px] overflow-hidden rounded-lg shadow-md'>
                                    <Image
                                        src={lessonData.bannerImage || "/imgs/background.jpg"}
                                        alt="Imagem da lição"
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-lg hover:scale-105 transition-transform duration-300"
                                        priority
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
}

export default LearnPage;
