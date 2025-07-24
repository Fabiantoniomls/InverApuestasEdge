
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

const translations = {
  en: {
    dashboard: 'Dashboard',
    analyze: 'Analyze',
    ledger: 'Ledger',
    profile: 'Profile',
    myAccount: 'My Account',
    settings: 'Settings',
    logout: 'Log out',
    changeLanguage: 'Change language',
    english: 'English',
    spanish: 'Español',
    quantitativeAnalysis: 'Quantitative Analysis',
    fundamentalAnalysis: 'Fundamental Analysis',
    singleMatchAnalysis: 'Single Match',
    quantitativeFootballModeling: 'Quantitative Football Modeling',
    quantitativeDescription: 'Use the Poisson-xG hybrid model to find value bets in football markets.',
    fundamentalMatchAnalysis: 'Fundamental Match Analysis',
    fundamentalDescription: 'Perform qualitative analysis for Football or Tennis based on contextual factors.',
    stakingStrategyReference: 'Staking Strategy Reference',
    stakingStrategyDescription: 'Context for selecting a staking plan for your analysis.',
    singleMatchAnalysisTitle: 'Quick Single Match Analysis',
    singleMatchAnalysisDescription: 'Paste in match details for a quick analysis and value bet recommendation.',
  },
  es: {
    dashboard: 'Panel',
    analyze: 'Analizar',
    ledger: 'Registro',
    profile: 'Perfil',
    myAccount: 'Mi Cuenta',
    settings: 'Ajustes',
    logout: 'Cerrar Sesión',
    changeLanguage: 'Cambiar idioma',
    english: 'Inglés',
    spanish: 'Español',
    quantitativeAnalysis: 'Análisis Cuantitativo',
    fundamentalAnalysis: 'Análisis Fundamental',
    singleMatchAnalysis: 'Partido Individual',
    quantitativeFootballModeling: 'Modelado Cuantitativo de Fútbol',
    quantitativeDescription: 'Use el modelo híbrido Poisson-xG para encontrar apuestas de valor en los mercados de fútbol.',
    fundamentalMatchAnalysis: 'Análisis Fundamental de Partidos',
    fundamentalDescription: 'Realice análisis cualitativos para fútbol o tenis basados en factores contextuales.',
    stakingStrategyReference: 'Referencia de Estrategia de Apuestas',
    stakingStrategyDescription: 'Contexto para seleccionar un plan de apuestas para su análisis.',
    singleMatchAnalysisTitle: 'Análisis Rápido de Partido Individual',
    singleMatchAnalysisDescription: 'Pega los detalles del partido para un análisis rápido y una recomendación de apuesta de valor.',
  },
};

type Language = 'en' | 'es';
type Translations = typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
