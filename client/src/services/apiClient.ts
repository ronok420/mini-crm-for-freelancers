

import axios from 'axios';
import { Client, Project, Interaction, Reminder, DashboardStats } from '../types';

// const API_URL = 'http://localhost:5000';
const API_URL = 'https://crm-backend-yrsk.onrender.com';


// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  signup: async (email: string, password: string, name: string) => {
    const response = await api.post('/api/auth/signup', { email, password, name });
    return response.data;
  }
};

// Client API
export const clientApi = {
  getAll: async () => {
    const response = await api.get('/api/clients');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/api/clients/${id}`);
    return response.data;
  },

  create: async (data: Omit<Client, 'id'>) => {
    const response = await api.post('/api/clients', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Client>) => {
    const response = await api.put(`/api/clients/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/clients/${id}`);
    return response.data;
  }
};

// Project API
export const projectApi = {
  getAll: async () => {
    const response = await api.get('/api/projects');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  },

  create: async (data: {
    title: string;
    description?: string;
    client_id: string;
    budget: number;
    deadline: string;
    status: string;
  }) => {
    const response = await api.post('/api/projects', data);
    return response.data;
  },

  update: async (id: string, data: Partial<{
    title: string;
    description?: string;
    client_id: string;
    budget: number;
    deadline: string;
    status: string;
  }>) => {
    const response = await api.put(`/api/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/projects/${id}`);
    return response.data;
  }
};

// Interaction API
export const interactionApi = {
  getAll: async () => {
    const response = await api.get('/api/logs');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/api/logs/${id}`);
    return response.data;
  },

  create: async (data: {
    project_id?: string;
    client_id?: string;
    date: string;
    type: 'call' | 'email' | 'meeting';
    notes: string;
  }) => {
    const response = await api.post('/api/logs', data);
    return response.data;
  },

  update: async (id: string, data: Partial<{
    project_id?: string;
    client_id?: string;
    date: string;
    type: 'call' | 'email' | 'meeting';
    notes: string;
  }>) => {
    const response = await api.put(`/api/logs/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/logs/${id}`);
    return response.data;
  }
};

// Reminder API
export const reminderApi = {
  getAll: async () => {
    const response = await api.get('/api/reminders');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/api/reminders/${id}`);
    return response.data;
  },

  getThisWeek: async () => {
    const response = await api.get('/api/reminders/this-week');
    return response.data;
  },

  create: async (data: {
    note: string;
    due_date: string;
    client_id?: string;
    project_id?: string;
  }) => {
    const response = await api.post('/api/reminders', data);
    return response.data;
  },

  update: async (id: string, data: Partial<{
    note: string;
    due_date: string;
    client_id?: string;
    project_id?: string;
  }>) => {
    const response = await api.put(`/api/reminders/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/reminders/${id}`);
    return response.data;
  }
};

// Dashboard API
export const dashboardApi = {
  getSummary: async () => {
    const response = await api.get('/api/dashboard/');
    return response.data as DashboardStats;
  }
};

export default api;