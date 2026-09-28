import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DomainCategory, DifficultyLevel, QuestionItem } from '../types';
import { QUESTIONS_DATA } from '../data/questions';
import { speechService } from '../services/speechService';
import {
  Search,
  BookOpen,
  Sparkles,
  Volume2,
  CheckCircle,
  Code,
  Copy,
  Check,
  Eye,
  EyeOff,
  ArrowRight,
  Heart,
  HelpCircle,
} from 'lucide-react';

export const LearningMode: React.FC = () => {
  const {
    currentLanguage,
    selectedDomain,
    setSelectedDomain,
    selectedDifficulty,
    setSelectedDifficulty,
    userStats,
    recordCompletedQuestion,
    setActiveTab,
    openZenModal,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeDifficultyFilter, setActiveDifficultyFilter] = useState<DifficultyLevel | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Filter questions
  const filteredQuestions = QUESTIONS_DATA.filter((q) => {
    const matchesDomain = q.domain === selectedDomain;
    const matchesDiff =
      activeDifficultyFilter === 'all' || q.difficulty === activeDifficultyFilter;
    const matchesSearch =
      searchQuery === '' ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDomain && matchesDiff && matchesSearch;
  });

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleReveal = (id: string) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleListenAnswer = (q: QuestionItem) => {
    if (playingAudioId === q.id) {
      speechService.stopSpeaking();
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(q.id);
      speechService.speak(
        q.sampleAnswer,
        currentLanguage,
        1.0,
        0.95,
        undefined,
        () => setPlayingAudioId(null)
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Learning Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-cyan-400 font-semibold text-xs uppercase tracking-wider block mb-1">
              Structured Study &amp; Introvert Answer Blueprints
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Computer Languages &amp; Tech Domains
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Study questions at Easy, Medium, and Hard tiers. Learn how to formulate calm, structured STAR answers without panic or over-explaining.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openZenModal}
              className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Calm Breathing</span>
            </button>
            <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Questions Mastered
              </span>
              <span className="text-sm font-bold text-white font-mono">
                {userStats.completedQuestions.length} / {QUESTIONS_DATA.length}
              </span>
            </div>
          </div>
        </div>

        {/* Domain Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800 mb-6">
          {[
            { id: 'python', label: 'Python' },
            { id: 'javascript', label: 'JavaScript & TS' },
            { id: 'java', label: 'Java' },
            { id: 'cpp', label: 'C++ / C#' },
            { id: 'sql', label: 'SQL & DBs' },
            { id: 'system-design', label: 'System Design' },
            { id: 'frontend', label: 'Frontend & Web' },
            { id: 'behavioral', label: 'Behavioral & Leadership' },
          ].map((dom) => (
            <button
              key={dom.id}
              onClick={() => setSelectedDomain(dom.id as DomainCategory)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedDomain === dom.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {dom.label}
            </button>
          ))}
        </div>

        {/* Search & Difficulty Filter Sub-bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts (e.g. GIL, closures, B-Tree)..."
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Difficulty Segmented Filter Controls */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 self-stretch sm:self-auto justify-center">
            {[
              { id: 'all', label: 'All Levels' },
              { id: 'easy', label: 'Easy' },
              { id: 'medium', label: 'Medium' },
              { id: 'hard', label: 'Hard' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveDifficultyFilter(f.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeDifficultyFilter === f.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              No questions found
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search terms or difficulty filter.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isMastered = userStats.completedQuestions.includes(q.id);
            const isRevealed = revealedAnswers[q.id] ?? true; // revealed by default, toggleable

            const diffBadgeColor = {
              easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
              medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
              hard: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
            }[q.difficulty];

            return (
              <div
                key={q.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 transition-all hover:border-slate-700"
              >
                {/* Header: Title, Level, and Mastered Action */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${diffBadgeColor}`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {q.domain.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-['Outfit']">
                      {q.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Mark as Mastered (+25 XP) */}
                    <button
                      onClick={() => recordCompletedQuestion(q.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                        isMastered
                          ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      <CheckCircle
                        className={`w-3.5 h-3.5 ${
                          isMastered ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-500'
                        }`}
                      />
                      <span>{isMastered ? 'Mastered (+25 XP)' : 'Mark Mastered'}</span>
                    </button>

                    {/* Listen to Answer */}
                    <button
                      onClick={() => handleListenAnswer(q)}
                      className={`p-2 rounded-xl border transition-colors ${
                        playingAudioId === q.id
                          ? 'bg-indigo-600 text-white border-indigo-500 animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                      title={playingAudioId === q.id ? 'Pause Audio' : 'Listen to Answering Cadence'}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {/* Toggle Flashcard Reveal */}
                    <button
                      onClick={() => toggleReveal(q.id)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl transition-colors"
                      title={isRevealed ? 'Hide Answer (Flashcard Mode)' : 'Show Answer'}
                    >
                      {isRevealed ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4 text-cyan-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Interview Question
                  </span>
                  <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                    "{q.question}"
                  </p>
                </div>

                {/* Introvert Stage Fear Secret Tip */}
                <div className="bg-teal-950/20 border border-teal-500/30 rounded-2xl p-4 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 mt-0.5">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider font-['Outfit'] mb-0.5">
                      How an Introvert Aces This (Stage Fear Neutralizer)
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {q.introvertTip}
                    </p>
                  </div>
                </div>

                {/* Revealed Answer Content */}
                {isRevealed ? (
                  <div className="space-y-4 animate-fade-in">
                    {/* Model Answer */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Exemplary Structured Response
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 leading-relaxed">
                        {q.sampleAnswer}
                      </p>
                    </div>

                    {/* STAR Framework Breakdown */}
                    <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                        STAR Framework Narrative Breakdown
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                          <strong className="text-white block mb-0.5">Situation:</strong>
                          <span className="text-slate-400">{q.starFramework.situation}</span>
                        </div>
                        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                          <strong className="text-white block mb-0.5">Task:</strong>
                          <span className="text-slate-400">{q.starFramework.task}</span>
                        </div>
                        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                          <strong className="text-white block mb-0.5">Action:</strong>
                          <span className="text-slate-400">{q.starFramework.action}</span>
                        </div>
                        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                          <strong className="text-white block mb-0.5">Result:</strong>
                          <span className="text-emerald-400">{q.starFramework.result}</span>
                        </div>
                      </div>
                    </div>

                    {/* Code Snippet if technical */}
                    {q.codeSnippet && (
                      <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs overflow-x-auto">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 border-b border-slate-800 pb-1">
                          <span className="flex items-center gap-1">
                            <Code className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Syntax Blueprint</span>
                          </span>
                          <button
                            onClick={() => handleCopyCode(q.id, q.codeSnippet!)}
                            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                          >
                            {copiedId === q.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="text-slate-200">{q.codeSnippet}</pre>
                      </div>
                    )}

                    {/* Key Takeaways */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Key Engineering Takeaways
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                        {q.keyPoints.map((pt, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-indigo-400 font-bold">•</span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Practice this in Mock Mode CTA */}
                    <div className="pt-2 text-right">
                      <button
                        onClick={() => {
                          setSelectedDifficulty(q.difficulty);
                          setActiveTab('test');
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <span>Simulate this question with AI Interviewer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-800 text-center">
                    <button
                      onClick={() => toggleReveal(q.id)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
                    >
                      Click to Reveal Model Answer &amp; Structure
                    </button>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Active recall testing: try formulating your answer out loud first!
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
