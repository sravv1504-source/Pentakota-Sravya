import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MockInterviewRoom } from './components/MockInterviewRoom';
import { LearningMode } from './components/LearningMode';
import { AntiAnxietyDrills } from './components/AntiAnxietyDrills';
import { TreasuresAndRewards } from './components/TreasuresAndRewards';
import { InterviewCountdown } from './components/InterviewCountdown';
import { ZenBreathingModal } from './components/ZenBreathingModal';
import { Sparkles, Heart, CheckCircle2, Shield, Calendar } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, notification, dismissNotification, daysToInterview, userStats, t } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans']">
      <div>
        <Navbar />

        {/* Global Toast Notification */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce">
            <div className="bg-slate-900 border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{notification}</span>
              <button
                onClick={dismissNotification}
                className="text-slate-400 hover:text-white ml-2 text-sm"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Target Day Top Reminder Banner */}
        <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-teal-900/60 border-b border-slate-800/80 py-2 px-4 text-center text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap text-slate-300">
            <span className="flex items-center gap-1.5 text-indigo-300 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Interview Target:</span>
            </span>
            <strong className="text-white">
              {daysToInterview === 0 ? 'Today!' : `${daysToInterview} days away`}
            </strong>
            <span className="hidden sm:inline text-slate-500">·</span>
            <span className="text-slate-400 hidden sm:inline">
              Role: <span className="text-slate-200">{userStats.targetRole}</span>
            </span>
            <span className="hidden md:inline text-slate-500">·</span>
            <span className="text-teal-400 font-medium">
              Streak: {userStats.currentStreak} Days Active
            </span>
          </div>
        </div>

        {/* Main Tab Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'test' && <MockInterviewRoom />}
          {activeTab === 'learning' && <LearningMode />}
          {activeTab === 'stage-fear' && <AntiAnxietyDrills />}
          {activeTab === 'treasures' && <TreasuresAndRewards />}
          {activeTab === 'countdown' && <InterviewCountdown />}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/50 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-['Outfit']">ZenInterview</span>
            <span className="text-slate-600">·</span>
            <span>Multilingual AI Interview Coach &amp; Stage Fear Relief for Introverts</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>9 Languages Supported</span>
            <span>·</span>
            <span>Real-Time Gemini AI</span>
            <span>·</span>
            <span>Zero Judgment Zone</span>
          </div>
        </div>
      </footer>

      {/* Emergency Pause & Breathe Modal */}
      <ZenBreathingModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
