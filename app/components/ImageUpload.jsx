"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea

export default function ImageUpload({ onImageChange, initialImage = null }) {
  const [image, setImage] = useState(initialImage);
  const [previewUrl, setPreviewUrl] = useState(initialImage?.url || null);

  useEffect(() => {
    setImage(initialImage);
    setPreviewUrl(initialImage?.url || null);
  }, [initialImage]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);

      const newImage = {
        ...image,
        file: selectedFile,
        url: URL.createObjectURL(selectedFile), // for local preview
      };
      setImage(newImage);
      onImageChange(newImage);
    }
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    const newImage = { ...image, [name]: value };
    setImage(newImage);
    onImageChange(newImage);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setImage(null);
    onImageChange(null);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="w-full p-2 border-2 border-dashed rounded-md h-48 flex items-center justify-center">
        {previewUrl ? (
          <div className="relative w-full h-full">
            <img
              src={previewUrl}
              alt={image?.alt || "Preview"}
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

      {previewUrl && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alt">Alt Text</Label>
            <Input
              id="alt"
              name="alt"
              placeholder="e.g., A white box with a blue logo"
              value={image?.alt || ""}
              onChange={handleMetadataChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Custom Product Box"
              value={image?.title || ""}
              onChange={handleMetadataChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              name="caption"
              placeholder="A short caption for the image"
              value={image?.caption || ""}
              onChange={handleMetadataChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="A longer description of the image"
              value={image?.description || ""}
              onChange={handleMetadataChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}