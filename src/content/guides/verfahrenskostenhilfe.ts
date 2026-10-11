import { defineGuide } from '../../lib/guide-types';
import { pkh, scheidungskosten } from '../../lib/engine/kosten';
import { P, DE, EN } from '../../lib/fmt';

const K = P.pkh;
/** Beispiele aus dem Motor, nie von Hand. */
/** Alleinerziehende Mutter, 1.500 € netto mit Kindergeld, Kind 4 Jahre, Warmmiete 600 €. */
const mutter = pkh({ netto: 1500, erwerbstaetig: true, kinder: [4], wohnkosten: 600 });
/** Alleinstehender Angestellter, 2.400 € netto, Warmmiete 800 €. */
const single = pkh({ netto: 2400, erwerbstaetig: true, wohnkosten: 800 });
/** Vater mit zwei Kindern (9 und 15) im Haushalt, 2.000 € netto, Warmmiete 700 €. */
const vater = pkh({ netto: 2000, erwerbstaetig: true, kinder: [9, 15], wohnkosten: 700 });
/** Was die Scheidung des Angestellten kosten würde (Ehefrau 1.500 € netto, zwei Anrechte, zwei Anwälte). */
const kosten = scheidungskosten({ netto1: 2400, netto2: 1500, anrechte: 2, anwaelte: 2 });
const vierRaten = 4 * single.rate;

