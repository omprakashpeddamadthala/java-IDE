import { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { OutputPanel } from './components/OutputPanel';
import { ProblemSidebar } from './components/ProblemSidebar';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { AccountSettings } from './components/AccountSettings';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { useServices } from './context/ServiceContext';
import { JavaProblem } from './types/problem.types';
import { DEFAULT_JAVA_CODE } from './constants/defaultCode';
import { useNavigation } from './hooks/useNavigation';
import { useExecutionLimit } from './hooks/useExecutionLimit';
import { errorHandlingService } from './services/ErrorHandlingService';
import { Loader2, Code2 } from 'lucide-react';

type LayoutMode = 'bottom' | 'side';

function App() {
  const { problemService, compilerService } = useServices();
  const navigation = useNavigation();
  const executionLimit = useExecutionLimit();
  const [code, setCode] = useState(DEFAULT_JAVA_CODE);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('side');
  const [isMobile, setIsMobile] = useState(false);
  const [outputSize, setOutputSize] = useState(26.67);
  const [isResizing, setIsResizing] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<JavaProblem | null>(null);
  const [isLoadingProblem, setIsLoadingProblem] = useState(false);
  const [showFullSolution, setShowFullSolution] = useState(false);
  const [cachedProblems, setCachedProblems] = useState<JavaProblem[] | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setLayoutMode('bottom');
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadProblems = async () => {
      const problems = await problemService.getAllProblems();
      setCachedProblems(problems);
    };
    loadProblems();
  }, [problemService]);

  useEffect(() => {
    const cleanupHash = () => {
      const hash = window.location.hash;
      if (hash && (hash.includes('access_token') || hash.includes('refresh_token'))) {
        setTimeout(() => {
          window.history.replaceState(null, '', window.location.pathname);
        }, 100);
      }
    };

    cleanupHash();
  }, []);

  const handleRunCode = async () => {
    if (!executionLimit.canExecute) {
      setShowAuthModal(true);
      return;
    }

    setIsRunning(true);
    setOutput('');
    setHasError(false);

    try {
      const result = await compilerService.execute(code);

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

      executionLimit.incrementCount();
    } catch (error) {
      const errorMessage = errorHandlingService.handleError(error);
      setOutput(errorMessage || 'Unexpected error occurred while running code');
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
    if (!isMobile) {
      setLayoutMode(prev => prev === 'bottom' ? 'side' : 'bottom');
    }
  };

  const handleRandomProblem = async () => {
    setIsLoadingProblem(true);
    try {
      const problem = await problemService.getRandomProblem();
      if (problem) {
        setCurrentProblem(problem);
        const practiceCode = problemService.extractPracticeCode(problem.solution);
        setCode(practiceCode);
        setShowFullSolution(false);
        setOutput('');
        setHasError(false);
      } else {
        setOutput('No problems found in database. Please seed the database first.');
        setHasError(true);
      }
    } catch (error) {
      const errorMessage = errorHandlingService.handleError(error);
      setOutput(errorMessage || 'Error loading random problem');
      setHasError(true);
    } finally {
      setIsLoadingProblem(false);
    }
  };

  const handleShowSolution = () => {
    if (!currentProblem) return;
    setCode(currentProblem.solution);
    setShowFullSolution(true);
    setOutput('');
    setHasError(false);
  };

  const handleSelectProblem = (problem: JavaProblem) => {
    setCurrentProblem(problem);
    const practiceCode = problemService.extractPracticeCode(problem.solution);
    setCode(practiceCode);
    setShowFullSolution(false);
    setOutput('');
    setHasError(false);
    if (navigation.currentPage !== 'home') {
      navigation.navigateToHome();
    }
  };

  if (isInitialLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#2B2B2B]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#6897BB] to-[#CC7832] rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-[#1e1e1e] p-6 rounded-2xl border-2 border-[#6897BB]">
              <Code2 className="w-16 h-16 text-[#6897BB]" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-2xl font-bold text-[#FFFFFF]">JavaCodingPractice.com</h1>
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#6897BB]" />
              <p className="text-sm text-[#A9B7C6] font-medium">Loading IDE...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (navigation.currentPage === 'admin') {
    return <AdminPanel onNavigateHome={navigation.navigateToHome} />;
  }

  if (navigation.currentPage === 'account-settings') {
    return <AccountSettings onNavigateHome={navigation.navigateToHome} />;
  }

  if (navigation.currentPage === 'dashboard') {
    return (
      <Dashboard
        onNavigateHome={navigation.navigateToHome}
        cachedProblems={cachedProblems}
      />
    );
  }

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{
        background: '#2B2B2B'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Header
        onRandomProblem={handleRandomProblem}
        isLoadingProblem={isLoadingProblem}
        onNavigateToDashboard={navigation.navigateToDashboard}
        onNavigateToAdmin={navigation.navigateToAdmin}
        onNavigateToAccountSettings={navigation.navigateToAccountSettings}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex overflow-hidden">
        {isSidebarOpen && cachedProblems && (
          <div style={{ width: '20%' }}>
            <ProblemSidebar
              problems={cachedProblems}
              onSelectProblem={handleSelectProblem}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              currentProblemId={currentProblem?.id}
              isMobile={isMobile}
            />
          </div>
        )}

        <div
          ref={containerRef}
          className={`flex overflow-hidden ${layoutMode === 'bottom' || isMobile ? 'flex-col' : 'flex-row'}`}
          style={{ width: isSidebarOpen && !isMobile ? '80%' : '100%' }}
        >
        <div
          className="relative overflow-hidden flex flex-col bg-[#1e1e1e] border border-[#323232]"
          style={{
            [layoutMode === 'bottom' || isMobile ? 'height' : 'width']: isMobile ? '50%' : `${100 - outputSize}%`
          }}
        >
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              value={code}
              onChange={setCode}
              onRun={handleRunCode}
              currentProblem={currentProblem}
              isRunning={isRunning}
              onShowSolution={handleShowSolution}
              showFullSolution={showFullSolution}
            />
          </div>
        </div>

        {!isMobile && (
          <div
            className={`relative ${
              layoutMode === 'bottom'
                ? 'w-full cursor-ns-resize hover:bg-[#515151]'
                : 'h-full cursor-ew-resize hover:bg-[#515151]'
            } ${isResizing ? 'bg-[#515151]' : ''}`}
            style={{
              [layoutMode === 'bottom' ? 'height' : 'width']: '4px',
              backgroundColor: isResizing ? undefined : '#323232'
            }}
            onMouseDown={handleMouseDown}
          >
          </div>
        )}

        <div
          className={`bg-[#1e1e1e] border border-[#323232] ${isMobile ? 'border-t' : ''}`}
          style={{
            [layoutMode === 'bottom' || isMobile ? 'height' : 'width']: isMobile ? '50%' : `${outputSize}%`
          }}
        >
          <OutputPanel
            output={output}
            isRunning={isRunning}
            hasError={hasError}
            layoutMode={layoutMode}
            onToggleLayout={toggleLayout}
            isMobile={isMobile}
          />
        </div>
      </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      <Footer />
    </div>
  );
}

export default App;
