'use client';
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { Bold, List } from "lucide-react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
};

export function RichTextEditor({
  value,
  onChange,
  onBlur,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);


  if (!editor) {
    return (
      <div className="border rounded-md p-2">
        <div className="h-32 min-h-30 bg-white" />
      </div>
    );
  }


  return (
    <div className="border rounded-md overflow-hidden bg-white">
      {/* toolbar fixa dentro da área do editor */}
      <div className="flex items-center gap-2 px-2 py-1 border-b bg-muted">
        <Button
          type="button"
          size="icon"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={16} />
        </Button>

        <Button
          type="button"
          size="icon"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={16} />
        </Button>
      </div>

      {/* editor content com altura responsiva */}
      <EditorContent
        editor={editor}
        onBlur={onBlur}
        className="
          p-3
          min-h-[120px]
          max-h-[240px]
          overflow-y-auto
          prose prose-sm max-w-none
          outline-none
        "
      />
    </div>

  );
}
