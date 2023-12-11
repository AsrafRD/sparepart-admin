export type OrderColumn = {
  id: string;
  buyerName: string;
  Email: string;
  phone: string;
  address: string;
  isPaid: string;
  statusOrder: string;
  totalPrice: string;
  products: string;
  createdAt: string;
  orderItems:  OrderItemInfo[];
}

export interface OrderItemInfo {
  productId: string;
  product: {
    name: string
  }
  name: string;
  quantity: number;
}
