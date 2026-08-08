import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import { useToast } from "@/contexts/ToastContext";

const ListImages = ({ onDelete }) => {
  const { addToast } = useToast();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredImage, setHoveredImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axiosClient.get("/admin/images/");
        setImages(response.data.images);
      } catch (err) {
        console.error("Failed to fetch images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleDelete = async (imagePath) => {
    if (window.confirm("Do you really want to delete an image?")) {
      try {
        await axiosClient.delete("/admin/images/delete", {
          data: { path: imagePath },
        });
        onDelete(imagePath);
        setImages(images.filter((img) => img !== imagePath));
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }
  };

  const handleCopyUrl = (imagePath) => {
    const fullUrl = `${import.meta.env.VITE_API_BASE_URL}${imagePath}`;
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => addToast("Image URL copied to clipboard!"))
      .catch(() => addToast("Failed to copy URL."));
  };

  if (loading) return <p>Loading images...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Image List</h2>
      {images.length === 0 ? (
        <p>No images available.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setHoveredImage(image)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${image}`}
                alt={`Uploaded ${index}`}
                className="w-full h-52 object-cover rounded border"
              />

              {hoveredImage === image && (
                <button
                  onClick={() => handleCopyUrl(image)}
                  className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-sm rounded hover:bg-blue-600"
                >
                  Copy URL
                </button>
              )}

              <button
                onClick={() => handleDelete(image)}
                className="mt-2 w-full bg-red-500 text-white py-1 text-sm rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListImages;
