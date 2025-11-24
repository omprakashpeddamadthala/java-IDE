import { Terminal, Loader2, CheckCircle2, XCircle, Sparkles, Code2, Heart, PanelBottomOpen, PanelRightOpen } from 'lucide-react';

interface OutputPanelProps {
  output: string;
  isRunning: boolean;
  hasError: boolean;
  layoutMode: 'bottom' | 'side';
  onToggleLayout: () => void;
  isMobile?: boolean;
}

export function OutputPanel({ output, isRunning, hasError, layoutMode, onToggleLayout, isMobile = false }: OutputPanelProps) {
  return (
    <div className={`flex flex-col h-full ${layoutMode === 'side' ? 'border-l' : 'border-t'}`} style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 border-b" style={{
        borderColor: 'var(--border-color)',
        background: 'linear-gradient(to right, var(--bg-tertiary), var(--bg-secondary))'
      }}>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Terminal className="w-3.5 sm:w-4 h-3.5 sm:h-4" style={{ color: 'var(--accent-primary)' }} />
          <span className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Output</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isRunning && (
            <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="hidden sm:inline">Executing...</span>
            </div>
          )}

          {!isRunning && output && !hasError && (
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-green-400">
              <CheckCircle2 className="w-3 h-3" />
              <span className="hidden sm:inline">Success</span>
            </div>
          )}

          {!isRunning && hasError && (
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-red-400">
              <XCircle className="w-3 h-3" />
              <span className="hidden sm:inline">Error</span>
            </div>
          )}

          {!isMobile && (
            <button
              onClick={onToggleLayout}
              className="p-1.5 rounded hover:bg-gray-700/50 transition-colors group"
              title={layoutMode === 'bottom' ? 'Switch to side-by-side' : 'Switch to bottom'}
            >
              {layoutMode === 'bottom' ? (
                <PanelRightOpen className="w-4 h-4 text-gray-400 group-hover:text-[#00D4AA]" />
              ) : (
                <PanelBottomOpen className="w-4 h-4 text-gray-400 group-hover:text-[#00D4AA]" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2 sm:p-4">
        {isRunning ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2 sm:gap-3">
              <Loader2 className="w-6 sm:w-8 h-6 sm:h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} />
              <p className="text-xs sm:text-sm text-center px-4" style={{ color: 'var(--text-secondary)' }}>Compiling and running your code...</p>
            </div>
          </div>
        ) : output ? (
          <pre
            className="font-mono text-xs sm:text-sm whitespace-pre-wrap"
            style={{
              color: hasError ? '#f87171' : 'var(--text-primary)',
              backgroundColor: hasError ? 'rgba(127, 29, 29, 0.2)' : 'transparent',
              padding: hasError ? 'clamp(0.5rem, 2vw, 0.75rem)' : '0',
              borderRadius: hasError ? '0.375rem' : '0',
              border: hasError ? '1px solid rgba(127, 29, 29, 0.3)' : 'none'
            }}
          >
            {output}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs sm:text-sm text-center px-4" style={{ color: 'var(--text-tertiary)' }}>
              Click "Run" <span className="hidden sm:inline">or press Ctrl+Enter</span> to execute your code
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
