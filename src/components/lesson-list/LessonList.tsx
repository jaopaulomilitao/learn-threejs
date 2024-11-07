'use client';

import { useEffect, useState } from 'react';
import { fetchLessons, addLesson } from '@/features/lessons/api/firestore';
import ButtonMenuAside from '../button-menu-aside/ButtonMenuAside';
import { FiBookOpen } from 'react-icons/fi';
import { Button } from '@nextui-org/react'; // Importando Skeleton e Button do Next UI
import { Skeleton } from "@nextui-org/skeleton";
import { LuFilePlus } from 'react-icons/lu';
import { MdMenu, MdClose } from 'react-icons/md'; // Ícones para o menu hamburguer
import { HTMLAttributes } from 'react';


interface Lesson {
    id: string;
    title: string;
    colorTag: string; // Supondo que cada lição tenha uma cor associada
}

interface LessonListProps extends HTMLAttributes<HTMLDivElement> {
    onSelectLesson: (lessonId: string) => void;
    selectedLessonId: string | null; // ID da lição selecionada
    isEditable?: boolean; // Prop opcional para controlar visibilidade do botão
}

const LessonList: React.FC<LessonListProps> = ({ onSelectLesson, selectedLessonId, isEditable = false }) => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [isOpen, setIsOpen] = useState(false); // Estado para controle do menu

    useEffect(() => {
        const loadLessons = async () => {
            setLoading(true);
            const lessonsData = await fetchLessons();
            setLessons(lessonsData);
            setLoading(false); // Finaliza o estado de carregamento quando os dados são carregados
        };
        loadLessons();
    }, []);

    const handleAddLesson = async () => {
        const newLesson = {
            title: 'Nova Lição',
            description: 'Descrição da nova lição',
            content: '<p>Conteúdo inicial da nova lição.</p>',
            colorTag: '#00FF00',
            bannerImage: ''
        };

        await addLesson(newLesson, null);
        const lessonsData = await fetchLessons();
        setLessons(lessonsData);
    };

    return (
        <aside className={`flex flex-col gap-3 bg-white p-3 rounded-lg shadow-lg fixed transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-[20%] min-w-[200px] max-w-[250px]`}>
            {/* Botão de menu hamburguer */}
            <div className="flex justify-between items-center lg:hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                    {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
                </button>
                <p className="text-base font-bold">Práticas</p>
            </div>
            <div className={`flex flex-col ${isOpen ? 'flex' : 'hidden'} lg:flex`}>
                <div className="flex items-center gap-2">
                    <FiBookOpen className='text-xl' />
                    <p className="text-base font-bold hidden lg:block">Práticas</p>
                </div>
                <hr className="border-dashed border-main-black/30 my-4" />
                {/* Adicionando o gap entre os botões do menu */}
                <div className="flex flex-col gap-2">
                    {loading ? (
                        // Mostra Skeletons enquanto as lições estão sendo carregadas
                        <>
                            <Skeleton className="w-full h-12 rounded-md" />
                            <Skeleton className="w-full h-12 rounded-md" />
                            <Skeleton className="w-full h-12 rounded-md" />
                        </>
                    ) : (
                        lessons.map(lesson => (
                            <ButtonMenuAside
                                key={lesson.id}
                                title={lesson.title}
                                color={lesson.colorTag}
                                isSelected={selectedLessonId === lesson.id} // Verificando se a lição está selecionada
                                onClick={() => onSelectLesson(lesson.id)}
                            />
                        ))
                    )}
                </div>

                {/* Renderiza o botão de adicionar nova lição somente se isEditable for true */}
                {isEditable && (
                    <Button
                        onClick={handleAddLesson}
                        color="success"
                        className="mt-4 w-full flex items-center gap-2 bg-main-black text-main-white rounded-lg p-4 hover:bg-[#1D2735] transition-all duration-300 ease-in-out"
                        size='lg'
                    >
                        <LuFilePlus className='text-lg' /> {/* Ícone de adicionar */}
                        Adicionar Nova Lição
                    </Button>
                )}
            </div>
        </aside>
    );
};

export default LessonList;
