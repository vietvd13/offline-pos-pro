
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductList } from "@/components/products/ProductList";
import { ProductForm } from "@/components/products/ProductForm";
import { Product } from "@/services/product.service";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const ProductManagement = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAdd = () => {
    setSelectedProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleSave = () => {
    setIsFormOpen(false);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
  };
  
  return (
    <MainLayout>
      <ProductList onEdit={handleEdit} onAdd={handleAdd} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <ProductForm 
            product={selectedProduct} 
            onSave={handleSave} 
            onCancel={handleCancel} 
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ProductManagement;
