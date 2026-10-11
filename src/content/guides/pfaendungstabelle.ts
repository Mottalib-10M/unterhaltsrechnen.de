import { defineGuide } from '../../lib/guide-types';
import { pfaendbar, freibetrag, pfaendbarAb } from '../../lib/engine/pfaendung';
import { P, DE, EN } from '../../lib/fmt';

/** Alle Beispielwerte kommen aus dem Motor, der jede Zeile der amtlichen Monatstabelle nachrechnet. */
const Z = P.pfaendung;
const ALT = Z.vorjahr_monat;
const PERS = [0, 1, 2, 3, 4, 5];
const STUFEN = [1800, 2000, 2200, 2500, 2800, 3000, 3500, 4000, 4500];
const zeile = (n: number) => PERS.map((p) => pfaendbar(n, p).pfaendbar);
/** Beispiel „eine Zeile lesen“: 2.347,89 € netto, ein Kind. */
const lesen = pfaendbar(2347.89, 1);
/** Beispiel Ledige mit 2.600 € und Familie mit drei Unterhaltsberechtigten bei gleichem Lohn. */
const ledig = pfaendbar(2600, 0);
const familie = pfaendbar(2600, 3);
/** Gipfel der Tabelle und ein Lohn darüber. */
const gipfel = pfaendbar(Z.monat.obergrenze, 0);
const hoch = pfaendbar(5500, 1);
/** Woche und Tag. */
const woche = pfaendbar(640, 1, 'woche');
const tag = pfaendbar(120, 0, 'tag');
const anteil = (p: number) => 1 - Z.unpfaendbar_zehntel[p] / 10;

