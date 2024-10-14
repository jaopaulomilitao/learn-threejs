'use client';
import { useEffect, useState } from 'react';
import { fetchLessons, addLesson } from '@/features/lessons/api/firestore';

const LessonList = ({ onSelectLesson }: { onSelectLesson: (lessonId: string) => void }) => {
    const [lessons, setLessons] = useState<{ id: string; title: string }[]>([]);
    // const [selectedImage, setSelectedImage] = useState<File | null>(null);

    useEffect(() => {
        const loadLessons = async () => {
            const lessonsData = await fetchLessons();
            setLessons(lessonsData);
        };
        loadLessons();
    }, []);

    // Função para lidar com o clique no botão de adicionar lição
    const handleAddLesson = async () => {
        const newLesson = {
            title: 'Nova Lição',
            description: 'Descrição da nova lição',
            content: '<p>Conteúdo inicial da nova lição.</p>',
            colorTag: '#00FF00',
            bannerImage: ''
        };

        await addLesson(newLesson, null); // Passa a lição e a imagem para ser salva
        const lessonsData = await fetchLessons(); // Recarrega a lista de lições
        setLessons(lessonsData); // Atualiza o estado com as novas lições
    };


    return (
        <div className="p-4">
            <ul className="space-y-4">
                {lessons.map(lesson => (
                    <li key={lesson.id}>
                        <button
                            onClick={() => onSelectLesson(lesson.id)}
                            className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded-md transition-transform duration-200 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                        >
                            {lesson.title}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Input para selecionar imagem */}
            {/* <div className="mt-4">
                <input type="file" accept="image/*" onChange={handleImageChange} />
            </div> */}

            {/* Botão para adicionar uma nova lição */}
            <button
                onClick={handleAddLesson}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md transition-transform duration-200 hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
            >
                Adicionar Nova Lição
            </button>
        </div>
    );
};

export default LessonList;
