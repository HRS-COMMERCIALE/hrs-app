import { useLanguageStore } from '../../store/languageStore';
import { type SupportedLanguageCode } from '../../locales';

/**
 * Utility function to change the application language
 * @param languageCode - The language code to switch to
 */
export const changeAppLanguage = (languageCode: SupportedLanguageCode): void => {
  const changeLanguage = useLanguageStore.getState().changeLanguage;
  changeLanguage(languageCode);
};

/**
 * Hook to get language change function and current language
 * @returns Object with changeLanguage function and current language info
 */
export const useLanguageUtils = () => {
  const changeLanguage = useLanguageStore((state) => state.changeLanguage);
  const currentLanguageCode = useLanguageStore((state) => state.currentLanguageCode);
  const currentTranslations = useLanguageStore((state) => state.currentTranslations);

  return {
    changeLanguage,
    currentLanguageCode,
    currentTranslations,
  };
};
