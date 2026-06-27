import React, { useState } from "react";
import axiosClient from "@/api/axios";
import { XMarkIcon } from "@heroicons/react/24/outline";

const CreateImageModal = ({ isOpen, onClose, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFiles) {
      setError("Please select images to upload.");
      return;
    }

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => formData.append("images[]", file));

    setIsUploading(true);
    setError(null);

    try {
      const response = await axiosClient.post("/admin/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUpload(response.data.paths);
      setSelectedFiles(null);
    } catch (err) {
      setError("Failed to upload images. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upload Images</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleUpload}>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*"
            className="block w-full mb-4"
          />
          <button
            type="submit"
            disabled={isUploading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default CreateImageModal;
