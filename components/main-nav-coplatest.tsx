"use client"

import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathName = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Overview",
      active: pathName === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathName === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: pathName === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/vehicleBrands`,
      label: "Vehicle-Brands",
      active: pathName === `/${params.storeId}/vehicleBrands`,
    },
    {
      href: `/${params.storeId}/vehicleTypes`,
      label: "Vehicle-Types",
      active: pathName === `/${params.storeId}/vehicleTypes`,
    },
    {
      href: `/${params.storeId}/productBrands`,
      label: "Product-Brands",
      active: pathName === `/${params.storeId}/productBrands`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Products",
      active: pathName === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Orders",
      active: pathName === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/suppliers`,
      label: "Supliers",
      active: pathName === `/${params.storeId}/suppliers`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathName === `/${params.storeId}/settings`,
    },
  ];

  return (
    <nav className={cn("lg:flex items-center space-x-4 lg:space-x-6", className)}>
      {/* Tombol Hamburger (muncul di layar kecil) */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden p-2"
      >
        &#8801;
      </button>

      {/* Daftar Menu (ditampilkan di layar besar) */}
      <div className={`lg:flex space-x-4 ${isMobileMenuOpen ? "block" : "hidden"}`}>

        {routes.map((route) => (
          <Link key={route.href} href={route.href}>
            <div
              className={`text-sm font-medium transition-color hover:text-primary ${
                route.active
                  ? "text-black dark:text-white"
                  : "text-muted-foreground"
              }`}
            >
              {route.label}
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
