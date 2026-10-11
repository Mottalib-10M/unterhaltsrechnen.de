import { defineGuide } from '../../lib/guide-types';
import { wechselmodell } from '../../lib/engine/unterhalt';
import { kindesunterhalt } from '../../lib/engine/dt';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Paritätisches Wechselmodell: BGH XII ZB 565/15, Nummer 12 Absatz 3 und Nummer 14 der Leitlinien NRW 2026.
 * Alle Beispiele aus dem Motor `wechselmodell`; Elternteil A = Mutter, B = Vater.
 */
const fam = wechselmodell({ einkommenA: 3400, einkommenB: 2300, alter: 8, kindergeldAn: 'B' });
const residenz = kindesunterhalt(2300, [{ alter: 8 }]);
const gleich = wechselmodell({ einkommenA: 2900, einkommenB: 2900, alter: 13, kindergeldAn: 'A' });
const schief = wechselmodell({ einkommenA: 4200, einkommenB: 1600, alter: 4, kindergeldAn: 'B' });
const mehr = wechselmodell({ einkommenA: 3400, einkommenB: 2300, alter: 8, mehrbedarf: 150, kindergeldAn: 'B' });
const KG = P.kindergeld.monat;
const SOCKEL = P.leitlinien.sockel_volljaehrig;