export default defineGuide({
  id: 'pfaendungstabelle',
  group: 'pfaendung',
  order: 8,
  mini: 'pfaendung',
  related: ['pfaendungsrechner', 'pfaendungsfreigrenze', 'p-konto', 'selbstbehalt', 'unterhaltsvorschuss', 'verfahrenskostenhilfe'],
  sources: ['pfaendBek2026', 'bgbl2026_80', 'zpo850c', 'zpo850d'],
  de: {
    slug: 'pfaendungstabelle',
    nav: 'Pfändungstabelle 2026',
    card: 'Monatstabelle ab 1. Juli 2026 in Stufen, mit Wochen- und Tageslohn und den alten Werten bis Juni.',
    title: 'Pfändungstabelle 2026: Nettolohn und Freibetrag ab 1. Juli',
    description: `Pfändungstabelle 2026 ab 1. Juli: Freibetrag ${DE.eur(Z.monat.grundfreibetrag, 2)}, pfändbare Beträge für 0 bis 5 Unterhaltspflichten, Wochen- und Tageslohn, alte Werte bis Juni.`,
    h1: 'Pfändungstabelle 2026: was vom Lohn gepfändet werden darf',
    intro: 'Ein Auszug der amtlichen Monatstabelle, nachgerechnet für typische Nettolöhne, dazu die Werte für Wochen- und Tageslohn.',
    resume: `Seit dem 1. Juli 2026 gilt die Pfändungstabelle der Pfändungsfreigrenzenbekanntmachung 2026. Wer niemandem Unterhalt zahlt, behält monatlich ${DE.eur(Z.monat.grundfreibetrag, 2)} Nettolohn unangetastet; bis ${DE.eur(ALT.grundfreibetrag, 2)} waren es bis zum 30. Juni 2026. Für die erste unterhaltsberechtigte Person kommen ${DE.eur(Z.monat.erste_person, 2)} hinzu, für die zweite bis fünfte je ${DE.eur(Z.monat.weitere_person, 2)}. Pfändbar ist nur ein Teil des Lohns über diesem Freibetrag: ohne Unterhaltspflicht ${DE.pct(anteil(0))}, mit einer Person ${DE.pct(anteil(1))}, mit fünf noch ${DE.pct(anteil(5))}. Bei ${DE.eur(2600)} netto sind ohne Unterhaltspflicht ${DE.eur(ledig.pfaendbar, 2)} pfändbar, mit drei Unterhaltsberechtigten nur ${DE.eur(familie.pfaendbar, 2)}. Die Tabelle rechnet in Schritten von ${DE.eur(Z.monat.rundung)} und endet bei ${DE.eur(Z.monat.obergrenze, 2)}: Was darüber liegt, ist voll pfändbar. Für Wochen- und Tageslohn gibt es eigene Spalten mit Stufen von ${DE.eur(Z.woche.rundung, 2)} und ${DE.eur(Z.tag.rundung, 2)}.`,
    faqs: [
      { q: 'Ab welchem Nettolohn ist in der Pfändungstabelle 2026 etwas pfändbar?', a: `Ohne Unterhaltspflicht beginnt die erste Zeile mit einem pfändbaren Betrag bei ${DE.eur(pfaendbarAb(0))} netto im Monat. Mit einer unterhaltsberechtigten Person verschiebt sich diese Schwelle auf ${DE.eur(pfaendbarAb(1))}, mit zwei auf ${DE.eur(pfaendbarAb(2))} und mit fünf oder mehr auf ${DE.eur(pfaendbarAb(5))}. Darunter steht in der amtlichen Tabelle in jeder Spalte nur ein Strich.` },
      { q: 'Welche Pfändungstabelle gilt für meinen Lohn vom Juni 2026?', a: `Maßgeblich ist, für welchen Zeitraum der Lohn gezahlt wird. Für Arbeitseinkommen, das auf Juni 2026 entfällt, gelten noch die alten Beträge mit ${DE.eur(ALT.grundfreibetrag, 2)} Grundfreibetrag. Erst für Zeiträume ab dem 1. Juli 2026 rechnet der Arbeitgeber mit ${DE.eur(Z.monat.grundfreibetrag, 2)}. Die Werte werden jedes Jahr zum 1. Juli angepasst, gekoppelt an den steuerlichen Grundfreibetrag.` },
      { q: 'Warum endet die Pfändungstabelle bei einem bestimmten Betrag?', a: `Weil § 850c Abs. 3 ZPO den geschützten Anteil nur bis zu einer Höchstgrenze berechnet, ab 1. Juli 2026 ${DE.eur(Z.monat.obergrenze, 2)} im Monat. Bis dahin steigt der pfändbare Betrag stufenweise. Jeder Euro darüber geht vollständig an den Gläubiger, unabhängig von der Zahl der Unterhaltsberechtigten. Die Tabelle braucht deshalb keine Zeilen für höhere Löhne.` },
      { q: 'Gilt die Pfändungstabelle auch, wenn das Kind oder die Ex-Partnerin pfändet?', a: `Nicht unmittelbar. Bei Pfändung wegen gesetzlichen Unterhalts erlaubt § 850d ZPO einen tieferen Zugriff auf den Lohn. Das Vollstreckungsgericht legt dann im Beschluss fest, wie viel dem Schuldner für den eigenen notwendigen Unterhalt und vorrangige Berechtigte bleibt. Mehr als nach der normalen Tabelle muss ihm dabei nicht verbleiben. Den genauen Betrag liest man im Beschluss, nicht in der Tabelle.` },
      { q: 'Zählt ein Kind in der Pfändungstabelle, wenn ich nur Kindesunterhalt überweise?', a: `Ja, entscheidend ist, dass Sie einer Person aufgrund gesetzlicher Pflicht tatsächlich Unterhalt gewähren (§ 850c Abs. 2 ZPO). Das kann Barunterhalt an ein Kind im anderen Haushalt sein ebenso wie Naturalunterhalt im eigenen. Hat die Person eigenes Einkommen, kann der Gläubiger beim Vollstreckungsgericht beantragen, sie ganz oder teilweise nicht mitzuzählen (§ 850c Abs. 6 ZPO).` },
      { q: 'Wie lese ich die Pfändungstabelle bei Wochenlohn?', a: `Für Wochenlohn gibt es einen eigenen Teil der Bekanntmachung. Der Grundfreibetrag liegt bei ${DE.eur(Z.woche.grundfreibetrag, 2)} je Woche, die erste unterhaltsberechtigte Person erhöht ihn um ${DE.eur(Z.woche.erste_person, 2)}, jede weitere um ${DE.eur(Z.woche.weitere_person, 2)}. Abgerundet wird auf ${DE.eur(Z.woche.rundung, 2)}, und über ${DE.eur(Z.woche.obergrenze, 2)} pro Woche ist alles pfändbar.` },
    ],
    body: (h) => `<h2>Was sich am 1. Juli 2026 geändert hat</h2>
<p>Die Pfändungsfreigrenzen werden jedes Jahr zum 1. Juli neu bekannt gemacht. Grundlage ist § 850c Abs. 4 ZPO: Die Beträge folgen der prozentualen Entwicklung des steuerlichen Grundfreibetrags. Die ${h.src('pfaendBek2026', 'Pfändungsfreigrenzenbekanntmachung 2026')} vom 19. März 2026 wurde im ${h.src('bgbl2026_80', 'Bundesgesetzblatt 2026 I Nr. 80')} veröffentlicht. Sie nennt vier Monatswerte, aus denen die gesamte Tabelle folgt.</p>
${h.table(['Monatswert', 'bis 30. Juni 2026', 'ab 1. Juli 2026'], [
  ['Grundfreibetrag', h.eur(h.P.pfaendung.vorjahr_monat.grundfreibetrag, 2), h.eur(h.P.pfaendung.monat.grundfreibetrag, 2)],
  ['Erhöhung erste unterhaltsberechtigte Person', h.eur(h.P.pfaendung.vorjahr_monat.erste_person, 2), h.eur(h.P.pfaendung.monat.erste_person, 2)],
  ['Erhöhung zweite bis fünfte Person, je', h.eur(h.P.pfaendung.vorjahr_monat.weitere_person, 2), h.eur(h.P.pfaendung.monat.weitere_person, 2)],
  ['Obergrenze der Berechnung', h.eur(h.P.pfaendung.vorjahr_monat.obergrenze, 2), h.eur(h.P.pfaendung.monat.obergrenze, 2)],
], 'Pfändungsfreigrenzen nach § 850c ZPO, Auszahlung für Monate', ['l', 'r', 'r'])}
<p>Für Schuldnerinnen und Schuldner heißt das: Bei gleichem Lohn bleibt seit Juli etwas mehr im Portemonnaie. Die neue Tabelle gilt auch für Pfändungen, die schon vorher angeordnet wurden. Ein neuer Beschluss ist dafür nicht nötig, denn der Pfändungsbeschluss verweist nur auf „die Tabelle“ (§ 850c Abs. 5 ZPO).</p>
<h2>Auszug aus der Monatstabelle ab 1. Juli 2026</h2>
<p>Die amtliche Tabelle hat für jeden Zehn-Euro-Schritt eine Zeile, insgesamt mehrere hundert. Der folgende Auszug zeigt typische Nettolöhne. Jeder Wert ist vom Rechenmotor dieser Seite ermittelt, der die Zeilen der Bekanntmachung Cent für Cent nachrechnet.</p>
${h.table(['Nettolohn', '0', '1', '2', '3', '4', '5 und mehr'],
  STUFEN.map((n) => [h.eur(n), ...zeile(n).map((v) => (v > 0 ? h.eur(v, 2) : 'nichts'))]),
  'Pfändbarer Betrag im Monat bei Unterhaltspflicht für 0 bis 5 Personen, Zeile ab dem genannten Nettolohn', ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>Bis ${h.eur(pfaendbarAb(0) - 0.01, 2)} ist in keiner Spalte etwas pfändbar. Die erste Zeile mit einem Betrag beginnt je nach Unterhaltspflichten bei ${PERS.map((p) => h.eur(pfaendbarAb(p))).join(', ')}. Das sind die Freibeträge ${PERS.map((p) => h.eur(freibetrag(p), 2)).join(', ')}, aufgerundet auf die nächste Tabellenstufe.</p>
<h2>So lesen Sie eine Zeile richtig</h2>
<p>Ausgangspunkt ist der Nettolohn im Sinne von § 850e ZPO: Bruttolohn minus Lohnsteuer, Solidaritätszuschlag, Kirchensteuer und Sozialversicherungsbeiträge. Unpfändbare Lohnbestandteile nach § 850a ZPO, etwa die Hälfte der Überstundenvergütung, werden vorher herausgenommen. Mit diesem Betrag suchen Sie die Zeile, in deren Spanne er fällt, und gehen in die Spalte mit der Zahl Ihrer Unterhaltsberechtigten.</p>
<p>Beispiel: ${h.eur(lesen.netto, 2)} netto, ein Kind, dem Unterhalt gezahlt wird. Der Betrag liegt in der Zeile ab ${h.eur(lesen.abgerundet)}. In Spalte 1 stehen ${h.eur(lesen.pfaendbar, 2)}. Der Arbeitgeber überweist diesen Betrag an den Gläubiger, ausgezahlt werden ${h.eur(lesen.verbleibt, 2)}. Die Cent über der Stufe spielen keine Rolle, weil § 850c Abs. 5 ZPO auf volle ${h.eur(h.P.pfaendung.monat.rundung)} abrundet.</p>
<h2>Warum jede unterhaltsberechtigte Person so viel ausmacht</h2>
<p>Unterhaltspflichten wirken doppelt. Sie erhöhen erstens den Freibetrag. Zweitens sinkt der Anteil, der vom Mehrbetrag über dem Freibetrag pfändbar ist. Ohne Unterhaltspflicht sind es ${h.pct(anteil(0))}, mit einer Person ${h.pct(anteil(1))}, dann ${PERS.slice(2).map((p) => h.pct(anteil(p))).join(', ')}.</p>
<p>Bei ${h.eur(2600)} netto zeigt sich der Unterschied deutlich: Ein Lediger ohne Unterhaltspflicht verliert ${h.eur(ledig.pfaendbar, 2)} im Monat an die Pfändung. Ein Vater, der zwei Kindern und der früheren Partnerin Unterhalt zahlt, liegt mit seinem Freibetrag von ${h.eur(familie.freibetrag, 2)} so hoch, dass nur ${h.eur(familie.pfaendbar, 2)} pfändbar sind. Das Gesetz schützt damit die Familie des Schuldners, nicht nur ihn selbst.</p>
<p>Mehr als fünf Personen zählen nicht. Die letzte Spalte heißt deshalb „5 und mehr“. Ob eine Person mitzählt, die eigenes Einkommen hat, entscheidet auf Antrag des Gläubigers das Vollstreckungsgericht nach § 850c Abs. 6 ZPO. Bis dahin berücksichtigt der Arbeitgeber die Unterhaltspflichten, die ihm bekannt sind; es liegt am Schuldner, sie ihm mitzuteilen und zu belegen.</p>
<h2>Höhere Löhne: wo die Tabelle aufhört</h2>
<p>Die letzte Zeile reicht bis ${h.eur(h.P.pfaendung.monat.obergrenze, 2)}. Dort sind ohne Unterhaltspflicht ${h.eur(gipfel.pfaendbar, 2)} pfändbar. Der Teil des Lohns darüber ist nach § 850c Abs. 3 ZPO voll pfändbar. Bei ${h.eur(hoch.netto)} netto und einem Kind ergeben sich ${h.eur(hoch.pfaendbar, 2)}: der Tabellenwert der letzten Zeile plus der gesamte Betrag über der Grenze von ${h.eur(hoch.ueberObergrenze, 2)}.</p>
<h2>Wochen- und Tageslohn</h2>
<p>Wer wöchentlich oder täglich bezahlt wird, etwa in der Gastronomie, auf dem Bau oder als Aushilfe, liest nicht die Monatstabelle. Die Bekanntmachung enthält eigene Tabellen mit eigenen Freibeträgen und feineren Stufen.</p>
${h.table(['Wert', 'je Woche', 'je Tag'], [
  ['Grundfreibetrag', h.eur(h.P.pfaendung.woche.grundfreibetrag, 2), h.eur(h.P.pfaendung.tag.grundfreibetrag, 2)],
  ['Erhöhung erste Person', h.eur(h.P.pfaendung.woche.erste_person, 2), h.eur(h.P.pfaendung.tag.erste_person, 2)],
  ['Erhöhung jede weitere Person', h.eur(h.P.pfaendung.woche.weitere_person, 2), h.eur(h.P.pfaendung.tag.weitere_person, 2)],
  ['Obergrenze', h.eur(h.P.pfaendung.woche.obergrenze, 2), h.eur(h.P.pfaendung.tag.obergrenze, 2)],
  ['Abrundung auf', h.eur(h.P.pfaendung.woche.rundung, 2), h.eur(h.P.pfaendung.tag.rundung, 2)],
], 'Beträge ab 1. Juli 2026', ['l', 'r', 'r'])}
<p>Zwei Beispiele aus dem Motor: Bei ${h.eur(woche.netto)} Wochenlohn und einer unterhaltsberechtigten Person sind ${h.eur(woche.pfaendbar, 2)} pro Woche pfändbar. Bei ${h.eur(tag.netto)} Tageslohn ohne Unterhaltspflicht sind es ${h.eur(tag.pfaendbar, 2)} pro Tag.</p>
<h2>Was die Tabelle nicht regelt</h2>
<ul>
<li><strong>Unterhaltsgläubiger:</strong> Pfändet ein Kind oder ein früherer Ehegatte wegen Unterhalts, gilt ${h.src('zpo850d', '§ 850d ZPO')}. Das Vollstreckungsgericht bestimmt den Betrag, der bleibt, individuell im Beschluss.</li>
<li><strong>Härtefälle:</strong> Reicht das Verbleibende für den notwendigen Lebensunterhalt nicht, kann das Vollstreckungsgericht auf Antrag des Schuldners mehr belassen (§ 850f Abs. 1 ZPO), etwa bei besonderen beruflichen oder gesundheitlichen Bedürfnissen.</li>
<li><strong>Bankkonto:</strong> Die Tabelle gilt für den Lohn beim Arbeitgeber. Guthaben auf dem Konto schützt das ${h.a('p-konto', 'P-Konto')} mit eigenen Regeln.</li>
<li><strong>Mehrere Arbeitgeber:</strong> Mehrere Einkommen werden nur auf Antrag beim Vollstreckungsgericht zusammengerechnet (§ 850e Nr. 2 ZPO).</li>
</ul>
<p>Den eigenen Betrag mit Cent-Genauigkeit rechnet der ${h.a('pfaendungsrechner', 'Pfändungsrechner')} aus. Wie sich der Freibetrag zusammensetzt, steht bei der ${h.a('pfaendungsfreigrenze', 'Pfändungsfreigrenze')}. Rechtsgrundlage ist ${h.src('zpo850c', '§ 850c ZPO')}. Diese Seite ist eine allgemeine Information zur Pfändungstabelle 2026 und keine Rechtsberatung; Schuldnerberatungsstellen der Kommunen und Wohlfahrtsverbände helfen kostenlos beim Prüfen eines Pfändungsbeschlusses.</p>`,
  },
  en: {
    slug: 'garnishment-table',
    nav: 'Garnishment table 2026',
    card: 'The monthly table from 1 July 2026 in steps, plus weekly and daily pay and the old values until June.',
    title: 'Garnishment Table Germany 2026: Wage Limits from 1 July',
    description: `German wage garnishment table 2026 from 1 July: ${EN.eur(Z.monat.grundfreibetrag, 2)} exempt, garnishable amounts for 0 to 5 dependants, weekly and daily pay, old values until June.`,
    h1: 'Germany’s 2026 garnishment table: how much of your wage can be taken',
    intro: 'An excerpt from the official monthly table (Pfändungstabelle), recomputed for typical net wages, plus the weekly and daily figures.',
    resume: `Since 1 July 2026 German employers apply the wage garnishment table (Pfändungstabelle) of the 2026 Garnishment Limits Notice. If you support nobody, ${EN.eur(Z.monat.grundfreibetrag, 2)} of monthly net pay is fully protected, up from ${EN.eur(ALT.grundfreibetrag, 2)} until 30 June 2026. The first person you maintain by law adds ${EN.eur(Z.monat.erste_person, 2)}, the second to fifth ${EN.eur(Z.monat.weitere_person, 2)} each. Only part of the pay above that exemption can be taken: ${EN.pct(anteil(0))} with no dependants, ${EN.pct(anteil(1))} with one, ${EN.pct(anteil(5))} with five. On ${EN.eur(2600)} net, a single person loses ${EN.eur(ledig.pfaendbar, 2)} a month, someone supporting three people ${EN.eur(familie.pfaendbar, 2)}. The table moves in ${EN.eur(Z.monat.rundung)} steps and stops at ${EN.eur(Z.monat.obergrenze, 2)}; every euro above that can be garnished in full. Separate weekly and daily tables use steps of ${EN.eur(Z.woche.rundung, 2)} and ${EN.eur(Z.tag.rundung, 2)}.`,
    faqs: [
      { q: 'At what net wage does the 2026 German garnishment table start taking money?', a: `With no dependants the first line with a garnishable amount starts at ${EN.eur(pfaendbarAb(0))} net a month. Supporting one person moves the threshold to ${EN.eur(pfaendbarAb(1))}, two people to ${EN.eur(pfaendbarAb(2))}, and five or more to ${EN.eur(pfaendbarAb(5))}. Below these figures the official table shows only a dash in every column, meaning your employer may not deduct anything.` },
      { q: 'Does the new garnishment table apply to my June 2026 salary paid in July?', a: `What matters is the period the pay covers, not the payment date. Wages for June 2026 are still assessed with the old ${EN.eur(ALT.grundfreibetrag, 2)} exemption; periods from 1 July 2026 use ${EN.eur(Z.monat.grundfreibetrag, 2)}. The figures change every 1 July in line with the German income tax basic allowance, so the table you read must match the month worked.` },
      { q: 'I am an expat paid partly from abroad: which figure goes into the garnishment table?', a: `The table works on net earned income as defined in section 850e of the Code of Civil Procedure (ZPO): pay after income tax and social contributions. Several incomes are combined only if the enforcement court (Vollstreckungsgericht) orders it on application. Whether a German order can reach an employer outside Germany is a separate legal question this table does not answer.` },
      { q: 'Does the garnishment table apply when my child or ex-spouse is the creditor?', a: `Not directly. For statutory maintenance debts, section 850d ZPO allows deeper access to wages. The enforcement court then sets in the order how much you keep for your own basic needs and for people ranking ahead of the creditor, never more than the ordinary table would leave. The protected sum is written in that order, not in the table.` },
      { q: 'Who counts as a dependant in the German garnishment table?', a: `Anyone you actually maintain because the law obliges you to: a spouse or former spouse, a registered partner, a child or other relative in direct line, or an unmarried parent under sections 1615l and 1615n BGB. A child living abroad to whom you transfer support counts as well. A creditor can ask the court to disregard a person with income of their own.` },
    ],
    body: (h) => `<h2>What changed on 1 July 2026</h2>
<p>Germany updates its wage garnishment limits every 1 July. Section 850c(4) of the Code of Civil Procedure (Zivilprozessordnung, ZPO) ties them to the percentage change in the income tax basic allowance. The ${h.src('pfaendBek2026', '2026 Garnishment Limits Notice')} of 19 March 2026 appeared in the ${h.src('bgbl2026_80', 'Federal Law Gazette 2026 I No. 80')} and sets four monthly figures from which the whole table follows.</p>
${h.table(['Monthly figure', 'until 30 June 2026', 'from 1 July 2026'], [
  ['Basic exemption', h.eur(h.P.pfaendung.vorjahr_monat.grundfreibetrag, 2), h.eur(h.P.pfaendung.monat.grundfreibetrag, 2)],
  ['Increase for the first dependant', h.eur(h.P.pfaendung.vorjahr_monat.erste_person, 2), h.eur(h.P.pfaendung.monat.erste_person, 2)],
  ['Increase for the 2nd to 5th dependant, each', h.eur(h.P.pfaendung.vorjahr_monat.weitere_person, 2), h.eur(h.P.pfaendung.monat.weitere_person, 2)],
  ['Upper limit of the calculation', h.eur(h.P.pfaendung.vorjahr_monat.obergrenze, 2), h.eur(h.P.pfaendung.monat.obergrenze, 2)],
], 'Garnishment limits under section 850c ZPO, monthly pay', ['l', 'r', 'r'])}
<p>For anyone whose wages are already garnished, the higher figures apply automatically. Garnishment orders (Pfändungs- und Überweisungsbeschluss) simply refer to “the table”, as section 850c(5) ZPO allows, so nobody has to apply for a new order.</p>
<h2>Excerpt from the monthly table</h2>
<p>The official notice runs to hundreds of lines, one for every ten euros. The selection below covers common net salaries. Each figure comes from the engine behind this site, which reproduces the official lines to the cent.</p>
${h.table(['Net pay', '0', '1', '2', '3', '4', '5 or more'],
  STUFEN.map((n) => [h.eur(n), ...zeile(n).map((v) => (v > 0 ? h.eur(v, 2) : 'nothing'))]),
  'Garnishable per month by number of dependants, line starting at the net pay shown', ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>Up to ${h.eur(pfaendbarAb(0) - 0.01, 2)} nothing can be taken in any column. Depending on the number of dependants, the first line with an amount starts at ${PERS.map((p) => h.eur(pfaendbarAb(p))).join(', ')}: the exemptions of ${PERS.map((p) => h.eur(freibetrag(p), 2)).join(', ')}, rounded up to the next step.</p>
<h2>Reading one line</h2>
<p>Start from net pay as section 850e ZPO defines it: gross pay minus wage tax, solidarity surcharge, church tax and social insurance. Items that cannot be garnished under section 850a ZPO, such as half of any overtime pay, are taken out first. Find the line whose range contains the result and the column for the number of people you support.</p>
<p>Take ${h.eur(lesen.netto, 2)} net and one child you pay support for. The line starting at ${h.eur(lesen.abgerundet)} shows ${h.eur(lesen.pfaendbar, 2)} in column 1. Your employer, acting as third-party debtor (Drittschuldner), sends that sum to the creditor and pays you ${h.eur(lesen.verbleibt, 2)}. The cents above the step are ignored because the law rounds down to full ${h.eur(h.P.pfaendung.monat.rundung)} steps.</p>
<h2>Why each dependant changes the result so much</h2>
<p>Dependants count twice. They raise the exemption, and they shrink the share of the excess that can be taken: ${h.pct(anteil(0))} with nobody to support, ${h.pct(anteil(1))} with one person, then ${PERS.slice(2).map((p) => h.pct(anteil(p))).join(', ')}.</p>
<p>At ${h.eur(2600)} net a single employee without dependants loses ${h.eur(ledig.pfaendbar, 2)} a month. A parent supporting two children and a former partner has an exemption of ${h.eur(familie.freibetrag, 2)}, so only ${h.eur(familie.pfaendbar, 2)} can go to the creditor. The rules protect the debtor’s family, not only the debtor.</p>
<p>No more than five people count, hence the last column “5 or more”. If a dependant earns money of their own, the creditor can ask the enforcement court to leave that person out wholly or partly (section 850c(6) ZPO). Until then, payroll can only count the dependants it knows about, so it is up to you to tell your employer and show proof.</p>
<h2>Higher salaries</h2>
<p>The table ends at ${h.eur(h.P.pfaendung.monat.obergrenze, 2)}, where ${h.eur(gipfel.pfaendbar, 2)} is garnishable for someone with no dependants. Anything above that line is fully garnishable. On ${h.eur(hoch.netto)} net with one child the result is ${h.eur(hoch.pfaendbar, 2)}: the last table value plus the whole ${h.eur(hoch.ueberObergrenze, 2)} above the limit.</p>
<h2>Weekly and daily pay</h2>
<p>Workers paid by the week or by the day, common in catering, construction or temporary jobs, use separate tables with their own exemptions and finer steps.</p>
${h.table(['Figure', 'per week', 'per day'], [
  ['Basic exemption', h.eur(h.P.pfaendung.woche.grundfreibetrag, 2), h.eur(h.P.pfaendung.tag.grundfreibetrag, 2)],
  ['First dependant', h.eur(h.P.pfaendung.woche.erste_person, 2), h.eur(h.P.pfaendung.tag.erste_person, 2)],
  ['Each further dependant', h.eur(h.P.pfaendung.woche.weitere_person, 2), h.eur(h.P.pfaendung.tag.weitere_person, 2)],
  ['Upper limit', h.eur(h.P.pfaendung.woche.obergrenze, 2), h.eur(h.P.pfaendung.tag.obergrenze, 2)],
  ['Rounded down to', h.eur(h.P.pfaendung.woche.rundung, 2), h.eur(h.P.pfaendung.tag.rundung, 2)],
], 'Figures from 1 July 2026', ['l', 'r', 'r'])}
<p>Two examples from the engine: ${h.eur(woche.netto)} of weekly pay with one dependant leaves ${h.eur(woche.pfaendbar, 2)} garnishable per week; ${h.eur(tag.netto)} of daily pay with no dependants, ${h.eur(tag.pfaendbar, 2)} per day.</p>
<h2>What the table leaves out</h2>
<ul>
<li><strong>Maintenance creditors:</strong> a child or former spouse enforcing support falls under ${h.src('zpo850d', 'section 850d ZPO')}; the court fixes your protected amount in the order itself.</li>
<li><strong>Hardship:</strong> if what remains does not cover basic living costs, the enforcement court can leave you more on your application (section 850f(1) ZPO).</li>
<li><strong>Bank balances:</strong> the table governs wages at source. Money in your account is protected through a ${h.a('p-konto', 'protected account (P-Konto)')}.</li>
<li><strong>Two jobs:</strong> incomes are added together only if the court orders it on application (section 850e no. 2 ZPO).</li>
</ul>
<p>The ${h.a('pfaendungsrechner', 'garnishment calculator')} gives your exact figure, and the page on the ${h.a('pfaendungsfreigrenze', 'garnishment exemption')} explains how the protected amount is built. The legal basis is ${h.src('zpo850c', 'section 850c ZPO')}. This page is general information about the 2026 table, not legal advice; free debt counselling services (Schuldnerberatung) run by towns and charities can check a garnishment order with you.</p>`,
  },
});
