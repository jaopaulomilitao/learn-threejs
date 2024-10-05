'use client';
import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block'; // Alterado para CodeBlock
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { Dispatch, SetStateAction } from 'react';

interface EditorProps {
    lessonId: string;
    content: string | null;
    onChange: Dispatch<SetStateAction<string | null>>;
}

const Editor: React.FC<EditorProps> = ({ lessonId, content, onChange }) => {
    console.log(lessonId);
    const editor = useEditor({
        extensions: [
            StarterKit,
            ListItem,
            BulletList.configure({
                HTMLAttributes: {
                    class: 'list-disc ml-4',
                },
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: 'list-decimal ml-4',
                },
            }),
            Heading.configure({
                levels: [1, 2, 3],
                HTMLAttributes: {
                    class: 'font-bold mb-2', // Ajustes de estilo
                },
            }),
            Blockquote.configure({
                HTMLAttributes: {
                    class: 'border-l-4 border-gray-400 pl-4 italic text-gray-600',
                },
            }),
            CodeBlock.configure({ // Simplificação para CodeBlock
                HTMLAttributes: {
                    class: 'bg-gray-100 p-4 rounded-md overflow-auto',
                },
            }),
            HorizontalRule,
            Document,
            Paragraph,
            Text,
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            const updatedContent = editor.getHTML();
            onChange(updatedContent);
        },
    });

    useEffect(() => {
        if (editor?.isEmpty) {
            if (editor && content) {
                editor.commands.setContent(content, false, { preserveWhitespace: 'full' });
            }
        }
    }, [editor, content]);

    if (!editor) {
        return null;
    }

    return (
        <div className='bg-main-white p-4 rounded-sm my-3'>
            <div className="flex space-x-2 mb-4">
                <button
                    className={`px-4 py-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <b>B</b>
                </button>

                <button
                    className={`px-4 py-2 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <i>I</i>
                </button>

                <button
                    className={`px-4 py-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    H1
                </button>

                <button
                    className={`px-4 py-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    H2
                </button>

                <button
                    className={`px-4 py-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    H3
                </button>

                <button
                    className={`px-4 py-2 rounded ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    Citação
                </button>

                <button
                    className={`px-4 py-2 rounded ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''}`}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                    Bloco de Código
                </button>

                <button
                    className="px-4 py-2 rounded"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                    Linha
                </button>

                <button
                    className={`px-4 py-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    Lista Não Ordenada
                </button>

                <button
                    className={`px-4 py-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    Lista Ordenada
                </button>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
};

export default Editor;
