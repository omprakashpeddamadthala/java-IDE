import { useState, useRef } from 'react';
import { Sparkles, Code2, Heart } from 'lucide-react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { OutputPanel } from './components/OutputPanel';
import { runJavaCode } from './services/compilerService';
import { DEFAULT_JAVA_CODE } from './constants/defaultCode';

type LayoutMode = 'bottom' | 'side';

function App() {
  const [code, setCode] = useState(DEFAULT_JAVA_CODE);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('side');
  const [outputSize, setOutputSize] = useState(40);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');
    setHasError(false);

    try {
      const result = await runJavaCode(code);

      if (result.error) {
        setOutput(result.error);
        setHasError(true);
      } else if (result.output) {
        setOutput(result.output);
        setHasError(false);
      } else {
        setOutput('Code executed successfully with no output');
        setHasError(false);
      }
    } catch (error) {
      setOutput('Unexpected error occurred while running code');
      setHasError(true);
    } finally {
      setIsRunning(false);
    }
  };

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isResizing || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    if (layoutMode === 'bottom') {
      const newHeight = ((rect.bottom - e.clientY) / rect.height) * 100;
      setOutputSize(Math.max(20, Math.min(70, newHeight)));
    } else {
      const newWidth = ((rect.right - e.clientX) / rect.width) * 100;
      setOutputSize(Math.max(20, Math.min(70, newWidth)));
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const toggleLayout = () => {
    setLayoutMode(prev => prev === 'bottom' ? 'side' : 'bottom');
  };

  return (
    <div
      className="h-screen flex flex-col bg-[#1e1e1e] overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Header onRun={handleRunCode} isRunning={isRunning} />

      <div
        ref={containerRef}
        className={`flex-1 flex overflow-hidden ${layoutMode === 'bottom' ? 'flex-col' : 'flex-row'}`}
      >
        <div
          className="relative overflow-hidden"
          style={{
            [layoutMode === 'bottom' ? 'height' : 'width']: `${100 - outputSize}%`
          }}
        >
          <CodeEditor
            value={code}
            onChange={setCode}
            onRun={handleRunCode}
          />
        </div>

        <div
          className={`relative ${
            layoutMode === 'bottom'
              ? 'w-full cursor-ns-resize hover:bg-[#00D4AA]/20'
              : 'h-full cursor-ew-resize hover:bg-[#00D4AA]/20'
          } ${isResizing ? 'bg-[#00D4AA]/30' : ''}`}
          style={{
            [layoutMode === 'bottom' ? 'height' : 'width']: '4px',
            backgroundColor: isResizing ? undefined : '#374151'
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`bg-[#00D4AA] rounded-full ${
              layoutMode === 'bottom' ? 'w-8 h-1' : 'w-1 h-8'
            }`} />
          </div>
        </div>

        <div
          style={{
            [layoutMode === 'bottom' ? 'height' : 'width']: `${outputSize}%`
          }}
        >
          <OutputPanel
            output={output}
            isRunning={isRunning}
            hasError={hasError}
            layoutMode={layoutMode}
            onToggleLayout={toggleLayout}
          />
        </div>
      </div>

      <footer className="border-t border-gray-800 bg-gradient-to-r from-[#161b22] via-[#0d1117] to-[#161b22] px-4 py-3">
        <div className="flex items-center justify-center gap-2 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-gray-400">Developed By</span>
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00D4AA] to-[#00A8E8]">
            Om Prakash Peddamadthala
          </span>
          <Code2 className="w-3.5 h-3.5 text-[#00D4AA]" />
          <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
          <span className="text-gray-500 mx-2">|</span>
          <span className="text-gray-500">© 2024 All Rights Reserved</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
