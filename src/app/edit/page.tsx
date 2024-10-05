'use client';
import { useEffect, useState } from 'react';
import Editor from "@/components/editor/Editor";
// Remova a importação do ImageUploader
// import ImageUploader from "@/components/image-uploader/ImageUploader";
import useLesson from '@/features/lessons/hooks/useLesson';

const EditPage = () => {
    const lessonId = "lesson1"; // Substitua pelo ID da lição conforme necessário
    const { content, save, loading } = useLesson(lessonId);
    const [editorContent, setEditorContent] = useState<string | null>(null);

    useEffect(() => {
        setEditorContent(content);
    }, [content]);

    const handleSave = async () => {
        if (editorContent) {
            await save(editorContent);
            alert('Lição salva com sucesso!');
        }
    };

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold">Editar Aula</h1>
            <Editor lessonId={lessonId} content={editorContent} onChange={setEditorContent} />
            <button
                className="px-4 py-2 bg-green-500 text-white rounded mt-4"
                onClick={handleSave}
            >
                Salvar
            </button>
        </div>
    );
};

export default EditPage;
