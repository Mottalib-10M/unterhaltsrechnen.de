/** Startseite (Säule) in beiden Sprachen. Alle Rechtswerte über h.P, alle Ergebnisse aus dem Motor. */
import type { FAQ, Helpers } from '../lib/guide-types';
interface HomeText { title: string; description: string; h1: string; intro: string; resume: (h: Helpers) => string; faqs: (h: Helpers) => FAQ[]; body: (h: Helpers) => string }
export const HOME: Record<'de' | 'en', HomeText> = {
  de: { title: 'Düsseldorfer Tabelle 2026: Kindesunterhalt mit Rechner', description: 'x', h1: 'Düsseldorfer Tabelle 2026', intro: 'x', resume: () => 'x', faqs: () => [], body: () => '<p>x</p>' },
  en: { title: 'Düsseldorf Table 2026: German Child Support Calculator', description: 'x', h1: 'Düsseldorf Table 2026', intro: 'x', resume: () => 'x', faqs: () => [], body: () => '<p>x</p>' },
};
