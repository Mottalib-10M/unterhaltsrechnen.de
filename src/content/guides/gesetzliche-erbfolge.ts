import { defineGuide } from '../../lib/guide-types';
import { erbfolge } from '../../lib/engine/erbe';
import { P, DE, EN } from '../../lib/fmt';

/** Bruch aus einer Quote des Motors (0,25 → „1/4“), nur zur Anzeige. */
const br = (q: number) => {
  for (const d of [1, 2, 3, 4, 6, 8, 12, 16, 24, 32]) { const n = Math.round(q * d); if (Math.abs(n / d - q) < 1e-9) return d === 1 ? String(n) : `${n}/${d}`; }
  return q.toFixed(3);
};
const E = P.erbrecht;
/** Beispiele aus dem Motor, nie von Hand: Nachlass 420.000 €. */
const N = 420000;
const ehe2 = erbfolge({ verheiratet: true, gueterstand: 'zugewinn', kinder: 2, nachlass: N });
const ledig3 = erbfolge({ verheiratet: false, kinder: 3, nachlass: N });
const eheEltern = erbfolge({ verheiratet: true, gueterstand: 'zugewinn', kinder: 0, elternLebend: 2, nachlass: N });
const elternteilGeschw = erbfolge({ verheiratet: false, kinder: 0, elternLebend: 1, geschwister: 2, nachlass: N });
const nurGross = erbfolge({ verheiratet: false, kinder: 0, grosseltern: true, nachlass: N });
const niemand = erbfolge({ verheiratet: false, kinder: 0, nachlass: N });
/** Stamm-Beispiel: ledig, zwei Kinder, eines vorverstorben mit zwei eigenen Kindern. */
const staemme = erbfolge({ verheiratet: false, kinder: 2, nachlass: N });
const kindStamm = staemme.anteile.find((a) => a.wer === 'kind')!;
const enkelJe = kindStamm.betragJe / 2;
const k2 = ehe2.anteile.find((a) => a.wer === 'kind')!;
const e2 = ehe2.anteile.find((a) => a.wer === 'ehegatte')!;
const k3 = ledig3.anteile.find((a) => a.wer === 'kind')!;

const zeile = (r: ReturnType<typeof erbfolge>, lab: Record<string, string>, eur: (n: number) => string) =>
  r.anteile.map((a) => `${(a.anzahl === 1 && lab[a.wer + '1']) || lab[a.wer]} ${a.quoteJe === 1 ? lab.alles : br(a.quoteJe)} = ${eur(a.betragJe)}`).join('; ');

