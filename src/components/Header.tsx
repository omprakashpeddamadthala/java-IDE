import { useState } from 'react';
import { Shuffle, BookOpen, LogIn, CircleUser as UserCircle2, BarChart3, Terminal, Shield } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { MyAccountModal } from './MyAccountModal';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onRandomProblem: () => void;
  isLoadingProblem: boolean;
  onNavigateToProblems: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToAdmin?: () => void;
}

export function Header({ onRandomProblem, isLoadingProblem, onNavigateToProblems, onNavigateToDashboard, onNavigateToAdmin }: HeaderProps) {
  const { user, isAdmin } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  return (
    <header
      className="border-b backdrop-blur-sm"
      style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}
    >
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500">
            <Terminal className="w-4 h-4 text-slate-900" strokeWidth={2.5} />
          </div>
          <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            JavaCodingPractice.com
          </h1>
        </div>

        <nav className="flex items-center gap-6 sm:gap-8">
          <button
            onClick={onRandomProblem}
            disabled={isLoadingProblem}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: 'var(--text-primary)' }}
            title="Random problem"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isLoadingProblem ? 'Loading...' : 'Random'}</span>
          </button>

          <button
            onClick={onNavigateToProblems}
            className="text-sm font-medium transition-colors hover:text-cyan-400"
            style={{ color: 'var(--text-primary)' }}
            title="All problems"
          >
            Problems
          </button>

          {onNavigateToDashboard && user && (
            <button
              onClick={onNavigateToDashboard}
              className="text-sm font-medium transition-colors hover:text-cyan-400"
              style={{ color: 'var(--text-primary)' }}
              title="Dashboard"
            >
              Dashboard
            </button>
          )}

          {onNavigateToAdmin && isAdmin && (
            <button
              onClick={onNavigateToAdmin}
              className="text-sm font-medium transition-colors hover:text-yellow-400"
              style={{ color: 'var(--text-primary)' }}
              title="Admin"
            >
              Admin
            </button>
          )}

          {user ? (
            <button
              onClick={() => setShowAccountModal(true)}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-cyan-400"
              style={{ color: 'var(--text-primary)' }}
              title="Account"
            >
              <UserCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Account</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-sm font-medium px-4 py-1.5 rounded-lg border transition-all hover:border-cyan-400 hover:text-cyan-400"
              style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              title="Login"
            >
              Login
            </button>
          )}
        </nav>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <MyAccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
      />
    </header>
  );
}
