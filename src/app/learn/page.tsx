import LessonView from "@/components/lesson-viewer/LessonViewer";

const LearnPage = () => {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold">Aula</h1>
            <LessonView lessonId="lesson1" />
        </div>
    );
};

export default LearnPage;
