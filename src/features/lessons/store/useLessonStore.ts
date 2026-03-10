import { create } from 'zustand';
import { deleteLesson, fetchLessons, Lesson } from '../api/firestore';

interface LessonState {
    lessons: Lesson[];
    // fetches all lessons from the database and updates the store
    loadLessons: () => Promise<void>;
    // removes a lesson from the store and database optimistically
    removeLesson: (id: string) => Promise<void>;
    activeTopic: string | null;
    setActiveTopic: (topic: string | null) => void;
    selectedLessonId: string | null;
    setSelectedLessonId: (id: string | null) => void;
}

export const useLessonStore = create<LessonState>((set, get) => ({
    lessons: [],
    activeTopic: null,
    selectedLessonId: null,
    
    // sets the active scroll topic
    setActiveTopic: (topic) => set({ activeTopic: topic }),
    
    // sets the currently selected lesson for the viewer
    setSelectedLessonId: (id) => set({ selectedLessonId: id }),
    
    loadLessons: async () => {
        try {
            // fetches the sorted lessons
            const data = await fetchLessons();
            set({ lessons: data as unknown as Lesson[] });
        } catch (error) {
            console.error('failed to load lessons:', error);
        }
    },

    removeLesson: async (id: string) => {
        // saves the current state in case of an error
        const previousLessons = get().lessons;

        // updates the ui optimistically 
        set({ lessons: previousLessons.filter((lesson) => lesson.id !== id) });

        try {
            // executes the database deletion
            await deleteLesson(id);
        } catch (error) {
            // restores the previous state if the database operation fails
            set({ lessons: previousLessons });
            console.error('failed to delete lesson:', error);
        }
    },
}));