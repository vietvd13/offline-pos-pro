
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Store, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings, 
  BarChart, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { useState } from "react";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

const SidebarItem = ({ to, icon, label, isCollapsed }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <Link
      to={to}
      className={cn(
        "pos-sidebar-item",
        isActive && "active"
      )}
    >
      <span className="text-xl">{icon}</span>
      {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "h-screen bg-sidebar transition-all duration-300 flex flex-col sticky top-0",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-white">POS Pro</span>
          </Link>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="text-white p-1 hover:bg-sidebar-accent rounded-full ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex flex-col gap-1 p-2 flex-1 overflow-auto">
        <SidebarItem to="/" icon={<Home size={20} />} label="Dashboard" isCollapsed={collapsed} />
        <SidebarItem to="/branches" icon={<Store size={20} />} label="Branches" isCollapsed={collapsed} />
        <SidebarItem to="/pos" icon={<ShoppingCart size={20} />} label="POS Terminal" isCollapsed={collapsed} />
        <SidebarItem to="/products" icon={<Package size={20} />} label="Products" isCollapsed={collapsed} />
        <SidebarItem to="/users" icon={<Users size={20} />} label="Users" isCollapsed={collapsed} />
        <SidebarItem to="/reports" icon={<BarChart size={20} />} label="Reports" isCollapsed={collapsed} />
        <SidebarItem to="/settings" icon={<Settings size={20} />} label="Settings" isCollapsed={collapsed} />
      </div>

      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="text-xs text-gray-300">
            <p>Offline POS Pro v1.0</p>
          </div>
        )}
      </div>
    </div>
  );
}
