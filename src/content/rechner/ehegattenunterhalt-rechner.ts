import { defineGuide } from '../../lib/guide-types';
import { ehegattenunterhalt } from '../../lib/engine/unterhalt';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor: Startwerte des Rechners, Mieteinnahmen, Rentner, hohes Familieneinkommen. */
const start = ehegattenunterhalt({ pflichtigErwerb: 3600, berechtigtErwerb: 1200 });
const miete = ehegattenunterhalt({ pflichtigErwerb: 3600, berechtigtErwerb: 1200, pflichtigSonstige: 500 });
const rente = ehegattenunterhalt({ pflichtigErwerb: 2300, berechtigtErwerb: 300, pflichtigErwerbstaetig: false });
const hoch = ehegattenunterhalt({ pflichtigErwerb: 9000, berechtigtErwerb: 3000 });
const E = P.ehegatte;
const S = P.selbstbehalt;

export default defineGuide({
  id: 'ehegattenunterhalt-rechner',
  group: 'ehe',
  order: 10,
  tool: 'ehegatte',
  toolPreset: { modus: 'ehegatte' },
  related: ['ehegattenunterhalt', 'trennungsunterhalt-rechner', 'betreuungsunterhalt', 'bereinigtes-netto', 'selbstbehalt', 'kindesunterhalt-rechner'],
  sources: ['olgDtPdf', 'olgLeitlinien', 'bgb1578b'],
  de: {
    slug: 'ehegattenunterhalt-rechner',
    nav: 'Ehegattenunterhalt-Rechner',
    card: 'Nachehelicher Unterhalt nach der Quote: Arbeits- und Nebeneinkünfte, Rentner, Selbstbehalt, Rechenweg.',
    title: 'Ehegattenunterhalt-Rechner 2026: Quote und Selbstbehalt',
    description: `Ehegattenunterhalt-Rechner 2026 nach der Scheidung: ${DE.pct(E.quote_erwerb)} der Einkommensdifferenz, Mieten zur Hälfte, Rentner ${DE.pct(E.quote_nicht_erwerbstaetig)}, Selbstbehalt ${DE.eur(S.ehegatte_erwerbstaetig)}, mit Rechenweg.`,
    h1: 'Ehegattenunterhalt nach der Scheidung berechnen',
    intro: 'Der Rechner wendet Anmerkung B der Düsseldorfer Tabelle 2026 an und prüft danach, ob dem Zahlenden sein Selbstbehalt bleibt.',
    resume: `Mit den Startwerten des Rechners, ${DE.eur(3600)} bereinigtem Netto des Zahlenden und ${DE.eur(1200)} des geschiedenen Ehegatten, ergibt sich ein Ehegattenunterhalt von ${DE.eur(start.unterhalt)} im Monat: ${DE.pct(E.quote_erwerb)} der Differenz von ${DE.eur(3600 - 1200)}. Dem Zahlenden bleiben ${DE.eur(start.verbleibtPflichtig)}, deutlich mehr als sein Selbstbehalt von ${DE.eur(S.ehegatte_erwerbstaetig)}. Hat er zusätzlich ${DE.eur(500)} Mieteinnahmen, steigt der Anspruch auf ${DE.eur(miete.unterhalt)}, weil sonstige Einkünfte nicht mit der Erwerbsquote, sondern hälftig geteilt werden. Ist der Zahlende nicht mehr erwerbstätig, etwa in Rente, rechnet das Werkzeug mit ${DE.pct(E.quote_nicht_erwerbstaetig)} und einem Selbstbehalt von ${DE.eur(S.ehegatte_nicht_erwerbstaetig)}. Gezahlter Kindesunterhalt wird vorab abgezogen. Der Rechner setzt voraus, dass ein Anspruchsgrund nach §§ 1570 bis 1576 BGB besteht; ob er besteht und wie lange der Unterhalt geschuldet ist, prüft er nicht.`,
    faqs: [
      { q: 'Welche Einkünfte gehören in das Feld Sonstige Einkünfte des Ehegattenunterhalt-Rechners?', a: `Alles, was nicht aus Arbeit stammt: Nettomieten nach Abzug der Kosten, Zinsen, Dividenden, Renten und Pensionen neben einem Erwerbseinkommen. Diese Beträge werden nach Anmerkung B der Tabelle hälftig geteilt, ohne den Erwerbsanreiz von ${DE.pct(E.erwerbsanreiz)}. Wer ausschließlich Rente bezieht, trägt sie besser oben als Netto ein und stellt die Frage nach der Erwerbstätigkeit auf Nein; dann gilt die Quote von ${DE.pct(E.quote_nicht_erwerbstaetig)}.` },
      { q: 'Warum zeigt der Ehegattenunterhalt-Rechner einen Hinweis auf konkreten Bedarf?', a: `Er erscheint, sobald beide Einkommen zusammen ${DE.eur(E.konkreter_bedarf_ab_familieneinkommen)} übersteigen. Ab dieser Grenze vermuten die Leitlinien der Oberlandesgerichte in NRW, dass ein Teil des Familieneinkommens gespart und nicht verbraucht wurde. Der Berechtigte kann dann seinen Bedarf konkret nach den tatsächlichen Lebenshaltungskosten der Ehe darlegen, und die Quote ist nur noch eine Obergrenze. Der angezeigte Betrag ist in diesem Fall ein Anhaltspunkt.` },
      { q: 'Berücksichtigt der Rechner eine Befristung des Ehegattenunterhalts?', a: 'Nein. Er berechnet den monatlichen Betrag, nicht die Dauer. Ob der Unterhalt nach § 1578b BGB herabgesetzt oder zeitlich begrenzt wird, hängt von ehebedingten Nachteilen, der Ehedauer und weiteren Umständen ab, die sich nicht in Zahlen fassen lassen. Auch Altersvorsorgeunterhalt, Krankenversicherung und ein fiktives Einkommen, wenn der Berechtigte arbeiten könnte, bleiben außen vor.' },
      { q: 'Was bedeutet die Zeile Bedarf des Berechtigten im Ergebnis?', a: 'Sie zeigt, worauf der geschiedene Ehegatte nach der Quote insgesamt kommt: sein eigenes Einkommen plus den errechneten Unterhalt. Das ist der Lebensstandard, den die Tabelle aus den ehelichen Verhältnissen ableitet. Die Zeile ist grau gesetzt, weil sie nur der Einordnung dient; zu zahlen ist allein der Betrag in der Kopfzeile, der zusätzlich durch den Selbstbehalt begrenzt sein kann.' },
    ],
    body: (h) => `<h2>Die Eingaben</h2>
<ul>
<li><strong>Netto des Zahlenden</strong>: das bereinigte Nettoeinkommen aus Arbeit, ohne Kindergeld. Wie es bereinigt wird, steht beim ${h.a('bereinigtes-netto', 'bereinigten Nettoeinkommen')}.</li>
<li><strong>Netto des Berechtigten</strong>: das bereinigte Erwerbseinkommen des geschiedenen Ehegatten; ohne Arbeit bleibt das Feld bei 0.</li>
<li><strong>Gezahlter Kindesunterhalt</strong>: die Summe der Zahlbeträge aller Kinder, die vorab vom Einkommen des Zahlenden abgeht. Den Betrag liefert der ${h.a('kindesunterhalt-rechner', 'Kindesunterhalt-Rechner')}.</li>
<li><strong>Zahlender erwerbstätig?</strong> Ja bedeutet Quote ${h.pct(h.P.ehegatte.quote_erwerb)} und Selbstbehalt ${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)}, Nein ${h.pct(h.P.ehegatte.quote_nicht_erwerbstaetig)} und ${h.eur(h.P.selbstbehalt.ehegatte_nicht_erwerbstaetig)}.</li>
<li><strong>Sonstige Einkünfte</strong> (aufklappbar): Miete, Zinsen, Rente für beide Seiten, je zur Hälfte geteilt.</li>
</ul>
<p>Das Ergebnis zeigt den Unterhalt pro Monat, den rechnerischen Anspruch, bis zu welchem Betrag der Zahlende leistungsfähig ist, was ihm bleibt, und den Gesamtbedarf des Berechtigten. Der Rechenweg lässt sich aufklappen, das Ergebnis kopieren, als Link teilen oder drucken; die Eingaben stehen in der Adresszeile.</p>
<h2>Vier Rechnungen im Vergleich</h2>
${h.table(['Fall', 'Zahlender', 'Berechtigter', 'Unterhalt', 'Zahlendem bleiben'], [
  ['Startwerte', h.eur(3600), h.eur(1200), h.eur(start.unterhalt), h.eur(start.verbleibtPflichtig)],
  [`dazu ${h.eur(500)} Miete`, h.eur(3600), h.eur(1200), h.eur(miete.unterhalt), h.eur(miete.verbleibtPflichtig)],
  ['Zahlender in Rente', h.eur(2300), h.eur(300), h.eur(rente.unterhalt), h.eur(rente.verbleibtPflichtig)],
  ['hohes Einkommen', h.eur(9000), h.eur(3000), `${h.eur(hoch.unterhalt)} (Quote)`, h.eur(hoch.verbleibtPflichtig)],
], 'Vom Rechner ermittelt, ohne Kindesunterhalt', ['l', 'r', 'r', 'r', 'r'])}
<p>Im Rentnerfall steigt die Quote auf ${h.pct(h.P.ehegatte.quote_nicht_erwerbstaetig)}, weil kein Erwerbsanreiz mehr nötig ist. In der letzten Zeile liegt das Familieneinkommen über ${h.eur(h.P.ehegatte.konkreter_bedarf_ab_familieneinkommen)}; der Rechner weist dann darauf hin, dass ein konkret dargelegter Bedarf niedriger ausfallen kann als die Quote.</p>
<h2>Was der Rechner voraussetzt</h2>
<p>Er rechnet nach Anmerkung B der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} und den ${h.src('olgLeitlinien', 'Leitlinien der Oberlandesgerichte in NRW')}. Er unterstellt, dass ein Anspruchsgrund wie Kinderbetreuung, Alter, Krankheit oder Aufstockung besteht, und prüft weder eine Herabsetzung oder Befristung nach ${h.src('bgb1578b', '§ 1578b BGB')} noch Altersvorsorgeunterhalt, Wohnvorteil oder die Konkurrenz mit einem neuen Ehegatten. Die Voraussetzungen erklärt die Seite zum ${h.a('ehegattenunterhalt', 'Ehegattenunterhalt')}; für die Zeit vor der Scheidung gibt es den ${h.a('trennungsunterhalt-rechner', 'Trennungsunterhalt-Rechner')}.</p>
<p>Das Ergebnis ist eine allgemeine Berechnung zum nachehelichen Unterhalt, keine Rechtsberatung und keine Prüfung Ihres Falls durch das Familiengericht.</p>`,
  },
  en: {
    slug: 'spousal-maintenance-calculator',
    nav: 'Spousal maintenance calculator',
    card: 'Post-divorce maintenance by the German quota: earnings, other income, retired payers, self-retention, steps.',
    title: 'Spousal Maintenance Calculator Germany 2026: After Divorce',
    description: `Spousal maintenance calculator for Germany 2026: ${EN.pct(E.quote_erwerb)} of the income gap, rent and interest halved, ${EN.pct(E.quote_nicht_erwerbstaetig)} for retired payers, ${EN.eur(S.ehegatte_erwerbstaetig)} self-retention, with steps.`,
    h1: 'Calculate spousal maintenance after a German divorce',
    intro: 'The tool applies note B of the 2026 Düsseldorf Table, then checks that the payer keeps the self-retention.',
    resume: `With the calculator’s default figures, ${EN.eur(3600)} adjusted net income for the payer and ${EN.eur(1200)} for the former spouse, post-divorce maintenance comes to ${EN.eur(start.unterhalt)} a month: ${EN.pct(E.quote_erwerb)} of the ${EN.eur(3600 - 1200)} gap. The payer keeps ${EN.eur(start.verbleibtPflichtig)}, well above the ${EN.eur(S.ehegatte_erwerbstaetig)} self-retention (Selbstbehalt). If the payer also receives ${EN.eur(500)} of rental income, the claim rises to ${EN.eur(miete.unterhalt)}, because income that does not come from work is shared half and half rather than by the work-income quota. For a payer who no longer works, for example a pensioner, the tool uses ${EN.pct(E.quote_nicht_erwerbstaetig)} and a self-retention of ${EN.eur(S.ehegatte_nicht_erwerbstaetig)}. Child support already paid is deducted first. The tool assumes that one of the legal grounds for post-divorce maintenance applies; it does not test whether one does, or for how long.`,
    faqs: [
      { q: 'Should I enter gross or net salary in the spousal maintenance calculator?', a: 'Net, and adjusted: salary after German income tax and social contributions, averaged over twelve months including bonuses, minus recognised work-related costs and certain debts. Child benefit (Kindergeld) is left out. If you are paid abroad or in another currency, convert the net amount you actually receive into euros. A family court can count benefits in kind, such as a company car, as income.' },
      { q: 'Why does the spousal maintenance result mention a detailed assessment of need?', a: `The note appears once both incomes together exceed ${EN.eur(E.konkreter_bedarf_ab_familieneinkommen)} a month. Above that level, the NRW court guidelines assume that part of the income was saved during the marriage. The recipient may then have to show actual marital spending, and the quota figure becomes a ceiling rather than the answer.` },
      { q: 'Does the calculator tell me how many years spousal maintenance will last?', a: 'No. It gives a monthly figure only. Duration depends on the legal ground, on career disadvantages caused by the marriage and on its length, which a court weighs under section 1578b BGB. The tool also leaves out pension-contribution maintenance, health insurance costs and notional income for a recipient who could work but does not.' },
    ],
    body: (h) => `<h2>What each field means</h2>
<ul>
<li><strong>Payer’s net income</strong>: adjusted net earnings from work, without child benefit (see ${h.a('bereinigtes-netto', 'adjusted net income')}).</li>
<li><strong>Recipient’s net income</strong>: the former spouse’s adjusted earnings; leave it at 0 if they do not work.</li>
<li><strong>Child support paid</strong>: the total amounts payable for all children, deducted first. The ${h.a('kindesunterhalt-rechner', 'child support calculator')} gives the figure.</li>
<li><strong>Payer working?</strong> Yes means ${h.pct(h.P.ehegatte.quote_erwerb)} and ${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)} self-retention; No means ${h.pct(h.P.ehegatte.quote_nicht_erwerbstaetig)} and ${h.eur(h.P.selbstbehalt.ehegatte_nicht_erwerbstaetig)}.</li>
<li><strong>Other income</strong> (expandable): rent, interest or pensions of either side, split half and half.</li>
</ul>
<p>The result panel shows the monthly maintenance, the calculated claim, how much the payer can afford, what the payer keeps and the recipient’s total need. You can open the step-by-step calculation, copy the result, share a link that stores your inputs, or print.</p>
<h2>Four calculations side by side</h2>
${h.table(['Case', 'Payer', 'Recipient', 'Maintenance', 'Payer keeps'], [
  ['default figures', h.eur(3600), h.eur(1200), h.eur(start.unterhalt), h.eur(start.verbleibtPflichtig)],
  [`plus ${h.eur(500)} rent`, h.eur(3600), h.eur(1200), h.eur(miete.unterhalt), h.eur(miete.verbleibtPflichtig)],
  ['retired payer', h.eur(2300), h.eur(300), h.eur(rente.unterhalt), h.eur(rente.verbleibtPflichtig)],
  ['high earners', h.eur(9000), h.eur(3000), `${h.eur(hoch.unterhalt)} (quota)`, h.eur(hoch.verbleibtPflichtig)],
], 'Computed by the calculator, no child support', ['l', 'r', 'r', 'r', 'r'])}
<p>For the retired payer the rate rises to ${h.pct(h.P.ehegatte.quote_nicht_erwerbstaetig)}, since there is no work incentive to protect. In the last row joint income exceeds ${h.eur(h.P.ehegatte.konkreter_bedarf_ab_familieneinkommen)}, and a detailed assessment could produce a lower figure.</p>
<h2>Built-in assumptions</h2>
<p>The tool follows note B of the ${h.src('olgDtPdf', '2026 Düsseldorf Table')} and the ${h.src('olgLeitlinien', 'NRW court guidelines')}. It assumes a legal ground exists (childcare, age, illness, unemployment or an income gap) and ignores reductions or end dates under ${h.src('bgb1578b', 'section 1578b BGB')}, pension contributions, the value of living rent-free and claims of a new spouse. If you married abroad, whether German law governs maintenance is a separate question the tool cannot answer. Background on ${h.a('ehegattenunterhalt', 'spousal maintenance')} is on its own page; before the divorce is final, use the ${h.a('trennungsunterhalt-rechner', 'separation maintenance calculator')}.</p>
<p>The result is a general calculation of post-divorce maintenance, not legal advice and not a review of your case by a family court.</p>`,
  },
});
