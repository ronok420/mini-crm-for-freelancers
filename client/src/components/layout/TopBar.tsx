
import React from "react";
import { Bell, User, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ThemeToggle from "../ui/ThemeToggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const TopBar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6 bg-background">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold hidden sm:block">Freelancer Mini-CRM</h1>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        <ThemeToggle />
        
        <Button variant="ghost" size="icon">
          <Bell size={20} />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : "US"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block">{user?.name || "User"}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48" align="end">
            <div className="space-y-2">
              <div className="font-medium">{user?.name || "User"}</div>
              <div className="text-sm text-muted-foreground">{user?.email || "user@example.com"}</div>
              <div className="pt-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive" 
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default TopBar;