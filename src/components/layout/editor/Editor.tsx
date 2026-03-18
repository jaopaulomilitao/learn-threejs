'use client';
import { useEffect, Dispatch, SetStateAction } from 'react';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import ImageResize from 'tiptap-extension-resize-image';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link'; 
import { uploadImage } from '@/features/images/api/storage';
import Iframe from '@/lib/tiptap/extensions/Embed';
import { FaBold, FaItalic, FaQuoteLeft, FaCode, FaListUl, FaListOl, FaImage, FaLink, FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify } from 'react-icons/fa'; 
import ExtensionButton from '@/components/ui/extension-button/ExtensionButton'; 
import { AiOutlineCodepen } from 'react-icons/ai';
import { TbH1, TbH2, TbH3 } from 'react-icons/tb';

// new imports for syntax highlighting
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { CodeBlockComponent } from '@/lib/tiptap/extensions/CodeBlockComponent';
// import 'highlight.js/styles/atom-one-dark.css'; // injects the atom one dark theme

// initializes lowlight with common programming languages
const lowlight = createLowlight(common);

interface EditorProps {
  content: string | null;
  onChange: Dispatch<SetStateAction<string | null>>;
}

const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // disables the default code block to prevent conflicts with the lowlight extension
        codeBlock: false, 
      }),
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
          class: 'border-l-4 border-gray-400 pl-4 italic text-gray-600 bg-gray-50 py-2 rounded-r-md',
        },
      }),
      
      // injects the custom code block node view
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({
        lowlight,
        defaultLanguage: 'javascript',
      }),

      HorizontalRule.configure({
        HTMLAttributes: {
          class: 'border-t-[1px] border-gray-300 my-8',
        },
      }),
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
          class: 'editor-link text-main-blue underline hover:text-blue-800 transition-colors',
          target: '_blank', 
          rel: 'noopener noreferrer',
        },
      }), 
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML();
      onChange(updatedContent);
    },
  });

  // syncs external content changes with the editor instance
  useEffect(() => {
    if (editor && content !== null && content !== editor.getHTML()) {
      editor.commands.setContent(content, false, { preserveWhitespace: 'full' });
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  // handles the local file selection and upload to firebase storage
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
            attrs: { src: imageUrl, class: 'resizable-image rounded-lg shadow-sm my-4' },
          }).run();
        } catch (error) {
          console.error('Erro ao fazer upload da imagem:', error);
          alert('Erro ao fazer upload da imagem. Por favor, tente novamente.');
        }
      }
    };
    input.click();
  };

  // requests the iframe tag and extracts src to embed external content
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
            style: 'width: 100%; border-radius: 0.5rem; margin: 1rem 0;',
          },
        }).run();
      } else {
        alert("URL do iframe não pôde ser extraída. Por favor, verifique o código do iframe.");
      }
    }
  };

  // applies a hyperlink to the currently selected text
  const handleAddLink = () => {
    const url = prompt('Insira a URL do link:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className='bg-white p-2 md:p-6 my-3 shadow-sm border border-slate-200 rounded-2xl flex flex-col gap-6'>
      <div className="flex flex-wrap gap-2 p-2 bg-slate-100 rounded-xl w-full sticky top-4 z-40 border border-slate-200">
        
        <ExtensionButton icon={FaBold} isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
        <ExtensionButton icon={FaItalic} isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
        
        <div className="w-[1px] bg-slate-300 mx-1 self-stretch" /> 
        
        <ExtensionButton icon={TbH1} isActive={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} size={20} />
        <ExtensionButton icon={TbH2} isActive={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} size={20} />
        <ExtensionButton icon={TbH3} isActive={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} size={20} />

        <div className="w-[1px] bg-slate-300 mx-1 self-stretch" /> 

        <ExtensionButton icon={FaQuoteLeft} isActive={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <ExtensionButton icon={FaCode} isActive={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
        <ExtensionButton icon={FaListUl} isActive={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <ExtensionButton icon={FaListOl} isActive={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />

        <div className="w-[1px] bg-slate-300 mx-1 self-stretch" /> 

        <ExtensionButton icon={FaImage} isActive={false} onClick={handleImageUpload} />
        <ExtensionButton icon={AiOutlineCodepen} isActive={false} onClick={handleInsertIframe} />
        <ExtensionButton icon={FaLink} isActive={editor.isActive('link')} onClick={handleAddLink} />
        
        <div className="w-[1px] bg-slate-300 mx-1 self-stretch" /> 

        <ExtensionButton icon={FaAlignLeft} isActive={editor.isActive('align', { align: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} />
        <ExtensionButton icon={FaAlignCenter} isActive={editor.isActive('align', { align: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} />
        <ExtensionButton icon={FaAlignRight} isActive={editor.isActive('align', { align: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} />
        <ExtensionButton icon={FaAlignJustify} isActive={editor.isActive('align', { align: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()} />
      </div>

      <div className="w-full min-h-[300px] prose prose-slate max-w-none focus:outline-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;