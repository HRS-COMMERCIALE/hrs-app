import englishTranslations from './en';
import arabicTranslations from './ar';
import frenchTranslations from './fr';

export type SupportedLanguageCode = 'en' | 'ar' | 'fr';
export type TranslationStructure = typeof englishTranslations;

export const availableLanguages = {
  en: englishTranslations,
  ar: arabicTranslations,
  fr: frenchTranslations,
} as const;

export const defaultLanguageCode: SupportedLanguageCode = 'fr';

export const supportedLanguageCodes = Object.keys(availableLanguages) as SupportedLanguageCode[];

export function getTranslationsForLanguage(languageCode: SupportedLanguageCode): TranslationStructure {
  return availableLanguages[languageCode] || availableLanguages[defaultLanguageCode];
}