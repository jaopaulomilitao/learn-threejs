import { useState, useEffect } from 'react';
import { fetchLessonById, updateLesson } from '@/features/lessons/api/firestore';
import { Lesson } from '@/features/lessons/api/firestore';

export const useLesson = (lessonId: string) => {
    const [content, setContent] = useState<string | null>(null);
    const [lessonData, setLessonData] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadLesson = async () => {
            setLoading(true);
            try {
                const data = await fetchLessonById(lessonId);
                setLessonData(data as Lesson);
                setContent(data.content);
            } catch (error) {
                console.error('Erro ao carregar a lição:', error);
            } finally {
                setLoading(false);
            }
        };
        loadLesson();
    }, [lessonId]);

    const save = async (updatedLesson: Lesson) => {
        try {
            await updateLesson(lessonId, updatedLesson);
            alert('Lição atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar a lição:', error);
        }
    };

    return { content, save, lessonData, loading };


};
