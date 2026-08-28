'use client';

import React, { useState, useEffect, useRef } from 'react';

interface VoiceCommanderProps {
  onNavigate: (tab: string) => void;
}

export default function VoiceCommander({ onNavigate }: VoiceCommanderProps) {
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState('Comando por Voz');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'pt-BR';
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsListening(true);
          setFeedback('Ouvindo...');
        };

        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          processVoiceIntent(text);
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          setFeedback('Erro no mic');
        };

        recognition.onend = () => {
          setIsListening(false);
          setTimeout(() => setFeedback('Comando por Voz'), 2500);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const processVoiceIntent = (command: string) => {
    const lower = command.toLowerCase();

    if (lower.includes('saas') || lower.includes('auditoria') || lower.includes('banco') || lower.includes('sql')) {
      speak('Abrindo Engenharia SaaS.');
      setFeedback('Indo para SaaS...');
      onNavigate('saas');
      return;
    }

    if (lower.includes('landing') || lower.includes('página de venda') || lower.includes('presell') || lower.includes('vsl')) {
      speak('Abrindo Páginas Presell.');
      setFeedback('Indo para Presell...');
      onNavigate('presell');
      return;
    }

    if (lower.includes('post') || lower.includes('facebook') || lower.includes('instagram') || lower.includes('brandkit') || lower.includes('design')) {
      speak('Abrindo Post Studio.');
      setFeedback('Indo para Post Studio...');
      onNavigate('posts');
      return;
    }

    if (lower.includes('crm') || lower.includes('lead') || lower.includes('cliente') || lower.includes('pipeline')) {
      speak('Abrindo CRM.');
      setFeedback('Indo para CRM...');
      onNavigate('crm');
      return;
    }

    if (lower.includes('história') || lower.includes('vídeo') || lower.includes('story') || lower.includes('lego') || lower.includes('bíblia')) {
      speak('Abrindo Fábrica de Vídeos.');
      setFeedback('Indo para Vídeos...');
      onNavigate('historias');
      return;
    }

    speak(`Entendido: ${command}.`);
    setFeedback(`"${command}"`);
    onNavigate('hub');
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <button
      onClick={toggleListening}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300 ${
        isListening
          ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-lg shadow-rose-500/30 animate-pulse'
          : 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:scale-[1.02]'
      }`}
      title="Clique para falar com o sistema"
    >
      <div className="flex items-center gap-2.5">
        <span className="text-base">{isListening ? '🔴' : '🎙️'}</span>
        <span className="truncate">{feedback}</span>
      </div>
      {isListening ? (
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
      ) : (
        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
          Voz
        </span>
      )}
    </button>
  );
}
