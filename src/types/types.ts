export interface Product {
  id: string;
  title: string;
  price: number;
  brand: string;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  }
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

export type Category = string;