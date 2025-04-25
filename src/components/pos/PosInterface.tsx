
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Minus, Trash, ShoppingCart, CreditCard, Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product, ProductService } from "@/services/product.service";
import { useOfflineStorage } from "@/hooks/useOfflineStorage";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}

interface Sale {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  createdAt: Date;
  customer?: string;
  paymentMethod: string;
  status: "pending" | "completed" | "canceled";
  branchId: string;
  userId: string;
}

export function PosInterface() {
  // States for the POS
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Offline storage for products
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

  // Offline storage for sales
  const { 
    data: sales, 
    updateData: updateSales,
    isOnline: salesIsOnline,
    isSyncing: salesIsSyncing
  } = useOfflineStorage<Sale[]>({
    key: 'sales',
    initialData: [],
    syncFunction: async (data) => {
      // In a real app, this would sync with a backend API
      console.log('Syncing sales data...', data);
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
      }
    };
    
    fetchProducts();
  }, [updateProducts]);

  // Extract unique categories from products
  const categories = products ? 
    Array.from(new Set(products.map(product => product.category))) : [];

  // Filter products based on search term and selected category
  const filteredProducts = products?.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Increase quantity of existing item
        return prevCart.map(item => 
          item.product.id === product.id
            ? { 
                ...item, 
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price - item.discount
              }
            : item
        );
      } else {
        // Add new item to cart
        return [
          ...prevCart,
          {
            product,
            quantity: 1,
            price: product.price,
            discount: 0,
            total: product.price
          }
        ];
      }
    });
    
    toast.success(`${product.name} added to cart`);
  };

  // Update cart item quantity
  const updateCartItemQuantity = (productId: string, change: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId) {
          const newQuantity = Math.max(1, item.quantity + change); // Ensure quantity is at least 1
          return {
            ...item,
            quantity: newQuantity,
            total: newQuantity * item.price - item.discount
          };
        }
        return item;
      });
    });
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  // Calculate cart totals
  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1; // Assuming 10% tax rate
    const total = subtotal + tax;
    
    return {
      subtotal,
      tax,
      total
    };
  };

  // Process payment
  const handleProcessPayment = async (paymentMethod: string) => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      // Calculate totals
      const { subtotal, tax, total } = calculateTotals();
      
      // Create new sale record
      const newSale: Sale = {
        id: `sale-${Date.now()}`,
        items: [...cart],
        subtotal,
        discount: 0,
        tax,
        total,
        createdAt: new Date(),
        paymentMethod,
        status: "completed",
        branchId: "1", // Assume current branch
        userId: "1" // Assume current user
      };
      
      // Save to offline storage
      updateSales(sales ? [...sales, newSale] : [newSale]);
      
      // Clear cart
      setCart([]);
      
      // Show success message
      toast.success(`Payment successful. Total: $${total.toFixed(2)}`);
      
      // Simulate printing receipt
      setTimeout(() => {
        console.log("Printing receipt for sale:", newSale);
      }, 500);
      
    } catch (error) {
      toast.error("Payment processing error");
      console.error("Error processing payment:", error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      {/* Products Section */}
      <div className="md:col-span-2 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-sm relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="ml-4 flex items-center gap-2">
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
          </div>
        </div>

        {/* Categories Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-pos-neutral mb-2 overflow-auto">
            <TabsTrigger 
              value="all" 
              onClick={() => setSelectedCategory(null)}
              className="min-w-fit"
            >
              All
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                onClick={() => setSelectedCategory(category)}
                className="min-w-fit"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-4">
          {filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-3">
                  <div className="aspect-square bg-pos-neutral flex items-center justify-center rounded-md mb-2">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="object-contain h-full w-full p-2"
                      />
                    ) : (
                      <Package size={40} className="text-gray-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                    <div className="flex justify-between">
                      <p className="text-sm text-primary font-bold">${product.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{product.stockQuantity} {product.unit}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center py-8 text-gray-500">
              {searchTerm ? "No products match your search." : "No products available."}
            </div>
          )}
        </div>
      </div>

      {/* Cart Section */}
      <div className="pos-card flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} />
            <h3 className="font-medium">Current Sale</h3>
          </div>
          
          {cart.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCart([])}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {cart.length > 0 ? (
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between p-2 border-b">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.product.name}</h4>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>${item.price.toFixed(2)} × {item.quantity}</span>
                      <span>${item.total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6"
                      onClick={() => updateCartItemQuantity(item.product.id, -1)}
                    >
                      <Minus size={12} />
                    </Button>
                    
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6"
                      onClick={() => updateCartItemQuantity(item.product.id, 1)}
                    >
                      <Plus size={12} />
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-gray-400 hover:text-red-500"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
              <ShoppingCart size={40} className="mb-2" />
              <p>Cart is empty</p>
              <p className="text-xs mt-2">Add products to start a sale</p>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="mt-4 pt-4 border-t">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Payment Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button
              variant="outline"
              className="h-auto py-6 text-blue-800"
              disabled={cart.length === 0 || isProcessingPayment}
              onClick={() => handleProcessPayment("cash")}
            >
              <div className="flex flex-col items-center">
                <CreditCard className="h-6 w-6 mb-1" />
                <span>Cash</span>
              </div>
            </Button>
            
            <Button
              className="h-auto py-6 bg-blue-700 hover:bg-blue-800"
              disabled={cart.length === 0 || isProcessingPayment}
              onClick={() => handleProcessPayment("card")}
            >
              <div className="flex flex-col items-center">
                <CreditCard className="h-6 w-6 mb-1" />
                <span>Card</span>
              </div>
            </Button>
          </div>
          
          <Button
            variant="outline"
            className="w-full mt-2"
            disabled={cart.length === 0}
            onClick={() => {
              console.log("Print receipt");
              toast.info("Printing receipt...");
            }}
          >
            <Printer size={16} className="mr-2" />
            <span>Print receipt</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
