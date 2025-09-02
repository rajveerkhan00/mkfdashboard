export async function handleUpload(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Upload failed");
  }

  // ✅ return only what your schema expects
  return {
    url: data.secure_url,
    public_id: data.public_id,
  };
}

export async function handleDelete(publicId) {
  if (!publicId) {
    console.warn("No public_id provided, skipping Cloudinary deletion.");
    return;
  }

  const res = await fetch("/api/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_id: publicId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to delete from Cloudinary");
  }

  return data;
}

