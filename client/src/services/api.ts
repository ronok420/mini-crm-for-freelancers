
import { Client, Project, Interaction, Reminder, DashboardStats, ProjectStatus } from "../types";

// Helper to get userId from stored user
const getUserId = (): string => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user).id : "";
};

// Mock data generators
const generateClients = (count = 8): Client[] => {
  const userId = getUserId();
  return Array.from({ length: count }, (_, i) => ({
    id: `client-${i + 1}`,
    name: `Client ${i + 1}`,
    email: `client${i + 1}@example.com`,
    phone: `+1 (555) ${100 + i}-${1000 + i}`,
    company: i % 3 === 0 ? `Company ${i + 1}` : undefined,
    notes: i % 2 === 0 ? `Notes about client ${i + 1}` : undefined,
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    userId,
  }));
};

const projectStatuses: ProjectStatus[] = ["not_started", "in_progress", "on_hold", "completed", "cancelled"];

const generateProjects = (count = 12): Project[] => {
  const userId = getUserId();
  const clients = generateClients();
  
  return Array.from({ length: count }, (_, i) => ({
    id: `project-${i + 1}`,
    title: `Project ${i + 1}`,
    description: i % 2 === 0 ? `Description for project ${i + 1}` : undefined,
    budget: Math.floor(Math.random() * 10000) + 1000,
    deadline: new Date(Date.now() + (i % 5) * 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: projectStatuses[i % projectStatuses.length],
    client_id: clients[i % clients.length].id, // Fix for missing client_id property
    clientId: clients[i % clients.length].id, // Keep clientId for API compatibility
    createdAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
    userId,
  }));
};

const interactionTypes: ("call" | "meeting" | "email")[] = ["call", "meeting", "email"];

const generateInteractions = (count = 20): Interaction[] => {
  const userId = getUserId();
  const clients = generateClients();
  const projects = generateProjects();
  
  return Array.from({ length: count }, (_, i) => ({
    id: `interaction-${i + 1}`,
    date: new Date(Date.now() - i * 6 * 60 * 60 * 1000).toISOString(),
    type: interactionTypes[i % interactionTypes.length],
    notes: `Notes from ${interactionTypes[i % interactionTypes.length]} interaction ${i + 1}`,
    client_id: i % 2 === 0 ? clients[i % clients.length].id : undefined,
    project_id: i % 2 === 1 ? projects[i % projects.length].id : undefined,
    clientId: i % 2 === 0 ? clients[i % clients.length].id : undefined,
    projectId: i % 2 === 1 ? projects[i % projects.length].id : undefined,
    createdAt: new Date(Date.now() - i * 6 * 60 * 60 * 1000).toISOString(),
    userId,
  }));
};

const generateReminders = (count = 15): Reminder[] => {
  const userId = getUserId();
  const clients = generateClients();
  const projects = generateProjects();
  
  return Array.from({ length: count }, (_, i) => ({
    id: `reminder-${i + 1}`,
    title: `Reminder ${i + 1}`,
    description: i % 2 === 0 ? `Description for reminder ${i + 1}` : undefined,
    dueDate: new Date(Date.now() + (i % 10) * 24 * 60 * 60 * 1000).toISOString(),
    clientId: i % 3 === 0 ? clients[i % clients.length].id : undefined,
    projectId: i % 3 === 1 ? projects[i % projects.length].id : undefined,
    completed: i % 4 === 0,
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    userId,
  }));
};

const generateDashboardStats = (): DashboardStats => {
  const projects = generateProjects();
  
  const projectsByStatus = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<ProjectStatus, number>);
  
  // Ensure all statuses have a value
  projectStatuses.forEach(status => {
    if (!projectsByStatus[status]) {
      projectsByStatus[status] = 0;
    }
  });
  
  return {
    totalClients: generateClients().length,
    totalProjects: projects.length,
    remindersDue: generateReminders().filter(r => !r.completed).length,
    upcomingReminders: generateReminders().filter(r => !r.completed).length, // Keep both properties for compatibility
    projectsByStatus,
  };
};

