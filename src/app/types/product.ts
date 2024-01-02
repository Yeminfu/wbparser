export interface ProductFromDbInterface {
    id: number;
    link: string;
    product_name: string;
    rating: number;
    count: number;
    lower_price: number;
    upper_price: number;
    image: string;
    category: number;
  }