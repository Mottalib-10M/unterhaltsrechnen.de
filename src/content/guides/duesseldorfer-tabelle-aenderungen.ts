import { defineGuide } from '../../lib/guide-types';
import { zahlbetrag, gruppeVonBis, GRUPPEN, type Stufe } from '../../lib/engine/dt';
import { elternunterhalt } from '../../lib/engine/unterhalt';
import { r2 } from '../../lib/engine/params';
import { P, DE, EN } from '../../lib/fmt';

/** Vergleich 2025 → 2026 ausschließlich aus params: Block dt2025 (Vorjahr) und dt (2026). */
const STUFEN: Stufe[] = [0, 1, 2, 3];
const KG25 = P.dt2025.kindergeld;
const KG26 = P.kindergeld.monat;
const AS = P.dt.altersstufen;
const z25 = (g: number, s: Stufe) => r2(P.dt2025.bedarf[g][s] - (s === 3 ? KG25 : KG25 / 2));
const z26 = (g: number, s: Stufe) => zahlbetrag(g, s);
const diffBedarf = P.dt.bedarf.flatMap((row, g) => row.map((x, s) => x - P.dt2025.bedarf[g][s]));
const dMin = Math.min(...diffBedarf);
const dMax = Math.max(...diffBedarf);
const diffZahlMinder = P.dt.bedarf.flatMap((_, g) => [0, 1, 2].map((s) => r2(z26(g, s as Stufe) - z25(g, s as Stufe))));
const zMin = Math.min(...diffZahlMinder);
const zMax = Math.max(...diffZahlMinder);
const auswahl = [0, 4, 9, 14];
/** Elternunterhalt 2026: Beispiel mit 3.500 € bereinigtem Netto und 110.000 € Jahresbrutto. */
const eltern = elternunterhalt({ nettoBereinigt: 3500, jahresbrutto: 110000, luecke: 800 });
const S = P.selbstbehalt;
const MB = P.dt.mangelfall_beispiel;

