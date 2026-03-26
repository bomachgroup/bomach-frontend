"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Building2,
  LogOut,
  Loader2,
  ChevronRight,
  Home,
  Menu,
  X,
  Briefcase,
  Mail,
} from "lucide-react";

function AdminSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    {
      label: "Dashboard",
      href: "/management/dashboard",
      icon: LayoutDashboard,
    },
    { label: "Properties", href: "/management/properties", icon: Building2 },
    { label: "Projects", href: "/management/projects", icon: Briefcase },
    { label: "Blogs", href: "/management/blogs", icon: Mail },
    { label: "Jobs", href: "/management/jobs", icon: Briefcase },
    { label: "Newsletter", href: "/management/newsletter", icon: Mail },
  ];

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className='p-6 border-b border-white/10 flex items-center justify-between'>
        <Link href='/management/dashboard' className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center font-bold text-lg'>
            B
          </div>
          <div>
            <h1 className='font-display text-lg font-bold'>Bomach</h1>
            <p className='text-[10px] text-white/50 uppercase tracking-widest'>
              Admin Panel
            </p>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className='md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all'>
          <X className='w-5 h-5' />
        </button>
      </div>

      {/* Nav */}
      <nav className='flex-1 p-4 space-y-1'>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-600/25"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}>
              <item.icon className='w-5 h-5' />
              {item.label}
              {isActive && <ChevronRight className='w-4 h-4 ml-auto' />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className='p-4 border-t border-white/10 space-y-3'>
        <Link
          href='/'
          className='flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all'>
          <Home className='w-4 h-4' />
          View Site
        </Link>
        <div className='px-4 py-2'>
          <p className='text-xs text-white/40 truncate'>{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className='flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all'>
          <LogOut className='w-4 h-4' />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className='md:hidden fixed top-0 left-0 right-0 z-40 bg-secondary-950 text-white flex items-center justify-between px-4 py-3 border-b border-white/10'>
        <Link href='/management/dashboard' className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center font-bold text-sm'>
            B
          </div>
          <span className='font-display text-sm font-bold'>Bomach Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className='p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all'>
          <Menu className='w-5 h-5' />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className='md:hidden fixed inset-0 bg-black/50 z-50'
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-out sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 w-72 bg-secondary-950 text-white flex flex-col h-full transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className='hidden md:flex w-64 bg-secondary-950 text-white flex-col min-h-screen fixed left-0 top-0 z-50'>
        {sidebarContent}
      </aside>
    </>
  );
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/management/login") {
      router.replace("/management/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-secondary-50'>
        <Loader2 className='w-8 h-8 text-primary-600 animate-spin' />
      </div>
    );
  }

  // Login page — no sidebar
  if (pathname === "/management/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className='flex min-h-screen bg-secondary-50'>
      <AdminSidebar />
      <main className='flex-1 md:ml-64 pt-16 md:pt-0 p-4 md:p-8'>
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}
