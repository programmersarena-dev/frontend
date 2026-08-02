import { useState, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicCustomEditor from "../ckeditor/ClassicCustomEditor";
import { LinkIcon, PhotoIcon, PlusIcon } from "@heroicons/react/24/outline";

export function Tabs({ children }) {
  return <div className="flex border-b mb-4">{children}</div>;
}

export function Tab({ active, onClick, children }) {
  return (
    <button
      className={`px-4 py-2 focus:outline-none ${active
        ? "border-b-2 border-blue-500 text-blue-500 font-bold"
        : "text-gray-600 hover:text-blue-500"
        }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Textarea({ text, description, setDescription, activeTab }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("");

  // Helper to insert image element into CKEditor instance safely
  const insertImageIntoEditor = (src) => {
    const editor = editorRef.current;
    if (!editor || !src) return;

    editor.model.change((writer) => {
      const imageElement = writer.createElement("imageBlock", { src });
      editor.model.insertContent(
        imageElement,
        editor.model.document.selection
      );
    });
  };

  // Handle local image file upload (Base64 conversion)
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      insertImageIntoEditor(reader.result);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    };
    reader.readAsDataURL(file);
  };

  // Handle image insertion via external URL
  const handleImageByUrl = (e) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      insertImageIntoEditor(imageUrl.trim());
      setImageUrl("");
    }
  };

  return (
    <div className="mb-6 space-y-2">
      {/* Label */}
      {text && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          {text}
        </label>
      )}

      {/* Toolbar for Quick Image Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5">
        <div className="flex items-center gap-2">
          {/* File Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 active:scale-95"
          >
            <PhotoIcon className="h-4 w-4 text-slate-500" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* URL Input Form */}
        <form onSubmit={handleImageByUrl} className="flex items-center gap-2">
          <div className="relative flex items-center">
            <LinkIcon className="absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Paste image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-48 sm:w-64 rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={!imageUrl.trim()}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 active:scale-95"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* CKEditor Wrapper Container */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
        <CKEditor
          key={activeTab}
          editor={ClassicCustomEditor}
          data={description ?? ""}
          onReady={(editor) => {
            editorRef.current = editor;
          }}
          onChange={(event, editor) => {
            setDescription(editor.getData());
          }}
        />
      </div>
    </div>
  );
}

export function Input({ text, title, setTitle }) {
  return (
    <div className="mb-6">
      <label
        htmlFor="title"
        className="block text-sm font-medium text-gray-700"
      >
        {text}
      </label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
  )
}

export function Button({ text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {text}
    </button>
  )
}
