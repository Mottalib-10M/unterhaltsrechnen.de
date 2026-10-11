import { defineGuide } from '../../lib/guide-types';
import { kindesunterhalt, zahlbetrag, bedarf, kgAnteil, gruppeVonBis, GRUPPEN, type Stufe } from '../../lib/engine/dt';
import { P, DE, EN } from '../../lib/fmt';

/** Die ganze Zahlbetragstabelle 2026 aus dem Motor (15 Gruppen × 4 Altersstufen) und zwei Leseproben. */
const STUFEN: Stufe[] = [0, 1, 2, 3];
const zeilen = Array.from({ length: GRUPPEN }, (_, g) => ({ g, von: gruppeVonBis(g)[0], bis: gruppeVonBis(g)[1], z: STUFEN.map((s) => zahlbetrag(g, s)), pz: P.dt.prozent[g] }));
const probe = kindesunterhalt(3450, [{ alter: 5 }, { alter: 13 }]);
const KG = P.kindergeld.monat;
const AS = P.dt.altersstufen;
/** Rundungsprobe nach § 1612a Abs. 2 Satz 2 BGB: Mindestbedarf × Prozentsatz, aufgerundet. */
const g6roh = (P.mindestunterhalt.stufen[0] * P.dt.prozent[5]) / 100;
const g6 = Math.ceil(g6roh);
const minderj17 = zahlbetrag(0, 2);
const volljaehrig = zahlbetrag(0, 3);

