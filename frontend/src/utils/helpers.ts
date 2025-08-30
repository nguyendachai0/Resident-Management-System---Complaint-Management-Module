import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: string | Date, formatStr = 'MMM dd, yyyy') => {
  return format(new Date(date), formatStr);
};

export const formatRelativeTime = (date: string | Date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-800';
    case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
    case 'RESOLVED': return 'bg-green-100 text-green-800';
    case 'CLOSED': return 'bg-gray-100 text-gray-800';
    default: return 'bg-red-100 text-red-800';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'LOW': return 'bg-gray-100 text-gray-800';
    case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
    case 'HIGH': return 'bg-orange-100 text-orange-800';
    case 'URGENT': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-800';
    case 'BUILDING_MANAGER': return 'bg-blue-100 text-blue-800';
    case 'STAFF': return 'bg-green-100 text-green-800';
    case 'RESIDENT': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};