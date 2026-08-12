export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  stockStatus: "In Stock" | "Low Stock" | "Pre-Order";
  discountPercent?: number;
  badge?: string;
}

export class Products {
  static list: Product[] = [
    {
      id: "p1",
      name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      price: 349.99,
      originalPrice: 399.99,
      category: "Headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      rating: 4.9,
      reviewCount: 2410,
      description: "Industry-leading noise cancellation with two processors and 8 microphones for unprecedented sound quality.",
      stockStatus: "In Stock",
      discountPercent: 12,
      badge: "Best Seller"
    },
    {
      id: "p2",
      name: "Apple iPhone 15 Pro Max 256GB Titanium",
      price: 1199.00,
      originalPrice: 1299.00,
      category: "Smartphones",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80",
      rating: 4.8,
      reviewCount: 3890,
      description: "Forged in titanium with revolutionary A17 Pro chip, customizable Action button, and 5x Telephoto camera.",
      stockStatus: "In Stock",
      discountPercent: 8,
      badge: "Popular"
    },
    {
      id: "p3",
      name: "MacBook Pro 16\" M3 Max 36GB RAM 1TB SSD",
      price: 2499.00,
      originalPrice: 2699.00,
      category: "Laptops",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      rating: 4.9,
      reviewCount: 940,
      description: "Liquid Retina XDR display, up to 22 hours of battery life, and extreme M3 Max performance for creative pros.",
      stockStatus: "Low Stock",
      discountPercent: 7,
      badge: "Pro Choice"
    },
    {
      id: "p4",
      name: "Nike Air Max 270 React Running Sneakers",
      price: 145.00,
      originalPrice: 170.00,
      category: "Shoes",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      rating: 4.7,
      reviewCount: 1820,
      description: "Breathable mesh upper with React technology foam midsole for ultra-lightweight daily comfort.",
      stockStatus: "In Stock",
      discountPercent: 15,
      badge: "Trending"
    },
    {
      id: "p5",
      name: "Minimalist Italian Leather Jacket",
      price: 280.00,
      originalPrice: 350.00,
      category: "Fashion",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
      rating: 4.6,
      reviewCount: 420,
      description: "Handcrafted from 100% genuine lambskin leather with tailored slim fit and silk inner lining.",
      stockStatus: "In Stock",
      discountPercent: 20
    },
    {
      id: "p6",
      name: "Anker 100W GaN III USB-C Desktop Charger",
      price: 59.99,
      originalPrice: 79.99,
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
      rating: 4.8,
      reviewCount: 1150,
      description: "Ultra-compact 4-port high-speed power charging station for laptops, tablets, and mobile devices.",
      stockStatus: "In Stock",
      discountPercent: 25
    },
    {
      id: "p7",
      name: "Garmin Epix Gen 2 Sapphire Fitness Watch",
      price: 699.00,
      originalPrice: 799.00,
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      rating: 4.9,
      reviewCount: 1430,
      description: "Stunning AMOLED display, multi-band GNSS GPS tracking, 16 days of battery life, and 24/7 health monitoring.",
      stockStatus: "In Stock",
      discountPercent: 12.5
    },
    {
      id: "p8",
      name: "Water-Resistant Cordura Travel Backpack",
      price: 110.00,
      originalPrice: 140.00,
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
      rating: 4.7,
      reviewCount: 610,
      description: "Heavy-duty 1000D Cordura nylon construction with ergonomic padded shoulder straps and TSA laptop compartment.",
      stockStatus: "In Stock",
      discountPercent: 21
    }
  ];

  static getById(id: string): Product | undefined {
    return this.list.find((p) => p.id === id);
  }
}
