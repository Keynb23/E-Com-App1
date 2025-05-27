// types/types.ts
export interface Product {
  id: string; // THIS MUST BE STRING
  title: string;
  price: number;
  brand: string;
  description: string;
  category: string; // This was missing in your old CartItem, now it's explicit
  image: string;
  rating: {
    rate: number;
    count: number;
  }
}

// CartItem extends Product, so it automatically gets 'id: string', 'category: string', etc.
export interface CartItem extends Product {
  quantity: number;
}

export type Category = string;