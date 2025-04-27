
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageTitle from "@/components/ui/PageTitle";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/services/apiClient";
import { Client } from "@/types";
import { toast } from "sonner";
import ClientDialog from "./ClientDialog";

const ClientsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { 
    data: clients = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['clients'],
    queryFn: clientApi.getAll,
  });

  const handleAddClick = () => {
    setSelectedClient(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await clientApi.delete(id);
        toast.success("Client deleted successfully");
        refetch();
      } catch (error) {
        console.error("Error deleting client:", error);
        toast.error("Failed to delete client");
      }
    }
  };

  const handleDialogClose = (shouldRefetch: boolean) => {
    setIsDialogOpen(false);
    if (shouldRefetch) {
      refetch();
    }
  };

  if (error) {
    toast.error("Failed to load clients");
  }

  return (
    <MainLayout>
      <PageTitle
        title="Clients"
        subtitle="Manage your client relationships"
        action={{
          label: "Add Client",
          onClick: handleAddClick,
        }}
      />
      
      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="p-6 text-center">Loading clients...</div>
        ) : clients.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.company || '-'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditClick(client)}
                    >
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteClick(client.id)}
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
            <h3 className="text-lg font-medium">No clients found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Start by adding your first client using the button above.
            </p>
          </div>
        )}
      </div>

      <ClientDialog 
        open={isDialogOpen} 
        onOpenChange={handleDialogClose} 
        client={selectedClient}
      />
    </MainLayout>
  );
};

export default ClientsPage;
