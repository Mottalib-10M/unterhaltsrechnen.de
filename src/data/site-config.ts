/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://unterhaltsrechnen.de";
export const SITE_NAMES: Record<string, string> = {"de": "Unterhaltsrechnen", "en": "Unterhaltsrechnen"};
export const LANG_TAGS: Record<string, string> = {"de": "de-DE", "en": "en-DE"};
export const OG_LOCALES: Record<string, string> = {"de": "de_DE", "en": "en_GB"};
/** Zahlenformat je Sprache: deutsch 1.234,56 €, englisch für Expats €1,234.56. */
export const LOCALE_BY_LANG: Record<string, string> = { de: 'de-DE', en: 'en-GB' };
export const LOCALE_TAG = 'de-DE';
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-11';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"de": "Herausgeber der Unterhalts-, Scheidungskosten-, Pfändungs- und Erbrechner", "en": "Publisher of the German support, divorce cost, garnishment and inheritance calculators"};
export const AUTHOR_DESC: Record<string, string> = {"de": "Radif Partners rechnet das deutsche Familienrecht mit den amtlichen Tabellen 2026 nach: Kindes-, Ehegatten-, Volljährigen- und Elternunterhalt nach Düsseldorfer Tabelle und Leitlinien der Oberlandesgerichte in NRW, Gerichts- und Anwaltskosten der Scheidung nach FamGKG und RVG, pfändbares Einkommen nach § 850c ZPO, gesetzliche Erbfolge, Pflichtteil und Erbschaftsteuer. Der Motor reproduziert jede Zeile der Zahlbetrags-, Pfändungs- und Gebührentabellen; er gibt Auskunft über Rechenwege, nicht über den Einzelfall.", "en": "Radif Partners recalculates German family law with the official 2026 tables: child, spousal, adult-child and parental maintenance under the Düsseldorf Table and the NRW court guidelines, divorce court and lawyer fees under FamGKG and RVG, garnishable income under section 850c of the Code of Civil Procedure, statutory inheritance, compulsory share and inheritance tax. The engine reproduces every line of the official payment, garnishment and fee tables; it explains how the figures are reached and gives no advice on individual cases."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"de": ["Düsseldorfer Tabelle", "Kindesunterhalt", "Ehegattenunterhalt", "Scheidungskosten", "Pfändungsfreigrenzen", "Gesetzliche Erbfolge und Pflichtteil", "Erbschaftsteuer"], "en": ["Düsseldorf Table", "Child support in Germany", "Spousal support", "Divorce costs", "Wage garnishment limits", "Statutory inheritance and compulsory share", "Inheritance tax"]};
export const CONTACT_EMAIL = "contact@unterhaltsrechnen.de";
export const THEME_COLOR = '#9E1B1E';
export const LOGO_SYMBOL = '§';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau, aucun cookie, Clarity chargé en mode sans cookie (consentv2 denied).
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = 'yw5icr3wvc';
export const INDEXNOW_KEY = 'b3e1c8d4a6f24e0f9a7c5d2e8b1f4a60';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',  // vide : publication à titre personnel, pas de société
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "Frankreich / France",
  phone: '',
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "USt-IdNr.",
  vatNumber: '',
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
