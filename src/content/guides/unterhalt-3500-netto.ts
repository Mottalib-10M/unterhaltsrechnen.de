/** Unterhalt bei 3.500 € netto: Kinder zuerst, dann Trennungsunterhalt für den Ehegatten aus dem Rest. */
import { defineGuide } from '../../lib/guide-types';
import { kindesunterhalt, gruppeVon, gruppeVonBis } from '../../lib/engine/dt';
import { ehegattenunterhalt } from '../../lib/engine/unterhalt';
import { P, DE, EN } from '../../lib/fmt';

const N = 3500;
const B = 900; // eigenes Netto der Ehefrau im Beispiel (Teilzeit)
const g = gruppeVon(N);
const [von, bis] = gruppeVonBis(g);
const kinder = [{ alter: 5 }, { alter: 11 }];
const ku = kindesunterhalt(N, kinder);
const kuDrei = kindesunterhalt(N, kinder, { anzahlAnpassung: true, weitereBerechtigte: 1 });
const eu = ehegattenunterhalt({ pflichtigErwerb: N, berechtigtErwerb: B, kindesunterhalt: ku.summe });
const euOhneArbeit = ehegattenunterhalt({ pflichtigErwerb: N, berechtigtErwerb: 0, kindesunterhalt: ku.summe });
const euDrei = ehegattenunterhalt({ pflichtigErwerb: N, berechtigtErwerb: B, kindesunterhalt: kuDrei.summe });
const gesamt = ku.summe + eu.unterhalt;
const SB = P.selbstbehalt;

