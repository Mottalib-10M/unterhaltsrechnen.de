import { defineGuide } from '../../lib/guide-types';
import { elternunterhalt } from '../../lib/engine/unterhalt';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor, nie von Hand. */
const S = P.selbstbehalt;
const GRENZE = P.elternunterhalt.jahreseinkommensgrenze;
const FREI = S.eltern_anrechnungsfrei_anteil;
/** Startwerte des Rechners: 4.800 € netto, 105.000 € im Jahr, Lücke 1.400 €. */
const start = elternunterhalt({ nettoBereinigt: 4800, jahresbrutto: 105000, luecke: 1400 });
/** Dasselbe Netto, aber 99.000 € Jahreseinkommen. */
const darunter = elternunterhalt({ nettoBereinigt: 4800, jahresbrutto: 99000, luecke: 1400 });
/** Vorstand mit 7.200 € netto, 160.000 €, Lücke 2.000 €. */
const vorstand = elternunterhalt({ nettoBereinigt: 7200, jahresbrutto: 160000, luecke: 2000 });
/** Kleine Lücke: 5.800 € netto, 125.000 €, Lücke 500 €. */
const klein = elternunterhalt({ nettoBereinigt: 5800, jahresbrutto: 125000, luecke: 500 });

export default defineGuide({
  id: 'elternunterhalt-rechner',
  group: 'ehe',
  order: 40,
  tool: 'eltern',
  related: ['elternunterhalt', 'selbstbehalt', 'bereinigtes-netto', 'unterhaltsverfahren-kosten', 'unterhaltsrechner'],
  sources: ['sgb12_94', 'olgDtPdf', 'olgLeitlinien', 'bgb1601'],
  de: {
    slug: 'elternunterhalt-rechner',
    nav: 'Elternunterhalt-Rechner',
    card: `Jahreseinkommen, bereinigtes Netto, Lücke der Eltern: Grenzprüfung und Selbstbehalt ${DE.eur(S.eltern)} plus ${DE.pct(FREI)}.`,
    title: 'Elternunterhalt-Rechner 2026: Grenze, Selbstbehalt, Betrag',
    description: `Elternunterhalt-Rechner 2026: prüft die ${DE.num(GRENZE)}-Euro-Grenze, rechnet den Selbstbehalt von ${DE.eur(S.eltern)} plus ${DE.pct(FREI)} des Mehrbetrags und den Unterhalt pro Monat.`,
    h1: 'Elternunterhalt berechnen',
    intro: 'Erst die Grenze, dann der Selbstbehalt, zuletzt die Lücke: in dieser Reihenfolge prüft auch das Sozialamt.',
    resume: `Der Rechner beantwortet zwei Fragen zum Elternunterhalt 2026. Erstens: Darf das Sozialamt überhaupt auf Sie zugreifen? Das hängt nach § 94 Abs. 1a SGB XII allein davon ab, ob Ihr Jahreseinkommen über ${DE.eur(GRENZE)} liegt. Zweitens: Wie viel können Sie leisten? Dazu zieht der Rechner von Ihrem bereinigten Monatsnetto den Selbstbehalt nach Anmerkung D I der Düsseldorfer Tabelle ab: ${DE.eur(S.eltern)} plus ${DE.pct(FREI)} des Betrags, der darüber liegt. Mit den Startwerten, ${DE.eur(4800)} netto, ${DE.eur(105000)} Jahreseinkommen und einer Lücke von ${DE.eur(1400)} bei den Eltern, beträgt der Selbstbehalt ${DE.eur(start.selbstbehalt)}; leistungsfähig sind Sie bis ${DE.eur(start.leistungsfaehig)}, und genau das zeigt der Rechner als Elternunterhalt. Mit demselben Netto, aber ${DE.eur(99000)} im Jahr, wären es ${DE.eur(darunter.unterhalt)}. Mehr als die tatsächliche Lücke der Eltern wird nie verlangt. Das Ergebnis gilt für ein Kind allein, ohne Ehegatten und ohne Geschwister.`,
    faqs: [
      { q: 'Welches Jahreseinkommen trage ich in den Elternunterhalt-Rechner ein?', a: 'Das Gesamteinkommen nach § 16 SGB IV, also die Summe Ihrer Einkünfte nach Einkommensteuerrecht. Für Angestellte ist das grob das Bruttojahresgehalt abzüglich Werbungskosten, für Selbstständige der Gewinn, jeweils zuzüglich Miet- und Kapitaleinkünften. Ihr Einkommensteuerbescheid enthält die nötigen Zahlen. Nicht gemeint ist das Netto; das gehört in das erste Feld.' },
      { q: 'Wie ermittle ich das bereinigte Netto für den Elternunterhalt?', a: `Vom Nettoeinkommen gehen berufsbedingte Kosten, anerkannte Schulden und Unterhalt für vorrangige Berechtigte wie eigene Kinder ab. Beim Elternunterhalt erkennen die Leitlinien zusätzlich eine tatsächlich gezahlte private Altersvorsorge bis ${DE.pct(P.leitlinien.altersvorsorge_sekundaer_eltern)} des Bruttoeinkommens an. Wer im eigenen Haus wohnt, rechnet einen angemessenen Wohnwert hinzu, nicht die volle Marktmiete.` },
      { q: 'Was ist die Lücke der Eltern im Elternunterhalt-Rechner?', a: 'Der Betrag, den die Eltern nach allen eigenen Mitteln und vorrangigen Leistungen nicht decken: Heim- oder Pflegekosten minus Rente, Leistungen der Pflegeversicherung, Grundsicherung und gegebenenfalls Wohngeld. Das Sozialamt nennt ihn in seiner Mitteilung. Der Rechner verlangt nie mehr als diese Lücke, auch wenn Sie mehr leisten könnten.' },
      { q: 'Berücksichtigt der Elternunterhalt-Rechner meinen Ehepartner?', a: `Nein. Er rechnet für ein alleinstehendes Kind. Bei Verheirateten setzt die Tabelle für den mit Ihnen lebenden Ehegatten mindestens ${DE.eur(S.eltern_ehegatte_mindest)} an, und die Rechnung läuft über das Familieneinkommen. Das kann das Ergebnis deutlich verändern, in beide Richtungen. Der Rechner gibt in diesem Fall nur einen ersten Anhaltspunkt.` },
    ],
    body: (h) => `<h2>Die drei Felder</h2>
<ul>
<li><strong>Ihr bereinigtes Netto</strong>: monatlich, nach Steuern, Sozialabgaben, Berufskosten, Schulden und vorrangigem Unterhalt, wie im ${h.a('bereinigtes-netto', 'bereinigten Nettoeinkommen')} beschrieben.</li>
<li><strong>Jahresbruttoeinkommen</strong>: das Gesamteinkommen nach § 16 SGB IV, mit dem der Rechner die Grenze des ${h.src('sgb12_94', '§ 94 Abs. 1a SGB XII')} prüft.</li>
<li><strong>Ungedeckter Bedarf der Eltern</strong>: Heimkosten minus Rente, Pflegegeld und Grundsicherung.</li>
</ul>
<p>Oben erscheint der Elternunterhalt pro Monat und darunter, ob ein Rückgriff des Sozialamts möglich ist. Die Zeilen nennen Ihren Selbstbehalt, den Betrag, bis zu dem Sie leistungsfähig sind, und die Jahreseinkommensgrenze. Der Rechenweg zeigt Grenzprüfung, Selbstbehalt und Vergleich mit der Lücke. Die Eingaben werden in der Adresse gespeichert; den Link können Sie aufbewahren oder an Geschwister schicken, damit jeder seine eigenen Zahlen einträgt.</p>
<h2>Was der Rechner rechnet</h2>
<p>Liegt das Jahreseinkommen nicht über ${h.eur(GRENZE)}, endet die Prüfung: Das Ergebnis ist ${h.eur(0)}, auch wenn rechts ein Betrag für die Leistungsfähigkeit steht. Darüber zieht der Rechner vom Netto den Selbstbehalt nach Anmerkung D I der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} ab, ${h.eur(S.eltern)} plus ${h.pct(FREI, 0)} des Mehrbetrags. Vom Einkommen über ${h.eur(S.eltern)} fließen also höchstens ${h.pct(1 - FREI, 0)} in den Elternunterhalt. Der kleinere Wert aus Leistungsfähigkeit und Lücke ist das Ergebnis.</p>
${h.table(['Fall', 'Jahr', 'Netto', 'Lücke', 'Selbstbehalt', 'Elternunterhalt'], [
  ['Startwerte', h.eur(105000), h.eur(4800), h.eur(1400), h.eur(start.selbstbehalt), h.eur(start.unterhalt)],
  ['unter der Grenze', h.eur(99000), h.eur(4800), h.eur(1400), h.eur(darunter.selbstbehalt), h.eur(darunter.unterhalt)],
  ['Vorstand', h.eur(160000), h.eur(7200), h.eur(2000), h.eur(vorstand.selbstbehalt), h.eur(vorstand.unterhalt)],
  ['kleine Lücke', h.eur(125000), h.eur(5800), h.eur(500), h.eur(klein.selbstbehalt), h.eur(klein.unterhalt)],
], 'Monatswerte, vom Rechner ermittelt', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Die zweite Zeile zeigt die Härte der Grenze: Ein Jahreseinkommen knapp darunter, und das Sozialamt kann nichts verlangen; knapp darüber, und es sind ${h.eur(start.unterhalt)} im Monat. Im Fall des Vorstands reicht die Leistungsfähigkeit von ${h.eur(vorstand.leistungsfaehig)} nicht ganz für die Lücke. In der letzten Zeile begrenzt die Lücke den Betrag, obwohl ${h.eur(klein.leistungsfaehig)} möglich wären.</p>
<h2>Was der Rechner nicht weiß</h2>
<p>Er kennt keinen Ehegatten, keine Geschwister und kein Vermögen. Sind mehrere Kinder über der Grenze, teilen sie sich die Lücke nach ihren Einkommen; jedes rechnet dann für sich, und die Summe darf die Lücke nicht übersteigen. Nach Nummer 19 der ${h.src('olgLeitlinien', 'Leitlinien der Oberlandesgerichte in NRW')} muss der Bedarf der Eltern konkret dargelegt werden, und die Grundsicherung geht vor; ist sie nicht beantragt, ist die eingetragene Lücke womöglich zu hoch. Härtefälle nach § 94 Abs. 3 SGB XII prüft der Rechner nicht.</p>
<p>Die Berechnung ist eine allgemeine Information nach ${h.src('bgb1601', '§ 1601 BGB')}, SGB XII und Düsseldorfer Tabelle 2026, keine Rechtsberatung; verbindlich entscheiden Sozialamt und Familiengericht. Hintergrund zu Grenze, Auskunft und Verfahren steht auf der Seite zum ${h.a('elternunterhalt', 'Elternunterhalt')}.</p>`,
  },
  en: {
    slug: 'parental-maintenance-calculator',
    nav: 'Parental maintenance calculator',
    card: `Annual income, adjusted net pay, the parents’ funding gap: limit check and self-retention of ${EN.eur(S.eltern)} plus ${EN.pct(FREI)}.`,
    title: 'Parental Maintenance Calculator Germany 2026: Limit Check',
    description: `Parental maintenance calculator for Germany 2026: checks the ${EN.eur(GRENZE)} limit, applies the ${EN.eur(S.eltern)} self-retention plus ${EN.pct(FREI)} of the excess, gives a monthly sum.`,
    h1: 'Calculate parental maintenance in Germany',
    intro: 'First the income limit, then the self-retention, finally the parents’ gap: the welfare office checks in the same order.',
    resume: `The calculator answers two questions on parental maintenance (Elternunterhalt) in Germany for 2026. First, can the welfare office (Sozialamt) claim from you at all? Under section 94(1a) of Social Code XII that depends only on whether your annual income exceeds ${EN.eur(GRENZE)}. Second, how much can you pay? The tool deducts from your adjusted monthly net income the self-retention (Selbstbehalt) set by note D I of the Düsseldorf Table: ${EN.eur(S.eltern)} plus ${EN.pct(FREI)} of everything above it. With the default values, ${EN.eur(4800)} net, ${EN.eur(105000)} annual income and a ${EN.eur(1400)} gap in the parents’ finances, the self-retention is ${EN.eur(start.selbstbehalt)}; you can pay up to ${EN.eur(start.leistungsfaehig)}, and that is the result shown. With the same net pay but ${EN.eur(99000)} a year, it would be ${EN.eur(darunter.unterhalt)}. The amount never exceeds the parents’ actual gap. It is calculated for one child alone, without a spouse or siblings.`,
    faqs: [
      { q: 'Which annual income goes into the parental maintenance calculator?', a: 'Total income under section 16 of Social Code IV, the sum of your income as defined by German income tax law. For employees that is roughly gross annual salary less work expenses; for the self-employed, profit; in both cases plus rental and investment income. Your German income tax assessment (Steuerbescheid) contains the figures. Take-home pay belongs in the first field instead.' },
      { q: 'I moved to Germany recently and have no German tax assessment yet. What do I enter?', a: 'Estimate this year’s total income as German tax law would count it: gross salary less work expenses, plus rental or investment income. Use your contract and payslips. The result is then an estimate, and the office will base any claim on documents, starting from the legal presumption that you are below the limit until it has indications otherwise.' },
      { q: 'What is the parents’ gap in the parental maintenance calculator?', a: 'The amount your parent cannot cover after own resources and prior benefits: care-home or nursing costs minus pension, long-term care insurance benefits, basic income support (Grundsicherung) and any housing benefit. The welfare office states it in its letter. The calculator never asks for more than this gap, even if you could pay more.' },
      { q: 'Does the parental maintenance calculator account for my spouse?', a: `No. It calculates for a single child. For a married child the table sets at least ${EN.eur(S.eltern_ehegatte_mindest)} for the spouse living in the household, and the calculation then runs on family income, which can change the result considerably either way. In that case treat the figure as a first indication only.` },
    ],
    body: (h) => `<h2>The three fields</h2>
<ul>
<li><strong>Your adjusted net income</strong>: monthly, after tax, social contributions, work costs, debts and higher-ranking support, as explained under ${h.a('bereinigtes-netto', 'adjusted net income')}. The guidelines also accept actual private pension saving up to ${h.pct(h.P.leitlinien.altersvorsorge_sekundaer_eltern, 0)} of gross income here.</li>
<li><strong>Annual gross income</strong>: total income under section 16 of Social Code IV, used to test the limit in ${h.src('sgb12_94', 'section 94(1a) of Social Code XII')}.</li>
<li><strong>Parents’ unmet need</strong>: care costs minus pension, care insurance and basic income support.</li>
</ul>
<p>The result panel shows parental maintenance per month and whether the office may claim. The rows give your self-retention, the amount you could pay, and the annual income limit. The breakdown walks through the limit test, the self-retention and the comparison with the gap. Inputs are stored in the page address, so siblings can each open the link and enter their own figures.</p>
<h2>What the calculator does</h2>
<p>If annual income does not exceed ${h.eur(GRENZE)}, the check stops and the result is ${h.eur(0)}, even if an ability-to-pay figure appears. Above the limit, the tool deducts the self-retention from note D I of the ${h.src('olgDtPdf', '2026 Düsseldorf Table')}, ${h.eur(S.eltern)} plus ${h.pct(FREI, 0)} of the excess, so at most ${h.pct(1 - FREI, 0)} of income above ${h.eur(S.eltern)} goes to the parent. The lower of ability to pay and the gap is the result.</p>
${h.table(['Case', 'Year', 'Net', 'Gap', 'Self-retention', 'Maintenance'], [
  ['defaults', h.eur(105000), h.eur(4800), h.eur(1400), h.eur(start.selbstbehalt), h.eur(start.unterhalt)],
  ['below the limit', h.eur(99000), h.eur(4800), h.eur(1400), h.eur(darunter.selbstbehalt), h.eur(darunter.unterhalt)],
  ['senior manager', h.eur(160000), h.eur(7200), h.eur(2000), h.eur(vorstand.selbstbehalt), h.eur(vorstand.unterhalt)],
  ['small gap', h.eur(125000), h.eur(5800), h.eur(500), h.eur(klein.selbstbehalt), h.eur(klein.unterhalt)],
], 'Monthly figures computed by the calculator', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The second row shows how sharp the limit is: just below it the office can claim nothing, just above it the bill is ${h.eur(start.unterhalt)} a month. For the senior manager, ability to pay of ${h.eur(vorstand.leistungsfaehig)} does not quite cover the gap. In the last row the gap caps the amount although ${h.eur(klein.leistungsfaehig)} would be possible.</p>
<h2>What it does not know</h2>
<p>It knows nothing about a spouse, siblings or savings. Where several children are above the limit, they share the gap according to income; each runs the calculation separately, and together they never owe more than the gap. Under number 19 of the ${h.src('olgLeitlinien', 'NRW court guidelines')} the parents’ need must be shown in detail and basic income support comes first; if it has not been claimed, the gap you enter may be too high. Hardship cases under section 94(3) of Social Code XII are not assessed.</p>
<p>The result is general information under ${h.src('bgb1601', 'section 1601 BGB')}, Social Code XII and the 2026 Düsseldorf Table, not legal advice; the welfare office and the family court (Familiengericht) decide. Background on the limit, information requests and procedure is on the ${h.a('elternunterhalt', 'parental maintenance')} page.</p>`,
  },
});
