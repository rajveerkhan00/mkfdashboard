"use client";
import { useState } from "react";

export default function CloudinaryUpload({ onUploadComplete }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const cloudName = "dfnjpfucl";
  const uploadPreset = "ml_default";

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        setImageUrl(data.secure_url);
        if (onUploadComplete) {
          onUploadComplete(data.secure_url);
        }
      } else {
        setError("Upload failed.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setImageUrl(null);
    if (onUploadComplete) {
      onUploadComplete(null); // Notify parent that image was removed
    }
  };

  return (
    <div className="space-y-4">
      {!imageUrl && (
        <input type="file" onChange={handleUpload} accept="image/*" />
      )}

      {isUploading && <p>Uploading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {imageUrl && (
        <div>
          <p className="text-green-600">Upload successful!</p>
          <button
            onClick={handleRemove}
            className="mt-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Remove Image
          </button>
        </div>
      )}
    </div>
  );
}
