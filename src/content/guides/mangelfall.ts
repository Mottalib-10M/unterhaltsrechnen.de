import { defineGuide } from '../../lib/guide-types';
import { kindesunterhalt, mangelfallGrenze, zahlbetrag } from '../../lib/engine/dt';
import { unterhaltsvorschuss } from '../../lib/engine/unterhalt';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Das amtliche Beispiel der Anmerkung C der Düsseldorfer Tabelle 2026, vom Motor nachgerechnet:
 * 1.750 € Netto, Kinder von 18 (Schüler, privilegiert), 7 und 5 Jahren. Dazu Varianten des Motors.
 */
const fam = [{ alter: 18, privilegiert: true }, { alter: 7 }, { alter: 5 }];
const amtlich = kindesunterhalt(P.dt.mangelfall_beispiel.netto, fam);
const ohneJob = kindesunterhalt(P.dt.mangelfall_beispiel.netto, fam, { erwerbstaetig: false });
const grenzeFam = mangelfallGrenze(fam);
const einsatzSumme = amtlich.kinder.reduce((s, k) => s + k.tabellenZahlbetrag, 0);
const stufen = [1500, 2000, 2300].map((n) => ({ n, r: kindesunterhalt(n, fam) }));
const zwei = [{ alter: 2 }, { alter: 11 }];
const paar = kindesunterhalt(2000, zwei);
const paarGrenze = mangelfallGrenze(zwei);
const uvg7 = unterhaltsvorschuss({ alter: 7, unterhaltErhalten: amtlich.kinder[1].zahlbetrag });
const S = P.selbstbehalt;

