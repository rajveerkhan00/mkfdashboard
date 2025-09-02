import cloudinary from "@/lib/cloudinary";

export async function DELETE(req) {
  try {
    const { public_id } = await req.json();

    if (!public_id) {
      return Response.json({ error: "Missing public_id" }, { status: 400 });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "image",
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
