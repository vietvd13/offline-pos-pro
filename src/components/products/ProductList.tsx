
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Product, ProductService } from "@/services/product.service";
import { useOfflineStorage } from "@/hooks/useOfflineStorage";

interface ProductListProps {
  onEdit: (product: Product) => void;
  onAdd: () => void;
}

export function ProductList({ onEdit, onAdd }: ProductListProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use our offline storage hook
  const { 
    data: products, 
    updateData: updateProducts,
    isOnline,
    isSyncing
  } = useOfflineStorage<Product[]>({
    key: 'products',
    initialData: [],
    syncFunction: async (data) => {
      // In a real app, this would sync with a backend API
      console.log('Syncing products data...', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    }
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getProducts();
        updateProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [updateProducts]);

  // Filter products based on search term
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = async (id: string) => {
    // In a real app, you'd show a confirmation dialog
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await ProductService.deleteProduct(id);
        // Update the list by filtering out the deleted product
        if (products) {
          updateProducts(products.filter(product => product.id !== id));
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Product List</h3>
          <p className="text-sm text-gray-500">Manage your inventory</p>
        </div>
        
        <div className="flex items-center gap-2">
          {!isOnline && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Offline Mode
            </Badge>
          )}
          {isSyncing && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Syncing...
            </Badge>
          )}
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-pulse text-gray-400">Loading products...</div>
        </div>
      ) : (
        <div className="pos-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{product.stockQuantity} {product.unit}</TableCell>
                    <TableCell>
                      {product.isActive ? (
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchTerm ? "No products match your search." : "No products found. Add your first product to get started."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
