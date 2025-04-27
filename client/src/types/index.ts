
export type User = {
  id: string;
  email: string;
  name: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  notes?: string;
  createdAt?: string;
  userId?: string;
};

export type ProjectStatus = 
  | "planned" 
  | "in_progress" 
  | "completed" 
  | "cancelled"
  | "not_started"
  | "on_hold";

export type Project = {
  id: string;
  title: string;
  description?: string;
  budget: number;
  deadline: string;
  status: ProjectStatus;
  client_id: string;
  clientId?: string; // For API compatibility
  createdAt?: string;
  userId?: string;
};

export type InteractionType = "call" | "meeting" | "email";

export type Interaction = {
  id: string;
  date: string;
  type: InteractionType;
  notes: string;
  client_id?: string;
  project_id?: string;
  clientId?: string; // For API compatibility
  projectId?: string; // For API compatibility
  createdAt?: string;
  userId?: string;
};

export type Reminder = {
  id: string;
  note?: string;
  due_date?: string;
  client_id?: string;
  project_id?: string;
  clientId?: string; // For API compatibility
  projectId?: string; // For API compatibility
  dueDate?: string; // For API compatibility
  title?: string; // For API compatibility
  description?: string; // For API compatibility
  completed: boolean;
  createdAt?: string;
  userId?: string;
};

export type DashboardStats = {
  totalClients: number;
  totalProjects: number;
  remindersDue: number;
  upcomingReminders?: number; // For API compatibility
  projectsByStatus: {
    planned: number;
    in_progress: number;
    completed: number;
    cancelled: number;
    not_started: number;
    on_hold: number;
  };
};
