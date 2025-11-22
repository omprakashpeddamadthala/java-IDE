import { Play, Code2 } from 'lucide-react';

interface HeaderProps {
  onRun: () => void;
  isRunning: boolean;
}

export function Header({ onRun, isRunning }: HeaderProps) {
  return (
    <header className="bg-[#0d1117] border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Code2 className="w-6 h-6 text-[#00D4AA]" />
        <h1 className="text-xl font-bold text-white">Java-IDE</h1>
        <span className="text-xs text-gray-500 hidden sm:inline">
          Online Java Compiler & Runner
        </span>
      </div>

      <button
        onClick={onRun}
        disabled={isRunning}
        className="flex items-center gap-2 bg-[#00D4AA] hover:bg-[#00ba95] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
      >
        <Play className="w-4 h-4" fill="currentColor" />
        <span>{isRunning ? 'Running...' : 'Run'}</span>
        <span className="hidden sm:inline text-xs opacity-75 ml-1">
          (Ctrl+Enter)
        </span>
      </button>
    </header>
  );
}
