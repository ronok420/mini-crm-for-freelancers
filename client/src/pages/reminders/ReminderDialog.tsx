
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Reminder } from "@/types";
import { reminderApi, clientApi, projectApi } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

const reminderSchema = z.object({
  note: z.string().min(1, "Note is required"),
  due_date: z.string().min(1, "Due date is required"),
  client_id: z.string().optional(),
  project_id: z.string().optional(),
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (shouldRefetch: boolean) => void;
  reminder: Reminder | null;
}

const ReminderDialog = ({ open, onOpenChange, reminder }: ReminderDialogProps) => {
  const isEditMode = !!reminder;

  // Query clients and projects for the dropdowns
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: clientApi.getAll,
    enabled: open,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAll,
    enabled: open,
  });

  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      note: reminder?.note || "",
      due_date: reminder?.due_date ? new Date(reminder.due_date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
      client_id: reminder?.client_id || undefined,
      project_id: reminder?.project_id || undefined,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        note: reminder?.note || "",
        due_date: reminder?.due_date ? new Date(reminder.due_date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
        client_id: reminder?.client_id || undefined,
        project_id: reminder?.project_id || undefined,
      });
    }
  }, [open, reminder, form]);

  const onSubmit = async (values: ReminderFormValues) => {
    try {
      if (isEditMode && reminder) {
        await reminderApi.update(reminder.id, {
          note: values.note,
          due_date: values.due_date,
          client_id: values.client_id,
          project_id: values.project_id,
        });
        toast.success("Reminder updated successfully");
      } else {
        await reminderApi.create({
          note: values.note,
          due_date: values.due_date,
          client_id: values.client_id,
          project_id: values.project_id,
        });
        toast.success("Reminder created successfully");
      }
      onOpenChange(true);
    } catch (error) {
      console.error("Error saving reminder:", error);
      toast.error(isEditMode ? "Failed to update reminder" : "Failed to create reminder");
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Reminder" : "Add Reminder"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Reminder details..." 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="w-full rounded-md border border-input bg-slate-50 px-3 py-2 text-sm dark:bg-sidebar dark:text-foreground dark:[&::-webkit-calendar-picker-indicator]:filter dark:[&::-webkit-calendar-picker-indicator]:invert" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client (Optional)</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="project_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project (Optional)</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : isEditMode ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderDialog;