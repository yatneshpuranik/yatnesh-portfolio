import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, Italic, List, ListOrdered, Quote, Code, 
  RotateCcw, RotateCw, Heading1, Heading2 
} from 'lucide-react';

const Editor = ({ value, onChange, placeholder = 'Write description...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync value from props if it changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const menuButtonClass = (active) => `
    p-1.5 rounded transition-colors
    ${active 
      ? 'bg-purple-600 text-white' 
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-150 dark:hover:bg-gray-800'
    }
  `;

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden focus-within:border-purple-500">
      
      {/* Menu Bar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-[#0b0f19] border-b border-gray-200 dark:border-gray-800">
        
        {/* Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={menuButtonClass(editor.isActive('bold'))}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={menuButtonClass(editor.isActive('italic'))}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={menuButtonClass(editor.isActive('heading', { level: 1 }))}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={menuButtonClass(editor.isActive('heading', { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={menuButtonClass(editor.isActive('bulletList'))}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={menuButtonClass(editor.isActive('orderedList'))}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        {/* Quote & Code */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={menuButtonClass(editor.isActive('blockquote'))}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={menuButtonClass(editor.isActive('codeBlock'))}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>

        {/* History */}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
            title="Redo"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Editor Content Area */}
      <div className="p-4 bg-white dark:bg-dark-bg/25">
        <EditorContent editor={editor} />
      </div>

    </div>
  );
};

export default Editor;
