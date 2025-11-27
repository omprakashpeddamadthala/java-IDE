import { Ban, UserCheck } from 'lucide-react';
import { UserData, ProblemProgress } from '../../services/AdminService';

interface UserManagementProps {
  users: UserData[];
  userProgress: Record<string, ProblemProgress>;
  loading: boolean;
  onToggleBlock: (userId: string, currentStatus: boolean) => void;
  onToggleAdmin: (userId: string, currentStatus: boolean) => void;
}

export function UserManagement({
  users,
  userProgress,
  loading,
  onToggleBlock,
  onToggleAdmin
}: UserManagementProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--text-secondary)' }}>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Users ({users.length})
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage user accounts, permissions, and access</p>
      </div>

      <div className="grid gap-4">
        {users.map((user) => {
          const progress = userProgress[user.id] || { solved_count: 0, total_attempts: 0 };
          return (
            <div
              key={user.id}
              className="border rounded-lg p-6"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : 'Anonymous User'}
                    </h3>
                    {user.is_admin && (
                      <span className="px-2 py-1 rounded text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                        ADMIN
                      </span>
                    )}
                    {user.is_blocked && (
                      <span className="px-2 py-1 rounded text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white">
                        BLOCKED
                      </span>
                    )}
                  </div>
                  <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                  <div className="flex gap-6 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                    <span>Problems Solved: {progress.solved_count}</span>
                    <span>Total Attempts: {progress.total_attempts}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onToggleAdmin(user.id, user.is_admin)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      user.is_admin
                        ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                    } text-white`}
                    title={user.is_admin ? 'Remove Admin' : 'Make Admin'}
                  >
                    <UserCheck className="w-4 h-4" />
                    {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                  </button>

                  <button
                    onClick={() => onToggleBlock(user.id, user.is_blocked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      user.is_blocked
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                        : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
                    } text-white`}
                    title={user.is_blocked ? 'Unblock User' : 'Block User'}
                  >
                    <Ban className="w-4 h-4" />
                    {user.is_blocked ? 'Unblock' : 'Block'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
