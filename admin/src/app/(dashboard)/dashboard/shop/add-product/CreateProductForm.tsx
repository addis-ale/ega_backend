"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProductFormValues, createProductSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "@/lib/mutations/createProduct";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

const CreateProductForm = () => {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;
  const maxFiles = 6;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
    maxSize,
    multiple: true,
    maxFiles,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const productForm = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      productName: "",
      productDesc: "",
      productCategory: "BOARD",
      productDiscountPercentage: 0,
      productRentalPrice: 0,
      productSellingPrice: 0,
      productType: "BOTH",
      ProductImg: [],
    },
  });

  const { watch } = productForm;
  const selectedType = watch("productType");
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const { mutate, isPending: isMutating } = useMutation({
    mutationFn: createProduct,
    onSuccess: async (data) => {
      console.log(data);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      productForm.reset();
      files.forEach((file) => removeFile(file.id));
    },
    onError: (error: unknown) => {
      console.error(error);
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Failed to create product.");
      }
    },
  });

  const onSubmit = async (values: CreateProductFormValues) => {
    const token = await getToken();
    mutate({ values, token });
  };

  const handleUploadThenSubmit = async () => {
    try {
      setErrorMsg(null);
      setIsUploading(true);

      const formData = new FormData();
      files.forEach((file) => {
        if (file.file instanceof File) {
          formData.append("images", file.file);
        }
      });

      const uploadRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/api/upload/images`,
        {
          method: "POST",
          body: formData,
        }
      );

      //if (!uploadRes.ok) throw new Error("Image upload failed");

      const { urls } = await uploadRes.json();
      if (!urls || urls.length === 0) {
        throw new Error("No image uploaded");
      }

      productForm.setValue("ProductImg", urls);
      productForm.handleSubmit(onSubmit)();
    } catch (error) {
      console.error(error);
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Something went wrong during upload."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const isPending = isMutating || isUploading;

  return (
    <div>
      <Form {...productForm}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUploadThenSubmit();
          }}
          className="space-y-6 flex flex-col md:flex-row px-10 gap-6"
        >
          <div className="flex-1 flex flex-col gap-4">
            {/* productName */}
            <FormField
              control={productForm.control}
              name="productName"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Chess Set"
                      {...field}
                      className="max-w-sm px-5"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* productDesc */}
            <FormField
              control={productForm.control}
              name="productDesc"
              render={({ field }) => (
                <FormItem className="flex gap-2 items-start">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed product description..."
                      {...field}
                      className="max-w-sm px-5"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* productCategory */}
            <FormField
              control={productForm.control}
              name="productCategory"
              render={({ field }) => (
                <FormItem className="flex gap-2 items-center">
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PHYSICAL">Physical</SelectItem>
                      <SelectItem value="BOARD">Board</SelectItem>
                      <SelectItem value="DIGITAL">Digital</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* productType */}
            <FormField
              control={productForm.control}
              name="productType"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel>Product Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SELL">Sell</SelectItem>
                      <SelectItem value="RENT">Rent</SelectItem>
                      <SelectItem value="BOTH">Both</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex-1 flex flex-col gap-4">
            {(selectedType === "SELL" || selectedType === "BOTH") && (
              <FormField
                control={productForm.control}
                name="productSellingPrice"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel>Selling Price (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="5"
                        placeholder="e.g. 100"
                        {...field}
                        className="w-fit px-5"
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(selectedType === "RENT" || selectedType === "BOTH") && (
              <FormField
                control={productForm.control}
                name="productRentalPrice"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel>Rental Price (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 10"
                        {...field}
                        className="w-fit px-5"
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={productForm.control}
              name="productDiscountPercentage"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel>Discount (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="e.g. 20"
                      {...field}
                      className="w-fit px-5"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error Message UI */}
            {errorMsg && (
              <div
                className="text-destructive border border-destructive/40 bg-red-50 text-sm p-2 rounded-md flex items-start gap-2"
                role="alert"
              >
                <AlertCircleIcon className="size-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Image Upload UI */}
            <div className="flex flex-col gap-2">
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-dragging={isDragging || undefined}
                data-files={files.length > 0 || undefined}
                className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
              >
                <input
                  {...getInputProps()}
                  className="sr-only"
                  aria-label="Upload image file"
                />
                {files.length > 0 ? (
                  <div className="flex w-full flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-sm font-medium">
                        Uploaded Files ({files.length})
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openFileDialog}
                        disabled={files.length >= maxFiles}
                        type="button"
                      >
                        <UploadIcon
                          className="-ms-0.5 size-3.5 opacity-60"
                          aria-hidden="true"
                        />
                        Add more
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className="bg-accent relative aspect-square rounded-md"
                        >
                          <div className="w-full h-full">
                            <Image
                              src={file.preview ? file.preview : "/file.svg"}
                              alt={file.file.name}
                              className="size-full rounded-[inherit] object-cover"
                              fill
                            />
                          </div>
                          <Button
                            onClick={() => removeFile(file.id)}
                            size="icon"
                            className="absolute -top-2 -right-2 size-6 rounded-full border-2 border-background"
                            aria-label="Remove image"
                            type="button"
                          >
                            <XIcon className="size-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                    <div className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border">
                      <ImageIcon className="size-4 opacity-60" />
                    </div>
                    <p className="mb-1.5 text-sm font-medium">
                      Drop your images here
                    </p>
                    <p className="text-muted-foreground text-xs">
                      SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={openFileDialog}
                      type="button"
                    >
                      <UploadIcon className="-ms-1 opacity-60" />
                      Select images
                    </Button>
                  </div>
                )}
              </div>

              {errors.length > 0 && (
                <div
                  className="text-destructive flex items-center gap-1 text-xs"
                  role="alert"
                >
                  <AlertCircleIcon className="size-3 shrink-0" />
                  <span>{errors[0]}</span>
                </div>
              )}
            </div>

            <Button type="submit" className="w-fit p-3" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateProductForm;
