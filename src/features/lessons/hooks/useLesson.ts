'use client';
import { useState, useEffect } from 'react';
import { saveLesson, getLesson } from '@/features/lessons/api/firestore';

const useLesson = (lessonId: string) => {
    const [content, setContent] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchLesson = async () => {
            if (!lessonId) return; // Não faz nada se lessonId for inválido

            setLoading(true);
            try {
                const lessonContent = await getLesson(lessonId);
                setContent(lessonContent);
            } catch (error) {
                console.error('Erro ao buscar a lição:', error);
                setContent(null);
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [lessonId]);

    const save = async (newContent: string) => {
        try {
            await saveLesson(lessonId, newContent);
        } catch (error) {
            console.error('Erro ao salvar a lição:', error);
        }
    };

    return { content, save, loading, setContent };
};

export default useLesson;
