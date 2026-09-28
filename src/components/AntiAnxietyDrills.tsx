import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Wind,
  Shield,
  Sparkles,
  CheckCircle,
  Eye,
  Activity,
  Smile,
  Volume2,
  Check,
} from 'lucide-react';

export const AntiAnxietyDrills: React.FC = () => {
  const { openZenModal, recordCalmDrill, addPoints, userStats, t } = useApp();

  // 5-4-3-2-1 Grounding state
  const [groundingStep, setGroundingStep] = useState(0);
  const [completedDrills, setCompletedDrills] = useState<Record<string, boolean>>({});

  const groundingPrompts = [
    {
      count: 5,
      type: 'SEE',
      prompt: 'Notice 5 distinct visual objects around you right now (e.g. your monitor frame, a pen, window light, keyboard keys, floor texture).',
    },
    {
      count: 4,
      type: 'FEEL',
      prompt: 'Feel 4 physical sensations (both feet flat on the ground, back supported by chair, clothes against your skin, palms resting on desk).',
    },
    {
      count: 3,
      type: 'HEAR',
      prompt: 'Listen for 3 background sounds (the computer fan hum, distant outdoor cars, your own steady breathing rhythm).',
    },
    {
      count: 2,
      type: 'SMELL / AIR',
      prompt: 'Notice 2 sensations in the air (the cool air entering your nostrils, room temperature).',
    },
    {
      count: 1,
      type: 'AFFIRM',
      prompt: 'Speak or whisper 1 truth: "I am thoughtful, I know my craft, and taking my time is my superpower."',
    },
  ];

  const handleCompleteDrill = (id: string, xp: number) => {
    if (completedDrills[id]) return;
    setCompletedDrills((prev) => ({ ...prev, [id]: true }));
    addPoints(xp, 'Stage Fear Exercise');
    recordCalmDrill();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-teal-950/40 via-slate-900 to-rose-950/30 border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-teal-400/20 animate-pulse" />
            <span>{t.stageFearTitle}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Master Stage Fear &amp; Interview Anxiety
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            {t.stageFearSubtitle} Designed by psychologists and senior engineering leaders to transform nervous adrenaline into calm focus.
          </p>
        </div>
      </div>

      {/* Main 4 Drills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Drill 1: 4-7-8 Breathing Launcher */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                Instant Physiological Reset
              </span>
              <h3 className="text-lg font-bold text-white font-['Outfit'] mt-0.5">
                4-7-8 Vagus Nerve Breathing
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              When stage fright strikes, your heart races due to sympathetic fight-or-flight arousal. Inhaling for 4s, holding for 7s, and exhaling for 8s triggers the parasympathetic brake, dropping blood pressure and heart rate in 60 seconds.
            </p>
          </div>

          <div className="pt-5 border-t border-slate-800 mt-5 flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-400">+30 XP Awarded</span>
            <button
              onClick={openZenModal}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-500/20"
            >
              Start Breathing Visualizer
            </button>
          </div>
        </div>

        {/* Drill 2: 5-4-3-2-1 Sensory Grounding */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                Mind Grounding Drill
              </span>
              <h3 className="text-lg font-bold text-white font-['Outfit'] mt-0.5">
                5-4-3-2-1 Sensory Anchor
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stops racing thoughts and imposter panic by shifting neural activity from the amygdala (fear center) to the sensory cortex.
            </p>

            {/* Interactive Step Card */}
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-300 uppercase">
                  Step {groundingStep + 1} of 5 · {groundingPrompts[groundingStep].type}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {groundingPrompts[groundingStep].count} Items
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {groundingPrompts[groundingStep].prompt}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between">
            <button
              onClick={() =>
                setGroundingStep((prev) => (prev > 0 ? prev - 1 : 0))
              }
              disabled={groundingStep === 0}
              className="text-xs text-slate-400 hover:text-white disabled:opacity-30"
            >
              Back
            </button>

            {groundingStep < 4 ? (
              <button
                onClick={() => setGroundingStep((prev) => prev + 1)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
              >
                Next Sensory Anchor ({groundingStep + 1}/5)
              </button>
            ) : (
              <button
                onClick={() => handleCompleteDrill('grounding', 35)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Finish Drill (+35 XP)</span>
              </button>
            )}
          </div>
        </div>

        {/* Drill 3: The Introvert Reframe */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              Cognitive Reframe
            </span>
            <h3 className="text-lg font-bold text-white font-['Outfit'] mt-0.5">
              The Introvert Superpower Manifesto
            </h3>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <span className="text-amber-400 font-bold text-sm">1.</span>
              <div>
                <strong className="text-white block">Silence is Poise, Not Hesitation.</strong>
                <span className="text-slate-400">
                  When asked a tough question, senior engineers pause for 2-3 seconds to architect their response. It signals deep consideration, not ignorance.
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <span className="text-amber-400 font-bold text-sm">2.</span>
              <div>
                <strong className="text-white block">Structure Beats Volume.</strong>
                <span className="text-slate-400">
                  Extroverts often ramble. An introvert using a crisp 3-point framework (Context, Core Mechanism, Trade-off) leaves interviewers amazed at their clarity.
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <span className="text-amber-400 font-bold text-sm">3.</span>
              <div>
                <strong className="text-white block">Interviews are Peer Collaborations.</strong>
                <span className="text-slate-400">
                  The interviewer is not an interrogator on a podium; they are an engineer looking for a calm teammate to solve systems problems with.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={() => handleCompleteDrill('manifesto', 25)}
              disabled={completedDrills['manifesto']}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                completedDrills['manifesto']
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20'
              }`}
            >
              {completedDrills['manifesto'] ? 'Read & Internalized ✓' : 'Mark as Read (+25 XP)'}
            </button>
          </div>
        </div>

        {/* Drill 4: Vocal Warmup & Diaphragm Projection */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                Vocal Presence
              </span>
              <h3 className="text-lg font-bold text-white font-['Outfit'] mt-0.5">
                Trembling Voice Neutralizer
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              When anxious, vocal cords constrict, causing candidate voices to sound shallow or shaky. These 3 quick physical releases restore your natural resonance.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800">
                <strong className="text-white block mb-0.5">1. Shoulder Drop &amp; Jaw Release</strong>
                <span className="text-slate-400">
                  Open your mouth slightly and gently move your jaw side to side. Let your shoulders drop away from your ears.
                </span>
              </div>
              <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800">
                <strong className="text-white block mb-0.5">2. Low Hum (Belly Resonance)</strong>
                <span className="text-slate-400">
                  Make a gentle "Mmmmmm" humming sound on an exhale. Feel the vibration in your chest rather than your throat.
                </span>
              </div>
              <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800">
                <strong className="text-white block mb-0.5">3. Grounding Power Stance</strong>
                <span className="text-slate-400">
                  Place both feet flat on the floor, spine straight, palms relaxed on your thighs. Own your physical space.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 text-right">
            <button
              onClick={() => handleCompleteDrill('vocal', 25)}
              disabled={completedDrills['vocal']}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                completedDrills['vocal']
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20'
              }`}
            >
              {completedDrills['vocal'] ? 'Warmup Completed ✓' : 'Complete Warmup (+25 XP)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
