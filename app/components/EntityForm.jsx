
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
import ImageUpload from "./ImageUpload"; // Using the new ImageUpload component
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

  // State for image objects (url and public_id)
  const [image, setImage] = useState(
    entityType === "category" ? initialData?.homeImage || null : initialData?.image || null
  );

  const [heroImage, setHeroImage] = useState(initialData?.heroImage || null);

  // State for new image files
  const [imageFile, setImageFile] = useState(null);
  const [heroImageFile, setHeroImageFile] = useState(null);

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
          const res = await fetch("https://custompackboxes.vercel.app/api/category", {
            next: { revalidate: 0 },
          });
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

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      let newImageData = image;
      let newHeroImageData = heroImage;

      if (imageFile) {
        // If there was an old image, delete it
        if (initialData?.image?.public_id) {
          await handleDelete(initialData.image.public_id);
        }
        newImageData = await handleUpload(imageFile); // ✅ changed
      } else if (image === null && initialData?.image?.public_id) {
        // Handle case where image was removed without replacement
        await handleDelete(initialData.image.public_id); // ✅ changed
        newImageData = null;
      }

      // Handle hero image upload for categories
      if (heroImageFile) {
        if (initialData?.heroImage?.public_id) {
          await handleDelete(initialData.heroImage.public_id);
        }
        newHeroImageData = await handleUpload(heroImageFile); // ✅ changed
      } else if (heroImage === null && initialData?.heroImage?.public_id) {
        await handleDelete(initialData.heroImage.public_id); // ✅ changed
        newHeroImageData = null;
      }


      const formData = {
        ...data,
        longDescription,
        ...(entityType === "category"
          ? { homeImage: newImageData, heroImage: newHeroImageData } // ✅ FIX
          : { image: newImageData }), // ✅ Products stay same
        ...(entityType === "products" && { categorySlug }),
      };


      const res = await fetch(
        initialData?._id
          ? `https://custompackboxes.vercel.app/api/${entityType}/${initialData._id}`
          : `https://custompackboxes.vercel.app/api/${entityType}`,
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
        `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} ${initialData?._id ? "Updated" : "Created"
        } Successfully`
      );

      router.push(`/${rePush}`);
      router.refresh(); // To reflect changes immediately
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
          Fill in the details to {initialData?._id ? "update your" : "create a new"}{" "}
          {entityType}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form fields remain the same */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">{entityType.charAt(0).toUpperCase() + entityType.slice(1)} Name</Label>
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
            <Label htmlFor="slug">{entityType.charAt(0).toUpperCase() + entityType.slice(1)} Slug</Label>
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
            <p className="text-sm text-red-500">{errors.shortDescription.message}</p>
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
              <p className="text-sm text-red-500">{errors.categorySlug.message}</p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>
              {entityType === "category" ? "Main Image" : "Product Image"}
            </Label>
            <ImageUpload
              initialImageUrl={
                entityType === "category"
                  ? initialData?.homeImage?.url || image?.url || image
                  : initialData?.image?.url || image?.url || image
              }
              onFileChange={(file) => {
                setImageFile(file);
                if (!file) setImage(null);
              }}
            />

            <p className="text-xs text-muted-foreground">
              Recommended size: 800x600px
            </p>
          </div>

          {entityType === "category" && (
            <div className="space-y-2">
              <Label>Hero Image</Label>
              <ImageUpload
                initialImageUrl={heroImage?.url || heroImage}
                onFileChange={(file) => {
                  setHeroImageFile(file);
                  if (!file) setHeroImage(null);
                }}
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
