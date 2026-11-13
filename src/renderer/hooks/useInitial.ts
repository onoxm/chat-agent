import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "../store";

export const useInitial = () => {
  const { i18n } = useTranslation();
  const language = useStore("language");

  useEffect(() => {
    if (language) i18n.changeLanguage(language);
  }, [language]);
};