export default defineGuide({
  id: 'mangelfall',
  group: 'kind',
  order: 18,
  mini: 'mangelfall',
  related: ['selbstbehalt', 'bedarfskontrollbetrag', 'kindesunterhalt-rechner', 'unterhaltsvorschuss', 'mindestunterhalt', 'bereinigtes-netto'],
  sources: ['olgDtPdf', 'olgLeitlinien', 'bgb1603', 'bgb1609', 'uvg2'],
  de: {
    slug: 'mangelfall',
    nav: 'Mangelfall',
    card: 'Wenn das Einkommen nicht für alle Kinder reicht: Verteilungsmasse, Einsatzbeträge und Rangfolge 2026.',
    title: 'Mangelfall Unterhalt 2026: Verteilung, Rang und Beispiel',
    description: `Mangelfall beim Unterhalt 2026: Selbstbehalt ${DE.eur(S.notwendig_erwerbstaetig)}, Verteilungsmasse, Rangfolge nach § 1609 BGB und das amtliche Beispiel mit drei Kindern nachgerechnet.`,
    h1: 'Mangelfall: wie wenig Geld auf mehrere Kinder verteilt wird',
    intro: 'Reicht das Einkommen nicht für den Mindestunterhalt aller Kinder und den Selbstbehalt, wird gekürzt, und zwar für alle Kinder im gleichen Verhältnis.',
    resume: `Ein Mangelfall liegt vor, wenn das bereinigte Einkommen des barunterhaltspflichtigen Elternteils nicht ausreicht, um seinen notwendigen Selbstbehalt und den Unterhalt aller gleichrangigen Kinder zu decken. Dann wird nach Anmerkung C der Düsseldorfer Tabelle 2026 nur die Verteilungsmasse verteilt: Einkommen minus Selbstbehalt von ${DE.eur(S.notwendig_erwerbstaetig)} bei Erwerbstätigen oder ${DE.eur(S.notwendig_nicht_erwerbstaetig)} bei Nichterwerbstätigen. Jedes Kind erhält den Anteil, der dem Verhältnis seines Einsatzbetrags, also seines Zahlbetrags nach Kindergeld, zur Summe aller Einsatzbeträge entspricht. Im amtlichen Beispiel verdient der Vater ${DE.eur(P.dt.mangelfall_beispiel.netto)}, drei Kinder von 18 (Schülerin), 7 und 5 Jahren hätten zusammen ${DE.eur(einsatzSumme, 2)} zu beanspruchen. Verteilt werden nur ${DE.eur(amtlich.verteilungsmasse, 2)}: ${DE.eur(amtlich.kinder[0].zahlbetrag, 2)}, ${DE.eur(amtlich.kinder[1].zahlbetrag, 2)} und ${DE.eur(amtlich.kinder[2].zahlbetrag, 2)}. Erst ab rund ${DE.eur(grenzeFam)} Netto wäre der volle Mindestunterhalt gedeckt. Minderjährige und privilegierte volljährige Kinder stehen dabei im ersten Rang nach § 1609 BGB vor allen anderen Berechtigten.`,
    faqs: [
      { q: 'Was ist die Verteilungsmasse im Mangelfall?', a: `Der Teil des bereinigten Nettoeinkommens, der über dem notwendigen Selbstbehalt liegt. Bei einem erwerbstätigen Vater mit ${DE.eur(P.dt.mangelfall_beispiel.netto)} sind das ${DE.eur(amtlich.verteilungsmasse, 2)}, weil ihm ${DE.eur(S.notwendig_erwerbstaetig)} bleiben müssen. Nur dieser Betrag steht den Kindern zur Verfügung, auch wenn ihr Mindestbedarf viel höher ist. Der Selbstbehalt kann steigen, wenn die eigene Warmmiete über dem darin enthaltenen Anteil liegt und angemessen ist.` },
      { q: 'Werden im Mangelfall alle Kinder gleich gekürzt?', a: `Im gleichen Verhältnis, nicht um den gleichen Betrag. Grundlage ist der Einsatzbetrag jedes Kindes, also sein Zahlbetrag nach Abzug des Kindergeldanteils. Ein älteres Kind mit höherem Einsatzbetrag erhält deshalb mehr als ein jüngeres. Im amtlichen Beispiel bekommt jedes Kind ${DE.pct(amtlich.verteilungsmasse / einsatzSumme, 1)} seines Einsatzbetrags.` },
      { q: 'Muss ein Vater im Mangelfall einen Nebenjob annehmen?', a: `Gegenüber minderjährigen und privilegierten volljährigen Kindern gilt die gesteigerte Unterhaltspflicht des § 1603 Abs. 2 BGB: Eltern müssen alle verfügbaren Mittel einsetzen. Die Leitlinien in NRW halten Überstunden oder eine Nebentätigkeit zur Deckung des Mindestunterhalts für zumutbar, soweit möglich und im Rahmen des Arbeitszeitgesetzes. Wer sich nicht ausreichend bemüht, dem kann ein erzielbares Einkommen fiktiv zugerechnet werden.` },
      { q: 'Bekommt das Kind im Mangelfall Unterhaltsvorschuss dazu?', a: `Unterhaltsvorschuss füllt die Lücke bis zum Mindestunterhalt abzüglich Kindergeld, wenn der andere Elternteil weniger zahlt. Gezahlter Unterhalt wird angerechnet. Für das siebenjährige Kind aus dem amtlichen Beispiel, das ${DE.eur(amtlich.kinder[1].zahlbetrag, 2)} erhält, ergäbe die Rechnung nach dem Gesetz noch ${DE.eur(uvg7.leistung, 2)} im Monat. Ab zwölf Jahren gelten zusätzliche Voraussetzungen.` },
      { q: 'Welchen Rang hat die Mutter im Mangelfall gegenüber den Kindern?', a: `Nach § 1609 BGB stehen minderjährige und privilegierte volljährige Kinder im ersten Rang. Ein Elternteil, der wegen Kinderbetreuung unterhaltsberechtigt ist, folgt im zweiten Rang, ebenso Ehegatten nach langer Ehe. Reicht das Geld nicht einmal für die Kinder, erhält die Mutter oder der Vater im zweiten Rang in der Regel nichts. Die Mangelverteilung der Anmerkung C betrifft nur Berechtigte desselben Rangs.` },
      { q: 'Ab welchem Einkommen endet der Mangelfall bei zwei kleinen Kindern?', a: `Für zwei Kinder von 2 und 11 Jahren braucht ein erwerbstätiger Elternteil nach dem Motor rund ${DE.eur(paarGrenze)} bereinigtes Netto: den Selbstbehalt plus beide Zahlbeträge der ersten Gruppe. Bei ${DE.eur(2000)} werden nur ${DE.eur(paar.verteilungsmasse, 2)} verteilt, ${DE.eur(paar.kinder[0].zahlbetrag, 2)} für das kleinere und ${DE.eur(paar.kinder[1].zahlbetrag, 2)} für das größere Kind.` },
    ],
    body: (h) => `<h2>Wann ein Mangelfall vorliegt</h2>
<p>Die Leitlinien der Oberlandesgerichte in NRW sprechen von einem absoluten Mangelfall, wenn das Einkommen des Pflichtigen nicht reicht, um seinen notwendigen Selbstbehalt und die gleichrangigen Ansprüche der Kinder zu decken. Gemessen wird dabei am Mindestunterhalt, also an der ersten Einkommensgruppe der Tabelle, nach Abzug des Kindergeldanteils. Wer weniger als Selbstbehalt plus diese Zahlbeträge verdient, befindet sich im Mangelfall.</p>
<p>Zuvor hat die Tabelle meist schon herabgestuft: Der ${h.a('bedarfskontrollbetrag', 'Bedarfskontrollbetrag')} senkt die Gruppe, bis nichts mehr zu senken ist. Erst wenn auch Gruppe 1 nicht bezahlbar ist, beginnt die Anmerkung C.</p>
<h2>Die Rechnung der Anmerkung C in drei Schritten</h2>
<ul>
<li><strong>Verteilungsmasse</strong>: bereinigtes Netto minus notwendiger Selbstbehalt (${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)} erwerbstätig, ${h.eur(h.P.selbstbehalt.notwendig_nicht_erwerbstaetig)} nicht erwerbstätig).</li>
<li><strong>Einsatzbeträge</strong>: für jedes Kind der Zahlbetrag der ersten Gruppe, also Mindestunterhalt minus Kindergeldanteil; bei Minderjährigen das halbe, bei Volljährigen das volle Kindergeld von ${h.eur(h.P.kindergeld.monat)}.</li>
<li><strong>Verteilung</strong>: Jedes Kind erhält Einsatzbetrag mal Verteilungsmasse geteilt durch die Summe aller Einsatzbeträge.</li>
</ul>
<h2>Das amtliche Beispiel, vom Motor nachgerechnet</h2>
<p>Die Düsseldorfer Tabelle rechnet selbst ein Beispiel vor: Vater mit ${h.eur(h.P.dt.mangelfall_beispiel.netto)} bereinigtem Netto, drei Kinder im Haushalt der Mutter, die das Kindergeld bezieht. K1 ist 18 und geht noch zur Schule, K2 ist 7, K3 ist 5 Jahre alt. Unser Rechenkern kommt auf dieselben Cent-Beträge.</p>
${h.table(['Kind', 'Tabellenbedarf Gruppe 1', 'Kindergeldanteil', 'Einsatzbetrag', 'Unterhalt im Mangelfall'], amtlich.kinder.map((k, i) => [`K${i + 1}, ${k.alter} Jahre`, h.eur(k.bedarf), h.eur(k.kindergeld, 2), h.eur(k.tabellenZahlbetrag, 2), h.eur(k.zahlbetrag, 2)]).concat([['Summe', '', '', h.eur(einsatzSumme, 2), h.eur(amtlich.summe, 2)]]), `Verteilungsmasse ${h.eur(amtlich.verteilungsmasse, 2)} = ${h.eur(h.P.dt.mangelfall_beispiel.netto)} minus ${h.eur(amtlich.selbstbehalt)}`, ['l', 'r', 'r', 'r', 'r'])}
<p>Jedes Kind erhält damit knapp ein Viertel dessen, was ihm nach der Tabelle zustünde. Wäre der Vater nicht erwerbstätig, etwa wegen Krankheit, läge sein Selbstbehalt bei ${h.eur(h.P.selbstbehalt.notwendig_nicht_erwerbstaetig)}, und die Masse stiege auf ${h.eur(ohneJob.verteilungsmasse, 2)}: ${h.eur(ohneJob.kinder[0].zahlbetrag, 2)}, ${h.eur(ohneJob.kinder[1].zahlbetrag, 2)} und ${h.eur(ohneJob.kinder[2].zahlbetrag, 2)}. Der niedrigere Selbstbehalt gilt aber nur, wenn ihm keine Erwerbstätigkeit zugemutet wird.</p>
<h2>Wie sich die Beträge mit dem Einkommen verschieben</h2>
${h.table(['Bereinigtes Netto', 'Verteilt', 'K1 (18)', 'K2 (7)', 'K3 (5)'], stufen.map(({ n, r }) => [h.eur(n), h.eur(r.summe, 2), h.eur(r.kinder[0].zahlbetrag, 2), h.eur(r.kinder[1].zahlbetrag, 2), h.eur(r.kinder[2].zahlbetrag, 2)]).concat([[h.eur(grenzeFam), 'voller Mindestunterhalt', h.eur(zahlbetrag(0, 3), 2), h.eur(zahlbetrag(0, 1), 2), h.eur(zahlbetrag(0, 0), 2)]]), 'Gleiche Familie, erwerbstätiger Vater, vom Motor gerechnet', ['l', 'r', 'r', 'r', 'r'])}
<p>Jeder zusätzliche Euro über dem Selbstbehalt geht vollständig an die Kinder, bis der Mindestunterhalt aller drei gedeckt ist. Das zeigt, warum im Mangelfall um jede Position der ${h.a('bereinigtes-netto', 'Einkommensbereinigung')} gestritten wird: Fahrtkosten oder Kreditraten, die das Gericht anerkennt, verringern die Verteilungsmasse unmittelbar.</p>
<h2>Rangfolge nach § 1609 BGB</h2>
<p>Gibt es neben den Kindern weitere Berechtigte, entscheidet der ${h.src('bgb1609', 'Rang nach § 1609 BGB')}:</p>
<ul>
<li>Rang 1: minderjährige Kinder und volljährige Schüler unter 21 im Haushalt eines Elternteils.</li>
<li>Rang 2: Elternteile, die wegen Kinderbetreuung unterhaltsberechtigt sind, sowie Ehegatten nach langer Ehe.</li>
<li>Rang 3: übrige Ehegatten und geschiedene Ehegatten.</li>
<li>Rang 4: andere Kinder, etwa Studierende.</li>
<li>Rang 5 bis 7: Enkel, Eltern, weitere Verwandte in aufsteigender Linie.</li>
</ul>
<p>Ein nachrangig Berechtigter erhält erst etwas, wenn alle vorrangigen vollständig bedient sind. Im Mangelfall der Kinder bleibt für die Mutter oder einen Studenten deshalb regelmäßig nichts übrig. Die Mangelverteilung der Anmerkung C findet nur innerhalb eines Rangs statt.</p>
<h2>Gesteigerte Erwerbsobliegenheit</h2>
<p>Der ${h.src('bgb1603', '§ 1603 Abs. 2 BGB')} verlangt von Eltern minderjähriger Kinder, alle verfügbaren Mittel gleichmäßig für sich und die Kinder einzusetzen. Daraus folgt eine gesteigerte Pflicht, zu arbeiten: Vollzeit, notfalls ein Wechsel der Stelle oder des Wohnorts, Überstunden oder ein Nebenjob, soweit zumutbar. Die ${h.src('olgLeitlinien', 'Leitlinien in NRW')} rechnen Einkünfte, die bei realer Beschäftigungschance erzielbar wären, als fiktives Einkommen an. Viele Gerichte prüfen im Mangelfall deshalb zuerst, ob der Pflichtige sich ausreichend beworben hat.</p>
<h2>Wenn der Unterhalt nicht reicht: Unterhaltsvorschuss</h2>
<p>Für Kinder unter 18 kann der betreuende Elternteil beim Jugendamt ${h.a('unterhaltsvorschuss', 'Unterhaltsvorschuss')} beantragen. Er beträgt den Mindestunterhalt minus volles Kindergeld; Zahlungen des anderen Elternteils werden nach ${h.src('uvg2', '§ 2 UVG')} abgezogen. Für das siebenjährige Kind im Beispiel blieben so ${h.eur(uvg7.leistung, 2)} monatlich, wenn die übrigen Voraussetzungen erfüllt sind. Das Land holt sich das Geld später beim Pflichtigen zurück, soweit er leistungsfähig ist.</p>
<p>Die Berechnung folgt der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026, Anmerkung C')}. Sie ist eine allgemeine Information über die Mangelfallverteilung und ersetzt keine Rechtsberatung; das Jugendamt bietet für Kinder eine kostenlose Beistandschaft an.</p>`,
  },
  en: {
    slug: 'shortfall-case',
    nav: 'Shortfall case',
    card: 'When income cannot cover every child: the amount shared out, the ranking and the official 2026 example.',
    title: 'Child Support Shortfall Germany 2026: Mangelfall Rules',
    description: `Germany's child support shortfall (Mangelfall) in 2026: ${EN.eur(S.notwendig_erwerbstaetig)} self-retention, sharing rules, ranking under section 1609 BGB and the official example redone.`,
    h1: 'The shortfall case: sharing too little money between several children',
    intro: 'When income cannot cover every child’s minimum and the parent’s own floor, all children are cut back in the same proportion.',
    resume: `A shortfall case (Mangelfall) arises when the paying parent’s adjusted net income cannot cover both the parent’s minimum self-retention (Selbstbehalt) and the support of all children of equal rank. Under note C of the 2026 Düsseldorf Table, only the distributable amount (Verteilungsmasse) is then shared out: income minus the self-retention of ${EN.eur(S.notwendig_erwerbstaetig)} for a working parent or ${EN.eur(S.notwendig_nicht_erwerbstaetig)} for one who is not working. Each child receives the share that its own input amount (Einsatzbetrag), meaning its payable amount after child benefit, bears to the total. In the table’s official example, the father earns ${EN.eur(P.dt.mangelfall_beispiel.netto)} and three children aged 18 (still at school), 7 and 5 would be owed ${EN.eur(einsatzSumme, 2)} together. Only ${EN.eur(amtlich.verteilungsmasse, 2)} is available, giving ${EN.eur(amtlich.kinder[0].zahlbetrag, 2)}, ${EN.eur(amtlich.kinder[1].zahlbetrag, 2)} and ${EN.eur(amtlich.kinder[2].zahlbetrag, 2)}. The full minimum would need about ${EN.eur(grenzeFam)} net. Minors and adult school pupils rank first under section 1609 of the Civil Code (BGB), ahead of any spouse.`,
    faqs: [
      { q: 'How is the distributable amount in a German shortfall case worked out?', a: `Take the adjusted net income and subtract the minimum self-retention: ${EN.eur(S.notwendig_erwerbstaetig)} if the parent works, ${EN.eur(S.notwendig_nicht_erwerbstaetig)} if not. On ${EN.eur(P.dt.mangelfall_beispiel.netto)} that leaves ${EN.eur(amtlich.verteilungsmasse, 2)} for all children together. A court may raise the self-retention if the parent’s reasonable warm rent is above the housing share built into it, which shrinks the amount further.` },
      { q: 'Does each child lose the same euro amount in a shortfall?', a: `No, the cut is proportional. Each child’s input amount, its payable figure after the child benefit share, is scaled down by the same factor. In the official example every child gets ${EN.pct(amtlich.verteilungsmasse / einsatzSumme, 1)} of its input amount, so the 18-year-old, whose input is highest because the full child benefit is deducted from a higher need, still receives the most.` },
      { q: 'Can a court expect me to take a second job when I cannot pay the minimum?', a: `Towards minors and school pupils under 21, parents carry a heightened duty under section 1603(2) BGB to use every available means. The NRW guidelines treat overtime or a side job as reasonable where possible and within the Working Hours Act. If you do not try hard enough to find work, the court can count an income you could earn (fiktives Einkommen) as if you had it.` },
      { q: 'My children live in Germany and I work abroad: can a shortfall still apply?', a: `Yes. German courts look at your adjusted net income, converted into euros, and apply the same German self-retention unless they see reason to adjust it for living costs abroad. How foreign tax, housing costs or exchange rates are treated is decided case by case. The shortfall share is then calculated exactly as shown on this page.` },
      { q: 'Where does a separated spouse rank in a German shortfall case?', a: `Behind the children. Section 1609 BGB puts minors and adult school pupils in rank 1; a parent entitled to maintenance for looking after a child, and a spouse after a long marriage, are in rank 2. A lower rank only receives money once every higher rank is paid in full, so in a shortfall the spouse usually receives nothing.` },
      { q: 'Can the state top up child support in a shortfall?', a: `For children under 18, the parent caring for them can apply to the youth welfare office (Jugendamt) for a maintenance advance (Unterhaltsvorschuss): the statutory minimum minus the full child benefit, less what the other parent pays. For the seven-year-old in the official example, receiving ${EN.eur(amtlich.kinder[1].zahlbetrag, 2)}, the top-up would come to ${EN.eur(uvg7.leistung, 2)} a month. Extra conditions apply from age twelve.` },
    ],
    body: (h) => `<h2>When German law speaks of a shortfall</h2>
<p>The NRW court guidelines call it an absolute shortfall when the parent’s income cannot cover the minimum self-retention plus the equal-ranking claims of the children. The yardstick is the statutory minimum, which is group 1 of the table, after the child benefit share. Earn less than the self-retention plus those amounts, and you are in a shortfall case.</p>
<p>Before this point the table has usually stepped the income group down already: the ${h.a('bedarfskontrollbetrag', 'needs-control amount')} lowers the group until there is no lower group left. Note C only starts once even group 1 cannot be afforded.</p>
<h2>Note C in three steps</h2>
<ul>
<li><strong>Distributable amount</strong>: adjusted net income minus self-retention (${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)} working, ${h.eur(h.P.selbstbehalt.notwendig_nicht_erwerbstaetig)} not working).</li>
<li><strong>Input amounts</strong>: for each child, the group 1 amount minus child benefit (Kindergeld): half of ${h.eur(h.P.kindergeld.monat)} for minors, all of it for adult children.</li>
<li><strong>Sharing</strong>: each child gets its input amount times the distributable amount, divided by the total of input amounts.</li>
</ul>
<h2>The official example, recalculated</h2>
<p>The Düsseldorf Table works through its own case: a father on ${h.eur(h.P.dt.mangelfall_beispiel.netto)} adjusted net income, three children living with their mother, who receives the child benefit. K1 is 18 and still at a general school, K2 is 7 and K3 is 5. The engine behind this site lands on the same cents.</p>
${h.table(['Child', 'Need, group 1', 'Child benefit share', 'Input amount', 'Support in shortfall'], amtlich.kinder.map((k, i) => [`K${i + 1}, aged ${k.alter}`, h.eur(k.bedarf), h.eur(k.kindergeld, 2), h.eur(k.tabellenZahlbetrag, 2), h.eur(k.zahlbetrag, 2)]).concat([['Total', '', '', h.eur(einsatzSumme, 2), h.eur(amtlich.summe, 2)]]), `Distributable amount ${h.eur(amtlich.verteilungsmasse, 2)} = ${h.eur(h.P.dt.mangelfall_beispiel.netto)} minus ${h.eur(amtlich.selbstbehalt)}`, ['l', 'r', 'r', 'r', 'r'])}
<p>Each child receives just under a quarter of its payable table amount. If the father could not work, for example through illness, his floor would be ${h.eur(h.P.selbstbehalt.notwendig_nicht_erwerbstaetig)} and ${h.eur(ohneJob.verteilungsmasse, 2)} would be shared: ${h.eur(ohneJob.kinder[0].zahlbetrag, 2)}, ${h.eur(ohneJob.kinder[1].zahlbetrag, 2)} and ${h.eur(ohneJob.kinder[2].zahlbetrag, 2)}. The lower floor only applies where work cannot be expected of him.</p>
<h2>How the figures move with income</h2>
${h.table(['Adjusted net', 'Shared out', 'K1 (18)', 'K2 (7)', 'K3 (5)'], stufen.map(({ n, r }) => [h.eur(n), h.eur(r.summe, 2), h.eur(r.kinder[0].zahlbetrag, 2), h.eur(r.kinder[1].zahlbetrag, 2), h.eur(r.kinder[2].zahlbetrag, 2)]).concat([[h.eur(grenzeFam), 'full minimum', h.eur(zahlbetrag(0, 3), 2), h.eur(zahlbetrag(0, 1), 2), h.eur(zahlbetrag(0, 0), 2)]]), 'Same family, working father, computed by the engine', ['l', 'r', 'r', 'r', 'r'])}
<p>Every euro above the self-retention goes to the children until all three minimums are met. That is why, in a shortfall, each deduction in the ${h.a('bereinigtes-netto', 'adjusted net income')} matters so much: commuting costs or loan repayments that the court accepts reduce the amount for the children one for one.</p>
<h2>Ranking under section 1609 BGB</h2>
<p>When other people are also entitled, the ${h.src('bgb1609', 'ranking in section 1609 BGB')} decides:</p>
<ul>
<li>Rank 1: minor children and adult pupils under 21 at a general school who live with a parent.</li>
<li>Rank 2: a parent entitled to support for looking after a child, and spouses after a long marriage.</li>
<li>Rank 3: other spouses and former spouses.</li>
<li>Rank 4: other children, such as university students.</li>
<li>Ranks 5 to 7: grandchildren, parents, then further ancestors.</li>
</ul>
<p>A lower rank receives nothing until every higher rank is paid in full. Note C sharing only happens inside one rank.</p>
<h2>The heightened duty to earn</h2>
<p>Under ${h.src('bgb1603', 'section 1603(2) BGB')}, parents of minors must use all available means evenly for themselves and the children. Courts read this as a heightened duty to work: full time, if need be a change of job or town, overtime or a side job where reasonable. The ${h.src('olgLeitlinien', 'NRW guidelines')} attribute income that could realistically be earned. For expats this can include whether a job in Germany at a comparable level was realistically available.</p>
<h2>State top-up: the maintenance advance</h2>
<p>For children under 18, the caring parent can apply for a ${h.a('unterhaltsvorschuss', 'maintenance advance')}. It equals the statutory minimum minus the full child benefit, less payments by the other parent under ${h.src('uvg2', 'section 2 of the Maintenance Advance Act')}. For the seven-year-old above that leaves ${h.eur(uvg7.leistung, 2)} a month if the other conditions are met. The state later reclaims it from the paying parent as far as he can pay.</p>
<p>The calculation follows ${h.src('olgDtPdf', 'note C of the 2026 Düsseldorf Table')}. This page is general information on how a shortfall is shared, not legal advice; the youth welfare office offers free support for children’s claims (Beistandschaft).</p>`,
  },
});
