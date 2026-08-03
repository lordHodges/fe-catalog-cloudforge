export interface Product {
  id: string;
  name: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  images?: ImageInfo[];
  stock: number;
}
export interface ImageInfo {
  url: string;
  order: number;
}
