import { defineGuide } from '../../lib/guide-types';
import { kindesunterhalt } from '../../lib/engine/dt';
import { ehegattenunterhalt } from '../../lib/engine/unterhalt';
import { r2 } from '../../lib/engine/params';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele wie im GesamtRechner: zuerst Kindesunterhalt, dann Ehegattenunterhalt aus dem Rest. */
const std = kindesunterhalt(3900, [{ alter: 4 }, { alter: 9 }]);
const stdEhe = ehegattenunterhalt({ pflichtigErwerb: 3900, berechtigtErwerb: 900, kindesunterhalt: std.summe });
const stdGesamt = r2(std.summe + stdEhe.unterhalt);
const eng = kindesunterhalt(2600, [{ alter: 13 }]);
const engEhe = ehegattenunterhalt({ pflichtigErwerb: 2600, berechtigtErwerb: 0, kindesunterhalt: eng.summe });
const S = P.selbstbehalt;

export default defineGuide({
  id: 'unterhaltsrechner',
  group: 'kind',
  order: 5,
  tool: 'gesamt',
  related: ['kindesunterhalt-rechner', 'ehegattenunterhalt-rechner', 'trennungsunterhalt-rechner', 'volljaehrigenunterhalt-rechner', 'bereinigtes-netto', 'kindesunterhalt'],
  sources: ['olgDtPdf', 'bgb1609', 'bgb1361', 'olgLeitlinien'],
  de: {
    slug: 'unterhaltsrechner',
    nav: 'Unterhaltsrechner',
    card: 'Kinder und Ehegatte in einer Rechnung: erst Kindesunterhalt, dann Ehegattenunterhalt aus dem Rest.',
    title: 'Unterhaltsrechner 2026: Unterhalt berechnen für Kind und Ehe',
    description: `Unterhaltsrechner 2026: Unterhalt berechnen für bis zu vier Kinder und den Ehegatten nach Düsseldorfer Tabelle, mit ${DE.pct(P.ehegatte.quote_erwerb)}-Quote und Selbstbehalt ${DE.eur(S.ehegatte_erwerbstaetig)}.`,
    h1: 'Unterhaltsrechner: Kinder und Ehegatte zusammen berechnen',
    intro: 'Ein Netto, bis zu vier Kinder, auf Wunsch der Ehegatte: Der Rechner zeigt, wie viel insgesamt zu zahlen ist und was übrig bleibt.',
    resume: `Der Unterhaltsrechner 2026 berechnet in einem Durchgang Kindesunterhalt und Ehegattenunterhalt, in der Reihenfolge, die § 1609 BGB vorgibt. Zuerst die Kinder: Aus dem bereinigten Netto des Zahlenden ermittelt er die Gruppe der Düsseldorfer Tabelle, zieht je Kind das halbe Kindergeld ab und prüft Bedarfskontrollbetrag und Mangelfall. Danach der Ehegatte: Vom Einkommen nach Kindesunterhalt nimmt er ${DE.pct(P.ehegatte.quote_erwerb)} der Differenz zum Einkommen des anderen, begrenzt durch den Selbstbehalt von ${DE.eur(S.ehegatte_erwerbstaetig)}. Mit den Startwerten, ${DE.eur(3900)} Netto, zwei Kindern von vier und neun Jahren und einem Ehegatten mit ${DE.eur(900)}, ergeben sich ${DE.eur(std.summe, 2)} für die Kinder und ${DE.eur(stdEhe.unterhalt, 2)} für den Ehegatten, zusammen ${DE.eur(stdGesamt, 2)}. Dem Zahlenden bleiben ${DE.eur(3900 - stdGesamt, 2)}. Jeder Schritt erscheint im Rechenweg unter dem Ergebnis, sodass Sie nachvollziehen können, welche Regel welchen Betrag bestimmt.`,
    faqs: [
      { q: 'Rechnet der Unterhaltsrechner Trennungsunterhalt oder nachehelichen Unterhalt?', a: `Er wendet die Quote an, die für beide gilt: ${DE.pct(P.ehegatte.quote_erwerb)} der Differenz der Erwerbseinkommen nach Abzug des Kindesunterhalts. Ob der Anspruch dem Grunde nach besteht, prüft er nicht. Nach der Scheidung muss der Berechtigte einen besonderen Grund nachweisen, etwa Kinderbetreuung, und der Unterhalt kann befristet werden; dafür gibt es den Rechner für Ehegattenunterhalt.` },
      { q: 'Warum bekommt der Ehegatte im Unterhaltsrechner manchmal weniger als die Quote?', a: `Weil dem Zahlenden gegenüber dem Ehegatten ein Selbstbehalt von ${DE.eur(S.ehegatte_erwerbstaetig)} bleiben muss. Bei ${DE.eur(2600)} Netto und einem dreizehnjährigen Kind ergibt die Quote ${DE.eur(engEhe.quote, 2)}, zahlbar sind aber nur ${DE.eur(engEhe.unterhalt, 2)}. Der Kindesunterhalt geht vor und wird nicht gekürzt.` },
      { q: 'Kann ich im Unterhaltsrechner auch volljährige Kinder eintragen?', a: `Nein, die Altersfelder reichen bis 17 Jahre. Für volljährige Kinder haften beide Eltern anteilig, das volle Kindergeld wird angerechnet und der Selbstbehalt ist höher. Diese Rechnung übernimmt der Volljährigenunterhalt-Rechner. Wer zusätzlich minderjährige Kinder hat, trägt hier nur diese ein und zieht den Anteil für das volljährige Kind vorher vom Netto ab.` },
    ],
    body: (h) => `<h2>Die Eingaben</h2>
<ul>
<li><strong>Netto des Zahlenden:</strong> das bereinigte Nettoeinkommen im Monat, also nach Steuern, Sozialabgaben und anerkannten Abzügen wie Fahrtkosten oder Schuldenraten. Wie man es ermittelt, steht unter ${h.a('bereinigtes-netto', 'bereinigtes Nettoeinkommen')}.</li>
<li><strong>Auch Ehegatte/Partner?</strong> Bei „Ja“ wird nach dem Kindesunterhalt Ehegattenunterhalt gerechnet, bei „Nein“ nur Kindesunterhalt.</li>
<li><strong>Netto des Ehegatten:</strong> das bereinigte Erwerbseinkommen des Berechtigten; ${h.eur(0)}, wenn er nicht arbeitet.</li>
<li><strong>Minderjährige Kinder:</strong> null bis vier Kinder, danach für jedes Kind ein Alter zwischen 0 und 17 Jahren.</li>
</ul>
<p>Die Eingaben werden in der Adresszeile gespeichert. Sie können das Ergebnis also als Link weitergeben oder später wieder öffnen.</p>
<h2>Was der Rechner ausgibt</h2>
<p>Oben steht der Unterhalt insgesamt pro Monat und darunter, was dem Zahlenden bleibt. Es folgen die Zahlbeträge je Kind mit Alter, der Betrag für den Ehegatten und die Summe. Der Rechenweg nennt die Gruppe der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')}, einen Mangelfall, falls er vorliegt, die Basis für den Ehegattenunterhalt, die Quote und den Selbstbehalt.</p>
<h2>Zwei Beispiele</h2>
${h.table(['Situation', 'Kinder', 'Ehegatte', 'Gesamt', 'bleibt'], [
  [`${h.eur(3900)} Netto, Kinder 4 und 9, Ehegatte ${h.eur(900)}`, h.eur(std.summe, 2), h.eur(stdEhe.unterhalt, 2), h.eur(stdGesamt, 2), h.eur(3900 - stdGesamt, 2)],
  [`${h.eur(2600)} Netto, Kind 13, Ehegatte ohne Einkommen`, h.eur(eng.summe, 2), h.eur(engEhe.unterhalt, 2), h.eur(r2(eng.summe + engEhe.unterhalt), 2), h.eur(r2(2600 - eng.summe - engEhe.unterhalt), 2)],
], 'Vom Rechner ermittelt, Zahlender erwerbstätig', ['l', 'r', 'r', 'r', 'r'])}
<p>Im ersten Fall bleibt nach den Kindern (Gruppe ${std.gruppe + 1}) eine Basis von ${h.eur(stdEhe.basisPflichtig, 2)}. ${h.pct(h.P.ehegatte.quote_erwerb, 0)} der Differenz zu ${h.eur(900)} sind ${h.eur(stdEhe.quote, 2)}; der Selbstbehalt wird nicht berührt. Im zweiten Fall wäre die Quote ${h.eur(engEhe.quote, 2)}, doch über ${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)} hinaus stehen nur ${h.eur(engEhe.leistungsfaehig, 2)} zur Verfügung. Der Ehegatte steht nach ${h.src('bgb1609', '§ 1609 BGB')} hinter den minderjährigen Kindern und trägt den Ausfall allein.</p>
<h2>Warum die Reihenfolge zählt</h2>
<p>Wer Kinder- und Ehegattenunterhalt getrennt ausrechnet und addiert, kommt fast immer zu hoch. Der Ehegattenunterhalt wird nicht vom vollen Netto berechnet, sondern von dem, was nach dem Zahlbetrag für die Kinder bleibt. Jeder Euro mehr Kindesunterhalt senkt also den Ehegattenunterhalt um ${h.pct(h.P.ehegatte.quote_erwerb, 0)} davon. Umgekehrt greift der Selbstbehalt gegenüber dem Ehegatten von ${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)} erst nach den Kindern, denen gegenüber nur ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)} geschützt sind.</p>
<h2>Grenzen</h2>
<p>Der Rechner unterstellt, dass der Zahlende erwerbstätig ist, und prüft den Bedarfskontrollbetrag automatisch. Er kennt keine volljährigen Kinder, keinen Mehrbedarf, kein Wechselmodell und keine sonstigen Einkünfte wie Mieten. Ob Trennungsunterhalt nach ${h.src('bgb1361', '§ 1361 BGB')} oder ein nachehelicher Anspruch dem Grunde nach besteht, prüft er nicht; für nicht verheiratete Eltern gilt § 1615l BGB mit anderem Maßstab. Genauere Rechnungen bieten der ${h.a('kindesunterhalt-rechner', 'Kindesunterhalt-Rechner')} mit Optionen und der ${h.a('trennungsunterhalt-rechner', 'Trennungsunterhalt-Rechner')}. Grundlage sind die Tabelle 2026 und die ${h.src('olgLeitlinien', 'Leitlinien NRW')}.</p>
<p>Das Ergebnis des Unterhaltsrechners ist eine allgemeine Berechnung und keine Rechtsberatung; den Unterhalt im Einzelfall legen Jugendamt, Anwaltschaft oder Familiengericht fest.</p>`,
  },
  en: {
    slug: 'maintenance-calculator',
    nav: 'Maintenance calculator',
    card: 'Children and spouse in one calculation: child support first, then spousal maintenance from what is left.',
    title: 'Maintenance Calculator Germany 2026: Children and Spouse',
    description: `Maintenance calculator for Germany 2026: support for up to four children and a spouse under the Düsseldorf Table, with the ${EN.pct(P.ehegatte.quote_erwerb)} rate and ${EN.eur(S.ehegatte_erwerbstaetig)} self-retention.`,
    h1: 'German maintenance calculator for children and spouse',
    intro: 'One net income, up to four children, a spouse if you wish: the tool shows the total payable and what the payer keeps.',
    resume: `This 2026 maintenance calculator works out child support and spousal maintenance in one pass, in the order German law sets in section 1609 of the Civil Code (BGB). Children first: from the payer’s adjusted net income it finds the Düsseldorf Table group, deducts half the child benefit for each child and checks the needs-control amount and any shortfall. Then the spouse: from the income left after child support it takes ${EN.pct(P.ehegatte.quote_erwerb)} of the difference to the other spouse’s earnings, capped by the ${EN.eur(S.ehegatte_erwerbstaetig)} self-retention (Selbstbehalt) towards a spouse. With the default values, ${EN.eur(3900)} net income, two children aged four and nine and a spouse earning ${EN.eur(900)}, the result is ${EN.eur(std.summe, 2)} for the children and ${EN.eur(stdEhe.unterhalt, 2)} for the spouse, ${EN.eur(stdGesamt, 2)} in total. The payer keeps ${EN.eur(3900 - stdGesamt, 2)}. Every step appears in the calculation path below the result.`,
    faqs: [
      { q: 'Does this calculator give separation maintenance or post-divorce maintenance?', a: `It applies the rate common to both: ${EN.pct(P.ehegatte.quote_erwerb)} of the difference in earned income after child support. It does not test whether a claim exists at all. After divorce the spouse must show a specific ground, such as caring for children, and the payments can be time-limited; the spousal maintenance calculator covers that.` },
      { q: `Why does the spouse sometimes get less than the ${EN.pct(P.ehegatte.quote_erwerb)} rate?`, a: `Because the payer must keep ${EN.eur(S.ehegatte_erwerbstaetig)} towards a spouse. On ${EN.eur(2600)} net with one child aged thirteen, the rate gives ${EN.eur(engEhe.quote, 2)}, but only ${EN.eur(engEhe.unterhalt, 2)} is payable, since everything above the protected amount is already used up. Child support comes first and is not reduced; the spouse alone bears the gap.` },
      { q: 'We married abroad and now live in Germany: can I use this maintenance calculator?', a: `It calculates under German rules and the Düsseldorf Table, which German family courts generally apply when the family lives here. A foreign marriage does not change the arithmetic. Whether German law actually governs your spousal claim, for example because of a marriage contract or another country’s rules, is a separate legal question the tool cannot answer.` },
    ],
    body: (h) => `<h2>The inputs</h2>
<ul>
<li><strong>Payer’s net income:</strong> adjusted net income per month, after tax, social contributions and accepted deductions such as commuting or debt repayments. See ${h.a('bereinigtes-netto', 'adjusted net income')}.</li>
<li><strong>Spouse too?</strong> “Yes” adds spousal maintenance after child support; “No” calculates child support only.</li>
<li><strong>Spouse’s net income:</strong> the entitled spouse’s adjusted earned income, ${h.eur(0)} if not working.</li>
<li><strong>Minor children:</strong> zero to four, then an age between 0 and 17 for each child.</li>
</ul>
<p>Your entries are stored in the address bar, so a result can be shared as a link or reopened later.</p>
<h2>What the result shows</h2>
<p>At the top: total maintenance per month and what the payer keeps. Below: each child’s amount with age, the spouse’s amount and the total. The calculation path names the ${h.src('olgDtPdf', '2026 Düsseldorf Table')} group, any shortfall, the base for spousal maintenance, the rate and the self-retention.</p>
<h2>Two examples</h2>
${h.table(['Situation', 'Children', 'Spouse', 'Total', 'Payer keeps'], [
  [`${h.eur(3900)} net, children 4 and 9, spouse earns ${h.eur(900)}`, h.eur(std.summe, 2), h.eur(stdEhe.unterhalt, 2), h.eur(stdGesamt, 2), h.eur(3900 - stdGesamt, 2)],
  [`${h.eur(2600)} net, child 13, spouse without income`, h.eur(eng.summe, 2), h.eur(engEhe.unterhalt, 2), h.eur(r2(eng.summe + engEhe.unterhalt), 2), h.eur(r2(2600 - eng.summe - engEhe.unterhalt), 2)],
], 'Computed by the calculator, payer in work', ['l', 'r', 'r', 'r', 'r'])}
<p>In the first case, after the children (group ${std.gruppe + 1}) a base of ${h.eur(stdEhe.basisPflichtig, 2)} remains; ${h.pct(h.P.ehegatte.quote_erwerb, 0)} of the difference to ${h.eur(900)} is ${h.eur(stdEhe.quote, 2)}, well within the self-retention. In the second, the rate would give ${h.eur(engEhe.quote, 2)}, yet only ${h.eur(engEhe.leistungsfaehig, 2)} lies above ${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)}. Under ${h.src('bgb1609', 'section 1609 BGB')} the spouse ranks behind minor children and bears the gap alone.</p>
<h2>Why the order matters</h2>
<p>Calculating child and spousal support separately and adding them up almost always overstates the total. Spousal maintenance is not based on full net income but on what remains after the children’s amounts. Each extra euro of child support therefore lowers the spouse’s claim by ${h.pct(h.P.ehegatte.quote_erwerb, 0)} of that euro. The ${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)} self-retention towards a spouse also applies only after the children, towards whom just ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)} is protected.</p>
<h2>Limits</h2>
<p>The tool assumes the payer works and applies the needs-control check automatically. It does not handle adult children, extra need, equal shared care or other income such as rent. It does not test whether separation maintenance under ${h.src('bgb1361', 'section 1361 BGB')} or a post-divorce claim exists; unmarried parents fall under section 1615l BGB, which uses a different measure. For more options use the ${h.a('kindesunterhalt-rechner', 'child support calculator')} or the ${h.a('trennungsunterhalt-rechner', 'separation maintenance calculator')}. The basis is the 2026 table and the ${h.src('olgLeitlinien', 'NRW guidelines')}.</p>
<p>The maintenance calculator gives a general calculation, not legal advice; the amount in an individual case is set by the Jugendamt, by agreement with lawyers or by the family court.</p>`,
  },
});
