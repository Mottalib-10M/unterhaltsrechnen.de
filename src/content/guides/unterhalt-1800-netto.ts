/** Unterhalt bei 1.800 € netto: knapp über dem Selbstbehalt, Mangelfall schon ab einem Kind, Unterhaltsvorschuss als Ergänzung. */
import { defineGuide } from '../../lib/guide-types';
import { kindesunterhalt, mangelfallGrenze, zahlbetrag } from '../../lib/engine/dt';
import { unterhaltsvorschuss } from '../../lib/engine/unterhalt';
import { P, DE, EN } from '../../lib/fmt';

const N = 1800;
const S = P.selbstbehalt;
const einKind = kindesunterhalt(N, [{ alter: 4 }]);
const zwei = kindesunterhalt(N, [{ alter: 4 }, { alter: 9 }]);
const drei = kindesunterhalt(N, [{ alter: 3 }, { alter: 7 }, { alter: 12 }]);
const ohneArbeit = kindesunterhalt(N, [{ alter: 9 }], { erwerbstaetig: false });
const uvg4 = unterhaltsvorschuss({ alter: 4, unterhaltErhalten: zwei.kinder[0].zahlbetrag });
const uvg9 = unterhaltsvorschuss({ alter: 9, unterhaltErhalten: zwei.kinder[1].zahlbetrag });
const grenze1 = mangelfallGrenze([{ alter: 4 }]);
const grenze2 = mangelfallGrenze([{ alter: 4 }, { alter: 9 }]);
const frei = N - S.notwendig_erwerbstaetig;