export default defineGuide({
  id: 'duesseldorfer-tabelle-aenderungen',
  group: 'kind',
  order: 14,
  mini: 'dtVergleich',
  related: ['zahlbetragstabelle', 'mindestunterhalt', 'kindergeld-anrechnung', 'elternunterhalt', 'selbstbehalt', 'kindesunterhalt-rechner'],
  sources: ['olgDtPdf', 'olgDt2025', 'estg66', 'sgb12_94', 'bgb1612a'],
  de: {
    slug: 'duesseldorfer-tabelle-aenderungen',
    nav: 'Änderungen 2026',
    card: 'Was sich zum 1. Januar 2026 geändert hat: Bedarfssätze, Kindergeld, Zahlbeträge und der neue Selbstbehalt beim Elternunterhalt.',
    title: 'Düsseldorfer Tabelle 2026: alle Änderungen gegenüber 2025',
    description: `Düsseldorfer Tabelle 2026: Bedarf je Gruppe plus ${DE.eur(dMin)} bis ${DE.eur(dMax)}, Kindergeld ${DE.eur(KG26)} statt ${DE.eur(KG25)}, Selbstbehalt unverändert, Elternunterhalt mit festem Sockel.`,
    h1: 'Düsseldorfer Tabelle 2026: was neu ist',
    intro: 'Seit dem 1. Januar 2026 gilt eine neue Fassung der Tabelle. Die meisten Beträge steigen nur leicht, ein Kapitel ist grundlegend neu.',
    resume: `Die Düsseldorfer Tabelle 2026 gilt seit dem 1. Januar 2026. Die Bedarfssätze für Kinder steigen in allen fünfzehn Gruppen um ${DE.eur(dMin)} bis ${DE.eur(dMax)}; der Mindestbedarf in Gruppe 1 beträgt jetzt ${DE.eur(P.dt.bedarf[0][0])}, ${DE.eur(P.dt.bedarf[0][1])} und ${DE.eur(P.dt.bedarf[0][2])} statt ${DE.eur(P.dt2025.bedarf[0][0])}, ${DE.eur(P.dt2025.bedarf[0][1])} und ${DE.eur(P.dt2025.bedarf[0][2])}. Gleichzeitig stieg das Kindergeld von ${DE.eur(KG25)} auf ${DE.eur(KG26)}. Weil bei Minderjährigen die Hälfte davon abgezogen wird, wachsen die tatsächlichen Zahlbeträge nur um ${DE.eur(zMin)} bis ${DE.eur(zMax)} im Monat; ein sechs- bis elfjähriges Kind in Gruppe 1 erhält ${DE.eur(z26(0, 1), 2)} statt ${DE.eur(z25(0, 1), 2)}. Unverändert bleiben die Einkommensgrenzen der Gruppen, die Prozentsätze, die Bedarfskontrollbeträge, alle Selbstbehalte gegenüber Kindern und Ehegatten sowie der Bedarf Studierender von ${DE.eur(P.dt.student_bedarf)}. Grundlegend neu ist der Elternunterhalt: Erstmals nennt die Tabelle einen festen Selbstbehalt von ${DE.eur(S.eltern)} zuzüglich ${DE.pct(S.eltern_anrechnungsfrei_anteil)} des Mehreinkommens; für den Unterhalt an Enkel gilt derselbe Sockel plus die Hälfte des Mehreinkommens.`,
    faqs: [
      { q: 'Seit wann gilt die Düsseldorfer Tabelle 2026?', a: `Seit dem 1. Januar 2026, für alle Unterhaltsmonate ab Januar. Für Dezember 2025 und früher bleibt die Fassung von 2025 maßgeblich. Ein Titel mit einem Prozentsatz des Mindestunterhalts passt sich automatisch an; ein Titel über einen festen Euro-Betrag bleibt dagegen bestehen, bis er geändert wird. Freiwillig nach der neuen Zeile zu zahlen, ist jederzeit möglich.` },
      { q: 'Um wie viel steigt mein Kindesunterhalt 2026 gegenüber 2025?', a: `Für minderjährige Kinder um ${DE.eur(zMin)} bis ${DE.eur(zMax)} im Monat, je nach Gruppe und Alter. Der Bedarf steigt zwar stärker, doch das um ${DE.eur(KG26 - KG25)} höhere Kindergeld wird zur Hälfte abgezogen. In Gruppe 10 und der Altersstufe von zwölf bis siebzehn Jahren sind es ${DE.eur(z26(9, 2), 2)} statt ${DE.eur(z25(9, 2), 2)}. Den eigenen Wert zeigt der Vergleichsrechner oben.` },
      { q: 'Hat sich der Selbstbehalt in der Düsseldorfer Tabelle 2026 geändert?', a: `Gegenüber Kindern und Ehegatten nicht: Es bleibt bei ${DE.eur(S.notwendig_erwerbstaetig)} für Erwerbstätige und ${DE.eur(S.notwendig_nicht_erwerbstaetig)} für Nichterwerbstätige gegenüber minderjährigen Kindern, ${DE.eur(S.angemessen)} gegenüber volljährigen und ${DE.eur(S.ehegatte_erwerbstaetig)} beziehungsweise ${DE.eur(S.ehegatte_nicht_erwerbstaetig)} gegenüber Ehegatten. Neu sind nur die festen Beträge gegenüber Eltern und Enkeln.` },
      { q: 'Was ist beim Elternunterhalt in der Tabelle 2026 neu?', a: `Bis 2025 verwies die Tabelle nur auf den angemessenen Eigenbedarf und den Zweck des Angehörigen-Entlastungsgesetzes. Seit 2026 nennt sie einen Selbstbehalt von mindestens ${DE.eur(S.eltern)} einschließlich ${DE.eur(S.eltern_warmmiete)} Warmmiete, zuzüglich ${DE.pct(S.eltern_anrechnungsfrei_anteil)} des darüber liegenden Einkommens. Für den mit dem Kind zusammenlebenden Ehegatten gilt ein Mindestbedarf von ${DE.eur(S.eltern_ehegatte_mindest)}.` },
      { q: 'Warum zahlen Eltern volljähriger Kinder 2026 kaum mehr als 2025?', a: `Weil bei Volljährigen das ganze Kindergeld angerechnet wird. Die Erhöhung um ${DE.eur(KG26 - KG25)} frisst einen großen Teil des höheren Bedarfs auf. In Gruppe 1 steigt der Zahlbetrag ab ${DE.num(AS[3][0])} Jahren deshalb nur von ${DE.eur(z25(0, 3), 2)} auf ${DE.eur(z26(0, 3), 2)}. Dieser Betrag wird zudem meist auf beide Eltern nach ihren Einkommen verteilt.` },
    ],
    body: (h) => `<h2>Die Bedarfssätze 2025 und 2026 nebeneinander</h2>
<p>Die ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} hat dieselben fünfzehn Einkommensgruppen wie die ${h.src('olgDt2025', 'Fassung von 2025')}. Geändert haben sich die Euro-Beträge in den Zellen. Grundlage ist die Siebte Verordnung zur Änderung der Mindestunterhaltsverordnung vom 15. November 2024, die den Mindestunterhalt für 2025 und für 2026 festgelegt hat. Da alle höheren Gruppen als Prozentsatz der ersten berechnet werden (${h.src('bgb1612a', '§ 1612a BGB')}), ziehen sie mit.</p>
${h.table(['Gruppe', 'Netto', `${AS[0][0]}–${AS[0][1]} J.`, `${AS[1][0]}–${AS[1][1]} J.`, `${AS[2][0]}–${AS[2][1]} J.`, `ab ${AS[3][0]}`], Array.from({ length: GRUPPEN }, (_, g) => [String(g + 1), g === 0 ? `bis ${h.eur(gruppeVonBis(g)[1])}` : `${h.eur(gruppeVonBis(g)[0])} bis ${h.eur(gruppeVonBis(g)[1])}`, ...STUFEN.map((s) => `${h.eur(h.P.dt2025.bedarf[g][s])} → ${h.eur(h.P.dt.bedarf[g][s])}`)]), 'Tabellenbedarf 2025 → 2026 je Gruppe und Altersstufe', ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>Die Erhöhung wächst mit der Gruppe: In Gruppe 1 sind es ${h.eur(dMin)} oder etwas mehr, in den obersten Gruppen bis zu ${h.eur(dMax)}. Bei Volljährigen fällt der Sprung etwas größer aus als bei Kleinkindern.</p>
<h2>Das Kindergeld und die Zahlbeträge</h2>
<p>Das Kindergeld beträgt 2026 ${h.eur(h.P.kindergeld.monat)} je Kind (${h.src('estg66', '§ 66 EStG')}), im Vorjahr waren es ${h.eur(h.P.dt2025.kindergeld)}. Für den Unterhalt zählt nicht der Bedarf, sondern der Bedarf abzüglich Kindergeldanteil. Weil Minderjährigen die Hälfte des Kindergeldes angerechnet wird, schluckt die Kindergelderhöhung ${h.eur((h.P.kindergeld.monat - h.P.dt2025.kindergeld) / 2)} des Anstiegs, bei Volljährigen sogar ${h.eur(h.P.kindergeld.monat - h.P.dt2025.kindergeld)}.</p>
${h.table(['Gruppe', 'Altersstufe', 'Zahlbetrag 2025', 'Zahlbetrag 2026', 'Plus'], auswahl.flatMap((g) => STUFEN.map((s) => [String(g + 1), s === 3 ? `ab ${AS[3][0]}` : `${AS[s][0]}–${AS[s][1]} J.`, h.eur(z25(g, s), 2), h.eur(z26(g, s), 2), h.eur(z26(g, s) - z25(g, s), 2)])), 'Zahlbeträge nach Kindergeldanteil, ausgewählte Gruppen', ['l', 'l', 'r', 'r', 'r'])}
<p>Für Zahlende bedeutet das meist ein Plus im einstelligen Euro-Bereich je Kind. Für den betreuenden Elternteil ergibt sich das Plus aus zwei Quellen: etwas höherer Unterhalt und ${h.eur(h.P.kindergeld.monat - h.P.dt2025.kindergeld)} mehr Kindergeld von der Familienkasse. Die volle Tabelle steht unter ${h.a('zahlbetragstabelle', 'Zahlbetragstabelle 2026')}.</p>
<h2>Was gleich geblieben ist</h2>
<ul>
<li>Die Einkommensgrenzen der Gruppen, von bis ${h.eur(h.P.dt.gruppen_bis[0])} bis ${h.eur(h.P.dt.gruppen_bis[14])}.</li>
<li>Die Prozentsätze von ${h.num(h.P.dt.prozent[0])} % bis ${h.num(h.P.dt.prozent[14])} % des Mindestunterhalts.</li>
<li>Die Bedarfskontrollbeträge, von ${h.eur(h.P.dt.bkb[0])} bis ${h.eur(h.P.dt.bkb[14])}.</li>
<li>Der notwendige ${h.a('selbstbehalt', 'Selbstbehalt')} von ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)} und ${h.eur(h.P.selbstbehalt.notwendig_nicht_erwerbstaetig)}, der angemessene von ${h.eur(h.P.selbstbehalt.angemessen)} und die Beträge gegenüber Ehegatten.</li>
<li>Der Bedarf eines Studierenden mit eigenem Haushalt von ${h.eur(h.P.dt.student_bedarf)}, davon bis ${h.eur(h.P.dt.student_warmmiete)} Warmmiete.</li>
<li>Die Quoten beim Ehegattenunterhalt, ${h.pct(h.P.ehegatte.quote_erwerb, 0)} der Erwerbseinkommensdifferenz.</li>
</ul>
<p>Wer 2025 bereits knapp über dem Selbstbehalt lag, steht 2026 also etwas schlechter da, weil die Zahlbeträge steigen, der Selbstbehalt aber nicht. Ob ein ${h.a('mangelfall', 'Mangelfall')} entsteht, hängt von wenigen Euro ab.</p>
<h2>Neu: fester Selbstbehalt beim Elternunterhalt</h2>
<p>Die größte inhaltliche Änderung betrifft nicht Kinder, sondern Eltern. Die Tabelle 2025 sagte zum ${h.a('elternunterhalt', 'Elternunterhalt')} nur, dem Kind sei der angemessene Eigenbedarf zu belassen, und verwies auf das Angehörigen-Entlastungsgesetz. Die Tabelle 2026 nennt in Anmerkung D I erstmals Zahlen: mindestens ${h.eur(h.P.selbstbehalt.eltern)} einschließlich ${h.eur(h.P.selbstbehalt.eltern_warmmiete)} Warmmiete, dazu ${h.pct(h.P.selbstbehalt.eltern_anrechnungsfrei_anteil, 0)} des Einkommens darüber. Dem Ehegatten, der mit dem Kind zusammenlebt, stehen mindestens ${h.eur(h.P.selbstbehalt.eltern_ehegatte_mindest)} zu.</p>
<p>Ein Beispiel aus dem Motor: Ein Sohn mit ${h.eur(3500)} bereinigtem Netto und ${h.eur(110000)} Jahresbrutto behält ${h.eur(eltern.selbstbehalt)} und könnte höchstens ${h.eur(eltern.leistungsfaehig)} im Monat für die Pflegekosten seiner Mutter beitragen. Das Sozialamt darf ohnehin nur zurückgreifen, wenn das Jahresbruttoeinkommen ${h.eur(h.P.elternunterhalt.jahreseinkommensgrenze)} übersteigt (${h.src('sgb12_94', '§ 94 Abs. 1a SGB XII')}).</p>
<p>Ebenfalls neu ist Anmerkung D II für Großeltern, die Unterhalt an Enkel zahlen: derselbe Sockel von ${h.eur(h.P.selbstbehalt.enkel)}, aber nur die Hälfte des Mehreinkommens bleibt frei.</p>
<h2>Geändertes Rechenbeispiel zum Mangelfall</h2>
<p>Anmerkung C rechnet ihr Beispiel mit den neuen Werten: ${h.eur(MB.netto)} Netto, Selbstbehalt ${h.eur(MB.selbstbehalt)}, drei Kinder. Die Einsatzbeträge lauten jetzt ${h.eur(MB.einsatz[0], 2)}, ${h.eur(MB.einsatz[1], 2)} und ${h.eur(MB.einsatz[2], 2)}, verteilt werden ${h.eur(MB.netto - MB.selbstbehalt)}: Die Kinder erhalten ${h.eur(MB.ergebnis[0], 2)}, ${h.eur(MB.ergebnis[1], 2)} und ${h.eur(MB.ergebnis[2], 2)}. Gegenüber 2025 verschieben sich die Anteile nur um Cent-Beträge.</p>
<p>Diese Übersicht über die Änderungen der Düsseldorfer Tabelle 2026 ist allgemeine Information und keine Rechtsberatung; ob ein bestehender Titel angepasst werden muss, prüfen im Einzelfall das Jugendamt oder das Familiengericht.</p>`,
  },
  en: {
    slug: 'duesseldorf-table-changes',
    nav: 'Changes in 2026',
    card: 'What changed on 1 January 2026: need rates, child benefit, payment amounts and the new self-retention for supporting parents.',
    title: 'Düsseldorf Table 2026: What Changed Compared With 2025',
    description: `Düsseldorf Table 2026 changes: need up ${EN.eur(dMin)} to ${EN.eur(dMax)} per group, child benefit ${EN.eur(KG26)} instead of ${EN.eur(KG25)}, self-retention unchanged, new rules for elderly parents.`,
    h1: 'The 2026 Düsseldorf Table: what is new',
    intro: 'A new version of Germany’s child support table took effect on 1 January 2026. Most figures rise slightly; one chapter is rewritten.',
    resume: `The 2026 Düsseldorf Table (Düsseldorfer Tabelle), Germany’s reference grid for child support, applies from 1 January 2026. Children’s need rises in all fifteen income groups by ${EN.eur(dMin)} to ${EN.eur(dMax)} a month; the minimum need in group 1 is now ${EN.eur(P.dt.bedarf[0][0])}, ${EN.eur(P.dt.bedarf[0][1])} and ${EN.eur(P.dt.bedarf[0][2])} for the three age bands of minors, up from ${EN.eur(P.dt2025.bedarf[0][0])}, ${EN.eur(P.dt2025.bedarf[0][1])} and ${EN.eur(P.dt2025.bedarf[0][2])}. Child benefit (Kindergeld) went up from ${EN.eur(KG25)} to ${EN.eur(KG26)}. Since half of it is deducted for minors, the amounts actually paid rise by only ${EN.eur(zMin)} to ${EN.eur(zMax)}: a child aged six to eleven in group 1 now receives ${EN.eur(z26(0, 1), 2)} instead of ${EN.eur(z25(0, 1), 2)}. Income brackets, percentages, needs-control amounts, every self-retention towards children and spouses, and the ${EN.eur(P.dt.student_bedarf)} student rate are unchanged. The real novelty concerns support for elderly parents: for the first time the table sets a fixed self-retention of ${EN.eur(S.eltern)} plus ${EN.pct(S.eltern_anrechnungsfrei_anteil)} of any income above it, with a similar rule towards grandchildren.`,
    faqs: [
      { q: 'From which month does the 2026 Düsseldorf Table apply?', a: `From January 2026 onwards. Months up to December 2025 are still assessed under the 2025 version. An order expressed as a percentage of the statutory minimum updates itself; an order for a fixed euro sum stays as it is until changed by agreement, a new deed or the family court. Paying the new amount voluntarily is always possible.` },
      { q: 'How much more child support will I pay in 2026 than in 2025?', a: `For a minor child between ${EN.eur(zMin)} and ${EN.eur(zMax)} more a month, depending on group and age. The need rises further, but half of the ${EN.eur(KG26 - KG25)} child benefit increase is deducted. In group 10, for a child aged twelve to seventeen, the amount is ${EN.eur(z26(9, 2), 2)} instead of ${EN.eur(z25(9, 2), 2)}. The comparison tool above shows your own figure.` },
      { q: 'Did the self-retention amounts change in the 2026 Düsseldorf Table?', a: `Not towards children or spouses. A working parent still keeps ${EN.eur(S.notwendig_erwerbstaetig)} against minor children, a non-working one ${EN.eur(S.notwendig_nicht_erwerbstaetig)}; ${EN.eur(S.angemessen)} applies towards adult children and ${EN.eur(S.ehegatte_erwerbstaetig)} towards a spouse when working. Only the figures towards elderly parents and grandchildren are new.` },
      { q: 'I live in Germany and my mother needs care: what changed for 2026?', a: `The table now gives you a fixed self-retention of at least ${EN.eur(S.eltern)}, including ${EN.eur(S.eltern_warmmiete)} warm rent, plus ${EN.pct(S.eltern_anrechnungsfrei_anteil)} of income above it. Before 2026 it only referred to the reasonable personal need. The welfare office can only claim at all if your annual gross income exceeds ${EN.eur(P.elternunterhalt.jahreseinkommensgrenze)}. The figures are guidance for the courts, which assess each family’s situation.` },
      { q: 'Why do parents of adult children pay almost the same in 2026?', a: `Because the whole child benefit is offset for adult children, so the ${EN.eur(KG26 - KG25)} rise in Kindergeld absorbs most of the higher need. In group 1 the payable amount from age ${EN.num(AS[3][0])} only moves from ${EN.eur(z25(0, 3), 2)} to ${EN.eur(z26(0, 3), 2)}, and that figure is usually split between both parents by income.` },
    ],
    body: (h) => `<h2>Need rates in 2025 and 2026 side by side</h2>
<p>The ${h.src('olgDtPdf', '2026 Düsseldorf Table')} keeps the fifteen income groups of the ${h.src('olgDt2025', '2025 version')}. What changed are the euro figures in the cells. They rest on the Seventh Ordinance amending the Minimum Maintenance Ordinance of 15 November 2024, which fixed the statutory minimum for both 2025 and 2026. Because every higher group is a percentage of the first one (${h.src('bgb1612a', 'section 1612a BGB')}), all rows follow.</p>
${h.table(['Group', 'Net income', `Age ${AS[0][0]}–${AS[0][1]}`, `Age ${AS[1][0]}–${AS[1][1]}`, `Age ${AS[2][0]}–${AS[2][1]}`, `${AS[3][0]}+`], Array.from({ length: GRUPPEN }, (_, g) => [String(g + 1), g === 0 ? `up to ${h.eur(gruppeVonBis(g)[1])}` : `${h.eur(gruppeVonBis(g)[0])} to ${h.eur(gruppeVonBis(g)[1])}`, ...STUFEN.map((s) => `${h.eur(h.P.dt2025.bedarf[g][s])} → ${h.eur(h.P.dt.bedarf[g][s])}`)]), 'Table need 2025 → 2026 by group and age band', ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>The increase grows with income: about ${h.eur(dMin)} in group 1, up to ${h.eur(dMax)} in the top rows. Adult children see slightly larger steps than toddlers.</p>
<h2>Child benefit and the amounts actually paid</h2>
<p>Child benefit is ${h.eur(h.P.kindergeld.monat)} per child in 2026 (${h.src('estg66', 'section 66 of the Income Tax Act, EStG')}), up from ${h.eur(h.P.dt2025.kindergeld)}. Support is paid on the need minus a child benefit share, so the benefit increase eats into the rise: ${h.eur((h.P.kindergeld.monat - h.P.dt2025.kindergeld) / 2)} for minors, the full ${h.eur(h.P.kindergeld.monat - h.P.dt2025.kindergeld)} for adult children.</p>
${h.table(['Group', 'Age band', 'Payable 2025', 'Payable 2026', 'Increase'], auswahl.flatMap((g) => STUFEN.map((s) => [String(g + 1), s === 3 ? `${AS[3][0]}+` : `${AS[s][0]}–${AS[s][1]}`, h.eur(z25(g, s), 2), h.eur(z26(g, s), 2), h.eur(z26(g, s) - z25(g, s), 2)])), 'Amounts payable after the child benefit share, selected groups', ['l', 'l', 'r', 'r', 'r'])}
<p>For most payers that is a single-digit euro increase per child. The resident parent gains on two fronts: slightly higher support and ${h.eur(h.P.kindergeld.monat - h.P.dt2025.kindergeld)} more child benefit from the family benefits office (Familienkasse). The full grid is on the ${h.a('zahlbetragstabelle', 'payment table')} page.</p>
<h2>What stayed the same</h2>
<ul>
<li>Income brackets, from up to ${h.eur(h.P.dt.gruppen_bis[0])} to ${h.eur(h.P.dt.gruppen_bis[14])}.</li>
<li>Percentages from ${h.num(h.P.dt.prozent[0])}% to ${h.num(h.P.dt.prozent[14])}% of the statutory minimum.</li>
<li>Needs-control amounts, from ${h.eur(h.P.dt.bkb[0])} to ${h.eur(h.P.dt.bkb[14])}.</li>
<li>The minimum ${h.a('selbstbehalt', 'self-retention')} of ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)} and ${h.eur(h.P.selbstbehalt.notwendig_nicht_erwerbstaetig)}, the reasonable one of ${h.eur(h.P.selbstbehalt.angemessen)} and the figures towards spouses.</li>
<li>The ${h.eur(h.P.dt.student_bedarf)} need of a student living away from home, including up to ${h.eur(h.P.dt.student_warmmiete)} warm rent.</li>
<li>The spousal maintenance rate of ${h.pct(h.P.ehegatte.quote_erwerb, 0)} of the difference in earned income.</li>
</ul>
<p>A payer who was just above the self-retention in 2025 is therefore slightly worse off in 2026: amounts rose, the protected sum did not. Whether a ${h.a('mangelfall', 'shortfall case')} arises can turn on a few euros.</p>
<h2>New: a fixed self-retention for adult children of elderly parents</h2>
<p>The biggest change in substance concerns ${h.a('elternunterhalt', 'parental maintenance')}, when the welfare office asks adult children to contribute to a parent’s care costs. The 2025 table merely said the child must keep a reasonable personal need and referred to the 2019 relief act for relatives. Note D I of the 2026 table now sets figures: at least ${h.eur(h.P.selbstbehalt.eltern)}, including ${h.eur(h.P.selbstbehalt.eltern_warmmiete)} warm rent, plus ${h.pct(h.P.selbstbehalt.eltern_anrechnungsfrei_anteil, 0)} of income above that. A spouse living with the child is entitled to at least ${h.eur(h.P.selbstbehalt.eltern_ehegatte_mindest)}.</p>
<p>An example from the engine: a daughter with ${h.eur(3500)} adjusted net income and ${h.eur(110000)} gross a year keeps ${h.eur(eltern.selbstbehalt)} and could contribute at most ${h.eur(eltern.leistungsfaehig)} a month. Below ${h.eur(h.P.elternunterhalt.jahreseinkommensgrenze)} annual gross income the welfare office has no recourse at all (${h.src('sgb12_94', 'section 94(1a) of Social Code XII')}).</p>
<p>Note D II is also new: grandparents paying for grandchildren keep the same ${h.eur(h.P.selbstbehalt.enkel)} base, but only half of the income above it stays free.</p>
<h2>Updated shortfall example</h2>
<p>Note C now works its example with 2026 figures: ${h.eur(MB.netto)} net income, ${h.eur(MB.selbstbehalt)} self-retention, three children. The weightings are ${h.eur(MB.einsatz[0], 2)}, ${h.eur(MB.einsatz[1], 2)} and ${h.eur(MB.einsatz[2], 2)}; the ${h.eur(MB.netto - MB.selbstbehalt)} available is shared as ${h.eur(MB.ergebnis[0], 2)}, ${h.eur(MB.ergebnis[1], 2)} and ${h.eur(MB.ergebnis[2], 2)}. Compared with 2025 the shares shift by cents only.</p>
<p>This summary of the 2026 Düsseldorf Table changes is general information, not legal advice; whether an existing order needs updating is a question for the Jugendamt or the family court in your case.</p>`,
  },
});
