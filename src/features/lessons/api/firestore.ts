// src/features/lessons/api/firestore.ts
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/config';

export const saveLesson = async (lessonId: string, content: string) => {
    try {
        const lessonRef = doc(firestore, 'lessons', lessonId);
        await setDoc(lessonRef, { content });
        console.log('Lesson saved successfully');
    } catch (error) {
        console.error('Error saving lesson:', error);
    }
};

export const getLesson = async (lessonId: string): Promise<string | null> => {
    try {
        const lessonRef = doc(firestore, 'lessons', lessonId);
        const lessonSnap = await getDoc(lessonRef);
        if (lessonSnap.exists()) {
            return lessonSnap.data()?.content || null;
        }
        return null;
    } catch (error) {
        console.error('Error getting lesson:', error);
        return null;
    }
};
