import { defineGuide } from '../../lib/guide-types';
import { ehegattenunterhalt } from '../../lib/engine/unterhalt';
import { kindesunterhalt } from '../../lib/engine/dt';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor: Vater mit 3.900 €, Kinder 5 und 10 Jahre; Partnerin zunächst ohne Einkommen, nach dem Trennungsjahr mit 1.100 € Teilzeit; Zahlender in Rente mit 2.000 €. */
const ku = kindesunterhalt(3900, [{ alter: 5 }, { alter: 10 }]);
const ersteJahr = ehegattenunterhalt({ pflichtigErwerb: 3900, berechtigtErwerb: 0, kindesunterhalt: ku.summe });
const teilzeit = ehegattenunterhalt({ pflichtigErwerb: 3900, berechtigtErwerb: 1100, kindesunterhalt: ku.summe });
const rente = ehegattenunterhalt({ pflichtigErwerb: 2000, berechtigtErwerb: 0, pflichtigErwerbstaetig: false });
const S = P.selbstbehalt;

export default defineGuide({
  id: 'trennungsunterhalt-rechner',
  group: 'ehe',
  order: 20,
  tool: 'ehegatte',
  toolPreset: { modus: 'trennung' },
  related: ['trennungsunterhalt', 'kindesunterhalt-rechner', 'ehegattenunterhalt-rechner', 'selbstbehalt', 'mangelfall', 'unterhaltsverfahren-kosten'],
  sources: ['bgb1361', 'olgDtPdf', 'bgb1609'],
  de: {
    slug: 'trennungsunterhalt-rechner',
    nav: 'Trennungsunterhalt-Rechner',
    card: 'Unterhalt im Trennungsjahr: erst Kindesunterhalt abziehen, dann Quote und Selbstbehalt, Schritt für Schritt.',
    title: 'Trennungsunterhalt-Rechner 2026: mit Kindesunterhalt',
    description: `Trennungsunterhalt-Rechner 2026: Kindesunterhalt vorab abziehen, ${DE.pct(P.ehegatte.quote_erwerb)} der Differenz, Selbstbehalt ${DE.eur(S.ehegatte_erwerbstaetig)}, Unterhalt im Trennungsjahr und danach, mit Rechenweg.`,
    h1: 'Trennungsunterhalt berechnen, wenn Kinder da sind',
    intro: 'In der Trennungszeit leben die Kinder meist bei einem Elternteil. Deshalb fragt der Rechner zuerst nach dem Kindesunterhalt und verteilt dann den Rest.',
    resume: `Ein Vater mit ${DE.eur(3900)} bereinigtem Netto, zwei Kindern von fünf und zehn Jahren und einer Ehefrau ohne eigenes Einkommen zahlt im Trennungsjahr zuerst ${DE.eur(ku.summe)} Kindesunterhalt nach der Düsseldorfer Tabelle 2026. Von den verbleibenden ${DE.eur(ersteJahr.basisPflichtig)} stünden der Mutter rechnerisch ${DE.eur(ersteJahr.quote, 2)} Trennungsunterhalt zu, doch der Vater muss ${DE.eur(S.ehegatte_erwerbstaetig)} behalten: Der Rechner zeigt deshalb ${DE.eur(ersteJahr.unterhalt)}, begrenzt durch den Selbstbehalt. Nimmt die Mutter nach dem ersten Trennungsjahr eine Teilzeitstelle mit ${DE.eur(1100)} netto an, sinkt der Trennungsunterhalt auf ${DE.eur(teilzeit.unterhalt, 2)}, und dem Vater bleiben ${DE.eur(teilzeit.verbleibtPflichtig, 2)}. Grundlage ist § 1361 BGB mit der Quote der Anmerkung B der Tabelle. Den Kindesunterhalt berechnet dieses Werkzeug nicht selbst; er wird als Summe der Zahlbeträge eingetragen. Der Anspruch endet mit der Rechtskraft der Scheidung.`,
    faqs: [
      { q: 'Woher nehme ich den Betrag für das Feld Gezahlter Kindesunterhalt im Trennungsunterhalt-Rechner?', a: `Aus dem Kindesunterhalt-Rechner oder einem bestehenden Titel: Eingetragen wird die Summe der Zahlbeträge, also Tabellenbetrag minus halbes Kindergeld je minderjährigem Kind. Für zwei Kinder von fünf und zehn Jahren bei ${DE.eur(3900)} netto sind das ${DE.eur(ku.summe)}. Der Kindesunterhalt geht vor, weil minderjährige Kinder nach § 1609 BGB im ersten Rang stehen.` },
      { q: 'Muss ich im Trennungsunterhalt-Rechner ein fiktives Einkommen des Partners eintragen?', a: 'Im ersten Trennungsjahr in der Regel nicht: Wer bisher nicht gearbeitet hat, muss nach den Leitlinien der Oberlandesgerichte in NRW in dieser Zeit meist keine Stelle annehmen. Danach kann das Gericht ein erzielbares Einkommen ansetzen, wenn Arbeit zumutbar ist (§ 1361 Absatz 2 BGB). Der Rechner kennt diesen Unterschied nicht; Sie können ihn simulieren, indem Sie ein angenommenes Einkommen eintragen und die Ergebnisse vergleichen.' },
      { q: 'Was zeigt der Trennungsunterhalt-Rechner, wenn das Geld nicht für alle reicht?', a: `Dann erscheint unter dem Ergebnis der Hinweis, dass der Unterhalt durch den Selbstbehalt begrenzt ist. Der Zahlende behält ${DE.eur(S.ehegatte_erwerbstaetig)}, oder ${DE.eur(S.ehegatte_nicht_erwerbstaetig)}, wenn er nicht arbeitet, und der Ehegatte erhält nur den Rest. Reicht das Einkommen nicht einmal für den Kindesunterhalt, liegt ein Mangelfall vor, den der Kindesunterhalt-Rechner behandelt.` },
      { q: 'Gilt das Ergebnis des Trennungsunterhalt-Rechners auch nach der Scheidung weiter?', a: 'Nein. Mit der Rechtskraft der Scheidung endet der Trennungsunterhalt. Danach braucht der Berechtigte einen eigenen Anspruchsgrund für nachehelichen Unterhalt, etwa Kinderbetreuung oder Aufstockung, und muss grundsätzlich selbst für sich sorgen. Die Rechenmethode bleibt zwar ähnlich, aber die Voraussetzungen sind strenger; dafür gibt es den Ehegattenunterhalt-Rechner.' },
    ],
    body: (h) => `<h2>In drei Schritten zum Trennungsunterhalt</h2>
<ol>
<li><strong>Kindesunterhalt ermitteln.</strong> Mit dem ${h.a('kindesunterhalt-rechner', 'Kindesunterhalt-Rechner')} die Zahlbeträge aller Kinder bestimmen und ihre Summe in das Feld Gezahlter Kindesunterhalt übernehmen.</li>
<li><strong>Einkommen eintragen.</strong> Netto des Zahlenden (bereinigt, ohne Kindergeld) und Netto des getrennt lebenden Partners. Mieten, Zinsen oder Renten gehören in den aufklappbaren Bereich Sonstige Einkünfte.</li>
<li><strong>Erwerbstätigkeit angeben.</strong> Arbeitet der Zahlende, gilt die Quote ${h.pct(h.P.ehegatte.quote_erwerb)} und ein Selbstbehalt von ${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)}; ist er etwa in Rente, ${h.pct(h.P.ehegatte.quote_nicht_erwerbstaetig)} und ${h.eur(h.P.selbstbehalt.ehegatte_nicht_erwerbstaetig)}.</li>
</ol>
<p>Rechts erscheinen der Trennungsunterhalt pro Monat, der rechnerische Anspruch, die Grenze der Leistungsfähigkeit und der Betrag, der dem Zahlenden bleibt. Der aufklappbare Rechenweg nennt den Vorrang der Kinder nach ${h.src('bgb1609', '§ 1609 BGB')} ausdrücklich, sobald ein Kindesunterhalt eingetragen ist. Ergebnis und Link lassen sich kopieren, etwa um sie einer Beratungsstelle zu schicken.</p>
<h2>Eine Familie, drei Zeitpunkte</h2>
${h.table(['Situation', 'Zahlender', 'Kindesunterhalt', 'Partnerin', 'Trennungsunterhalt'], [
  ['Trennungsjahr, Mutter ohne Arbeit', h.eur(3900), h.eur(ku.summe), h.eur(0), `${h.eur(ersteJahr.unterhalt)} (Selbstbehalt)`],
  ['nach dem Trennungsjahr, Teilzeit', h.eur(3900), h.eur(ku.summe), h.eur(1100), h.eur(teilzeit.unterhalt, 2)],
  ['Zahlender in Rente, keine Kinder im Haushalt', h.eur(2000), h.eur(0), h.eur(0), `${h.eur(rente.unterhalt)} (Selbstbehalt)`],
], 'Vom Rechner ermittelt, Kindesunterhalt nach der Düsseldorfer Tabelle 2026', ['l', 'r', 'r', 'r', 'r'])}
<p>In der ersten Zeile bremst der Selbstbehalt: Nach Kindesunterhalt und Trennungsunterhalt bleiben dem Vater genau ${h.eur(ersteJahr.verbleibtPflichtig)}. Mit eigenem Einkommen der Mutter fällt der Unterhalt in der zweiten Zeile unter diese Grenze, die Quote greift wieder voll. Fällt das Einkommen so knapp aus, dass schon die Kinder nicht voll bedient werden, hilft die Seite zum ${h.a('mangelfall', 'Mangelfall')} weiter.</p>
<h2>Grenzen des Werkzeugs</h2>
<p>Der Rechner folgt ${h.src('bgb1361', '§ 1361 BGB')} und Anmerkung B der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')}. Er rechnet keinen Wohnvorteil für das Haus an, in dem einer allein bleibt, keinen Altersvorsorgeunterhalt ab Rechtshängigkeit der Scheidung und keinen trennungsbedingten Mehrbedarf. Ob ein fiktives Einkommen anzusetzen ist, entscheidet nicht der Rechner. Hintergründe zu Beginn, Verzicht und Ende stehen auf der Seite zum ${h.a('trennungsunterhalt', 'Trennungsunterhalt')}, die Prozesskosten bei den ${h.a('unterhaltsverfahren-kosten', 'Kosten eines Unterhaltsverfahrens')}.</p>
<p>Die Berechnung ist eine allgemeine Information für die Zeit zwischen Trennung und Scheidung, keine Rechtsberatung; verbindlich entscheidet das Familiengericht.</p>`,
  },
  en: {
    slug: 'separation-maintenance-calculator',
    nav: 'Separation maintenance calculator',
    card: 'Maintenance during the separation year in Germany: child support first, then the quota and self-retention.',
    title: 'Separation Maintenance Calculator Germany 2026: Children',
    description: `Separation maintenance calculator Germany 2026: child support deducted first, ${EN.pct(P.ehegatte.quote_erwerb)} of the income gap, ${EN.eur(S.ehegatte_erwerbstaetig)} self-retention, in and after the separation year.`,
    h1: 'Work out separation maintenance when there are children',
    intro: 'During separation the children usually live with one parent, so the calculator takes child support first and then shares what is left between the spouses.',
    resume: `A father with ${EN.eur(3900)} of adjusted net income, two children aged five and ten, and a wife with no income of her own first pays ${EN.eur(ku.summe)} child support under the 2026 Düsseldorf Table. Of the ${EN.eur(ersteJahr.basisPflichtig)} left, the formula would give the mother ${EN.eur(ersteJahr.quote, 2)} separation maintenance (Trennungsunterhalt), but the father must keep ${EN.eur(S.ehegatte_erwerbstaetig)}, so the calculator shows ${EN.eur(ersteJahr.unterhalt)}, capped by his self-retention (Selbstbehalt). If, after the first year of separation, the mother takes a part-time job paying ${EN.eur(1100)} net, the claim falls to ${EN.eur(teilzeit.unterhalt, 2)} and the father keeps ${EN.eur(teilzeit.verbleibtPflichtig, 2)}. The legal basis is section 1361 of the German Civil Code (BGB) with the quota of note B of the table. The tool does not work out child support itself: you enter the total amounts payable. Separation maintenance stops when the divorce becomes final.`,
    faqs: [
      { q: 'Where do I get the child support figure for the separation maintenance calculator?', a: `From the child support calculator or an existing court order or Jugendamt document: enter the total amounts payable, meaning the table amount minus half the child benefit for each minor child. For two children aged five and ten on ${EN.eur(3900)} net, that is ${EN.eur(ku.summe)}. Children come first because minor children rank above spouses (section 1609 BGB).` },
      { q: 'My spouse could work but chooses not to. How do I reflect that in the calculator?', a: 'In the first year of separation, courts usually do not expect a spouse who stayed at home to start working. After that, section 1361(2) BGB allows a court to count achievable earnings if work is reasonable. The calculator cannot judge this; you can enter an assumed income in the partner’s field and compare both results to see the range.' },
      { q: 'What happens in the calculator when income is too low for everyone?', a: `The result then says it is capped by the self-retention. The payer keeps ${EN.eur(S.ehegatte_erwerbstaetig)} when working, ${EN.eur(S.ehegatte_nicht_erwerbstaetig)} otherwise, and the spouse receives only what is above that. If income does not even cover the children’s amounts, that is a shortfall case (Mangelfall), handled by the child support calculator.` },
    ],
    body: (h) => `<h2>Three steps</h2>
<ol>
<li><strong>Child support first.</strong> Use the ${h.a('kindesunterhalt-rechner', 'child support calculator')} and enter the total in the field “Child support paid”.</li>
<li><strong>Both incomes.</strong> The payer’s adjusted net income without child benefit, and the separated partner’s net income. Rent, interest or pensions go into the expandable “Other income” section.</li>
<li><strong>Is the payer working?</strong> Yes applies ${h.pct(h.P.ehegatte.quote_erwerb)} and a self-retention of ${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)}; No, for example for a retired payer, ${h.pct(h.P.ehegatte.quote_nicht_erwerbstaetig)} and ${h.eur(h.P.selbstbehalt.ehegatte_nicht_erwerbstaetig)}.</li>
</ol>
<p>The panel shows separation maintenance per month, the calculated claim, the limit of what the payer can afford and what the payer keeps. The step-by-step view cites the priority of children under ${h.src('bgb1609', 'section 1609 BGB')} whenever child support is entered. You can copy the result or a link with your inputs, for instance to send to an adviser or a lawyer.</p>
<h2>One family at three moments</h2>
${h.table(['Situation', 'Payer', 'Child support', 'Partner', 'Separation maintenance'], [
  ['separation year, mother not working', h.eur(3900), h.eur(ku.summe), h.eur(0), `${h.eur(ersteJahr.unterhalt)} (capped)`],
  ['after the first year, part-time job', h.eur(3900), h.eur(ku.summe), h.eur(1100), h.eur(teilzeit.unterhalt, 2)],
  ['retired payer, no children at home', h.eur(2000), h.eur(0), h.eur(0), `${h.eur(rente.unterhalt)} (capped)`],
], 'Computed by the calculator, child support under the 2026 Düsseldorf Table', ['l', 'r', 'r', 'r', 'r'])}
<p>In the first row the self-retention decides: after both payments the father keeps exactly ${h.eur(ersteJahr.verbleibtPflichtig)}. Once the mother earns, the claim drops below that limit and the quota applies in full. If income cannot even cover the children, read the ${h.a('mangelfall', 'shortfall case')} page.</p>
<h2>Limits</h2>
<p>The calculator applies ${h.src('bgb1361', 'section 1361 BGB')} and note B of the ${h.src('olgDtPdf', '2026 Düsseldorf Table')}. It does not value the benefit of staying rent-free in the family home, pension contributions once divorce proceedings are pending, or extra costs caused by the separation. For a family where one spouse was posted to Germany and the other followed, it cannot decide whether the trailing spouse is expected to find work. See ${h.a('trennungsunterhalt', 'separation maintenance')} for the rules and ${h.a('unterhaltsverfahren-kosten', 'cost of maintenance proceedings')} for court fees.</p>
<p>This is a general calculation for the period between separation and divorce, not legal advice; the family court (Familiengericht) has the final word.</p>`,
  },
});
