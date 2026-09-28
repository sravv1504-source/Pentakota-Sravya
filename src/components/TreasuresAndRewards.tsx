import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TREASURE_CHESTS, ALL_BADGES } from '../data/treasures';
import {
  Sparkles,
  Flame,
  Shield,
  Award,
  Lock,
  Unlock,
  CheckCircle,
  Gem,
  Crown,
  Heart,
  FileText,
  Zap,
} from 'lucide-react';

export const TreasuresAndRewards: React.FC = () => {
  const { userStats, unlockChest, triggerConfetti, addPoints, t } = useApp();
  const [selectedChestForModal, setSelectedChestForModal] = useState<string | null>(null);

  const handleOpenChest = (chestId: string) => {
    const success = unlockChest(chestId);
    if (success) {
      setSelectedChestForModal(chestId);
    }
  };

  const openedChest = TREASURE_CHESTS.find((c) => c.id === selectedChestForModal);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Banner: Gold Chest & User XP Vault */}
      <div className="relative bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 fill-amber-400" />
              <span>Treasures &amp; Gamified Interview Rewards</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Unlock Vaults, Charms &amp; Shields
            </h1>
            <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
              Earn XP by practicing questions, maintaining your daily streak, and completing calming stage-fear drills. Open chests to unlock perks and cheat sheets.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <div className="px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-amber-300 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="tabular-nums">{userStats.points} Available XP</span>
              </div>
              <div className="px-3.5 py-1.5 bg-teal-500/10 border border-teal-500/30 rounded-xl flex items-center gap-2 text-teal-300 text-xs font-bold">
                <Shield className="w-4 h-4 text-teal-400" />
                <span>{userStats.streakShields} Streak Shields</span>
              </div>
              <div className="px-3.5 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-300 text-xs font-bold">
                <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
                <span>{userStats.currentStreak} Day Streak</span>
              </div>
            </div>
          </div>

          {/* Golden Treasure Chest Image Artwork */}
          <div className="relative group shrink-0">
            <div className="absolute inset-0 bg-amber-500/30 rounded-3xl blur-xl group-hover:scale-110 transition-transform duration-500" />
            <img
              src="/src/assets/images/treasure_chest_gold_1790583892313.jpg"
              alt="Golden Treasure Chest"
              referrerPolicy="no-referrer"
              className="relative w-44 h-44 sm:w-52 sm:h-52 object-cover rounded-3xl border-2 border-amber-400/40 shadow-2xl shadow-amber-500/20"
            />
          </div>
        </div>
      </div>

      {/* 4 Treasure Chests Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <span>Treasure Vaults</span>
          </h2>
          <span className="text-xs text-slate-400">
            Open chests to claim stage-presence perks and confidence artifacts
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TREASURE_CHESTS.map((chest) => {
            const isUnlocked = userStats.unlockedChestIds.includes(chest.id);
            const canAfford = userStats.points >= chest.costPoints;

            const tierStyle = {
              bronze: 'border-amber-700/50 from-amber-950/30 to-slate-900 text-amber-300',
              silver: 'border-slate-400/40 from-slate-800/40 to-slate-900 text-slate-200',
              gold: 'border-amber-400/60 from-amber-900/40 to-slate-900 text-amber-300',
              master: 'border-indigo-400/60 from-indigo-950/50 to-slate-900 text-indigo-300',
            }[chest.tier];

            return (
              <div
                key={chest.id}
                className={`relative bg-gradient-to-b ${tierStyle} border rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-all hover:scale-[1.02]`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700">
                      {chest.tier} Tier
                    </span>
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Claimed</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-400 tabular-nums">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{chest.costPoints} XP</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white font-['Outfit'] mb-1">
                    {chest.name}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    {chest.description}
                  </p>

                  <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 mb-4">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-0.5">
                      Contains Artifact:
                    </span>
                    <span className="text-xs font-bold text-white block">
                      {chest.rewardTitle}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {chest.rewardDetail}
                    </span>
                  </div>
                </div>

                <div>
                  {isUnlocked ? (
                    <button
                      onClick={() => setSelectedChestForModal(chest.id)}
                      className="w-full py-2.5 bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>View Claimed Artifact</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenChest(chest.id)}
                      disabled={!canAfford}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-amber-500/20'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{canAfford ? 'Unlock Chest Now' : `Need ${chest.costPoints - userStats.points} More XP`}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges & Medals Showcase */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <span>Interview Medals &amp; Trophies</span>
            </h3>
            <p className="text-xs text-slate-400">
              Celebrate every milestone of consistency, bravery, and technical mastery.
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-400 font-bold">
            {userStats.unlockedBadgeIds.length} / {ALL_BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {ALL_BADGES.map((b) => {
            const isEarned = userStats.unlockedBadgeIds.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                  isEarned
                    ? 'bg-slate-800/60 border-indigo-500/40 text-slate-200'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-600 opacity-60'
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl ${
                    isEarned
                      ? 'bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white font-['Outfit']">
                      {b.title}
                    </span>
                    {isEarned && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Artifact Details Modal */}
      {openedChest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <Crown className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white font-['Outfit']">
              {openedChest.rewardTitle}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {openedChest.rewardDetail}
            </p>

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-left text-xs space-y-2">
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">
                Artifact Perk Active
              </span>
              <p className="text-slate-300">
                You carry this calm aura into every mock test and your real target interview day. Your thoughtful analytical answers stand above generic memorization.
              </p>
            </div>

            <button
              onClick={() => setSelectedChestForModal(null)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Close &amp; Keep In Vault
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
