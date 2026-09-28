import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  LanguageCode,
  DifficultyLevel,
  DomainCategory,
  InterviewerPersona,
  UserStats,
  TreasureChest,
} from '../types';
import { TRANSLATIONS, TranslationDictionary } from '../data/translations';
import { INTERVIEWERS } from '../data/interviewers';
import { TREASURE_CHESTS, ALL_BADGES } from '../data/treasures';

interface AppContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationDictionary;
  activeTab: 'learning' | 'test' | 'treasures' | 'stage-fear' | 'countdown';
  setActiveTab: (tab: 'learning' | 'test' | 'treasures' | 'stage-fear' | 'countdown') => void;
  selectedInterviewer: InterviewerPersona;
  setSelectedInterviewer: (interviewer: InterviewerPersona) => void;
  selectedDomain: DomainCategory;
  setSelectedDomain: (domain: DomainCategory) => void;
  selectedDifficulty: DifficultyLevel;
  setSelectedDifficulty: (diff: DifficultyLevel) => void;
  userStats: UserStats;
  addPoints: (amount: number, reason?: string) => void;
  recordCompletedQuestion: (questionId: string) => void;
  recordCompletedInterview: (score: number) => void;
  unlockChest: (chestId: string) => boolean;
  updateTargetDate: (dateStr: string, role?: string, company?: string) => void;
  recordCalmDrill: () => void;
  zenModalOpen: boolean;
  openZenModal: () => void;
  closeZenModal: () => void;
  triggerConfetti: () => void;
  notification: string | null;
  dismissNotification: () => void;
  daysToInterview: number;
}

const STORAGE_KEY = 'zen_interview_user_stats_v1';
const LANG_STORAGE_KEY = 'zen_interview_language_v1';

const defaultStats: UserStats = {
  points: 240, // Initial welcome points so user can explore
  currentStreak: 4,
  bestStreak: 7,
  lastActiveDate: new Date().toISOString().split('T')[0],
  targetInterviewDate: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 9); // default 9 days ahead
    return d.toISOString().split('T')[0];
  })(),
  targetRole: 'Senior Full Stack & Systems Engineer',
  targetCompany: 'Dream Tech Co.',
  streakShields: 1,
  completedQuestions: ['py-01', 'js-01'],
  completedInterviewsCount: 2,
  unlockedChestIds: ['bronze-chest'],
  unlockedBadgeIds: ['first-step'],
  calmDrillsCompleted: 3,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<
    'learning' | 'test' | 'treasures' | 'stage-fear' | 'countdown'
  >('test');
  const [selectedInterviewer, setSelectedInterviewer] = useState<InterviewerPersona>(
    INTERVIEWERS[0]
  );
  const [selectedDomain, setSelectedDomain] = useState<DomainCategory>('python');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('medium');
  const [zenModalOpen, setZenModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [userStats, setUserStats] = useState<UserStats>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Could not read user stats from localStorage:', e);
      }
    }
    return defaultStats;
  });

  // Load language from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = localStorage.getItem(LANG_STORAGE_KEY) as LanguageCode;
        if (savedLang && TRANSLATIONS[savedLang]) {
          setCurrentLanguageState(savedLang);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Save stats to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userStats));
      } catch (e) {
        console.warn('Could not save user stats to localStorage:', e);
      }
    }
  }, [userStats]);

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguageState(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
      } catch (e) {
        // ignore
      }
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const dismissNotification = () => setNotification(null);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
      });
    } catch (e) {
      // ignore
    }
  };

  const addPoints = (amount: number, reason?: string) => {
    setUserStats((prev) => ({
      ...prev,
      points: prev.points + amount,
    }));
    showNotification(`+${amount} XP! ${reason ? `(${reason})` : ''}`);
  };

  const recordCompletedQuestion = (questionId: string) => {
    setUserStats((prev) => {
      if (prev.completedQuestions.includes(questionId)) {
        return prev;
      }
      const updated = [...prev.completedQuestions, questionId];
      const badges = [...prev.unlockedBadgeIds];
      if (!badges.includes('first-step')) {
        badges.push('first-step');
      }
      return {
        ...prev,
        completedQuestions: updated,
        unlockedBadgeIds: badges,
        points: prev.points + 25,
      };
    });
    showNotification('Question mastered! +25 XP');
  };

  const recordCompletedInterview = (score: number) => {
    setUserStats((prev) => {
      const newCount = prev.completedInterviewsCount + 1;
      const badges = [...prev.unlockedBadgeIds];
      if (score >= 80 && !badges.includes('stage-fear-slayer')) {
        badges.push('stage-fear-slayer');
      }
      return {
        ...prev,
        completedInterviewsCount: newCount,
        unlockedBadgeIds: badges,
        points: prev.points + 100,
      };
    });
    triggerConfetti();
    showNotification(`Mock interview completed with score ${score}! +100 XP`);
  };

  const unlockChest = (chestId: string): boolean => {
    const targetChest = TREASURE_CHESTS.find((c) => c.id === chestId);
    if (!targetChest) return false;

    if (userStats.points < targetChest.costPoints) {
      showNotification(`Need ${targetChest.costPoints - userStats.points} more XP to open this chest!`);
      return false;
    }

    if (userStats.unlockedChestIds.includes(chestId)) {
      showNotification('Chest already opened!');
      return false;
    }

    setUserStats((prev) => ({
      ...prev,
      points: prev.points - targetChest.costPoints,
      unlockedChestIds: [...prev.unlockedChestIds, chestId],
      streakShields:
        targetChest.rewardType === 'streak_shield'
          ? prev.streakShields + 1
          : prev.streakShields,
    }));

    triggerConfetti();
    showNotification(`Unlocked: ${targetChest.rewardTitle}!`);
    return true;
  };

  const updateTargetDate = (dateStr: string, role?: string, company?: string) => {
    setUserStats((prev) => ({
      ...prev,
      targetInterviewDate: dateStr,
      targetRole: role || prev.targetRole,
      targetCompany: company || prev.targetCompany,
    }));
    showNotification('Interview Target Day updated!');
  };

  const recordCalmDrill = () => {
    setUserStats((prev) => {
      const newDrills = prev.calmDrillsCompleted + 1;
      const badges = [...prev.unlockedBadgeIds];
      if (newDrills >= 3 && !badges.includes('stage-fear-slayer')) {
        badges.push('stage-fear-slayer');
      }
      return {
        ...prev,
        calmDrillsCompleted: newDrills,
        points: prev.points + 30,
        unlockedBadgeIds: badges,
      };
    });
    showNotification('Zen Breathing completed! Your heart rate is primed. +30 XP');
  };

  // Calculate days remaining to interview
  const daysToInterview = (() => {
    try {
      const target = new Date(userStats.targetInterviewDate).getTime();
      const now = new Date().setHours(0, 0, 0, 0);
      const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
      return Math.max(0, diff);
    } catch {
      return 7;
    }
  })();

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  return (
    <AppContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        activeTab,
        setActiveTab,
        selectedInterviewer,
        setSelectedInterviewer,
        selectedDomain,
        setSelectedDomain,
        selectedDifficulty,
        setSelectedDifficulty,
        userStats,
        addPoints,
        recordCompletedQuestion,
        recordCompletedInterview,
        unlockChest,
        updateTargetDate,
        recordCalmDrill,
        zenModalOpen,
        openZenModal: () => setZenModalOpen(true),
        closeZenModal: () => setZenModalOpen(false),
        triggerConfetti,
        notification,
        dismissNotification,
        daysToInterview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
