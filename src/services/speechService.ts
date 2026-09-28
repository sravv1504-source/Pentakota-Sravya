// Speech Synthesis (Text-to-Speech) & Speech Recognition (Speech-to-Text)

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isListening = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }

    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
      }
    }
  }

  public speak(
    text: string,
    lang = 'en-US',
    pitch = 1.0,
    rate = 0.95,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (!this.synth) {
      if (onStart) onStart();
      setTimeout(() => {
        if (onEnd) onEnd();
      }, 2000);
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    // Clean text of markdown characters
    const cleanText = text.replace(/[*_#`[\]()]/g, ' ').trim();
    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = pitch;
    utterance.rate = rate;

    // Map language code to BCP 47
    const langMap: Record<string, string> = {
      en: 'en-US',
      es: 'es-ES',
      hi: 'hi-IN',
      zh: 'zh-CN',
      fr: 'fr-FR',
      de: 'de-DE',
      ja: 'ja-JP',
      pt: 'pt-BR',
      te: 'te-IN',
    };
    const bcp47 = langMap[lang] || lang;
    utterance.lang = bcp47;

    const voices = this.synth.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(bcp47.slice(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public startListening(
    lang = 'en-US',
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: any) => void
  ): boolean {
    if (!this.recognition) {
      if (onError) onError(new Error('Speech recognition not supported in this browser.'));
      return false;
    }

    if (this.isListening) {
      return true;
    }

    const langMap: Record<string, string> = {
      en: 'en-US',
      es: 'es-ES',
      hi: 'hi-IN',
      zh: 'zh-CN',
      fr: 'fr-FR',
      de: 'de-DE',
      ja: 'ja-JP',
      pt: 'pt-BR',
      te: 'te-IN',
    };
    this.recognition.lang = langMap[lang] || lang;

    this.recognition.onresult = (event: any) => {
      let currentTranscript = '';
      let isFinal = false;

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          currentTranscript += event.results[i][0].transcript;
          isFinal = true;
        } else {
          currentTranscript += event.results[i][0].transcript;
        }
      }

      onResult(currentTranscript, isFinal);
    };

    this.recognition.onerror = (event: any) => {
      console.warn('SpeechRecognition error:', event.error);
      this.isListening = false;
      if (onError) onError(event);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err) {
      console.error('Failed to start recognition:', err);
      this.isListening = false;
      if (onError) onError(err);
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  public isSpeechSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public isRecognitionSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    );
  }
}

export const speechService = new SpeechService();