export default defineGuide({
  id: 'wechselmodell-unterhalt',
  group: 'kind',
  order: 45,
  mini: 'wechselSchnell',
  related: ['wechselmodell-rechner', 'erweiterter-umgang', 'kindergeld-anrechnung', 'kindesunterhalt', 'selbstbehalt', 'bereinigtes-netto'],
  sources: ['bghWechsel2017', 'olgLeitlinien', 'bgb1606', 'bgb1612b', 'olgDtPdf'],
  de: {
    slug: 'wechselmodell-unterhalt',
    nav: 'Wechselmodell',
    card: 'Wer im echten Wechselmodell wem wie viel zahlt: Bedarf, Haftungsquote, Unterhaltsspitze und Kindergeld.',
    title: 'Wechselmodell Unterhalt 2026: wer zahlt wem wie viel?',
    description: `Unterhalt im Wechselmodell 2026: Bedarf nach beiden Einkommen, Haftung über ${DE.eur(SOCKEL)}, halbe Differenz als Spitze, Kindergeld von ${DE.eur(KG)} geteilt, mit Beispielen.`,
    h1: 'Unterhalt im Wechselmodell: so wird gerechnet',
    intro: 'Betreuen beide Eltern das Kind je etwa zur Hälfte, zahlen beide Barunterhalt. Übrig bleibt eine Ausgleichszahlung, oft viel kleiner als gedacht.',
    resume: `Im paritätischen Wechselmodell, wenn ein Kind etwa gleich lange bei beiden Eltern lebt, haften nach dem Bundesgerichtshof (Beschluss vom 11. Januar 2017, XII ZB 565/15) beide Eltern für den Barunterhalt. Der Bedarf richtet sich nach dem zusammengerechneten Einkommen beider Eltern, ohne Höhergruppierung, plus den Mehrkosten des Wechselmodells wie zweites Kinderzimmer oder Fahrten. Davon geht das halbe Kindergeld ab. Jeder Elternteil haftet im Verhältnis seines Einkommens über dem Sockel von ${DE.eur(SOCKEL)}. Weil beide die Hälfte in Natur leisten, schuldet der besser verdienende nur die halbe Differenz der Haftungsanteile, die Unterhaltsspitze. Die Kindergeldhälfte für die Betreuung wird hälftig geteilt, die Barhälfte nach Quote. Beispiel des Rechenkerns: Mutter ${DE.eur(3400)}, Vater ${DE.eur(2300)}, Kind von acht Jahren, Kindergeld beim Vater. Bedarf ${DE.eur(fam.tabellenbedarf)}, Barbedarf ${DE.eur(fam.barbedarf, 2)}, Spitze ${DE.eur(fam.spitze, 2)} zulasten der Mutter, der Vater gibt ${DE.eur(fam.kgWeitergabe, 2)} Kindergeld weiter. Nach Verrechnung zahlt die Mutter ${DE.eur(fam.ausgleich, 2)} im Monat.`,
    faqs: [
      { q: 'Ab welchem Betreuungsanteil gilt ein Wechselmodell beim Unterhalt?', a: `Eine feste Prozentgrenze gibt es nicht. Der BGH verlangt, dass sich die Eltern die Betreuung so teilen, dass jeder etwa die Hälfte der Versorgungs- und Erziehungsaufgaben wahrnimmt. Die Zeit ist ein wichtiges Indiz, aber nicht allein maßgeblich. Im Fall von April 2026 reichten ${DE.num(6)} von ${DE.num(14)} Übernachtungen dem Gericht nicht; dort lag ein erweiterter Umgang vor, kein Wechselmodell.` },
      { q: 'Warum zahlt im Wechselmodell nur die halbe Differenz der Haftungsanteile?', a: `Weil jeder Elternteil während seiner Betreuungszeit selbst für Essen, Wohnung und Alltag des Kindes sorgt, also etwa die Hälfte des Bedarfs in Natur deckt. Der Zahlungsanspruch des Kindes richtet sich nach den Leitlinien in NRW deshalb nur gegen den besser verdienenden Elternteil und beträgt die Hälfte der verbleibenden Unterhaltsspitze. Im Beispiel sind das ${DE.eur(fam.spitze, 2)} vor der Kindergeldverrechnung.` },
      { q: 'Wie wird das Kindergeld im Wechselmodell zwischen den Eltern aufgeteilt?', a: `Die Hälfte des Kindergeldes deckt den Barbedarf und kommt den Eltern nach ihrer Einkommensquote zugute. Die andere Hälfte gehört zur Betreuung und wird zwischen beiden Eltern hälftig geteilt, so Nummer 14 Absatz 2 der Leitlinien in NRW. Bei gleichen Einkommen gibt der Bezieher deshalb ${DE.eur(gleich.kgWeitergabe, 2)} an den anderen weiter, auch wenn sonst niemand etwas zahlt.` },
      { q: 'Welche Mehrkosten des Wechselmodells erkennen Gerichte an?', a: `Der BGH nennt vor allem Wohnmehrkosten für ein zweites Kinderzimmer, Fahrtkosten und die doppelte Anschaffung persönlicher Gegenstände. Diese Mehrkosten erhöhen den Bedarf des Kindes und werden nach Einkommen aufgeteilt. Kosten, die zur eigenen Lebensführung eines Elternteils gehören, zählen nicht dazu. Mit ${DE.eur(150)} anerkannten Mehrkosten stiege die Zahlung im Beispiel auf ${DE.eur(mehr.ausgleich, 2)}.` },
      { q: 'Kann im Wechselmodell der Elternteil mit weniger Einkommen ganz von der Haftung frei sein?', a: `Ja, wenn sein bereinigtes Einkommen unter dem Sockel von ${DE.eur(SOCKEL)} liegt, ist seine Haftungsquote null. Dann trägt der andere den gesamten Barbedarf, zahlt aber wegen der hälftigen Naturalleistung nur die Hälfte davon als Spitze. Für minderjährige Kinder kann der Sockel nach den Leitlinien bis zum notwendigen Selbstbehalt sinken, wenn sonst der Mindestbedarf nicht gedeckt wäre.` },
      { q: 'Wer vertritt das Kind, wenn im Wechselmodell Unterhalt eingeklagt wird?', a: `Bei nicht verheirateten oder geschiedenen Eltern kann jeder Elternteil das Kind gegen den anderen vertreten, ohne Ergänzungspfleger. Sind die Eltern noch verheiratet, sind beide nach § 1629 Abs. 2 BGB von der Vertretung ausgeschlossen, wie der BGH im April 2026 bestätigt hat. Dann braucht es einen Ergänzungspfleger oder eine gerichtliche Übertragung der Entscheidung.` },
    ],
    body: (h) => `<h2>Wann ein paritätisches Wechselmodell vorliegt</h2>
<p>Nach § 1606 Abs. 3 Satz 2 BGB erfüllt der Elternteil, der ein minderjähriges Kind betreut, seine Unterhaltspflicht durch Pflege und Erziehung; der andere zahlt. Diese Arbeitsteilung passt nicht mehr, wenn das Kind in etwa gleich langen Phasen abwechselnd bei beiden lebt. Dann kann keinem Elternteil die Hauptverantwortung zugeordnet werden, und beide haften für den Barunterhalt. So der ${h.src('bghWechsel2017', 'BGH im Beschluss XII ZB 565/15')}.</p>
<p>Ob die Betreuung wirklich hälftig ist, prüft das Familiengericht im Einzelfall. Die Zeit ist ein Indiz, daneben zählt, wer sich um Schule, Arzt, Kleidung und Freizeit kümmert. Fällt die Betreuung deutlich ungleich aus, bleibt es beim Residenzmodell, gegebenenfalls mit den Abschlägen für einen ${h.a('erweiterter-umgang', 'erweiterten Umgang')}.</p>
<h2>Die Rechnung in fünf Schritten</h2>
<ul>
<li><strong>Bedarf</strong>: Tabellenbetrag nach dem zusammengerechneten bereinigten Einkommen beider Eltern, ohne Höhergruppierung (Nummer 12 Absatz 3 der Leitlinien in NRW), plus Mehrkosten des Wechselmodells.</li>
<li><strong>Barbedarf</strong>: Bedarf minus halbes Kindergeld, also ${h.eur(h.P.kindergeld.monat / 2, 2)} (${h.src('bgb1612b', '§ 1612b BGB')}).</li>
<li><strong>Haftungsquote</strong>: Einkommen jedes Elternteils über ${h.eur(h.P.leitlinien.sockel_volljaehrig)}, ins Verhältnis gesetzt.</li>
<li><strong>Unterhaltsspitze</strong>: die halbe Differenz der beiden Haftungsanteile, geschuldet vom besser verdienenden Elternteil.</li>
<li><strong>Kindergeldausgleich</strong>: Wer das Kindergeld bezieht, gibt ein Viertel als halben Betreuungsanteil und den Baranteil des anderen nach dessen Quote weiter. Beides wird mit der Spitze verrechnet.</li>
</ul>
<h2>Beispiel: Mutter ${h.eur(3400)}, Vater ${h.eur(2300)}</h2>
${h.table(['Schritt', 'Betrag'], [
  [`Zusammengerechnetes Einkommen ${h.eur(3400 + 2300)}, Gruppe ${fam.gruppe + 1}, Kind 8 Jahre`, h.eur(fam.tabellenbedarf)],
  ['minus halbes Kindergeld: Barbedarf', h.eur(fam.barbedarf, 2)],
  [`Haftungsquote Mutter / Vater`, `${h.pct(fam.quoteA, 1)} / ${h.pct(fam.quoteB, 1)}`],
  ['Haftungsanteil Mutter', h.eur(fam.anteilA, 2)],
  ['Haftungsanteil Vater', h.eur(fam.anteilB, 2)],
  ['Unterhaltsspitze, halbe Differenz, Mutter schuldet', h.eur(fam.spitze, 2)],
  ['Kindergeldweitergabe durch den Vater', h.eur(fam.kgWeitergabe, 2)],
  ['Ausgleich nach Verrechnung, Mutter zahlt', h.eur(fam.ausgleich, 2)],
], 'Vom Rechenkern ermittelt, Leitlinien NRW 2026 und Düsseldorfer Tabelle 2026', ['l', 'r'])}
<p>Zum Vergleich: Lebte das Kind ganz bei der Mutter, zahlte der Vater nach seinem eigenen Einkommen ${h.eur(residenz.summe, 2)} im Monat. Im Wechselmodell erhält er stattdessen eine kleine Ausgleichszahlung. Er trägt aber die Hälfte der Betreuung und die Kosten seines eigenen Haushalts mit Kind.</p>
<h2>Drei weitere Konstellationen</h2>
${h.table(['Eltern', 'Kind', 'Kindergeld bei', 'Spitze', 'Kindergeld weiter', 'Ausgleich'], [
  [`${h.eur(2900)} / ${h.eur(2900)}`, '13 Jahre', 'Mutter', h.eur(gleich.spitze, 2), h.eur(gleich.kgWeitergabe, 2), `${h.eur(gleich.ausgleich, 2)}, Mutter zahlt`],
  [`${h.eur(4200)} / ${h.eur(1600)}`, '4 Jahre', 'Vater', h.eur(schief.spitze, 2), h.eur(schief.kgWeitergabe, 2), `${h.eur(schief.ausgleich, 2)}, Mutter zahlt`],
  [`${h.eur(3400)} / ${h.eur(2300)}, ${h.eur(150)} Mehrkosten`, '8 Jahre', 'Vater', h.eur(mehr.spitze, 2), h.eur(mehr.kgWeitergabe, 2), `${h.eur(mehr.ausgleich, 2)}, Mutter zahlt`],
], 'Einkommen Mutter / Vater, bereinigt; vom Rechenkern gerechnet', ['l', 'l', 'l', 'r', 'r', 'r'])}
<p>Bei gleichen Einkommen gibt es keine Spitze; es bleibt nur das Kindergeld, das die Mutter zum Teil an den Vater weitergibt. Verdient der Vater weniger als den Sockel von ${h.eur(h.P.leitlinien.sockel_volljaehrig)}, haftet die Mutter allein, zahlt aber nur die Hälfte des Barbedarfs als Spitze, verrechnet mit dem Kindergeld.</p>
<h2>Mehrkosten und Mehrbedarf</h2>
<p>Ein Wechselmodell kostet mehr als das Leben in einem Haushalt: zwei Kinderzimmer, doppelte Kleidung und Spielsachen, Fahrten zwischen den Wohnungen, zur Schule, zum Sport. Der BGH hat diese Mehrkosten ausdrücklich dem Bedarf des Kindes zugerechnet, nicht aber Kosten, die zur Lebensführung eines Elternteils gehören. Kita- oder Hortbeiträge ohne Verpflegung sind ohnehin Mehrbedarf, den beide Eltern nach Einkommen tragen. Wie hoch Mehrkosten anzusetzen sind, beurteilen Gerichte unterschiedlich; im ${h.a('wechselmodell-rechner', 'Wechselmodell-Rechner')} tragen Sie Ihre eigene Annahme ein.</p>
<h2>Was in das Einkommen eingeht</h2>
<p>Beide Einkommen werden nach den Regeln zum ${h.a('bereinigtes-netto', 'bereinigten Netto')} ermittelt: Steuern, Sozialabgaben, berufsbedingte Kosten und berücksichtigungsfähige Schulden gehen ab. Unterhalt für vorrangige Berechtigte, etwa ein weiteres minderjähriges Kind aus einer anderen Beziehung, wird vorher abgezogen. Für minderjährige Kinder kann der Sockel nach Nummer 13 Absatz 3 der ${h.src('olgLeitlinien', 'Leitlinien in NRW')} bis zum notwendigen Selbstbehalt von ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)} sinken, wenn sonst der Bedarf nach der ersten Gruppe nicht gedeckt wäre.</p>
<h2>Verfahren und Vertretung</h2>
<p>Den Anspruch hat das Kind, nicht der Elternteil. Er richtet sich nur gegen den besser verdienenden Elternteil. Bei geschiedenen oder nie verheirateten Eltern kann jeder das Kind gegenüber dem anderen vertreten. Während einer bestehenden Ehe sind beide von der Vertretung ausgeschlossen; dann ist ein Ergänzungspfleger nötig oder eine gerichtliche Übertragung der Entscheidungsbefugnis. Diese Seite ist eine allgemeine Information über den Unterhalt im Wechselmodell nach der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')}, keine Rechtsberatung.</p>`,
  },
  en: {
    slug: 'shared-care-child-support',
    nav: 'Equal shared care',
    card: 'Who pays whom when a child lives half the time with each parent in Germany: need, shares, net payment, child benefit.',
    title: 'Shared Care Child Support Germany 2026: Who Pays Whom',
    description: `Child support in German equal shared care (Wechselmodell), 2026: need from both incomes, shares above ${EN.eur(SOCKEL)}, half the gap is paid, child benefit split.`,
    h1: 'Child support under equal shared care: how Germany calculates it',
    intro: 'When a child lives roughly half the time with each parent, both pay cash support. What is left is a balancing payment, often much smaller than expected.',
    resume: `Under equal shared care (paritätisches Wechselmodell), where a child spends about the same time with each parent, Germany’s Federal Court of Justice held on 11 January 2017 (XII ZB 565/15) that both parents are liable for cash support. The child’s need follows the combined income of both parents, without moving up a group, plus the extra costs of shared care such as a second bedroom or travel. Half of the child benefit (Kindergeld) comes off. Each parent is liable in proportion to income above a base of ${EN.eur(SOCKEL)}. Because each already provides half in kind, the higher earner owes only half the difference between the two shares, the support peak (Unterhaltsspitze). The care half of child benefit is split equally, the cash half by income share. Our engine’s example: mother ${EN.eur(3400)}, father ${EN.eur(2300)}, child aged eight, father receives child benefit. Need ${EN.eur(fam.tabellenbedarf)}, cash need ${EN.eur(fam.barbedarf, 2)}, peak ${EN.eur(fam.spitze, 2)} owed by the mother, father passes on ${EN.eur(fam.kgWeitergabe, 2)} of child benefit. Net, the mother pays ${EN.eur(fam.ausgleich, 2)} a month.`,
    faqs: [
      { q: 'What share of care counts as equal shared care for German child support?', a: `There is no fixed percentage. The Federal Court of Justice asks whether each parent takes on roughly half of the care and upbringing. Time is an important indicator but not decisive alone. In its April 2026 case, ${EN.num(6)} of ${EN.num(14)} nights with the father was not enough: the court treated it as extended contact (erweiterter Umgang), not shared care.` },
      { q: 'Why does the higher earner only pay half the difference under shared care?', a: `Because each parent feeds, houses and looks after the child during their own time, covering about half the need in kind. Under the NRW guidelines the child’s claim is therefore only against the higher earner and equals half the remaining peak. In the example that is ${EN.eur(fam.spitze, 2)} before child benefit is settled.` },
      { q: 'How is German child benefit split between parents in equal shared care?', a: `Half of it covers cash need and benefits each parent according to their income share. The other half belongs to care and is divided equally, under number 14 paragraph 2 of the NRW guidelines. With equal incomes the parent receiving it passes ${EN.eur(gleich.kgWeitergabe, 2)} to the other, even though no other payment is due. Only one parent can receive Kindergeld from the Familienkasse.` },
      { q: 'Which extra costs of shared care do German courts accept?', a: `The 2017 ruling names extra housing costs for a second child’s room, travel costs and buying personal items twice. They are added to the child’s need and split by income. Costs belonging to a parent’s own lifestyle do not count. With ${EN.eur(150)} of accepted extra costs, the payment in our example would rise to ${EN.eur(mehr.ausgleich, 2)}.` },
      { q: 'Can a low-earning parent owe nothing under shared care?', a: `Yes. If adjusted income is below the ${EN.eur(SOCKEL)} base, that parent’s share is zero. The other then carries the whole cash need but, since half is provided in kind, pays only half of it as the peak. For minors, the NRW guidelines allow the base to drop to the minimum self-retention if the group 1 need could not otherwise be met.` },
      { q: 'We share care across two countries: does the German calculation still apply?', a: `If a German court has jurisdiction and applies German law, it uses this method with both incomes converted into euros. Which court and which country’s law apply in a cross-border case depends on where the child habitually lives and on international rules, which this page does not cover. Equal shared care across borders is also hard to run in practice because of school.` },
    ],
    body: (h) => `<h2>When care is truly shared</h2>
<p>Under section 1606(3) sentence 2 of the Civil Code (BGB), the parent who looks after a minor child meets the duty of support through care; the other pays cash. That split no longer fits when the child lives in roughly equal phases with each parent. No one carries the main responsibility, so both are liable for cash support, as the ${h.src('bghWechsel2017', 'Federal Court of Justice held in XII ZB 565/15')}.</p>
<p>Whether care really is equal is for the family court (Familiengericht) to judge. Time is one indicator; who handles school, doctors, clothes and activities is another. If care is clearly unequal, the ordinary model applies, possibly with the reductions for ${h.a('erweiterter-umgang', 'extended contact')}.</p>
<h2>Five steps</h2>
<ul>
<li><strong>Need</strong>: the table amount on both parents’ combined adjusted income, without moving up a group (number 12 paragraph 3 of the NRW guidelines), plus the extra costs of shared care.</li>
<li><strong>Cash need</strong>: need minus half the child benefit, ${h.eur(h.P.kindergeld.monat / 2, 2)} (${h.src('bgb1612b', 'section 1612b BGB')}).</li>
<li><strong>Shares</strong>: each parent’s income above ${h.eur(h.P.leitlinien.sockel_volljaehrig)}, set against each other.</li>
<li><strong>Support peak</strong>: half the difference between the two shares, owed by the higher earner.</li>
<li><strong>Child benefit</strong>: the recipient passes on a quarter (half of the care half) plus the other parent’s cash portion by income share. Both are offset against the peak.</li>
</ul>
<h2>Example: mother ${h.eur(3400)}, father ${h.eur(2300)}</h2>
${h.table(['Step', 'Amount'], [
  [`Combined income ${h.eur(3400 + 2300)}, group ${fam.gruppe + 1}, child aged 8`, h.eur(fam.tabellenbedarf)],
  ['minus half child benefit: cash need', h.eur(fam.barbedarf, 2)],
  ['Share mother / father', `${h.pct(fam.quoteA, 1)} / ${h.pct(fam.quoteB, 1)}`],
  ['Mother’s liability', h.eur(fam.anteilA, 2)],
  ['Father’s liability', h.eur(fam.anteilB, 2)],
  ['Support peak, half the difference, owed by mother', h.eur(fam.spitze, 2)],
  ['Child benefit passed on by father', h.eur(fam.kgWeitergabe, 2)],
  ['Net payment, mother pays', h.eur(fam.ausgleich, 2)],
], 'Computed by our engine, NRW guidelines and Düsseldorf Table 2026', ['l', 'r'])}
<p>For comparison: if the child lived only with the mother, the father would pay ${h.eur(residenz.summe, 2)} a month on his own income. Under shared care he instead receives a small balancing payment, while carrying half the care and the cost of his own home with the child.</p>
<h2>Three more families</h2>
${h.table(['Incomes', 'Child', 'Benefit to', 'Peak', 'Benefit passed on', 'Net payment'], [
  [`${h.eur(2900)} / ${h.eur(2900)}`, 'aged 13', 'mother', h.eur(gleich.spitze, 2), h.eur(gleich.kgWeitergabe, 2), `${h.eur(gleich.ausgleich, 2)} by mother`],
  [`${h.eur(4200)} / ${h.eur(1600)}`, 'aged 4', 'father', h.eur(schief.spitze, 2), h.eur(schief.kgWeitergabe, 2), `${h.eur(schief.ausgleich, 2)} by mother`],
  [`${h.eur(3400)} / ${h.eur(2300)}, ${h.eur(150)} extra costs`, 'aged 8', 'father', h.eur(mehr.spitze, 2), h.eur(mehr.kgWeitergabe, 2), `${h.eur(mehr.ausgleich, 2)} by mother`],
], 'Adjusted incomes mother / father; computed by our engine', ['l', 'l', 'l', 'r', 'r', 'r'])}
<p>With equal incomes there is no peak; only the child benefit remains, part of which the mother passes to the father. When the father earns less than the ${h.eur(h.P.leitlinien.sockel_volljaehrig)} base, the mother is liable alone but pays only half the cash need as the peak, offset against child benefit.</p>
<h2>Extra costs and extra need</h2>
<p>Shared care costs more than one household: two bedrooms, duplicate clothes and toys, travel between homes, to school and to sports. The 2017 ruling counts these extra costs as part of the child’s need, but not costs of a parent’s own lifestyle. Nursery or after-school fees without meals are extra need (Mehrbedarf) anyway, shared by income. Courts put different values on extra costs; in the ${h.a('wechselmodell-rechner', 'shared care calculator')} you enter your own estimate.</p>
<h2>Which income counts</h2>
<p>Both incomes are worked out under the rules on ${h.a('bereinigtes-netto', 'adjusted net income')}: tax, social contributions, work costs and allowable debts come off. Support for higher-ranking dependants, such as another minor child from a different relationship, is deducted first. For minors, number 13 paragraph 3 of the ${h.src('olgLeitlinien', 'NRW guidelines')} lets the base drop to the ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)} minimum self-retention if the group 1 need would otherwise go unmet. A salary paid by a foreign employer is converted into euros and adjusted in the same way.</p>
<h2>Who brings the claim</h2>
<p>The claim belongs to the child, not to a parent, and runs only against the higher earner. Divorced or never-married parents can each represent the child against the other. While parents are still married, both are barred from representing the child, so a supplementary guardian (Ergänzungspfleger) or a court order transferring the decision is needed. This page is general information on child support under shared care using the ${h.src('olgDtPdf', '2026 Düsseldorf Table')}, not legal advice.</p>`,
  },
});
