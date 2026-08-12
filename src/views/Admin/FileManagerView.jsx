import React, { useState, useEffect } from 'react';
import {
  FolderIcon,
  DocumentIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  ClipboardDocumentIcon,
  FolderPlusIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import axiosClient from '@/api/axios';

export default function FileManagerView() {
  const [files, setFiles] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentDirectory, setCurrentDirectory] = useState('');

  const fetchFiles = async (dirPath = '') => {
    setLoading(true);
    try {
      // Pass the directory as a query parameter
      const res = await axiosClient.get(`/admin/files?directory=${dirPath}`);
      setFiles(res.data.files || []);
      setDirectories(res.data.directories || []);
      setCurrentDirectory(dirPath);
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFiles(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', currentDirectory);

    setIsUploading(true);
    try {
      await axiosClient.post('/admin/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchFiles();
    } catch (err) {
      alert("Failed to upload file.");
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleDelete = async (path) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axiosClient.delete(`/admin/files/delete`, { data: { path } });
      fetchFiles();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleCreateFolder = async () => {
    const folderName = window.prompt("Enter new folder name:");

    if (!folderName || folderName.trim() === "") return;

    try {
      await axiosClient.post('/admin/files/create-directory', {
        name: folderName,
        path: currentDirectory // The folder we are currently viewing
      });

      // Refresh the list to show the new folder
      fetchFiles(currentDirectory);
    } catch (err) {
      console.error("Error creating folder:", err);
      alert(err.response?.data?.error || "Failed to create folder");
    }
  };

  const handleGoBack = () => {
    if (currentDirectory === '' || currentDirectory === 'app') return;

    const pathParts = currentDirectory.split('/');
    pathParts.pop(); // Remove the current folder name
    const parentPath = pathParts.join('/');

    // If we were in a subfolder of root, parentPath might become empty
    // We want to ensure we at least go back to the base directory
    fetchFiles(parentPath || '');
  };

  const copyToClipboard = (path) => {
    // 1. Get the base URL from Vite env
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    // 2. Remove 'public/' prefix if Laravel returns it (depends on your disk config)
    const cleanPath = path.replace(/^public\//, '');

    // 3. Construct the full URL
    const url = `${baseUrl}/storage/${cleanPath}`;

    navigator.clipboard.writeText(url);

    // Optional: replace alert with a toast notification if you have one
    alert("Link copied to clipboard!");
  };

  return (
    <>
      <div className="max-w-8xl mx-auto p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">File Manager</h2>
            <p className="text-sm text-gray-500">Managing: <span className="font-mono text-indigo-600">{currentDirectory}</span></p>
          </div>
          <div className="flex items-center gap-3">
            {/* Back Button - Only show if not at root */}
            {currentDirectory !== '' && (
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                title="Go to parent folder"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Back</span>
              </button>
            )}

            {/* New Folder Button */}
            <button
              onClick={handleCreateFolder}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <FolderPlusIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">New Folder</span>
            </button>

            {/* Existing Upload Button */}
            <label className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition cursor-pointer ${isUploading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}>
              <ArrowUpTrayIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Upload</span>
              <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar / Navigation */}
          <aside className="col-span-3 border-r border-gray-100 pr-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-4">Navigation</h3>
            <ul className="space-y-1">
              {/* Root Button */}
              <li
                onClick={() => fetchFiles('')}
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm ${currentDirectory === '' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <FolderIcon className="w-5 h-5" /> root
              </li>

              {/* List of Sub-directories in the CURRENT folder */}
              {directories.map((dir) => (
                <div
                  key={dir}
                  onDoubleClick={() => fetchFiles(dir)} // Double click to enter
                  className="group relative flex flex-col items-center p-4 border border-gray-100 rounded-xl hover:border-yellow-200 hover:bg-yellow-50/30 transition cursor-pointer"
                >
                  <FolderIcon className="w-12 h-12 text-yellow-400 mb-2" />
                  <span className="text-xs text-gray-600 text-center truncate w-full px-2">
                    {dir.split('/').pop()}
                  </span>
                </div>
              ))}
            </ul>
          </aside>

          {/* Main Grid */}
          <main className="col-span-9">
            {loading ? (
              <div className="flex justify-center py-20 text-gray-400 animate-pulse">Loading assets...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {files.map((file) => (
                  <div key={file} className="group relative flex flex-col items-center p-4 border border-gray-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition">
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => copyToClipboard(file)} className="p-1 text-gray-500 hover:bg-white border rounded shadow-sm" title="Copy URL">
                        <ClipboardDocumentIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(file)} className="p-1 text-red-500 hover:bg-red-50 border rounded shadow-sm" title="Delete">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <DocumentIcon className="w-12 h-12 text-gray-400 mb-2 group-hover:text-indigo-400 transition" />
                    <span className="text-[10px] text-gray-500 text-center break-all line-clamp-2 w-full px-1">
                      {file.split('/').pop()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
