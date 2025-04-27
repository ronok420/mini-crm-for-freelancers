
import React from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../../contexts/ThemeContext";
import { toast } from "sonner";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
    toast.success(`Switched to ${theme === "light" ? "dark" : "light"} mode`);
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleToggle}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </Button>
  );
};

export default ThemeToggle;
