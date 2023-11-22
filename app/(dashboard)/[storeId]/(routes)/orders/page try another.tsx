// "use client"
// import React, { useState, useEffect } from "react";
// import { format, addDays } from "date-fns";
// import { DateRange } from "react-day-picker";
// import prismadb from "@/lib/prismadb";
// import { formatter } from "@/lib/utils";
// import { OrderColumn } from "./components/columns";
// import { OrderClient } from "./components/client";
// import { DatePickerWithRange } from "@/components/ui/date-range-picker";
// import { OrderItem, Product } from "@prisma/client";


// interface Order {
//   id: string;
//   buyerName: string;
//   Email: string;
//   phone: string;
//   address: string;
//   orderItems: (OrderItem & { product: Product })[];
//   isPaid: boolean;
//   statusOrder: string;
//   createdAt: Date;
// }

// // OrdersPage component
// const OrdersPage: React.FC<{ params: { storeId: string } }> = ({ params }) => {
//   const [selectedDateRange, setSelectedDateRange] = useState<
//     DateRange | undefined
//   >(undefined);
//   const [formattedOrders, setFormattedOrders] = useState<OrderColumn[]>([]);

//   // Fetch orders with the selected date range
//   const fetchOrders = async (
//     storeId: string,
//     dateRange?: DateRange
//   ): Promise<Order[]> => {
//     let where: {
//       storeId: string;
//       createdAt?: { gte?: Date | undefined; lt?: Date | undefined };
//     } = { storeId };

//     if (dateRange) {
//       where = {
//         ...where,
//         createdAt: {
//           gte: dateRange.from ?? undefined,
//           lt: dateRange.to ? addDays(dateRange.to, 1) : undefined,
//         },
//       };
//     }

//     const orders = await prismadb.order.findMany({
//       where,
//       include: {
//         orderItems: {
//           include: {
//             product: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//     console.log(Error)
//     return orders;
//   };

//   // Update formatted orders when selectedDateRange changes
//   useEffect(() => {
//     const fetchData = async () => {
//       const orders = await fetchOrders(params.storeId, selectedDateRange);
//       const formattedOrders = orders.map((item) => ({
//         id: item.id,
//         buyerName: item.buyerName,
//         Email: item.Email,
//         phone: item.phone,
//         address: item.address,
//         products: item.orderItems
//           .map((orderItem) => orderItem.product.name)
//           .join(", "),
//         totalPrice: formatter.format(
//           item.orderItems.reduce((total: number, orderItem: OrderItem & { product: Product }) => {
//             return total + Number(orderItem.product.price);
//           }, 0)
//         ),
//         isPaid: item.isPaid ? "Sudah" : "Belum",
//         statusOrder: item.statusOrder,
//         createdAt: format(item.createdAt, "dd MMMM yyyy"),
//       }));
//       setFormattedOrders(formattedOrders);
//     };

//     fetchData();
//   }, [params.storeId, selectedDateRange]);

//   const handleDateRangeChange = (dateRange: DateRange | undefined) => {
//     setSelectedDateRange(dateRange);
//   };

//   return (
//     <div className="flex-col">
//       <div className="flex-1 md:space-y-4 md:p-8 md:pt-6 space-y-2 px-4 pt-4">
//         <DatePickerWithRange onChange={handleDateRangeChange} />
//         <OrderClient data={formattedOrders} />
//       </div>
//     </div>
//   );
// };

// export default OrdersPage;
