import { defineGuide } from '../../lib/guide-types';
import { pfaendbar, freibetrag, pfaendbarAb } from '../../lib/engine/pfaendung';
import { P, DE, EN } from '../../lib/fmt';

/** Freibeträge und Beispiele aus dem Motor; alte Werte (bis 30. Juni 2026) direkt aus den Parametern zusammengesetzt. */
const Z = P.pfaendung;
const ALT = Z.vorjahr_monat;
const PERS = [0, 1, 2, 3, 4, 5];
const altFrei = (n: number) => ALT.grundfreibetrag + (n >= 1 ? ALT.erste_person : 0) + Math.max(0, n - 1) * ALT.weitere_person;
const plus = (n: number) => freibetrag(n) - altFrei(n);
/** Weihnachtsvergütung nach § 850a Nr. 4 ZPO: bis zur Hälfte des auf volle 10 € aufgerundeten Monatsfreibetrags. */
const weihnacht = (Math.ceil(Z.monat.grundfreibetrag / Z.monat.rundung) * Z.monat.rundung) / 2;
/** Beispiel: Alleinerziehende Mutter mit zwei Kindern, 2.950 € netto. */
const mutter = pfaendbar(2950, 2);
/** Beispiel: dieselbe Mutter, wenn ein Kind eigenes Einkommen hat und das Gericht es nicht mehr mitzählt. */
const mutterEins = pfaendbar(2950, 1);
/** Beispiel Expat: 3.400 € netto, Ehefrau ohne Einkommen und ein Kind. */
const expat = pfaendbar(3400, 2);