export default defineGuide({
  id: 'gesetzliche-erbfolge',
  group: 'erbe',
  order: 8,
  mini: 'erbfolgeSchnell',
  related: ['erbrechner', 'ehegattenerbrecht', 'erbfolge-ohne-kinder', 'pflichtteil', 'erbschaftsteuer-freibetraege'],
  sources: ['bgb1924', 'bgb1925', 'bgb1931', 'bgb1371'],
  de: {
    slug: 'gesetzliche-erbfolge',
    nav: 'Gesetzliche Erbfolge',
    card: 'Wer ohne Testament erbt: Ordnungen, Stämme, Ehegatte, mit Rechenbeispielen für einen Nachlass von 420.000 €.',
    title: 'Gesetzliche Erbfolge 2026: Ordnungen, Stämme, Quoten',
    description: `Gesetzliche Erbfolge 2026 nach §§ 1924 bis 1931 BGB: wer ohne Testament erbt, Ordnungen und Stämme, der Ehegatte erhält ${br(E.ehegatte_neben_ordnung1)} plus ${br(E.zugewinn_viertel)}, Rechenbeispiele.`,
    h1: 'Gesetzliche Erbfolge: wer erbt, wenn es kein Testament gibt',
    intro: 'Das BGB legt eine feste Reihenfolge der Verwandten fest. Wer in einer näheren Ordnung lebt, schließt alle späteren aus.',
    resume: `Hinterlässt jemand kein Testament und keinen Erbvertrag, gilt in Deutschland die gesetzliche Erbfolge der §§ 1924 bis 1936 BGB. Die Verwandten sind in Ordnungen eingeteilt: zuerst die Abkömmlinge (Kinder, Enkel), dann Eltern und deren Abkömmlinge (Geschwister, Nichten), dann Großeltern und deren Abkömmlinge. Solange ein Verwandter einer vorhergehenden Ordnung lebt, erbt niemand aus einer späteren (§ 1930 BGB). Kinder erben zu gleichen Teilen; ist ein Kind vorverstorben, treten seine eigenen Kinder an seine Stelle. Bei einem Nachlass von ${DE.eur(N)} erhält ein lediger Vater von drei Kindern also ${br(k3.quoteJe)} je Kind, das sind ${DE.eur(k3.betragJe)}. Ist der Erblasser verheiratet und lebte im gesetzlichen Güterstand, bekommt der Ehegatte neben Kindern ${br(E.ehegatte_neben_ordnung1)} nach § 1931 BGB und ein weiteres ${br(E.zugewinn_viertel)} als pauschalen Zugewinnausgleich nach § 1371 BGB, zusammen ${br(e2.quoteJe)} oder ${DE.eur(e2.betragJe)}. Zwei Kinder teilen sich den Rest mit je ${DE.eur(k2.betragJe)}. Gibt es weder Ehegatten noch Verwandte, erbt der Staat.`,
    faqs: [
      { q: 'Erben Enkel nach der gesetzlichen Erbfolge, wenn ihr Elternteil noch lebt?', a: 'Nein. Ein lebendes Kind schließt seine eigenen Kinder von der Erbfolge aus (§ 1924 Abs. 2 BGB). Enkel kommen nur zum Zug, wenn ihr Elternteil vor dem Erblasser gestorben ist, die Erbschaft ausgeschlagen hat oder für erbunwürdig erklärt wurde. Dann teilen sie sich zu gleichen Teilen genau den Anteil, den ihr Elternteil bekommen hätte, nicht mehr und nicht weniger.' },
      { q: 'Erben Stiefkinder und Schwiegerkinder ohne Testament?', a: 'Nein. Die gesetzliche Erbfolge folgt nur der Verwandtschaft und der Ehe. Stiefkinder sind mit dem Stiefelternteil nicht verwandt, Schwiegerkinder ebenfalls nicht; beide gehen leer aus, solange sie nicht adoptiert oder im Testament bedacht sind. Ein adoptiertes Kind steht einem leiblichen Kind in der ersten Ordnung gleich. Wer ein Stiefkind bedenken möchte, braucht deshalb ein Testament oder einen Erbvertrag.' },
      { q: 'Erbt ein nichtehelicher Lebensgefährte nach der gesetzlichen Erbfolge?', a: `Nein. § 1931 BGB gibt nur dem Ehegatten ein gesetzliches Erbrecht, eingetragene Lebenspartner sind ihm gleichgestellt. Ein Partner ohne Trauschein erbt auch nach Jahrzehnten des Zusammenlebens nichts, wenn kein Testament existiert. Erbschaftsteuerlich gehört er zudem in die Steuerklasse III mit einem Freibetrag von nur ${DE.eur(P.erbst.freibetrag.stk3)}, während ein Ehegatte ${DE.eur(P.erbst.freibetrag.ehegatte)} steuerfrei erhalten kann.` },
      { q: 'Was bedeutet Erbfolge nach Stämmen in der ersten Ordnung?', a: `Jedes Kind des Erblassers bildet einen Stamm, zu dem seine eigenen Nachkommen gehören. Der Nachlass wird zuerst auf die Stämme verteilt, erst danach innerhalb eines Stammes. Ein vorverstorbenes Kind mit zwei Kindern zählt also wie ein Kind: Bei ${DE.eur(N)} und zwei Stämmen erhält das lebende Kind ${DE.eur(kindStamm.betragJe)}, die beiden Enkel teilen sich dieselbe Summe und bekommen je ${DE.eur(enkelJe)}.` },
      { q: 'Wann erbt der Staat nach der gesetzlichen Erbfolge?', a: 'Nur wenn zur Zeit des Erbfalls kein Verwandter, kein Ehegatte und kein Lebenspartner vorhanden ist. Dann erbt nach § 1936 BGB das Bundesland, in dem der Erblasser zuletzt wohnte, sonst der Bund. Weil die Ordnungen über Urgroßeltern hinaus unbegrenzt weitergehen, ist das selten; häufiger kommt es vor, wenn alle Erben die Erbschaft wegen Überschuldung ausschlagen. Der Staat kann nicht ausschlagen.' },
      { q: 'Gilt die gesetzliche Erbfolge auch, wenn das Testament unwirksam ist?', a: 'Ja. Ist ein Testament formunwirksam, etwa weil ein eigenhändiges Testament am Computer geschrieben oder nicht unterschrieben wurde, oder regelt es nur einen Teil des Vermögens, greift für den Rest die gesetzliche Erbfolge. Dasselbe gilt, wenn ein eingesetzter Erbe vorverstirbt und das Testament keinen Ersatzerben nennt. Ob ein Testament wirksam ist, prüft das Nachlassgericht im Erbscheinsverfahren.' },
    ],
    body: (h) => {
      const lab: Record<string, string> = { ehegatte: 'Ehegatte', kind: 'je Kind', elternteil: 'je Elternteil', geschwister: 'je Geschwister', grosseltern: 'Großeltern', staat: 'Staat', elternteil1: 'Mutter', alles: 'alles' };
      return `<h2>Das Prinzip: Ordnungen statt Gefühl</h2>
<p>Das Gesetz fragt nicht, wer dem Verstorbenen am nächsten stand, sondern wie eng jemand mit ihm verwandt ist. Die ${h.src('bgb1924', 'erste Ordnung nach § 1924 BGB')} bilden alle Abkömmlinge: Kinder, Enkel, Urenkel. Zur ${h.src('bgb1925', 'zweiten Ordnung nach § 1925 BGB')} gehören die Eltern und ihre Abkömmlinge, also Geschwister, Nichten und Neffen. Die dritte Ordnung sind Großeltern mit Onkeln, Tanten, Cousins und Cousinen, die vierte die Urgroßeltern mit ihren Nachkommen.</p>
<p>Die wichtigste Regel steht in § 1930 BGB: Ein Verwandter ist nicht zur Erbfolge berufen, solange ein Verwandter einer vorhergehenden Ordnung vorhanden ist. Ein einziges Enkelkind verdrängt damit die Eltern, alle Geschwister und sämtliche Tanten des Erblassers.</p>
<h2>Erste Ordnung: Kinder, Enkel und das Stammesprinzip</h2>
<p>Kinder erben zu gleichen Teilen, egal ob ehelich oder nichtehelich, aus erster oder zweiter Ehe. Adoptierte Kinder stehen leiblichen gleich. Innerhalb der ersten Ordnung gilt das Repräsentationsprinzip: Ein lebendes Kind schließt seine eigenen Nachkommen aus. Ist ein Kind schon gestorben, rücken dessen Kinder nach und teilen sich seinen Anteil (Eintrittsrecht).</p>
<p>Juristen nennen jede dieser Linien einen Stamm. Der Nachlass wird erst nach Stämmen geteilt, dann innerhalb eines Stammes. Bei ${h.eur(N)} und zwei Kindern, von denen eines mit zwei eigenen Kindern vorverstorben ist, ergibt das:</p>
<ul>
<li>lebendes Kind: ${br(kindStamm.quoteJe)} = ${h.eur(kindStamm.betragJe)}</li>
<li>jedes der beiden Enkelkinder: die Hälfte des Stammanteils = ${h.eur(enkelJe)}</li>
</ul>
<p>Im Erbrechner zählen Sie deshalb ein vorverstorbenes Kind mit, wenn es Nachkommen hinterlassen hat.</p>
<h2>Zweite und dritte Ordnung</h2>
<p>Gibt es keine Abkömmlinge, erben die Eltern allein und zu gleichen Teilen. Lebt ein Elternteil nicht mehr, geht seine Hälfte an seine Abkömmlinge, also die Geschwister des Erblassers; fehlen solche, erhält der überlebende Elternteil alles (§ 1925 Abs. 3 BGB). Halbgeschwister erben deshalb nur über den gemeinsamen Elternteil. In der dritten Ordnung wiederholt sich das Muster: Jedes Großelternpaar bildet eine Hälfte, an die Stelle verstorbener Großeltern treten deren Kinder, also Onkel und Tanten (§ 1926 BGB). Die Einzelheiten ohne Kinder erläutert die Seite ${h.a('erbfolge-ohne-kinder', 'Erbfolge ohne Kinder')}.</p>
<h2>Der Ehegatte steht außerhalb der Ordnungen</h2>
<p>Ehegatten sind nicht verwandt und erben nach einer eigenen Vorschrift, dem ${h.src('bgb1931', '§ 1931 BGB')}. Neben der ersten Ordnung erhalten sie ${br(h.P.erbrecht.ehegatte_neben_ordnung1)}, neben Eltern, Geschwistern oder Großeltern ${br(h.P.erbrecht.ehegatte_neben_ordnung2)}. Im gesetzlichen Güterstand der Zugewinngemeinschaft kommt nach ${h.src('bgb1371', '§ 1371 Abs. 1 BGB')} ein weiteres ${br(h.P.erbrecht.zugewinn_viertel)} hinzu, unabhängig davon, ob in der Ehe tatsächlich Vermögen hinzugewonnen wurde. Erst was danach übrig bleibt, verteilen die Ordnungen. Bei Gütertrennung und Gütergemeinschaft verschieben sich die Quoten; das zeigt die Seite zum ${h.a('ehegattenerbrecht', 'Erbrecht des Ehegatten')}.</p>
<h2>Sechs Familien, ein Nachlass von ${h.eur(N)}</h2>
${h.table(['Familie', 'Ordnung', 'Verteilung'], [
  ['verheiratet, Zugewinngemeinschaft, zwei Kinder', String(ehe2.ordnung), zeile(ehe2, lab, h.eur)],
  ['ledig, drei Kinder', String(ledig3.ordnung), zeile(ledig3, lab, h.eur)],
  ['verheiratet, keine Kinder, beide Eltern leben', String(eheEltern.ordnung), zeile(eheEltern, lab, h.eur)],
  ['ledig, Mutter lebt, Vater tot, zwei Geschwister', String(elternteilGeschw.ordnung), zeile(elternteilGeschw, lab, h.eur)],
  ['ledig, nur Großeltern oder deren Nachkommen', String(nurGross.ordnung), zeile(nurGross, lab, h.eur)],
  ['ledig, keine Verwandten auffindbar', 'keine', zeile(niemand, lab, h.eur)],
], 'Vom Erbrechner ermittelt, Nachlass nach Abzug der Schulden')}
<p>Die vierte Zeile zeigt das Eintrittsrecht in der zweiten Ordnung: Die Hälfte des verstorbenen Vaters geht nicht an die Mutter, sondern an die beiden Geschwister. Die fünfte Zeile fasst die dritte Ordnung zusammen; wie sie sich auf einzelne Großeltern, Onkel und Tanten verteilt, hängt davon ab, wer von ihnen noch lebt.</p>
<h2>Was die gesetzliche Erbfolge nicht regelt</h2>
<p>Sie bestimmt nur die Quoten. Die Erben bilden eine Erbengemeinschaft und müssen sich über jedes Haus, Konto und Möbelstück gemeinsam einigen, bis der Nachlass geteilt ist. Wer von der Erbfolge durch Testament ausgeschlossen wird, behält als Kind, Ehegatte oder Elternteil den ${h.a('pflichtteil', 'Pflichtteil')} in Höhe der Hälfte des gesetzlichen Erbteils. Und wie viel nach der Verteilung beim Finanzamt bleibt, richtet sich nach den ${h.a('erbschaftsteuer-freibetraege', 'Freibeträgen der Erbschaftsteuer')}, im Fall eines Kindes ${h.eur(h.P.erbst.freibetrag.kind)}.</p>
<p>Ihre eigene Familie rechnet der ${h.a('erbrechner', 'Erbrechner')} durch. Diese Seite ist eine allgemeine Information zur gesetzlichen Erbfolge und keine Rechtsberatung; verbindlich klärt das Nachlassgericht, wer Erbe geworden ist.</p>`;
    },
  },
  en: {
    slug: 'statutory-succession',
    nav: 'Statutory succession',
    card: 'Who inherits in Germany without a will: orders of heirs, family branches, the spouse, with worked examples.',
    title: 'Statutory Succession Germany 2026: Who Inherits, No Will',
    description: `Statutory succession Germany 2026 (sections 1924 to 1931 BGB): who inherits without a will, orders of heirs, family branches, spouse's share, worked examples.`,
    h1: 'Statutory succession: who inherits in Germany when there is no will',
    intro: 'German law ranks relatives in fixed orders. Anyone alive in a closer order shuts out every later one.',
    resume: `When someone dies without a will or an inheritance contract, German statutory succession (gesetzliche Erbfolge) under sections 1924 to 1936 of the Civil Code (BGB) decides who inherits. Relatives fall into orders (Ordnungen): first the descendants, then the parents and their descendants, then the grandparents and theirs. As long as a single relative of an earlier order is alive, no one in a later order inherits (section 1930 BGB). Children take equal shares, and if a child has already died, that child’s own children step into its place. On an estate of ${EN.eur(N)}, an unmarried father of three therefore leaves ${br(k3.quoteJe)} to each child, ${EN.eur(k3.betragJe)}. A surviving spouse in the default matrimonial regime receives ${br(E.ehegatte_neben_ordnung1)} under section 1931 BGB plus a flat ${br(E.zugewinn_viertel)} for the accrued gains under section 1371 BGB: ${br(e2.quoteJe)} in all, or ${EN.eur(e2.betragJe)}, leaving ${EN.eur(k2.betragJe)} to each of two children. With no spouse and no relatives at all, the state inherits.`,
    faqs: [
      { q: 'Does German statutory succession apply to a foreigner living in Germany?', a: 'Often, yes. Under the EU Succession Regulation (Regulation 650/2012), which covers deaths from 17 August 2015, the law of the country of habitual residence at death governs the whole succession as a rule. A person may instead choose the law of a country whose nationality they hold, typically in a will. Courts look at the overall circumstances, so expats with ties to several countries should not assume the result.' },
      { q: 'Do grandchildren inherit in Germany while their parent is still alive?', a: 'No. A living child excludes their own children (section 1924(2) BGB). Grandchildren only inherit if their parent died before the deceased, disclaimed the inheritance or was declared unworthy to inherit. They then share exactly the portion their parent would have taken, in equal parts, which is why German lawyers speak of succession by branches (Stämme).' },
      { q: 'Does an unmarried partner inherit anything under German law without a will?', a: `No. Only a spouse or registered civil partner has a statutory right to inherit (section 1931 BGB). A partner without a marriage certificate receives nothing, however long the relationship. For inheritance tax the partner is also in class III, with an allowance of only ${EN.eur(P.erbst.freibetrag.stk3)}, against ${EN.eur(P.erbst.freibetrag.ehegatte)} for a spouse.` },
      { q: 'Are stepchildren statutory heirs in Germany?', a: 'No. Statutory succession follows blood relationship, adoption and marriage only. A stepchild is not related to the step-parent and is not an heir unless adopted or named in a will. An adopted child, by contrast, ranks exactly like a biological child in the first order. Blended families with children from earlier relationships therefore often need a will to reflect what they actually want.' },
      { q: 'When does the German state inherit an estate?', a: 'Only when no relative, spouse or registered partner exists at the time of death. The federal state (Land) of the last residence then inherits, failing that the federal government (section 1936 BGB). Because the orders of relatives continue without limit, this is rare in practice; it happens more often when every heir disclaims an indebted estate. The state cannot disclaim.' },
    ],
    body: (h) => {
      const lab: Record<string, string> = { ehegatte: 'spouse', kind: 'each child', elternteil: 'each parent', geschwister: 'each sibling', grosseltern: 'grandparents', staat: 'state', elternteil1: 'mother', alles: 'everything' };
      return `<h2>Relationship, not affection, decides</h2>
<p>German law does not ask who was closest to the deceased in life. It ranks relatives by degree of kinship. The ${h.src('bgb1924', 'first order under section 1924 BGB')} consists of all descendants: children, grandchildren, great-grandchildren. The ${h.src('bgb1925', 'second order under section 1925 BGB')} covers the parents and their descendants, meaning brothers, sisters, nieces and nephews. Grandparents with aunts, uncles and cousins form the third order; great-grandparents and their lines the fourth.</p>
<p>Section 1930 BGB then applies a strict cut-off: no relative inherits while someone from an earlier order is alive. One grandchild is enough to exclude the parents, all siblings and every aunt of the deceased.</p>
<h2>Children, grandchildren and branches</h2>
<p>Children inherit in equal parts. Whether they were born inside or outside marriage, or come from a first or second relationship, makes no difference, and adopted children count like biological ones. A living child shuts out their own offspring. If a child has died first, that child’s children step in and divide its portion between them (representation).</p>
<p>Each child of the deceased opens a branch (Stamm). The estate is split by branches first, then within each branch. Take ${h.eur(N)}, two children, one of whom died earlier leaving two children of their own:</p>
<ul>
<li>surviving child: ${br(kindStamm.quoteJe)} = ${h.eur(kindStamm.betragJe)}</li>
<li>each grandchild in the other branch: half of that branch = ${h.eur(enkelJe)}</li>
</ul>
<p>That is why the calculator asks you to count a deceased child who left descendants.</p>
<h2>Parents, siblings and grandparents</h2>
<p>With no descendants, both parents inherit in equal shares. If one parent has died, that parent’s half passes to their descendants, the siblings of the deceased; only if there are none does the surviving parent take everything (section 1925(3) BGB). A half-sibling therefore inherits only through the parent they share. The third order follows the same pattern, with each pair of grandparents taking one half and aunts and uncles stepping in for a grandparent who has died (section 1926 BGB). More on these lines is on the page about ${h.a('erbfolge-ohne-kinder', 'inheritance without children')}.</p>
<h2>The spouse stands outside the orders</h2>
<p>A spouse is not a blood relative and inherits under a separate rule, ${h.src('bgb1931', 'section 1931 BGB')}: ${br(h.P.erbrecht.ehegatte_neben_ordnung1)} alongside children, ${br(h.P.erbrecht.ehegatte_neben_ordnung2)} alongside parents, siblings or grandparents. Couples in the default regime, the community of accrued gains (Zugewinngemeinschaft), receive another ${br(h.P.erbrecht.zugewinn_viertel)} under ${h.src('bgb1371', 'section 1371(1) BGB')}, whether or not any wealth was actually built up during the marriage. Only the remainder is shared by the relatives. If you married abroad under a different property regime, its recognition in Germany is a legal question in itself; the ${h.a('ehegattenerbrecht', 'spouse’s inheritance')} page explains the German regimes.</p>
<h2>Six households, one estate of ${h.eur(N)}</h2>
${h.table(['Household', 'Order', 'Distribution'], [
  ['married, default regime, two children', String(ehe2.ordnung), zeile(ehe2, lab, h.eur)],
  ['unmarried, three children', String(ledig3.ordnung), zeile(ledig3, lab, h.eur)],
  ['married, no children, both parents alive', String(eheEltern.ordnung), zeile(eheEltern, lab, h.eur)],
  ['single, mother alive, father dead, two siblings', String(elternteilGeschw.ordnung), zeile(elternteilGeschw, lab, h.eur)],
  ['single, only grandparents or their descendants', String(nurGross.ordnung), zeile(nurGross, lab, h.eur)],
  ['single, no relatives traceable', 'none', zeile(niemand, lab, h.eur)],
], 'Computed by the inheritance calculator, estate net of debts')}
<p>In the fourth row the father’s half does not go to the mother: it passes to his descendants, the two siblings. The fifth row groups the third order together; how it splits between individual grandparents, aunts and uncles depends on who is still alive.</p>
<h2>What statutory succession leaves open</h2>
<p>It only fixes fractions. Several heirs form a community of heirs (Erbengemeinschaft) and must agree on every flat, account and car until the estate is divided. A child, spouse or parent cut out by a will keeps the ${h.a('pflichtteil', 'compulsory share')} worth half the statutory share. What the tax office takes afterwards depends on the ${h.a('erbschaftsteuer-freibetraege', 'inheritance tax allowances')}, ${h.eur(h.P.erbst.freibetrag.kind)} for each child.</p>
<p>The ${h.a('erbrechner', 'inheritance calculator')} runs your own family through these rules. This page gives general information on German statutory succession and is not legal advice; the probate court (Nachlassgericht) decides who has become heir, for example when it issues a certificate of inheritance (Erbschein).</p>`;
    },
  },
});