export default defineGuide({
  id: 'unterhalt-3500-netto',
  group: 'betrag',
  order: 30,
  mini: 'kuBetrag',
  miniDefaults: { n: 3500 },
  miniHref: 'unterhaltsrechner',
  related: ['trennungsunterhalt', 'unterhaltsrechner', 'ehegattenunterhalt', 'unterhalt-2500-netto', 'unterhalt-5000-netto'],
  sources: ['olgDtPdf', 'bgb1609', 'bgb1361'],
  de: {
    slug: 'unterhalt-bei-3500-euro-netto',
    nav: 'Unterhalt bei 3.500 € netto',
    card: 'Zwei Kinder und eine getrennt lebende Ehefrau: in welcher Reihenfolge gerechnet wird und was bleibt.',
    title: 'Unterhalt bei 3.500 € netto 2026: Kinder und Ehegatte',
    description: `Unterhalt bei 3.500 € netto 2026: Gruppe ${g + 1}, zwei Kinder ${DE.eur(ku.summe)}, danach Trennungsunterhalt aus dem Rest nach der 45-Prozent-Quote und Selbstbehalt ${DE.eur(SB.ehegatte_erwerbstaetig)}.`,
    h1: 'Unterhalt bei 3.500 € netto, wenn Kinder und Ehegatte Anspruch haben',
    intro: 'Bei diesem Einkommen geht es selten nur um die Kinder. Die Reihenfolge der Ansprüche bestimmt, was jeder erhält.',
    resume: `Mit ${DE.eur(N)} bereinigtem Netto liegen Sie in Gruppe ${g + 1} der Düsseldorfer Tabelle 2026 (${DE.eur(von)} bis ${DE.eur(bis)}). Leben zwei Kinder von fünf und elf Jahren bei der getrennt lebenden Ehefrau, zahlen Sie zuerst ihren Unterhalt: ${DE.eur(ku.kinder[0].zahlbetrag, 2)} und ${DE.eur(ku.kinder[1].zahlbetrag, 2)}, zusammen ${DE.eur(ku.summe, 2)}. Minderjährige Kinder haben Vorrang vor dem Ehegatten (§ 1609 BGB). Vom Rest, ${DE.eur(eu.basisPflichtig, 2)}, wird der Trennungsunterhalt berechnet: 45 Prozent der Differenz zu ihrem eigenen Netto von ${DE.eur(B)}, das ergibt ${DE.eur(eu.unterhalt, 2)}. Insgesamt zahlen Sie ${DE.eur(gesamt, 2)} im Monat und behalten ${DE.eur(eu.verbleibtPflichtig, 2)}, mehr als der Selbstbehalt von ${DE.eur(SB.ehegatte_erwerbstaetig)} gegenüber dem Ehegatten. Rechnet das Gericht wegen der drei Berechtigten eine Gruppe tiefer, sinkt der Kindesunterhalt auf ${DE.eur(kuDrei.summe, 2)} und der Trennungsunterhalt steigt auf ${DE.eur(euDrei.unterhalt, 2)}.`,
    faqs: [
      { q: 'Warum wird bei 3.500 € netto der Kindesunterhalt vor dem Ehegattenunterhalt abgezogen?', a: `Weil minderjährige Kinder im ersten Rang stehen, der Ehegatte erst im zweiten (§ 1609 BGB). Der Kindesunterhalt mindert deshalb das Einkommen, aus dem der Ehegattenunterhalt berechnet wird. Im Beispiel sinkt die Basis von ${DE.eur(N)} auf ${DE.eur(eu.basisPflichtig, 2)}; erst davon werden die 45 Prozent der Differenz genommen.` },
      { q: 'Wie viel Trennungsunterhalt bekommt eine Ehefrau ohne eigenes Einkommen bei 3.500 € netto?', a: `Mit zwei Kindern von fünf und elf Jahren ${DE.eur(euOhneArbeit.unterhalt, 2)} im Monat: 45 Prozent von ${DE.eur(euOhneArbeit.basisPflichtig, 2)}. Dem Mann bleiben ${DE.eur(euOhneArbeit.verbleibtPflichtig, 2)}, der Selbstbehalt von ${DE.eur(SB.ehegatte_erwerbstaetig)} ist gewahrt. Im ersten Trennungsjahr muss die Ehefrau meist noch keine Arbeit aufnehmen; danach wird das je nach Alter der Kinder geprüft.` },
      { q: 'Warum 45 und nicht 50 Prozent?', a: `Die fehlenden 10 Prozent der Differenz sind ein Erwerbsanreiz: Wer arbeitet, soll von seinem Lohn mehr behalten als der andere (Anmerkung B der Tabelle). Deshalb werden von Erwerbseinkommen nur 45 Prozent der Differenz ausgeglichen. Renten, Mieteinnahmen und andere Einkünfte ohne Arbeit werden dagegen hälftig geteilt.` },
      { q: 'Ändert sich der Kindesunterhalt, weil auch die Ehefrau Unterhalt bekommt?', a: `Er kann sinken. Die Tabelle ist auf zwei Berechtigte zugeschnitten; mit zwei Kindern und Ehefrau sind es drei. Viele Gerichte stufen dann eine Gruppe herab (Anmerkung A I). Im Beispiel fällt der Kindesunterhalt dadurch auf ${DE.eur(kuDrei.summe, 2)}, während der Trennungsunterhalt auf ${DE.eur(euDrei.unterhalt, 2)} steigt, weil vom Einkommen mehr übrig bleibt.` },
    ],
    body: (h) => `<h2>Die Reihenfolge: erst die Kinder, dann der Ehegatte</h2>
<p>Familiengerichte rechnen in Stufen. Zuerst wird das bereinigte Netto des Zahlenden festgestellt, hier ${h.eur(N)}. Dann der Unterhalt der minderjährigen Kinder nach der Tabelle. Erst danach der Unterhalt des Ehegatten, und zwar aus dem Einkommen, das nach dem Kindesunterhalt übrig ist. Diese Reihenfolge folgt aus dem Rang (§ 1609 BGB) und sorgt dafür, dass die Kinder nicht leer ausgehen, wenn das Geld knapp wird.</p>
${h.table(['Schritt', 'Betrag'], [
  ['Bereinigtes Netto des Mannes', h.eur(N)],
  [`Kind, 5 Jahre (Gruppe ${ku.gruppe + 1})`, `− ${h.eur(ku.kinder[0].zahlbetrag, 2)}`],
  [`Kind, 11 Jahre (Gruppe ${ku.gruppe + 1})`, `− ${h.eur(ku.kinder[1].zahlbetrag, 2)}`],
  ['Basis für den Ehegattenunterhalt', h.eur(eu.basisPflichtig, 2)],
  [`Netto der Ehefrau (Teilzeit)`, h.eur(B)],
  ['45 Prozent der Differenz', h.eur(eu.unterhalt, 2)],
  ['Dem Mann bleiben', h.eur(eu.verbleibtPflichtig, 2)],
], 'Beispielfamilie, vom Rechner ermittelt', ['l', 'r'])}
<h2>Was die Ehefrau insgesamt zur Verfügung hat</h2>
<p>Sie hat ihr eigenes Netto von ${h.eur(B)}, den Trennungsunterhalt von ${h.eur(eu.unterhalt, 2)} und das volle Kindergeld von zweimal ${h.eur(h.P.kindergeld.monat)}, von dem die Hälfte über den geringeren Kindesunterhalt bereits dem Vater zugutekommt. Dazu kommen die Zahlbeträge für die Kinder, die für deren Bedarf bestimmt sind. Der Mann behält ${h.eur(eu.verbleibtPflichtig, 2)} aus seinem Einkommen.</p>
<h2>Die Variante mit Herabstufung</h2>
<p>Weil drei Personen unterhaltsberechtigt sind, kann das Gericht den Kindesunterhalt eine Gruppe tiefer ansetzen. Dann zahlt der Mann für die Kinder ${h.eur(kuDrei.summe, 2)} statt ${h.eur(ku.summe, 2)}, für die Ehefrau aber ${h.eur(euDrei.unterhalt, 2)} statt ${h.eur(eu.unterhalt, 2)}. Insgesamt verschiebt sich wenig: ${h.eur(kuDrei.summe + euDrei.unterhalt, 2)} statt ${h.eur(gesamt, 2)}. Ob herabgestuft wird, entscheidet das Gericht im Einzelfall; der ${h.a('unterhaltsrechner', 'Unterhaltsrechner')} rechnet die Variante mit.</p>
<h2>Wann sich die Rechnung ändert</h2>
<ul>
<li><strong>Nach der Scheidung</strong> wird aus dem Trennungsunterhalt nachehelicher Unterhalt; er setzt einen eigenen Grund voraus, etwa die Betreuung kleiner Kinder (${h.a('ehegattenunterhalt', 'Ehegattenunterhalt')}).</li>
<li><strong>Wenn die Ehefrau mehr arbeitet</strong>, sinkt der Anspruch um 45 Cent je zusätzlich verdientem Euro.</li>
<li><strong>Wenn ein Kind zwölf wird</strong>, steigt sein Zahlbetrag und der Ehegattenunterhalt sinkt entsprechend.</li>
<li><strong>Bei sehr hohem Familieneinkommen</strong> über ${h.eur(h.P.ehegatte.konkreter_bedarf_ab_familieneinkommen)} kann statt der Quote ein konkreter Bedarf verlangt werden.</li>
</ul>
<p>Grundlage sind die ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} mit ihren Anmerkungen A und B und ${h.src('bgb1361', '§ 1361 BGB')}. Die Zahlen sind eine allgemeine Beispielrechnung; ob Wohnvorteil, Schulden oder Altersvorsorge das Einkommen mindern, prüft im Streitfall das Familiengericht.</p>`,
  },
  en: {
    slug: 'child-support-on-3500-net',
    nav: 'Support on €3,500 net',
    card: 'Two children and a separated wife: the order in which German courts calculate, and what is left.',
    title: 'Maintenance on €3,500 Net 2026: Children and Spouse',
    description: `Maintenance on €3,500 net in Germany 2026: group ${g + 1}, ${EN.eur(ku.summe)} for two children first, then separation maintenance from the rest at 45% with a ${EN.eur(SB.ehegatte_erwerbstaetig)} floor.`,
    h1: 'Maintenance on €3,500 net when children and a spouse are owed',
    intro: 'At this income it is rarely just about the children. The ranking of claims decides what everyone receives.',
    resume: `On ${EN.eur(N)} adjusted net income you are in group ${g + 1} of the 2026 Düsseldorf Table (${EN.eur(von)} to ${EN.eur(bis)}). If two children aged five and eleven live with your separated wife, you first pay their support: ${EN.eur(ku.kinder[0].zahlbetrag, 2)} and ${EN.eur(ku.kinder[1].zahlbetrag, 2)}, ${EN.eur(ku.summe, 2)} together. Minor children rank ahead of a spouse (section 1609 of the Civil Code, BGB). Separation maintenance (Trennungsunterhalt) is then calculated from what is left, ${EN.eur(eu.basisPflichtig, 2)}: 45 percent of the difference to her own net pay of ${EN.eur(B)}, which gives ${EN.eur(eu.unterhalt, 2)}. In total you pay ${EN.eur(gesamt, 2)} a month and keep ${EN.eur(eu.verbleibtPflichtig, 2)}, above the ${EN.eur(SB.ehegatte_erwerbstaetig)} self-retention towards a spouse. If the court lowers the children’s group because three people are owed support, child support falls to ${EN.eur(kuDrei.summe, 2)} and the spouse’s share rises to ${EN.eur(euDrei.unterhalt, 2)}.`,
    faqs: [
      { q: 'On €3,500 net, why is child support deducted before spousal support?', a: `Because minor children rank first and a spouse second (section 1609 BGB). Child support therefore reduces the income from which spousal support is calculated. In the example the base falls from ${EN.eur(N)} to ${EN.eur(eu.basisPflichtig, 2)}, and only then is 45 percent of the difference taken.` },
      { q: 'How much separation maintenance does a wife with no income get when he earns €3,500?', a: `With two children aged five and eleven, ${EN.eur(euOhneArbeit.unterhalt, 2)} a month: 45 percent of ${EN.eur(euOhneArbeit.basisPflichtig, 2)}. He keeps ${EN.eur(euOhneArbeit.verbleibtPflichtig, 2)}, so the ${EN.eur(SB.ehegatte_erwerbstaetig)} floor is respected. A spouse who followed a partner to Germany on a dependant visa is usually not expected to find work in the first year of separation; afterwards the court looks at the children’s ages and her real prospects.` },
      { q: 'Why 45 and not 50 percent of the difference?', a: `The missing tenth is a work incentive: whoever earns should keep more of their wages than the other spouse (note B of the table). Only 45 percent of the difference in earned income is therefore balanced. Pensions, rent and other unearned income are split half and half.` },
      { q: 'Does child support change because my wife is also owed maintenance?', a: `It may go down. The table assumes two people to support; two children plus a wife make three. Many courts then move one group lower (note A I). In the example child support drops to ${EN.eur(kuDrei.summe, 2)}, while spousal support rises to ${EN.eur(euDrei.unterhalt, 2)}, because more income is left after the children.` },
    ],
    body: (h) => `<h2>The order: children first, then the spouse</h2>
<p>German family courts calculate in stages. First the payer’s adjusted net income is established, here ${h.eur(N)}. Then the minor children’s support under the table. Only after that comes the spouse, calculated from the income left once child support is paid. The order follows from ranking (section 1609 BGB) and makes sure children are not left empty-handed when money is tight.</p>
${h.table(['Step', 'Amount'], [
  ['Husband’s adjusted net income', h.eur(N)],
  [`Child aged 5 (group ${ku.gruppe + 1})`, `− ${h.eur(ku.kinder[0].zahlbetrag, 2)}`],
  [`Child aged 11 (group ${ku.gruppe + 1})`, `− ${h.eur(ku.kinder[1].zahlbetrag, 2)}`],
  ['Base for spousal maintenance', h.eur(eu.basisPflichtig, 2)],
  ['Wife’s net pay (part time)', h.eur(B)],
  ['45 percent of the difference', h.eur(eu.unterhalt, 2)],
  ['The husband keeps', h.eur(eu.verbleibtPflichtig, 2)],
], 'Example family, computed by the calculator', ['l', 'r'])}
<h2>What the wife has in total</h2>
<p>She has her own ${h.eur(B)}, separation maintenance of ${h.eur(eu.unterhalt, 2)} and the full child benefit (Kindergeld) of twice ${h.eur(h.P.kindergeld.monat)}, half of which already benefits the father through the lower child support. On top come the children’s amounts, which are meant for their needs. The husband keeps ${h.eur(eu.verbleibtPflichtig, 2)} of his income.</p>
<h2>The variant with a lower group</h2>
<p>Because three people are owed support, the court may set child support one group lower. The father then pays ${h.eur(kuDrei.summe, 2)} for the children instead of ${h.eur(ku.summe, 2)}, but ${h.eur(euDrei.unterhalt, 2)} for his wife instead of ${h.eur(eu.unterhalt, 2)}. Overall little changes: ${h.eur(kuDrei.summe + euDrei.unterhalt, 2)} instead of ${h.eur(gesamt, 2)}. Whether the group is lowered is the court’s call; the ${h.a('unterhaltsrechner', 'maintenance calculator')} shows both.</p>
<h2>When the calculation changes</h2>
<ul>
<li><strong>After the divorce</strong> separation maintenance ends and post-divorce maintenance needs its own ground, such as caring for young children (${h.a('ehegattenunterhalt', 'spousal maintenance')}).</li>
<li><strong>If she works more</strong>, her claim falls by 45 cents for each extra euro earned.</li>
<li><strong>When a child turns twelve</strong>, that child’s amount rises and spousal support falls accordingly.</li>
<li><strong>With a very high family income</strong> above ${h.eur(h.P.ehegatte.konkreter_bedarf_ab_familieneinkommen)} a spouse may claim a detailed need instead of the quota.</li>
</ul>
<p>The basis is the ${h.src('olgDtPdf', '2026 Düsseldorf Table')} with its notes A and B and ${h.src('bgb1361', 'section 1361 BGB')}. The figures are a general worked example; whether rent-free housing, debts or pension savings reduce income is for the family court to decide in a dispute.</p>`,
  },
});
