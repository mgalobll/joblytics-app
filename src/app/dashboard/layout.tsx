'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, HomeIcon, BriefcaseIcon, UserGroupIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-dark-grey/80" aria-hidden="true" />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Joblytics</span>
              <Image
                className="h-8 w-auto"
                src="/logo.png"
                alt="Joblytics"
                width={32}
                height={32}
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-dark-grey"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Link
                  href="/dashboard"
                  className={classNames(
                    pathname === '/dashboard'
                      ? 'bg-primary-light text-primary'
                      : 'text-dark-grey hover:text-primary hover:bg-primary-light/10',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                  )}
                >
                  <HomeIcon className="h-6 w-6 shrink-0 text-medium-grey group-hover:text-primary" aria-hidden="true" />
                  Daily Agenda
                </Link>
                <Link
                  href="/dashboard/jobs"
                  className={classNames(
                    pathname === '/dashboard/jobs'
                      ? 'bg-primary-light text-primary'
                      : 'text-dark-grey hover:text-primary hover:bg-primary-light/10',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                  )}
                >
                  <BriefcaseIcon className="h-6 w-6 shrink-0 text-medium-grey group-hover:text-primary" aria-hidden="true" />
                  Job Applications
                </Link>
                <Link
                  href="/dashboard/network"
                  className={classNames(
                    pathname === '/dashboard/network'
                      ? 'bg-primary-light text-primary'
                      : 'text-dark-grey hover:text-primary hover:bg-primary-light/10',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                  )}
                >
                  <UserGroupIcon className="h-6 w-6 shrink-0 text-medium-grey group-hover:text-primary" aria-hidden="true" />
                  Network
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Joblytics</span>
              <Image
                className="h-8 w-auto"
                src="/logo.png"
                alt="Joblytics"
                width={32}
                height={32}
              />
            </a>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  <li>
                    <Link
                      href="/dashboard"
                      className={classNames(
                        pathname === '/dashboard'
                          ? 'bg-primary-light text-primary'
                          : 'text-dark-grey hover:text-primary hover:bg-primary-light/10',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                      )}
                    >
                      <HomeIcon className="h-6 w-6 shrink-0 text-medium-grey group-hover:text-primary" aria-hidden="true" />
                      Daily Agenda
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/jobs"
                      className={classNames(
                        pathname === '/dashboard/jobs'
                          ? 'bg-primary-light text-primary'
                          : 'text-dark-grey hover:text-primary hover:bg-primary-light/10',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                      )}
                    >
                      <BriefcaseIcon className="h-6 w-6 shrink-0 text-medium-grey group-hover:text-primary" aria-hidden="true" />
                      Job Applications
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/network"
                      className={classNames(
                        pathname === '/dashboard/network'
                          ? 'bg-primary-light text-primary'
                          : 'text-dark-grey hover:text-primary hover:bg-primary-light/10',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                      )}
                    >
                      <UserGroupIcon className="h-6 w-6 shrink-0 text-medium-grey group-hover:text-primary" aria-hidden="true" />
                      Network
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:pl-0">
          <button type="button" className="-m-2.5 p-2.5 text-dark-grey lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-border lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-primary">
                    <UserIcon className="h-5 w-5" />
                  </div>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleSignOut}
                          className={classNames(
                            active ? 'bg-primary-light/10' : '',
                            'block px-3 py-1 text-sm leading-6 text-dark-grey w-full text-left'
                          )}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
} 