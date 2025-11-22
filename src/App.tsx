import { useState } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { OutputPanel } from './components/OutputPanel';
import { runJavaCode } from './services/compilerService';
import { DEFAULT_JAVA_CODE } from './constants/defaultCode';

function App() {
  const [code, setCode] = useState(DEFAULT_JAVA_CODE);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);

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

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] overflow-hidden">
      <Header onRun={handleRunCode} isRunning={isRunning} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <CodeEditor
          value={code}
          onChange={setCode}
          onRun={handleRunCode}
        />

        <OutputPanel
          output={output}
          isRunning={isRunning}
          hasError={hasError}
        />
      </div>
    </div>
  );
}

export default App;