export default defineGuide({
  id: 'unterhalt-1800-netto',
  group: 'betrag',
  order: 10,
  mini: 'kuBetrag',
  miniDefaults: { n: 1800 },
  miniHref: 'kindesunterhalt-rechner',
  related: ['mangelfall', 'selbstbehalt', 'unterhaltsvorschuss', 'mindestunterhalt', 'unterhalt-2500-netto'],
  sources: ['olgDtPdf', 'bgb1603', 'uvg2', 'bgb1609'],
  de: {
    slug: 'unterhalt-bei-1800-euro-netto',
    nav: 'Unterhalt bei 1.800 € netto',
    card: 'Knapp über dem Selbstbehalt: warum schon ein Kind zum Mangelfall führt und wann der Staat ergänzt.',
    title: 'Unterhalt bei 1.800 € netto 2026: Mangelfall ab 1 Kind',
    description: `Unterhalt bei 1.800 € netto 2026: Selbstbehalt ${DE.eur(S.notwendig_erwerbstaetig)}, nur ${DE.eur(frei)} verfügbar, Mangelfall schon ab einem Kind, Unterhaltsvorschuss des Jugendamts als Ausgleich.`,
    h1: 'Kindesunterhalt bei 1.800 € netto',
    intro: 'Bei diesem Einkommen entscheidet nicht die Tabelle, sondern der Selbstbehalt, wie viel bei den Kindern ankommt.',
    resume: `Wer ${DE.eur(N)} bereinigtes Netto verdient und arbeitet, darf nach der Düsseldorfer Tabelle 2026 ${DE.eur(S.notwendig_erwerbstaetig)} für sich behalten. Für Kindesunterhalt stehen also höchstens ${DE.eur(frei)} im Monat zur Verfügung, gleich wie viele Kinder es sind. Schon ein einziges Kind unter sechs Jahren hätte nach Abzug des halben Kindergelds Anspruch auf ${DE.eur(zahlbetrag(0, 0), 2)}; das sind mehr als die verfügbaren ${DE.eur(frei)}, deshalb liegt bereits hier ein Mangelfall vor und das Kind erhält ${DE.eur(einKind.summe, 2)}. Bei zwei Kindern von vier und neun Jahren teilen sich beide dieselben ${DE.eur(zwei.verteilungsmasse)}: ${DE.eur(zwei.kinder[0].zahlbetrag, 2)} und ${DE.eur(zwei.kinder[1].zahlbetrag, 2)}. Was zum Mindestunterhalt fehlt, kann bei Kindern unter zwölf Jahren das Jugendamt als Unterhaltsvorschuss ausgleichen. Erst ab ${DE.eur(grenze1)} Netto ist für ein Kind dieses Alters der volle Mindestunterhalt bezahlbar.`,
    faqs: [
      { q: 'Wie viel Unterhalt zahle ich bei 1.800 € netto für drei Kinder?', a: `Zusammen nicht mehr als bei einem Kind: ${DE.eur(drei.summe, 2)} im Monat, weil Ihnen als Erwerbstätigem ${DE.eur(S.notwendig_erwerbstaetig)} bleiben müssen. Die Summe wird im Verhältnis der Mindestbeträge aufgeteilt; bei Kindern von drei, sieben und zwölf Jahren sind das ${drei.kinder.map((k) => DE.eur(k.zahlbetrag, 2)).join(', ')}. Das Gericht prüft aber, ob Sie mit mehr Stunden oder einem Nebenjob mehr verdienen könnten.` },
      { q: 'Muss ich bei 1.800 € netto einen Nebenjob annehmen?', a: `Gegenüber minderjährigen Kindern gilt eine gesteigerte Erwerbspflicht (§ 1603 Abs. 2 BGB). Wer den Mindestunterhalt nicht aufbringt, muss alle zumutbaren Möglichkeiten nutzen, mehr zu verdienen, etwa Vollzeit statt Teilzeit, Überstunden oder eine Nebentätigkeit im zulässigen Rahmen. Bemüht man sich nicht nachweisbar, darf das Familiengericht ein erzielbares, fiktives Einkommen ansetzen.` },
      { q: 'Wird der Unterhaltsvorschuss angerechnet, wenn ich nur einen Teil zahle?', a: `Ja. Der Unterhaltsvorschuss füllt nur die Lücke bis zum Mindestunterhalt abzüglich Kindergeld. Zahlen Sie für ein vierjähriges Kind ${DE.eur(zwei.kinder[0].zahlbetrag, 2)}, erhält es vom Jugendamt noch ${DE.eur(uvg4.leistung, 2)}. Das Jugendamt kann den vorgeschossenen Betrag später von Ihnen zurückfordern, soweit Sie leistungsfähig gewesen wären.` },
      { q: 'Ändert sich etwas, wenn ich 1.800 € Rente oder Krankengeld beziehe?', a: `Ja. Wer nicht erwerbstätig ist, hat einen niedrigeren Selbstbehalt von ${DE.eur(S.notwendig_nicht_erwerbstaetig)}, weil berufsbedingte Ausgaben entfallen. Dann reicht dasselbe Einkommen für ein Kind von neun Jahren: Es erhält den vollen Mindestbetrag von ${DE.eur(ohneArbeit.summe, 2)}, und Ihnen bleiben danach noch ${DE.eur(ohneArbeit.verbleibt, 2)}.` },
    ],
    body: (h) => `<h2>Die Rechnung in drei Zeilen</h2>
<p>Bei ${h.eur(N)} Netto liegen Sie in der ersten Einkommensgruppe der Tabelle, die bis ${h.eur(h.P.dt.gruppen_bis[0])} reicht. Ihr Bedarfskontrollbetrag und Ihr Selbstbehalt sind hier gleich hoch, nämlich ${h.eur(S.notwendig_erwerbstaetig)}. Was darüber liegt, ${h.eur(frei)}, ist die gesamte Summe, aus der Kindesunterhalt bezahlt werden kann. Die Tabelle setzt den Bedarf der Kinder davon unabhängig fest; der Selbstbehalt entscheidet, wie viel davon tatsächlich gezahlt wird.</p>
${h.table(['Kinder', 'Mindestunterhalt nach Tabelle', 'Tatsächlich zu zahlen', 'Mangelfall'], [
  ['ein Kind, 4 Jahre', h.eur(zahlbetrag(0, 0), 2), h.eur(einKind.summe, 2), einKind.mangelfall ? 'ja' : 'nein'],
  ['zwei Kinder, 4 und 9 Jahre', h.eur(zahlbetrag(0, 0) + zahlbetrag(0, 1), 2), h.eur(zwei.summe, 2), zwei.mangelfall ? 'ja' : 'nein'],
  ['drei Kinder, 3, 7 und 12 Jahre', h.eur(zahlbetrag(0, 0) + zahlbetrag(0, 1) + zahlbetrag(0, 2), 2), h.eur(drei.summe, 2), drei.mangelfall ? 'ja' : 'nein'],
], `Erwerbstätiger Elternteil mit ${h.eur(N)} bereinigtem Netto, vom Rechner ermittelt`, ['l', 'r', 'r', 'l'])}
<h2>Warum schon ein Kind nicht voll bezahlt wird</h2>
<p>Der Zahlbetrag für ein Kind unter sechs Jahren liegt 2026 bei ${h.eur(zahlbetrag(0, 0), 2)}. Ihnen blieben danach ${h.eur(N - zahlbetrag(0, 0), 2)}, weniger als die ${h.eur(S.notwendig_erwerbstaetig)}, die das Gesetz Ihnen lässt (§ 1603 BGB). Der Unterschied ist klein, aber er reicht für den Mangelfall: Das Kind erhält den verfügbaren Betrag. Ab ${h.eur(grenze1)} Netto entfällt die Kürzung für dieses eine Kind, bei zwei Kindern von vier und neun Jahren erst ab ${h.eur(grenze2)}.</p>
<h2>Was der Staat ergänzt</h2>
<p>Für Kinder unter zwölf Jahren springt das Jugendamt mit dem ${h.a('unterhaltsvorschuss', 'Unterhaltsvorschuss')} ein, wenn weniger als der Mindestunterhalt ankommt. Im Beispiel mit zwei Kindern erhält das jüngere zusätzlich ${h.eur(uvg4.leistung, 2)}, das ältere ${h.eur(uvg9.leistung, 2)}. Den Antrag stellt der Elternteil, bei dem die Kinder leben. Ab zwölf Jahren gibt es den Vorschuss nur unter weiteren Voraussetzungen, etwa wenn das Kind keine Leistungen nach dem SGB II bezieht oder der betreuende Elternteil ein eigenes Einkommen von mindestens ${h.eur(h.P.uvg.mindesteinkommen_elternteil_ab12)} hat (${h.src('uvg1', '§ 1 UVG')}).</p>
<h2>Wer bei 1.800 € besonders genau hinsehen sollte</h2>
<ul>
<li><strong>Teilzeit</strong>: Familiengerichte rechnen oft mit dem Einkommen einer Vollzeitstelle, wenn eine solche zumutbar wäre.</li>
<li><strong>Raten für Kredite</strong>: Sie mindern das bereinigte Netto nur, wenn das Gericht sie anerkennt; im Mangelfall wird das streng geprüft.</li>
<li><strong>Neue Partnerschaft</strong>: Wer mit einem verdienenden Partner zusammenlebt, spart Wohnkosten; der Selbstbehalt kann dann niedriger angesetzt werden.</li>
<li><strong>Weiteres Kind im eigenen Haushalt</strong>: Es steht im selben Rang und verkleinert den Anteil aller anderen Kinder.</li>
</ul>
<p>Grundlage sind die ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} mit ihrer Anmerkung C und § 1609 BGB zur Rangfolge. Die Beträge sind eine allgemeine Berechnung für ein bereinigtes Netto von ${h.eur(N)}, keine Prüfung Ihres Falls; mit anderen Kinderzahlen rechnet der ${h.a('kindesunterhalt-rechner', 'Kindesunterhalt-Rechner')}.</p>`,
  },
  en: {
    slug: 'child-support-on-1800-net',
    nav: 'Support on €1,800 net',
    card: 'Just above the self-retention: why even one child means a shortfall case and when the state tops up.',
    title: 'Child Support on €1,800 Net in Germany 2026: Shortfall',
    description: `Child support on €1,800 net in Germany 2026: you keep ${EN.eur(S.notwendig_erwerbstaetig)}, only ${EN.eur(frei)} is available, a shortfall from the first child, maintenance advance as the top-up.`,
    h1: 'German child support on €1,800 net a month',
    intro: 'At this income it is your self-retention, not the table, that decides how much reaches the children.',
    resume: `A working parent with ${EN.eur(N)} of adjusted net income (bereinigtes Nettoeinkommen) may keep ${EN.eur(S.notwendig_erwerbstaetig)} under the 2026 Düsseldorf Table. At most ${EN.eur(frei)} a month is therefore available for child support, however many children there are. A single child under six would be owed ${EN.eur(zahlbetrag(0, 0), 2)} after the half child-benefit deduction, which is more than the ${EN.eur(frei)} on hand: this is already a shortfall case (Mangelfall), and the child receives ${EN.eur(einKind.summe, 2)}. Two children aged four and nine share the same ${EN.eur(zwei.verteilungsmasse)}: ${EN.eur(zwei.kinder[0].zahlbetrag, 2)} and ${EN.eur(zwei.kinder[1].zahlbetrag, 2)}. For children under twelve, the youth welfare office (Jugendamt) can make up part of the gap as a maintenance advance (Unterhaltsvorschuss). Only from ${EN.eur(grenze1)} net can a working parent afford the full minimum for one child of that age.`,
    faqs: [
      { q: 'How much do I pay on €1,800 net for three children?', a: `No more in total than for one: ${EN.eur(drei.summe, 2)} a month, because a working parent keeps ${EN.eur(S.notwendig_erwerbstaetig)}. The sum is split in proportion to the minimum amounts; for children aged three, seven and twelve that gives ${drei.kinder.map((k) => EN.eur(k.zahlbetrag, 2)).join(', ')}. The court will, however, ask whether you could earn more with longer hours or a second job.` },
      { q: 'My salary is €1,800 because I work part time. Will the court accept that?', a: `Not automatically. Towards minor children German law imposes an increased duty to work (section 1603(2) of the Civil Code, BGB). If full-time work would be reasonable, the family court (Familiengericht) can base support on the income you could earn, a so-called notional income. Expats whose German is still limited may argue their job options are narrower, but they must show real applications.` },
      { q: 'Does the maintenance advance count what I already pay?', a: `Yes. The advance only covers the gap up to the minimum after child benefit. If you pay ${EN.eur(zwei.kinder[0].zahlbetrag, 2)} for a four-year-old, the youth welfare office adds ${EN.eur(uvg4.leistung, 2)}. It may later claim the advanced amount back from you to the extent you could have paid it.` },
      { q: 'What if my €1,800 comes from a pension or sick pay?', a: `Parents who are not working have a lower self-retention of ${EN.eur(S.notwendig_nicht_erwerbstaetig)}, because work costs fall away. Then €1,800 covers one child aged nine in full: the child receives the minimum of ${EN.eur(ohneArbeit.summe, 2)}, and you keep ${EN.eur(ohneArbeit.verbleibt, 2)}. Courts usually treat unemployment benefit (Arbeitslosengeld) the same way as a pension here.` },
    ],
    body: (h) => `<h2>The arithmetic</h2>
<p>With ${h.eur(N)} net you are in the first income group of the table, which runs up to ${h.eur(h.P.dt.gruppen_bis[0])}. In this group the needs-control amount and the self-retention (Selbstbehalt) are the same figure, ${h.eur(S.notwendig_erwerbstaetig)}. Everything above it, ${h.eur(frei)}, is the entire pot for child support. The table fixes the children’s need independently; the self-retention decides how much of it is actually paid.</p>
${h.table(['Children', 'Table minimum', 'Actually payable', 'Shortfall'], [
  ['one child, 4', h.eur(zahlbetrag(0, 0), 2), h.eur(einKind.summe, 2), einKind.mangelfall ? 'yes' : 'no'],
  ['two children, 4 and 9', h.eur(zahlbetrag(0, 0) + zahlbetrag(0, 1), 2), h.eur(zwei.summe, 2), zwei.mangelfall ? 'yes' : 'no'],
  ['three children, 3, 7 and 12', h.eur(zahlbetrag(0, 0) + zahlbetrag(0, 1) + zahlbetrag(0, 2), 2), h.eur(drei.summe, 2), drei.mangelfall ? 'yes' : 'no'],
], `Working parent on ${h.eur(N)} adjusted net income, computed by the calculator`, ['l', 'r', 'r', 'l'])}
<h2>Why even one child is not paid in full</h2>
<p>The amount payable for a child under six is ${h.eur(zahlbetrag(0, 0), 2)} in 2026. You would be left with ${h.eur(N - zahlbetrag(0, 0), 2)}, below the ${h.eur(S.notwendig_erwerbstaetig)} the law protects (section 1603 BGB). The gap is small but enough to trigger the shortfall rule: the child receives what is available. From ${h.eur(grenze1)} net the cut disappears for that one child; for two children aged four and nine only from ${h.eur(grenze2)}.</p>
<h2>What the state adds</h2>
<p>For children under twelve the youth welfare office pays the ${h.a('unterhaltsvorschuss', 'maintenance advance')} when less than the minimum arrives. In the two-child example the younger child receives a further ${h.eur(uvg4.leistung, 2)}, the older ${h.eur(uvg9.leistung, 2)}. The parent the children live with applies. From twelve the advance is paid only under extra conditions, for example if the child receives no basic income support under SGB II or the caring parent earns at least ${h.eur(h.P.uvg.mindesteinkommen_elternteil_ab12)} (${h.src('uvg1', 'section 1 UVG')}).</p>
<h2>Situations that change the picture</h2>
<ul>
<li><strong>A new partner</strong>: sharing a flat with an earning partner lowers your housing costs, and courts may reduce your self-retention.</li>
<li><strong>Loan repayments</strong>: they reduce adjusted income only if the court accepts them, which it checks strictly in a shortfall case.</li>
<li><strong>A child in your new household</strong>: it ranks equally and shrinks every other child’s share.</li>
<li><strong>Income in another currency</strong>: it is converted into euros; exchange-rate swings can move you across the shortfall line.</li>
</ul>
<p>The basis is the ${h.src('olgDtPdf', '2026 Düsseldorf Table')} with its note C and section 1609 BGB on ranking. These figures are a general calculation for ${h.eur(N)} adjusted net income, not a review of your case; for other family sizes use the ${h.a('kindesunterhalt-rechner', 'child support calculator')}.</p>`,
  },
});
