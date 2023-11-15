"use client";
import { MainNav } from "@/components/main-nav";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { X } from "@phosphor-icons/react";

const Nav = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div>
        {/* Mobile menu */}
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 mt-1 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-60 flex-col mt-16 bg-white dark:bg-black shadow-xl">
                  <div className="flex justify-between items-center pb-4 pt-5 mr-5">
                    <div className="ml-4 flex lg:ml-0 gap-x-2">
                      <p className="font-bold text-xl">Rozic Sparepart</p>
                    </div>
                    <button
                      type="button"
                      className="relative -m-2 inline-flex rounded-md p-2 text-gray-400"
                      onClick={() => setOpen(false)}
                    >
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Close menu</span>
                      <X size={25} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="space-y-4 border-t border-gray-200 px-4 py-4">
                    <div className="flow-root">
                        <MainNav className="flex flex-col space-y-6" />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <header className="relative">
            <div className="border-b">
              <div className="flex h-16 items-center">
                <button
                  type="button"
                  className="relative rounded-md p-2 text-gray-400 lg:hidden"
                  onClick={() => setOpen(true)}
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon className="h-8 w-8 ml-3" aria-hidden="true" />
                </button>

                {/* Flyout menus */}

                <div className="ml-auto flex items-center">
                  <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-2">
                      <div className="border-b">
                        <div className="flex h-16 items-center px-4">
                          <MainNav />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Search */}
                  {/* <InputSearch /> */}

                  {/* Cart */}
                  {/* <div className="ml-4 flow-root lg:ml-6">
                    <NavbarActions />
                  </div> */}
                </div>
              </div>
            </div>
        </header>
      </div>
    </>
  );
};

export default Nav;
