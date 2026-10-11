import { defineGuide } from '../../lib/guide-types';
import { erbfolge, pflichtteilsergaenzung } from '../../lib/engine/erbe';
import { P, DE, EN } from '../../lib/fmt';

/** Bruch aus einer Quote (0,125 → „1/8“), wie ihn der Rechner anzeigt. */
const br = (q: number) => {
  for (const d of [1, 2, 3, 4, 6, 8, 12, 16, 24, 32]) { const n = Math.round(q * d); if (Math.abs(n / d - q) < 1e-9) return d === 1 ? String(n) : `${n}/${d}`; }
  return q.toFixed(3);
};
const E = P.erbrecht;
/** Startwerte des Rechners im Pflichtteil-Modus: 300.000 €, verheiratet, Zugewinngemeinschaft, zwei Kinder, Schenkung 50.000 € vor drei Jahren. */
const N = 300000, SCH = 50000, J = 3;
const r = erbfolge({ verheiratet: true, gueterstand: 'zugewinn', kinder: 2, nachlass: N });
const kind = r.anteile.find((a) => a.wer === 'kind')!;
const q = kind.quoteJe * E.pflichtteil_quote;
const erg = pflichtteilsergaenzung(SCH, J, q);
const gesamt = kind.pflichtteilJe + erg.ergaenzung;
/** Zweiter Fall: ledige Mutter, drei Kinder, 210.000 €, Wohnung für 150.000 € an eine Freundin vor sieben Jahren. */
const r2 = erbfolge({ verheiratet: false, kinder: 3, nachlass: 210000 });
const k2 = r2.anteile.find((a) => a.wer === 'kind')!;
const q2 = k2.quoteJe * E.pflichtteil_quote;
const erg2 = pflichtteilsergaenzung(150000, 7, q2);
/** Dritter Fall: wie der erste, Schenkung aber an die Ehefrau (keine Abschmelzung). */
const erg3 = pflichtteilsergaenzung(SCH, J, q, true);

