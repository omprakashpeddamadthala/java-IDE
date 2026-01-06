import { useState } from 'react';
import { PageComponentProps } from '../types/navigation.types';
import { Copy, Check, ArrowLeft, ChevronLeft, ChevronRight, Zap, Sparkles, Code2, Layers } from 'lucide-react';
import { Footer } from './Footer';
import java8SnippetsData from '../data/java8-snippets.json';
import java17SnippetsData from '../data/java17-snippets.json';

interface CodeSnippet {
    title: string;
    description: string;
    code: string;
    category: string;
}

type ViewMode = 'landing' | 'java8' | 'java17';

const java8Snippets: CodeSnippet[] = java8SnippetsData as CodeSnippet[];
const java17Snippets: CodeSnippet[] = java17SnippetsData as CodeSnippet[];

const ITEMS_PER_PAGE = 12;

export function CheatsheetPage({ onNavigateHome }: PageComponentProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('landing');
    const [currentPage, setCurrentPage] = useState(1);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyToClipboard = async (code: string, id: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    const renderSnippetCard = (snippet: CodeSnippet, index: number) => {
        const snippetId = `${viewMode}-${index}`;
        const isCopied = copiedId === snippetId;

        return (
            <div
                key={snippetId}
                className="group relative bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 flex flex-col hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
                style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                }}
            >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none"></div>

                {/* Header */}
                <div className="relative p-4 border-b border-white/5 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white mb-1 truncate">
                                {snippet.title}
                            </h3>
                            <p className="text-white text-xs line-clamp-2">
                                {snippet.description}
                            </p>
                        </div>
                        <span className="flex-shrink-0 px-2 py-1 text-[10px] font-semibold bg-white/10 border border-white/20 rounded-full text-white">
                            {viewMode === 'java8' ? 'Java 8' : 'Java 17'}
                        </span>
                    </div>
                </div>

                {/* Code Block */}
                <div className="relative flex-1 p-4 overflow-hidden">
                    <pre className="overflow-x-auto text-sm h-full scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        <code className="text-white font-mono leading-relaxed block">
                            {snippet.code}
                        </code>
                    </pre>

                    {/* Gradient fade at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#16213e]/90 to-transparent pointer-events-none"></div>
                </div>

                {/* Copy Button */}
                <button
                    onClick={() => copyToClipboard(snippet.code, snippetId)}
                    className="absolute top-4 right-4 p-2 bg-gradient-to-r from-purple-600 to-blue-600 border border-purple-400/30 rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-110 z-10"
                    title="Copy to clipboard"
                >
                    {isCopied ? (
                        <Check className="w-4 h-4 text-white animate-bounce" />
                    ) : (
                        <Copy className="w-4 h-4 text-white" />
                    )}
                </button>
            </div>
        );
    };

    const renderLandingPage = () => (
        <div className="w-full min-h-screen overflow-y-auto bg-[#2B2B2B]">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
                <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-16">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-white" />
                        <span className="text-sm text-white font-medium">Modern Java Cheatsheet</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white">
                        Java Quick Reference
                    </h1>

                    <p className="text-xl text-white max-w-2xl mx-auto mb-8">
                        Master Java features with elegant code examples. Choose your version to get started.
                    </p>

                    <button
                        onClick={onNavigateHome}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 text-white"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to IDE
                    </button>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Java 8 Card */}
                    <button
                        onClick={() => {
                            setViewMode('java8');
                            setCurrentPage(1);
                        }}
                        className="group relative p-8 bg-[#1e1e1e] backdrop-blur-sm border-2 border-[#323232] rounded-2xl hover:border-blue-500 transition-all duration-500 text-left overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
                    >
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-all duration-500"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Zap className="w-8 h-8 text-white" />
                                </div>
                                <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-semibold text-white">
                                    12 Snippets
                                </span>
                            </div>

                            <h2 className="text-3xl font-bold mb-3 text-white">
                                Java 8 Features
                            </h2>

                            <p className="text-gray-400 mb-6">
                                Lambdas, Streams, Optional, Method References, and more modern Java 8 patterns.
                            </p>

                            <div className="flex items-center gap-2 text-white font-medium">
                                <span>Explore Java 8</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </button>

                    {/* Java 17 Card */}
                    <button
                        onClick={() => {
                            setViewMode('java17');
                            setCurrentPage(1);
                        }}
                        className="group relative p-8 bg-[#1e1e1e] backdrop-blur-sm border-2 border-[#323232] rounded-2xl hover:border-purple-500 transition-all duration-500 text-left overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                    >
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-all duration-500"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Layers className="w-8 h-8 text-white" />
                                </div>
                                <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-semibold text-white">
                                    12 Snippets
                                </span>
                            </div>

                            <h2 className="text-3xl font-bold mb-3 text-white">
                                Java 17 Features
                            </h2>

                            <p className="text-gray-400 mb-6">
                                Records, Sealed Classes, Pattern Matching, Text Blocks, and cutting-edge Java 17 features.
                            </p>

                            <div className="flex items-center gap-2 text-white font-medium">
                                <span>Explore Java 17</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );

    const renderSnippetsPage = () => {
        const snippets = viewMode === 'java8' ? java8Snippets : java17Snippets;
        const totalPages = Math.ceil(snippets.length / ITEMS_PER_PAGE);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const currentSnippets = snippets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        const gradientFrom = viewMode === 'java8' ? 'from-blue-500' : 'from-purple-500';
        const gradientTo = viewMode === 'java8' ? 'to-cyan-500' : 'to-pink-500';

        return (
            <div className="flex h-full w-full bg-[#2B2B2B] relative overflow-hidden">


                {/* Sidebar */}
                <div className="relative w-64 bg-[#1e1e1e] border-r border-[#323232] flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-white/10">
                        <button
                            onClick={onNavigateHome}
                            className="flex items-center gap-2 px-4 py-2 w-full bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 text-white mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Back to IDE</span>
                        </button>

                        <div className={`p-3 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-xl`}>
                            <div className="flex items-center gap-2 text-white">
                                {viewMode === 'java8' ? <Zap className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                                <span className="font-bold">
                                    {viewMode === 'java8' ? 'Java 8' : 'Java 17'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                            Switch Version
                        </h3>

                        <button
                            onClick={() => setViewMode('landing')}
                            className="flex items-center gap-3 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 text-white mb-3"
                        >
                            <Code2 className="w-4 h-4" />
                            <span className="text-sm font-medium">All Versions</span>
                        </button>

                        <button
                            onClick={() => { setViewMode('java8'); setCurrentPage(1); }}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 mb-3 ${viewMode === 'java8'
                                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 text-blue-300'
                                : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <Zap className="w-4 h-4" />
                            <span className="text-sm font-medium">Java 8</span>
                        </button>

                        <button
                            onClick={() => { setViewMode('java17'); setCurrentPage(1); }}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 ${viewMode === 'java17'
                                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300'
                                : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <Layers className="w-4 h-4" />
                            <span className="text-sm font-medium">Java 17</span>
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="p-4 border-t border-white/10">
                        <div className="px-4 py-3 bg-white/5 rounded-xl">
                            <div className="text-xs text-white mb-1">Total Snippets</div>
                            <div className="text-2xl font-bold text-white">
                                {snippets.length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative flex-1 flex flex-col overflow-hidden">
                    {/* Content Header */}
                    <div className="p-6 border-b border-[#323232] bg-[#1e1e1e]">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {viewMode === 'java8' ? 'Java 8 Features' : 'Java 17 Features'}
                        </h2>
                        <p className="text-sm text-white">
                            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, snippets.length)} of {snippets.length} snippets
                        </p>
                    </div>

                    {/* Snippets Grid */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
                            {currentSnippets.map((snippet, index) => renderSnippetCard(snippet, index))}
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="p-6 border-t border-[#323232] bg-[#1e1e1e]">
                            <div className="flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                                >
                                    <ChevronLeft className="w-5 h-5 text-white" />
                                </button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${currentPage === page
                                                ? `bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white shadow-lg`
                                                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                                >
                                    <ChevronRight className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="h-screen bg-[#2B2B2B] text-gray-100 flex flex-col">
            <div className="flex-1 overflow-hidden flex">
                {viewMode === 'landing' ? renderLandingPage() : renderSnippetsPage()}
            </div>

            <Footer />
        </div>
    );
}