export default defineGuide({
  id: 'zahlbetragstabelle',
  group: 'kind',
  order: 12,
  mini: 'zahlbetrag',
  related: ['duesseldorfer-tabelle-aenderungen', 'kindesunterhalt', 'kindergeld-anrechnung', 'bedarfskontrollbetrag', 'kindesunterhalt-rechner', 'mindestunterhalt'],
  sources: ['olgDtPdf', 'bgb1612b', 'bgb1612a', 'olgLeitlinien'],
  de: {
    slug: 'zahlbetragstabelle',
    nav: 'Zahlbetragstabelle 2026',
    card: 'Alle 60 Zahlbeträge der Düsseldorfer Tabelle 2026 nach Abzug des Kindergeldes, mit Leseanleitung.',
    title: 'Zahlbetragstabelle 2026: was Eltern wirklich überweisen',
    description: `Zahlbetragstabelle 2026 der Düsseldorfer Tabelle: alle 15 Gruppen und 4 Altersstufen nach Abzug des Kindergeldes von ${DE.eur(KG)}, von ${DE.eur(zahlbetrag(0, 0), 2)} bis ${DE.eur(zahlbetrag(14, 2), 2)}.`,
    h1: 'Zahlbeträge der Düsseldorfer Tabelle 2026',
    intro: 'Die Tabelle, nach der tatsächlich überwiesen wird: Bedarf minus Kindergeldanteil, für jede Gruppe und jedes Alter.',
    resume: `Die Zahlbetragstabelle ist der Anhang der Düsseldorfer Tabelle 2026 und zeigt, was ein barunterhaltspflichtiger Elternteil monatlich tatsächlich überweist. Sie entsteht aus dem Tabellenbedarf minus Kindergeldanteil: Bei minderjährigen Kindern wird die Hälfte des Kindergeldes von ${DE.eur(KG)} abgezogen, also ${DE.eur(KG / 2, 2)}, bei volljährigen das ganze. In Gruppe 1, bis ${DE.eur(P.dt.gruppen_bis[0])} bereinigtes Netto, betragen die Zahlbeträge ${DE.eur(zahlbetrag(0, 0), 2)}, ${DE.eur(zahlbetrag(0, 1), 2)}, ${DE.eur(zahlbetrag(0, 2), 2)} und ${DE.eur(zahlbetrag(0, 3), 2)} für die vier Altersstufen. In der höchsten Gruppe 15, bis ${DE.eur(P.dt.gruppen_bis[14])}, reichen sie von ${DE.eur(zahlbetrag(14, 0), 2)} bis ${DE.eur(zahlbetrag(14, 2), 2)}. Wer die Tabelle liest, sucht zuerst die Zeile nach dem bereinigten Nettoeinkommen und dann die Spalte nach dem Alter des Kindes. Bei mehreren Kindern muss danach geprüft werden, ob dem Zahlenden der Bedarfskontrollbetrag der Gruppe bleibt; sonst gilt eine niedrigere Zeile. Die Prozentspalte zeigt, wie viel Prozent des Mindestunterhalts die Zeile ausmacht.`,
    faqs: [
      { q: 'Warum ist der Zahlbetrag ab 18 niedriger als mit 17?', a: `Weil ab der Volljährigkeit das volle Kindergeld von ${DE.eur(KG)} vom Bedarf abgeht statt der Hälfte. In Gruppe 1 sinkt der Zahlbetrag dadurch von ${DE.eur(minderj17, 2)} auf ${DE.eur(volljaehrig, 2)}, obwohl der Bedarf steigt. Hinzu kommt, dass bei Volljährigen beide Eltern anteilig haften, sodass der Wert der letzten Spalte meist auf beide verteilt wird.` },
      { q: 'Gilt die Zahlbetragstabelle 2026 in allen Bundesländern?', a: `Die Düsseldorfer Tabelle wird von allen Oberlandesgerichten angewandt, weil sie in Koordinierungsgesprächen aller Oberlandesgerichte entsteht. Die Leitlinien zur Einkommensberechnung unterscheiden sich dagegen von Bezirk zu Bezirk. Der Zahlbetrag einer bestimmten Zeile ist also überall gleich; in welche Zeile ein Einkommen fällt, kann je nach Gericht leicht abweichen.` },
      { q: 'Was bedeutet die Prozentspalte in der Zahlbetragstabelle?', a: `Sie nennt den Anteil am Mindestunterhalt, den die Gruppe verlangt: ${DE.num(P.dt.prozent[0])} % in Gruppe 1 bis ${DE.num(P.dt.prozent[14])} % in Gruppe 15. Ein Titel kann den Unterhalt so festlegen, etwa „${DE.num(P.dt.prozent[4])} % des Mindestunterhalts der jeweiligen Altersstufe abzüglich des hälftigen Kindergeldes“. Dann steigt der Betrag von selbst, wenn das Kind älter wird oder der Mindestunterhalt sich ändert.` },
      { q: 'Wie lese ich die Zahlbetragstabelle bei zwei Kindern unterschiedlichen Alters?', a: `Beide Kinder stehen in derselben Zeile, jedes in seiner eigenen Altersspalte. Die Beträge werden addiert. Danach kommt die Gegenprobe: Bleibt Ihnen nach beiden Zahlbeträgen weniger als der Bedarfskontrollbetrag dieser Zeile, wechseln Gerichte meist eine Zeile tiefer, und zwar für beide Kinder. Unter den notwendigen Selbstbehalt dürfen Sie dabei nicht fallen.` },
      { q: 'Warum stehen in der Zahlbetragstabelle halbe Euro-Beträge?', a: `Weil das halbe Kindergeld ${DE.eur(KG / 2, 2)} beträgt. Der Tabellenbedarf selbst ist immer auf volle Euro aufgerundet (§ 1612a Abs. 2 Satz 2 BGB), der Abzug aber nicht. Gezahlt wird der Betrag mit Cent, so wie er in der Zeile steht; eine weitere Rundung sieht die Tabelle nicht vor.` },
      { q: 'Gilt ein alter Unterhaltstitel neben der Zahlbetragstabelle 2026 weiter?', a: `Ja. Ein Titel über einen festen Betrag bleibt gültig, bis er geändert wird, auch wenn die neue Zeile mehr ergibt. Das Kind kann dann eine Anpassung verlangen, etwa durch eine neue Jugendamtsurkunde oder ein Abänderungsverfahren beim Familiengericht. Lautet der Titel auf einen Prozentsatz des Mindestunterhalts, ergibt sich der Betrag für 2026 ohne weiteren Schritt.` },
    ],
    body: (h) => `<h2>Die vollständige Zahlbetragstabelle 2026</h2>
<p>Die folgende Tabelle ist mit dem Rechenmotor dieser Seite aus dem Bedarf der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} und dem Kindergeld von ${h.eur(h.P.kindergeld.monat)} berechnet. Sie deckt sich Zeile für Zeile mit dem amtlichen Anhang.</p>
${h.table(['Gruppe', 'Bereinigtes Netto', `${AS[0][0]}–${AS[0][1]} J.`, `${AS[1][0]}–${AS[1][1]} J.`, `${AS[2][0]}–${AS[2][1]} J.`, `ab ${AS[3][0]}`, '%'], zeilen.map((r) => [String(r.g + 1), r.g === 0 ? `bis ${h.eur(r.bis)}` : `${h.eur(r.von)} bis ${h.eur(r.bis)}`, ...r.z.map((x) => h.eur(x, 2)), `${h.num(r.pz)} %`]), 'Monatliche Zahlbeträge nach Abzug des Kindergeldanteils, Stand 1. Januar 2026', ['l', 'l', 'r', 'r', 'r', 'r', 'r'])}
<h2>So lesen Sie eine Zeile</h2>
<p>Erstens: die Zeile. Maßgeblich ist das bereinigte Nettoeinkommen des Elternteils, der nicht betreut, nicht sein Bruttolohn und nicht das Netto laut Gehaltszettel. Wie man dorthin kommt, erklärt die Seite zum ${h.a('bereinigtes-netto', 'bereinigten Nettoeinkommen')}.</p>
<p>Zweitens: die Spalte. Sie richtet sich nach dem Alter des Kindes am Monatsersten des Geburtstagsmonats. Ein Kind, das im Mai zwölf wird, rückt schon für den ganzen Mai in die dritte Spalte.</p>
<p>Drittens: die Kontrolle. Die Zahlen gelten unmittelbar nur für zwei Berechtigte. Bei mehr Kindern oder zusätzlichem Ehegattenunterhalt prüfen Gerichte den ${h.a('bedarfskontrollbetrag', 'Bedarfskontrollbetrag')} und stufen gegebenenfalls in eine niedrigere Gruppe herab. Bei nur einem Kind stufen manche Gerichte dagegen eine Gruppe höher ein.</p>
<h2>Ein Beispiel mit zwei Kindern</h2>
<p>Eine Mutter zahlt für zwei Kinder, die beim Vater leben. Ihr bereinigtes Netto beträgt ${h.eur(3450)}, die Kinder sind fünf und dreizehn Jahre alt. Der Motor ordnet sie Gruppe ${probe.gruppe + 1} zu. Das jüngere Kind steht in der ersten Spalte mit ${h.eur(probe.kinder[0].zahlbetrag, 2)}, das ältere in der dritten mit ${h.eur(probe.kinder[1].zahlbetrag, 2)}. Zusammen sind das ${h.eur(probe.summe, 2)}; ihr bleiben ${h.eur(probe.verbleibt, 2)}, mehr als der Bedarfskontrollbetrag von ${h.eur(probe.bkbWert)}. Die Zeile bleibt also stehen.</p>
<h2>Bedarf und Zahlbetrag: zwei verschiedene Zahlen</h2>
<p>Die eigentliche Düsseldorfer Tabelle nennt den Bedarf des Kindes. Der Zahlbetrag ist kleiner, weil das Kindergeld nach ${h.src('bgb1612b', '§ 1612b BGB')} einen Teil des Barbedarfs deckt. Wer nur die Bedarfstabelle kennt, rechnet deshalb zu hoch. Für jede Altersstufe in Gruppe 1 sieht der Unterschied so aus:</p>
${h.table(['Altersstufe', 'Bedarf', 'Kindergeldanteil', 'Zahlbetrag'], STUFEN.map((s) => [s === 3 ? `ab ${AS[3][0]}` : `${AS[s][0]} bis ${AS[s][1]} Jahre`, h.eur(bedarf(0, s)), h.eur(kgAnteil(s), 2), h.eur(zahlbetrag(0, s), 2)]), 'Gruppe 1, entspricht dem Mindestunterhalt bei Minderjährigen', ['l', 'r', 'r', 'r'])}
<p>Im Mangelfall nach Anmerkung C ist der Zahlbetrag auch der Einsatzbetrag, mit dem die verfügbare Masse auf die Kinder verteilt wird. Die Zahlbetragstabelle ist damit nicht nur Endergebnis, sondern auch Rechengröße im ${h.a('mangelfall', 'Mangelfall')}.</p>
<h2>Woher die Zahlen kommen</h2>
<p>Gruppe 1 ist der gesetzliche ${h.a('mindestunterhalt', 'Mindestunterhalt')}. Jede höhere Gruppe multipliziert ihn mit dem Prozentsatz der letzten Spalte und rundet auf volle Euro auf (${h.src('bgb1612a', '§ 1612a Abs. 2 BGB')}). Für Gruppe 6 und die erste Altersstufe ergibt ${h.eur(h.P.mindestunterhalt.stufen[0])} mal ${h.num(h.P.dt.prozent[5])} % rechnerisch ${h.eur(g6roh, 2)}; die Tabelle nennt aufgerundet ${h.eur(g6)}. Erst danach wird das Kindergeld abgezogen.</p>
<p>Die Zahlbetragstabelle ist auch Anhang der ${h.src('olgLeitlinien', 'Leitlinien NRW')}; dort regelt Nummer 14, dass bei Betreuung durch einen Elternteil die Hälfte des Kindergeldes angerechnet wird. Was sich gegenüber dem Vorjahr geändert hat, steht unter ${h.a('duesseldorfer-tabelle-aenderungen', 'Düsseldorfer Tabelle 2026: Änderungen')}.</p>
<h2>Häufige Lesefehler</h2>
<ul>
<li>Das Netto vom Gehaltszettel einsetzen: Fahrtkosten, Kreditraten oder zusätzliche Altersvorsorge können das maßgebliche Einkommen senken, Weihnachtsgeld und Steuererstattungen können es erhöhen.</li>
<li>Die Bedarfsspalte statt des Zahlbetrags überweisen: Dann fließt das halbe Kindergeld doppelt, denn der betreuende Elternteil bezieht es bereits von der Familienkasse.</li>
<li>Das Alter am Jahresende ablesen: Es zählt der Geburtstagsmonat, nicht das Kalenderjahr.</li>
<li>Bei volljährigen Kindern die letzte Spalte allein einem Elternteil zuschreiben: Ab ${h.num(AS[3][0])} tragen beide den Restbedarf nach ihren Einkommen.</li>
<li>Den alten Betrag weiterzahlen: Seit Januar 2026 gilt die neue Zeile, ein Festbetragstitel aus dem Vorjahr passt sich aber nicht von selbst an.</li>
</ul>
<h2>Grenzen der Tabelle</h2>
<ul>
<li>Über ${h.eur(h.P.dt.gruppen_bis[14])} bereinigtem Netto endet die Tabelle; der Bedarf wird dann konkret begründet.</li>
<li>Kranken- und Pflegeversicherung des Kindes sind nicht enthalten, wenn es nicht familienversichert ist.</li>
<li>Mehrbedarf wie Kita-Beiträge ohne Verpflegung kommt hinzu und wird nach den Einkommen beider Eltern geteilt.</li>
<li>Im Wechselmodell und bei auswärtiger Unterbringung gelten andere Rechenwege.</li>
</ul>
<p>Die Tabelle auf dieser Seite ist allgemeine Information zu den Zahlbeträgen 2026 und keine Rechtsberatung; welche Zeile in Ihrem Fall gilt, klären im Streit das Jugendamt oder das Familiengericht.</p>`,
  },
  en: {
    slug: 'payment-table',
    nav: 'Payment table 2026',
    card: 'All 60 net amounts of the 2026 Düsseldorf Table after child benefit, with a guide to reading them.',
    title: 'Düsseldorf Table 2026 Payment Amounts: Full Net Table',
    description: `The 2026 Düsseldorf Table payment amounts: all 15 income groups and 4 age bands after deducting the ${EN.eur(KG)} child benefit, ranging from ${EN.eur(zahlbetrag(0, 0), 2)} to ${EN.eur(zahlbetrag(14, 2), 2)}.`,
    h1: 'Net payment amounts of the 2026 Düsseldorf Table',
    intro: 'This is the grid that decides the monthly transfer: table need minus the child benefit share, for every income group and age.',
    resume: `The payment table (Zahlbetragstabelle) is the annex to the 2026 Düsseldorf Table and shows what a parent who owes cash support actually transfers each month. Each figure is the table need minus a child benefit share: for minors half of the ${EN.eur(KG)} child benefit (Kindergeld), ${EN.eur(KG / 2, 2)}, is deducted, for adult children all of it. In group 1, covering adjusted net income up to ${EN.eur(P.dt.gruppen_bis[0])}, the amounts are ${EN.eur(zahlbetrag(0, 0), 2)}, ${EN.eur(zahlbetrag(0, 1), 2)}, ${EN.eur(zahlbetrag(0, 2), 2)} and ${EN.eur(zahlbetrag(0, 3), 2)} for the four age bands. In the top group 15, up to ${EN.eur(P.dt.gruppen_bis[14])}, they range from ${EN.eur(zahlbetrag(14, 0), 2)} to ${EN.eur(zahlbetrag(14, 2), 2)}. To use the table, find the row for the payer’s adjusted net income, then the column for the child’s age. With several children, check next whether the payer keeps the needs-control amount of that row; if not, a lower row applies. The percentage column shows each row as a share of the statutory minimum.`,
    faqs: [
      { q: 'Why does the payment amount drop when a child in Germany turns 18?', a: `Because the full ${EN.eur(KG)} child benefit is deducted from the need instead of half. In group 1 the amount falls from ${EN.eur(minderj17, 2)} to ${EN.eur(volljaehrig, 2)}, although the need itself rises. Both parents also become liable for an adult child, so the figure in the last column is usually split between them according to income.` },
      { q: 'Is the payment table the same in every German state?', a: `The Düsseldorf Table is applied by every higher regional court, since all of them take part in drawing it up. The guidelines on how income is calculated, however, differ slightly between court districts. A given row pays the same everywhere; which row your income lands in can vary a little depending on the court.` },
      { q: 'What does the percentage column of the payment table mean?', a: `It expresses the row as a share of the statutory minimum: ${EN.num(P.dt.prozent[0])}% in group 1 up to ${EN.num(P.dt.prozent[14])}% in group 15. A German maintenance order may use it, for example “${EN.num(P.dt.prozent[4])}% of the minimum for the relevant age band, minus half the child benefit”. Such a dynamic order rises automatically as the child grows older or the minimum is raised.` },
      { q: 'My salary is paid in another currency: which row of the payment table applies?', a: `Convert your net pay into euros and adjust it as German courts would, deducting tax and social contributions you actually pay and recognised work costs. How the exchange rate is chosen can differ from court to court, so keep a record of the rates for the months concerned. The resulting euro figure determines the row; the table itself has no separate rules for foreign income.` },
      { q: 'Why are there half-euro amounts in the payment table?', a: `Because half the child benefit is ${EN.eur(KG / 2, 2)}. The table need is always rounded up to whole euros (section 1612a(2) BGB), but the deduction is not. The amount is paid exactly as shown, cents included; the table provides for no further rounding.` },
    ],
    body: (h) => `<h2>The complete 2026 payment table</h2>
<p>The grid below is generated by this site’s engine from the need figures of the ${h.src('olgDtPdf', '2026 Düsseldorf Table')} and the ${h.eur(h.P.kindergeld.monat)} child benefit. It matches the official annex line by line.</p>
${h.table(['Group', 'Adjusted net income', `Age ${AS[0][0]}–${AS[0][1]}`, `Age ${AS[1][0]}–${AS[1][1]}`, `Age ${AS[2][0]}–${AS[2][1]}`, `${AS[3][0]}+`, '%'], zeilen.map((r) => [String(r.g + 1), r.g === 0 ? `up to ${h.eur(r.bis)}` : `${h.eur(r.von)} to ${h.eur(r.bis)}`, ...r.z.map((x) => h.eur(x, 2)), `${h.num(r.pz)}%`]), 'Monthly amounts payable after the child benefit share, as of 1 January 2026', ['l', 'l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Reading a row in three steps</h2>
<p>Step one is the row. It depends on the adjusted net income of the parent who does not live with the child: not gross salary and not the net figure on the payslip, but income after the deductions explained under ${h.a('bereinigtes-netto', 'adjusted net income')}.</p>
<p>Step two is the column, chosen by the child’s age. The higher band applies from the first day of the birthday month, so a child turning six in March moves to the second column for all of March.</p>
<p>Step three is the check. The amounts assume two dependants. With more children, or with a spouse also claiming, courts test the ${h.a('bedarfskontrollbetrag', 'needs-control amount')} and may move to a lower row. With a single child some courts move to a higher row instead.</p>
<h2>Worked example: a father with two children</h2>
<p>A father whose children live with their mother has adjusted net income of ${h.eur(3450)}. The children are five and thirteen. The engine places him in group ${probe.gruppe + 1}: ${h.eur(probe.kinder[0].zahlbetrag, 2)} for the younger child from the first column and ${h.eur(probe.kinder[1].zahlbetrag, 2)} for the older from the third. Together he pays ${h.eur(probe.summe, 2)} and keeps ${h.eur(probe.verbleibt, 2)}, above the ${h.eur(probe.bkbWert)} needs-control amount, so the row stands.</p>
<h2>Need versus amount payable</h2>
<p>The main Düsseldorf Table lists the child’s need. The payment amount is lower because child benefit covers part of the cash need under ${h.src('bgb1612b', 'section 1612b BGB')}. Anyone working from the need table alone overstates what is owed. For group 1 the difference looks like this:</p>
${h.table(['Age band', 'Need', 'Child benefit share', 'Payable'], STUFEN.map((s) => [s === 3 ? `${AS[3][0]} or over` : `${AS[s][0]} to ${AS[s][1]}`, h.eur(bedarf(0, s)), h.eur(kgAnteil(s), 2), h.eur(zahlbetrag(0, s), 2)]), 'Group 1, equal to the statutory minimum for minors', ['l', 'r', 'r', 'r'])}
<p>In a ${h.a('mangelfall', 'shortfall case')} under note C, the payment amount is also the weighting used to share the available money between the children.</p>
<h2>Where the figures come from</h2>
<p>Group 1 is the statutory ${h.a('mindestunterhalt', 'minimum child support')}. Every higher group multiplies it by the percentage in the last column and rounds up to the next euro (${h.src('bgb1612a', 'section 1612a(2) BGB')}). For group 6 and the youngest band, ${h.eur(h.P.mindestunterhalt.stufen[0])} times ${h.num(h.P.dt.prozent[5])}% gives ${h.eur(g6roh, 2)}, shown in the table as ${h.eur(g6)}. Child benefit comes off only after that.</p>
<p>The same grid is annexed to the ${h.src('olgLeitlinien', 'NRW guidelines')}, whose paragraph 14 confirms that half the child benefit is offset where one parent provides care. Changes from last year are listed under ${h.a('duesseldorfer-tabelle-aenderungen', 'Düsseldorf Table 2026 changes')}.</p>
<h2>Common mistakes when reading it</h2>
<ul>
<li>Using the net figure from the payslip: commuting costs, loan instalments or extra pension saving can lower the relevant income, while bonuses and tax refunds can raise it.</li>
<li>Paying the need column instead of the payment amount: half the child benefit is then paid twice, since the resident parent already receives it from the family benefits office (Familienkasse).</li>
<li>Taking the child’s age at the end of the year: the birthday month is what counts.</li>
<li>Treating the last column as owed by one parent alone: from ${h.num(AS[3][0])} both parents share the remaining need by income.</li>
<li>Carrying on with last year’s figure: the new rows apply from January 2026, and an order for a fixed sum does not update itself.</li>
</ul>
<h2>What the table leaves out</h2>
<ul>
<li>Above ${h.eur(h.P.dt.gruppen_bis[14])} of adjusted net income the table stops and the need must be shown in detail.</li>
<li>Health and care insurance for a child who is not covered by statutory family insurance is extra. This matters for expat families with private cover.</li>
<li>Extra need such as nursery fees without meals is added and shared between both parents by income.</li>
<li>Equal shared care and children living away from both parents follow other methods.</li>
</ul>
<p>The figures on this page are general information about the 2026 payment amounts, not legal advice; in a dispute the Jugendamt or the family court decides which row applies to you.</p>`,
  },
});
