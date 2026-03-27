import { NavLink, Outlet, useLocation } from "react-router";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import { cn } from "../../lib/utils";
import {
  Video as VideoIcon,
  Box as ModelIcon,
  Clock as ClockIcon,
  Cloud as CloudIcon,
  LayoutDashboard as DashboardIcon,
  LogOut as LogoutIcon,
  Menu as MenuIcon,
  User as UserIcon,
  BlocksIcon,
  BookTemplateIcon,
} from "lucide-react";

export async function loader() {
  return {};
}

const navigation = [
  { name: "Models", href: "/playground/models", icon: ModelIcon },
  { name: "Blocks", href: "/playground/blocks", icon: BlocksIcon },
  { name: "Templates", href: "/playground/templates", icon: BookTemplateIcon },
  { name: "Generate", href: "/playground", icon: VideoIcon },
  { name: "Generations", href: "/playground/generations", icon: ClockIcon },
  { name: "R2 Browser", href: "/playground/r2", icon: CloudIcon },
  { name: "Cost Tracker", href: "/playground/cost", icon: DashboardIcon },
];

export default function PlaygroundLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100 flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "relative flex flex-col border-r border-zinc-800/50 bg-[#0f0f11]/80 backdrop-blur-xl transition-all duration-300 ease-in-out z-30",
          sidebarOpen ? "w-64" : "w-20",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo area */}
          <div className="h-16 flex items-center px-6 border-b border-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <VideoIcon className="size-5 text-white" />
              </div>
              {sidebarOpen && (
                <span className="font-bold text-lg bg-clip-text text-transparent bg-linear-to-r from-white to-zinc-400">
                  Monga Play
                </span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                      isActive
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50",
                    )
                  }
                >
                  <item.icon
                    className={cn(
                      "size-5 shrink-0 transition-colors",
                      isActive
                        ? "text-indigo-400"
                        : "group-hover:text-zinc-100",
                    )}
                  />
                  {sidebarOpen && (
                    <span className="font-medium text-sm truncate">
                      {item.name}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User profile / Bottom actions */}
          <div className="p-4 border-t border-zinc-800/50 space-y-2">
            <div
              className={cn(
                "flex items-center gap-3 p-2 rounded-xl bg-zinc-800/30 border border-zinc-700/30",
                !sidebarOpen && "justify-center",
              )}
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-zinc-700 to-zinc-800 flex items-center justify-center border border-zinc-600/50 overflow-hidden">
                <UserIcon className="size-5 text-zinc-400" />
              </div>
              {sidebarOpen && (
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-semibold truncate">Team Monga</p>
                  <p className="text-[10px] text-zinc-500 truncate">
                    Internal Access
                  </p>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full flex items-center gap-3 text-zinc-400 hover:text-red-400 hover:bg-red-400/5 justify-start px-3",
                !sidebarOpen && "justify-center",
              )}
            >
              <LogoutIcon className="size-5" />
              {sidebarOpen && <span>Sign Out</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background blobs */}
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

        <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-800/50 backdrop-blur-md sticky top-0 z-20 bg-[#0a0a0b]/50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 text-zinc-400 hover:bg-zinc-800 rounded-md lg:hidden"
            >
              <MenuIcon className="size-5" />
            </button>
            <h1 className="font-semibold text-lg text-zinc-200">
              {navigation.find((item) => item.href === location.pathname)
                ?.name || "Playground"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">
                Systems Online
              </span>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto custom-scrollbar relative">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
