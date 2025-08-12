"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RichTextEditor, CloudinaryUpload } from ".";

export default function CategoryForm({ category }) {
  const router = useRouter();
  const [homeImage, setHomeImage] = useState(category?.homeImage || "");
  const [heroImage, setHeroImage] = useState(category?.heroImage || "");

  const [isLoading, setIsLoading] = useState(false);
  const [longDescription, setLongDescription] = useState(
    category?.longDescription || ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      heading: category?.heading || "",
      shortDescription: category?.shortDescription || "",
      tagline: category?.tagline || "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    const categoryData = {
      ...data,
      longDescription,
      homeImage,
      heroImage
    };

    try {
      const res = await fetch(
        category
          ? `https://custompackboxes.vercel.app/api/category/${category._id}`
          : "https://custompackboxes.vercel.app/api/category",
        {
          method: category ? "PUT" : "POST",
          next: { revalidate: 0 },
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoryData),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.err || "Failed to save category");
      }

      toast.success(
        category
          ? "Category Updated Successfully"
          : "Category created successfully"
      );

      router.push("/categories");
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>{category ? "Edit Category" : "New Category"}</CardTitle>
          <CardDescription>
            {category
              ? "Update your product category details."
              : "Fill in the details to create a new product category."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                placeholder="Category name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Category Slug</Label>
              <Input
                id="slug"
                placeholder="category-slug"
                {...register("slug", { required: "Slug is required" })}
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="heading">Heading</Label>
            <Input
              id="heading"
              placeholder="Category heading"
              {...register("heading", { required: "Heading is required" })}
            />
            {errors.heading && (
              <p className="text-sm text-red-500">{errors.heading.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              placeholder="Short description of the category"
              {...register("shortDescription", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              placeholder="Category tagline"
              {...register("tagline")}
            />
          </div>

          <div className="space-y-2">
            <Label>Long Description</Label>
            <RichTextEditor
              value={longDescription}
              onChange={setLongDescription}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="homeImage">Main Image</Label>
              {homeImage || category?.homeImage ? (
                <div className="flex items-center gap-2">
                  <img
                    src={homeImage}
                    width={120}
                    height={120}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setHomeImage("")}
                  >
                    Remove
                  </Button>
                </div>
              ) : null}
              <CloudinaryUpload onUploadComplete={(url) => setHomeImage(url)} />
              <p className="text-xs text-muted-foreground">
                Recommended size: 800x600px
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="heroImage">Hero Image</Label>
              {heroImage || category?.heroImage ? (
                <div className="flex items-center gap-2">
                  <img
                    src={heroImage}
                    width={120}
                    height={120}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setHeroImage("")}
                  >
                    Remove
                  </Button>
                </div>
              ) : null}
              <CloudinaryUpload onUploadComplete={(url) => setHeroImage(url)} />
              <p className="text-xs text-muted-foreground">
                Recommended size: 1920x1080px
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/categories")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : category
              ? "Update Category"
              : "Create Category"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
