export interface Product {
  _id?: string;
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  inventory: number;
  categories: string[];
  featured?: boolean;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
