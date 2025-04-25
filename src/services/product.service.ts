
export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  stockQuantity: number;
  unit: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for products
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Computer',
    sku: 'LAP-001',
    barcode: '123456789',
    description: 'High performance laptop for professionals',
    category: 'Electronics',
    price: 1200,
    cost: 800,
    stockQuantity: 10,
    unit: 'piece',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    sku: 'MOU-002',
    barcode: '234567890',
    description: 'Ergonomic wireless mouse',
    category: 'Accessories',
    price: 25,
    cost: 15,
    stockQuantity: 50,
    unit: 'piece',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'USB-C Cable',
    sku: 'CAB-003',
    barcode: '345678901',
    description: '2m USB-C charging cable',
    category: 'Cables',
    price: 15,
    cost: 5,
    stockQuantity: 100,
    unit: 'piece',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Bluetooth Speaker',
    sku: 'SPK-004',
    barcode: '456789012',
    description: 'Portable Bluetooth speaker with 20h battery life',
    category: 'Audio',
    price: 80,
    cost: 40,
    stockQuantity: 25,
    unit: 'piece',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'Smartphone Case',
    sku: 'CAS-005',
    barcode: '567890123',
    description: 'Protective case for smartphones',
    category: 'Phone Accessories',
    price: 20,
    cost: 8,
    stockQuantity: 75,
    unit: 'piece',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock service functions
export const ProductService = {
  getProducts: async (): Promise<Product[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProducts);
      }, 500);
    });
  },
  
  getProductById: async (id: string): Promise<Product | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProducts.find(product => product.id === id));
      }, 300);
    });
  },
  
  getProductByBarcode: async (barcode: string): Promise<Product | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProducts.find(product => product.barcode === barcode));
      }, 300);
    });
  },
  
  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    return new Promise((resolve) => {
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setTimeout(() => {
        resolve(newProduct);
      }, 500);
    });
  },
  
  updateProduct: async (id: string, product: Partial<Product>): Promise<Product | undefined> => {
    return new Promise((resolve) => {
      const updatedProduct = mockProducts.find(p => p.id === id);
      if (updatedProduct) {
        Object.assign(updatedProduct, product, { updatedAt: new Date() });
      }
      
      setTimeout(() => {
        resolve(updatedProduct);
      }, 500);
    });
  },
  
  deleteProduct: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }
};
