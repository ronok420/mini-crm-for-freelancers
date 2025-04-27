
import React from "react";
import { Button } from "./button";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle, action, className }) => {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      
      {action && (
        <Button onClick={action.onClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default PageTitle;
