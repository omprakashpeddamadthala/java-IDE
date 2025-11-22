import Editor from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
}

export function CodeEditor({ value, onChange, onRun }: CodeEditorProps) {
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
    <div className="h-full w-full overflow-hidden">
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="java"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
        theme="vs-dark"
        options={{
          fontSize: window.innerWidth < 768 ? 12 : 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          fontLigatures: true,
          minimap: { enabled: window.innerWidth >= 768 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          padding: { top: window.innerWidth < 768 ? 8 : 16, bottom: window.innerWidth < 768 ? 8 : 16 },
        }}
        loading={
          <div className="h-full flex items-center justify-center bg-[#1e1e1e]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[#00D4AA] animate-spin" />
              <p className="text-gray-400 text-sm">Loading Editor...</p>
            </div>
          </div>
        }
      />
    </div>
  );
}
