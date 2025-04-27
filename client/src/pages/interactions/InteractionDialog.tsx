
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
import { Interaction, InteractionType } from "@/types";
import { interactionApi, clientApi, projectApi } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

const interactionTypeOptions: { value: InteractionType; label: string }[] = [
  { value: "call", label: "Call" },
  { value: "meeting", label: "Meeting" },
  { value: "email", label: "Email" },
];

const interactionSchema = z.object({
  date: z.string().min(1, "Date is required"),
  type: z.enum(["call", "email", "meeting"] as const),
  notes: z.string().min(1, "Notes are required"),
  client_id: z.string().optional(),
  project_id: z.string().optional(),
});

type InteractionFormValues = z.infer<typeof interactionSchema>;

interface InteractionDialogProps {
  open: boolean;
  onOpenChange: (shouldRefetch: boolean) => void;
  interaction: Interaction | null;
}

const InteractionDialog = ({ open, onOpenChange, interaction }: InteractionDialogProps) => {
  const isEditMode = !!interaction;

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

  // Get the client_id and project_id from the interaction
  const getClientId = () => {
    if (!interaction) return undefined;
    return interaction.client_id || interaction.clientId;
  };

  const getProjectId = () => {
    if (!interaction) return undefined;
    return interaction.project_id || interaction.projectId;
  };

  const form = useForm<InteractionFormValues>({
    resolver: zodResolver(interactionSchema),
    defaultValues: {
      date: interaction?.date ? new Date(interaction.date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
      type: interaction?.type || "meeting",
      notes: interaction?.notes || "",
      client_id: getClientId(),
      project_id: getProjectId(),
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        date: interaction?.date ? new Date(interaction.date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
        type: interaction?.type || "meeting",
        notes: interaction?.notes || "",
        client_id: getClientId(),
        project_id: getProjectId(),
      });
    }
  }, [open, interaction, form]);

  const onSubmit = async (values: InteractionFormValues) => {
    try {
      if (isEditMode && interaction) {
        await interactionApi.update(interaction.id, {
          date: values.date,
          type: values.type,
          notes: values.notes,
          client_id: values.client_id === "none" ? undefined : values.client_id,
          project_id: values.project_id === "none" ? undefined : values.project_id,
        });
        toast.success("Interaction updated successfully");
      } else {
        await interactionApi.create({
          date: values.date,
          type: values.type,
          notes: values.notes,
          client_id: values.client_id === "none" ? undefined : values.client_id,
          project_id: values.project_id === "none" ? undefined : values.project_id,
        });
        toast.success("Interaction created successfully");
      }
      onOpenChange(true);
    } catch (error) {
      console.error("Error saving interaction:", error);
      toast.error(isEditMode ? "Failed to update interaction" : "Failed to create interaction");
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Interaction Log" : "Log New Interaction"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="w-full rounded-md border border-input bg-slate-50 px-3 py-2 text-sm dark:bg-sidebar dark:text-foreground dark:[&::-webkit-calendar-picker-indicator]:filter dark:[&::-webkit-calendar-picker-indicator]:invert"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interaction Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {interactionTypeOptions.map((option) => (
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client (Optional)</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || "none"}
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
                      value={field.value || "none"}
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
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Details about the interaction..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
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

export default InteractionDialog;
