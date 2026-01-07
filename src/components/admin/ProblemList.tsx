import { useState } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Hash, BookOpen, BarChart3 } from 'lucide-react';
import { ProblemData } from '../../services/AdminService';

interface ProblemListProps {
  problems: ProblemData[];
  total: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  sortField: string | null;
  sortDirection: 'asc' | 'desc' | null;
  onSortChange: (field: string | null, direction: 'asc' | 'desc' | null) => void;
  onEdit: (problem: ProblemData) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
}

type SortField = 'number' | 'title' | 'difficulty' | 'category' | 'created';

export function ProblemList({
  problems,
  total,
  currentPage,
  pageSize,
  loading,
  sortField,
  sortDirection,
  onSortChange,
  onEdit,
  onDelete,
  onPageChange
}: ProblemListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const totalPages = Math.ceil(total / pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
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

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
      case 'basic':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'medium':
      case 'intermediate':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'hard':
      case 'advanced':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'expert':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading problems...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {problems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No problems found</p>
        </div>
      ) : (
        <>
          {/* Table Header */}
          <div className="border-b mb-3" style={{ borderColor: 'var(--border-color)' }}>
            <div className="grid grid-cols-12 gap-3 px-3 py-2 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              <button
                onClick={() => handleSort('number')}
                className="col-span-1 flex items-center gap-1 hover:text-cyan-400 transition-colors text-left"
              >
                # <SortIcon field="number" />
              </button>
              <button
                onClick={() => handleSort('title')}
                className="col-span-4 flex items-center gap-1 hover:text-cyan-400 transition-colors text-left"
              >
                Title <SortIcon field="title" />
              </button>
              <button
                onClick={() => handleSort('category')}
                className="col-span-2 flex items-center gap-1 hover:text-cyan-400 transition-colors text-left"
              >
                Category <SortIcon field="category" />
              </button>
              <button
                onClick={() => handleSort('difficulty')}
                className="col-span-1 flex items-center gap-1 hover:text-cyan-400 transition-colors text-left"
              >
                Level <SortIcon field="difficulty" />
              </button>
              <button
                onClick={() => handleSort('created')}
                className="col-span-2 flex items-center gap-1 hover:text-cyan-400 transition-colors text-left"
              >
                Created <SortIcon field="created" />
              </button>
              <div className="col-span-2 text-right">Actions</div>
            </div>
          </div>

          {/* Problem Rows */}
          <div className="space-y-2">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="border rounded-lg hover:border-cyan-500/30 transition-all"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              >
                <div className="grid grid-cols-12 gap-3 px-3 py-3 items-center">
                  {/* Number */}
                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} />
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        {problem.number}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} />
                      <h3 className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {problem.title}
                      </h3>
                    </div>
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                      {problem.description}
                    </p>
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    <span className="text-xs px-1.5 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>
                      {problem.category}
                    </span>
                  </div>

                  {/* Difficulty */}
                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} />
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="col-span-2">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(problem.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex gap-1.5 justify-end">
                    <button
                      onClick={() => onEdit(problem)}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30"
                      title="Edit"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span className="hidden xl:inline">Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(problem.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${deleteConfirm === problem.id
                        ? 'bg-red-600/40 hover:bg-red-600/50 text-red-300 border border-red-500/50'
                        : 'bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 border border-gray-500/30'
                        }`}
                      title={deleteConfirm === problem.id ? 'Click to confirm' : 'Delete'}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span className="hidden xl:inline">{deleteConfirm === problem.id ? 'Sure?' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
        </>
      )}
    </div>
  );
}
