import { useState } from 'react';
import { Ban, UserCheck, Trash2, ChevronLeft, ChevronRight, Mail, Calendar, Target, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { UserData, ProblemProgress } from '../../services/AdminService';

interface UserManagementProps {
  users: UserData[];
  total: number;
  currentPage: number;
  pageSize: number;
  userProgress: Record<string, ProblemProgress>;
  loading: boolean;
  sortField: string | null;
  sortDirection: 'asc' | 'desc' | null;
  onSortChange: (field: string | null, direction: 'asc' | 'desc' | null) => void;
  onToggleBlock: (userId: string, currentStatus: boolean) => void;
  onToggleAdmin: (userId: string, currentStatus: boolean) => void;
  onDeleteUser: (userId: string) => void;
  onPageChange: (page: number) => void;
}

type SortField = 'name' | 'email' | 'joined' | 'solved' | 'attempts' | 'role';

export function UserManagement({
  users,
  total,
  currentPage,
  pageSize,
  userProgress,
  loading,
  sortField,
  sortDirection,
  onSortChange,
  onToggleBlock,
  onToggleAdmin,
  onDeleteUser,
  onPageChange
}: UserManagementProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const totalPages = Math.ceil(total / pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        onSortChange(field, 'desc');
      } else if (sortDirection === 'desc') {
        onSortChange(null, null);
      }
    } else {
      onSortChange(field, 'asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    }
    return sortDirection === 'asc'
      ? <ArrowUp className="w-3 h-3 text-cyan-400" />
      : <ArrowDown className="w-3 h-3 text-cyan-400" />;
  };

  const handleDelete = (userId: string) => {
    if (deleteConfirm === userId) {
      onDeleteUser(userId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(userId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Table Header */}
      <div className="border-b mb-3" style={{ borderColor: 'var(--border-color)' }}>
        <div className="grid grid-cols-12 gap-3 px-3 py-2 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          <button
            onClick={() => handleSort('name')}
            className="col-span-2 flex items-center gap-1 hover:text-cyan-400 transition-colors text-left"
          >
            Name <SortIcon field="name" />
          </button>
          <button
            onClick={() => handleSort('email')}
            className="col-span-2 flex items-center gap-1 hover:text-cyan-400 transition-colors text-left"
          >
            Email <SortIcon field="email" />
          </button>
          <button
            onClick={() => handleSort('joined')}
            className="col-span-2 flex items-center gap-1 hover:text-cyan-400 transition-colors text-left"
          >
            Joined <SortIcon field="joined" />
          </button>
          <div className="col-span-2 flex items-center justify-center gap-2">
            <button
              onClick={() => handleSort('solved')}
              className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
            >
              Solved <SortIcon field="solved" />
            </button>
            <span>|</span>
            <button
              onClick={() => handleSort('attempts')}
              className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
            >
              Attempts <SortIcon field="attempts" />
            </button>
          </div>
          <button
            onClick={() => handleSort('role')}
            className="col-span-1 flex items-center justify-center gap-1 hover:text-cyan-400 transition-colors"
          >
            Role <SortIcon field="role" />
          </button>
          <div className="col-span-3 text-right">Actions</div>
        </div>
      </div>

      {/* User Rows */}
      <div className="space-y-2">
        {users.map((user) => {
          const progress = userProgress[user.id] || { solved_count: 0, total_attempts: 0 };
          return (
            <div
              key={user.id}
              className="border rounded-lg hover:border-cyan-500/30 transition-all"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              <div className="grid grid-cols-12 gap-3 px-3 py-3 items-center">
                {/* Name */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : 'Anonymous'}
                    </h3>
                    {user.is_blocked && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                        BLOCKED
                      </span>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="col-span-2">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} />
                    <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                  </div>
                </div>

                {/* Join Date */}
                <div className="col-span-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="col-span-2">
                  <div className="flex items-center justify-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-emerald-400" />
                      <span style={{ color: 'var(--text-secondary)' }}>
                        <span className="font-medium text-emerald-400">{progress.solved_count}</span> solved
                      </span>
                    </div>
                    <span style={{ color: 'var(--text-tertiary)' }}>|</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{progress.total_attempts}</span> attempts
                    </span>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="col-span-1 flex justify-center">
                  {user.is_admin && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-orange-400 border border-orange-500/30">
                      ADMIN
                    </span>
                  )}
                  {!user.is_admin && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-500">
                      User
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-3 flex gap-1.5 justify-end">
                  <button
                    onClick={() => onToggleAdmin(user.id, user.is_admin)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${user.is_admin
                      ? 'bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/30'
                      : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
                      }`}
                    title={user.is_admin ? 'Revoke Admin' : 'Grant Admin'}
                  >
                    <UserCheck className="w-3 h-3" />
                    <span className="hidden xl:inline">{user.is_admin ? 'Revoke' : 'Admin'}</span>
                  </button>

                  <button
                    onClick={() => onToggleBlock(user.id, user.is_blocked)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${user.is_blocked
                      ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30'
                      : 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30'
                      }`}
                    title={user.is_blocked ? 'Unblock' : 'Block'}
                  >
                    <Ban className="w-3 h-3" />
                    <span className="hidden xl:inline">{user.is_blocked ? 'Unblock' : 'Block'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(user.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${deleteConfirm === user.id
                      ? 'bg-red-600/40 hover:bg-red-600/50 text-red-300 border border-red-500/50'
                      : 'bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 border border-gray-500/30'
                      }`}
                    title={deleteConfirm === user.id ? 'Click to confirm' : 'Delete'}
                  >
                    <Trash2 className="w-3 h-3" />
                    <span className="hidden xl:inline">{deleteConfirm === user.id ? 'Sure?' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, total)} of {total}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all bg-gray-600/20 hover:bg-gray-600/30 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 border border-gray-500/30"
            >
              <ChevronLeft className="w-3 h-3" />
              Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-7 h-7 rounded-md text-xs font-medium transition-all ${currentPage === pageNum
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                      : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-500/30'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all bg-gray-600/20 hover:bg-gray-600/30 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 border border-gray-500/30"
            >
              Next
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
