
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
import { Project, ProjectStatus } from "@/types";
import { projectApi, clientApi } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "not_started", label: "Not Started" },
  { value: "on_hold", label: "On Hold" },
];

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  client_id: z.string().min(1, "Client is required"),
  budget: z.coerce.number().min(0, "Budget must be a positive number"),
  deadline: z.string().min(1, "Deadline is required"),
  status: z.enum(["planned", "in_progress", "completed", "cancelled", "not_started", "on_hold"]),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (shouldRefetch: boolean) => void;
  project: Project | null;
}

const ProjectDialog = ({ open, onOpenChange, project }: ProjectDialogProps) => {
  const isEditMode = !!project;

  // Query clients for the dropdown
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: clientApi.getAll,
    enabled: open, // Only fetch when dialog is open
  });

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      client_id: project?.client_id || "",
      budget: project?.budget || 0,
      deadline: project?.deadline ? new Date(project.deadline).toISOString().substring(0, 10) : "",
      status: (project?.status as "planned" | "in_progress" | "completed" | "cancelled" | "not_started" | "on_hold") || "planned",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        title: project?.title || "",
        description: project?.description || "",
        client_id: project?.client_id || "",
        budget: project?.budget || 0,
        deadline: project?.deadline ? new Date(project.deadline).toISOString().substring(0, 10) : "",
        status: (project?.status as "planned" | "in_progress" | "completed" | "cancelled" | "not_started" | "on_hold") || "planned",
      });
    }
  }, [open, project, form]);

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      if (isEditMode && project) {
        await projectApi.update(project.id, {
          title: values.title,
          description: values.description,
          client_id: values.client_id,
          budget: values.budget,
          deadline: values.deadline,
          status: values.status,
        });
        toast.success("Project updated successfully");
      } else {
        await projectApi.create({
          title: values.title,
          description: values.description,
          client_id: values.client_id,
          budget: values.budget,
          deadline: values.deadline,
          status: values.status,
        });
        toast.success("Project created successfully");
      }
      onOpenChange(true);
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error(isEditMode ? "Failed to update project" : "Failed to create project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Project" : "Add Project"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Project description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="100" {...field} 
                      
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="w-full rounded-md border border-input bg-slate-50 px-3 py-2 text-sm dark:bg-sidebar dark:text-foreground dark:[&::-webkit-calendar-picker-indicator]:filter dark:[&::-webkit-calendar-picker-indicator]:invert"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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

export default ProjectDialog;