// Simulated API calls with delayed responses
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Client API
export const clientApi = {
  getAll: async (): Promise<Client[]> => {
    await delay(500);
    return generateClients();
  },
  
  getById: async (id: string): Promise<Client> => {
    await delay(300);
    const client = generateClients().find(c => c.id === id);
    if (!client) throw new Error("Client not found");
    return client;
  },
  
  create: async (data: Omit<Client, "id" | "createdAt" | "userId">): Promise<Client> => {
    await delay(700);
    const userId = getUserId();
    return {
      id: `client-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      userId,
    };
  },
  
  update: async (id: string, data: Partial<Omit<Client, "id" | "userId">>): Promise<Client> => {
    await delay(500);
    const client = await clientApi.getById(id);
    return { ...client, ...data };
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(600);
    // In a real API, this would delete the client
  },
};

// Project API
export const projectApi = {
  getAll: async (): Promise<Project[]> => {
    await delay(600);
    return generateProjects();
  },
  
  getByClient: async (clientId: string): Promise<Project[]> => {
    await delay(400);
    return generateProjects().filter(p => p.clientId === clientId);
  },
  
  getById: async (id: string): Promise<Project> => {
    await delay(300);
    const project = generateProjects().find(p => p.id === id);
    if (!project) throw new Error("Project not found");
    return project;
  },
  
  create: async (data: Omit<Project, "id" | "createdAt" | "userId">): Promise<Project> => {
    await delay(700);
    const userId = getUserId();
    return {
      id: `project-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      userId,
    };
  },
  
  update: async (id: string, data: Partial<Omit<Project, "id" | "userId">>): Promise<Project> => {
    await delay(500);
    const project = await projectApi.getById(id);
    return { ...project, ...data };
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(600);
    // In a real API, this would delete the project
  },
};

// Interaction API
export const interactionApi = {
  getAll: async (): Promise<Interaction[]> => {
    await delay(500);
    return generateInteractions();
  },
  
  getByClient: async (clientId: string): Promise<Interaction[]> => {
    await delay(400);
    return generateInteractions().filter(i => i.clientId === clientId);
  },
  
  getByProject: async (projectId: string): Promise<Interaction[]> => {
    await delay(400);
    return generateInteractions().filter(i => i.projectId === projectId);
  },
  
  getById: async (id: string): Promise<Interaction> => {
    await delay(300);
    const interaction = generateInteractions().find(i => i.id === id);
    if (!interaction) throw new Error("Interaction not found");
    return interaction;
  },
  
  create: async (data: Omit<Interaction, "id" | "createdAt" | "userId">): Promise<Interaction> => {
    await delay(600);
    const userId = getUserId();
    return {
      id: `interaction-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      userId,
    };
  },
  
  update: async (id: string, data: Partial<Omit<Interaction, "id" | "userId">>): Promise<Interaction> => {
    await delay(500);
    const interaction = await interactionApi.getById(id);
    return { ...interaction, ...data };
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(500);
    // In a real API, this would delete the interaction
  },
};

// Reminder API
export const reminderApi = {
  getAll: async (): Promise<Reminder[]> => {
    await delay(500);
    return generateReminders();
  },
  
  getUpcoming: async (): Promise<Reminder[]> => {
    await delay(400);
    const now = new Date();
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return generateReminders().filter(r => {
      const dueDate = new Date(r.dueDate);
      return !r.completed && dueDate >= now && dueDate <= weekLater;
    });
  },
  
  getByClient: async (clientId: string): Promise<Reminder[]> => {
    await delay(400);
    return generateReminders().filter(r => r.clientId === clientId);
  },
  
  getByProject: async (projectId: string): Promise<Reminder[]> => {
    await delay(400);
    return generateReminders().filter(r => r.projectId === projectId);
  },
  
  getById: async (id: string): Promise<Reminder> => {
    await delay(300);
    const reminder = generateReminders().find(r => r.id === id);
    if (!reminder) throw new Error("Reminder not found");
    return reminder;
  },
  
  create: async (data: Omit<Reminder, "id" | "createdAt" | "userId">): Promise<Reminder> => {
    await delay(600);
    const userId = getUserId();
    return {
      id: `reminder-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      userId,
    };
  },
  
  update: async (id: string, data: Partial<Omit<Reminder, "id" | "userId">>): Promise<Reminder> => {
    await delay(500);
    const reminder = await reminderApi.getById(id);
    return { ...reminder, ...data };
  },
  
  toggleComplete: async (id: string): Promise<Reminder> => {
    await delay(300);
    const reminder = await reminderApi.getById(id);
    return { ...reminder, completed: !reminder.completed };
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(500);
    // In a real API, this would delete the reminder
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    await delay(800);
    return generateDashboardStats();
  },
};
