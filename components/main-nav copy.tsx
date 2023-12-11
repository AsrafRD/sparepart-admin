// "use client";

// import { useParams, usePathname } from "next/navigation";

// import { cn } from "@/lib/utils";
// import Link from "next/link";
// import React from "react";

// export function MainNav({
//   className,
//   ...props
// }: React.HTMLAttributes<HTMLElement>) {
//   const pathName = usePathname();
//   const params = useParams();

//   const routes = [
//     {
//       href: `/${params.storeId}`,
//       label: "DASHBOARD",
//       active: pathName === `/${params.storeId}`,
//     },
//   ];

//   const store = [
//     {
//       href: `/${params.storeId}/billboards`,
//       label: "Banner",
//       active: pathName === `/${params.storeId}/billboards`,
//     },
//     {
//       href: `/${params.storeId}/categories`,
//       label: "Kategori",
//       active: pathName === `/${params.storeId}/categories`,
//     },
//     {
//       href: `/${params.storeId}/vehicleBrands`,
//       label: "Merek Kendaraan",
//       active: pathName === `/${params.storeId}/vehicleBrands`,
//     },
//     {
//       href: `/${params.storeId}/vehicleTypes`,
//       label: "Tipe Kendaraan",
//       active: pathName === `/${params.storeId}/vehicleTypes`,
//     },
//     {
//       href: `/${params.storeId}/productBrands`,
//       label: "Merek Produk",
//       active: pathName === `/${params.storeId}/productBrands`,
//     },
//     {
//       href: `/${params.storeId}/products`,
//       label: "Produk",
//       active: pathName === `/${params.storeId}/products`,
//     },
//   ];

//   const systemPakar = [
//     {
//       href: `/${params.storeId}/indications`,
//       label: "Kelola Gejala",
//       active: pathName === `/${params.storeId}/indications`,
//     },
//     {
//       href: `/${params.storeId}/problems`,
//       label: "Kelola Kerusakan",
//       active: pathName === `/${params.storeId}/problems`,
//     },
//     {
//       href: `/${params.storeId}/rules`,
//       label: "Kelola Diagnosa",
//       active: pathName === `/${params.storeId}/rules`,
//     },
//   ];

//   const order = [
//     {
//       href: `/${params.storeId}/orders`,
//       label: "ORDERAN",
//       active: pathName === `/${params.storeId}/orders`,
//     },
//     // {
//     //   href: `/${params.storeId}/settings`,
//     //   label: "Pengaturan",
//     //   active: pathName === `/${params.storeId}/settings`,
//     // },
//   ];

//   const [systemPakarDropdownOpen, setSystemPakarDropdownOpen] = React.useState(false);
//   const [storeDropdownOpen, setStoreDropdownOpen] = React.useState(false);

//   const handleStoreButtonClick = () => {
//     setStoreDropdownOpen(!storeDropdownOpen);
//     // Pastikan dropdown store tertutup
//     setSystemPakarDropdownOpen(false);
//   };

//   const handleSPButtonClick = () => {
//     setSystemPakarDropdownOpen(!storeDropdownOpen);
//     // Pastikan dropdown lain tertutup
//     setStoreDropdownOpen(false);
//   };

//   return (
//     <nav
//       className={cn("flex md:items-center space-x-4 lg:space-x-8", className)}
//     >
//       {/* Dashboard */}
//       {routes.map((route) => (
//         <Link
//           key={route.href}
//           href={route.href}
//           className={cn(
//             "text-md md:text-md font-medium transition-color hover:text-primary",
//             route.active
//               ? "text-black dark:text-white"
//               : "text-muted-foreground"
//           )}
//         >
//           {route.label}
//         </Link>
//       ))}

//       {/* Dropdown for Store */}
//       <div className="relative group">
//         <button
//           onClick={handleStoreButtonClick}
//           className={cn(
//             "block px-4 py-2 transition-color hover:text-primary",
//             storeDropdownOpen
//               ? "color-none text-black dark:text-white"
//               : "text-muted-foreground"
//           )}
//         >
//           STORE
//         </button>
//         {storeDropdownOpen && (
//           <div className="absolute bg-white dark:bg-gray-800 py-2 space-y-2">
//             {store.map((route) => (
//               <Link
//                 key={route.href}
//                 href={route.href}
//                 className={cn(
//                   "block px-4 py-2 transition-color hover:text-primary",
//                   route.active
//                     ? "text-black dark:text-white"
//                     : "text-muted-foreground"
//                 )}
//               >
//                 {route.label}
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>


//       {/* Dropdown for Store */}
//       <div className="relative group">
//         <button
//           onClick={handleSPButtonClick}
//           className={cn(
//             "relative block px-4 py-2 transition-color hover:text-primary",
//             systemPakarDropdownOpen
//               ? "color-none text-black dark:text-white"
//               : "text-muted-foreground"
//           )}
//         >
//           SISTEM PAKAR
//         </button>
//         {systemPakarDropdownOpen && (
//           <div className="absolute bg-white dark:bg-gray-800 py-2 space-y-2">
//             {systemPakar.map((route) => (
//               <Link
//                 key={route.href}
//                 href={route.href}
//                 className={cn(
//                   "block px-4 py-2 transition-color hover:text-primary",
//                   route.active
//                     ? "text-black dark:text-white"
//                     : "text-muted-foreground"
//                 )}
//               >
//                 {route.label}
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Dropdown for System Pakar */}
//       {/* <div className="relative">
//         <button
//           onClick={handleSPButtonClick}
//           className="text-md md:text-md font-medium transition-color hover:text-primary"
//         >
//           SISTEM PAKAR
//         </button>
//         {systemPakarDropdownOpen && (
//           <div className="absolute bg-white dark:bg-gray-800 py-2 space-y-2">
//             {systemPakar.map((route) => (
//               <Link
//                 key={route.href}
//                 href={route.href}
//                 className={cn(
//                   "block px-4 py-2 transition-color hover:text-primary",
//                   route.active
//                     ? "text-black dark:text-white"
//                     : "text-muted-foreground"
//                 )}
//               >
//                 {route.label}
//               </Link>
//             ))}
//           </div>
//         )}
//       </div> */}

//       {/* Dashboard, Orderan, Pengaturan */}
//       {order.map((route) => (
//         <Link
//           key={route.href}
//           href={route.href}
//           className={cn(
//             "text-md md:text-md font-medium transition-color hover:text-primary",
//             route.active
//               ? "text-black dark:text-white"
//               : "text-muted-foreground"
//           )}
//         >
//           {route.label}
//         </Link>
//       ))}
//     </nav>
//   );
// }