export default defineGuide({
  id: 'pflichtteilsrechner',
  group: 'erbe',
  order: 25,
  tool: 'erbfolge',
  toolPreset: { modus: 'pflichtteil' },
  related: ['pflichtteil', 'pflichtteilsergaenzung', 'erbrechner', 'ehegattenerbrecht', 'erbschaftsteuer-rechner'],
  sources: ['bgb2303', 'bgb2325', 'bgb1371'],
  de: {
    slug: 'pflichtteilsrechner',
    nav: 'Pflichtteilsrechner',
    card: 'Pflichtteil eines enterbten Kindes berechnen, mit Schenkungen der letzten Jahre und Abschmelzung je Jahr.',
    title: 'Pflichtteilsrechner 2026: Pflichtteil mit Schenkungen',
    description: `Pflichtteilsrechner 2026: Pflichtteil eines Kindes nach § 2303 BGB berechnen, mit Pflichtteilsergänzung für Schenkungen nach § 2325 BGB, je Jahr ${DE.pct(E.ergaenzung_abschmelzung_jahr)} weniger.`,
    h1: 'Pflichtteilsrechner: Pflichtteil und Ergänzung für Schenkungen',
    intro: 'Der Rechner ermittelt den Pflichtteil eines enterbten Kindes aus dem Nachlass und rechnet eine Schenkung des Erblassers anteilig hinzu.',
    resume: `Der Pflichtteilsrechner beantwortet die Frage, wie viel ein enterbtes Kind vom Erben verlangen kann. Er bestimmt zuerst den gesetzlichen Erbteil, halbiert ihn nach § 2303 BGB und wendet die Quote auf den Nachlass an. Dann rechnet er eine Schenkung an Dritte nach § 2325 BGB hinzu, abgeschmolzen um ${DE.pct(E.ergaenzung_abschmelzung_jahr)} für jedes volle Jahr seit der Schenkung. Mit den Startwerten, ${DE.eur(N)} Nachlass, einem Ehegatten in Zugewinngemeinschaft und zwei Kindern, beträgt die Pflichtteilsquote je Kind ${br(q)}, also ${DE.eur(kind.pflichtteilJe)}. Eine Schenkung von ${DE.eur(SCH)} vor ${J} vollen Jahren zählt noch zu ${DE.pct(erg.faktor)} und bringt eine Ergänzung von ${DE.eur(erg.ergaenzung)}. Zusammen kann jedes Kind ${DE.eur(gesamt)} fordern. Nach ${DE.num(E.ergaenzung_jahre)} vollen Jahren entfällt die Ergänzung. Der Rechner zeigt außerdem den Pflichtteil des Ehegatten und, ohne Kinder, den der Eltern.`,
    faqs: [
      { q: 'Wie trage ich im Pflichtteilsrechner eine Schenkung an den Ehegatten ein?', a: `Mit 0 Jahren. Bei Schenkungen an den Ehegatten beginnt die Frist nach § 2325 Abs. 3 BGB nicht vor Auflösung der Ehe, die Schenkung zählt also voll, egal wie alt sie ist. Das Feld heißt im Rechner Schenkung an Dritte und schmilzt automatisch ab; 0 Jahre setzt den Faktor auf ${DE.pct(erg3.faktor)}. Mit den Startwerten ergibt das ${DE.eur(erg3.ergaenzung)} statt ${DE.eur(erg.ergaenzung)}.` },
      { q: 'Kann ich im Pflichtteilsrechner mehrere Schenkungen eingeben?', a: 'Nicht in einem Durchgang, der Rechner hat ein Feld für eine Schenkung. Weil jede Schenkung nach ihrem eigenen Alter abgeschmolzen wird, rechnen Sie mehrere Schenkungen nacheinander und addieren die Ergänzungsbeträge. Den Pflichtteil aus dem Nachlass zählen Sie dabei nur einmal. Schenkungen an das enterbte Kind selbst gehören nicht in das Feld; sie werden nach § 2327 BGB auf seine Ergänzung angerechnet.' },
      { q: 'Warum zeigt der Pflichtteilsrechner bei 0 Kindern keinen Pflichtteil oben an?', a: 'Die Kopfzeile zeigt den Pflichtteil je Kind. Ohne Kinder sind Eltern und Ehegatte pflichtteilsberechtigt; ihre Beträge erscheinen in den Zeilen darunter. Die Ergänzung für Schenkungen rechnet der Rechner nur für Kinder aus. Für einen enterbten Elternteil lässt sich die Ergänzung mit dem Mini-Rechner auf der Seite zur Pflichtteilsergänzung bestimmen, indem Sie seine Pflichtteilsquote wählen.' },
      { q: 'Was zählt als volles Jahr seit der Schenkung?', a: 'Gezählt werden die vollendeten Jahre zwischen der Leistung, also etwa der Grundbucheintragung oder der Überweisung, und dem Todestag. Liegt die Schenkung elf Monate zurück, sind es 0 volle Jahre, und sie zählt ganz. Liegt sie drei Jahre und zehn Monate zurück, tragen Sie 3 ein. Bei vorbehaltenem Nießbrauch läuft die Frist nach der Rechtsprechung in der Regel nicht.' },
    ],
    body: (h) => `<h2>Die Felder</h2>
<ul>
<li><strong>Wert des Nachlasses</strong>: Vermögen am Todestag nach Abzug der Schulden.</li>
<li><strong>Verheiratet?</strong> und <strong>Güterstand</strong>: bestimmen den Anteil des Ehegatten und damit, wie viel für die Kinder bleibt.</li>
<li><strong>Kinder</strong>: alle Kinder einschließlich des enterbten; vorverstorbene Kinder mit Nachkommen zählen mit.</li>
<li><strong>Schenkung an Dritte</strong>: Wert einer Schenkung des Erblassers zu Lebzeiten, etwa an einen Partner, ein anderes Kind oder eine Stiftung.</li>
<li><strong>Volle Jahre seit Schenkung</strong>: vollendete Jahre zwischen Schenkung und Tod.</li>
</ul>
<p>Oben steht der Pflichtteil je Kind einschließlich Ergänzung, mit der Quote und dem Ergänzungsanteil darunter. Die Zeilen zeigen den gesetzlichen Erbteil jeder Gruppe, alle Pflichtteile nach ${h.src('bgb2303', '§ 2303 BGB')} und bei Zugewinngemeinschaft den kleinen Pflichtteil des Ehegatten nach ${h.src('bgb1371', '§ 1371 Abs. 2 BGB')}. Der Rechenweg nennt den Anrechnungsfaktor nach ${h.src('bgb2325', '§ 2325 Abs. 3 BGB')}.</p>
<h2>Drei Rechnungen</h2>
${h.table(['Fall', 'Quote', 'Pflichtteil', 'Ergänzung', 'Zusammen'], [
  [`${h.eur(N)}, Ehegatte, 2 Kinder, ${h.eur(SCH)} vor ${J} Jahren`, br(q), h.eur(kind.pflichtteilJe), h.eur(erg.ergaenzung), h.eur(gesamt)],
  [`${h.eur(210000)}, ledig, 3 Kinder, ${h.eur(150000)} vor 7 Jahren`, br(q2), h.eur(k2.pflichtteilJe), h.eur(erg2.ergaenzung), h.eur(k2.pflichtteilJe + erg2.ergaenzung)],
  [`wie Fall 1, Schenkung an die Ehefrau (0 Jahre eingetragen)`, br(q), h.eur(kind.pflichtteilJe), h.eur(erg3.ergaenzung), h.eur(kind.pflichtteilJe + erg3.ergaenzung)],
], 'Vom Pflichtteilsrechner ermittelt, je Kind')}
<p>Im zweiten Fall hat eine Mutter von drei Kindern einer Freundin eine Wohnung geschenkt; nach sieben vollen Jahren zählen davon noch ${h.pct(erg2.faktor, 0)}. Die Ergänzung richtet sich gegen den Erben, reicht der Nachlass nicht, unter Umständen gegen die Beschenkte (§ 2329 BGB).</p>
<h2>Was der Rechner nicht abbildet</h2>
<p>Er prüft nicht, ob überhaupt ein Pflichtteilsanspruch besteht, etwa ob ein Testament wirksam enterbt oder ein Pflichtteilsverzicht vorliegt. Er kennt nur eine Schenkung, keine Anrechnung eigener Geschenke des Kindes und keinen Wertabzug für einen vorbehaltenen Nießbrauch. Den großen Pflichtteil des Ehegatten zeigt er als Pflichtteil Ehegatte, den kleinen gesondert. Hintergründe stehen beim ${h.a('pflichtteil', 'Pflichtteil')} und bei der ${h.a('pflichtteilsergaenzung', 'Pflichtteilsergänzung')}; die reine Verteilung ohne Schenkungen zeigt der ${h.a('erbrechner', 'Erbrechner')}. Das Ergebnis ist eine allgemeine Berechnung zum Pflichtteil, keine Rechtsberatung.</p>`,
  },
  en: {
    slug: 'compulsory-share-calculator',
    nav: 'Compulsory share calculator',
    card: 'Work out a disinherited child’s compulsory share in Germany, including gifts made in recent years.',
    title: 'Compulsory Share Calculator Germany 2026: Including Gifts',
    description: `Compulsory share calculator for Germany 2026: a disinherited child’s Pflichtteil under section 2303 BGB plus the top-up for lifetime gifts, ${EN.pct(E.ergaenzung_abschmelzung_jahr)} less per year.`,
    h1: 'Compulsory share calculator: the Pflichtteil plus lifetime gifts',
    intro: 'The tool works out what a disinherited child can claim from the estate and adds the counted part of a lifetime gift.',
    resume: `This calculator answers one question: how much can a child who was left out of a German will demand from the heir? It first finds the child’s statutory fraction, halves it under section 2303 of the Civil Code (BGB) and applies it to the estate. It then adds a lifetime gift to a third party under section 2325 BGB, reduced by ${EN.pct(E.ergaenzung_abschmelzung_jahr)} for each full year since the gift. With the starting values, an estate of ${EN.eur(N)}, a spouse in the default regime and two children, the compulsory fraction per child is ${br(q)}, which is ${EN.eur(kind.pflichtteilJe)}. A gift of ${EN.eur(SCH)} made ${J} full years earlier still counts at ${EN.pct(erg.faktor)}, adding a top-up of ${EN.eur(erg.ergaenzung)}. Each child can therefore claim ${EN.eur(gesamt)} in total. After ${EN.num(E.ergaenzung_jahre)} full years the top-up falls away. The tool also lists the spouse’s compulsory share and, without children, the parents’. Amounts are in euros; convert at the rate of your choice if you live abroad.`,
    faqs: [
      { q: 'How do I enter a gift to the spouse in the compulsory share calculator?', a: `Enter 0 years. For gifts to a spouse, section 2325(3) BGB says the period does not start before the marriage ends, so the gift counts in full however old it is. The field is labelled gift to someone else and reduces automatically; 0 years sets the factor to ${EN.pct(erg3.faktor)}. With the starting values that gives ${EN.eur(erg3.ergaenzung)} instead of ${EN.eur(erg.ergaenzung)}.` },
      { q: 'Can the compulsory share calculator handle several gifts?', a: 'Not in one go: there is a single gift field. Since each gift is reduced according to its own age, run the tool once per gift and add up the top-up amounts, counting the compulsory share from the estate only once. Gifts to the disinherited child personally do not belong in the field; under section 2327 BGB they are set against that child’s top-up.' },
      { q: 'How do I count full years for a gift made while I lived abroad?', a: 'Your own residence plays no role. What counts is the time between performance of the gift, for example land registry entry or the bank transfer, and the date of death. Eleven months means 0 full years and the gift counts entirely; three years and ten months means 3. Where the parent kept a usufruct, case law usually treats the period as not having started.' },
    ],
    body: (h) => `<h2>The fields</h2>
<ul>
<li><strong>Value of the estate</strong>: assets on the date of death after debts.</li>
<li><strong>Married?</strong> and <strong>matrimonial regime</strong>: decide the spouse’s portion and so what is left for the children.</li>
<li><strong>Children</strong>: all children including the one left out; a child who died earlier leaving descendants counts too.</li>
<li><strong>Gift to someone else</strong>: value of a lifetime gift by the deceased, for example to a partner, another child or a foundation.</li>
<li><strong>Full years since the gift</strong>: completed years between the gift and the death.</li>
</ul>
<p>The headline shows the compulsory share per child including the top-up, with the fraction and the top-up below it. The rows list each group’s statutory share, every compulsory share under ${h.src('bgb2303', 'section 2303 BGB')} and, in the default regime, the spouse’s small compulsory share under ${h.src('bgb1371', 'section 1371(2) BGB')}. The step-by-step list states the factor applied under ${h.src('bgb2325', 'section 2325(3) BGB')}.</p>
<h2>Worked runs</h2>
${h.table(['Case', 'Fraction', 'Compulsory share', 'Top-up', 'Total'], [
  [`${h.eur(N)}, spouse, 2 children, ${h.eur(SCH)} given ${J} years ago`, br(q), h.eur(kind.pflichtteilJe), h.eur(erg.ergaenzung), h.eur(gesamt)],
  [`${h.eur(210000)}, single, 3 children, ${h.eur(150000)} given 7 years ago`, br(q2), h.eur(k2.pflichtteilJe), h.eur(erg2.ergaenzung), h.eur(k2.pflichtteilJe + erg2.ergaenzung)],
  ['as case 1, gift to the wife (0 years entered)', br(q), h.eur(kind.pflichtteilJe), h.eur(erg3.ergaenzung), h.eur(kind.pflichtteilJe + erg3.ergaenzung)],
], 'Computed by the compulsory share calculator, per child')}
<p>In the second run a mother of three gave a flat to a friend; after seven full years ${h.pct(erg2.faktor, 0)} of its value still counts. The top-up is claimed from the heir and, if the estate is insufficient, possibly from the recipient of the gift (section 2329 BGB).</p>
<h2>What the tool leaves out</h2>
<p>It does not check whether a claim exists at all, for example whether the will validly excludes the child or whether the child waived the compulsory share. It handles one gift, no set-off of gifts the child received, and no reduction in value for a reserved usufruct. It assumes German succession law applies, which for expats depends on the last habitual residence and any choice of law. Background is on the ${h.a('pflichtteil', 'compulsory share')} and ${h.a('pflichtteilsergaenzung', 'gift top-up claim')} pages; the plain distribution is on the ${h.a('erbrechner', 'inheritance calculator')}. The result is a general calculation of the compulsory share, not legal advice.</p>`,
  },
});
