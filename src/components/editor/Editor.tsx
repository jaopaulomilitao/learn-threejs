'use client';
import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import ImageResize from 'tiptap-extension-resize-image';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link'; // Importando a extensão de Link
import { Dispatch, SetStateAction } from 'react';
import { uploadImage } from '@/features/images/api/storage';
import Iframe from '../../lib/tiptap/extensions/Embed';

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
          class: 'font-bold mb-2',
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: 'border-l-4 border-gray-400 pl-4 italic text-gray-600',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 p-4 rounded-md overflow-auto',
        },
      }),
      HorizontalRule,
      Document,
      Paragraph,
      Text,
      ImageResize,
      Iframe,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({

        openOnClick: true,
        HTMLAttributes: {
          class: 'editor-link',
          target: '_blank', // Abrir links em nova aba
          rel: 'noopener noreferrer',
        },
      }), // Extensão de Link configurada para abrir em uma nova aba
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

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (input.files?.[0]) {
        const file = input.files[0];

        if (file.size > 2 * 1024 * 1024) {
          alert('O tamanho máximo da imagem é 2MB.');
          return;
        }

        try {
          const imageUrl = await uploadImage(file);
          editor.chain().focus().insertContent({
            type: 'image',
            attrs: { src: imageUrl, class: 'resizable-image' },
          }).run();
        } catch (error) {
          console.error('Erro ao fazer upload da imagem:', error);
          alert('Erro ao fazer upload da imagem. Por favor, tente novamente.');
        }
      }
    };
    input.click();
  };

  const handleInsertIframe = () => {
    const fullIframeCode = prompt("Insira o código do iframe completo:");
    if (fullIframeCode) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = fullIframeCode;
      const iframeElement = tempDiv.querySelector('iframe');
      const src = iframeElement ? iframeElement.getAttribute('src') : null;
      const title = iframeElement ? iframeElement.getAttribute('title') : '';

      if (src) {
        editor.chain().focus().insertContent({
          type: 'iframe',
          attrs: {
            src: src,
            title: title,
            height: '400',
            style: 'width: 100%;',
          },
        }).run();
      } else {
        alert("URL do iframe não pôde ser extraída. Por favor, verifique o código do iframe.");
      }
    }
  };

  const handleAddLink = () => {
    const url = prompt('Insira a URL do link:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className='bg-main-white p-4 rounded-sm my-3'>
      <div className="flex space-x-1 mb-4">
        <button
          className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <b>B</b>
        </button>

        <button
          className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <i>I</i>
        </button>

        <button
          className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </button>

        <button
          className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>

        <button
          className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </button>

        <button
          className={`px-2 py-1 rounded ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Cit.
        </button>

        <button
          className={`px-2 py-1 rounded ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''}`}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          Code
        </button>

        <button
          className="px-2 py-1 rounded"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          Linha
        </button>

        <button
          className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          UL
        </button>

        <button
          className={`px-2 py-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          OL
        </button>

        <button
          className="px-2 py-1 rounded"
          onClick={handleImageUpload}
        >
          Img
        </button>

        <button
          className="px-2 py-1 rounded"
          onClick={handleInsertIframe}
        >
          Ifr.
        </button>

        {/* Link */}
        <button
          className="px-2 py-1 rounded"
          onClick={handleAddLink}
        >
          Link
        </button>

        {/* Alinhamento */}
        <button
          className="px-2 py-1 rounded"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          Esq.
        </button>
        <button
          className="px-2 py-1 rounded"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          Cen.
        </button>
        <button
          className="px-2 py-1 rounded"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          Dir.
        </button>
        <button
          className="px-2 py-1 rounded"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          Just.
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
