import { useEffect, useState } from 'react';
import { fetchLessons, addLesson } from '@/features/lessons/api/firestore';
import ButtonMenuAside from '../button-menu-aside/ButtonMenuAside';
import { FiBookOpen, FiBook } from 'react-icons/fi';
import { Button } from '@nextui-org/react';
import Skeleton from "@/components/skeleton/Skeleton";
import { LuFilePlus } from 'react-icons/lu';
import { HTMLAttributes } from 'react';

interface Lesson {
    id: string;
    title: string;
    colorTag: string;
}

interface LessonListProps extends HTMLAttributes<HTMLDivElement> {
    onSelectLesson: (lessonId: string) => void;
    selectedLessonId: string | null;
    isEditable?: boolean;
}

const LessonList: React.FC<LessonListProps> = ({ onSelectLesson, selectedLessonId, isEditable = false }) => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        const loadLessons = async () => {
            setLoading(true);
            const lessonsData = await fetchLessons();
            setLessons(lessonsData);
            setLoading(false);
        };
        loadLessons();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1536) {
                setIsOpen(true);
                setIsButtonDisabled(true); // Desativa o botão em telas grandes
            } else {
                setIsOpen(false);
                setIsButtonDisabled(false); // Ativa o botão em telas menores
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
        <aside className={`flex flex-col gap-3 ${isOpen ? 'bg-white opacity-100' : 'bg-gray-200 opacity-70'} p-3 rounded-lg shadow-lg fixed transition-all duration-500 ${isOpen ? 'w-[80%]' : 'w-10'} ${isOpen ? '2xl:w-[20%]' : '2xl:w-[20%]'} min-w-10 max-w-[250px]`}>
            {/* Botão do ícone de livro que controla o estado de visibilidade */}
            <div
                className={`flex items-center gap-2 cursor-pointer  ${isButtonDisabled ? 'pointer-events-none' : ''}`}
                onClick={() => !isButtonDisabled && setIsOpen(!isOpen)}
            >
                {isOpen ? <FiBookOpen className="text-xl" /> : <FiBook className="text-xl hover:text-2xl transition-all duration-300" />}
                <p className={`text-base font-bold transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 hidden 2xl:block'}`}>Práticas</p>
            </div>
            <hr className={`border-dashed border-main-black/30 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 hidden 2xl:block'}`} />

            {/* Conteúdo do menu */}
            <div className={`flex-col gap-2 transition-all duration-500 ${isOpen ? 'flex' : 'hidden 2xl:flex'}`}>
                {loading ? (
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
                            isSelected={selectedLessonId === lesson.id}
                            onClick={() => onSelectLesson(lesson.id)}
                        />
                    ))
                )}
                <p className='text-xs text-center opacity-50'>Em breve, mais práticas serão adicionadas com o decorrer da disciplina.</p>
            </div>

            {/* Botão de adicionar nova lição */}
            {isEditable && isOpen && (
                <Button
                    onClick={handleAddLesson}
                    color="success"
                    className={`mt-4 w-full flex items-center gap-2 bg-main-black text-main-white rounded-lg p-4 hover:bg-[#1D2735] transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                    size="lg"
                >
                    <LuFilePlus className="text-lg" />
                    Adicionar Nova Lição
                </Button>
            )}
        </aside>
    );
};

export default LessonList;
