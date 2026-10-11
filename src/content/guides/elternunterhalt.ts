import { defineGuide } from '../../lib/guide-types';
import { elternunterhalt } from '../../lib/engine/unterhalt';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor, nie von Hand. */
const S = P.selbstbehalt;
const GRENZE = P.elternunterhalt.jahreseinkommensgrenze;
const FREI = S.eltern_anrechnungsfrei_anteil;
/** Tochter, Ärztin: 118.000 € Jahreseinkommen, 5.400 € bereinigt netto, Heimkostenlücke der Mutter 1.200 €. */
const tochter = elternunterhalt({ nettoBereinigt: 5400, jahresbrutto: 118000, luecke: 1200 });
/** Bruder, Ingenieur: 96.000 € Jahreseinkommen, 4.900 € netto. */
const bruder = elternunterhalt({ nettoBereinigt: 4900, jahresbrutto: 96000, luecke: 1200 });
/** Hoher Verdiener: 6.500 € netto, 140.000 €, Lücke nur 900 €. */
const hoch = elternunterhalt({ nettoBereinigt: 6500, jahresbrutto: 140000, luecke: 900 });
/** Selbstbehalt je Nettoeinkommen, oberhalb der Grenze gerechnet. */
const stufen = [3000, 4000, 5000, 6500, 8000].map((n) => ({ n, r: elternunterhalt({ nettoBereinigt: n, jahresbrutto: GRENZE + 1, luecke: 1e6 }) }));
const familie = S.eltern + S.eltern_ehegatte_mindest;