export default defineGuide({
  id: 'verfahrenskostenhilfe',
  group: 'scheidung',
  order: 48,
  mini: 'pkhFrei',
  related: ['prozesskostenhilfe-rechner', 'scheidungskosten', 'anwaltskosten-scheidung', 'gerichtskosten-scheidung', 'unterhaltsverfahren-kosten'],
  sources: ['zpo115', 'pkhb2026', 'famfg114', 'bgb1565'],
  de: {
    slug: 'verfahrenskostenhilfe',
    nav: 'Verfahrenskostenhilfe',
    card: 'Prozesskostenhilfe im Familienrecht 2026: Freibeträge, Raten, 48 Monate, Erfolgsaussicht und Antrag.',
    title: 'Prozesskostenhilfe 2026: Verfahrenskostenhilfe Scheidung',
    description: `Prozesskostenhilfe und Verfahrenskostenhilfe 2026: Freibeträge ${DE.eur(K.partei)} und ${DE.eur(K.erwerbstaetige)}, Kinder ab ${DE.eur(K.kinder_bis_6)}, Raten nach § 115 ZPO, höchstens ${DE.num(K.max_raten)} Monate lang zu zahlen.`,
    h1: 'Verfahrenskostenhilfe und Prozesskostenhilfe 2026',
    intro: 'Wer eine Scheidung oder ein Unterhaltsverfahren nicht bezahlen kann, bekommt die Kosten vom Staat, ganz oder gegen Raten.',
    resume: `Prozesskostenhilfe heißt in Familiensachen Verfahrenskostenhilfe; sie richtet sich nach denselben Regeln der §§ 114 ff. ZPO. Vom Nettoeinkommen werden 2026 nach der Prozesskostenhilfebekanntmachung ${DE.eur(K.partei)} für den Antragsteller abgezogen, ${DE.eur(K.erwerbstaetige)} zusätzlich bei Erwerbstätigkeit, ${DE.eur(K.ehegatte)} für einen unterhaltsberechtigten Ehegatten und je Kind zwischen ${DE.eur(K.kinder_bis_6)} und ${DE.eur(K.erwachsene)} nach Alter, außerdem die Kosten für Unterkunft und Heizung. Bleibt danach weniger als ${DE.eur(2 * K.rate_mindest)} übrig, gibt es Hilfe ohne Raten. Sonst beträgt die Monatsrate die Hälfte des Rests, ab ${DE.eur(K.rate_schwelle)} einzusetzendem Einkommen ${DE.eur(K.rate_sockel)} plus alles darüber, und es sind höchstens ${K.max_raten} Raten zu zahlen (§ 115 ZPO). Eine alleinerziehende Mutter mit ${DE.eur(1500)} netto, einem Kind von vier Jahren und ${DE.eur(600)} Warmmiete zahlt nichts; ein alleinstehender Angestellter mit ${DE.eur(2400)} netto und ${DE.eur(800)} Warmmiete zahlt ${DE.eur(single.rate)} im Monat. Zusätzlich muss die Rechtsverfolgung hinreichende Aussicht auf Erfolg haben und darf nicht mutwillig sein; bei der Scheidung heißt das vor allem, dass das Trennungsjahr abgelaufen ist.`,
    faqs: [
      { q: 'Was ist der Unterschied zwischen Prozesskostenhilfe und Verfahrenskostenhilfe?', a: 'Nur der Name. Das Familienverfahrensgesetz spricht von Verfahren statt Prozess und von Beteiligten statt Parteien, deshalb heißt die Hilfe in Scheidungs-, Unterhalts- und Sorgerechtsverfahren Verfahrenskostenhilfe. Inhaltlich gelten die Vorschriften der Zivilprozessordnung über die Prozesskostenhilfe: dieselben Freibeträge, dieselbe Ratenberechnung, dieselbe Obergrenze von 48 Monatsraten und dasselbe Formular für die Erklärung über die wirtschaftlichen Verhältnisse.' },
      { q: 'Zählt das Kindergeld bei der Verfahrenskostenhilfe als Einkommen?', a: `Bei dem Elternteil, der es bezieht, in der Regel ja, deshalb gehört es ins Nettoeinkommen im Rechner. Im Gegenzug wird für jedes unterhaltsberechtigte Kind ein Freibetrag abgezogen, ${DE.eur(K.kinder_bis_6)} bis zum sechsten Geburtstag, ${DE.eur(K.kinder_7_14)} von 6 bis 13 Jahren und ${DE.eur(K.jugendliche_15_17)} von 14 bis 17 Jahren. Dieser Freibetrag mindert sich um eigenes Einkommen des Kindes, wozu auch Unterhalt des anderen Elternteils zählt.` },
      { q: 'Muss ich die Verfahrenskostenhilfe später zurückzahlen?', a: `Nur über die festgesetzten Raten, und höchstens ${K.max_raten} davon, auch wenn die Kosten höher sind. Verbessern sich Ihre Verhältnisse wesentlich, kann das Gericht die Entscheidung bis vier Jahre nach Ende des Verfahrens ändern und Raten festsetzen oder erhöhen (§ 120a ZPO); eine wesentliche Verbesserung und jeden Umzug müssen Sie von sich aus mitteilen. Ohne Raten bewilligte Hilfe bleibt sonst kostenfrei.` },
      { q: 'Bekomme ich Verfahrenskostenhilfe, wenn mein Ehegatte gut verdient?', a: 'Möglicherweise nicht. Ein Ehegatte, der die Kosten eines Verfahrens in einer persönlichen Angelegenheit nicht tragen kann, hat nach § 1360a Abs. 4 BGB gegen den anderen Anspruch auf einen Verfahrenskostenvorschuss, soweit das der Billigkeit entspricht. Viele Gerichte verlangen, dass dieser Anspruch vorrangig geltend gemacht wird, bevor der Staat einspringt. Ob er im Einzelfall durchsetzbar ist, prüft das Gericht.' },
      { q: 'Welches Vermögen muss ich vor der Verfahrenskostenhilfe einsetzen?', a: 'Vermögen ist einzusetzen, soweit das zumutbar ist (§ 115 Abs. 3 ZPO). Geschützt ist, was auch im Sozialhilferecht nach § 90 SGB XII geschützt ist: ein kleiner Barbetrag je Person, angemessener Hausrat und in der Regel ein angemessenes selbst bewohntes Haus. Größere Ersparnisse, ein zweites Auto oder Wertpapiere können dagegen verlangt werden. Gibt es eine Zugewinnforderung, kann sie ebenfalls als Vermögen zählen.' },
      { q: 'Wann lehnt das Gericht Verfahrenskostenhilfe trotz geringem Einkommen ab?', a: 'Wenn die Rechtsverfolgung keine hinreichende Aussicht auf Erfolg hat oder mutwillig erscheint (§ 114 ZPO), etwa ein Scheidungsantrag lange vor Ablauf des Trennungsjahres ohne Härtegründe. Außerdem wird die Hilfe nach § 115 Abs. 4 ZPO nicht bewilligt, wenn die Kosten voraussichtlich vier Monatsraten nicht übersteigen. Fehlen Belege zum Formular, kann das Gericht den Antrag ebenfalls ablehnen.' },
    ],
    body: (h) => `<h2>Wer Anspruch hat</h2>
<p>Verfahrenskostenhilfe bekommt, wer die Kosten eines Familienverfahrens nach seinen persönlichen und wirtschaftlichen Verhältnissen nicht, nur zum Teil oder nur in Raten aufbringen kann. Dazu kommen zwei weitere Bedingungen: Die Rechtsverfolgung muss hinreichende Aussicht auf Erfolg haben, und sie darf nicht mutwillig sein. Für die Scheidung bedeutet das vor allem, dass die Ehe nach ${h.src('bgb1565', '§ 1565 BGB')} gescheitert sein muss; in der Regel wird das nach dem Trennungsjahr von ${h.num(h.P.scheidung.trennungsjahr_monate)} Monaten angenommen.</p>
<p>Die Hilfe deckt die eigenen Gerichtskosten und den eigenen Anwalt. In Ehesachen ordnet das Gericht einen Anwalt bei, weil dort Anwaltszwang herrscht (${h.src('famfg114', '§ 114 FamFG')}). Nicht gedeckt sind Kosten, die man dem Gegner erstatten muss; in Scheidungssachen spielt das wegen der Kostenaufhebung kaum eine Rolle.</p>
<h2>Die Freibeträge 2026</h2>
<p>Nach ${h.src('zpo115', '§ 115 ZPO')} wird das einzusetzende Einkommen so ermittelt: Vom Nettoeinkommen gehen Freibeträge ab, deren Höhe das Bundesjustizministerium jedes Jahr bekannt macht. Für 2026 gelten die Beträge der ${h.src('pkhb2026', 'Prozesskostenhilfebekanntmachung 2026')}:</p>
${h.table(['Freibetrag', 'Monat'], [
  ['Antragsteller', h.eur(h.P.pkh.partei)],
  ['zusätzlich bei Erwerbstätigkeit', h.eur(h.P.pkh.erwerbstaetige)],
  ['unterhaltsberechtigter Ehegatte', h.eur(h.P.pkh.ehegatte)],
  ['Kind bis 5 Jahre', h.eur(h.P.pkh.kinder_bis_6)],
  ['Kind von 6 bis 13 Jahren', h.eur(h.P.pkh.kinder_7_14)],
  ['Jugendlicher von 14 bis 17 Jahren', h.eur(h.P.pkh.jugendliche_15_17)],
  ['Erwachsener Unterhaltsberechtigter', h.eur(h.P.pkh.erwachsene)],
], 'Freibeträge nach § 115 Abs. 1 ZPO, Prozesskostenhilfebekanntmachung 2026', ['l', 'r'])}
<p>Hinzu kommen die tatsächlichen Kosten für Unterkunft und Heizung, solange sie nicht in auffälligem Missverhältnis zu den Lebensverhältnissen stehen, Mehrbedarfe und angemessene besondere Belastungen, etwa Kreditraten oder gezahlter Unterhalt. Die Freibeträge für Ehegatten und Kinder mindern sich um deren eigenes Einkommen.</p>
<h2>Von der Rate zur Gesamtsumme</h2>
<p>Was nach allen Abzügen übrig bleibt, ist das einzusetzende Einkommen. Bis ${h.eur(h.P.pkh.rate_schwelle)} beträgt die Monatsrate die Hälfte davon. Darüber sind es ${h.eur(h.P.pkh.rate_sockel)} plus der volle Betrag über ${h.eur(h.P.pkh.rate_schwelle)}. Abgerundet wird auf volle Euro; eine Rate unter ${h.eur(h.P.pkh.rate_mindest)} wird nicht festgesetzt. Unabhängig von der Zahl der Instanzen sind höchstens ${h.num(h.P.pkh.max_raten)} Monatsraten zu zahlen, und nie mehr als die tatsächlichen Kosten.</p>
${h.table(['Haushalt', 'Netto', 'Einzusetzen', 'Monatsrate'], [
  ['Mutter, Kind 4 Jahre, Miete 600 €', h.eur(1500), h.eur(mutter.einzusetzen), mutter.ratenfrei ? 'keine' : h.eur(mutter.rate)],
  ['Vater, Kinder 9 und 15 Jahre, Miete 700 €', h.eur(2000), h.eur(vater.einzusetzen), vater.ratenfrei ? 'keine' : h.eur(vater.rate)],
  ['alleinstehend, Miete 800 €', h.eur(2400), h.eur(single.einzusetzen), single.ratenfrei ? 'keine' : h.eur(single.rate)],
], 'Alle erwerbstätig, Miete warm; vom Prozesskostenhilfe-Rechner ermittelt', ['l', 'r', 'r', 'r'])}
<h2>Lohnt sich der Antrag?</h2>
<p>Bei Raten lohnt sich der Antrag nicht immer. Nach § 115 Abs. 4 ZPO wird Verfahrenskostenhilfe nicht bewilligt, wenn die Kosten voraussichtlich vier Monatsraten nicht übersteigen. Der alleinstehende Angestellte aus der Tabelle hätte bei einer Scheidung mit zwei Anwälten und einer Ehefrau mit ${h.eur(1500)} netto eigene Kosten von ${h.eur(kosten.antragsteller, 2)}. Vier seiner Raten ergeben ${h.eur(vierRaten)}. ${kosten.antragsteller > vierRaten ? 'Die Kosten liegen darüber, die Hilfe käme also in Betracht; er würde die Kosten dann über einige Monate in Raten an die Staatskasse abzahlen, statt den Anwalt auf einmal zu bezahlen.' : 'Die Kosten liegen darunter, die Hilfe würde also abgelehnt.'} Was eine Scheidung kostet, zeigt die Seite ${h.a('scheidungskosten', 'Scheidungskosten')}.</p>
<h2>Antrag und Unterlagen</h2>
<ul>
<li>Antrag beim Familiengericht, in der Regel zusammen mit dem Scheidungsantrag durch den Anwalt,</li>
<li>amtliches Formular „Erklärung über die persönlichen und wirtschaftlichen Verhältnisse“, vollständig ausgefüllt,</li>
<li>Belege: Lohnabrechnungen, Mietvertrag mit Nebenkosten, Kontoauszüge, Nachweise über Kredite und Unterhalt.</li>
</ul>
<p>Ist die Hilfe bewilligt, muss für das Verfahren kein Gerichtskostenvorschuss gezahlt werden, und der beigeordnete Anwalt rechnet mit der Staatskasse ab. Die Raten gehen an die Staatskasse, nicht an den Anwalt. Bis vier Jahre nach Ende des Verfahrens kann das Gericht die Verhältnisse erneut prüfen; Verbesserungen und Umzüge sind von sich aus mitzuteilen.</p>
<h2>Vorrang des Verfahrenskostenvorschusses</h2>
<p>Unter Ehegatten gibt es eine Besonderheit: Wer ein Verfahren in einer persönlichen Angelegenheit nicht bezahlen kann, hat nach § 1360a Abs. 4 BGB gegen den anderen Ehegatten Anspruch auf einen Kostenvorschuss, soweit das der Billigkeit entspricht. Viele Gerichte prüfen diesen Anspruch vor der Verfahrenskostenhilfe. Ob er greift, hängt von Einkommen und Vermögen des anderen Ehegatten ab.</p>
<p>Ihre eigene Rate berechnen Sie im ${h.a('prozesskostenhilfe-rechner', 'Prozesskostenhilfe-Rechner')}; wie sich die Anwaltsvergütung zusammensetzt, steht bei den ${h.a('anwaltskosten-scheidung', 'Anwaltskosten')}. Diese Seite fasst die Regeln der Verfahrenskostenhilfe allgemein zusammen und ist keine Rechtsberatung; ob und mit welchen Raten Hilfe bewilligt wird, entscheidet das Familiengericht.</p>`,
  },
  en: {
    slug: 'legal-aid',
    nav: 'Legal aid',
    card: 'State legal aid for German family cases in 2026: allowances, instalments, 48 months, prospects and application.',
    title: 'Legal Aid in Germany 2026: Divorce and Family Court Cases',
    description: `Legal aid for German divorce and family cases in 2026: allowances of ${EN.eur(K.partei)} and ${EN.eur(K.erwerbstaetige)}, children from ${EN.eur(K.kinder_bis_6)}, monthly instalments, payable for at most ${EN.num(K.max_raten)} months.`,
    h1: 'Legal aid for divorce and family cases in Germany, 2026',
    intro: 'If you cannot afford a divorce or a maintenance case, the German state pays, in full or against monthly instalments.',
    resume: `In German family cases, state legal aid is called Verfahrenskostenhilfe; elsewhere it is Prozesskostenhilfe, and both follow sections 114 onwards of the Code of Civil Procedure (ZPO). Under the 2026 legal aid notice (Prozesskostenhilfebekanntmachung), the court deducts from your net income ${EN.eur(K.partei)} for yourself, ${EN.eur(K.erwerbstaetige)} more if you work, ${EN.eur(K.ehegatte)} for a dependent spouse and between ${EN.eur(K.kinder_bis_6)} and ${EN.eur(K.erwachsene)} per child by age, plus rent and heating. If less than ${EN.eur(2 * K.rate_mindest)} remains, aid is granted without instalments. Otherwise the monthly instalment is half of what remains, or ${EN.eur(K.rate_sockel)} plus everything above ${EN.eur(K.rate_schwelle)} once that threshold is passed, and you pay at most ${K.max_raten} instalments (section 115 ZPO). A single mother on ${EN.eur(1500)} with a four-year-old and ${EN.eur(600)} rent pays nothing; a single employee on ${EN.eur(2400)} with ${EN.eur(800)} rent pays ${EN.eur(single.rate)} a month. The case must also have reasonable prospects of success and not be frivolous; for a divorce this mainly means the year of separation has passed.`,
    faqs: [
      { q: 'Can I get German legal aid if part of my income comes from abroad?', a: 'Yes, but all income counts, wherever it is paid. The official declaration of personal and financial circumstances asks for every source, including foreign salary, rental income or pensions, and for assets abroad. Convert amounts into euros and attach proof. Leaving foreign income out can lead to the grant being cancelled later and the full costs being charged.' },
      { q: 'Does child benefit count as income for German legal aid?', a: `For the parent who receives it, generally yes, so include it in net income in the calculator. In return, an allowance is deducted for each dependent child: ${EN.eur(K.kinder_bis_6)} up to age five, ${EN.eur(K.kinder_7_14)} from six to thirteen, ${EN.eur(K.jugendliche_15_17)} from fourteen to seventeen. That allowance shrinks by the child’s own income, which includes maintenance paid by the other parent.` },
      { q: 'Do I have to pay legal aid back later?', a: `Only through the instalments set, and never more than ${K.max_raten} of them, even if the costs are higher. If your situation improves significantly, the court can revise the decision for up to four years after the case ends (section 120a ZPO) and set or raise instalments. You must report a significant improvement and any change of address on your own initiative.` },
      { q: 'Will I get legal aid if my spouse earns well?', a: 'Possibly not. Under section 1360a(4) of the Civil Code (BGB), a spouse who cannot afford proceedings in a personal matter can claim an advance on costs from the other spouse, where fair. Many courts expect this claim to be pursued before the state steps in. Whether it can realistically be enforced, for example against a spouse living abroad, is for the court to assess.' },
      { q: 'Which savings must I use before legal aid applies?', a: 'Assets must be used where this is reasonable (section 115(3) ZPO). Protected is what social assistance law protects under section 90 SGB XII: a small cash amount per person, reasonable household goods and usually a reasonable home you live in. Larger savings, a second car or securities may have to be used first. A claim to a share of accrued gains can count as an asset too.' },
      { q: 'Why might a family court refuse legal aid despite a low income?', a: 'If the case lacks reasonable prospects of success or seems frivolous (section 114 ZPO), for instance a divorce application filed long before the year of separation is over without hardship grounds. Aid is also refused under section 115(4) ZPO if the costs are not expected to exceed four monthly instalments. Missing documents for the declaration can also lead to refusal.' },
    ],
    body: (h) => `<h2>Who qualifies</h2>
<p>Legal aid is available to anyone who, given their personal and financial circumstances, cannot pay the costs of family proceedings, or can pay only part or only in instalments. Two more conditions apply: the case must have reasonable prospects of success, and it must not be frivolous. For a divorce this mostly means the marriage has broken down under ${h.src('bgb1565', 'section 1565 BGB')}, which is normally presumed after a separation of ${h.num(h.P.scheidung.trennungsjahr_monate)} months.</p>
<p>Aid covers your own court fees and your own lawyer. In divorce cases the court assigns a lawyer, because representation is compulsory (${h.src('famfg114', 'section 114 FamFG')}). Costs you might have to reimburse to the other side are not covered, but in a divorce they hardly arise since costs are set off.</p>
<h2>The 2026 allowances</h2>
<p>Under ${h.src('zpo115', 'section 115 ZPO')} the court deducts allowances from net income. The Federal Ministry of Justice publishes them each year; for 2026 the ${h.src('pkhb2026', '2026 legal aid notice')} sets:</p>
${h.table(['Allowance', 'Monthly'], [
  ['applicant', h.eur(h.P.pkh.partei)],
  ['extra if working', h.eur(h.P.pkh.erwerbstaetige)],
  ['dependent spouse', h.eur(h.P.pkh.ehegatte)],
  ['child up to 5', h.eur(h.P.pkh.kinder_bis_6)],
  ['child aged 6 to 13', h.eur(h.P.pkh.kinder_7_14)],
  ['teenager aged 14 to 17', h.eur(h.P.pkh.jugendliche_15_17)],
  ['adult dependant', h.eur(h.P.pkh.erwachsene)],
], 'Allowances under section 115(1) ZPO, 2026 legal aid notice', ['l', 'r'])}
<p>Actual rent and heating costs are deducted as well, unless they are strikingly out of line with your circumstances, together with additional needs and reasonable special burdens such as loan repayments or maintenance you pay. The allowances for a spouse or child are reduced by their own income.</p>
<h2>From instalment to total</h2>
<p>What is left after all deductions is the income to be used. Up to ${h.eur(h.P.pkh.rate_schwelle)}, the monthly instalment is half of it; above that it is ${h.eur(h.P.pkh.rate_sockel)} plus the full amount over ${h.eur(h.P.pkh.rate_schwelle)}. The result is rounded down to whole euros, and an instalment under ${h.eur(h.P.pkh.rate_mindest)} is not set. However many court levels are involved, you pay at most ${h.num(h.P.pkh.max_raten)} instalments and never more than the actual costs.</p>
${h.table(['Household', 'Net', 'To be used', 'Instalment'], [
  ['mother, child aged 4, rent €600', h.eur(1500), h.eur(mutter.einzusetzen), mutter.ratenfrei ? 'none' : h.eur(mutter.rate)],
  ['father, children 9 and 15, rent €700', h.eur(2000), h.eur(vater.einzusetzen), vater.ratenfrei ? 'none' : h.eur(vater.rate)],
  ['single, rent €800', h.eur(2400), h.eur(single.einzusetzen), single.ratenfrei ? 'none' : h.eur(single.rate)],
], 'All working, rent including heating; computed by the legal aid calculator', ['l', 'r', 'r', 'r'])}
<h2>Is it worth applying?</h2>
<p>With instalments, not always. Section 115(4) ZPO excludes legal aid where costs are not expected to exceed four monthly instalments. The single employee above, divorcing a wife on ${h.eur(1500)} with a lawyer each, would bear ${h.eur(kosten.antragsteller, 2)} himself. Four of his instalments make ${h.eur(vierRaten)}. ${kosten.antragsteller > vierRaten ? 'The costs are higher, so aid is possible; he would then pay the state in monthly instalments instead of paying the lawyer in one go.' : 'The costs are lower, so aid would be refused.'} The ${h.a('scheidungskosten', 'divorce costs')} page explains the bill.</p>
<h2>Application and documents</h2>
<ul>
<li>an application to the family court (Familiengericht), usually filed by your lawyer together with the divorce application,</li>
<li>the official form “Declaration of personal and financial circumstances” (Erklärung über die persönlichen und wirtschaftlichen Verhältnisse), completed in full,</li>
<li>proof: payslips, tenancy agreement with service charges, bank statements, evidence of loans and maintenance; documents in other languages may need a translation.</li>
</ul>
<p>Once aid is granted, no advance on court fees is required and the assigned lawyer bills the state. Instalments go to the state treasury, not to the lawyer. For four years after the case ends the court may review your circumstances again.</p>
<h2>The spouse comes first</h2>
<p>Between spouses there is a twist: under section 1360a(4) BGB a spouse who cannot afford proceedings in a personal matter can claim an advance on costs from the other spouse, where fair. Many courts check this before granting legal aid, so a well-off spouse can make aid unavailable.</p>
<p>Work out your own instalment with the ${h.a('prozesskostenhilfe-rechner', 'legal aid calculator')}; lawyer billing is covered under ${h.a('anwaltskosten-scheidung', 'lawyer fees')}. This page summarises German legal aid rules in general and is not legal advice; the family court decides whether aid is granted and with which instalments.</p>`,
  },
});
