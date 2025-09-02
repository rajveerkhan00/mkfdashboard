"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ImageUpload({ onFileChange, initialImageUrl = null }) {
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl);

  useEffect(() => {
    // Reset preview if parent sends a new initial image (e.g., editing an entity)
    setPreviewUrl(initialImageUrl);
  }, [initialImageUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // local preview
      };
      reader.readAsDataURL(selectedFile);

      // Pass file object to parent so it can upload later
      onFileChange(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    // Pass `null` so parent knows user wants to delete
    onFileChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="w-full p-2 border-2 border-dashed rounded-md h-48 flex items-center justify-center">
        {previewUrl ? (
          <div className="relative w-full h-full">
            <img
              src={previewUrl}
              alt="Preview"
              className="object-contain w-full h-full rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1"
              onClick={handleRemoveImage}
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No image selected</p>
            <Input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Label
              htmlFor="file-upload"
              className="cursor-pointer text-sm text-blue-600 hover:underline"
            >
              Choose an image
            </Label>
          </div>
        )}
      </div>
    </div>
  );
}
