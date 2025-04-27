
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageTitle from "@/components/ui/PageTitle";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { projectApi } from "@/services/apiClient";
import { Project } from "@/types";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import ProjectDialog from "./ProjectDialog";
import { formatCurrency, formatDate, formatStatus } from "@/lib/formatters";

const ProjectsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { 
    data: projects = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAll,
  });

  const handleAddClick = () => {
    setSelectedProject(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectApi.delete(id);
        toast.success("Project deleted successfully");
        refetch();
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project");
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
    toast.error("Failed to load projects");
  }

  return (
    <MainLayout>
      <PageTitle
        title="Projects"
        subtitle="Manage your client projects"
        action={{
          label: "New Project",
          onClick: handleAddClick,
        }}
      />
      
      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="p-6 text-center">Loading projects...</div>
        ) : projects.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{formatCurrency(project.budget)}</TableCell>
                  <TableCell>{formatDate(project.deadline)}</TableCell>
                  <TableCell>
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditClick(project)}
                    >
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteClick(project.id)}
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
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Start by adding your first project using the button above.
            </p>
          </div>
        )}
      </div>

      <ProjectDialog 
        open={isDialogOpen} 
        onOpenChange={handleDialogClose} 
        project={selectedProject}
      />
    </MainLayout>
  );
};

const StatusBadge = ({ status }: { status: Project['status'] }) => {
  const statusColors: Record<string, string> = {
    'planned': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
      {formatStatus(status)}
    </span>
  );
};

export default ProjectsPage;
