"use client"

import { useEffect, useRef } from 'react';
import { useLesson } from '@/features/lessons/hooks/useLesson';
import { useLessonStore } from '@/features/lessons/store/useLessonStore';

type LessonViewProps = {
    lessonId: string;
};

const LessonView = ({ lessonId }: LessonViewProps) => {
    const { content, loading } = useLesson(lessonId);
    
    // creates a reference to the wrapper div to scope the dom search
    const viewerRef = useRef<HTMLDivElement>(null);
    
    // connects to the global store to read the clicked topic
    const activeTopic = useLessonStore((state) => state.activeTopic);

    // listens for active topic changes and triggers smooth scrolling
    useEffect(() => {
        // waits until loading finishes and an active topic exists
        if (loading || !activeTopic || !viewerRef.current) return;

        // extracts all headings strictly inside this specific viewer
        const headings = viewerRef.current.querySelectorAll("h1, h2, h3");

        // finds the exact heading that matches the clicked text from the sidebar
        const targetElement = Array.from(headings).find(
            (h) => h.textContent?.trim() === activeTopic
        );

        if (targetElement) {
            // smoothly scrolls the window to position the heading at the top
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [activeTopic, loading, content]);

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <div 
            ref={viewerRef}
            className="w-full max-w-none"
            dangerouslySetInnerHTML={{ __html: content || '' }} 
        />
    );
};

export default LessonView;