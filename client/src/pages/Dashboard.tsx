
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { dashboardApi, clientApi, projectApi, reminderApi, interactionApi } from '../services/apiClient';
import { DashboardStats, Project, Client, Reminder, Interaction } from '../types';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Calendar, Clock, Folder, PlusCircle, Users } from 'lucide-react';
import PageTitle from '@/components/ui/PageTitle';
import { formatCurrency, formatDate, formatStatus } from '@/lib/formatters';

const Dashboard = () => {
  // Fetch dashboard stats
  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => dashboardApi.getSummary(),
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to load dashboard stats', {
          description: error.message
        });
      }
    }
  });

  // Fetch recent clients
  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients', 'recent'],
    queryFn: () => clientApi.getAll(),
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to load recent clients');
      }
    }
  });

  // Fetch recent projects
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects', 'recent'],
    queryFn: () => projectApi.getAll(),
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to load recent projects');
      }
    }
  });

  // Fetch upcoming reminders
  const { data: reminders, isLoading: isLoadingReminders } = useQuery({
    queryKey: ['reminders', 'upcoming'],
    queryFn: () => reminderApi.getThisWeek(),
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to load upcoming reminders');
      }
    }
  });

  // Fetch recent interactions
  const { data: interactions, isLoading: isLoadingInteractions } = useQuery({
    queryKey: ['interactions', 'recent'],
    queryFn: () => interactionApi.getAll(),
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to load recent interactions');
      }
    }
  });

  const isLoading = isLoadingStats || isLoadingClients || isLoadingProjects || isLoadingReminders || isLoadingInteractions;

  // Get recent clients, projects, reminders (limited to 5)
  const recentClients = clients?.slice(0, 5) || [];
  const recentProjects = projects?.slice(0, 5) || [];
  const upcomingReminders = reminders?.slice(0, 5) || [];
  const recentInteractions = interactions?.slice(0, 5) || [];

  return (
    <MainLayout>
      <PageTitle 
        title="Dashboard" 
        subtitle="Overview of your freelance business"
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading dashboard data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats?.totalClients || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <Folder className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats?.totalProjects || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Reminders Due</CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats?.remindersDue || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
                <BadgeCheck className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats?.projectsByStatus.completed || 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Projects by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Projects by Status</CardTitle>
              <CardDescription>Current project distribution by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                {dashboardStats && Object.entries(dashboardStats.projectsByStatus).map(([status, count]) => (
                  <div key={status} className="flex flex-col items-center p-3 border rounded-md">
                    <span className="text-sm text-muted-foreground">{formatStatus(status)}</span>
                    <span className="text-2xl font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Recent Clients */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Clients</CardTitle>
                  <CardDescription>Your most recent clients</CardDescription>
                </div>
                <Link to="/clients">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentClients.length > 0 ? (
                  <div className="space-y-4">
                    {recentClients.map((client: Client) => (
                      <div key={client.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                        <Link to={`/clients/`}>
                          <Button variant="ghost" size="sm">Details</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">No clients found</p>
                )}
              </CardContent>
              <CardFooter>
                {/* <Link to="/clients/new" className="w-full">
                  <Button className="w-full" variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Client
                  </Button>
                </Link> */}
              </CardFooter>
            </Card>

            {/* Recent Projects */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Your active projects</CardDescription>
                </div>
                <Link to="/projects">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentProjects.length > 0 ? (
                  <div className="space-y-4">
                    {recentProjects.map((project: Project) => (
                      <div key={project.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{formatCurrency(project.budget)}</span>
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">
                              {formatStatus(project.status)}
                            </span>
                          </div>
                        </div>
                        <Link to={`/projects`}>
                          <Button variant="ghost" size="sm">Details</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">No projects found</p>
                )}
              </CardContent>
              {/* <CardFooter>
                <Link to="/projects/new" className="w-full">
                  <Button className="w-full" variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Project
                  </Button>
                </Link>
              </CardFooter> */}
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Upcoming Reminders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Upcoming Reminders</CardTitle>
                  <CardDescription>Reminders for this week</CardDescription>
                </div>
                <Link to="/reminders">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {upcomingReminders.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingReminders.map((reminder: Reminder) => (
                      <div key={reminder.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div>
                          <p className="font-medium">{reminder.note}</p>
                          <p className="text-sm text-muted-foreground">Due: {formatDate(reminder.due_date)}</p>
                        </div>
                        <Link to={`/reminders`}>
                          <Button variant="ghost" size="sm">Details</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">No upcoming reminders</p>
                )}
              </CardContent>
              <CardFooter>
                {/* <Link to="/reminders/new" className="w-full">
                  <Button className="w-full" variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Reminder
                  </Button>
                </Link> */}
              </CardFooter>
            </Card>

            {/* Recent Interactions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Interactions</CardTitle>
                  <CardDescription>Your latest client interactions</CardDescription>
                </div>
                <Link to="/interactions">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentInteractions.length > 0 ? (
                  <div className="space-y-4">
                    {recentInteractions.map((interaction: Interaction) => (
                      <div key={interaction.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div>
                          <p className="font-medium">{interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(interaction.date)}</p>
                        </div>
                        <Link to={`/interactions`}>
                          <Button variant="ghost" size="sm">Details</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">No recent interactions</p>
                )}
              </CardContent>
              <CardFooter>
                {/* <Link to="/interactions/new" className="w-full">
                  <Button className="w-full" variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Log Interaction
                  </Button>
                </Link> */}
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Dashboard;