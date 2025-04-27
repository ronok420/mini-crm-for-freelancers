
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageTitle from "@/components/ui/PageTitle";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { interactionApi, clientApi, projectApi } from "@/services/apiClient";
import { Interaction } from "@/types";
import { toast } from "sonner";
import { Pencil, Trash2, MessageCircle, Phone, Mail } from "lucide-react";
import InteractionDialog from "./InteractionDialog";
import { formatDate, formatInteractionType } from "@/lib/formatters";

const InteractionsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null);

  const { 
    data: interactions = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['interactions'],
    queryFn: interactionApi.getAll,
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
    
    // Check both client_id and clientId fields to ensure compatibility
    const client = clients.find(c => c.id === id);
    return client ? client.name : 'Unknown Client';
  };

  const getProjectTitle = (id?: string) => {
    if (!id) return 'N/A';
    
    // Check both project_id and projectId fields to ensure compatibility
    const project = projects.find(p => p.id === id);
    return project ? project.title : 'Unknown Project';
  };

  const handleAddClick = () => {
    setSelectedInteraction(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (interaction: Interaction) => {
    setSelectedInteraction(interaction);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this interaction?")) {
      try {
        await interactionApi.delete(id);
        toast.success("Interaction deleted successfully");
        refetch();
      } catch (error) {
        console.error("Error deleting interaction:", error);
        toast.error("Failed to delete interaction");
      }
    }
  };

  const handleDialogClose = (shouldRefetch: boolean) => {
    setIsDialogOpen(false);
    if (shouldRefetch) {
      refetch();
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <MessageCircle className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  if (error) {
    toast.error("Failed to load interactions");
  }

  return (
    <MainLayout>
      <PageTitle
        title="Interactions"
        subtitle="Log your client communications"
        action={{
          label: "Log Interaction",
          onClick: handleAddClick,
        }}
      />
      
      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="p-6 text-center">Loading interactions...</div>
        ) : interactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interactions.map((interaction) => (
                <TableRow key={interaction.id}>
                  <TableCell>{formatDate(interaction.date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getInteractionIcon(interaction.type)}
                      <span className="ml-2">{formatInteractionType(interaction.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getClientName(interaction.client_id || interaction.clientId)}
                  </TableCell>
                  <TableCell>
                    {getProjectTitle(interaction.project_id || interaction.projectId)}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{interaction.notes}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditClick(interaction)}
                    >
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteClick(interaction.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium">Your interactions will appear here</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Start by logging your first interaction using the button above.
            </p>
          </div>
        )}
      </div>

      <InteractionDialog 
        open={isDialogOpen} 
        onOpenChange={handleDialogClose} 
        interaction={selectedInteraction}
      />
    </MainLayout>
  );
};

export default InteractionsPage;
