'use client';
import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Dispatch, SetStateAction } from 'react';

interface EditorProps {
    lessonId: string;
    content: string | null; // Adicione esta propriedade
    onChange: Dispatch<SetStateAction<string | null>>; // Prop para lidar com alterações
}

const Editor: React.FC<EditorProps> = ({ lessonId, content, onChange }) => {
    console.log(lessonId)
    const editor = useEditor({
        extensions: [StarterKit],
        content: content || '', // O conteúdo inicial
        onUpdate: ({ editor }) => {
            const updatedContent = editor.getHTML();
            onChange(updatedContent); // Atualiza o conteúdo no estado pai
        },
    });

    useEffect(() => {
        if (editor && content) {
            editor.commands.setContent(content, false, { preserveWhitespace: "full" }); // Atualiza o conteúdo do editor quando a prop content muda
        }
    }, [editor, content]);

    return (
        <div className='bg-main-white p-4 rounded-sm my-3'>
            <EditorContent editor={editor} />
        </div>
    );
};

export default Editor;
