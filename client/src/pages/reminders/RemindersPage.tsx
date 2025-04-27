
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageTitle from "@/components/ui/PageTitle";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { reminderApi, clientApi, projectApi } from "@/services/apiClient";
import { Reminder } from "@/types";
import { toast } from "sonner";
import { Pencil, Trash2, CheckCircle2 } from "lucide-react";
import ReminderDialog from "./ReminderDialog";
import { formatDate } from "@/lib/formatters";

const RemindersPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);

  const { 
    data: reminders = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['reminders'],
    queryFn: reminderApi.getAll,
  });

  // Fetch clients and projects for displaying names
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: clientApi.getAll,
  });
  
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAll,
  });

  const getClientName = (id?: string) => {
    if (!id) return 'N/A';
    const client = clients.find(c => c.id === id);
    return client ? client.name : 'Unknown Client';
  };

  const getProjectTitle = (id?: string) => {
    if (!id) return 'N/A';
    const project = projects.find(p => p.id === id);
    return project ? project.title : 'Unknown Project';
  };

  const handleAddClick = () => {
    setSelectedReminder(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this reminder?")) {
      try {
        await reminderApi.delete(id);
        toast.success("Reminder deleted successfully");
        refetch();
      } catch (error) {
        console.error("Error deleting reminder:", error);
        toast.error("Failed to delete reminder");
      }
    }
  };

  const handleDialogClose = (shouldRefetch: boolean) => {
    setIsDialogOpen(false);
    if (shouldRefetch) {
      refetch();
    }
  };

  // Function to check if a date is in the past
  const isPastDue = (dateString: string): boolean => {
    if (!dateString) return false;
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day for proper comparison
      const dueDate = new Date(dateString);
      return dueDate < today;
    } catch (e) {
      console.error("Error parsing date:", e);
      return false;
    }
  };

  if (error) {
    console.error("Error fetching reminders:", error);
    toast.error("Failed to load reminders");
  }

  return (
    <MainLayout>
      <PageTitle
        title="Reminders"
        subtitle="Keep track of important tasks and deadlines"
        action={{
          label: "Add Reminder",
          onClick: handleAddClick,
        }}
      />
      
      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="p-6 text-center">Loading reminders...</div>
        ) : reminders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Due Date</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reminders.map((reminder) => {
                // Use either due_date or dueDate depending on what's available
                const dueDateValue = reminder.due_date || reminder.dueDate;
                console.log("Reminder date value:", dueDateValue, reminder);
                
                return (
                  <TableRow key={reminder.id} className={isPastDue(dueDateValue) ? "bg-red-50 dark:bg-red-950/20" : ""}>
                    <TableCell>
                      <span className={isPastDue(dueDateValue) ? "text-red-600 dark:text-red-400 font-medium" : ""}>
                        {formatDate(dueDateValue)}
                      </span>
                      {isPastDue(dueDateValue) && (
                        <span className="ml-2 text-xs text-red-600 dark:text-red-400 font-medium">
                          (Past due)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {reminder.note || reminder.description || reminder.title || "No description"}
                    </TableCell>
                    <TableCell>{getClientName(reminder.client_id || reminder.clientId)}</TableCell>
                    <TableCell>{getProjectTitle(reminder.project_id || reminder.projectId)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditClick(reminder)}
                      >
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteClick(reminder.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium">Your reminders will appear here</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Start by adding your first reminder using the button above.
            </p>
          </div>
        )}
      </div>

      <ReminderDialog 
        open={isDialogOpen} 
        onOpenChange={handleDialogClose} 
        reminder={selectedReminder}
      />
    </MainLayout>
  );
};

export default RemindersPage;
