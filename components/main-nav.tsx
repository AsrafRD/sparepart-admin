"use client";

import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    
    const pathName = usePathname();
    const params = useParams();


    const routes = [
        {
            href: `/${params.storeId}`,
            label: 'Dashboard',
            active: pathName === `/${params.storeId}`,
        },
        {
            href: `/${params.storeId}/billboards`,
            label: 'Banner',
            active: pathName === `/${params.storeId}/billboards`,
        },
        {
            href: `/${params.storeId}/categories`,
            label: 'Kategori',
            active: pathName === `/${params.storeId}/categories`,
        },
        {
            href: `/${params.storeId}/vehicleBrands`,
            label: 'Merek Kendaraan',
            active: pathName === `/${params.storeId}/vehicleBrands`,
        },
        {
            href: `/${params.storeId}/vehicleTypes`,
            label: 'Tipe Kendaraan',
            active: pathName === `/${params.storeId}/vehicleTypes`,
        },
        {
            href: `/${params.storeId}/productBrands`,
            label: 'Merek Produk',
            active: pathName === `/${params.storeId}/productBrands`,
        },
        {
            href: `/${params.storeId}/products`,
            label: 'Produk',
            active: pathName === `/${params.storeId}/products`,
        },
        {
            href: `/${params.storeId}/orders`,
            label: 'Orderan',
            active: pathName === `/${params.storeId}/orders`,
        },
        {
            href: `/${params.storeId}/settings`,
            label: 'Pengaturan',
            active: pathName === `/${params.storeId}/settings`,
        },
    ];

    return (
        <nav
            className={cn("flex md:items-center space-x-4 lg:space-x-6", className)}
        >
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn("text-md md:text-sm font-medium transition-color hover:text-primary",
                    route.active ? "text-black dark:text-white" : "text-muted-foreground"
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    )
};