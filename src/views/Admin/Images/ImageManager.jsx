import React, { useState } from "react";
import ListImages from "./ListImages";
import CreateImageModal from "./CreateImageModal";
import AdminComponent from "../../../components/Admin/AdminComponent";
import { Button } from "../../../components/ui";

const ImageManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState([]);

  const handleUpload = (uploadedImages) => {
    setImages([...images, ...uploadedImages]);
  };

  const handleDelete = (deletedImage) => {
    setImages([...images.map((image)=>image!==deletedImage)]);
  };

  return (
    <AdminComponent>
      <h1 className="text-2xl font-bold mb-4">Image Manager</h1>
      <Button text="Add Images" onClick={() => setIsModalOpen(true)} />
      <CreateImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
      />
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Uploaded Images</h2>
        <ListImages onDelete={handleDelete} />
      </div>
    </AdminComponent>
  );
};

export default ImageManager;