export default defineGuide({
  id: 'elternunterhalt',
  group: 'ehe',
  order: 42,
  mini: 'elternGrenze',
  related: ['elternunterhalt-rechner', 'selbstbehalt', 'bereinigtes-netto', 'unterhaltsverfahren-kosten', 'ehegattenunterhalt'],
  sources: ['sgb12_94', 'bgb1601', 'olgDtPdf', 'olgLeitlinien', 'bgb1603'],
  de: {
    slug: 'elternunterhalt',
    nav: 'Elternunterhalt',
    card: `Die ${DE.num(GRENZE)}-Euro-Grenze, Selbstbehalt ${DE.eur(S.eltern)} plus ${DE.pct(FREI)} des Mehreinkommens, Ehegatte und Sozialamt.`,
    title: `Elternunterhalt 2026: ${DE.num(GRENZE)}-Euro-Grenze und Selbstbehalt`,
    description: `Elternunterhalt 2026: Das Sozialamt greift nur über ${DE.eur(GRENZE)} Jahreseinkommen zu. Selbstbehalt ${DE.eur(S.eltern)} plus ${DE.pct(FREI)} des Mehrbetrags, Ehegatte, Geschwister.`,
    h1: 'Elternunterhalt: wann Kinder für Pflegekosten der Eltern zahlen',
    intro: 'Bevor das Sozialamt Geld von Kindern verlangen darf, zählt zuerst eine einzige Zahl: deren Jahreseinkommen.',
    resume: `Elternunterhalt muss ein erwachsenes Kind 2026 praktisch nur zahlen, wenn sein jährliches Gesamteinkommen im Sinne des § 16 SGB IV mehr als ${DE.eur(GRENZE)} beträgt. Bis zu dieser Grenze geht der Unterhaltsanspruch pflegebedürftiger Eltern, die Sozialhilfe beziehen, nicht auf das Sozialamt über (§ 94 Abs. 1a SGB XII), und das Amt vermutet zunächst, dass die Grenze nicht überschritten ist. Liegt das Einkommen darüber, bleibt dem Kind nach Anmerkung D I der Düsseldorfer Tabelle ein Selbstbehalt von mindestens ${DE.eur(S.eltern)} im Monat, darin ${DE.eur(S.eltern_warmmiete)} Warmmiete, zuzüglich ${DE.pct(FREI)} des darüber liegenden bereinigten Nettoeinkommens. Einsetzen muss es also nur ${DE.pct(1 - FREI)} des Mehrbetrags. Eine Ärztin mit ${DE.eur(118000)} Jahreseinkommen und ${DE.eur(5400)} bereinigtem Netto behält ${DE.eur(tochter.selbstbehalt)} und zahlt höchstens ${DE.eur(tochter.leistungsfaehig)} im Monat. Ihr Bruder mit ${DE.eur(96000)} zahlt nichts, obwohl er rechnerisch leistungsfähig wäre. Für einen mit dem Kind zusammenlebenden Ehegatten werden mindestens ${DE.eur(S.eltern_ehegatte_mindest)} angesetzt. Die Grenze gilt für jedes Kind einzeln.`,
    faqs: [
      { q: `Zählt beim Elternunterhalt das Einkommen meines Ehepartners zur ${DE.num(GRENZE)}-Euro-Grenze?`, a: `Nein. § 94 Abs. 1a SGB XII stellt auf das Gesamteinkommen des einzelnen Kindes ab, nicht auf das des Haushalts. Ein gut verdienendes Schwiegerkind macht das Kind nicht zum Pflichtigen. Liegt das Kind selbst über ${DE.eur(GRENZE)}, kann das Einkommen des Ehegatten bei der Frage, wie viel das Kind leisten kann, allerdings eine Rolle spielen, weil der Familienunterhalt einbezogen wird. Das beurteilen die Gerichte im Einzelfall.` },
      { q: 'Was zählt als Jahreseinkommen für die Grenze beim Elternunterhalt?', a: 'Das Gesamteinkommen nach § 16 SGB IV, also die Summe der Einkünfte im Sinne des Einkommensteuerrechts. Bei Arbeitnehmern ist das im Wesentlichen das Bruttogehalt nach Abzug der Werbungskosten, bei Selbstständigen der Gewinn; Miet- und Kapitaleinkünfte kommen hinzu. Es ist also weder das Netto noch das bereinigte Einkommen des Unterhaltsrechts, sondern eine deutlich höhere Zahl aus dem Steuerbescheid.' },
      { q: 'Muss ich dem Sozialamt meine Gehaltsabrechnungen schicken, wenn meine Mutter ins Pflegeheim kommt?', a: `Zunächst nicht. Das Gesetz vermutet, dass Kinder unter ${DE.eur(GRENZE)} liegen. Das Sozialamt darf von der Mutter Angaben verlangen, die Rückschlüsse auf Ihr Einkommen zulassen, etwa zu Ihrem Beruf. Erst wenn es hinreichende Anhaltspunkte für ein Überschreiten gibt, kann es von Ihnen selbst Auskunft verlangen (§ 94 Abs. 1a in Verbindung mit § 117 SGB XII).` },
      { q: 'Wie viel bleibt mir beim Elternunterhalt, wenn ich verheiratet bin?', a: `Für Sie selbst mindestens ${DE.eur(S.eltern)}, für den mit Ihnen lebenden Ehegatten mindestens ${DE.eur(S.eltern_ehegatte_mindest)}, als Familie also mindestens ${DE.eur(familie)} im Monat. Hinzu kommt ein Anteil des darüber liegenden Familieneinkommens. Der Bedarf des Ehegatten richtet sich nach den ehelichen Lebensverhältnissen und kann deshalb höher liegen als der Mindestbetrag. Die genaue Rechnung bei Doppelverdienern ist Sache der Gerichte.` },
      { q: 'Muss mein Bruder mitzahlen, wenn nur ich über der Elternunterhalt-Grenze liege?', a: 'Die Grenze wird für jedes Kind getrennt geprüft. Liegt Ihr Bruder darunter, kann das Sozialamt bei ihm keinen Unterhalt geltend machen. Grundsätzlich haften Geschwister anteilig nach ihren Einkommen; wie sich der Ausfall eines Geschwisters unter der Grenze auf den Anteil der anderen auswirkt, ist eine Frage des Einzelfalls, die im Streit das Familiengericht entscheidet.' },
      { q: 'Wird beim Elternunterhalt mein Haus oder Erspartes angetastet?', a: 'Unterhalb der Einkommensgrenze nicht, denn dann geht der Anspruch überhaupt nicht auf das Sozialamt über, gleich wie groß das Vermögen ist. Oberhalb kommt es darauf an. Ein selbst genutztes Eigenheim wird nach den Leitlinien beim Elternunterhalt mit dem angemessenen Wohnwert angesetzt, nicht mit der Marktmiete. Ob und in welchem Umfang Rücklagen eingesetzt werden müssen, entscheiden Gerichte nach den Umständen.' },
    ],
    body: (h) => `<h2>Wer seinen Eltern Unterhalt schuldet</h2>
<p>Verwandte in gerader Linie sind einander zum Unterhalt verpflichtet (${h.src('bgb1601', '§ 1601 BGB')}). Das gilt nicht nur von den Eltern zu den Kindern, sondern auch umgekehrt. Praktisch wird der Elternunterhalt fast nur, wenn ein Elternteil pflegebedürftig wird und Rente, Pflegeversicherung und eigenes Vermögen die Kosten eines Heims oder der häuslichen Pflege nicht decken. Dann zahlt das Sozialamt Hilfe zur Pflege nach dem SGB XII und prüft, ob es sich das Geld bei den Kindern zurückholen kann.</p>
<p>Nach Nummer 19 der ${h.src('olgLeitlinien', 'Leitlinien der Oberlandesgerichte in NRW')} müssen Eltern ihren Bedarf konkret darlegen, und die Grundsicherung im Alter geht dem Elternunterhalt vor. Ein Kind zahlt also nur die Lücke, die nach allen vorrangigen Leistungen bleibt.</p>
<h2>Die Grenze von ${h.eur(GRENZE)}</h2>
<p>${h.src('sgb12_94', '§ 94 Abs. 1a SGB XII')} schützt die große Mehrheit der Familien. Unterhaltsansprüche von Sozialhilfeempfängern gegenüber ihren Kindern werden nicht berücksichtigt, wenn das jährliche Gesamteinkommen des Kindes ${h.eur(GRENZE)} nicht übersteigt. Der Anspruch geht dann nicht auf das Sozialamt über. Maßgeblich ist das Gesamteinkommen nach § 16 SGB IV, die Summe der steuerlichen Einkünfte, nicht das Netto.</p>
<p>Drei Einzelheiten sind wichtig:</p>
<ul>
<li>Die Grenze gilt für jedes Kind getrennt. Geschwister werden nicht zusammengerechnet, das Einkommen eines Ehegatten ebenfalls nicht.</li>
<li>Das Gesetz vermutet, dass ein Kind unter der Grenze liegt. Das Sozialamt muss Anhaltspunkte für das Gegenteil haben, bevor es vom Kind selbst Auskunft verlangen kann.</li>
<li>Für die Vergangenheit kann das Amt übergegangenen Unterhalt nur ab dem Zeitpunkt fordern, zu dem es dem Kind die Leistung schriftlich mitgeteilt hat (§ 94 Abs. 4 SGB XII).</li>
</ul>
<p>Wer knapp über der Grenze liegt, ist damit noch nicht automatisch zahlungspflichtig. Ab hier beginnt die eigentliche Unterhaltsrechnung nach dem BGB.</p>
<h2>Der Selbstbehalt 2026</h2>
<p>Die ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} legt in Anmerkung D I erstmals einen festen Rahmen fest: Dem Kind bleiben mindestens ${h.eur(S.eltern)} im Monat, darin ${h.eur(S.eltern_warmmiete)} Warmmiete, und zusätzlich ${h.pct(FREI, 0)} des Einkommens, das darüber liegt. Für den Elternunterhalt einsetzen muss es nur die übrigen ${h.pct(1 - FREI, 0)}.</p>
${h.table(['Bereinigtes Netto', 'Selbstbehalt', 'höchstens einsetzbar'], stufen.map(({ n, r }) => [h.eur(n), h.eur(r.selbstbehalt), h.eur(r.leistungsfaehig)]), `Je Monat, bei einem Jahreseinkommen über ${h.eur(GRENZE)}, vom Motor berechnet`, ['r', 'r', 'r'])}
<p>Die Tabelle zeigt, wie stark die Belastung gedämpft ist: Selbst bei ${h.eur(8000)} bereinigtem Netto bleibt mehr als die Hälfte des Einkommens über dem Mindestselbstbehalt beim Kind. Bereinigt wird das Einkommen wie sonst im Unterhaltsrecht. Zusätzlich erkennen die Leitlinien beim Elternunterhalt eine private Altersvorsorge von ${h.pct(h.P.leitlinien.altersvorsorge_sekundaer_eltern, 0)} des Bruttoeinkommens an, sofern sie tatsächlich gezahlt wird. Wer im eigenen Haus wohnt, dem wird nur ein angemessener Wohnwert angerechnet, nicht die Miete, die das Haus am Markt erzielen würde.</p>
<h2>Ehegatte und Familie</h2>
<p>Ist das Kind verheiratet, steht der mit ihm lebende Ehegatte im Rang vor den Eltern. Für ihn setzt die Tabelle mindestens ${h.eur(S.eltern_ehegatte_mindest)} an; der Familienmindestbedarf liegt damit bei ${h.eur(familie)}. Höher kann er sein, weil sich der Bedarf des Ehegatten nach den ehelichen Lebensverhältnissen richtet. Unterhalt für eigene Kinder geht dem Elternunterhalt ebenfalls vor und wird vorher abgezogen.</p>
<h2>Drei Geschwister, drei Ergebnisse</h2>
<p>Die Mutter lebt im Pflegeheim, nach Rente, Pflegeversicherung und Grundsicherung fehlen ${h.eur(1200)} im Monat. Die Tochter, Ärztin, hat ein Jahreseinkommen von ${h.eur(118000)} und ein bereinigtes Netto von ${h.eur(5400)}. Ihr Selbstbehalt beträgt ${h.eur(tochter.selbstbehalt)}, leisten kann sie ${h.eur(tochter.leistungsfaehig)}. Der Bruder, Ingenieur, verdient ${h.eur(96000)} im Jahr; obwohl ihm rechnerisch ${h.eur(bruder.leistungsfaehig)} übrig blieben, zahlt er ${h.eur(bruder.unterhalt)}, weil er unter der Grenze liegt. Ein dritter Sohn mit ${h.eur(140000)} Jahreseinkommen und ${h.eur(6500)} Netto könnte ${h.eur(hoch.leistungsfaehig)} leisten; würde er allein herangezogen und betrüge die Lücke nur ${h.eur(900)}, wären es ${h.eur(hoch.unterhalt)}, mehr als die Lücke schuldet niemand.</p>
<p>Sind mehrere Geschwister über der Grenze, haften sie anteilig nach ihren Einkommen (§ 1606 Abs. 3 Satz 1 BGB). Zusätzlich schließt § 94 Abs. 3 SGB XII den Übergang aus, soweit er eine unbillige Härte bedeuten würde; ob ein solcher Fall vorliegt, prüft das Amt und im Streit das Gericht.</p>
<h2>Verfahren</h2>
<p>Das Sozialamt meldet sich mit einer schriftlichen Mitteilung, oft Rechtswahrungsanzeige genannt, und bittet um Auskunft. Einigen sich Amt und Kind nicht, entscheidet das Familiengericht. Ob sich ein Rechtsstreit lohnt, hängt von Betrag und Dauer ab; einen Überblick über die Kosten gibt die Seite zu den ${h.a('unterhaltsverfahren-kosten', 'Kosten eines Unterhaltsverfahrens')}. Die eigene Rechnung macht der ${h.a('elternunterhalt-rechner', 'Elternunterhalt-Rechner')}, die übrigen Selbstbehalte stehen auf der Seite zum ${h.a('selbstbehalt', 'Selbstbehalt')}.</p>
<p>Die Darstellung ist eine allgemeine Information zum Elternunterhalt nach SGB XII, BGB und Düsseldorfer Tabelle 2026 und keine Rechtsberatung; über den Einzelfall entscheiden Sozialamt und Familiengericht.</p>`,
  },
  en: {
    slug: 'parental-maintenance',
    nav: 'Parental maintenance',
    card: `The ${EN.num(GRENZE)} euro income limit, a self-retention of ${EN.eur(S.eltern)} plus ${EN.pct(FREI)} of the excess, spouses and the welfare office.`,
    title: `Parental Maintenance Germany 2026: the ${EN.num(GRENZE)} Euro Rule`,
    description: `Parental maintenance in Germany 2026: welfare offices claim only above ${EN.eur(GRENZE)} annual income. Self-retention ${EN.eur(S.eltern)} plus ${EN.pct(FREI)} of the excess, spouses.`,
    h1: 'Parental maintenance: when children pay for a parent’s care',
    intro: 'Before a German welfare office may ask a child for money, one figure decides everything: the child’s annual income.',
    resume: `In Germany an adult child will in practice only pay maintenance for a parent (Elternunterhalt) in 2026 if his or her total annual income under section 16 of Social Code IV exceeds ${EN.eur(GRENZE)}. Up to that limit, the claim of a parent receiving social assistance, typically help with nursing-home costs, does not pass to the welfare office (Sozialamt) under section 94(1a) of Social Code XII, and the office must assume the limit is not exceeded. Above it, note D I of the Düsseldorf Table (Düsseldorfer Tabelle) lets the child keep at least ${EN.eur(S.eltern)} a month, including ${EN.eur(S.eltern_warmmiete)} warm rent, plus ${EN.pct(FREI)} of the adjusted net income above that figure. Only ${EN.pct(1 - FREI)} of the excess is available for the parent. A doctor with ${EN.eur(118000)} annual income and ${EN.eur(5400)} adjusted net keeps ${EN.eur(tochter.selbstbehalt)} and pays at most ${EN.eur(tochter.leistungsfaehig)} a month. Her brother on ${EN.eur(96000)} pays nothing, although on paper he could. A spouse living with the child is allowed at least ${EN.eur(S.eltern_ehegatte_mindest)}. The limit is tested separately for each child.`,
    faqs: [
      { q: `Does my spouse’s salary count towards the ${EN.num(GRENZE)} euro limit for parental maintenance?`, a: `No. Section 94(1a) of Social Code XII looks at the income of each child, not the household. A high-earning son- or daughter-in-law does not make the child liable. If the child alone is above ${EN.eur(GRENZE)}, the spouse’s income can matter when working out how much the child can pay, because family maintenance is taken into account. Courts decide that case by case.` },
      { q: 'I work in Germany but have income abroad. What counts as annual income for parental maintenance?', a: 'The test uses total income under section 16 of Social Code IV, the sum of income as defined by German income tax law: for employees broadly gross pay less work expenses, for the self-employed profit, plus rental and investment income. How foreign income is treated for this test is not spelled out in section 94; the office starts from the German tax assessment, so keep yours ready and ask how it is read.' },
      { q: 'My mother moved into a care home in Germany. Will the welfare office contact me?', a: `Not automatically. The law presumes that children earn no more than ${EN.eur(GRENZE)}. The office may ask your mother for information that hints at your income, such as your profession. Only where there are sufficient indications that you exceed the limit can it ask you directly for details (section 94(1a) with section 117 of Social Code XII).` },
      { q: 'How much do I keep from parental maintenance if I am married?', a: `At least ${EN.eur(S.eltern)} for you and at least ${EN.eur(S.eltern_ehegatte_mindest)} for the spouse living with you, so a family minimum of ${EN.eur(familie)} a month, plus a share of the family income above that. The spouse’s need follows the couple’s standard of living and can exceed the minimum. Detailed calculations for dual-income couples are for the courts.` },
      { q: 'I live outside Germany. Can a German welfare office claim parental maintenance from me?', a: 'The income limit and self-retention apply to the German claim as described here. Whether and how a German office can pursue a child living abroad depends on the applicable law and on treaties between Germany and that country, which this page cannot assess. Expect the same first step: the office must have indications that your income exceeds the limit before demanding information.' },
    ],
    body: (h) => `<h2>Who owes parents support</h2>
<p>Relatives in a direct line owe each other maintenance (${h.src('bgb1601', 'section 1601 of the Civil Code, BGB')}), which runs from children to parents as well as the other way round. In real life the issue arises when a parent needs long-term care and pension, care insurance (Pflegeversicherung) and savings do not cover a nursing home or home care. The welfare office then pays help with care (Hilfe zur Pflege) under Social Code XII and checks whether it can recover the money from the children.</p>
<p>Under number 19 of the ${h.src('olgLeitlinien', 'NRW court guidelines')}, parents must show their need in detail, and basic income support in old age (Grundsicherung im Alter) takes priority. A child only ever covers the gap left after all prior benefits.</p>
<h2>The ${h.eur(GRENZE)} limit</h2>
<p>${h.src('sgb12_94', 'Section 94(1a) of Social Code XII')} shields most families. Claims of a welfare recipient against his or her children are disregarded if the child’s total annual income does not exceed ${h.eur(GRENZE)}; the claim then never passes to the office. The figure is total income under section 16 of Social Code IV, broadly the sum of taxable income, not your take-home pay.</p>
<ul>
<li>The limit applies to each child separately. Siblings are not added together, and neither is a spouse’s income.</li>
<li>The law presumes that a child is below the limit. The office needs indications to the contrary before asking the child for information.</li>
<li>For past months the office can only claim from the date it notified the child in writing that it is paying (section 94(4) of Social Code XII).</li>
</ul>
<p>Being slightly above the limit does not mean paying automatically. It is the point where the ordinary civil-law support calculation begins.</p>
<h2>The 2026 self-retention</h2>
<p>For the first time the ${h.src('olgDtPdf', '2026 Düsseldorf Table')} sets a fixed frame in note D I: the child keeps at least ${h.eur(S.eltern)} a month, including ${h.eur(S.eltern_warmmiete)} warm rent, plus ${h.pct(FREI, 0)} of the income above it. Only the remaining ${h.pct(1 - FREI, 0)} can go to the parent.</p>
${h.table(['Adjusted net income', 'Self-retention', 'Maximum available'], stufen.map(({ n, r }) => [h.eur(n), h.eur(r.selbstbehalt), h.eur(r.leistungsfaehig)]), `Per month, for annual income above ${h.eur(GRENZE)}, computed by the engine`, ['r', 'r', 'r'])}
<p>The burden is heavily damped: even on ${h.eur(8000)} adjusted net, most of the income above the minimum stays with the child. Income is adjusted as usual in German support law, and for parental maintenance the guidelines also accept private pension saving of ${h.pct(h.P.leitlinien.altersvorsorge_sekundaer_eltern, 0)} of gross income if actually paid. Owner-occupiers are credited only with a reasonable housing value, not the market rent the home could fetch.</p>
<h2>Spouse and family</h2>
<p>A spouse living with the child ranks ahead of the parents. The table sets at least ${h.eur(S.eltern_ehegatte_mindest)} for the spouse, giving a family minimum of ${h.eur(familie)}; it can be higher because the spouse’s need follows the couple’s standard of living. Support for the child’s own children also comes first and is deducted beforehand.</p>
<h2>One mother, three children</h2>
<p>The mother lives in a care home in Cologne and, after pension, care insurance and basic income support, ${h.eur(1200)} a month is missing. Her daughter, a doctor, has annual income of ${h.eur(118000)} and adjusted net of ${h.eur(5400)}: she keeps ${h.eur(tochter.selbstbehalt)} and can pay ${h.eur(tochter.leistungsfaehig)}. Her brother, an engineer on ${h.eur(96000)} a year, would have ${h.eur(bruder.leistungsfaehig)} available on paper but pays ${h.eur(bruder.unterhalt)} because he is below the limit. A third child, a partner in a law firm, on ${h.eur(140000)}, with ${h.eur(6500)} net, could pay ${h.eur(hoch.leistungsfaehig)}; if the gap were only ${h.eur(900)} and he alone were liable, he would owe ${h.eur(hoch.unterhalt)}, since nobody pays more than the gap.</p>
<p>Where several siblings are above the limit, they share liability according to income (section 1606(3) BGB). Section 94(3) of Social Code XII also excludes the transfer where it would cause undue hardship; whether that applies is assessed by the office and, in a dispute, by the court.</p>
<h2>Procedure</h2>
<p>The office writes to the child, often with a so-called notice of preservation of rights (Rechtswahrungsanzeige), and asks for information. If office and child cannot agree, the family court (Familiengericht) decides. The page on ${h.a('unterhaltsverfahren-kosten', 'costs of support proceedings')} gives an idea of what a dispute costs. Run your own figures in the ${h.a('elternunterhalt-rechner', 'parental maintenance calculator')}; other self-retention amounts are on the ${h.a('selbstbehalt', 'self-retention')} page.</p>
<p>This page is general information on parental maintenance under Social Code XII, the Civil Code and the 2026 Düsseldorf Table, not legal advice; the welfare office and the family court decide each case.</p>`,
  },
});
