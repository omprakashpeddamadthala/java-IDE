import Editor from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { JavaProblem } from '../types/problem.types';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  currentProblem?: JavaProblem | null;
}

type TabType = 'code' | 'solution';

export function CodeEditor({ value, onChange, onRun, currentProblem }: CodeEditorProps) {
  const { theme } = useTheme();
  const [editorOptions, setEditorOptions] = useState(() => getEditorOptions());
  const [activeTab, setActiveTab] = useState<TabType>('code');

  function getEditorOptions() {
    const width = window.innerWidth;
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;

    return {
      fontSize: isMobile ? 9 : isTablet ? 13 : 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      fontLigatures: true,
      minimap: { enabled: width >= 1024 },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 4,
      wordWrap: 'on' as const,
      lineNumbers: 'on' as const,
      renderLineHighlight: 'all' as const,
      smoothScrolling: true,
      cursorBlinking: 'smooth' as const,
      cursorSmoothCaretAnimation: 'on' as const,
      padding: {
        top: isMobile ? 4 : isTablet ? 10 : 16,
        bottom: isMobile ? 4 : isTablet ? 10 : 16
      },
      lineHeight: isMobile ? 16 : isTablet ? 20 : 22,
      scrollbar: {
        vertical: 'auto' as const,
        horizontal: 'auto' as const,
        verticalScrollbarSize: isMobile ? 6 : 12,
        horizontalScrollbarSize: isMobile ? 6 : 12,
      },
      overviewRulerLanes: width >= 768 ? 2 : 0,
      hideCursorInOverviewRuler: isMobile,
      contextmenu: !isMobile,
      quickSuggestions: !isMobile,
      suggestOnTriggerCharacters: !isMobile,
      acceptSuggestionOnEnter: isMobile ? 'off' as const : 'on' as const,
      folding: width >= 768,
      foldingHighlight: width >= 768,
      renderIndentGuides: width >= 768,
      glyphMargin: width >= 768,
    };
  }

  useEffect(() => {
    const handleResize = () => {
      setEditorOptions(getEditorOptions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  const handleEditorMount = (editor: any) => {
    editor.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.Enter, () => {
      onRun();
    });

    editor.focus();
  };

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      {currentProblem && (
        <div className="flex border-b border-[#323232] bg-[#1e1e1e]">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === 'code'
                ? 'text-[#FFFFFF] border-b-2 border-[#6897BB] bg-[#2B2B2B]'
                : 'text-[#808080] hover:text-[#BBBBBB] hover:bg-[#2a2d2e]'
            }`}
          >
            Code
          </button>
          <button
            onClick={() => setActiveTab('solution')}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === 'solution'
                ? 'text-[#FFFFFF] border-b-2 border-[#6897BB] bg-[#2B2B2B]'
                : 'text-[#808080] hover:text-[#BBBBBB] hover:bg-[#2a2d2e]'
            }`}
          >
            Solution
          </button>
        </div>
      )}

      {activeTab === 'code' && (
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            width="100%"
            defaultLanguage="java"
            value={value}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={editorOptions}
            loading={
              <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading Editor...</p>
                </div>
              </div>
            }
          />
        </div>
      )}

      {activeTab === 'solution' && currentProblem && (
        <div className="flex-1 overflow-auto bg-[#2B2B2B]">
          <div className="h-full">
            <Editor
              height="100%"
              width="100%"
              defaultLanguage="java"
              value={currentProblem.solution}
              options={{
                ...editorOptions,
                readOnly: true,
              }}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              loading={
                <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} />
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading Solution...</p>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
