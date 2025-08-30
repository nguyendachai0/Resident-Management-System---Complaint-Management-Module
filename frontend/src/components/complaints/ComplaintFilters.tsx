import React from 'react';
import { Search, Filter } from 'lucide-react';

interface ComplaintFiltersProps {
  filters: {
    search: string;
    status: string;
    category: string;
    priority: string;
  };
  onFilterChange: (filters: any) => void;
}

const ComplaintFilters: React.FC<ComplaintFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search complaints..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="input-field pl-10"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="input-field"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className="input-field"
        >
          <option value="">All Categories</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="UTILITIES">Utilities</option>
          <option value="NOISE">Noise</option>
          <option value="SECURITY">Security</option>
          <option value="FACILITIES">Facilities</option>
          <option value="OTHER">Other</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value })}
          className="input-field"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>
    </div>
  );
};

export default ComplaintFilters;