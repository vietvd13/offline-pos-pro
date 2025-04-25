
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Product, ProductService } from "@/services/product.service";
import { toast } from "sonner";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductFormProps {
  product?: Product;
  onSave: () => void;
  onCancel: () => void;
}

// Sample categories - in a real app, these would come from an API
const categories = [
  "Electronics",
  "Accessories",
  "Cables",
  "Audio",
  "Phone Accessories",
  "Computer Components",
  "Storage",
  "Peripherals",
  "Networking",
  "Software"
];

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const isEditMode = !!product;
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<Product>({
    defaultValues: product || {
      name: '',
      sku: '',
      barcode: '',
      description: '',
      category: '',
      price: 0,
      cost: 0,
      stockQuantity: 0,
      unit: 'piece',
      isActive: true
    }
  });

  useEffect(() => {
    if (product) {
      reset(product);
    }
  }, [product, reset]);

  // Register Select components with react-hook-form
  useEffect(() => {
    register("category", { required: "Category is required" });
    register("unit", { required: "Unit is required" });
  }, [register]);

  const onSubmit = async (data: Product) => {
    try {
      if (isEditMode) {
        await ProductService.updateProduct(product.id, data);
        toast.success("Product updated successfully");
      } else {
        await ProductService.createProduct(data);
        toast.success("Product created successfully");
      }
      onSave();
    } catch (error) {
      toast.error(`Error: ${isEditMode ? "updating" : "creating"} product`);
      console.error("Error submitting product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-lg font-medium">{isEditMode ? "Edit" : "Add"} Product</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Product name is required" })}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              {...register("sku", { required: "SKU is required" })}
              placeholder="Enter SKU"
            />
            {errors.sku && <p className="text-sm text-red-500">{errors.sku.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode</Label>
            <Input
              id="barcode"
              {...register("barcode")}
              placeholder="Enter barcode"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={watch("category")}
              onValueChange={(value) => setValue("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register("price", { 
                required: "Price is required",
                valueAsNumber: true 
              })}
              placeholder="0.00"
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              min="0"
              {...register("cost", { 
                required: "Cost is required",
                valueAsNumber: true 
              })}
              placeholder="0.00"
            />
            {errors.cost && <p className="text-sm text-red-500">{errors.cost.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="stockQuantity">Stock Quantity</Label>
            <Input
              id="stockQuantity"
              type="number"
              min="0"
              {...register("stockQuantity", { 
                required: "Stock quantity is required",
                valueAsNumber: true 
              })}
              placeholder="0"
            />
            {errors.stockQuantity && <p className="text-sm text-red-500">{errors.stockQuantity.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Select
              value={watch("unit")}
              onValueChange={(value) => setValue("unit", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="piece">Piece</SelectItem>
                <SelectItem value="kg">Kilogram</SelectItem>
                <SelectItem value="liter">Liter</SelectItem>
                <SelectItem value="meter">Meter</SelectItem>
                <SelectItem value="box">Box</SelectItem>
              </SelectContent>
            </Select>
            {errors.unit && <p className="text-sm text-red-500">{errors.unit.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              {...register("imageUrl")}
              placeholder="Enter image URL"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Enter product description"
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={watch("isActive")}
            onCheckedChange={(checked) => setValue("isActive", checked)}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
