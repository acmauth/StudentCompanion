import { derived, writable } from "svelte/store";
import translations from "./translations/translations.js";

export const locale = writable("el");
export const locales = Object.keys(translations);

function translate(locale: string, key:string, vars) {
 
  if (!key) throw new Error("no key provided to $t()");
  if (!locale) throw new Error(`no translation for key "${key}"`);

  let text = translations[locale][key];

  if (!text) throw new Error(`no translation found for ${locale}.${key}`);

  Object.keys(vars).map((k) => {
    const regex = new RegExp(`{{${k}}}`, "g");
    text = text.replace(regex, vars[k]);
  });

  return text;
}

export function changeLocale(lang: string): void {
  locale.set(lang);
}

export const t = derived(locale, ($locale) => (key: string, vars = {}) =>
  translate($locale, key, vars)
);