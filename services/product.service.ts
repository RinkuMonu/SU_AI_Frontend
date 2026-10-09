import api from '@/lib/api';

const MOCK_PRODUCTS: any[] = [
  {
    id: "prod_1",
    businessId: "bus_1",
    name: "Classic White T-Shirt",
    description: "Premium cotton classic white t-shirt",
    price: 29.99,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White"],
    stock: 100,
    category: "Clothing",
    sku: "TSH-WHT-01",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80"],
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    created_at: new Date().toISOString()
  },
  {
    id: "prod_2",
    businessId: "bus_1",
    name: "Denim Jacket",
    description: "Vintage style denim jacket",
    price: 89.99,
    sizes: ["M", "L"],
    colors: ["Blue"],
    stock: 50,
    category: "Clothing",
    sku: "JAC-DEN-01",
    images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80"],
    image_url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80",
    created_at: new Date().toISOString()
  }
];

export const getProducts = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PRODUCTS);
    }, 300);
  });
};
