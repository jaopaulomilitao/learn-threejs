'use client';

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
import Iframe from '@/lib/tiptap/extensions/Embed';

// Imports para o CodeBlock funcionar na leitura
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { CodeBlockComponent } from '@/lib/tiptap/extensions/CodeBlockComponent';
// import 'highlight.js/styles/atom-one-dark.css';

const lowlight = createLowlight(common);

interface ViewerProps {
  content: string;
}

const Viewer: React.FC<ViewerProps> = ({ content }) => {
  const editor = useEditor({
    editable: false, // ISSO É O QUE FAZ A MÁGICA DE SER APENAS LEITURA
    extensions: [
      StarterKit.configure({
        codeBlock: false, 
      }),
      ListItem,
      BulletList.configure({ HTMLAttributes: { class: 'list-disc ml-4' } }),
      OrderedList.configure({ HTMLAttributes: { class: 'list-decimal ml-4' } }),
      Heading.configure({ levels: [1, 2, 3], HTMLAttributes: { class: 'font-bold mb-2' } }),
      Blockquote.configure({ HTMLAttributes: { class: 'border-l-4 border-gray-400 pl-4 italic text-gray-600 bg-gray-50 py-2 rounded-r-md' } }),
      
      // O componente customizado é injetado aqui para o leitor também!
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({
        lowlight,
        defaultLanguage: 'javascript',
      }),

      HorizontalRule.configure({ HTMLAttributes: { class: 'border-t-[1px] border-gray-300 my-8' } }),
      Paragraph,
      Text,
      ImageResize,
      Iframe,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'editor-link text-main-blue underline hover:text-blue-800 transition-colors',
          target: '_blank', 
          rel: 'noopener noreferrer',
        },
      }), 
    ],
    content: content,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full prose prose-slate max-w-none focus:outline-none">
      <EditorContent editor={editor} />
    </div>
  );
};

export default Viewer;