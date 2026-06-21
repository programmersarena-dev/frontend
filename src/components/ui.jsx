import { useState, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicCustomEditor from "../ckeditor/ClassicCustomEditor";

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
  const [imageUrl, setImageUrl] = useState("");

  const insertImageIntoEditor = (src) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.model.change((writer) => {
      const imageElement = writer.createElement("imageBlock", { src });
      editor.model.insertContent(
        imageElement,
        editor.model.document.selection
      );
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => insertImageIntoEditor(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImageByUrl = () => {
    if (imageUrl.trim()) {
      insertImageIntoEditor(imageUrl);
      setImageUrl("");
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700">
        {text}
      </label>

      <div className="flex items-center gap-4 mt-2">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <input
          type="text"
          placeholder="Paste image URL..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button onClick={handleImageByUrl}>Add Image</button>
      </div>

      <div
        style={{
          position: "relative",
          transform: "none",
          filter: "none",
          contain: "none",
          overflow: "visible",
        }}
      >
        <CKEditor
          key={activeTab}
          editor={ClassicCustomEditor}
          data={description ?? ""}
          onReady={(editor) => (editorRef.current = editor)}
          onChange={(event, editor) => setDescription(editor.getData())}
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
