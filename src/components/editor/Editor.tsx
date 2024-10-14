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
import { FaBold, FaItalic, FaQuoteLeft, FaCode, FaListUl, FaListOl, FaImage, FaLink, FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify } from 'react-icons/fa'; // Ícones do react-icons
import ExtensionButton from '../extension-button/ExtensionButton';
import { AiOutlineCodepen } from 'react-icons/ai';
import { TbH1, TbH2, TbH3 } from 'react-icons/tb';

interface EditorProps {

  content: string | null;
  onChange: Dispatch<SetStateAction<string | null>>;
}

const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
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

  // Sincronizar o conteúdo do editor sempre que `content` mudar
  useEffect(() => {
    if (editor && content !== null && content !== editor.getHTML()) {
      editor.commands.setContent(content, false, { preserveWhitespace: 'full' });
    }
  }, [content, editor]);

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
    <div className='bg-white p-6 my-3 shadow-lg rounded-lg flex flex-col gap-7'>
      {/* Div sticky centralizada e responsiva */}
      <div className="flex flex-wrap gap-3 p-3 bg-[#E2E4E7] rounded-md w-auto max-w-full sticky top-5 z-50 mt-2 shadow-md mx-auto">
        {/* Botão para negrito */}
        <ExtensionButton
          icon={FaBold}
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />

        {/* Botão para itálico */}
        <ExtensionButton
          icon={FaItalic}
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        {/* Botão para título H1 */}
        <ExtensionButton
          icon={TbH1}
          isActive={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          size={30}
        />

        {/* Botão para título H2 */}
        <ExtensionButton
          icon={TbH2}
          isActive={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          size={30}
        />

        {/* Botão para título H3 */}
        <ExtensionButton
          icon={TbH3}
          isActive={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          size={30}
        />

        {/* Linha vertical */}
        <div className="border-[1.5px] border-main-black/50 h-auto mx-2" /> {/* Linha vertical */}


        {/* Botão para citação */}
        <ExtensionButton
          icon={FaQuoteLeft}
          isActive={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />

        {/* Botão para código */}
        <ExtensionButton
          icon={FaCode}
          isActive={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        />

        {/* Botão para linha horizontal */}
        <ExtensionButton
          icon={FaListUl}
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />

        {/* Botão para lista ordenada */}
        <ExtensionButton
          icon={FaListOl}
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />

        {/* Botão para imagem */}
        <ExtensionButton
          icon={FaImage}
          isActive={false} // Não há um estado ativo para imagem, mas pode ser usado para abrir o uploader
          onClick={handleImageUpload} // Substitua pela função de upload de imagem
        />

        {/* Botão para imagem */}
        <ExtensionButton
          icon={AiOutlineCodepen}
          isActive={false} // Não há um estado ativo para imagem, mas pode ser usado para abrir o uploader
          onClick={handleInsertIframe} // Substitua pela função de upload de imagem
        />

        {/* Botão para link */}
        <ExtensionButton
          icon={FaLink}
          isActive={false} // Não há um estado ativo para link, mas pode ser usado para abrir o modal de link
          onClick={handleAddLink} // Substitua pela função para adicionar link
        />
        {/* Linha vertical */}
        <div className="border-[1.5px] border-main-black/50 h-auto mx-2" /> {/* Linha vertical */}

        {/* Botões de alinhamento */}
        <ExtensionButton
          icon={FaAlignLeft}
          isActive={editor.isActive('align', { align: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        />
        <ExtensionButton
          icon={FaAlignCenter}
          isActive={editor.isActive('align', { align: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        />
        <ExtensionButton
          icon={FaAlignRight}
          isActive={editor.isActive('align', { align: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        />
        <ExtensionButton
          icon={FaAlignJustify}
          isActive={editor.isActive('align', { align: 'justify' })}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        />
      </div>

      <div className="w-full max-w-full min-h-[300px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;
