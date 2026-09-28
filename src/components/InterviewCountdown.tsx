import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Flame,
  Target,
  Trophy,
  CheckCircle,
  Clock,
  Sparkles,
  Shield,
  Edit2,
  Save,
  ArrowRight,
} from 'lucide-react';

export const InterviewCountdown: React.FC = () => {
  const {
    userStats,
    daysToInterview,
    updateTargetDate,
    setActiveTab,
    addPoints,
    t,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [targetDateInput, setTargetDateInput] = useState(userStats.targetInterviewDate);
  const [targetRoleInput, setTargetRoleInput] = useState(userStats.targetRole);
  const [targetCompanyInput, setTargetCompanyInput] = useState(userStats.targetCompany);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTargetDate(targetDateInput, targetRoleInput, targetCompanyInput);
    setIsEditing(false);
  };

  // Readiness calculation based on practice activity
  const readinessPercentage = Math.min(
    100,
    Math.round(
      (userStats.completedQuestions.length * 8 +
        userStats.completedInterviewsCount * 20 +
        userStats.calmDrillsCompleted * 10 +
        userStats.currentStreak * 5) /
        1.5
    )
  );

  // Daily Roadmap milestones based on countdown
  const milestones = [
    {
      days: 'Day 10 - 7',
      title: 'Anxiety Desensitization & Core Syntax',
      desc: 'Build familiarity with language fundamentals without pressure. Practice 5 Easy questions and 2 calm breathing drills.',
      completed: userStats.completedQuestions.length >= 2,
    },
    {
      days: 'Day 6 - 4',
      title: 'Medium Logic & Human Voice Mocks',
      desc: 'Speak answers out loud to Dr. Maya or Marcus. Practice pacing pauses (2 seconds before answering).',
      completed: userStats.completedInterviewsCount >= 1,
    },
    {
      days: 'Day 3 - 2',
      title: 'STAR Storytelling & Edge Cases',
      desc: 'Refine behavioral anecdotes (Situation, Task, Action, Result). Turn introversion into analytical strength.',
      completed: userStats.completedInterviewsCount >= 2,
    },
    {
      days: 'Day 1',
      title: 'Mental Priming & Zero-Caffeine Sleep',
      desc: 'Rest your brain. Light review only. Complete 4-7-8 breathing drill to lock in parasympathetic calm.',
      completed: userStats.calmDrillsCompleted >= 2,
    },
    {
      days: 'Target Day',
      title: 'Interview Victory Protocol',
      desc: 'Grounding pose, deep exhale, friendly smile. You are thoroughly prepared and belong in this room.',
      completed: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Target Interview Day Hero Card */}
      <div className="relative bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left Column: Target Role & Countdown Numbers */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>{t.targetDayBanner}</span>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Interview Date
                  </label>
                  <input
                    type="date"
                    value={targetDateInput}
                    onChange={(e) => setTargetDateInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Dream Company
                    </label>
                    <input
                      type="text"
                      value={targetCompanyInput}
                      onChange={(e) => setTargetCompanyInput(e.target.value)}
                      placeholder="e.g. Google, Microsoft, Stripe"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Target Role
                    </label>
                    <input
                      type="text"
                      value={targetRoleInput}
                      onChange={(e) => setTargetRoleInput(e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Target Day</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
                    {daysToInterview === 0 ? (
                      <span className="text-amber-400">Today is Interview Day!</span>
                    ) : (
                      <>
                        <span className="text-indigo-400 tabular-nums">{daysToInterview}</span> Days Remaining
                      </>
                    )}
                  </h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                    title="Edit target interview date and role"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-300 text-sm mt-1">
                  Targeting <strong className="text-white">{userStats.targetRole}</strong> at{' '}
                  <strong className="text-indigo-300">{userStats.targetCompany}</strong> on{' '}
                  <span className="text-slate-400 font-mono text-xs">{userStats.targetInterviewDate}</span>
                </p>
              </div>
            )}

            {/* Quick date presets */}
            {!isEditing && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-400 font-medium">Quick set:</span>
                {[3, 7, 14, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + days);
                      updateTargetDate(d.toISOString().split('T')[0]);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold rounded-md transition-colors"
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Readiness Meter Dial */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 flex items-center gap-4 min-w-[240px]">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-700"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${readinessPercentage}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-base font-bold text-white font-['Outfit'] tabular-nums">
                {readinessPercentage}%
              </span>
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
                {t.interviewReady}
              </span>
              <span className="text-sm font-bold text-emerald-400 block mt-0.5">
                {readinessPercentage >= 75
                  ? 'Highly Prepared'
                  : readinessPercentage >= 40
                  ? 'Gaining Momentum'
                  : 'Building Foundation'}
              </span>
              <span className="text-[11px] text-slate-400">
                {userStats.completedQuestions.length} Questions · {userStats.completedInterviewsCount} Mocks
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Streak & Consistency Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Streak Flame Counter */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Flame className="w-8 h-8 text-amber-400 fill-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Current Consistency
            </div>
            <div className="text-2xl font-bold text-white font-['Outfit'] tabular-nums">
              {userStats.currentStreak} {t.streakDays}
            </div>
            <div className="text-[11px] text-amber-400 font-medium">
              Best streak: {userStats.bestStreak} days
            </div>
          </div>
        </div>

        {/* Streak Shield Protection */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-teal-400" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Streak Freezes
            </div>
            <div className="text-2xl font-bold text-white font-['Outfit'] tabular-nums">
              {userStats.streakShields} Active
            </div>
            <div className="text-[11px] text-teal-400 font-medium">
              Protects streak if you rest for a day
            </div>
          </div>
        </div>

        {/* XP Points */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Total XP Earned
            </div>
            <div className="text-2xl font-bold text-white font-['Outfit'] tabular-nums">
              {userStats.points} XP
            </div>
            <button
              onClick={() => setActiveTab('treasures')}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 mt-0.5"
            >
              <span>Unlock chests &amp; perks</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 7-Day Consistency Activity Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              7-Day Practice Consistency
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Daily practice builds immunity to stage fear
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
            const isDone = idx < userStats.currentStreak;
            return (
              <div
                key={day}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  isDone
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-slate-800/40 border-slate-800 text-slate-500'
                }`}
              >
                <span className="text-[11px] font-semibold">{day}</span>
                {isDone ? (
                  <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-700" />
                )}
                <span className="text-[10px] font-mono">
                  {isDone ? 'Completed' : 'Upcoming'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Introvert Prep Roadmap to Interview Day */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Introvert Action Plan to Target Day
            </h3>
            <p className="text-xs text-slate-400">
              A gradual, pressure-free roadmap designed to desensitize interview anxiety and build deep composure.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('test')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
          >
            <span>Practice Live Mock Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
                m.completed
                  ? 'bg-slate-800/40 border-emerald-500/30'
                  : 'bg-slate-800/20 border-slate-800'
              }`}
            >
              <div className="mt-0.5">
                {m.completed ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {idx + 1}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white font-['Outfit']">
                    {m.title}
                  </h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {m.days}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
