import { create } from 'zustand';
import { 
  type SupportedLanguageCode, 
  type TranslationStructure,
  availableLanguages,
  defaultLanguageCode,
  getTranslationsForLanguage
} from '../locales';

const LOCAL_STORAGE_LANGUAGE_KEY = 'selectedLanguage';

interface LanguageStoreState {
  currentLanguageCode: SupportedLanguageCode;
  currentTranslations: TranslationStructure;
  changeLanguage: (newLanguageCode: SupportedLanguageCode) => void;
  initializeFromLocalStorage: () => void;
}

function getLanguageFromLocalStorage(): SupportedLanguageCode {
  try {
    const storedLanguage = localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY);
    
    if (storedLanguage && storedLanguage in availableLanguages) {
      return storedLanguage as SupportedLanguageCode;
    }
  } catch (error) {
    console.warn('Failed to read language from localStorage:', error);
  }
  
  return defaultLanguageCode;
}

function saveLanguageToLocalStorage(languageCode: SupportedLanguageCode): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, languageCode);
  } catch (error) {
    console.warn('Failed to save language to localStorage:', error);
  }
}

export const useLanguageStore = create<LanguageStoreState>((set, get) => ({
  currentLanguageCode: defaultLanguageCode,
  currentTranslations: availableLanguages[defaultLanguageCode],
  
  changeLanguage: (newLanguageCode: SupportedLanguageCode) => {
    const newTranslations = getTranslationsForLanguage(newLanguageCode);
    
    set({
      currentLanguageCode: newLanguageCode,
      currentTranslations: newTranslations,
    });
    
    saveLanguageToLocalStorage(newLanguageCode);
  },
  
  initializeFromLocalStorage: () => {
    const savedLanguageCode = getLanguageFromLocalStorage();
    const savedTranslations = getTranslationsForLanguage(savedLanguageCode);
    
    set({
      currentLanguageCode: savedLanguageCode,
      currentTranslations: savedTranslations,
    });
  },
}));