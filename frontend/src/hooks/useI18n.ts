import { useAppSelector } from "@/hooks/hooks";
import { translate, type Locale } from "@/i18n/messages";

export const LOCALE_STORAGE_KEY = "nl-locale";

export function useI18n() {
  const language = useAppSelector((state) => state.settings.language);
  const locale: Locale = language === "en" ? "en" : "es";

  return {
    locale,
    t: (key: string) => translate(locale, key),
  };
}
