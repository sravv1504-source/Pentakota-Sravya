import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InterviewerMood, InterviewerPersona } from '../types';
import { INTERVIEWERS } from '../data/interviewers';
import {
  Volume2,
  VolumeX,
  Smile,
  Shield,
  Heart,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface HumanInterviewerStageProps {
  mood: InterviewerMood;
  isSpeaking: boolean;
  isListening: boolean;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  anxietyLevel: 'calm' | 'mild' | 'high';
  onChangeAnxiety: (level: 'calm' | 'mild' | 'high') => void;
}

export const HumanInterviewerStage: React.FC<HumanInterviewerStageProps> = ({
  mood,
  isSpeaking,
  isListening,
  voiceEnabled,
  onToggleVoice,
  anxietyLevel,
  onChangeAnxiety,
}) => {
  const { selectedInterviewer, setSelectedInterviewer, openZenModal } = useApp();
  const [showPersonaDetails, setShowPersonaDetails] = useState(false);

  // Mood badge styling
  const moodConfig = {
    smiling: {
      text: 'Encouraging & Smiling',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      ringColor: 'ring-emerald-500/40',
    },
    listening: {
      text: 'Listening Attentively...',
      badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      ringColor: 'ring-cyan-500/50',
    },
    nodding: {
      text: 'Nodding Warmly',
      badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      ringColor: 'ring-indigo-500/40',
    },
    encouraging: {
      text: 'Impressed & Supportive',
      badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      ringColor: 'ring-amber-500/50',
    },
    thinking: {
      text: 'Reflecting on your point...',
      badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      ringColor: 'ring-purple-500/40',
    },
  }[mood] || {
    text: 'Attentive & Calm',
    badgeColor: 'bg-slate-700/50 text-slate-300 border-slate-600',
    ringColor: 'ring-slate-700',
  };

  return (
    <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
      {/* Background soft ambient gradient */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Interviewer Info & Voice Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">
            Human AI Interviewer
          </span>
          <button
            onClick={() => setShowPersonaDetails(!showPersonaDetails)}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
            title="View interviewer credentials"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Spoken Voice Toggle */}
          <button
            onClick={onToggleVoice}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              voiceEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title={voiceEnabled ? 'Interviewer speaks aloud' : 'Audio voice muted'}
          >
            {voiceEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Voice: On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Voice: Muted</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Human Avatar Visual Stage */}
      <div className="relative flex flex-col items-center justify-center my-3">
        {/* Animated Listening / Speaking Waves */}
        {isSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-56 rounded-full bg-indigo-500/15 animate-ping duration-1000" />
            <div className="w-64 h-64 rounded-full bg-teal-500/10 animate-pulse" />
          </div>
        )}

        {isListening && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-52 h-52 rounded-full border border-cyan-400/40 animate-ping duration-700" />
          </div>
        )}

        {/* Human Portrait Avatar Frame */}
        <div
          className={`relative w-44 h-44 sm:w-48 sm:h-48 rounded-full p-1.5 bg-gradient-to-tr from-indigo-500 via-teal-400 to-amber-300 shadow-2xl transition-all duration-300 ${moodConfig.ringColor} ring-4`}
        >
          <img
            src={selectedInterviewer.image}
            alt={selectedInterviewer.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-full filter contrast-[1.03] brightness-[1.02] shadow-inner"
          />

          {/* Live Speaking Mouth Activity Indicator */}
          {isSpeaking && (
            <div className="absolute bottom-2 right-4 bg-indigo-600 border-2 border-slate-900 rounded-full p-2 shadow-lg flex items-center gap-1">
              <span className="w-1 h-3 bg-white rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1 h-4 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          )}

          {/* Listening Mic Indicator */}
          {isListening && !isSpeaking && (
            <div className="absolute bottom-2 right-4 bg-cyan-600 border-2 border-slate-900 rounded-full p-2 shadow-lg animate-pulse">
              <span className="block w-2.5 h-2.5 rounded-full bg-white" />
            </div>
          )}
        </div>

        {/* Human Interviewer Name & Title */}
        <div className="text-center mt-3">
          <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center justify-center gap-1.5">
            <span>{selectedInterviewer.name}</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400 fill-teal-400/20" />
          </h3>
          <p className="text-xs text-slate-400">{selectedInterviewer.title}</p>
          <p className="text-[11px] text-slate-500">{selectedInterviewer.companyBackground}</p>
        </div>

        {/* Live Emotional State Badge */}
        <div
          className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-colors ${moodConfig.badgeColor}`}
        >
          <Smile className="w-3.5 h-3.5" />
          <span>{moodConfig.text}</span>
        </div>
      </div>

      {/* Persona Credentials Dropdown / Modal */}
      {showPersonaDetails && (
        <div className="my-2 p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-left animate-fade-in text-xs">
          <div className="flex items-center justify-between font-semibold text-slate-200 mb-1">
            <span>Empathy Philosophy</span>
            <button
              onClick={() => setShowPersonaDetails(false)}
              className="text-slate-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <p className="text-slate-400 mb-2 leading-relaxed">
            "{selectedInterviewer.empathyStyle}"
          </p>
          <div className="text-[11px] text-teal-400 font-medium">
            Tone: {selectedInterviewer.preferredTone}
          </div>
        </div>
      )}

      {/* Switch Human Interviewer Persona */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold uppercase tracking-wider text-[10px]">
            Choose Your Interviewer
          </span>
          <span className="text-[11px] text-indigo-400 font-medium">Comfort First</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {INTERVIEWERS.map((persona) => {
            const isSelected = selectedInterviewer.id === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => setSelectedInterviewer(persona)}
                className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/20'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <img
                  src={persona.image}
                  alt={persona.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <span className="text-[11px] font-semibold text-slate-200 truncate w-full text-center">
                  {persona.name.split(' ')[1] || persona.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Candidate Stage Anxiety Meter */}
      <div className="mt-4 p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-300 font-medium flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Nervousness Filter:</span>
          </span>
          <span
            className={`font-bold capitalize text-[11px] ${
              anxietyLevel === 'high'
                ? 'text-rose-400'
                : anxietyLevel === 'mild'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {anxietyLevel === 'high'
              ? 'Stage Panic (Gentle Mode)'
              : anxietyLevel === 'mild'
              ? 'Mild Jitters'
              : 'Grounded & Composed'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-xl">
          <button
            onClick={() => onChangeAnxiety('calm')}
            className={`py-1 text-[11px] font-semibold rounded-lg transition-all ${
              anxietyLevel === 'calm'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Calm
          </button>
          <button
            onClick={() => onChangeAnxiety('mild')}
            className={`py-1 text-[11px] font-semibold rounded-lg transition-all ${
              anxietyLevel === 'mild'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mild
          </button>
          <button
            onClick={() => {
              onChangeAnxiety('high');
              openZenModal();
            }}
            className={`py-1 text-[11px] font-semibold rounded-lg transition-all ${
              anxietyLevel === 'high'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            High Anxiety
          </button>
        </div>
      </div>
    </div>
  );
};
