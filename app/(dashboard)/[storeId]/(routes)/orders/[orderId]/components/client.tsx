
import React from "react";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { OrderColumn, OrderItemInfo } from "./columns";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Total Orderan ( ${data.length} )`}
        description="Kelola orderan rozic sparepart"
      />
      <Separator />
      <div>
        <table>
          <tbody>
            {data.map((order) => (
              <React.Fragment key={order.id}>
                <tr key={order.id}>
                  <td>
                    <strong>Nomor Resi</strong>
                  </td>
                  <td>:</td>
                  <td>{order.statusOrder}</td>
                </tr>
                <tr key={`${order.id}_buyerName`}>
                  <td>
                    <strong>Nama Pembeli</strong>
                  </td>
                  <td>:</td>
                  <td>{order.buyerName}</td>
                </tr>
                <tr key={`${order.id}_Email`}>
                  <td>
                    <strong>Email</strong>
                  </td>
                  <td>:</td>
                  <td>{order.Email}</td>
                </tr>
                <tr key={`${order.id}_phone`}>
                  <td>
                    <strong>No. Wa</strong>
                  </td>
                  <td>:</td>
                  <td>{order.phone}</td>
                </tr>
                <tr key={`${order.id}_address`}>
                  <td>
                    <strong>Data Pengiriman</strong>
                  </td>
                  <td>:</td>
                  <td>{order.address}</td>
                </tr>
                <tr key={`${order.id}_products`}>
                  <td>
                    <strong>Produk</strong>
                  </td>
                  <td>:</td>
                  <td>
                    {/* Loop through orderItems to display product name and quantity */}
                    {order.orderItems?.map((orderItem) => (
                      <div key={`${order.id}_${orderItem.productId}`}>
                       ( {orderItem.quantity} ) - {orderItem.product.name} 
                      </div>
                    ))}
                  </td>
                </tr>
                <tr key={`${order.id}_totalPrice`}>
                  <td>
                    <strong>Total Bayar</strong>
                  </td>
                  <td>:</td>
                  <td>{order.totalPrice}</td>
                </tr>
                <tr key={`${order.id}_isPaid`}>
                  <td>
                    <strong>Status Bayar</strong>
                  </td>
                  <td>:</td>
                  <td>{order.isPaid}</td>
                </tr>
                <tr key={`${order.id}_createdAt`}>
                  <td>
                    <strong>Tgl. Dibuat</strong>
                  </td>
                  <td>:</td>
                  <td>{order.createdAt}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
