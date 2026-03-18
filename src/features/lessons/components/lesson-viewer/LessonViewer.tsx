"use client"

import { useEffect, useRef } from 'react';
import { useLesson } from '@/features/lessons/hooks/useLesson';
import { useLessonStore } from '@/features/lessons/store/useLessonStore';
// é importado o componente viewer para renderização segura e rica do tiptap
import Viewer from '@/components/layout/editor/Viewer';

type LessonViewProps = {
    lessonId: string;
};

const LessonView = ({ lessonId }: LessonViewProps) => {
    const { content, loading } = useLesson(lessonId);
    
    // is created a reference to the wrapper div to scope the dom search
    const viewerRef = useRef<HTMLDivElement>(null);
    
    // is connected to the global store to read the clicked topic
    const activeTopic = useLessonStore((state) => state.activeTopic);

    // listens for active topic changes and triggers smooth scrolling
    useEffect(() => {
        // is waited until loading finishes and an active topic exists
        if (loading || !activeTopic || !viewerRef.current) return;

        // are extracted all headings strictly inside this specific viewer
        const headings = viewerRef.current.querySelectorAll("h1, h2, h3");

        // is found the exact heading that matches the clicked text from the sidebar
        const targetElement = Array.from(headings).find(
            (h) => h.textContent?.trim() === activeTopic
        );

        if (targetElement) {
            // is smoothly scrolled the window to position the heading at the top
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
        >
            {/* is rendered the tiptap content securely with interactive code blocks */}
            <Viewer content={content || ''} />
        </div>
    );
};

export default LessonView;