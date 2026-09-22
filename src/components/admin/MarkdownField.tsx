"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import { Markdown, type MarkdownStorage } from "tiptap-markdown";
import { Bold, Italic, Heading2, ImagePlus, List, Link2, Loader2 } from "lucide-react";
import { uploadFile } from "@/lib/supabase/storage";

interface MarkdownFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

function ToolbarButton({
  icon: Icon,
  label,
  active,
  onClick,
  disabled = false,
  spin = false,
}: {
  icon: typeof Bold;
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  spin?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`rounded p-1.5 transition hover:bg-gray-200 hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-50 ${
        active ? "bg-gray-200 text-ink-900" : "text-gray-500"
      }`}
    >
      <Icon className={`h-3.5 w-3.5 ${spin ? "animate-spin" : ""}`} strokeWidth={2} />
    </button>
  );
}

function Toolbar({
  editor,
  onInsertImageClick,
  uploadingImage,
}: {
  editor: Editor;
  onInsertImageClick: () => void;
  uploadingImage: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1">
      <ToolbarButton
        icon={Bold}
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon={Italic}
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        icon={Heading2}
        label="Heading"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        icon={List}
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        icon={Link2}
        label="Link"
        active={editor.isActive("link")}
        onClick={() => {
          if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
            return;
          }
          const url = window.prompt("Link URL");
          if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }}
      />
      <span className="mx-1 h-4 w-px bg-gray-200" />
      <ToolbarButton
        icon={uploadingImage ? Loader2 : ImagePlus}
        label="Insert image"
        active={false}
        onClick={onInsertImageClick}
        disabled={uploadingImage}
        spin={uploadingImage}
      />
    </div>
  );
}

export default function MarkdownField({ label, value, onChange, rows = 6 }: MarkdownFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      TiptapImage.configure({ inline: false }),
      Markdown,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const markdownStorage = editor.storage as unknown as { markdown: MarkdownStorage };
      onChange(markdownStorage.markdown.getMarkdown());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-neutral max-w-none px-3 py-2.5 focus:outline-none prose-headings:font-display prose-headings:text-ink-900 prose-a:text-gold-600 prose-p:leading-relaxed prose-p:text-gray-600 prose-img:rounded-lg",
        style: `min-height: ${rows * 1.5}rem`,
      },
    },
  });

  async function handleImageFile(files: FileList | null) {
    if (!files || files.length === 0 || !editor) return;
    setUploadError(null);
    setUploadingImage(true);
    try {
      // One at a time (not Promise.all), same reasoning as ImageListField —
      // avoids firing a burst of concurrent uploads on a slow connection.
      for (const file of Array.from(files)) {
        const url = await uploadFile("images", file);
        editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  }

  return (
    <div>
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      <div className="mt-1 overflow-hidden rounded-lg border border-gray-200 focus-within:border-gold-500">
        {editor && (
          <Toolbar
            editor={editor}
            uploadingImage={uploadingImage}
            onInsertImageClick={() => fileInputRef.current?.click()}
          />
        )}
        <EditorContent editor={editor} />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleImageFile(e.target.files);
          e.target.value = "";
        }}
      />
      {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
      <p className="mt-1 text-[11px] text-gray-400">
        Select text and use the toolbar to format — bold, italic, headings, links, lists. Place your
        cursor between paragraphs and click the image icon to drop a photo in at that point.
      </p>
    </div>
  );
}
