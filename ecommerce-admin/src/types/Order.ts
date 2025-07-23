// types/Order.ts
export interface Order {
  id: number;
  status: string;
  customerId: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}


