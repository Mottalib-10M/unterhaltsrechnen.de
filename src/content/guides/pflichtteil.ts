import { defineGuide } from '../../lib/guide-types';
import { erbfolge, type ErbfolgeIn } from '../../lib/engine/erbe';
import { P, DE, EN } from '../../lib/fmt';

/** Bruch aus einer Quote (0,125 → „1/8“), nur zur Anzeige. */
const br = (q: number) => {
  for (const d of [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48]) { const n = Math.round(q * d); if (Math.abs(n / d - q) < 1e-9) return d === 1 ? String(n) : `${n}/${d}`; }
  return q.toFixed(3);
};
const E = P.erbrecht;
const pq = E.pflichtteil_quote;
/** Beispiele aus dem Motor, nie von Hand: Nachlass 600.000 €. */
const N = 600000;
const r = (x: Omit<ErbfolgeIn, 'nachlass'>) => erbfolge({ ...x, nachlass: N });
const kind = (x: ReturnType<typeof erbfolge>) => x.anteile.find((a) => a.wer === 'kind')!;
const zg1 = r({ verheiratet: true, gueterstand: 'zugewinn', kinder: 1 });
const zg2 = r({ verheiratet: true, gueterstand: 'zugewinn', kinder: 2 });
const ledig3 = r({ verheiratet: false, kinder: 3 });
const gt2 = r({ verheiratet: true, gueterstand: 'trennung', kinder: 2 });
const eltern = r({ verheiratet: false, kinder: 0, elternLebend: 2 });
const elt = eltern.anteile.find((a) => a.wer === 'elternteil')!;
const ehe2 = zg2.anteile.find((a) => a.wer === 'ehegatte')!;
/** § 1371 Abs. 2 BGB: Erhält der Ehegatte nichts, rechnen auch die Kinder mit dem nicht erhöhten Ehegattenerbteil. */
const kinderQuoteOhneViertel = ((1 - E.ehegatte_neben_ordnung1) / 2) * pq;
const kindPtOhneViertel = kinderQuoteOhneViertel * N;
const k2 = kind(zg2);

