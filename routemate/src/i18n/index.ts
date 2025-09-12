import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import si from './locales/si.json';

export const APP_LANGUAGE_KEY = 'app_language';

const resources = {
  en: { translation: en },
  si: { translation: si },
} as const;

function getDeviceLanguage(): 'en' | 'si' {
  try {
    // Newer Expo SDKs
    const locales = (Localization as any).getLocales?.();
    const code = Array.isArray(locales) && locales.length > 0 ? locales[0]?.languageCode : undefined;
    const lang = (code || (Localization as any).locale || '').toString().toLowerCase();
    if (lang.startsWith('si')) return 'si';
  } catch {}
  return 'en';
}

let initialized = false;
let initPromise: Promise<void> | null = null;

async function configureI18n(language: 'en' | 'si') {
  if (!initialized) {
    await i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: language,
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
        compatibilityJSON: 'v3',
      });

    // Persist language on change
    i18n.on('languageChanged', async (lng) => {
      try {
        await AsyncStorage.setItem(APP_LANGUAGE_KEY, lng);
      } catch {}
    });

    initialized = true;
  } else {
    // Already initialized; just switch language
    await i18n.changeLanguage(language);
  }
}

export async function initI18n(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const stored = await AsyncStorage.getItem(APP_LANGUAGE_KEY);
      const device = getDeviceLanguage();
      const lang = stored === 'si' || stored === 'en' ? stored : device;
      await configureI18n(lang);
    } catch {
      await configureI18n('en');
    }
  })();
  return initPromise;
}

// Kick off init early to ensure translations are ready even if initI18n is not awaited externally.
// Consumers may still await initI18n() for certainty.
void initI18n();

export default i18n;

