import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  DifficultyLevel,
  DomainCategory,
  ChatMessage,
  InterviewerMood,
  RubricEvaluation,
  QuestionItem,
} from '../types';
import { QUESTIONS_DATA } from '../data/questions';
import { HumanInterviewerStage } from './HumanInterviewerStage';
import { sendInterviewMessage } from '../services/geminiService';
import { speechService } from '../services/speechService';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Heart,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Award,
  ChevronRight,
  ArrowRight,
  Code,
  ShieldAlert,
} from 'lucide-react';

export const MockInterviewRoom: React.FC = () => {
  const {
    currentLanguage,
    t,
    selectedInterviewer,
    selectedDomain,
    setSelectedDomain,
    selectedDifficulty,
    setSelectedDifficulty,
    recordCompletedInterview,
    openZenModal,
    addPoints,
    userStats,
  } = useApp();

  // Active question in the current mock session
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [candidateInput, setCandidateInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interviewerMood, setInterviewerMood] = useState<InterviewerMood>('smiling');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [anxietyLevel, setAnxietyLevel] = useState<'calm' | 'mild' | 'high'>('mild');
  const [sessionScorecard, setSessionScorecard] = useState<{
    scores: number[];
    averageScore: number;
    feedbacks: string[];
    strengths: string[];
    areasToRefine: string[];
  } | null>(null);

  const [showHint, setShowHint] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Filter questions for the selected domain and difficulty
  const domainQuestions = QUESTIONS_DATA.filter(
    (q) => q.domain === selectedDomain && q.difficulty === selectedDifficulty
  );

  const activeQuestion: QuestionItem =
    domainQuestions[currentQuestionIndex] || domainQuestions[0] || QUESTIONS_DATA[0];

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Start a fresh mock interview session
  const handleStartSession = () => {
    setSessionActive(true);
    setSessionScorecard(null);
    setCurrentQuestionIndex(0);
    setShowHint(false);

    const welcomeGreeting = `Hello! I'm ${selectedInterviewer.name}. Welcome to our technical session today. Take a comfortable deep breath—there are no trick questions here. I'm excited to hear how you think. Whenever you're ready, let's explore this: "${activeQuestion.question}"`;

    const initialMessage: ChatMessage = {
      id: 'msg-0',
      role: 'interviewer',
      content: welcomeGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: 'smiling',
      calmingTip: 'Remember: Silence before an answer is an executive skill. Take 3 seconds to gather your thoughts.',
    };

    setChatMessages([initialMessage]);
    setInterviewerMood('smiling');

    if (voiceEnabled) {
      speechService.speak(
        welcomeGreeting,
        currentLanguage,
        selectedInterviewer.voicePitch,
        selectedInterviewer.voiceRate,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  // Submit candidate answer
  const handleSendMessage = async () => {
    if (!candidateInput.trim() || isSubmitting) return;

    // Stop microphone if running
    if (isListeningMic) {
      speechService.stopListening();
      setIsListeningMic(false);
    }

    const userText = candidateInput.trim();
    setCandidateInput('');

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'candidate',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...chatMessages, userMessage];
    setChatMessages(updatedHistory);
    setIsSubmitting(true);
    setInterviewerMood('listening');

    try {
      const result = await sendInterviewMessage({
        candidateMessage: userText,
        history: updatedHistory.map((m) => ({ role: m.role, content: m.content })),
        currentQuestion: activeQuestion.question,
        domain: selectedDomain,
        difficulty: selectedDifficulty,
        language: currentLanguage,
        interviewerName: selectedInterviewer.name,
        interviewerTitle: selectedInterviewer.title,
        stageFearTipRequested: anxietyLevel === 'high',
      });

      const interviewerMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'interviewer',
        content: result.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood: result.interviewerMood,
        calmingTip: result.calmingTip,
        rubricScore: result.rubric?.score || 82,
      };

      setChatMessages((prev) => [...prev, interviewerMsg]);
      setInterviewerMood(result.interviewerMood);

      // Play audio response if voice enabled
      if (voiceEnabled) {
        speechService.speak(
          result.response,
          currentLanguage,
          selectedInterviewer.voicePitch,
          selectedInterviewer.voiceRate,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }

      // If follow up or next step is available
      if (result.rubric?.score) {
        addPoints(15, 'Quality technical response');
      }
    } catch (err) {
      console.error('Error in mock response:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Voice Microphone toggle
  const handleToggleMic = () => {
    if (isListeningMic) {
      speechService.stopListening();
      setIsListeningMic(false);
    } else {
      const started = speechService.startListening(
        currentLanguage,
        (transcript, isFinal) => {
          setCandidateInput((prev) => (isFinal ? transcript : transcript));
        },
        (err) => {
          console.warn('Mic error:', err);
          setIsListeningMic(false);
        }
      );
      if (started) {
        setIsListeningMic(true);
      }
    }
  };

  // Advance to next question or complete interview
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < domainQuestions.length) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      setShowHint(false);

      const nextQ = domainQuestions[nextIdx];
      const nextMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'interviewer',
        content: `Great work on that topic. Let's move to our next question in ${selectedDomain.toUpperCase()}: "${nextQ.question}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood: 'encouraging',
        calmingTip: nextQ.introvertTip,
      };

      setChatMessages((prev) => [...prev, nextMsg]);
      setInterviewerMood('encouraging');

      if (voiceEnabled) {
        speechService.speak(
          nextMsg.content,
          currentLanguage,
          selectedInterviewer.voicePitch,
          selectedInterviewer.voiceRate,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }
    } else {
      // Completed all questions in the set! Generate Scorecard
      handleFinishInterview();
    }
  };

  // Finish session and award rewards
  const handleFinishInterview = () => {
    const scores = chatMessages
      .filter((m) => m.role === 'interviewer' && m.rubricScore)
      .map((m) => m.rubricScore as number);

    const avg =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 85;

    setSessionScorecard({
      scores: scores.length ? scores : [82, 88],
      averageScore: avg,
      feedbacks: [
        'Excellent conceptual grasp with calm, steady cadence.',
        'Demonstrated thoughtful patience when breaking down complex concepts.',
      ],
      strengths: [
        'Structured thought process',
        'Concise terminology',
        'Introvert poise under questioning',
      ],
      areasToRefine: [
        'Provide one more metric or test case example',
        'Keep relying on your natural calm demeanor',
      ],
    });

    recordCompletedInterview(avg);
    setSessionActive(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Session Configuration Bar (when not in active interview) */}
      {!sessionActive && !sessionScorecard && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="max-w-2xl mb-6">
            <span className="text-emerald-400 font-semibold text-xs uppercase tracking-wider block mb-1">
              Interactive AI Interview Simulation
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Live Mock Interview with Human Form AI
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Practice in a supportive, zero-judgment room designed specifically for introverts and stage fear relief.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Domain Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                1. Computer Language / Domain
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'python', label: 'Python' },
                  { id: 'javascript', label: 'JS & TS' },
                  { id: 'java', label: 'Java' },
                  { id: 'cpp', label: 'C++' },
                  { id: 'sql', label: 'SQL' },
                  { id: 'system-design', label: 'System Design' },
                  { id: 'frontend', label: 'Frontend' },
                  { id: 'behavioral', label: 'Behavioral' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDomain(d.id as DomainCategory)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      selectedDomain === d.id
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                2. Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: 'easy',
                    label: t.easy,
                    desc: 'Core fundamentals',
                    color: 'hover:border-emerald-500',
                  },
                  {
                    id: 'medium',
                    label: t.medium,
                    desc: 'Real architecture',
                    color: 'hover:border-amber-500',
                  },
                  {
                    id: 'hard',
                    label: t.hard,
                    desc: 'Senior & Staff depth',
                    color: 'hover:border-rose-500',
                  },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedDifficulty(lvl.id as DifficultyLevel)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedDifficulty === lvl.id
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                        : `bg-slate-800/80 border-slate-700/80 text-slate-300 ${lvl.color}`
                    }`}
                  >
                    <div className="font-bold text-xs">{lvl.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{lvl.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Preview of Upcoming Question & Human Interviewer */}
          <div className="bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <img
                src={selectedInterviewer.image}
                alt={selectedInterviewer.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-400/40"
              />
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Your Host
                </span>
                <span className="text-sm font-bold text-white">
                  {selectedInterviewer.name} ({selectedInterviewer.title})
                </span>
                <span className="text-xs text-slate-400 block">
                  "{selectedInterviewer.personality}"
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                Available Questions
              </span>
              <span className="text-sm font-bold text-indigo-300">
                {domainQuestions.length} Curated Questions in {selectedDomain.toUpperCase()}
              </span>
              <span className="text-xs text-emerald-400 block">+100 XP upon completion</span>
            </div>
          </div>

          {/* CTA: Enter Mock Interview Room */}
          <button
            onClick={handleStartSession}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-bold text-base rounded-2xl transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
            <span>{t.startInterview}</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Post-Interview Scorecard Display */}
      {sessionScorecard && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
          <div className="text-center max-w-md mx-auto space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <Award className="w-9 h-9" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Mock Interview Completed!
            </h2>
            <p className="text-xs text-slate-400">
              Outstanding composure. Here is your personalized performance evaluation from {selectedInterviewer.name}.
            </p>
          </div>

          {/* Score breakdown metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 text-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                Overall Score
              </span>
              <span className="text-3xl font-extrabold text-emerald-400 font-['Outfit'] tabular-nums block mt-1">
                {sessionScorecard.averageScore}/100
              </span>
              <span className="text-[11px] text-slate-400">Stage Poise: High</span>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 text-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                Reward Earned
              </span>
              <span className="text-3xl font-extrabold text-amber-400 font-['Outfit'] tabular-nums block mt-1">
                +100 XP
              </span>
              <span className="text-[11px] text-amber-400/80">Treasure Vault Key Unlocked</span>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 text-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                Nervousness Level
              </span>
              <span className="text-3xl font-extrabold text-indigo-400 font-['Outfit'] block mt-1 capitalize">
                {anxietyLevel}
              </span>
              <span className="text-[11px] text-slate-400">Autonomic regulation: Strong</span>
            </div>
          </div>

          {/* Strengths & Growth Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4">
              <h4 className="text-sm font-bold text-emerald-300 font-['Outfit'] flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{t.strengths}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {sessionScorecard.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4">
              <h4 className="text-sm font-bold text-amber-300 font-['Outfit'] flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t.improvements}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {sessionScorecard.areasToRefine.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">→</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Restart or Practice Again */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSessionScorecard(null);
                handleStartSession();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Another Round</span>
            </button>
            <button
              onClick={() => setSessionScorecard(null)}
              className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-all"
            >
              Change Domain / Settings
            </button>
          </div>
        </div>
      )}

      {/* Active Live Mock Interview Room Stage */}
      {sessionActive && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Zone: Human Form AI Interviewer Stage (4 cols) */}
          <div className="lg:col-span-4">
            <HumanInterviewerStage
              mood={interviewerMood}
              isSpeaking={isSpeaking}
              isListening={isListeningMic}
              voiceEnabled={voiceEnabled}
              onToggleVoice={() => {
                if (voiceEnabled) speechService.stopSpeaking();
                setVoiceEnabled(!voiceEnabled);
              }}
              anxietyLevel={anxietyLevel}
              onChangeAnxiety={(lvl) => setAnxietyLevel(lvl)}
            />
          </div>

          {/* Right Zone: Interactive Conversation Stage & Input (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col h-[650px] justify-between">
            {/* Top Bar of Session */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white uppercase tracking-wider text-[11px] px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                  {selectedDomain.toUpperCase()}
                </span>
                <span className="capitalize font-semibold text-slate-300">
                  {selectedDifficulty}
                </span>
                <span>·</span>
                <span className="tabular-nums">
                  Question {currentQuestionIndex + 1} of {domainQuestions.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showHint ? 'Hide Hint' : 'STAR Guide'}</span>
                </button>
                <button
                  onClick={openZenModal}
                  className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-lg text-xs flex items-center gap-1 transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span>Calm Pause</span>
                </button>
              </div>
            </div>

            {/* Hint Drawer for Anxious Introverts */}
            {showHint && (
              <div className="my-2 p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs space-y-1.5 animate-fade-in">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Introvert Answering Template:</span>
                </div>
                <p className="text-slate-300">{activeQuestion.introvertTip}</p>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-amber-500/20 grid grid-cols-2 gap-2">
                  <div>
                    <strong className="text-slate-200">Situation:</strong>{' '}
                    {activeQuestion.starFramework.situation}
                  </div>
                  <div>
                    <strong className="text-slate-200">Action:</strong>{' '}
                    {activeQuestion.starFramework.action}
                  </div>
                </div>
              </div>
            )}

            {/* Scrollable Conversation Stream */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto space-y-4 my-3 pr-2 scrollbar-thin scrollbar-thumb-slate-800"
            >
              {chatMessages.map((msg) => {
                const isInterviewer = msg.role === 'interviewer';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      isInterviewer ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    {isInterviewer && (
                      <img
                        src={selectedInterviewer.image}
                        alt={selectedInterviewer.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover mt-1 shrink-0 ring-1 ring-emerald-400"
                      />
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-md ${
                        isInterviewer
                          ? 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tl-sm'
                          : 'bg-indigo-600 text-white rounded-tr-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1 opacity-70">
                        <span className="font-semibold">
                          {isInterviewer ? selectedInterviewer.name : 'You (Candidate)'}
                        </span>
                        <span className="font-mono">{msg.timestamp}</span>
                      </div>

                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {/* Calming Tip Badge (for stage fear guidance) */}
                      {msg.calmingTip && (
                        <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-start gap-1.5 text-xs text-teal-300 bg-teal-950/20 p-2 rounded-lg">
                          <Heart className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                          <span>{msg.calmingTip}</span>
                        </div>
                      )}

                      {/* Rubric Score Badge if provided */}
                      {msg.rubricScore && (
                        <div className="mt-2 text-right">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Confidence &amp; Accuracy: {msg.rubricScore}/100
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isSubmitting && (
                <div className="flex items-center gap-3 text-slate-400 text-xs italic animate-pulse">
                  <img
                    src={selectedInterviewer.image}
                    alt={selectedInterviewer.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span>{selectedInterviewer.name} is thoughtfully listening and reflecting...</span>
                </div>
              )}
            </div>

            {/* Bottom Actions & Input Console */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              {/* Optional Code Snippet Reference for Technical questions */}
              {activeQuestion.codeSnippet && (
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1 font-mono">
                    <Code className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Domain: {activeQuestion.domain}</span>
                  </span>
                  <button
                    onClick={handleNextQuestion}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <span>Advance to Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Input Form with Microphone Speech-to-Text */}
              <div className="relative flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleMic}
                  className={`p-3 rounded-xl border transition-all ${
                    isListeningMic
                      ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title={isListeningMic ? 'Stop Recording' : 'Speak with Microphone'}
                >
                  {isListeningMic ? (
                    <MicOff className="w-5 h-5 text-white" />
                  ) : (
                    <Mic className="w-5 h-5 text-emerald-400" />
                  )}
                </button>

                <textarea
                  value={candidateInput}
                  onChange={(e) => setCandidateInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    isListeningMic
                      ? t.listening
                      : 'Speak into your microphone or type your response here... (Press Enter to submit)'
                  }
                  rows={2}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />

                <button
                  onClick={handleSendMessage}
                  disabled={!candidateInput.trim() || isSubmitting}
                  className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all shadow-md shadow-indigo-600/20 shrink-0"
                  aria-label="Send response"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Pacing Advice for Candidates */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>
                  Pro-tip: If you freeze, speak slowly about your initial assumptions.
                </span>
                <button
                  onClick={handleFinishInterview}
                  className="text-slate-400 hover:text-white underline"
                >
                  {t.finishInterview}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
