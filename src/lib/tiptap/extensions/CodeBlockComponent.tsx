import { NodeViewContent, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';

export const CodeBlockComponent = ({ node, updateAttributes, editor }: NodeViewProps) => {
  const [isCopied, setIsCopied] = useState(false);

  // copies the code block text content to the user's clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(node.textContent);
    setIsCopied(true);
    
    // resets the copy button state after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <NodeViewWrapper 
      // is added the 'not-prose' class to protect the syntax highlighting from tailwind typography
      className="not-prose relative my-6 rounded-xl overflow-hidden shadow-xl border border-main-black/30"
      style={{ backgroundColor: '#334155', color: '#f8fafc' }} 
    >
      
      <div 
        className="flex items-center justify-between px-6 py-3 border-b border-black/20 text-xs font-bold select-none uppercase tracking-wider"
        style={{ backgroundColor: '#1e293b', color: '#cbd5e1' }}
      >
        {editor.isEditable ? (
            <select
              contentEditable={false}
              className="bg-transparent border-none outline-none cursor-pointer hover:text-white transition-colors p-0 focus:ring-0"
              defaultValue={node.attrs.language || 'javascript'}
              onChange={(event) => updateAttributes({ language: event.target.value })}
            >
              <option value="null">auto</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
              <option value="python">Python</option>
              <option value="glsl">GLSL (Shaders)</option>
              <option value="bash">Terminal (Bash)</option>
            </select>
        ) : (
            <span className="font-semibold text-slate-300">
                {node.attrs.language || 'code'}
            </span>
        )}

        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none"
          title="Copiar código"
        >
          {isCopied ? <FaCheck className="text-main-green" /> : <FaCopy />}
          {isCopied ? 'copiado!' : 'copiar'}
        </button>
      </div>
      
      <pre 
        className="!m-0 overflow-x-auto text-sm leading-loose custom-scrollbar font-mono"
        style={{ backgroundColor: 'transparent' }} 
      >
        {/* is injected the 'hljs' class directly so the highlight.js css rules map correctly */}
        <NodeViewContent as="code" className={`hljs language-${node.attrs.language}`} />
      </pre>

    </NodeViewWrapper>
  );
};