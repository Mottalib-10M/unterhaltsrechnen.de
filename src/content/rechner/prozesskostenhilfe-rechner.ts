import { defineGuide } from '../../lib/guide-types';
import { pkh } from '../../lib/engine/kosten';
import { P, DE, EN } from '../../lib/fmt';

const K = P.pkh;
/** Beispiele aus dem Motor: Startwerte des Rechners und drei Varianten. */
const start = pkh({ netto: 2100, erwerbstaetig: true, wohnkosten: 750 });
const mitEhegatte = pkh({ netto: 2100, erwerbstaetig: true, wohnkosten: 750, ehegatte: true, einkommenEhegatte: 300 });
const zweiKinder = pkh({ netto: 1750, erwerbstaetig: true, wohnkosten: 650, kinder: [3, 10] });
const ohneArbeit = pkh({ netto: 1300, erwerbstaetig: false, wohnkosten: 550 });
const mitKredit = pkh({ netto: 2100, erwerbstaetig: true, wohnkosten: 750, sonstigeBelastungen: 150 });

export default defineGuide({
  id: 'prozesskostenhilfe-rechner',
  group: 'scheidung',
  order: 50,
  tool: 'pkh',
  related: ['verfahrenskostenhilfe', 'scheidungskosten-rechner', 'scheidungskosten', 'anwaltskosten-scheidung'],
  sources: ['zpo115', 'pkhb2026'],
  de: {
    slug: 'prozesskostenhilfe-rechner',
    nav: 'Prozesskostenhilfe-Rechner',
    card: 'Monatsrate oder ratenfrei: Freibeträge 2026, Miete, Kinder und Ehegatte, mit Rechenweg nach § 115 ZPO.',
    title: 'Prozesskostenhilfe-Rechner 2026: Rate oder ratenfrei?',
    description: `Prozesskostenhilfe-Rechner 2026 für Familiensachen: Freibeträge der PKHB 2026, Miete, Kinder, Ehegatte, Monatsrate nach § 115 ZPO, höchstens ${DE.num(K.max_raten)} Raten.`,
    h1: 'Prozesskostenhilfe berechnen',
    intro: 'Der Rechner zieht die Freibeträge 2026 von Ihrem Einkommen ab und zeigt, ob Verfahrenskostenhilfe ohne Raten oder mit welcher Monatsrate in Betracht kommt.',
    resume: `Mit den Startwerten des Rechners, ${DE.eur(2100)} netto, erwerbstätig, ${DE.eur(750)} Warmmiete und ohne Unterhaltsberechtigte, ergibt sich 2026 eine Monatsrate von ${DE.eur(start.rate)}. Der Rechner zieht dafür ${DE.eur(K.partei)} Freibetrag für Sie, ${DE.eur(K.erwerbstaetige)} Erwerbstätigenfreibetrag und die Wohnkosten ab; es bleiben ${DE.eur(start.einzusetzen)} einzusetzendes Einkommen, davon die Hälfte, abgerundet auf volle Euro. Höchstens ${DE.num(K.max_raten)} solcher Raten sind zu zahlen, zusammen also nie mehr als ${DE.eur(start.summeMax)} und nie mehr als die tatsächlichen Kosten. Lebt ein Ehegatte mit ${DE.eur(300)} eigenem Einkommen im Haushalt, wird ein um dieses Einkommen gekürzter Ehegattenfreibetrag von ${DE.eur(K.ehegatte)} abgezogen, und die Prozesskostenhilfe ${mitEhegatte.ratenfrei ? 'wird ratenfrei' : `kostet nur noch ${DE.eur(mitEhegatte.rate)} im Monat`}. Bei einem einzusetzenden Einkommen über ${DE.eur(K.rate_schwelle)} steigt die Rate steil an: ${DE.eur(K.rate_sockel)} plus jeder weitere Euro. Grundlage sind § 115 ZPO und die Prozesskostenhilfebekanntmachung 2026.`,
    faqs: [
      { q: 'Welches Einkommen gebe ich im Prozesskostenhilfe-Rechner an?', a: 'Ihr monatliches Nettoeinkommen nach Steuern und Sozialabgaben, einschließlich des Kindergeldes, das Ihnen ausgezahlt wird, und anderer Einkünfte wie Unterhalt, den Sie erhalten, oder Mieteinnahmen. Weihnachts- und Urlaubsgeld verteilen Sie auf zwölf Monate. Arbeitslosengeld zählt ebenfalls. Werbungskosten wie Fahrtkosten können Sie im Feld „Besondere Belastungen“ berücksichtigen, wenn sie nicht schon im Netto stecken.' },
      { q: `Warum steigt die Rate im Prozesskostenhilfe-Rechner ab ${DE.eur(K.rate_schwelle)} so stark?`, a: `Das schreibt § 115 Abs. 2 ZPO so vor. Bis ${DE.eur(K.rate_schwelle)} einzusetzendem Einkommen beträgt die Rate die Hälfte, also höchstens ${DE.eur(K.rate_sockel)}. Jeder Euro darüber wird voll zur Rate geschlagen. Wer ${DE.eur(K.rate_schwelle + 100)} einzusetzen hat, zahlt deshalb ${DE.eur(K.rate_sockel + 100)} im Monat. Hohe einzusetzende Einkommen führen damit schnell dazu, dass sich der Antrag kaum lohnt.` },
      { q: 'Berücksichtigt der Prozesskostenhilfe-Rechner mein Vermögen?', a: 'Nein. Er rechnet nur mit dem Einkommen. Ersparnisse, Wertpapiere oder eine vermietete Wohnung muss das Gericht zusätzlich prüfen: Vermögen ist einzusetzen, soweit es zumutbar ist und nicht zum Schonvermögen nach dem Sozialhilferecht gehört. Haben Sie nennenswertes Vermögen, kann die Hilfe trotz einer niedrigen Rate im Rechner versagt oder eine Zahlung aus dem Vermögen angeordnet werden.' },
      { q: 'Welches Alter trage ich für meine Kinder im Prozesskostenhilfe-Rechner ein?', a: `Das aktuelle Alter in Jahren. Der Freibetrag hängt davon ab: ${DE.eur(K.kinder_bis_6)} bis 5 Jahre, ${DE.eur(K.kinder_7_14)} von 6 bis 13, ${DE.eur(K.jugendliche_15_17)} von 14 bis 17 und ${DE.eur(K.erwachsene)} ab 18. Unter jedem Altersfeld zeigt der Rechner den Betrag sofort an. Erhält ein Kind Unterhalt vom anderen Elternteil, kürzt das Gericht den Freibetrag; das bildet der Rechner nicht ab.` },
    ],
    body: (h) => `<h2>Die Felder des Rechners</h2>
<ul>
<li><strong>Nettoeinkommen:</strong> alles, was Ihnen monatlich zufließt, mit dem Kindergeld, das Sie erhalten.</li>
<li><strong>Erwerbstätig?:</strong> Bei Ja zieht der Rechner zusätzlich ${h.eur(h.P.pkh.erwerbstaetige)} ab.</li>
<li><strong>Miete und Heizung:</strong> die Warmmiete oder, bei Eigentum, Zins, Nebenkosten und Heizung.</li>
<li><strong>Besondere Belastungen:</strong> zum Beispiel Kreditraten oder Unterhalt, den Sie selbst zahlen. Ob das Gericht sie als angemessen anerkennt, entscheidet es im Einzelfall.</li>
<li><strong>Ehegatte ohne volles Einkommen?:</strong> Bei Ja erscheint das Feld für sein Einkommen. Abgezogen wird der Freibetrag von ${h.eur(h.P.pkh.ehegatte)} minus dieses Einkommen.</li>
<li><strong>Unterhaltsberechtigte Kinder:</strong> keins bis sechs; für jedes Kind erscheint ein Altersfeld, unter dem der Freibetrag steht.</li>
</ul>
<p>Rechts zeigt der Rechner die Monatsrate oder „ratenfrei“, darunter jeden Abzug einzeln, das einzusetzende Einkommen und die Höchstsumme aus ${h.num(h.P.pkh.max_raten)} Raten. Der Rechenweg nennt die Ratenformel aus ${h.src('zpo115', '§ 115 Abs. 2 ZPO')}.</p>
<h2>Vier Haushalte im Vergleich</h2>
${h.table(['Haushalt', 'Einzusetzen', 'Monatsrate', 'höchstens gesamt'], [
  ['Startwerte: 2.100 €, Miete 750 €', h.eur(start.einzusetzen), start.ratenfrei ? 'ratenfrei' : h.eur(start.rate), h.eur(start.summeMax)],
  ['dazu 150 € Kreditrate', h.eur(mitKredit.einzusetzen), mitKredit.ratenfrei ? 'ratenfrei' : h.eur(mitKredit.rate), h.eur(mitKredit.summeMax)],
  ['1.750 €, Kinder 3 und 10, Miete 650 €', h.eur(zweiKinder.einzusetzen), zweiKinder.ratenfrei ? 'ratenfrei' : h.eur(zweiKinder.rate), h.eur(zweiKinder.summeMax)],
  ['1.300 € ohne Arbeit, Miete 550 €', h.eur(ohneArbeit.einzusetzen), ohneArbeit.ratenfrei ? 'ratenfrei' : h.eur(ohneArbeit.rate), h.eur(ohneArbeit.summeMax)],
], 'Vom Rechner ermittelt mit den Freibeträgen der Prozesskostenhilfebekanntmachung 2026', ['l', 'r', 'r', 'r'])}
<p>Die zweite Zeile zeigt, wie stark eine anerkannte Belastung wirkt: ${h.eur(150)} Kreditrate senken die Monatsrate um ${h.eur(start.rate - mitKredit.rate)}, weil jeder abgezogene Euro unterhalb der Schwelle von ${h.eur(h.P.pkh.rate_schwelle)} die Rate um die Hälfte verringert.</p>
<h2>Was der Rechner nicht prüft</h2>
<p>Er kennt die Freibeträge der ${h.src('pkhb2026', 'Prozesskostenhilfebekanntmachung 2026')} und die Ratenformel, aber nicht:</p>
<ul>
<li>Ihr Vermögen, das zusätzlich einzusetzen sein kann,</li>
<li>Mehrbedarfe, etwa bei Schwangerschaft, Alleinerziehung oder Behinderung,</li>
<li>die Erfolgsaussicht und Mutwilligkeit Ihres Verfahrens,</li>
<li>die Kosten des Verfahrens: Liegen sie unter vier Monatsraten, wird keine Hilfe bewilligt,</li>
<li>einen möglichen Anspruch auf Verfahrenskostenvorschuss gegen den Ehegatten.</li>
</ul>
<p>Was das Verfahren kosten würde, berechnet der ${h.a('scheidungskosten-rechner', 'Scheidungskosten-Rechner')}; die Regeln im Zusammenhang erklärt die Seite ${h.a('verfahrenskostenhilfe', 'Verfahrenskostenhilfe')}. Die Berechnung ist eine allgemeine Schätzung der Rate und keine Rechtsberatung; über Ihren Antrag entscheidet das Gericht anhand des amtlichen Formulars und Ihrer Belege.</p>`,
  },
  en: {
    slug: 'legal-aid-calculator',
    nav: 'Legal aid calculator',
    card: 'Instalment or none: 2026 allowances, rent, children and spouse, with the section 115 ZPO steps shown.',
    title: 'Legal Aid Calculator Germany 2026: Instalment or None?',
    description: `Legal aid calculator for German family cases 2026: PKHB 2026 allowances, rent, children, spouse, instalment under section 115 ZPO, at most ${EN.num(K.max_raten)} payments.`,
    h1: 'Calculate German legal aid',
    intro: 'The tool deducts the 2026 allowances from your income and shows whether legal aid (Prozesskostenhilfe) would come without instalments or with which monthly payment.',
    resume: `With the calculator’s starting values, ${EN.eur(2100)} net, working, ${EN.eur(750)} rent including heating and no dependants, the 2026 monthly instalment for German legal aid (Prozesskostenhilfe, called Verfahrenskostenhilfe in family cases) is ${EN.eur(start.rate)}. The tool deducts ${EN.eur(K.partei)} for you, the ${EN.eur(K.erwerbstaetige)} earner allowance and your housing costs, leaving ${EN.eur(start.einzusetzen)} of income to be used; the instalment is half of it, rounded down to whole euros. You pay at most ${EN.num(K.max_raten)} instalments, so never more than ${EN.eur(start.summeMax)} and never more than the actual costs. If a spouse with ${EN.eur(300)} of own income lives with you, a spouse allowance of ${EN.eur(K.ehegatte)} reduced by that income is deducted, and the aid ${mitEhegatte.ratenfrei ? 'comes without instalments' : `costs only ${EN.eur(mitEhegatte.rate)} a month`}. Above ${EN.eur(K.rate_schwelle)} of income to be used, the instalment climbs steeply: ${EN.eur(K.rate_sockel)} plus every further euro. The basis is section 115 of the Code of Civil Procedure (ZPO) and the 2026 legal aid notice.`,
    faqs: [
      { q: 'Which income do I enter if I am paid partly abroad?', a: 'Enter everything you receive each month, converted into euros: German and foreign net salary, child benefit (Kindergeld) paid to you, maintenance you receive, rental or other income. Spread annual bonuses over twelve months. The court asks for proof of each source in the official declaration, so the calculator’s result is only as good as the figures you put in.' },
      { q: `Why does the legal aid instalment jump once I pass ${EN.eur(K.rate_schwelle)}?`, a: `Section 115(2) ZPO says so. Up to ${EN.eur(K.rate_schwelle)} of income to be used, the instalment is half, so at most ${EN.eur(K.rate_sockel)}. Every euro above that is added in full. With ${EN.eur(K.rate_schwelle + 100)} to be used you pay ${EN.eur(K.rate_sockel + 100)} a month. Higher incomes therefore quickly reach a point where applying makes little difference.` },
      { q: 'Does the legal aid calculator look at my savings?', a: 'No, only at income. Savings, shares or a let flat are checked separately by the court: assets must be used where reasonable unless they are protected under social assistance rules. If you hold significant savings, in Germany or abroad, aid may be refused or a payment from those assets ordered even if the calculator shows a low instalment.' },
      { q: 'What age should I enter for my children?', a: `Their current age in years. The allowance depends on it: ${EN.eur(K.kinder_bis_6)} up to 5, ${EN.eur(K.kinder_7_14)} from 6 to 13, ${EN.eur(K.jugendliche_15_17)} from 14 to 17 and ${EN.eur(K.erwachsene)} from 18. The amount appears under each age field. If a child receives maintenance from the other parent, the court reduces the allowance, which the tool does not model.` },
    ],
    body: (h) => `<h2>The input fields</h2>
<ul>
<li><strong>Net income:</strong> everything you receive monthly, including child benefit paid to you.</li>
<li><strong>Working?:</strong> if yes, ${h.eur(h.P.pkh.erwerbstaetige)} more is deducted.</li>
<li><strong>Rent and heating:</strong> your rent including heating or, for owners, interest, service charges and heating.</li>
<li><strong>Special burdens:</strong> for instance loan repayments or maintenance you pay. Whether the court accepts them as reasonable is decided case by case.</li>
<li><strong>Supporting a spouse?:</strong> if yes, a field for the spouse’s income appears; the ${h.eur(h.P.pkh.ehegatte)} allowance is reduced by that income.</li>
<li><strong>Dependent children:</strong> zero to six; each child gets an age field showing its allowance.</li>
</ul>
<p>The result shows the monthly instalment or “no instalments”, each deduction line by line, the income to be used and the maximum total of ${h.num(h.P.pkh.max_raten)} instalments. The step-by-step note quotes the formula of ${h.src('zpo115', 'section 115(2) ZPO')}.</p>
<h2>Four households compared</h2>
${h.table(['Household', 'To be used', 'Instalment', 'Maximum total'], [
  ['starting values: €2,100, rent €750', h.eur(start.einzusetzen), start.ratenfrei ? 'none' : h.eur(start.rate), h.eur(start.summeMax)],
  ['plus €150 loan repayment', h.eur(mitKredit.einzusetzen), mitKredit.ratenfrei ? 'none' : h.eur(mitKredit.rate), h.eur(mitKredit.summeMax)],
  ['€1,750, children 3 and 10, rent €650', h.eur(zweiKinder.einzusetzen), zweiKinder.ratenfrei ? 'none' : h.eur(zweiKinder.rate), h.eur(zweiKinder.summeMax)],
  ['€1,300, not working, rent €550', h.eur(ohneArbeit.einzusetzen), ohneArbeit.ratenfrei ? 'none' : h.eur(ohneArbeit.rate), h.eur(ohneArbeit.summeMax)],
], 'Computed with the allowances of the 2026 legal aid notice', ['l', 'r', 'r', 'r'])}
<p>The second row shows how much an accepted burden matters: a ${h.eur(150)} loan repayment lowers the instalment by ${h.eur(start.rate - mitKredit.rate)}, because below the ${h.eur(h.P.pkh.rate_schwelle)} threshold every euro deducted cuts the instalment by half a euro.</p>
<h2>What the tool does not check</h2>
<p>It applies the allowances of the ${h.src('pkhb2026', '2026 legal aid notice')} and the instalment formula, but not:</p>
<ul>
<li>your assets, which may have to be used as well,</li>
<li>additional needs, for example in pregnancy, as a single parent or with a disability,</li>
<li>the prospects of success of your case or whether it is frivolous,</li>
<li>the cost of the case: if it stays below four instalments, no aid is granted,</li>
<li>a possible claim against your spouse for an advance on costs.</li>
</ul>
<p>The ${h.a('scheidungskosten-rechner', 'divorce cost calculator')} shows what the proceedings would cost, and the ${h.a('verfahrenskostenhilfe', 'legal aid')} guide explains the rules together. This is a general estimate of the instalment, not legal advice; the court decides on your application using the official form and your documents.</p>`,
  },
});