export default defineGuide({
  id: 'pflichtteil',
  group: 'erbe',
  order: 20,
  mini: 'pflichtteilSchnell',
  related: ['pflichtteilsrechner', 'pflichtteilsergaenzung', 'gesetzliche-erbfolge', 'ehegattenerbrecht', 'erbfolge-ohne-kinder'],
  sources: ['bgb2303', 'bgb1924', 'bgb1931', 'bgb1371'],
  de: {
    slug: 'pflichtteil',
    nav: 'Pflichtteil',
    card: 'Wer einen Pflichtteil hat, wie hoch er ist und wie er durchgesetzt wird, mit Quoten für typische Familien.',
    title: 'Pflichtteil 2026: Höhe, Berechtigte, Quoten und Fristen',
    description: `Pflichtteil 2026: die Hälfte des gesetzlichen Erbteils als Geldanspruch nach § 2303 BGB. Berechtigte, Quoten für Kinder, Ehegatte und Eltern, Auskunft, Frist.`,
    h1: 'Pflichtteil: was enterbten Kindern, Ehegatten und Eltern bleibt',
    intro: 'Ein Testament kann nahe Angehörige vom Erbe ausschließen, aber nicht ganz leer ausgehen lassen. Der Pflichtteil ist ihr Mindestanteil in Geld.',
    resume: `Der Pflichtteil ist der Mindestanteil, den das Gesetz nahen Angehörigen gegen ein Testament sichert. Nach § 2303 BGB können Abkömmlinge, Ehegatten und eingetragene Lebenspartner sowie, wenn keine Abkömmlinge vorhanden sind, die Eltern ihn verlangen, wenn sie durch Verfügung von Todes wegen von der Erbfolge ausgeschlossen wurden. Er beträgt die Hälfte des Wertes ihres gesetzlichen Erbteils und ist ein reiner Geldanspruch gegen den Erben; Anteile an Haus oder Konto gibt er nicht. Hinterlässt ein verheirateter Vater ${DE.eur(N)} und setzt er seine Frau als Alleinerbin ein, hat jedes von zwei Kindern einen gesetzlichen Erbteil von ${br(k2.quoteJe)} und damit einen Pflichtteil von ${br(k2.quoteJe * pq)}, also ${DE.eur(k2.pflichtteilJe)}. Ein Einzelkind käme auf ${DE.eur(kind(zg1).pflichtteilJe)}. Geschwister, Nichten und Großeltern haben keinen Pflichtteil. Der Anspruch entsteht mit dem Erbfall, der Erbe muss über den Nachlass Auskunft geben (§ 2314 BGB), und er verjährt in der regelmäßigen Frist von drei Jahren ab dem Ende des Jahres, in dem der Berechtigte von Erbfall und Enterbung erfährt.`,
    faqs: [
      { q: 'Wie hoch ist der Pflichtteil eines Enkels?', a: `Ein Enkel hat nur dann einen Pflichtteil, wenn sein Elternteil, das Kind des Erblassers, vorverstorben ist oder sonst weggefallen ist, ohne selbst einen Pflichtteil zu erhalten (§ 2309 BGB). Dann tritt er in dessen Stamm ein. Bei ${DE.eur(N)}, einem Ehegatten in Zugewinngemeinschaft und zwei Kindern, von denen eines mit zwei Kindern vorverstorben ist, erhält jedes Enkelkind die Hälfte von ${DE.eur(k2.pflichtteilJe)}, also ${DE.eur(k2.pflichtteilJe / 2)}.` },
      { q: 'Haben Eltern einen Pflichtteil, wenn ihr Kind kinderlos stirbt?', a: `Ja. Eltern sind nach § 2303 Abs. 2 BGB pflichtteilsberechtigt, aber nur, solange kein Abkömmling des Erblassers einen Pflichtteil verlangen kann oder das Hinterlassene annimmt (§ 2309 BGB). Bei einem unverheirateten Kind ohne eigene Kinder und ${DE.eur(N)} Nachlass hat jeder Elternteil einen gesetzlichen Erbteil von ${br(elt.quoteJe)} und damit einen Pflichtteil von ${DE.eur(elt.pflichtteilJe)}.` },
      { q: 'Muss ich den Pflichtteil ausdrücklich verlangen?', a: 'Ja. Der Pflichtteil fällt nicht automatisch an, er muss gegenüber dem Erben geltend gemacht werden. Rechtlich entsteht der Anspruch mit dem Erbfall (§ 2317 BGB) und ist vererblich und übertragbar. Viele Berechtigte verlangen zuerst Auskunft über den Bestand des Nachlasses, um die Höhe beziffern zu können. Zahlt der Erbe nicht, entscheidet im Streit das Zivilgericht, nicht das Nachlassgericht.' },
      { q: 'Was zählt zum Nachlass bei der Berechnung des Pflichtteils?', a: `Maßgeblich sind Bestand und Wert des Nachlasses zur Zeit des Erbfalls (§ 2311 BGB): Immobilien, Konten, Depots, Unternehmensanteile, abzüglich der Schulden des Erblassers und der Beerdigungskosten. Wo nötig, wird geschätzt; eine Wertangabe im Testament bindet nicht. Der Voraus des Ehegatten, also die Haushaltsgegenstände, bleibt beim Pflichtteil der Kinder und Eltern außer Ansatz. Schenkungen der letzten ${DE.num(E.ergaenzung_jahre)} Jahre erfasst die Pflichtteilsergänzung.` },
      { q: 'Wann verjährt der Pflichtteilsanspruch?', a: 'In der regelmäßigen Frist von drei Jahren nach § 195 BGB. Sie beginnt mit dem Schluss des Jahres, in dem der Berechtigte vom Erbfall und von seiner Enterbung erfahren hat (§ 199 Abs. 1 BGB). Wer im März vom Tod und vom Testament erfährt, hat also bis zum Ende des dritten folgenden Jahres Zeit. Unabhängig von der Kenntnis verjähren Ansprüche aus einem Erbfall spätestens nach 30 Jahren (§ 199 Abs. 3a BGB).' },
      { q: 'Muss sich ein Kind Geschenke zu Lebzeiten auf den Pflichtteil anrechnen lassen?', a: 'Nur wenn der Erblasser bei der Schenkung bestimmt hat, dass sie angerechnet werden soll (§ 2315 BGB). Die Bestimmung muss spätestens bei der Zuwendung getroffen werden, ein späteres Testament reicht dafür nicht. Der Wert der Zuwendung wird dann dem Nachlass hinzugerechnet und vom Pflichtteil abgezogen, bewertet zum Zeitpunkt der Schenkung. Ohne eine solche Bestimmung kommen allenfalls Ausgleichungsregeln unter Geschwistern in Betracht (§ 2316 BGB).' },
    ],
    body: (h) => `<h2>Wer pflichtteilsberechtigt ist</h2>
<p>Der Kreis ist eng und abschließend. Nach ${h.src('bgb2303', '§ 2303 BGB')} haben einen Pflichtteil:</p>
<ul>
<li>Abkömmlinge: Kinder, auch nichteheliche und adoptierte, an Stelle eines vorverstorbenen Kindes dessen Kinder</li>
<li>der Ehegatte und der eingetragene Lebenspartner</li>
<li>die Eltern, aber nur, wenn kein Abkömmling vorhanden ist, der selbst den Pflichtteil verlangen kann oder das ihm Hinterlassene annimmt (§ 2309 BGB)</li>
</ul>
<p>Geschwister, Nichten, Neffen, Großeltern, Stiefkinder und nichteheliche Partner haben keinen Pflichtteil. Wer sie im Testament übergeht, schließt sie vollständig aus.</p>
<h2>Die Formel: Hälfte des gesetzlichen Erbteils</h2>
<p>Zuerst wird die Quote ermittelt, die der Betroffene nach der gesetzlichen Erbfolge erhalten hätte (${h.src('bgb1924', '§ 1924 BGB')} für Kinder, ${h.src('bgb1931', '§ 1931 BGB')} für den Ehegatten). Davon ist der Pflichtteil die Hälfte. Er richtet sich auf Geld, nicht auf einzelne Gegenstände: Das enterbte Kind wird nicht Miteigentümer des Elternhauses, sondern hat eine Zahlungsforderung gegen den Erben, die mit dem Erbfall entsteht.</p>
<h2>Quoten für typische Familien bei ${h.eur(N)}</h2>
${h.table(['Familie', 'Gesetzlicher Erbteil', 'Pflichtteilsquote', 'Pflichtteil'], [
  ['Ehegatte (Zugewinngemeinschaft) und ein Kind: Kind', br(kind(zg1).quoteJe), br(kind(zg1).quoteJe * pq), h.eur(kind(zg1).pflichtteilJe)],
  ['Ehegatte (Zugewinngemeinschaft) und zwei Kinder: je Kind', br(k2.quoteJe), br(k2.quoteJe * pq), h.eur(k2.pflichtteilJe)],
  ['Ehegatte (Gütertrennung) und zwei Kinder: je Kind', br(kind(gt2).quoteJe), br(kind(gt2).quoteJe * pq), h.eur(kind(gt2).pflichtteilJe)],
  ['kein Ehegatte, drei Kinder: je Kind', br(kind(ledig3).quoteJe), br(kind(ledig3).quoteJe * pq), h.eur(kind(ledig3).pflichtteilJe)],
  ['kinderlos, ledig, beide Eltern: je Elternteil', br(elt.quoteJe), br(elt.quoteJe * pq), h.eur(elt.pflichtteilJe)],
  ['Ehegatte neben zwei Kindern, mit Vermächtnis (großer Pflichtteil)', br(ehe2.quoteJe), br(ehe2.quoteJe * pq), h.eur(ehe2.pflichtteilJe)],
], 'Vom Erbrechner ermittelt, Nachlass nach Abzug der Schulden')}
<p>Die Tabelle zeigt, wie stark der Güterstand des Erblassers den Pflichtteil der Kinder beeinflusst: Bei Gütertrennung ist der Ehegattenanteil kleiner, also der Anteil jedes Kindes größer.</p>
<h2>Der Pflichtteil des Ehegatten: klein oder groß</h2>
<p>Für Ehegatten in der Zugewinngemeinschaft gibt es zwei Rechenwege. Erhält der Ehegatte weder Erbteil noch Vermächtnis, berechnet sich sein Pflichtteil nach ${h.src('bgb1371', '§ 1371 Abs. 2 BGB')} aus dem nicht erhöhten Erbteil von ${br(h.P.erbrecht.ehegatte_neben_ordnung1)} neben Kindern, also ${br(h.P.erbrecht.ehegatte_neben_ordnung1 * pq)} (kleiner Pflichtteil), und daneben kann er den tatsächlich entstandenen Zugewinnausgleich verlangen. Ist er mit einem Vermächtnis bedacht, wird nach verbreiteter Auffassung der erhöhte Erbteil zugrunde gelegt (großer Pflichtteil, ${br(ehe2.quoteJe * pq)}).</p>
<p>Weniger bekannt ist die Rückwirkung auf die Kinder: Wählt der Ehegatte den güterrechtlichen Weg, bestimmt sich nach demselben Absatz auch der Pflichtteil der anderen Berechtigten nach dem nicht erhöhten Ehegattenerbteil. Bei zwei Kindern steigt die Quote jedes Kindes dann von ${br(k2.quoteJe * pq)} auf ${br(kinderQuoteOhneViertel)}, bei ${h.eur(N)} von ${h.eur(k2.pflichtteilJe)} auf ${h.eur(kindPtOhneViertel)}. Das gilt vor Abzug der Zugewinnausgleichsforderung, die als Nachlassschuld die Berechnungsgrundlage noch verkleinert. Mehr dazu beim ${h.a('ehegattenerbrecht', 'Erbrecht des Ehegatten')}.</p>
<h2>Auskunft, Wertermittlung, Frist</h2>
<p>Ein Pflichtteilsberechtigter, der nicht Erbe ist, kann vom Erben Auskunft über den Bestand des Nachlasses verlangen (§ 2314 BGB). Er darf bei der Aufnahme des Nachlassverzeichnisses hinzugezogen werden, ein Verzeichnis durch einen Notar und eine Ermittlung des Werts verlangen, etwa durch ein Gutachten für eine Immobilie. Die Kosten trägt der Nachlass. Verjährung tritt in der regelmäßigen Frist von drei Jahren ein (§ 195 BGB), gerechnet ab dem Ende des Jahres, in dem der Berechtigte von Erbfall und Enterbung Kenntnis erlangt hat.</p>
<h2>Was den Pflichtteil erhöhen oder mindern kann</h2>
<ul>
<li>Schenkungen des Erblassers an Dritte in den letzten ${h.num(h.P.erbrecht.ergaenzung_jahre)} Jahren erhöhen ihn über die ${h.a('pflichtteilsergaenzung', 'Pflichtteilsergänzung')}, abgeschmolzen um ${h.pct(h.P.erbrecht.ergaenzung_abschmelzung_jahr, 0)} je Jahr.</li>
<li>Zuwendungen an den Berechtigten selbst mindern ihn, wenn bei der Schenkung die Anrechnung bestimmt wurde (§ 2315 BGB).</li>
<li>Ist ein Pflichtteilsberechtigter zwar Erbe, aber mit Testamentsvollstreckung, Nacherbschaft oder Vermächtnissen belastet, kann er nach § 2306 BGB ausschlagen und den Pflichtteil verlangen.</li>
</ul>
<p>Die Zahlen für Ihre Familie, mit oder ohne Schenkung, liefert der ${h.a('pflichtteilsrechner', 'Pflichtteilsrechner')}. Diese Erläuterung zum Pflichtteil ist allgemeine Information, keine Rechtsberatung; ob und in welcher Höhe ein Anspruch besteht, entscheidet im Streit das Gericht.</p>`,
  },
  en: {
    slug: 'compulsory-share',
    nav: 'Compulsory share',
    card: 'Who can claim a compulsory share in Germany, how much it is and how it is enforced, with typical family fractions.',
    title: 'Compulsory Share Germany 2026: Pflichtteil, Who and How Much',
    description: `Compulsory share (Pflichtteil) in Germany 2026: half the statutory share, in cash, under section 2303 BGB. Who qualifies, fractions per family, deadline.`,
    h1: 'The German compulsory share: what disinherited relatives still get',
    intro: 'A will can exclude close family from the estate, but it cannot leave them empty-handed. The compulsory share is their minimum, paid in money.',
    resume: `German law protects close relatives against being written out of a will. Under section 2303 of the Civil Code (BGB), descendants, a spouse or registered partner and, if there are no descendants, the parents of the deceased may claim a compulsory share (Pflichtteil) when a will or inheritance contract excludes them. It equals half the value of the share they would have received without a will, and it is a cash claim against the heir, not a right to any particular asset. If a married father leaves ${EN.eur(N)} and makes his wife sole heir, each of two children would have had ${br(k2.quoteJe)} by law and can therefore claim ${br(k2.quoteJe * pq)}, which is ${EN.eur(k2.pflichtteilJe)}. An only child would claim ${EN.eur(kind(zg1).pflichtteilJe)}. Siblings, nieces, nephews and grandparents have no compulsory share. The claim arises on death, the heir must disclose the estate (section 2314 BGB), and it becomes time-barred three years after the end of the year in which the claimant learns of the death and the disinheritance.`,
    faqs: [
      { q: 'Does a German compulsory share apply if the deceased chose a foreign law?', a: 'Under the EU Succession Regulation (Regulation 650/2012) the law governing the succession also decides on compulsory shares, including whether they exist at all. That law is generally the law of the last habitual residence, unless the deceased validly chose the law of a nationality they held. A British or American national living in Germany who chose their home law may therefore leave relatives a very different position. Courts examine the choice and its form.' },
      { q: 'Can parents claim a compulsory share in Germany?', a: `Yes, but only if the deceased left no descendant who claims a compulsory share or accepts what was left to them (sections 2303(2) and 2309 BGB). For an unmarried person without children and an estate of ${EN.eur(N)}, each parent’s statutory share would be ${br(elt.quoteJe)}, so each can claim ${EN.eur(elt.pflichtteilJe)} if a will names someone else.` },
      { q: 'What information must the heir give someone claiming a compulsory share?', a: 'A claimant who is not an heir can demand a full statement of the estate’s assets (section 2314 BGB), attend when the inventory is drawn up, insist that a notary prepares it, and ask for the assets to be valued, for instance by an expert report on a property. The costs are borne by the estate. Without this information the claim usually cannot be quantified.' },
      { q: 'How long do I have to claim a German compulsory share from abroad?', a: 'The regular limitation period of three years under section 195 BGB applies. It starts at the end of the year in which you learned of the death and of being excluded by the will (section 199(1) BGB), wherever you live. Regardless of knowledge, inheritance claims become time-barred after 30 years at the latest (section 199(3a) BGB). Living abroad does not extend the three years.' },
      { q: 'Is a lifetime gift deducted from a child’s compulsory share in Germany?', a: 'Only if the parent stated, when making the gift, that it should count against the compulsory share (section 2315 BGB); a later will cannot add that condition. The gift is then added to the estate at its value at the time it was made and deducted from the child’s claim. Without such a statement, equalisation rules between siblings may still apply under section 2316 BGB.' },
    ],
    body: (h) => `<h2>Who can claim</h2>
<p>The circle is narrow and closed. Under ${h.src('bgb2303', 'section 2303 BGB')} a compulsory share belongs to:</p>
<ul>
<li>descendants: children, whether born in or outside marriage or adopted, and in place of a child who has died, that child’s children</li>
<li>the spouse or registered civil partner</li>
<li>the parents, but only if no descendant claims a compulsory share or accepts what was left to them (section 2309 BGB)</li>
</ul>
<p>Siblings, nieces, nephews, grandparents, stepchildren and unmarried partners have no compulsory share. A will that ignores them excludes them entirely. Expats from countries with broader forced-heirship rules are sometimes surprised by how little German law reserves for the wider family.</p>
<h2>The formula: half the statutory share</h2>
<p>First comes the fraction the person would have taken under statutory succession (${h.src('bgb1924', 'section 1924 BGB')} for children, ${h.src('bgb1931', 'section 1931 BGB')} for a spouse). The compulsory share is half of that, applied to the net estate. It is a money claim: a disinherited daughter does not become co-owner of the family home, she has a payment claim against whoever inherited it, arising at the moment of death.</p>
<h2>Fractions for common families, estate ${h.eur(N)}</h2>
${h.table(['Family', 'Statutory share', 'Compulsory fraction', 'Amount'], [
  ['spouse (default regime) and one child: child', br(kind(zg1).quoteJe), br(kind(zg1).quoteJe * pq), h.eur(kind(zg1).pflichtteilJe)],
  ['spouse (default regime) and two children: each child', br(k2.quoteJe), br(k2.quoteJe * pq), h.eur(k2.pflichtteilJe)],
  ['spouse (separation of property) and two children: each child', br(kind(gt2).quoteJe), br(kind(gt2).quoteJe * pq), h.eur(kind(gt2).pflichtteilJe)],
  ['no spouse, three children: each child', br(kind(ledig3).quoteJe), br(kind(ledig3).quoteJe * pq), h.eur(kind(ledig3).pflichtteilJe)],
  ['childless, unmarried, both parents: each parent', br(elt.quoteJe), br(elt.quoteJe * pq), h.eur(elt.pflichtteilJe)],
  ['spouse beside two children, with a legacy (large share)', br(ehe2.quoteJe), br(ehe2.quoteJe * pq), h.eur(ehe2.pflichtteilJe)],
], 'Computed by the inheritance calculator, estate net of debts')}
<p>Separation of property shrinks the spouse’s fraction and so enlarges each child’s compulsory share; the matrimonial regime of the deceased therefore matters even to children who are not the spouse’s own.</p>
<h2>The spouse: small or large compulsory share</h2>
<p>For a spouse in the default regime there are two routes. If the spouse receives neither a share nor a legacy, ${h.src('bgb1371', 'section 1371(2) BGB')} bases the compulsory share on the unraised fraction of ${br(h.P.erbrecht.ehegatte_neben_ordnung1)} beside children, giving ${br(h.P.erbrecht.ehegatte_neben_ordnung1 * pq)} (small compulsory share), and the spouse additionally claims the accrued gains actually made during the marriage. If the will leaves a legacy, the raised fraction is widely taken as the basis (large compulsory share, ${br(ehe2.quoteJe * pq)}).</p>
<p>The same subsection has a knock-on effect: when the spouse takes the property-law route, the other claimants also calculate from the unraised spouse’s share. With two children each child’s fraction rises from ${br(k2.quoteJe * pq)} to ${br(kinderQuoteOhneViertel)}, on ${h.eur(N)} from ${h.eur(k2.pflichtteilJe)} to ${h.eur(kindPtOhneViertel)}. That figure comes before the spouse’s equalisation claim, which as a debt of the estate then shrinks the base. The ${h.a('ehegattenerbrecht', 'spouse’s inheritance')} page has a worked case.</p>
<h2>Disclosure, valuation and the deadline</h2>
<p>The heir must disclose the estate on request (section 2314 BGB), and the value is assessed at the date of death, by estimate where necessary; a value stated in the will is not binding (section 2311 BGB). The claim becomes time-barred after three years (section 195 BGB), counted from the end of the year in which the claimant learned of the death and the exclusion. For an expat relative abroad, the practical difficulty is often learning about the will at all: the clock only starts with that knowledge.</p>
<h2>What can raise or reduce the claim</h2>
<ul>
<li>Gifts to third parties in the last ${h.num(h.P.erbrecht.ergaenzung_jahre)} years raise it through the ${h.a('pflichtteilsergaenzung', 'gift top-up claim')}, reduced by ${h.pct(h.P.erbrecht.ergaenzung_abschmelzung_jahr, 0)} per year.</li>
<li>Gifts to the claimant reduce it if, at the time of the gift, the deceased said they should count (section 2315 BGB).</li>
<li>An heir burdened with an executor, a reversionary heir or legacies may disclaim and demand the compulsory share instead (section 2306 BGB).</li>
</ul>
<p>The ${h.a('pflichtteilsrechner', 'compulsory share calculator')} works out your figures, with or without a gift. This explanation of the German compulsory share is general information, not legal advice; in a dispute a civil court decides whether and how much is owed.</p>`,
  },
});
