import { defineGuide } from '../../lib/guide-types';
import { ehegattenunterhalt } from '../../lib/engine/unterhalt';
import { kindesunterhalt } from '../../lib/engine/dt';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor: Familie mit zwei Kindern (2 und 7 Jahre) bei 4.400 €, Partnerin mit 600 €; Vergleich ohne Kinder; knapper Fall mit einem Kleinkind. */
const kinder = kindesunterhalt(4400, [{ alter: 2 }, { alter: 7 }]);
const mitKindern = ehegattenunterhalt({ pflichtigErwerb: 4400, berechtigtErwerb: 600, kindesunterhalt: kinder.summe });
const ohneKinder = ehegattenunterhalt({ pflichtigErwerb: 4400, berechtigtErwerb: 600 });
const klein = kindesunterhalt(2900, [{ alter: 1 }]);
const eng = ehegattenunterhalt({ pflichtigErwerb: 2900, berechtigtErwerb: 0, kindesunterhalt: klein.summe });
const E = P.ehegatte;
const S = P.selbstbehalt;

export default defineGuide({
  id: 'trennungsunterhalt',
  group: 'ehe',
  order: 22,
  mini: 'trennung',
  related: ['trennungsunterhalt-rechner', 'ehegattenunterhalt', 'kindesunterhalt', 'selbstbehalt', 'scheidungskosten', 'unterhaltsverfahren-kosten'],
  sources: ['bgb1361', 'olgDtPdf', 'olgLeitlinien', 'bgb1609', 'bgb1565'],
  de: {
    slug: 'trennungsunterhalt',
    nav: 'Trennungsunterhalt',
    card: 'Unterhalt zwischen Trennung und Scheidung: Höhe, Vorrang der Kinder, kein Verzicht, Ende mit der Scheidung.',
    title: 'Trennungsunterhalt 2026: Höhe, Dauer und Kinder-Vorrang',
    description: `Trennungsunterhalt 2026 nach § 1361 BGB: ${DE.pct(E.quote_erwerb)} der Einkommensdifferenz nach Kindesunterhalt, Selbstbehalt ${DE.eur(S.ehegatte_erwerbstaetig)}, kein Verzicht, Ende mit der Scheidung.`,
    h1: 'Trennungsunterhalt: was zwischen Trennung und Scheidung gilt',
    intro: 'Solange die Ehe besteht, schulden sich getrennt lebende Ehegatten angemessenen Unterhalt, und zwar ohne die strengen Voraussetzungen der Zeit nach der Scheidung.',
    resume: `Trennungsunterhalt nach § 1361 BGB steht dem wirtschaftlich schwächeren Ehegatten vom Auszug, genauer vom Getrenntleben an, bis zur Rechtskraft der Scheidung zu. Anders als nach der Scheidung braucht es keinen besonderen Anspruchsgrund: Es genügt, dass die Einkommen auseinanderliegen. Berechnet wird wie beim nachehelichen Unterhalt nach Anmerkung B der Düsseldorfer Tabelle 2026, also ${DE.pct(E.quote_erwerb)} der Differenz der bereinigten Erwerbseinkommen, aber erst nachdem der Kindesunterhalt abgezogen ist, denn minderjährige Kinder haben Vorrang. Bei ${DE.eur(4400)} netto, zwei Kindern von zwei und sieben Jahren und ${DE.eur(600)} Einkommen der Partnerin gehen zuerst ${DE.eur(kinder.summe)} an die Kinder; danach bleiben ${DE.eur(mitKindern.unterhalt, 2)} Trennungsunterhalt. Dem Zahlenden müssen ${DE.eur(S.ehegatte_erwerbstaetig)} bleiben. Im ersten Trennungsjahr muss der bisher nicht berufstätige Ehegatte in der Regel keine Arbeit aufnehmen. Auf künftigen Trennungsunterhalt kann nicht verzichtet werden, auch nicht vertraglich.`,
    faqs: [
      { q: 'Ab wann kann man Trennungsunterhalt verlangen?', a: 'Ab dem Getrenntleben im Sinne des § 1567 BGB, das auch innerhalb der gemeinsamen Wohnung beginnen kann. Rückwirkend gibt es Trennungsunterhalt allerdings erst ab dem Monat, in dem der andere zur Auskunft über sein Einkommen aufgefordert, gemahnt oder ein Antrag bei Gericht zugestellt wurde (§ 1613 BGB über § 1360a Absatz 3 BGB). Wer zu lange wartet, verliert deshalb Monate, die nicht nachgefordert werden können.' },
      { q: 'Muss ich im Trennungsjahr arbeiten gehen, um Trennungsunterhalt zu bekommen?', a: 'In der Regel nicht. Die Leitlinien der Oberlandesgerichte in NRW sehen im ersten Jahr nach der Trennung keine Obliegenheit, eine Arbeit aufzunehmen oder auszuweiten. Danach prüft das Gericht nach § 1361 Absatz 2 BGB, ob eine Erwerbstätigkeit zumutbar ist, mit Blick auf frühere Berufstätigkeit, Ehedauer und die wirtschaftliche Lage beider. Je näher die Scheidung rückt, desto eher wird eigene Arbeit erwartet.' },
      { q: 'Ist ein Verzicht auf Trennungsunterhalt im Ehevertrag wirksam?', a: 'Für die Zukunft nicht. § 1361 Absatz 4 BGB verweist über § 1360a Absatz 3 auf § 1614 BGB, und danach kann auf künftigen Unterhalt nicht verzichtet werden. Eine Klausel im Ehevertrag oder in einer Trennungsvereinbarung, die den Trennungsunterhalt ausschließt, hilft dem Zahlenden deshalb nicht. Man kann den Anspruch nur für bereits vergangene Monate erlassen oder einfach nicht geltend machen.' },
      { q: 'Wie wirkt sich der Kindesunterhalt auf den Trennungsunterhalt aus?', a: `Er wird zuerst gezahlt und vorher vom Einkommen abgezogen, weil minderjährige Kinder nach § 1609 BGB im ersten Rang stehen. Im Beispiel mit ${DE.eur(4400)} netto sinkt der Trennungsunterhalt durch zwei Kinder von ${DE.eur(ohneKinder.unterhalt)} auf ${DE.eur(mitKindern.unterhalt, 2)}. Abgezogen wird der Zahlbetrag, also der Tabellenbetrag nach Abzug des halben Kindergelds.` },
      { q: 'Wann endet der Trennungsunterhalt genau?', a: 'Mit der Rechtskraft des Scheidungsbeschlusses. Ab diesem Tag gilt nachehelicher Unterhalt, der nur bei einem gesetzlichen Grund wie Kinderbetreuung, Alter oder Aufstockung besteht und gesondert geltend gemacht werden muss. Ein Beschluss über Trennungsunterhalt reicht nach ständiger Rechtsprechung nicht über die Scheidung hinaus. Eine Versöhnung mit erneutem Zusammenleben beendet den Anspruch ebenfalls.' },
      { q: 'Wer bezahlt die Scheidung, wenn ein Ehegatte kein Geld hat?', a: 'Neben der staatlichen Verfahrenskostenhilfe kennt das Gesetz einen Verfahrenskostenvorschuss: Nach § 1360a Absatz 4 BGB, auf den § 1361 Absatz 4 verweist, muss der leistungsfähige Ehegatte die Kosten eines Verfahrens in einer persönlichen Angelegenheit vorschießen, soweit das der Billigkeit entspricht. Das kann auch die Scheidung oder ein Unterhaltsverfahren betreffen. Ob ein Vorschuss geschuldet ist, prüft im Streitfall das Familiengericht.' },
    ],
    body: (h) => `<h2>Getrennt, aber noch verheiratet</h2>
<p>Wer sich trennt, ist noch lange nicht geschieden. Vor der Scheidung liegt in aller Regel das Trennungsjahr nach ${h.src('bgb1565', '§ 1565 BGB')}, oft vergehen bis zur Rechtskraft des Beschlusses deutlich mehr Monate. Für diese Phase gilt ${h.src('bgb1361', '§ 1361 BGB')}: Ein Ehegatte kann vom anderen den Unterhalt verlangen, der den Lebensverhältnissen und den Erwerbs- und Vermögensverhältnissen beider angemessen ist.</p>
<p>Getrennt leben Ehegatten nach § 1567 BGB, wenn keine häusliche Gemeinschaft mehr besteht und einer sie erkennbar nicht wiederherstellen will. Das ist auch in derselben Wohnung möglich, wenn getrennt gewirtschaftet, gekocht und geschlafen wird. Ein kurzer Versöhnungsversuch unterbricht die Fristen nicht.</p>
<h2>Der Unterschied zum Unterhalt nach der Scheidung</h2>
<p>Nach der Scheidung muss jeder zunächst selbst für sich sorgen; Unterhalt gibt es nur bei einem der Gründe der §§ 1570 bis 1576 BGB. Während der Trennung ist das anders. Die Ehe besteht fort, die Solidarität wirkt stärker, und es genügt ein Einkommensgefälle. Das zeigt sich vor allem bei der Pflicht zu arbeiten:</p>
<ul>
<li>Im ersten Trennungsjahr besteht nach den ${h.src('olgLeitlinien', 'Leitlinien der Oberlandesgerichte in NRW')} in der Regel keine Obliegenheit, eine Arbeit aufzunehmen oder auszuweiten.</li>
<li>Danach darf der nicht erwerbstätige Ehegatte nur auf eigene Arbeit verwiesen werden, wenn das nach früherer Berufstätigkeit, Ehedauer und den wirtschaftlichen Verhältnissen erwartet werden kann (§ 1361 Absatz 2 BGB).</li>
<li>Die Kürzung wegen grober Unbilligkeit nach § 1579 BGB gilt nur mit den Nummern 2 bis 8; eine kurze Ehe allein ist kein Grund, den Trennungsunterhalt zu versagen.</li>
</ul>
<h2>Erst die Kinder, dann der Ehegatte</h2>
<p>Die Höhe folgt derselben Methode wie beim ${h.a('ehegattenunterhalt', 'Ehegattenunterhalt')}: ${h.pct(h.P.ehegatte.quote_erwerb)} der Differenz der bereinigten Erwerbseinkommen nach Anmerkung B der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')}, sonstige Einkünfte je zur Hälfte. Vorher wird aber der ${h.a('kindesunterhalt', 'Kindesunterhalt')} abgezogen. Minderjährige Kinder stehen nach ${h.src('bgb1609', '§ 1609 BGB')} im ersten Rang, und gerade in der Trennungszeit leben sie meist bei dem Elternteil, der Trennungsunterhalt verlangt.</p>
${h.table(['Familie', 'Netto Zahlender', 'Kindesunterhalt', 'Netto Partnerin', 'Trennungsunterhalt'], [
  ['ohne Kinder', h.eur(4400), h.eur(0), h.eur(600), h.eur(ohneKinder.unterhalt)],
  ['zwei Kinder, 2 und 7 Jahre', h.eur(4400), h.eur(kinder.summe), h.eur(600), h.eur(mitKindern.unterhalt, 2)],
  ['ein Kind, 1 Jahr', h.eur(2900), h.eur(klein.summe, 2), h.eur(0), `${h.eur(eng.unterhalt, 2)} (Selbstbehalt)`],
], 'Vom Rechner ermittelt, Zahlender erwerbstätig, Kindesunterhalt nach der Tabelle 2026', ['l', 'r', 'r', 'r', 'r'])}
<p>Die letzte Zeile zeigt die Grenze. Rechnerisch ergäbe die Quote ${h.eur(eng.quote, 2)}, doch dem Vater müssen nach Kindes- und Trennungsunterhalt ${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)} bleiben. Er zahlt deshalb nur ${h.eur(eng.unterhalt, 2)}, die Mutter erhält zusammen mit dem Kindesunterhalt deutlich weniger, als die Quote verspricht. Wie der ${h.a('selbstbehalt', 'Selbstbehalt')} gegenüber Kindern und Ehegatten gestaffelt ist, steht auf der eigenen Seite.</p>
<h2>Besonderheiten der Trennungszeit</h2>
<p>Wer allein im gemeinsamen Haus bleibt, spart Miete. Dieser Wohnvorteil wird als Einkommen angesetzt, in der Trennungszeit nach den Leitlinien meist nur in Höhe einer angemessenen ersparten Miete, solange ein Verkauf oder eine Vermietung nicht zumutbar ist. Ab dem endgültigen Scheitern der Ehe, etwa mit Zustellung des Scheidungsantrags, kann der volle Mietwert zählen.</p>
<p>Ist die Scheidung rechtshängig, gehören nach § 1361 Absatz 1 BGB auch die Kosten einer angemessenen Altersvorsorge zum Unterhalt. Trennungsbedingter Mehrbedarf, etwa eine zweite Miete, wird nur ausnahmsweise neben der Quote berücksichtigt. Der Unterhalt ist monatlich im Voraus als Geldrente zu zahlen.</p>
<h2>Kein Verzicht, keine Rückwirkung ohne Aufforderung</h2>
<p>Über § 1361 Absatz 4 und § 1360a Absatz 3 BGB gelten zwei Vorschriften des Verwandtenunterhalts. § 1614 BGB verbietet einen Verzicht auf künftigen Unterhalt. Und § 1613 BGB erlaubt Nachforderungen erst ab dem Monat, in dem der andere zur Auskunft über sein Einkommen aufgefordert, in Verzug gesetzt oder gerichtlich in Anspruch genommen wurde.</p>
<p>Wer einen Anspruch durchsetzen will, beginnt deshalb meist mit einem Auskunftsverlangen. Für eine gerichtliche Klärung besteht Anwaltszwang, die Kosten hängen vom geforderten Betrag ab; sie sind bei den ${h.a('unterhaltsverfahren-kosten', 'Kosten eines Unterhaltsverfahrens')} durchgerechnet. Was die Scheidung selbst kostet, zeigt die Seite ${h.a('scheidungskosten', 'Scheidungskosten')}.</p>
<h2>Das Ende mit der Rechtskraft</h2>
<p>Trennungsunterhalt endet mit dem Tag, an dem der Scheidungsbeschluss rechtskräftig wird. Danach beginnt ein neuer, eigenständiger Anspruch auf nachehelichen Unterhalt, der seine eigenen Voraussetzungen hat. Ein Titel über Trennungsunterhalt wirkt nicht darüber hinaus; ohne neue Vereinbarung oder Entscheidung muss nach der Scheidung nichts mehr gezahlt werden. Den Betrag für Ihre Zahlen ermittelt der ${h.a('trennungsunterhalt-rechner', 'Trennungsunterhalt-Rechner')}.</p>
<p>Dies ist eine allgemeine Information zum Trennungsunterhalt, Stand 2026, keine Rechtsberatung; über Höhe, Erwerbsobliegenheit und Wohnwert entscheidet im Streit das Familiengericht.</p>`,
  },
  en: {
    slug: 'separation-maintenance',
    nav: 'Separation maintenance',
    card: 'Maintenance between separation and divorce in Germany: amount, children first, no waiver, end at divorce.',
    title: 'Separation Maintenance Germany 2026: Trennungsunterhalt',
    description: `Separation maintenance in Germany 2026 (section 1361 BGB): ${EN.pct(E.quote_erwerb)} of the income gap after child support, ${EN.eur(S.ehegatte_erwerbstaetig)} self-retention, no waiver, ends at divorce.`,
    h1: 'Separation maintenance: the rules until the divorce is final',
    intro: 'While a marriage still exists, separated spouses owe each other appropriate maintenance, on easier terms than after the divorce.',
    resume: `Separation maintenance (Trennungsunterhalt) under section 1361 of the German Civil Code (BGB) runs from the day spouses start living apart until the divorce decree becomes final (Rechtskraft). No special ground is needed: a gap between the two incomes is enough, because the marriage still exists. The amount follows note B of the 2026 Düsseldorf Table: ${EN.pct(E.quote_erwerb)} of the difference between both adjusted earned incomes, calculated only after child support has been deducted, since minor children rank first. A parent earning ${EN.eur(4400)} net with two children aged two and seven, whose spouse earns ${EN.eur(600)}, first pays ${EN.eur(kinder.summe)} for the children and then ${EN.eur(mitKindern.unterhalt, 2)} separation maintenance. The payer keeps at least ${EN.eur(S.ehegatte_erwerbstaetig)}. In the first year apart, a spouse who stayed at home is normally not expected to find a job. Future separation maintenance cannot be waived, not even in a prenuptial agreement, and arrears can only be claimed from the month in which the other spouse was asked for income details.`,
    faqs: [
      { q: 'We still share a flat in Germany. Can separation maintenance start anyway?', a: 'Yes. Under section 1567 BGB spouses can live apart inside the same home if they no longer share a household: separate meals, bedrooms and finances, with one clearly rejecting the marriage. Courts look at the facts. It helps to document the date of separation, for example in a letter, since both the separation year and the maintenance claim run from it.' },
      { q: 'I moved to Germany for my spouse’s job and never worked here. Must I look for work during separation?', a: 'Normally not in the first year: the NRW court guidelines see no duty to take up or extend work during that period. Afterwards, section 1361(2) BGB asks whether work can reasonably be expected, considering earlier employment, the length of the marriage and both spouses’ finances. Language skills and recognition of foreign qualifications are facts a court can weigh, but there is no fixed rule.' },
      { q: 'Our prenuptial agreement excludes maintenance. Does it cover separation maintenance?', a: 'Not for the future. Section 1361(4) BGB applies section 1614 BGB, which makes any waiver of future maintenance void. A clause excluding separation maintenance therefore has no effect, wherever the agreement was signed, if German law governs the claim. Waivers of post-divorce maintenance are treated differently and can be valid. Which law applies to an international marriage is a separate question.' },
      { q: 'Can I claim separation maintenance for months that have already passed?', a: 'Only from the first day of the month in which you asked the other spouse for information about their income, formally demanded payment, or a court application was served (section 1613 BGB, applied through section 1360a(3)). Months before that are lost. This is why a written request for income details is usually the first step, often sent by a lawyer or by the claimant directly.' },
      { q: 'What happens to separation maintenance on the day of the divorce?', a: `It stops when the divorce decree becomes final. From then on only post-divorce maintenance can be claimed, which requires a specific ground such as childcare, age or an income gap and is a separate claim with its own court order. In the example above, the ${EN.eur(mitKindern.unterhalt, 2)} would end that day unless the court or the spouses set a new amount.` },
    ],
    body: (h) => `<h2>Separated but still married</h2>
<p>In Germany a divorce normally requires a separation year under ${h.src('bgb1565', 'section 1565 BGB')}, and court proceedings often add many months. For this period ${h.src('bgb1361', 'section 1361 BGB')} gives the financially weaker spouse a claim to maintenance appropriate to the couple’s living standard and to both spouses’ income and assets.</p>
<p>Spouses live apart when there is no shared household and one of them clearly does not want to restore it (section 1567 BGB). That can happen under one roof. For expats this date matters twice: it starts the separation year and the maintenance claim.</p>
<h2>Why it is easier to claim than post-divorce maintenance</h2>
<p>After divorce, German law expects self-reliance and only grants maintenance on specific grounds. Before the divorce is final, the marriage still binds both spouses. An income gap is enough, and:</p>
<ul>
<li>the ${h.src('olgLeitlinien', 'NRW court guidelines')} see no duty to start or increase work during the first year of separation;</li>
<li>afterwards, a spouse who did not work can only be told to earn money if that is reasonable given past employment, length of marriage and finances (section 1361(2));</li>
<li>the short-marriage reason for refusing maintenance (section 1579 no. 1) does not apply during separation; only the other grounds of section 1579 do.</li>
</ul>
<h2>Children first, then the spouse</h2>
<p>The formula is the one used for ${h.a('ehegattenunterhalt', 'spousal maintenance')}: ${h.pct(h.P.ehegatte.quote_erwerb)} of the gap between adjusted earned incomes under note B of the ${h.src('olgDtPdf', '2026 Düsseldorf Table')}. ${h.a('kindesunterhalt', 'Child support')} comes off first, because minor children rank above spouses under ${h.src('bgb1609', 'section 1609 BGB')}.</p>
${h.table(['Household', 'Payer net', 'Child support', 'Spouse net', 'Separation maintenance'], [
  ['no children', h.eur(4400), h.eur(0), h.eur(600), h.eur(ohneKinder.unterhalt)],
  ['two children, 2 and 7', h.eur(4400), h.eur(kinder.summe), h.eur(600), h.eur(mitKindern.unterhalt, 2)],
  ['one child, 1', h.eur(2900), h.eur(klein.summe, 2), h.eur(0), `${h.eur(eng.unterhalt, 2)} (capped)`],
], 'Computed by the site’s engine, working payer, 2026 child support amounts', ['l', 'r', 'r', 'r', 'r'])}
<p>The children reduce the separation maintenance by ${h.eur(ohneKinder.unterhalt - mitKindern.unterhalt, 2)} in the second line. In the third, the formula would give ${h.eur(eng.quote, 2)}, but the payer must keep his ${h.a('selbstbehalt', 'self-retention')} of ${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)}, so the claim shrinks to ${h.eur(eng.unterhalt, 2)}.</p>
<h2>The family home, pensions and extra costs</h2>
<p>The spouse who stays in a jointly owned home saves rent, and that saving counts as income. During separation the guidelines usually take only a reasonable notional rent, as long as selling or letting cannot be expected; from service of the divorce petition the full market rent may count. Once divorce proceedings are pending, the claim also covers contributions for old-age provision (section 1361(1)). Extra costs caused by the separation, such as a second rent, are added only exceptionally. Payment is monthly in advance.</p>
<h2>No waiver and no claim for the past without a request</h2>
<p>Through section 1361(4) and section 1360a(3), two rules from relatives’ maintenance apply. Section 1614 makes a waiver of future maintenance void. Section 1613 limits back payments to the period from the month of a request for income information, a formal demand or service of a court application. A spouse without money for proceedings may in fairness ask the other for an advance on legal costs (section 1360a(4)); state legal aid also exists. Court and lawyer fees are shown under ${h.a('unterhaltsverfahren-kosten', 'cost of maintenance proceedings')}, divorce fees under ${h.a('scheidungskosten', 'divorce costs')}.</p>
<h2>The end: the final divorce decree</h2>
<p>Separation maintenance ends on the day the divorce becomes final. Post-divorce maintenance is a separate claim with stricter conditions, and an order for separation maintenance does not carry over. Reconciliation and moving back together also end it. To test your own figures, use the ${h.a('trennungsunterhalt-rechner', 'separation maintenance calculator')}.</p>
<p>This page is general information on German separation maintenance as of 2026, not legal advice; disputes about amount, duty to work or housing value are decided by the family court (Familiengericht).</p>`,
  },
});
