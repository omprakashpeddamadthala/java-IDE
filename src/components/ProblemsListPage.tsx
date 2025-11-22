import { useState, useEffect } from 'react';
import { Code2, ArrowLeft, Zap, Target, Flame, Crown } from 'lucide-react';
import { getAllProblems, type JavaProblem } from '../services/problemService';

interface ProblemsListPageProps {
  onNavigateHome: () => void;
  onSelectProblem: (problem: JavaProblem) => void;
}

export function ProblemsListPage({ onNavigateHome, onSelectProblem }: ProblemsListPageProps) {
  const [problems, setProblems] = useState<JavaProblem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    setIsLoading(true);
    const allProblems = await getAllProblems();
    setProblems(allProblems);
    setIsLoading(false);
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'basic':
        return <Zap className="w-4 h-4" />;
      case 'intermediate':
        return <Target className="w-4 h-4" />;
      case 'advanced':
        return <Flame className="w-4 h-4" />;
      case 'expert':
        return <Crown className="w-4 h-4" />;
      default:
        return <Code2 className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'advanced':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'expert':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const filteredProblems = filterDifficulty === 'all'
    ? problems
    : problems.filter(p => p.difficulty === filterDifficulty);

  const handlePractice = (problem: JavaProblem) => {
    onSelectProblem(problem);
    onNavigateHome();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all duration-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </button>

          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Code2 className="w-8 h-8 text-cyan-400" />
            Java Practice Problems
          </h1>
          <p className="text-gray-400">
            Choose a problem to practice. Total: {problems.length} problems
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setFilterDifficulty('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filterDifficulty === 'all'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All ({problems.length})
          </button>
          <button
            onClick={() => setFilterDifficulty('basic')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filterDifficulty === 'basic'
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Basic ({problems.filter(p => p.difficulty === 'basic').length})
          </button>
          <button
            onClick={() => setFilterDifficulty('intermediate')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filterDifficulty === 'intermediate'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Intermediate ({problems.filter(p => p.difficulty === 'intermediate').length})
          </button>
          <button
            onClick={() => setFilterDifficulty('advanced')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filterDifficulty === 'advanced'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Advanced ({problems.filter(p => p.difficulty === 'advanced').length})
          </button>
          <button
            onClick={() => setFilterDifficulty('expert')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filterDifficulty === 'expert'
                ? 'bg-red-600 text-white shadow-lg shadow-red-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Expert ({problems.filter(p => p.difficulty === 'expert').length})
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400 text-lg">Loading problems...</div>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <Code2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No problems found</p>
            <p className="text-gray-500 text-sm mt-2">Try seeding the database first</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProblems.map((problem) => (
              <div
                key={problem.id}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all duration-200 border border-gray-700 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-mono text-sm">#{problem.number}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                    {getDifficultyIcon(problem.difficulty)}
                    <span className="capitalize">{problem.difficulty}</span>
                  </div>
                </div>

                <h3 className="text-white font-semibold text-lg mb-3 line-clamp-2">
                  {problem.title}
                </h3>

                <button
                  onClick={() => handlePractice(problem)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
                >
                  Practice
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
