
export type InteractionType = "call" | "meeting" | "email";
export type ProjectStatus = "not_started" | "in_progress" | "on_hold" | "completed" | "cancelled";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  notes?: string;
  createdAt: string;
  userId: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  budget: number;
  deadline: string;
  status: ProjectStatus;
  clientId: string;
  createdAt: string;
  userId: string;
}

export interface Interaction {
  id: string;
  date: string;
  type: InteractionType;
  notes: string;
  clientId?: string;
  projectId?: string;
  createdAt: string;
  userId: string;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  clientId?: string;
  projectId?: string;
  completed: boolean;
  createdAt: string;
  userId: string;
}

export interface DashboardStats {
  totalClients: number;
  totalProjects: number;
  upcomingReminders: number;
  projectsByStatus: Record<ProjectStatus, number>;
}
