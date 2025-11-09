"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface MenuItem {
  label: string;
  href: string;
  icon: string;
  roles: string[];
}

const menuItems: MenuItem[] = [
  // ADMIN
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: "📊",
    roles: ["ADMIN"],
  },
  { label: "Orders", href: "/admin/orders", icon: "📋", roles: ["ADMIN"] },
  { label: "Reports", href: "/admin/reports", icon: "📈", roles: ["ADMIN"] },

  // CLIENT
  {
    label: "Dashboard",
    href: "/client/dashboard",
    icon: "🏠",
    roles: ["CLIENT"],
  },
  { label: "Orders", href: "/client/orders", icon: "🧾", roles: ["CLIENT"] },

  // MECHANIC
  {
    label: "Dashboard",
    href: "/mechanic/dashboard",
    icon: "🔧",
    roles: ["MECHANIC"],
  },
  {
    label: "Orders",
    href: "/mechanic/orders",
    icon: "📋",
    roles: ["MECHANIC"],
  },
];

export default function ProtectedLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const userRole = session?.user?.role || "CLIENT";

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const handleLogout = () => signOut({ callbackUrl: "/login" });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded hover:bg-gray-100"
            >
              ☰
            </button>
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🔧</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
                AutoService
              </h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">
                {session?.user?.name}
              </p>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-white border-r transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-0 overflow-hidden"
          }`}
        >
          <nav className="p-4 space-y-1">
            {filteredMenu.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
