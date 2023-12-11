"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathName = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "DASHBOARD",
      active: pathName === `/${params.storeId}`,
    },
  ];

  const store = [
    {
      href: `/${params.storeId}/billboards`,
      label: "Banner",
      active: pathName === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Kategori",
      active: pathName === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/vehicleBrands`,
      label: "Merek Kendaraan",
      active: pathName === `/${params.storeId}/vehicleBrands`,
    },
    {
      href: `/${params.storeId}/vehicleTypes`,
      label: "Tipe Kendaraan",
      active: pathName === `/${params.storeId}/vehicleTypes`,
    },
    {
      href: `/${params.storeId}/productBrands`,
      label: "Merek Produk",
      active: pathName === `/${params.storeId}/productBrands`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Produk",
      active: pathName === `/${params.storeId}/products`,
    },
  ];

  const systemPakar = [
    {
      href: `/${params.storeId}/indications`,
      label: "Kelola Gejala",
      active: pathName === `/${params.storeId}/indications`,
    },
    {
      href: `/${params.storeId}/problems`,
      label: "Kelola Kerusakan",
      active: pathName === `/${params.storeId}/problems`,
    },
    {
      href: `/${params.storeId}/rules`,
      label: "Kelola Diagnosa",
      active: pathName === `/${params.storeId}/rules`,
    },
  ];

  const order = [
    {
      href: `/${params.storeId}/orders`,
      label: "ORDERAN",
      active: pathName === `/${params.storeId}/orders`,
    },
    // {
    //   href: `/${params.storeId}/settings`,
    //   label: "Pengaturan",
    //   active: pathName === `/${params.storeId}/settings`,
    // },
  ];
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-col lg:flex-row items-start md:items-center">
        <NavigationMenuItem>
          {routes.map((route) => (
            <Link
              legacyBehavior
              passHref
              key={route.href}
              href={route.href}
              className={cn(
                "text-md md:text-md font-medium transition-color hover:text-primary",
                route.active
                  ? "text-black dark:text-white"
                  : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-md">
            STORE
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[180px] gap-1 p-1 md:w-[300px] md:grid-cols-2 lg:w-[400px] ">
              {store.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "block px-4 py-2 transition-color hover:text-primary",
                    route.active
                      ? "text-black dark:text-white"
                      : "text-muted-foreground"
                  )}
                >
                  {route.label}
                </Link>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-md">
            SISTEM PAKAR
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[180px] gap-1 p-1 md:w-[200px] md:grid-cols-1 lg:w-[200px]">
              {systemPakar.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "block px-4 py-2 transition-color hover:text-primary",
                    route.active
                      ? "text-black dark:text-white"
                      : "text-muted-foreground"
                  )}
                >
                  {route.label}
                </Link>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          {order.map((route) => (
            <Link
              legacyBehavior
              passHref
              key={route.href}
              href={route.href}
              className={cn(
                "text-md md:text-md font-medium transition-color hover:text-primary",
                route.active
                  ? "text-black dark:text-white"
                  : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
