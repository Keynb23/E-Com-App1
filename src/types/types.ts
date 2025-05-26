export interface Product {
  id: number;
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

export type Category = string;