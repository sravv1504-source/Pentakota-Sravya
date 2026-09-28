import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Heart, Wind, ShieldCheck, Sparkles } from 'lucide-react';

export const ZenBreathingModal: React.FC = () => {
  const { zenModalOpen, closeZenModal, recordCalmDrill, t } = useApp();
  const [phase, setPhase] = useState<'breatheIn' | 'hold' | 'breatheOut'>('breatheIn');
  const [timer, setTimer] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [drillCompleted, setDrillCompleted] = useState(false);

  useEffect(() => {
    if (!zenModalOpen) {
      setPhase('breatheIn');
      setTimer(4);
      setCyclesCompleted(0);
      setDrillCompleted(false);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev > 1) return prev - 1;

        // Transition phases
        if (phase === 'breatheIn') {
          setPhase('hold');
          return 7;
        } else if (phase === 'hold') {
          setPhase('breatheOut');
          return 8;
        } else {
          // Completed one cycle
          setCyclesCompleted((c) => {
            const next = c + 1;
            if (next >= 2 && !drillCompleted) {
              setDrillCompleted(true);
              recordCalmDrill();
            }
            return next;
          });
          setPhase('breatheIn');
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [zenModalOpen, phase, drillCompleted, recordCalmDrill]);

  if (!zenModalOpen) return null;

  const phaseInstruction = {
    breatheIn: {
      label: t.breatheIn,
      sub: 'Expand your belly gently. Inhale serenity through your nose.',
      color: 'from-cyan-500 to-teal-400',
      scale: 'scale-125',
    },
    hold: {
      label: t.holdBreath,
      sub: 'Keep still. Let the oxygen soothe your neural pathways.',
      color: 'from-indigo-500 to-purple-400',
      scale: 'scale-125',
    },
    breatheOut: {
      label: t.breatheOut,
      sub: 'Slowly blow out the tension through your mouth like cooling soup.',
      color: 'from-rose-500 to-amber-400',
      scale: 'scale-90',
    },
  }[phase];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center">
        {/* Subtle background ambient glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeZenModal}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close calm modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-2 text-teal-400">
          <Heart className="w-5 h-5 fill-teal-400/20 animate-pulse" />
          <span className="text-xs uppercase tracking-widest font-bold">
            Physiological Reset · 4-7-8 Breathing
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white font-['Outfit'] mb-2">
          De-Escalate Stage Fear
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-8">
          Slow, prolonged exhalations stimulate the Vagus nerve, dropping adrenaline and heart rate in under 90 seconds.
        </p>

        {/* Breathing Circle Visualizer */}
        <div className="relative w-56 h-56 mx-auto mb-8 flex items-center justify-center">
          {/* Ambient outer ripple */}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-tr ${phaseInstruction.color} opacity-20 blur-xl transition-all duration-1000 ${phaseInstruction.scale}`}
          />

          {/* Main animated orb */}
          <div
            className={`w-44 h-44 rounded-full bg-gradient-to-tr ${phaseInstruction.color} p-1 shadow-2xl flex items-center justify-center transition-all duration-1000 ${phaseInstruction.scale}`}
          >
            <div className="w-full h-full rounded-full bg-slate-900/90 flex flex-col items-center justify-center p-4">
              <span className="text-4xl font-extrabold text-white font-['Outfit'] tabular-nums">
                {timer}s
              </span>
              <span className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">
                {phase === 'breatheIn' ? 'Inhale' : phase === 'hold' ? 'Hold' : 'Exhale'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Instructional Text */}
        <div className="min-h-[50px] mb-6">
          <p className="text-base font-semibold text-white font-['Outfit'] mb-1">
            {phaseInstruction.label}
          </p>
          <p className="text-xs text-slate-400">{phaseInstruction.sub}</p>
        </div>

        {/* Cycle status & Reward */}
        <div className="flex items-center justify-between bg-slate-800/60 rounded-xl px-4 py-3 border border-slate-700/50 mb-6">
          <div className="text-left">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
              Cycles Done
            </span>
            <span className="text-sm font-bold text-white tabular-nums">
              {cyclesCompleted} / 2 Calm Rounds
            </span>
          </div>
          {drillCompleted ? (
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>+30 XP Awarded!</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <Wind className="w-3.5 h-3.5" />
              <span>Complete 2 rounds to earn XP</span>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={closeZenModal}
            className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-teal-500/20"
          >
            I Feel Grounded &amp; Ready
          </button>
        </div>
      </div>
    </div>
  );
};