export default defineGuide({
  id: 'pfaendungsfreigrenze',
  group: 'pfaendung',
  order: 12,
  mini: 'freigrenze',
  related: ['pfaendungstabelle', 'pfaendungsrechner', 'p-konto', 'selbstbehalt', 'mangelfall', 'kindesunterhalt'],
  sources: ['zpo850c', 'zpo850d', 'pfaendBek2026', 'bgb1609'],
  de: {
    slug: 'pfaendungsfreigrenze',
    nav: 'Pfändungsfreigrenze',
    card: 'Grundfreibetrag, Erhöhung je Unterhaltsberechtigtem, Obergrenze und Lohnteile, die nie gepfändet werden.',
    title: 'Pfändungsfreigrenze 2026: Grundfreibetrag und Erhöhungen',
    description: `Pfändungsfreigrenze 2026: ${DE.eur(Z.monat.grundfreibetrag, 2)} Grundfreibetrag ab 1. Juli, Erhöhung je Unterhaltsberechtigtem, Obergrenze, unpfändbare Lohnteile, Unterhaltspfändung.`,
    h1: 'Pfändungsfreigrenze 2026: so viel Lohn ist geschützt',
    intro: 'Aus welchen Bausteinen sich der geschützte Betrag zusammensetzt und welche Lohnbestandteile gar nicht erst mitgerechnet werden.',
    resume: `Die Pfändungsfreigrenze ist der Teil des Nettolohns, den ein Gläubiger nicht antasten darf. Ab dem 1. Juli 2026 beträgt der Grundfreibetrag nach § 850c ZPO ${DE.eur(Z.monat.grundfreibetrag, 2)} im Monat, ${DE.eur(Z.woche.grundfreibetrag, 2)} in der Woche und ${DE.eur(Z.tag.grundfreibetrag, 2)} am Tag. Wer einer Person gesetzlich Unterhalt gewährt, erhält monatlich ${DE.eur(Z.monat.erste_person, 2)} mehr, für die zweite bis fünfte Person je ${DE.eur(Z.monat.weitere_person, 2)}. Bei zwei Unterhaltsberechtigten sind so ${DE.eur(freibetrag(2), 2)} geschützt, bei fünf ${DE.eur(freibetrag(5), 2)}. Vom Lohn über der Grenze bleibt ein weiterer Anteil frei, der mit jeder Person wächst; nur bis zur Obergrenze von ${DE.eur(Z.monat.obergrenze, 2)} wird so gerechnet. Bis zum 30. Juni 2026 lag der Grundfreibetrag bei ${DE.eur(ALT.grundfreibetrag, 2)}. Einige Lohnteile zählen nach § 850a ZPO gar nicht mit, etwa die Hälfte der Überstundenvergütung oder Weihnachtsgeld bis ${DE.eur(weihnacht)}. Pfändet ein Unterhaltsgläubiger, setzt das Vollstreckungsgericht die Grenze dagegen im Einzelfall fest (§ 850d ZPO).`,
    faqs: [
      { q: 'Wie hoch ist die Pfändungsfreigrenze 2026 für Alleinstehende ohne Kinder?', a: `Ab dem 1. Juli 2026 sind ${DE.eur(Z.monat.grundfreibetrag, 2)} Nettolohn im Monat geschützt; bis Ende Juni waren es ${DE.eur(ALT.grundfreibetrag, 2)}. Etwas pfändbar wird erst ab einem Nettolohn von ${DE.eur(pfaendbarAb(0))}, weil die Tabelle in Zehn-Euro-Schritten rechnet. Auch darüber bleibt ein Teil des Mehrbetrags frei, so dass nie der ganze Lohn über der Grenze wegfällt.` },
      { q: 'Erhöht sich die Pfändungsfreigrenze auch für eine Lebensgefährtin?', a: `Nur bei einer gesetzlichen Unterhaltspflicht. § 850c Abs. 2 ZPO nennt Ehegatten, frühere Ehegatten, eingetragene Lebenspartner, Verwandte in gerader Linie und den Elternteil eines gemeinsamen Kindes nach §§ 1615l, 1615n BGB. Eine nichteheliche Partnerin ohne gemeinsames Kind fällt nicht darunter. Für Bankguthaben kennt das P-Konto daneben weitere Fälle, etwa Mitglieder einer Bedarfsgemeinschaft.` },
      { q: 'Ist Weihnachtsgeld von der Pfändungsfreigrenze erfasst?', a: `Weihnachtsgeld wird bis zur Hälfte des auf volle zehn Euro aufgerundeten monatlichen Grundfreibetrags gar nicht erst mitgerechnet (§ 850a Nr. 4 ZPO), ab 1. Juli 2026 also bis ${DE.eur(weihnacht)}. Nur der Teil darüber fließt in den Nettolohn des Monats und wird dann nach der Tabelle behandelt. Urlaubsgeld bleibt frei, soweit es den Rahmen des Üblichen nicht übersteigt.` },
      { q: 'Gilt die Pfändungsfreigrenze, wenn das Unterhaltsvorschussamt den Lohn pfändet?', a: `Entscheidend ist die Art der Forderung, nicht wer sie eintreibt. Holt das Land gezahlten Unterhaltsvorschuss vom anderen Elternteil zurück, geht es um übergegangenen Kindesunterhalt; dafür gilt in der Regel das Vorrecht des § 850d ZPO mit einem vom Vollstreckungsgericht bestimmten Betrag. Für Forderungen, die mit Unterhalt nichts zu tun haben, bleibt es bei der normalen Freigrenze nach § 850c ZPO.` },
      { q: 'Kann die Pfändungsfreigrenze im Einzelfall höher sein als in der Tabelle?', a: `Ja, auf Antrag beim Vollstreckungsgericht. Nach § 850f Abs. 1 ZPO kann es mehr belassen, wenn der notwendige Lebensunterhalt im Sinne des Sozialrechts sonst nicht gedeckt ist, wenn besondere persönliche oder berufliche Bedürfnisse bestehen oder viele Personen zu unterhalten sind. Überwiegende Belange des Gläubigers dürfen nicht entgegenstehen. Eine Schuldnerberatung hilft kostenlos bei solchen Anträgen.` },
      { q: 'Wie wirkt die Pfändungsfreigrenze bei Rückständen beim Kindesunterhalt?', a: `Für Unterhaltsschulden darf tiefer gepfändet werden, aber nicht unbegrenzt: Dem Schuldner bleibt, was er für den eigenen notwendigen Unterhalt und die vorrangigen Berechtigten braucht. Für Rückstände, die länger als ein Jahr vor dem Antrag fällig wurden, gilt das Vorrecht nach § 850d Abs. 1 ZPO nur, wenn sich der Schuldner der Zahlung absichtlich entzogen hat.` },
    ],
    body: (h) => `<h2>Die drei Bausteine der Freigrenze</h2>
<p>Das Gesetz baut den geschützten Betrag aus drei Teilen. Der erste ist der Grundfreibetrag nach § 850c Abs. 1 ZPO, der jedem zusteht. Der zweite sind Erhöhungen für Menschen, denen der Schuldner kraft Gesetzes Unterhalt gewährt (Abs. 2). Der dritte ist ein Anteil am Mehrverdienst, der ebenfalls frei bleibt (Abs. 3). Die Werte ab 1. Juli 2026 stehen in der ${h.src('pfaendBek2026', 'Pfändungsfreigrenzenbekanntmachung 2026')}.</p>
${h.table(['Unterhaltspflichten', 'Freibetrag ab 1. Juli 2026', 'bis 30. Juni 2026', 'Plus', 'pfändbar ab Nettolohn'],
  PERS.map((n) => [n === 5 ? '5 und mehr' : String(n), h.eur(freibetrag(n), 2), h.eur(altFrei(n), 2), h.eur(plus(n), 2), h.eur(pfaendbarAb(n))]),
  'Monatliche Pfändungsfreigrenze nach § 850c ZPO', ['l', 'r', 'r', 'r', 'r'])}
<p>Die rechte Spalte nennt den ersten Nettolohn, bei dem die Tabelle einen Betrag ausweist. Wer knapp darunter verdient, muss nichts abgeben, auch wenn der Pfändungsbeschluss beim Arbeitgeber liegt.</p>
<h2>Grundfreibetrag: der Sockel für alle</h2>
<p>Der Grundfreibetrag soll das Existenzminimum sichern und orientiert sich am steuerlichen Grundfreibetrag. Deshalb steigt er jedes Jahr zum 1. Juli um denselben Prozentsatz. Ab Juli 2026 liegen ${h.eur(h.P.pfaendung.monat.grundfreibetrag, 2)} monatlich, ${h.eur(h.P.pfaendung.woche.grundfreibetrag, 2)} wöchentlich und ${h.eur(h.P.pfaendung.tag.grundfreibetrag, 2)} täglich außer Reichweite des Gläubigers. Maßgeblich ist der Zeitraum, für den der Lohn gezahlt wird.</p>
<h2>Erhöhung für jede unterhaltsberechtigte Person</h2>
<p>Die erste Person bringt ${h.eur(h.P.pfaendung.monat.erste_person, 2)}, jede weitere bis zur fünften ${h.eur(h.P.pfaendung.monat.weitere_person, 2)}. Gezählt wird, wem Sie tatsächlich Unterhalt leisten: Kinder im eigenen Haushalt ebenso wie ein Kind, an das Sie Barunterhalt überweisen, ein Ehegatte ohne eigenes Einkommen oder der Elternteil eines gemeinsamen Kindes in den ersten Jahren nach der Geburt.</p>
<p>Hat eine dieser Personen eigenes Einkommen, kann der Gläubiger beantragen, dass sie ganz oder teilweise unberücksichtigt bleibt (§ 850c Abs. 6 ZPO). Das Vollstreckungsgericht entscheidet nach billigem Ermessen. Ein Beispiel aus dem Motor: Eine alleinerziehende Mutter mit ${h.eur(mutter.netto)} netto und zwei Kindern muss ${h.eur(mutter.pfaendbar, 2)} abgeben. Zählt das Gericht ein Kind mit Ausbildungsvergütung nicht mehr mit, steigt der pfändbare Betrag auf ${h.eur(mutterEins.pfaendbar, 2)}.</p>
<h2>Der freie Anteil am Mehrverdienst und die Obergrenze</h2>
<p>Über dem Freibetrag ist der Lohn nicht vollständig pfändbar. Drei Zehntel des Mehrbetrags bleiben immer frei, für die erste unterhaltsberechtigte Person zwei Zehntel mehr, für jede weitere ein Zehntel mehr. Bei fünf Personen sind so ${h.pct(h.P.pfaendung.unpfaendbar_zehntel[5] / 10)} des Mehrbetrags geschützt. Diese Rechnung endet bei ${h.eur(h.P.pfaendung.monat.obergrenze, 2)} netto im Monat; was darüber liegt, ist voll pfändbar.</p>
<h2>Was gar nicht erst zum pfändbaren Lohn zählt</h2>
<p>Bevor die Freigrenze angewendet wird, nimmt § 850e ZPO Steuern und Sozialabgaben heraus, außerdem alle Bezüge, die § 850a ZPO für unpfändbar erklärt. Dazu gehören:</p>
<ul>
<li>die Hälfte der Vergütung für Überstunden,</li>
<li>Urlaubsgeld über den normalen Lohn hinaus, Zuwendungen zu besonderen Betriebsereignissen und Treuegelder, soweit sie üblich sind,</li>
<li>Aufwandsentschädigungen, Auslösungen, Gefahren-, Schmutz- und Erschwerniszulagen im üblichen Rahmen,</li>
<li>Weihnachtsgeld bis zur Hälfte des auf volle zehn Euro aufgerundeten monatlichen Grundfreibetrags, ab Juli 2026 also bis ${h.eur(weihnacht)},</li>
<li>Geburts- und Heiratsbeihilfen, Erziehungsgelder, Studienbeihilfen, Sterbe- und Gnadenbezüge sowie Blindenzulagen.</li>
</ul>
<p>Erst der Rest geht in die Tabelle. Gerade in Monaten mit vielen Überstunden lohnt der Blick auf die Lohnabrechnung, ob der Arbeitgeber diese Teile richtig herausgerechnet hat.</p>
<h2>Wenn wegen Unterhalt gepfändet wird</h2>
<p>Für Unterhaltsforderungen gilt die normale Freigrenze nicht. ${h.src('zpo850d', '§ 850d ZPO')} erlaubt Kindern, Ehegatten, früheren Ehegatten und dem Elternteil nach § 1615l BGB den Zugriff über die Grenzen des § 850c hinaus. Dem Schuldner muss aber bleiben, was er für den eigenen notwendigen Unterhalt und für vorrangige oder gleichrangige Berechtigte braucht; die Reihenfolge folgt ${h.src('bgb1609', '§ 1609 BGB')}. Mehr als nach der Tabelle muss ihm dabei nicht verbleiben.</p>
<p>Einen festen Betrag nennt das Gesetz für diesen Fall nicht. Das Vollstreckungsgericht bestimmt ihn im Pfändungsbeschluss; viele Gerichte orientieren sich dabei am sozialrechtlichen Bedarf. Mit dem unterhaltsrechtlichen ${h.a('selbstbehalt', 'Selbstbehalt')} der Düsseldorfer Tabelle ist er nicht gleichzusetzen, auch wenn beide Beträge oft verwechselt werden.</p>
<p>Die vollständige Staffel steht in der ${h.a('pfaendungstabelle', 'Pfändungstabelle 2026')}, den eigenen Betrag rechnet der ${h.a('pfaendungsrechner', 'Pfändungsrechner')}. Gesetzesgrundlage ist ${h.src('zpo850c', '§ 850c ZPO')}. Diese Erläuterung der Pfändungsfreigrenze ist allgemeine Information und keine Rechtsberatung im Einzelfall.</p>`,
  },
  en: {
    slug: 'garnishment-exemption',
    nav: 'Garnishment exemption',
    card: 'Basic exemption, increases per dependant, the upper limit and the parts of your pay that are never garnished.',
    title: 'Garnishment Exemption Germany 2026: Protected Wage Amount',
    description: `German garnishment exemption 2026: ${EN.eur(Z.monat.grundfreibetrag, 2)} protected from 1 July, increases per dependant, upper limit, exempt pay items and maintenance debt rules.`,
    h1: 'Germany’s 2026 garnishment exemption: the part of your pay a creditor cannot touch',
    intro: 'How the protected amount (Pfändungsfreigrenze) is put together, and which items of pay are left out before any calculation starts.',
    resume: `In Germany a creditor can never take the whole of your wage. From 1 July 2026 the basic exemption (Grundfreibetrag) under section 850c of the Code of Civil Procedure (ZPO) is ${EN.eur(Z.monat.grundfreibetrag, 2)} a month, ${EN.eur(Z.woche.grundfreibetrag, 2)} a week or ${EN.eur(Z.tag.grundfreibetrag, 2)} a day of net pay. Supporting one person by law adds ${EN.eur(Z.monat.erste_person, 2)} a month, each of the second to fifth person ${EN.eur(Z.monat.weitere_person, 2)}. Two dependants therefore protect ${EN.eur(freibetrag(2), 2)}, five protect ${EN.eur(freibetrag(5), 2)}. Above the exemption a further share of your earnings stays free, larger with every dependant, up to a ceiling of ${EN.eur(Z.monat.obergrenze, 2)}. Until 30 June 2026 the basic figure was ${EN.eur(ALT.grundfreibetrag, 2)}. Some items never enter the calculation under section 850a ZPO, such as half of overtime pay or a Christmas bonus up to ${EN.eur(weihnacht)}. When the creditor is owed maintenance, the enforcement court fixes the protected sum case by case (section 850d ZPO).`,
    faqs: [
      { q: 'What is the 2026 garnishment exemption for a single person with no children in Germany?', a: `From 1 July 2026, ${EN.eur(Z.monat.grundfreibetrag, 2)} of monthly net pay is protected, against ${EN.eur(ALT.grundfreibetrag, 2)} until the end of June. Because the table works in ten-euro steps, money is taken only from ${EN.eur(pfaendbarAb(0))} net. Even then, part of each euro above the limit remains yours, so the excess is never taken in full below the ceiling.` },
      { q: 'Does my unmarried partner raise my garnishment exemption?', a: `Only if you owe that person maintenance by law. Section 850c(2) ZPO lists spouses, former spouses, registered partners, relatives in direct line and the other parent of your child under sections 1615l and 1615n of the Civil Code (BGB). A cohabiting partner without a common child does not count for wages, although the P-Konto rules for bank balances cover some further household cases.` },
      { q: 'Is a Christmas bonus protected from garnishment in Germany?', a: `Up to half of the monthly basic exemption rounded up to the next ten euros, it is ignored altogether (section 850a no. 4 ZPO): ${EN.eur(weihnacht)} from 1 July 2026. Only the part above that is added to the month’s net pay and run through the table. Holiday pay on top of normal wages is also left out, as long as it stays within what is customary.` },
      { q: 'Can a court raise my garnishment exemption above the table?', a: `Yes, on your application to the enforcement court (Vollstreckungsgericht). Section 850f(1) ZPO lets it leave you more if otherwise your basic living costs as defined in German welfare law are not covered, if you have special personal or work-related needs, or if you support an unusually large family, unless the creditor’s overriding interests stand against it.` },
      { q: 'How does the garnishment exemption work for unpaid child support arrears?', a: `Maintenance debts allow deeper garnishment, but you must keep enough for your own basic needs and for people who rank ahead of the creditor. For arrears that fell due more than one year before the application, that privilege applies only if you deliberately avoided paying (section 850d(1) ZPO). Otherwise the ordinary exemption protects you for those older arrears.` },
    ],
    body: (h) => `<h2>Three building blocks</h2>
<p>German law assembles the protected amount from three parts. Everyone gets the basic exemption of section 850c(1) ZPO. People who support others by law get increases under subsection 2. And subsection 3 keeps a share of any earnings above those figures free as well. The 2026 values are set by the ${h.src('pfaendBek2026', '2026 Garnishment Limits Notice')}.</p>
${h.table(['Dependants', 'Exemption from 1 July 2026', 'until 30 June 2026', 'Increase', 'garnishable from net pay of'],
  PERS.map((n) => [n === 5 ? '5 or more' : String(n), h.eur(freibetrag(n), 2), h.eur(altFrei(n), 2), h.eur(plus(n), 2), h.eur(pfaendbarAb(n))]),
  'Monthly garnishment exemption under section 850c ZPO', ['l', 'r', 'r', 'r', 'r'])}
<p>The last column gives the first net wage at which the table shows any amount. Earn just below it and your employer deducts nothing, even with a garnishment order on file.</p>
<h2>The basic exemption</h2>
<p>The basic figure secures a minimum to live on and follows the income tax basic allowance, which is why it moves by the same percentage every 1 July. From July 2026, ${h.eur(h.P.pfaendung.monat.grundfreibetrag, 2)} a month, ${h.eur(h.P.pfaendung.woche.grundfreibetrag, 2)} a week and ${h.eur(h.P.pfaendung.tag.grundfreibetrag, 2)} a day are out of a creditor’s reach. The period your pay covers decides which figure applies.</p>
<h2>Increases for dependants</h2>
<p>The first person you support adds ${h.eur(h.P.pfaendung.monat.erste_person, 2)}, each further one up to the fifth ${h.eur(h.P.pfaendung.monat.weitere_person, 2)}. What counts is support you actually provide under a legal duty: children at home, a child elsewhere to whom you transfer money, a spouse without income, or the other parent of your baby in the years after the birth.</p>
<p>For many expats the family is spread over two countries. A spouse and a child still living abroad can count, provided you really maintain them under a legal duty. An example from the engine: on ${h.eur(expat.netto)} net with a non-working spouse and one child, ${h.eur(expat.pfaendbar, 2)} a month is garnishable and ${h.eur(expat.verbleibt, 2)} is paid out. If a dependant has income of their own, the creditor can ask the court to disregard them wholly or partly (section 850c(6) ZPO).</p>
<h2>The free share above the exemption, and the ceiling</h2>
<p>Pay above the exemption is not all garnishable. Three tenths of the excess always stay with you, two tenths more for the first dependant and one tenth more for each further one. With five dependants, ${h.pct(h.P.pfaendung.unpfaendbar_zehntel[5] / 10)} of the excess is protected. The calculation stops at ${h.eur(h.P.pfaendung.monat.obergrenze, 2)} of monthly net pay; every euro beyond that can be taken.</p>
<h2>Pay that never enters the calculation</h2>
<p>Section 850e ZPO first removes tax and social contributions, then everything section 850a ZPO declares exempt. That includes:</p>
<ul>
<li>half of overtime pay,</li>
<li>holiday pay on top of normal wages, bonuses for special company events and loyalty payments, if customary,</li>
<li>expense allowances, travel allowances, danger, dirt and hardship supplements within the usual range,</li>
<li>a Christmas bonus up to half of the monthly basic exemption rounded up to full ten euros, ${h.eur(weihnacht)} from July 2026,</li>
<li>birth and marriage grants, education allowances, study grants, death benefits and blindness allowances.</li>
</ul>
<p>Only what is left goes into the table. In a month with heavy overtime it is worth checking the payslip (Lohnabrechnung) to see whether payroll took these items out.</p>
<h2>When the creditor is owed maintenance</h2>
<p>The ordinary exemption does not bind maintenance creditors. ${h.src('zpo850d', 'Section 850d ZPO')} lets children, spouses, former spouses and an unmarried parent go below it. You must still keep what you need for your own basic support and for people ranking ahead of or equal to the creditor under ${h.src('bgb1609', 'section 1609 BGB')}, but never more than the ordinary table would leave.</p>
<p>The statute sets no figure for this. The enforcement court writes it into the order, and many courts take welfare-law needs as their guide. It is not the same as the self-retention (${h.a('selbstbehalt', 'Selbstbehalt')}) used to calculate maintenance, even though the two are often confused.</p>
<p>The full scale is in the ${h.a('pfaendungstabelle', '2026 garnishment table')}, and the ${h.a('pfaendungsrechner', 'garnishment calculator')} works out your figure. The rule itself is ${h.src('zpo850c', 'section 850c ZPO')}. This explanation of the garnishment exemption is general information, not legal advice on your case.</p>`,
  },
});
