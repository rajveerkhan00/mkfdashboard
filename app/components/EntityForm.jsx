
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RichTextEditor } from ".";
import ImageUpload from "./ImageUpload";
import { handleDelete, handleUpload } from ".";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EntityForm({
  entityType = "category",
  rePush = "categories",
  initialData = {},
}) {
  const router = useRouter();

  const [image, setImage] = useState(
    entityType === "category"
      ? initialData?.homeImage || null
      : initialData?.image || null
  );
  const [heroImage, setHeroImage] = useState(initialData?.heroImage || null);

  const [longDescription, setLongDescription] = useState(
    initialData?.longDescription || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categorySlug, setCategorySlug] = useState(
    initialData?.categorySlug || ""
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      heading: initialData?.heading || "",
      shortDescription: initialData?.shortDescription || "",
      tagline: initialData?.tagline || "",
      categorySlug: initialData?.categorySlug || "",
    },
  });

  useEffect(() => {
    if (entityType === "products") {
      const fetchCategories = async () => {
        try {
          const res = await fetch(
            "https://custompackboxes.com/api/category",
            {
              next: { revalidate: 0 },
            }
          );
          if (res.ok) {
            const data = await res.json();
            setCategories(data);
          } else {
            toast.error("Failed to fetch categories");
          }
        } catch (err) {
          toast.error("Error fetching categories");
        }
      };
      fetchCategories();
    }
  }, [entityType]);

  const processImage = async (
    imageObject,
    initialImageObject
  ) => {
    if (!imageObject) {
      // Image was removed
      if (initialImageObject?.public_id) {
        await handleDelete(initialImageObject.public_id);
      }
      return null;
    }

    if (imageObject.file) {
      // New file to upload
      if (initialImageObject?.public_id) {
        await handleDelete(initialImageObject.public_id);
      }
      const uploadResult = await handleUpload(imageObject.file);
      return {
        ...imageObject,
        url: uploadResult.url,
        public_id: uploadResult.public_id,
        file: undefined, // No need to store the file object in DB
      };
    }

    // No changes to the file, just return the metadata
    return imageObject;
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const newImageData = await processImage(
        image,
        entityType === "category"
          ? initialData?.homeImage
          : initialData?.image
      );
      let newHeroImageData = heroImage;
      if (entityType === "category") {
        newHeroImageData = await processImage(
          heroImage,
          initialData?.heroImage
        );
      }

      const formData = {
        ...data,
        longDescription,
        ...(entityType === "category"
          ? { homeImage: newImageData, heroImage: newHeroImageData }
          : { image: newImageData }),
        ...(entityType === "products" && { categorySlug }),
      };

      const res = await fetch(
        initialData?._id
          ? `https://custompackboxes.com/api/${entityType}/${initialData._id}`
          : `https://custompackboxes.com/api/${entityType}`,
        {
          method: initialData?._id ? "PUT" : "POST",
          next: { revalidate: 0 },
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.err || `Failed to save ${entityType}`);
      }

      toast.success(
        `${
          entityType.charAt(0).toUpperCase() + entityType.slice(1)
        } ${initialData?._id ? "Updated" : "Created"} Successfully`
      );

      router.push(`/${rePush}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData?._id ? `Edit` : `New`} {entityType}
        </CardTitle>
        <CardDescription>
          Fill in the details to{" "}
          {initialData?._id ? "update your" : "create a new"} {entityType}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">
              {entityType.charAt(0).toUpperCase() + entityType.slice(1)} Name
            </Label>
            <Input
              id="name"
              placeholder={`${entityType} name`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">
              {entityType.charAt(0).toUpperCase() + entityType.slice(1)} Slug
            </Label>
            <Input
              id="slug"
              placeholder={`${entityType}-slug`}
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
            placeholder={`${entityType} heading`}
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
            placeholder={`Short description of the ${entityType}`}
            {...register("shortDescription", {
              required: "Description is required",
            })}
          />
          {errors.shortDescription && (
            <p className="text-sm text-red-500">
              {errors.shortDescription.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            placeholder={`${entityType} tagline`}
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

        {entityType === "products" && (
          <div className="space-y-2">
            <Label htmlFor="categorySlug">Category</Label>
            <Select
              value={categorySlug}
              onValueChange={(value) => {
                setCategorySlug(value);
                setValue("categorySlug", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categorySlug && (
              <p className="text-sm text-red-500">
                {errors.categorySlug.message}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>
              {entityType === "category" ? "Main Image" : "Product Image"}
            </Label>
            <ImageUpload
              initialImage={
                entityType === "category"
                  ? initialData?.homeImage
                  : initialData?.image
              }
              onImageChange={setImage}
            />
            <p className="text-xs text-muted-foreground">
              Recommended size: 800x600px
            </p>
          </div>

          {entityType === "category" && (
            <div className="space-y-2">
              <Label>Hero Image</Label>
              <ImageUpload
                initialImage={initialData?.heroImage}
                onImageChange={setHeroImage}
              />
              <p className="text-xs text-muted-foreground">
                Recommended size: 1920x1080px
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${rePush}`)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : `Save ${entityType}`}
        </Button>
      </CardFooter>
    </Card>
  );
}
