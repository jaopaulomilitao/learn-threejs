"use client"
import useLesson from '@/features/lessons/hooks/useLesson';

type LessonViewProps = {
    lessonId: string;
};

const LessonView = ({ lessonId }: LessonViewProps) => {
    const { content, loading } = useLesson(lessonId);

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <div dangerouslySetInnerHTML={{ __html: content || '' }} />
    );
};

export default LessonView;
