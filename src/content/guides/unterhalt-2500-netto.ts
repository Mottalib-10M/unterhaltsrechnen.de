/** Unterhalt bei 2.500 € netto: Gruppe 2, aber ab zwei Kindern Herabstufung durch den Bedarfskontrollbetrag. */
import { defineGuide } from '../../lib/guide-types';
import { kindesunterhalt, gruppeVon, gruppeVonBis, bkb } from '../../lib/engine/dt';
import { P, DE, EN } from '../../lib/fmt';

const N = 2500;
const g = gruppeVon(N);
const [von, bis] = gruppeVonBis(g);
const k15 = kindesunterhalt(N, [{ alter: 15 }]);
const k6 = kindesunterhalt(N, [{ alter: 6 }]);
const zwei = kindesunterhalt(N, [{ alter: 6 }, { alter: 10 }]);
const zweiOhne = kindesunterhalt(N, [{ alter: 6 }, { alter: 10 }], { bkb: false });
const drei = kindesunterhalt(N, [{ alter: 2 }, { alter: 6 }, { alter: 10 }]);
const einsZu = kindesunterhalt(N, [{ alter: 6 }], { anzahlAnpassung: true });
const B2 = bkb(g);
const B1 = bkb(0);

export default defineGuide({
  id: 'unterhalt-2500-netto',
  group: 'betrag',
  order: 20,
  mini: 'kuBetrag',
  miniDefaults: { n: 2500 },
  miniHref: 'kindesunterhalt-rechner',
  related: ['bedarfskontrollbetrag', 'zahlbetragstabelle', 'mangelfall', 'unterhalt-1800-netto', 'unterhalt-3500-netto'],
  sources: ['olgDtPdf', 'bgb1612a', 'bgb1609'],
  de: {
    slug: 'unterhalt-bei-2500-euro-netto',
    nav: 'Unterhalt bei 2.500 € netto',
    card: 'Gruppe 2 der Tabelle, doch ab dem zweiten Kind rechnet das Gericht meist eine Gruppe tiefer.',
    title: 'Unterhalt bei 2.500 € netto 2026: Gruppe 2 und Herabstufung',
    description: `Unterhalt bei 2.500 € netto 2026: Gruppe ${g + 1} der Düsseldorfer Tabelle, ${DE.eur(k6.summe, 2)} für ein Kind von 6, mit zwei Kindern Herabstufung wegen ${DE.eur(B2)} Kontrollbetrag.`,
    h1: 'Kindesunterhalt bei 2.500 € netto',
    intro: 'Mit einem Kind zahlen Sie nach Gruppe 2, mit zweien kippt die Rechnung in Gruppe 1, mit dreien in den Mangelfall.',
    resume: `Ein bereinigtes Nettoeinkommen von ${DE.eur(N)} liegt in Gruppe ${g + 1} der Düsseldorfer Tabelle 2026, die von ${DE.eur(von)} bis ${DE.eur(bis)} reicht. Für ein einziges Kind zahlen Sie den Zahlbetrag dieser Gruppe: ${DE.eur(k6.summe, 2)} für ein Kind von sechs bis elf Jahren, ${DE.eur(k15.summe, 2)} für ein Kind von zwölf bis siebzehn. Bei zwei Kindern greift der Bedarfskontrollbetrag: In Gruppe ${g + 1} müssen Ihnen nach allen Zahlungen ${DE.eur(B2)} bleiben. Mit zwei Kindern von sechs und zehn Jahren wären es nur ${DE.eur(zweiOhne.verbleibt, 2)}, deshalb wird in Gruppe ${zwei.gruppe + 1} gerechnet und Sie zahlen ${DE.eur(zwei.summe, 2)} statt ${DE.eur(zweiOhne.summe, 2)}. Kommt ein drittes, zweijähriges Kind hinzu, reicht das Einkommen nicht mehr für den Mindestunterhalt aller drei bei einem Selbstbehalt von ${DE.eur(P.selbstbehalt.notwendig_erwerbstaetig)}: Mangelfall, ${DE.eur(drei.verteilungsmasse)} werden verteilt.`,
    faqs: [
      { q: 'Wie viel Unterhalt für zwei Kinder bei 2.500 € netto?', a: `Nach der Tabelle 2026 zusammen ${DE.eur(zwei.summe, 2)} im Monat, wenn die Kinder sechs und zehn Jahre alt sind und Sie erwerbstätig sind. Gerechnet wird in Gruppe ${zwei.gruppe + 1}, weil Ihnen in Gruppe ${g + 1} weniger als der Bedarfskontrollbetrag von ${DE.eur(B2)} bliebe. Ihnen bleiben ${DE.eur(zwei.verbleibt, 2)}. Manche Gerichte stufen weniger streng herab; dann wären es ${DE.eur(zweiOhne.summe, 2)}.` },
      { q: 'Kann ich bei nur einem Kind höher eingestuft werden?', a: `Ja, das ist möglich. Die Tabelle ist auf zwei Unterhaltsberechtigte zugeschnitten; bei nur einem Kind darf das Gericht eine Gruppe höher gehen (Anmerkung A I). Für ein Kind von sechs Jahren wären das ${DE.eur(einsZu.summe, 2)} statt ${DE.eur(k6.summe, 2)}. Ob und wie weit höhergestuft wird, liegt im Ermessen des Gerichts und hängt vom Einzelfall ab.` },
      { q: 'Zählt mein Weihnachtsgeld zu den 2.500 €?', a: `Ja. Unterhaltsrechtlich zählt das Jahreseinkommen geteilt durch zwölf, also mit Urlaubs- und Weihnachtsgeld, Prämien und Steuererstattungen. Wer monatlich ${DE.eur(2300)} netto erhält und zusätzlich ein Monatsgehalt Weihnachtsgeld, landet rechnerisch bei rund ${DE.eur(2300 * 13 / 12)} und damit in derselben Gruppe. Berufsbedingte Kosten werden danach abgezogen.` },
      { q: 'Was passiert bei drei Kindern mit 2.500 € netto?', a: `Dann liegt ein Mangelfall vor: Nach dem Selbstbehalt von ${DE.eur(P.selbstbehalt.notwendig_erwerbstaetig)} bleiben ${DE.eur(drei.verteilungsmasse)}, die im Verhältnis der Mindestbeträge geteilt werden. Für Kinder von zwei, sechs und zehn Jahren ergibt das ${drei.kinder.map((k) => DE.eur(k.zahlbetrag, 2)).join(', ')}. Für die Kinder unter zwölf kann Unterhaltsvorschuss die Lücke teilweise füllen.` },
    ],
    body: (h) => `<h2>Wo 2.500 € in der Tabelle stehen</h2>
<p>Gruppe ${g + 1} umfasst bereinigte Nettoeinkommen von ${h.eur(von)} bis ${h.eur(bis)}. Der Bedarf liegt hier bei ${h.pct(h.P.dt.prozent[g] / 100, 0)} des Mindestunterhalts. Wichtiger als dieser kleine Aufschlag ist der Kontrollbetrag: Er steigt von ${h.eur(B1)} in Gruppe 1 auf ${h.eur(B2)} in Gruppe ${g + 1}. Wer knapp über der Grenze der ersten Gruppe verdient, muss deshalb mehr übrig behalten als jemand darunter.</p>
<h2>Ein Kind: es bleibt bei Gruppe ${g + 1}</h2>
${h.table(['Alter des Kindes', 'Bedarf', 'minus halbes Kindergeld', 'Zahlbetrag', 'Ihnen bleiben'], [0, 1, 2].map((s) => { const r = kindesunterhalt(N, [{ alter: [3, 8, 14][s] }]); return [['0 bis 5', '6 bis 11', '12 bis 17'][s], h.eur(r.kinder[0].bedarf), h.eur(r.kinder[0].kindergeld, 2), h.eur(r.summe, 2), h.eur(r.verbleibt, 2)]; }), `Ein Kind, ${h.eur(N)} bereinigtes Netto, erwerbstätig`, ['l', 'r', 'r', 'r', 'r'])}
<p>In allen drei Fällen bleibt mehr als ${h.eur(B2)}. Die Tabelle gilt also, wie sie gedruckt ist.</p>
<h2>Zwei Kinder: der Kontrollbetrag entscheidet</h2>
<p>Zwei Kinder von sechs und zehn Jahren kosten in Gruppe ${g + 1} zusammen ${h.eur(zweiOhne.summe, 2)}. Danach blieben ${h.eur(zweiOhne.verbleibt, 2)}, weniger als ${h.eur(B2)}. Die Anmerkung A III der Tabelle verlangt dann eine Herabstufung, bis der Betrag der neuen Gruppe gewahrt ist. In Gruppe ${zwei.gruppe + 1} kosten beide Kinder ${h.eur(zwei.summe, 2)}, übrig bleiben ${h.eur(zwei.verbleibt, 2)} und damit mehr als ${h.eur(zwei.bkbWert)}. Die Ersparnis von ${h.eur(zweiOhne.summe - zwei.summe, 2)} im Monat ist kein Rabatt, sondern der Zweck der Regel: Sie soll ein Gefälle zwischen dem Lebensstandard des Zahlenden und dem der Kinder verhindern. Mehr dazu auf der Seite ${h.a('bedarfskontrollbetrag', 'Bedarfskontrollbetrag')}.</p>
<h2>Drei Kinder: nicht mehr genug für alle</h2>
<p>Mit einem dritten Kind von zwei Jahren reicht auch Gruppe 1 nicht: Der Mindestunterhalt aller drei würde Ihren Selbstbehalt angreifen. Es gilt der ${h.a('mangelfall', 'Mangelfall')}; verteilt werden ${h.eur(drei.verteilungsmasse)}.</p>
<ul>${drei.kinder.map((k) => `<li>Kind von ${k.alter} Jahren: ${h.eur(k.zahlbetrag, 2)} statt ${h.eur(k.tabellenZahlbetrag, 2)}</li>`).join('')}</ul>
<h2>Was sich bei 2.500 € oft verschiebt</h2>
<p>Liegt Ihr Einkommen knapp an einer Gruppengrenze, entscheiden Kleinigkeiten: Fahrtkosten zur Arbeit, Beiträge zur zusätzlichen Altersvorsorge oder eine anerkannte Kreditrate können das bereinigte Netto unter ${h.eur(von)} drücken. Umgekehrt heben eine Steuererstattung oder Überstundenzuschläge es an. Wie die Bereinigung funktioniert, steht unter ${h.a('bereinigtes-netto', 'bereinigtes Nettoeinkommen')}. Alle Beträge folgen der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} und § 1612a BGB; sie sind eine allgemeine Berechnung, keine Beurteilung Ihres Verfahrens.</p>`,
  },
  en: {
    slug: 'child-support-on-2500-net',
    nav: 'Support on €2,500 net',
    card: 'Group 2 of the table, yet from the second child the court usually calculates one group lower.',
    title: 'Child Support on €2,500 Net 2026: Group 2 and Lower',
    description: `Child support on €2,500 net in Germany 2026: group ${g + 1} of the Düsseldorf Table, ${EN.eur(k6.summe, 2)} for a child of six, a lower group with two children via the ${EN.eur(B2)} check.`,
    h1: 'German child support on €2,500 net a month',
    intro: 'With one child you pay under group 2, with two the calculation drops into group 1, with three into the shortfall rule.',
    resume: `Adjusted net income of ${EN.eur(N)} falls into group ${g + 1} of the 2026 Düsseldorf Table, which covers ${EN.eur(von)} to ${EN.eur(bis)}. With one child you pay that group’s amount: ${EN.eur(k6.summe, 2)} for a child aged six to eleven, ${EN.eur(k15.summe, 2)} for a teenager of twelve to seventeen. With two children the needs-control amount (Bedarfskontrollbetrag) steps in: in group ${g + 1} you must keep ${EN.eur(B2)} after all payments. For two children aged six and ten you would keep only ${EN.eur(zweiOhne.verbleibt, 2)}, so the calculation moves to group ${zwei.gruppe + 1} and you pay ${EN.eur(zwei.summe, 2)} instead of ${EN.eur(zweiOhne.summe, 2)}. Add a third child aged two and the income no longer covers everyone’s minimum while protecting your ${EN.eur(P.selbstbehalt.notwendig_erwerbstaetig)} self-retention (Selbstbehalt): it becomes a shortfall case, and ${EN.eur(drei.verteilungsmasse)} is shared out between the three children.`,
    faqs: [
      { q: 'How much child support for two children on €2,500 net in Germany?', a: `Under the 2026 table ${EN.eur(zwei.summe, 2)} a month in total if the children are six and ten and you work. The court calculates in group ${zwei.gruppe + 1}, because in group ${g + 1} you would keep less than the ${EN.eur(B2)} needs-control amount. You keep ${EN.eur(zwei.verbleibt, 2)}. Some courts lower the group less strictly, which would mean ${EN.eur(zweiOhne.summe, 2)}.` },
      { q: 'Can one child mean a higher group for me?', a: `It can. The table is built for a parent supporting two people; with only one child the court may move one group up (note A I). For a child of six that would be ${EN.eur(einsZu.summe, 2)} rather than ${EN.eur(k6.summe, 2)}. Whether it does is at the court’s discretion and depends on the circumstances.` },
      { q: 'My employer pays a 13th salary. Does it count towards the €2,500?', a: `Yes. German maintenance law uses annual income divided by twelve, including holiday pay, Christmas bonus, other bonuses and tax refunds. Someone paid ${EN.eur(2300)} net a month plus one extra month’s salary ends up at about ${EN.eur(2300 * 13 / 12)}, in the same group. Work-related costs are deducted afterwards.` },
      { q: 'What happens with three children on €2,500 net?', a: `It becomes a shortfall case: after the ${EN.eur(P.selbstbehalt.notwendig_erwerbstaetig)} self-retention, ${EN.eur(drei.verteilungsmasse)} remains and is split in proportion to the minimum amounts. For children aged two, six and ten that gives ${drei.kinder.map((k) => EN.eur(k.zahlbetrag, 2)).join(', ')}. For the children under twelve the maintenance advance can partly close the gap.` },
    ],
    body: (h) => `<h2>Where €2,500 sits in the table</h2>
<p>Group ${g + 1} covers adjusted net incomes from ${h.eur(von)} to ${h.eur(bis)}. Need here is ${h.pct(h.P.dt.prozent[g] / 100, 0)} of the statutory minimum. More important than that small uplift is the control figure: it jumps from ${h.eur(B1)} in group 1 to ${h.eur(B2)} in group ${g + 1}. A parent just above the first group’s limit must therefore keep more than one just below it.</p>
<h2>One child: group ${g + 1} stands</h2>
${h.table(['Child’s age', 'Need', 'minus half child benefit', 'Payable', 'You keep'], [0, 1, 2].map((s) => { const r = kindesunterhalt(N, [{ alter: [3, 8, 14][s] }]); return [['0 to 5', '6 to 11', '12 to 17'][s], h.eur(r.kinder[0].bedarf), h.eur(r.kinder[0].kindergeld, 2), h.eur(r.summe, 2), h.eur(r.verbleibt, 2)]; }), `One child, ${h.eur(N)} adjusted net, working parent`, ['l', 'r', 'r', 'r', 'r'])}
<p>In each case more than ${h.eur(B2)} remains, so the table applies as printed.</p>
<h2>Two children: the control figure decides</h2>
<p>Two children aged six and ten cost ${h.eur(zweiOhne.summe, 2)} together in group ${g + 1}, leaving ${h.eur(zweiOhne.verbleibt, 2)}: below ${h.eur(B2)}. Note A III of the table then requires a lower group until that group’s figure is respected. In group ${zwei.gruppe + 1} both children cost ${h.eur(zwei.summe, 2)} and you keep ${h.eur(zwei.verbleibt, 2)}, above ${h.eur(zwei.bkbWert)}. The ${h.eur(zweiOhne.summe - zwei.summe, 2)} a month difference is not a discount but the purpose of the rule: it keeps the payer’s living standard from falling far below the children’s. See the ${h.a('bedarfskontrollbetrag', 'needs-control amount')} page.</p>
<h2>Three children: not enough for everyone</h2>
<p>With a third child aged two even group 1 does not fit: the three minimum amounts would eat into your self-retention. The ${h.a('mangelfall', 'shortfall rule')} applies and ${h.eur(drei.verteilungsmasse)} is divided.</p>
<ul>${drei.kinder.map((k) => `<li>Child aged ${k.alter}: ${h.eur(k.zahlbetrag, 2)} instead of ${h.eur(k.tabellenZahlbetrag, 2)}</li>`).join('')}</ul>
<h2>What often moves the figure at this income</h2>
<p>Close to a group limit, details decide: commuting costs, contributions to a private pension, or an accepted loan instalment can push adjusted income below ${h.eur(von)}. A tax refund or overtime pay pushes it up. If part of your pay comes in another currency or as a relocation allowance, the court looks at what is actually available to you each month. How adjustment works is explained under ${h.a('bereinigtes-netto', 'adjusted net income')}. All amounts follow the ${h.src('olgDtPdf', '2026 Düsseldorf Table')} and section 1612a BGB; they are a general calculation, not an assessment of your proceedings.</p>`,
  },
});
