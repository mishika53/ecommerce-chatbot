export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'product' | 'order' | 'options';
  data?: any;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  inStock: boolean;
}

export interface Order {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: OrderItem[];
  total: number;
  date: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface ChatResponse {
  message: string;
  type: 'text' | 'product' | 'order' | 'options';
  data?: any;
}