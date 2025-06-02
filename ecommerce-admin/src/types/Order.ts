// types/Order.ts
export interface Order {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  user: {   
    id: number;
    firstName: string;
    lastName: string;
  };
}

