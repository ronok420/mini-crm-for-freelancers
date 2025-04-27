
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Users, 
  Folder, 
  Clock, 
  MessageSquare 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Clients", path: "/clients", icon: Users },
    { name: "Projects", path: "/projects", icon: Folder },
    { name: "Reminders", path: "/reminders", icon: Clock },
    { name: "Interactions", path: "/interactions", icon: MessageSquare },
  ];

  return (
    <aside 
      className={cn(
        "bg-sidebar h-screen flex flex-col border-r border-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!collapsed && (
          <span className="text-xl font-semibold text-sidebar-foreground">FreeCRM</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground ml-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center py-2 px-3 rounded-md transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                    collapsed && "justify-center px-0"
                  )
                }
              >
                <item.icon size={20} className={cn("flex-shrink-0", !collapsed && "mr-3")} />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
