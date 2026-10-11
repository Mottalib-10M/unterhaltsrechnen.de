import type { Locale } from './routes';
const de = {
  updatedOn: 'Aktualisiert am', editorialPolicy: 'Redaktionsgrundsätze', contactLabel: 'Kontakt', reviewedBy: 'Geprüft von',
  skipToContent: 'Zum Inhalt', mainNav: 'Hauptnavigation', breadcrumbLabel: 'Brotkrümelnavigation', breadcrumbHome: 'Start', menuOpen: 'Menü öffnen',
  faqTitle: 'Häufige Fragen', relatedCalculators: 'Passende Rechner und Seiten', sourcesTitle: 'Quellen', writtenBy: 'Verfasst von',
  asOf: 'Werte', lastUpdated: 'geprüft am', footerValidated: 'Zahlbetrags-, Pfändungs- und Gebührentabellen Zeile für Zeile nachgerechnet', footerBrowser: 'Rechnet nur in Ihrem Browser · keine Datenübertragung · kostenlos',
  footerDisclaimer: 'Unabhängige Seite von Radif Partners, ohne Verbindung zu Gerichten, Behörden, Jugendämtern oder Anwaltskanzleien. Allgemeine Information und Berechnung nach den amtlichen Werten 2026, keine Rechtsberatung im Einzelfall im Sinne des Rechtsdienstleistungsgesetzes.', footerPopular: '', notFound: 'Diese Seite gibt es nicht.',
  readMore: 'Weiterlesen',
};
const en: typeof de = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Checked by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Frequently asked questions', relatedCalculators: 'Related calculators and pages', sourcesTitle: 'Sources', writtenBy: 'Written by',
  asOf: 'Figures', lastUpdated: 'checked on', footerValidated: 'Payment, garnishment and fee tables recalculated line by line', footerBrowser: 'Runs only in your browser · no data sent · free',
  footerDisclaimer: 'Independent site by Radif Partners, not affiliated with any court, authority, youth welfare office or law firm. General information and calculations based on official 2026 values; no legal advice on individual cases within the meaning of the German Legal Services Act.', footerPopular: '', notFound: 'This page does not exist.',
  readMore: 'Read more',
};
export function t(lang: Locale) { return lang === 'en' ? en : de; }
