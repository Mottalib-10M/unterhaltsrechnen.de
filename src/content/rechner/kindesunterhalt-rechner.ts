import { defineGuide } from '../../lib/guide-types';
import { kindesunterhalt, zahlbetrag } from '../../lib/engine/dt';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor, nie von Hand: zwei Kinder (4 und 9 Jahre) bei 3.200 € und bei 2.300 €. */
const zwei = kindesunterhalt(3200, [{ alter: 4 }, { alter: 9 }]);
const knapp = kindesunterhalt(2300, [{ alter: 4 }, { alter: 9 }]);
const S = P.selbstbehalt;

export default defineGuide({
  id: 'kindesunterhalt-rechner',
  group: 'kind',
  order: 10,
  tool: 'kindesunterhalt',
  related: ['kindesunterhalt', 'zahlbetragstabelle', 'bedarfskontrollbetrag', 'mangelfall', 'selbstbehalt', 'unterhaltsrechner'],
  sources: ['olgDtPdf', 'bgb1603', 'bgb1609', 'bgb1612b'],
  de: {
    slug: 'kindesunterhalt-rechner',
    nav: 'Kindesunterhalt-Rechner',
    card: 'Bis zu sechs Kinder, Bedarfskontrollbetrag und Mangelfall, mit Rechenweg Schritt für Schritt.',
    title: 'Kindesunterhalt-Rechner 2026: mehrere Kinder, Mangelfall',
    description: `Kindesunterhalt-Rechner 2026 nach Düsseldorfer Tabelle: bis zu sechs Kinder, Kindergeld ${DE.eur(P.kindergeld.monat)}, Bedarfskontrollbetrag, Selbstbehalt ${DE.eur(S.notwendig_erwerbstaetig)} und Mangelfall.`,
    h1: 'Kindesunterhalt berechnen, auch für mehrere Kinder',
    intro: 'Der Rechner geht die Tabelle so durch, wie es ein Familiengericht tut: Gruppe, Altersstufe, Kindergeld, Kontrolle, Selbstbehalt.',
    resume: `Mit ${DE.eur(3200)} bereinigtem Netto und zwei Kindern von vier und neun Jahren zahlt ein erwerbstätiger Elternteil nach der Düsseldorfer Tabelle 2026 zusammen ${DE.eur(zwei.summe, 2)} im Monat: ${DE.eur(zwei.kinder[0].zahlbetrag, 2)} und ${DE.eur(zwei.kinder[1].zahlbetrag, 2)}. Sein Einkommen fiele in Gruppe ${zwei.gruppeEinkommen + 1}, gerechnet wird aber in Gruppe ${zwei.gruppe + 1}, weil ihm nach Abzug beider Zahlbeträge der Bedarfskontrollbetrag dieser Gruppe bleiben muss. Von jedem Tabellenbetrag geht das halbe Kindergeld ab, ${DE.eur(P.kindergeld.monat / 2, 2)} je Kind, denn die andere Hälfte gehört dem Elternteil, der betreut (§ 1612b BGB). Sinkt das Einkommen auf ${DE.eur(2300)}, reicht es nicht mehr für den Mindestunterhalt beider Kinder plus den notwendigen Selbstbehalt von ${DE.eur(S.notwendig_erwerbstaetig)}: Dann werden nur noch ${DE.eur(knapp.verteilungsmasse, 2)} im Verhältnis der Zahlbeträge verteilt, das ist der Mangelfall der Anmerkung C. Der Rechner zeigt jeden dieser Schritte und nennt die Regel, die den Betrag bestimmt.`,
    faqs: [
      { q: 'Welches Einkommen trage ich in den Kindesunterhalt-Rechner ein?', a: `Das bereinigte Nettoeinkommen: Lohn nach Steuern und Sozialabgaben, verteilt auf zwölf Monate mit Weihnachts- und Urlaubsgeld, abzüglich anerkannter berufsbedingter Kosten und berücksichtigungsfähiger Schulden. Kindergeld gehört nicht dazu. Bei fiktivem Einkommen gewähren die Leitlinien der Oberlandesgerichte in NRW pauschal ${DE.pct(P.leitlinien.pauschale_berufsbedingt_fiktiv, 0)} für Berufskosten, sonst sind sie einzeln nachzuweisen.` },
      { q: 'Warum rechnet der Rechner mit einer niedrigeren Gruppe als meinem Einkommen?', a: `Weil nach allen Zahlbeträgen der Bedarfskontrollbetrag der Gruppe übrig bleiben muss (Anmerkung A III der Tabelle). In Gruppe 2 sind das ${DE.eur(P.dt.bkb[1])}, in Gruppe 5 ${DE.eur(P.dt.bkb[4])}. Bleibt weniger, wird so lange herabgestuft, bis der Betrag gewahrt ist. Die Herabstufung können Sie in den Optionen abschalten, wenn Ihr Gericht anders verfährt.` },
      { q: 'Kann ich ein volljähriges Kind mitrechnen?', a: `Ja, wenn es unter 21 ist, eine allgemeinbildende Schule besucht und bei einem Elternteil wohnt: Es steht minderjährigen Kindern gleich (§ 1603 Abs. 2 Satz 2 BGB) und es wird das volle Kindergeld von ${DE.eur(P.kindergeld.monat)} abgezogen. Für Studierende und Auszubildende haften beide Eltern anteilig; dafür ist der Rechner für Volljährigenunterhalt gedacht.` },
      { q: 'Was bedeutet die Option Zahl der Berechtigten?', a: `Die Tabelle ist auf zwei Unterhaltsberechtigte zugeschnitten. Bei drei oder mehr Berechtigten, einen unterhaltsberechtigten Ehegatten eingeschlossen, kann das Gericht eine Gruppe tiefer gehen, bei nur einem Kind eine höher (Anmerkung A I). Das ist eine Ermessensfrage, deshalb ist die Option standardmäßig aus und der Bedarfskontrollbetrag an.` },
    ],
    body: (h) => `<h2>Was der Rechner nacheinander prüft</h2>
<p>Zuerst die Einkommensgruppe: Die Tabelle 2026 hat fünfzehn Gruppen, von bis ${h.eur(h.P.dt.gruppen_bis[0])} bis ${h.eur(h.P.dt.gruppen_bis[14])}. Für jedes Kind folgt die Altersstufe nach § 1612a BGB; maßgeblich ist der Monat, in dem es Geburtstag hat, nicht das Kalenderjahr. Vom Tabellenbetrag wird das Kindergeld abgezogen, bei Minderjährigen zur Hälfte, bei Volljährigen ganz. Dann die Gegenprobe mit dem Bedarfskontrollbetrag, zuletzt der notwendige Selbstbehalt von ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)} bei Erwerbstätigen und ${h.eur(h.P.selbstbehalt.notwendig_nicht_erwerbstaetig)} sonst.</p>
<h2>Drei Familien, drei Ergebnisse</h2>
${h.table(['Familie', 'Netto', 'Gruppe', 'Zahlbetrag gesamt'], [
  ['ein Kind, 7 Jahre', h.eur(2800), String(kindesunterhalt(2800, [{ alter: 7 }]).gruppe + 1), h.eur(kindesunterhalt(2800, [{ alter: 7 }]).summe, 2)],
  ['zwei Kinder, 4 und 9 Jahre', h.eur(3200), String(zwei.gruppe + 1), h.eur(zwei.summe, 2)],
  ['zwei Kinder, 4 und 9 Jahre', h.eur(2300), `${knapp.gruppe + 1}, Mangelfall`, h.eur(knapp.summe, 2)],
], 'Vom Rechner ermittelt, erwerbstätiger Elternteil, Bedarfskontrolle an')}
<p>Die dritte Zeile zeigt, warum ein einfacher Blick in die Tabelle nicht genügt. Gruppe 1 verlangt für die beiden Kinder ${h.eur(zahlbetrag(0, 0) + zahlbetrag(0, 1), 2)}; bei ${h.eur(2300)} blieben dem Vater danach weniger als ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)}. Der Selbstbehalt hat Vorrang, die Kinder teilen sich, was darüber liegt.</p>
<h2>Was der Rechner nicht weiß</h2>
<p>Er kennt weder Mehrbedarf (Kita-Beiträge ohne Verpflegung, Nachhilfe, Zahnspange) noch Sonderbedarf. Beides tragen die Eltern anteilig nach ihren Einkommen, über dem angemessenen Selbstbehalt. Er nimmt das bereinigte Netto als gegeben; welche Schulden, Fahrtkosten oder Altersvorsorge abgezogen werden, entscheidet im Streitfall das Familiengericht. Für Einkommen über ${h.eur(h.P.dt.gruppen_bis[14])} gilt die Tabelle nicht mehr: Der Bedarf des Kindes wird dann konkret dargelegt.</p>
<p>Der Rechner gibt eine allgemeine Berechnung nach der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} und den ${h.src('olgLeitlinien', 'Leitlinien der Oberlandesgerichte in NRW')}. Er ersetzt keine Prüfung Ihres Falls durch eine Anwältin, einen Anwalt oder das Jugendamt, das eine kostenlose Beistandschaft anbietet. Wie die Tabelle gelesen wird, steht auf der Seite zur ${h.a('zahlbetragstabelle', 'Zahlbetragstabelle')}; warum herabgestuft wird, beim ${h.a('bedarfskontrollbetrag', 'Bedarfskontrollbetrag')}.</p>`,
  },
  en: {
    slug: 'child-support-calculator',
    nav: 'Child support calculator',
    card: 'Up to six children, the needs-control amount and the shortfall rule, explained step by step.',
    title: 'Child Support Calculator Germany 2026: Several Children',
    description: `Child support calculator for Germany 2026 under the Düsseldorf Table: up to six children, ${EN.eur(P.kindergeld.monat)} child benefit, needs-control amount, ${EN.eur(S.notwendig_erwerbstaetig)} self-retention.`,
    h1: 'Work out German child support, also for several children',
    intro: 'The calculator walks through the table the way a German family court does: income group, age band, child benefit, control check, self-retention.',
    resume: `On ${EN.eur(3200)} of adjusted net income with two children aged four and nine, a working parent pays ${EN.eur(zwei.summe, 2)} a month in total under the 2026 Düsseldorf Table (Düsseldorfer Tabelle): ${EN.eur(zwei.kinder[0].zahlbetrag, 2)} and ${EN.eur(zwei.kinder[1].zahlbetrag, 2)}. The income itself falls into group ${zwei.gruppeEinkommen + 1}, yet the calculation runs in group ${zwei.gruppe + 1}, because the parent must keep that group’s needs-control amount (Bedarfskontrollbetrag) after paying for both children. Half of the child benefit, ${EN.eur(P.kindergeld.monat / 2, 2)} per child, comes off each table amount, since the other half belongs to the parent who looks after the children (section 1612b of the Civil Code, BGB). If income drops to ${EN.eur(2300)}, it no longer covers both children’s minimum plus the ${EN.eur(S.notwendig_erwerbstaetig)} self-retention (Selbstbehalt). Only ${EN.eur(knapp.verteilungsmasse, 2)} is then shared out in proportion to the amounts: the shortfall case (Mangelfall) of note C. The tool shows each step and names the rule behind every figure.`,
    faqs: [
      { q: 'Which income should I enter as an expat paid in Germany?', a: `Your adjusted net income (bereinigtes Nettoeinkommen): pay after German tax and social contributions, spread over twelve months including any 13th-month pay, minus recognised work costs and allowable debts. Child benefit (Kindergeld) is not income here. If your salary comes from abroad, convert it to euros and take the net after the tax you actually pay. The court decides what counts in a dispute.` },
      { q: 'Why does the result use a lower income group than mine?', a: `After paying every child, you must keep the group’s needs-control amount (note A III of the table): ${EN.eur(P.dt.bkb[1])} in group 2, ${EN.eur(P.dt.bkb[4])} in group 5. If less remains, the group is lowered until it is respected. You can switch this off under options, since courts apply it with some discretion.` },
      { q: 'Does German child support depend on the child’s age in years or school class?', a: `On age only. The bands are 0 to 5, 6 to 11, 12 to 17 and 18 or over (section 1612a BGB), and the higher band applies from the first day of the month in which the birthday falls. School class, nursery or language of schooling play no role in the table amount, though fees can count as extra need.` },
      { q: 'Can I include a child who has turned 18?', a: `Yes, if the child is under 21, attends a general school (not university or vocational training) and lives with a parent: such a child ranks with minors (section 1603(2) BGB), and the full ${EN.eur(P.kindergeld.monat)} child benefit is deducted. For students and trainees both parents share liability; use the adult-child calculator instead.` },
    ],
    body: (h) => `<h2>The order of the checks</h2>
<p>First the income group: the 2026 table has fifteen groups, from up to ${h.eur(h.P.dt.gruppen_bis[0])} to ${h.eur(h.P.dt.gruppen_bis[14])}. Each child then gets an age band under section 1612a BGB. Child benefit comes off the table amount, half for minors, all of it for adult children. Next comes the needs-control check, and finally the minimum self-retention: ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)} for a working parent, ${h.eur(h.P.selbstbehalt.notwendig_nicht_erwerbstaetig)} otherwise.</p>
<h2>Three families, three results</h2>
${h.table(['Family', 'Net income', 'Group', 'Total payable'], [
  ['one child, 7', h.eur(2800), String(kindesunterhalt(2800, [{ alter: 7 }]).gruppe + 1), h.eur(kindesunterhalt(2800, [{ alter: 7 }]).summe, 2)],
  ['two children, 4 and 9', h.eur(3200), String(zwei.gruppe + 1), h.eur(zwei.summe, 2)],
  ['two children, 4 and 9', h.eur(2300), `${knapp.gruppe + 1}, shortfall`, h.eur(knapp.summe, 2)],
], 'Computed by the calculator, working parent, needs-control check on')}
<p>The third line shows why a glance at the table is not enough. Group 1 asks ${h.eur(zahlbetrag(0, 0) + zahlbetrag(0, 1), 2)} for the two children; on ${h.eur(2300)} the father would keep less than ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)}. His self-retention wins, and the children share what lies above it.</p>
<h2>What the tool does not know</h2>
<p>It ignores extra need (Mehrbedarf, such as nursery fees without meals, tutoring or braces) and one-off special need (Sonderbedarf). Parents share both according to their incomes above the reasonable self-retention. It takes your adjusted net income as given; which debts, commuting costs or pension savings are deducted is for the family court to decide in a dispute. Above ${h.eur(h.P.dt.gruppen_bis[14])} the table stops and the child’s need has to be shown in detail.</p>
<p>The result is a general calculation under the ${h.src('olgDtPdf', '2026 Düsseldorf Table')} and the ${h.src('olgLeitlinien', 'NRW court guidelines')}. It does not replace advice on your case from a lawyer or from the youth welfare office (Jugendamt), which offers free support for children’s claims (Beistandschaft). How to read the table is on the ${h.a('zahlbetragstabelle', 'payment table')} page; why groups are lowered is under ${h.a('bedarfskontrollbetrag', 'needs-control amount')}.</p>`,
  },
});
