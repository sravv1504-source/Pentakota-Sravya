import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LanguageCode } from '../types';
import {
  Flame,
  Sparkles,
  Globe,
  Heart,
  Calendar,
  BookOpen,
  Mic,
  Shield,
} from 'lucide-react';

const LANGUAGES: Array<{ code: LanguageCode; name: string; flag: string }> = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
];

export const Navbar: React.FC = () => {
  const {
    currentLanguage,
    setLanguage,
    t,
    activeTab,
    setActiveTab,
    userStats,
    openZenModal,
    daysToInterview,
  } = useApp();

  const [langMenuOpen, setLangMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('test')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white font-['Outfit'] block leading-none">
                ZenInterview
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                Calm Tech Interview AI
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean tabs) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/50">
          <button
            onClick={() => setActiveTab('test')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'test'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.navTest}</span>
          </button>

          <button
            onClick={() => setActiveTab('learning')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'learning'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.navLearning}</span>
          </button>

          <button
            onClick={() => setActiveTab('stage-fear')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'stage-fear'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>{t.navStageFear}</span>
          </button>

          <button
            onClick={() => setActiveTab('treasures')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'treasures'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.navTreasures}</span>
          </button>

          <button
            onClick={() => setActiveTab('countdown')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'countdown'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            <span>{t.navCountdown}</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions, Metrics & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Pause & Breathe Emergency Button */}
          <button
            onClick={openZenModal}
            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Instant calm breathing drill"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span className="hidden sm:inline">Pause &amp; Breathe</span>
          </button>

          {/* Streak Flame */}
          <button
            onClick={() => setActiveTab('countdown')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
            title={`${userStats.currentStreak} day consistency streak! Target: ${daysToInterview} days away`}
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
            <span className="tabular-nums">{userStats.currentStreak}d</span>
          </button>

          {/* Points XP */}
          <button
            onClick={() => setActiveTab('treasures')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-colors"
            title="Total Earned XP Points"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="tabular-nums">{userStats.points} XP</span>
          </button>

          {/* Multilingual Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
              aria-label="Change language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="uppercase font-semibold tracking-wider text-[11px]">
                {currentLanguage}
              </span>
            </button>

            {langMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-44 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 overflow-hidden"
                onMouseLeave={() => setLangMenuOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-700/60 mb-1">
                  Select Language
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                      currentLanguage === lang.code
                        ? 'bg-indigo-600/30 text-indigo-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{lang.name}</span>
                    <span className="text-sm">{lang.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800 bg-slate-900/95 py-2 px-2 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('test')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'test' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          {t.navTest}
        </button>
        <button
          onClick={() => setActiveTab('learning')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'learning' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          {t.navLearning}
        </button>
        <button
          onClick={() => setActiveTab('stage-fear')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'stage-fear' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          {t.navStageFear}
        </button>
        <button
          onClick={() => setActiveTab('treasures')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'treasures' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          {t.navTreasures}
        </button>
        <button
          onClick={() => setActiveTab('countdown')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'countdown' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          {t.navCountdown}
        </button>
      </div>
    </header>
  );
};
