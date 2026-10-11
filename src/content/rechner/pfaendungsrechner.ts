import { defineGuide } from '../../lib/guide-types';
import { pfaendbar, pKonto } from '../../lib/engine/pfaendung';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor, wie sie der Rechner anzeigt. */
const Z = P.pfaendung;
/** Startwerte des Rechners: 2.400 € im Monat, keine Unterhaltspflicht. */
const start = pfaendbar(2400, 0);
/** Familie: 3.120 € netto, zwei Unterhaltsberechtigte, zwei Kinder mit Kindergeld. */
const fam = pfaendbar(3120, 2);
const famKonto = pKonto(2, 2);
/** Spalten der Vergleichszeile bei 3.120 €. */
const zeile = [0, 1, 2, 3, 4, 5].map((p) => pfaendbar(3120, p).pfaendbar);
/** Wochenlohn 590 €, eine Person. */
const woche = pfaendbar(590, 1, 'woche');

export default defineGuide({
  id: 'pfaendungsrechner',
  group: 'pfaendung',
  order: 5,
  tool: 'pfaendung',
  related: ['pfaendungstabelle', 'pfaendungsfreigrenze', 'p-konto', 'selbstbehalt', 'verfahrenskostenhilfe'],
  sources: ['pfaendBek2026', 'zpo850c', 'zpo899', 'zpo902'],
  de: {
    slug: 'pfaendungsrechner',
    nav: 'Pfändungsrechner',
    card: 'Pfändbarer Lohn nach Monat, Woche oder Tag, Vergleich für 0 bis 5 Unterhaltspflichten und P-Konto-Betrag.',
    title: 'Pfändungsrechner 2026: pfändbarer Lohn und P-Konto ab Juli',
    description: `Pfändungsrechner 2026 nach der Tabelle ab 1. Juli: Freibetrag ab ${DE.eur(Z.monat.grundfreibetrag, 2)}, pfändbarer Lohn je Monat, Woche oder Tag, P-Konto mit Kindergeld, Rechenweg.`,
    h1: 'Pfändungsrechner: wie viel vom Lohn gepfändet werden darf',
    intro: 'Nettolohn und Unterhaltspflichten eingeben; der Rechner zeigt den pfändbaren Betrag, was Ihnen bleibt, und den Schutz auf dem P-Konto.',
    resume: `Der Pfändungsrechner wendet die amtlichen Beträge an, die seit dem 1. Juli 2026 gelten. Bei ${DE.eur(2400)} Nettolohn im Monat ohne Unterhaltspflicht darf der Arbeitgeber ${DE.eur(start.pfaendbar, 2)} an den Gläubiger abführen, ausgezahlt werden ${DE.eur(start.verbleibt, 2)}. Grundlage ist der Freibetrag von ${DE.eur(Z.monat.grundfreibetrag, 2)}, der sich für die erste unterhaltsberechtigte Person um ${DE.eur(Z.monat.erste_person, 2)} und für jede weitere bis zur fünften um ${DE.eur(Z.monat.weitere_person, 2)} erhöht. Vom Lohn über dem Freibetrag ist nur ein Teil pfändbar, ohne Unterhaltspflicht ${DE.pct(start.anteilPfaendbar)}. Wer bei ${DE.eur(3120)} netto zwei Personen Unterhalt zahlt, behält ${DE.eur(fam.verbleibt, 2)} und verliert ${DE.eur(fam.pfaendbar, 2)}. Der Rechner zeigt zusätzlich den Betrag für alle Zahlen von Unterhaltspflichten nebeneinander, rechnet auf Wunsch mit Wochen- oder Tageslohn und nennt das monatlich geschützte Guthaben auf dem P-Konto, mit Kindergeld für zwei Kinder in diesem Beispiel ${DE.eur(famKonto.summe, 2)}. Jeder Schritt lässt sich im Rechenweg nachlesen.`,
    faqs: [
      { q: 'Welchen Betrag trage ich im Pfändungsrechner als Nettoeinkommen ein?', a: `Den Lohn nach Abzug von Lohnsteuer und Sozialversicherungsbeiträgen, wie ihn § 850e ZPO versteht. Unpfändbare Teile nach § 850a ZPO, etwa die Hälfte der Überstundenvergütung oder übliche Erschwerniszulagen, ziehen Sie vorher selbst ab, denn der Rechner fragt sie nicht einzeln ab. Kindergeld gehört nicht in dieses Feld, dafür gibt es das eigene Feld für das P-Konto.` },
      { q: 'Warum zeigt der Pfändungsrechner bei Wochenlohn einen anderen P-Konto-Betrag?', a: `Er zeigt ihn nicht anders: Der Wert für das P-Konto ist immer ein Monatsbetrag, weil das Konto nach § 899 ZPO je Kalendermonat schützt. Die Auswahl Woche oder Tag ändert nur die Lohnberechnung, also Freibetrag, Rundung und Obergrenze. Wer wöchentlich bezahlt wird, vergleicht deshalb die Summe der Wochenzahlungen eines Monats mit dem Kontofreibetrag.` },
      { q: 'Rechnet der Pfändungsrechner auch eine Pfändung wegen Unterhaltsschulden?', a: `Nein. Er wendet die normale Tabelle des § 850c ZPO an. Pfändet ein Kind oder ein früherer Ehegatte wegen Unterhalts, darf nach § 850d ZPO tiefer gepfändet werden, und das Vollstreckungsgericht nennt den Betrag, der bleibt, im Beschluss. Das Ergebnis des Rechners zeigt dann nur, wie viel Ihnen höchstens bleiben müsste.` },
      { q: 'Kann ich das Ergebnis des Pfändungsrechners mit der Schuldnerberatung teilen?', a: `Ja. Alle Eingaben stehen in der Adresszeile; mit „Link teilen“ kopieren Sie diese Adresse, mit „Ergebnis kopieren“ einen Satz mit Betrag und Link, mit „Drucken“ erhalten Sie eine Seite für die Unterlagen. Der Link enthält nur Ihre Eingaben, keinen Namen und keine Kontodaten. So kann die Beratungsstelle die Rechnung sofort nachvollziehen.` },
    ],
    body: (h) => `<h2>Die vier Eingaben</h2>
<ul>
<li><strong>Nettoeinkommen:</strong> Lohn nach Steuern und Sozialabgaben im Sinne von § 850e ZPO, mit Cent. Voreingestellt sind ${h.eur(2400)}.</li>
<li><strong>Unterhaltspflichten:</strong> Zahl der Personen, denen Sie gesetzlich Unterhalt gewähren, von 0 bis „5 und mehr“. Mehr als fünf zählt das Gesetz nicht.</li>
<li><strong>Auszahlung für:</strong> Monat, Woche oder Tag. Je nach Wahl nutzt der Rechner die passenden Freibeträge, Obergrenzen und Rundungsstufen der ${h.src('pfaendBek2026', 'Pfändungsfreigrenzenbekanntmachung 2026')}.</li>
<li><strong>Kinder mit Kindergeld (P-Konto):</strong> Diese Zahl wirkt nur auf den Kontoschutz, nicht auf die Lohnpfändung.</li>
</ul>
<h2>Was im Ergebnis steht</h2>
<p>Oben steht groß der pfändbare Betrag für den gewählten Zeitraum, darunter, was Ihnen bleibt. Es folgen der Pfändungsfreibetrag, der Hinweis, dass die Werte ab dem 1. Juli 2026 gelten, und das monatlich geschützte Guthaben auf dem P-Konto nach ${h.src('zpo899', '§ 899')} und ${h.src('zpo902', '§ 902 ZPO')}. Unter den Eingaben zeigt eine Zeile den pfändbaren Betrag für 0 bis 5 Unterhaltspflichten nebeneinander; Ihre Auswahl ist fett.</p>
<p>Der aufklappbare Rechenweg nennt die Schritte: Freibetrag aus Grundbetrag und Erhöhungen, Abrundung des Lohns nach § 850c Abs. 5 ZPO, pfändbarer Anteil am Mehrbetrag und, bei hohen Löhnen, der voll pfändbare Teil über der Obergrenze.</p>
<h2>Beispiel: Familie mit ${h.eur(3120)} netto</h2>
<p>Ein Vater zahlt Unterhalt für zwei Kinder, die Kindergeld beziehen und bei ihm leben. Sein Freibetrag beträgt ${h.eur(fam.freibetrag, 2)}. Vom Mehrbetrag sind ${h.pct(fam.anteilPfaendbar)} pfändbar, das ergibt ${h.eur(fam.pfaendbar, 2)} im Monat; ausgezahlt werden ${h.eur(fam.verbleibt, 2)}. Auf dem P-Konto wären ${h.eur(famKonto.summe, 2)} geschützt, sofern eine Bescheinigung über Kinder und Kindergeld vorliegt.</p>
${h.table(['Unterhaltspflichten', '0', '1', '2', '3', '4', '5+'], [
  ['pfändbar bei ' + h.eur(3120), ...zeile.map((v) => (v > 0 ? h.eur(v, 2) : 'nichts'))],
], 'Vergleichszeile des Rechners, Monatslohn', ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>Bei Wochenlohn sieht die Rechnung anders aus: ${h.eur(woche.netto)} pro Woche mit einer unterhaltsberechtigten Person ergeben ${h.eur(woche.pfaendbar, 2)} pfändbar je Woche, gerundet auf Stufen von ${h.eur(h.P.pfaendung.woche.rundung, 2)}.</p>
<h2>Grenzen des Rechners</h2>
<ul>
<li>Er nimmt den eingegebenen Betrag als Nettolohn und zieht keine Bezüge nach § 850a ZPO heraus.</li>
<li>Pfändungen wegen Unterhalts nach § 850d ZPO und wegen vorsätzlicher unerlaubter Handlung nach § 850f Abs. 2 ZPO folgen anderen Regeln; dort entscheidet das Vollstreckungsgericht.</li>
<li>Ob eine Person mit eigenem Einkommen nach § 850c Abs. 6 ZPO nicht mitgezählt wird, bestimmt ebenfalls das Gericht.</li>
<li>Für das P-Konto rechnet er mit dem Grundfreibetrag, den Unterhaltserhöhungen und dem Kindergeld, nicht mit weiteren Erhöhungsbeträgen wie Leistungen für eine Bedarfsgemeinschaft oder einem Übertrag aus Vormonaten.</li>
</ul>
<p>Die ganze Staffel steht in der ${h.a('pfaendungstabelle', 'Pfändungstabelle 2026')}, die Regeln zum Konto beim ${h.a('p-konto', 'P-Konto')}. Rechtsgrundlage ist ${h.src('zpo850c', '§ 850c ZPO')}. Das Ergebnis des Pfändungsrechners ist allgemeine Information, keine Rechtsberatung; eine Schuldnerberatungsstelle prüft kostenlos, ob Ihr Arbeitgeber richtig abzieht.</p>`,
  },
  en: {
    slug: 'garnishment-calculator',
    nav: 'Garnishment calculator',
    card: 'Garnishable pay per month, week or day, compared for 0 to 5 dependants, plus the P-Konto amount.',
    title: 'Garnishment Calculator Germany 2026: Wages and P-Konto',
    description: `German wage garnishment calculator 2026, table from 1 July: ${EN.eur(Z.monat.grundfreibetrag, 2)} exempt, garnishable pay per month, week or day, P-Konto balance with child benefit.`,
    h1: 'Garnishment calculator: how much of your German pay can be taken',
    intro: 'Enter your net pay and dependants to see the garnishable amount, what you keep, and the protection on a P-Konto.',
    resume: `The calculator applies the official German figures in force since 1 July 2026. On ${EN.eur(2400)} of monthly net pay with nobody to support, your employer may send ${EN.eur(start.pfaendbar, 2)} to the creditor and pays you ${EN.eur(start.verbleibt, 2)}. It starts from the ${EN.eur(Z.monat.grundfreibetrag, 2)} exemption (Pfändungsfreibetrag), raised by ${EN.eur(Z.monat.erste_person, 2)} for the first person you maintain by law and ${EN.eur(Z.monat.weitere_person, 2)} for each further one up to five. Only part of the pay above the exemption can be taken, ${EN.pct(start.anteilPfaendbar)} with no dependants. A parent earning ${EN.eur(3120)} net and supporting two people keeps ${EN.eur(fam.verbleibt, 2)} and loses ${EN.eur(fam.pfaendbar, 2)}. The tool also lists the result for every number of dependants side by side, handles weekly or daily pay, and shows the monthly balance protected on a garnishment-protection account (P-Konto): ${EN.eur(famKonto.summe, 2)} in this example with child benefit for two children. A step-by-step breakdown explains each figure.`,
    faqs: [
      { q: 'Which net pay should an expat enter in the German garnishment calculator?', a: `Your pay after German wage tax and social insurance, as section 850e ZPO defines net earnings. Deduct exempt items under section 850a ZPO yourself first, for instance half of overtime pay, because the calculator does not ask for them. On a German payslip (Lohnabrechnung) look for net pay before the garnishment itself is deducted, otherwise the amount would be counted twice.` },
      { q: 'Does the garnishment calculator show a weekly P-Konto amount?', a: `No. The P-Konto figure is always monthly, because the account protects a balance per calendar month under section 899 ZPO. Choosing week or day changes only the wage side: exemption, rounding steps and ceiling. If you are paid weekly, compare a month’s worth of weekly payments with the account allowance.` },
      { q: 'Can the garnishment calculator handle a garnishment for child support arrears?', a: `No. It applies the ordinary scale of section 850c ZPO. When a child or former spouse enforces maintenance, section 850d ZPO allows deeper garnishment and the enforcement court states in its order what you keep. The calculator then only shows the most you could ever be left with.` },
      { q: 'How do I share a garnishment calculation with a debt adviser?', a: `All inputs sit in the page address. “Share link” copies that address, “Copy result” copies a sentence with the amount and the link, and “Print” gives you a page for your files. The link carries only your inputs, no name or account details, so an adviser can open exactly the same calculation.` },
    ],
    body: (h) => `<h2>The four inputs</h2>
<ul>
<li><strong>Net income:</strong> pay after tax and social contributions as defined in section 850e of the Code of Civil Procedure (ZPO), to the cent. The default is ${h.eur(2400)}.</li>
<li><strong>People you support:</strong> how many people you maintain under a legal duty, from 0 to “5 or more”. German law counts no more than five.</li>
<li><strong>Paid per:</strong> month, week or day. The tool switches to the matching exemptions, ceilings and rounding steps from the ${h.src('pfaendBek2026', '2026 Garnishment Limits Notice')}.</li>
<li><strong>Children with child benefit (P-Konto):</strong> this affects only the account protection, not the wage garnishment.</li>
</ul>
<h2>What the result shows</h2>
<p>The headline is the garnishable amount for the chosen period, with what you keep underneath. Then come the exemption, the note that the figures apply from 1 July 2026, and the monthly balance protected on a P-Konto under ${h.src('zpo899', 'section 899')} and ${h.src('zpo902', 'section 902 ZPO')}. Below the inputs a row lists the garnishable amount for 0 to 5 dependants, with your choice in bold.</p>
<p>The collapsible step-by-step section shows the exemption built from the basic amount and increases, the rounding down of your pay under section 850c(5) ZPO, the share of the excess that can be taken and, for high earners, the fully garnishable part above the ceiling.</p>
<h2>Example: a family on ${h.eur(3120)} net</h2>
<p>An employee in Germany supports two children who live with him and receive child benefit (Kindergeld). His exemption is ${h.eur(fam.freibetrag, 2)}; ${h.pct(fam.anteilPfaendbar)} of the excess is garnishable, giving ${h.eur(fam.pfaendbar, 2)} a month and a payout of ${h.eur(fam.verbleibt, 2)}. On a P-Konto, ${h.eur(famKonto.summe, 2)} would be protected once the bank has a certificate covering the children and the benefit.</p>
${h.table(['Dependants', '0', '1', '2', '3', '4', '5+'], [
  ['garnishable on ' + h.eur(3120), ...zeile.map((v) => (v > 0 ? h.eur(v, 2) : 'nothing'))],
], 'Comparison row as the calculator shows it, monthly pay', ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>Weekly pay works on its own scale: ${h.eur(woche.netto)} a week with one dependant leaves ${h.eur(woche.pfaendbar, 2)} garnishable per week, in rounding steps of ${h.eur(h.P.pfaendung.woche.rundung, 2)}.</p>
<h2>Limits of the tool</h2>
<ul>
<li>It treats your entry as net pay and does not strip out exempt items under section 850a ZPO.</li>
<li>Garnishment for maintenance (section 850d ZPO) or for a debt from an intentional tort (section 850f(2) ZPO) follows other rules set by the enforcement court.</li>
<li>Whether a dependant with income of their own is left out under section 850c(6) ZPO is also for the court.</li>
<li>For the P-Konto it adds the basic allowance, the dependant increases and child benefit, but no other increases, such as payments for a benefits household, and no carry-over from earlier months.</li>
</ul>
<p>The full scale is in the ${h.a('pfaendungstabelle', '2026 garnishment table')} and the account rules under ${h.a('p-konto', 'protected account')}. The legal basis is ${h.src('zpo850c', 'section 850c ZPO')}. The calculator’s result is general information, not legal advice; a free debt counselling service (Schuldnerberatung) can check whether your employer deducts the right amount.</p>`,
  },
});
