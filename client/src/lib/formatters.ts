
import { ProjectStatus } from "../types";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | null | undefined): string {
  // Handle null, undefined, empty string or invalid date
  if (!dateString) return "N/A";
  
  // Try to create a valid date object
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatStatus(status: ProjectStatus | string): string {
  const statusMap: Record<string, string> = {
    'planned': 'Planned',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'not_started': 'Not Started',
    'on_hold': 'On Hold',
  };
  
  return statusMap[status] || status;
}

export function formatInteractionType(type: string): string {
  const typeMap: Record<string, string> = {
    'call': 'Call',
    'email': 'Email',
    'meeting': 'Meeting',
  };
  
  return typeMap[type] || type;
}
