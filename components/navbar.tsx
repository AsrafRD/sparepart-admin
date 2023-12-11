import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import StoreSwitcher from "@/components/store-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import prismadb from "@/lib/prismadb";
import Nav from "./nav";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="mx-auto max-w-7xl py-1 sm:px-6 lg:px-8">
      <div className="border-b">
        <div className="flex h-16 justify-center justify-between items-center">
          <Nav />
          <div className="flex justify-center justify-between items-center space-x-2 md:space-x-4">
            <StoreSwitcher items={stores} />
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
            <div className="ml-auto flex items-center px-2 md:space-x-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
