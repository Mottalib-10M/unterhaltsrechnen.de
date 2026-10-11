import { defineGuide } from '../../lib/guide-types';
import { erbfolge, erbschaftsteuer, type ErbfolgeIn } from '../../lib/engine/erbe';
import { P, DE, EN } from '../../lib/fmt';

/** Bruch aus einer Quote des Motors (0,125 → „1/8“), nur zur Anzeige. */
const br = (q: number) => {
  for (const d of [1, 2, 3, 4, 6, 8, 12, 16, 24, 32]) { const n = Math.round(q * d); if (Math.abs(n / d - q) < 1e-9) return d === 1 ? String(n) : `${n}/${d}`; }
  return q.toFixed(3);
};
const E = P.erbrecht;
/** Beispiele aus dem Motor, nie von Hand: Nachlass 260.000 €, keine Kinder. */
const N = 260000;
const f = (x: Omit<ErbfolgeIn, 'kinder' | 'nachlass'>) => erbfolge({ ...x, kinder: 0, nachlass: N });
const c = {
  eltern: f({ verheiratet: false, elternLebend: 2 }),
  mutterGeschw: f({ verheiratet: false, elternLebend: 1, geschwister: 3 }),
  nurGeschw: f({ verheiratet: false, elternLebend: 0, geschwister: 2 }),
  nurMutter: f({ verheiratet: false, elternLebend: 1, geschwister: 0 }),
  eheEltern: f({ verheiratet: true, gueterstand: 'zugewinn', elternLebend: 2 }),
  eheGeschw: f({ verheiratet: true, gueterstand: 'zugewinn', elternLebend: 0, geschwister: 2 }),
  eheGross: f({ verheiratet: true, gueterstand: 'zugewinn', grosseltern: true }),
  eheAllein: f({ verheiratet: true, gueterstand: 'zugewinn' }),
  staat: f({ verheiratet: false }),
};
const teil = (r: ReturnType<typeof erbfolge>, w: string) => r.anteile.find((a) => a.wer === w)!;
const geschwLedig = teil(c.nurGeschw, 'geschwister');
const elternLedig = teil(c.eltern, 'elternteil');
const ehegEltern = teil(c.eheEltern, 'ehegatte');
const elternNebenEhe = teil(c.eheEltern, 'elternteil');
/** Steuer eines Bruders auf seinen Anteil und eines Elternteils, aus dem Erbschaftsteuer-Motor. */
const stGeschw = erbschaftsteuer({ erwerb: geschwLedig.betragJe, beziehung: 'geschwister', erbfall: true });
const stEltern = erbschaftsteuer({ erwerb: elternLedig.betragJe, beziehung: 'eltern', erbfall: true });

const zeile = (r: ReturnType<typeof erbfolge>, lab: Record<string, string>, eur: (n: number) => string) =>
  r.anteile.map((a) => `${(a.anzahl === 1 && lab[a.wer + '1']) || lab[a.wer]} ${a.quoteJe === 1 ? lab.alles : br(a.quoteJe)} = ${eur(a.betragJe)}`).join('; ');
const pt = (r: ReturnType<typeof erbfolge>, eur: (n: number) => string, nein: string) => {
  const p = r.anteile.filter((a) => a.pflichtteilJe > 0 && a.wer !== 'ehegatte');
  return p.length ? p.map((a) => eur(a.pflichtteilJe)).join(', ') : nein;
};

export default defineGuide({
  id: 'erbfolge-ohne-kinder',
  group: 'erbe',
  order: 14,
  mini: 'ohneKinder',
  related: ['gesetzliche-erbfolge', 'ehegattenerbrecht', 'erbrechner', 'pflichtteil', 'erbschaftsteuer-freibetraege', 'erbschaftsteuer-steuersaetze'],
  sources: ['bgb1925', 'bgb1931', 'bgb1371', 'bgb2303', 'erbstg15', 'erbstg16'],
  de: {
    slug: 'erbfolge-ohne-kinder',
    nav: 'Erbfolge ohne Kinder',
    card: 'Wer erbt, wenn keine Kinder da sind: Eltern, Geschwister, Neffen, Großeltern und der Ehegatte mit drei Vierteln.',
    title: 'Erbfolge ohne Kinder 2026: Eltern, Geschwister, Ehegatte',
    description: `Erbfolge ohne Kinder 2026: Eltern erben zu gleichen Teilen, dann Geschwister; der Ehegatte erhält ${br(E.ehegatte_neben_ordnung2 + E.zugewinn_viertel)} bei Zugewinngemeinschaft. Pflichtteil und Steuer.`,
    h1: 'Erbfolge ohne Kinder: wer erbt, wenn keine Abkömmlinge da sind',
    intro: 'Ohne Kinder und Enkel rückt die zweite Ordnung nach: Eltern, Geschwister, Nichten und Neffen. Ein Ehegatte nimmt ihnen den größten Teil ab.',
    resume: `Stirbt jemand ohne Kinder, Enkel und Testament, erben nach § 1925 BGB zuerst die Eltern, beide zu gleichen Teilen. Ist ein Elternteil vorverstorben, geht seine Hälfte an seine Kinder, also an die Geschwister des Verstorbenen, und an deren Kinder, wenn ein Geschwister schon tot ist; nur wenn es keine solchen Abkömmlinge gibt, erhält der überlebende Elternteil alles. Bei einem Nachlass von ${DE.eur(N)} erben zwei Eltern damit je ${DE.eur(elternLedig.betragJe)}; sind beide Eltern tot, teilen sich zwei Geschwister den Nachlass mit je ${DE.eur(geschwLedig.betragJe)}. War der Verstorbene verheiratet und lebte im gesetzlichen Güterstand, erhält der Ehegatte neben Eltern oder Geschwistern ${br(E.ehegatte_neben_ordnung2)} nach § 1931 BGB plus ${br(E.zugewinn_viertel)} nach § 1371 BGB, zusammen ${br(ehegEltern.quoteJe)} oder ${DE.eur(ehegEltern.betragJe)}; jeder Elternteil bekommt dann nur ${DE.eur(elternNebenEhe.betragJe)}. Erst wenn auch keine Großeltern und deren Nachkommen leben, erbt der Ehegatte allein, und ohne Ehegatten und Verwandte das Bundesland.`,
    faqs: [
      { q: 'Haben Geschwister ohne Kinder des Erblassers einen Pflichtteil?', a: 'Nein. Pflichtteilsberechtigt sind nach § 2303 BGB nur Abkömmlinge, Eltern und der Ehegatte. Geschwister, Nichten und Neffen erben zwar gesetzlich, wenn kein Testament existiert, können aber durch ein Testament vollständig übergangen werden, ohne einen Anspruch zu behalten. Eltern dagegen haben einen Pflichtteil in Höhe der Hälfte ihres gesetzlichen Erbteils, solange keine Kinder des Erblassers leben.' },
      { q: 'Erben Halbgeschwister genauso viel wie vollbürtige Geschwister?', a: 'Nicht immer. Halbgeschwister erben nur über den Elternteil, den sie mit dem Erblasser gemeinsam haben. Ist etwa der Vater tot, teilen sich seine Hälfte alle seine Kinder, auch die aus einer anderen Beziehung. An der Hälfte der Mutter haben die Halbgeschwister väterlicherseits dagegen keinen Anteil. Der Erbrechner rechnet nur mit vollbürtigen Geschwistern; Patchwork-Konstellationen sind gesondert zu prüfen.' },
      { q: 'Was erben Nichten und Neffen, wenn kein Kind und kein Elternteil mehr lebt?', a: `Sie treten an die Stelle ihres vorverstorbenen Elternteils, also des Bruders oder der Schwester des Erblassers, und teilen sich dessen Anteil zu gleichen Teilen (§ 1925 Abs. 3 BGB mit den Regeln der ersten Ordnung). Bei zwei Geschwistern und ${DE.eur(N)} Nachlass erhält ein lebender Bruder ${DE.eur(geschwLedig.betragJe)}, die zwei Kinder der verstorbenen Schwester bekommen je die Hälfte dieses Betrags.` },
      { q: 'Wie viel Erbschaftsteuer zahlen Geschwister auf ihr Erbe?', a: `Geschwister gehören nach § 15 ErbStG in die Steuerklasse II mit einem Freibetrag von nur ${DE.eur(P.erbst.freibetrag.stk2)}. Erbt ein Bruder ${DE.eur(geschwLedig.betragJe)}, ergibt der Rechner ${DE.eur(stGeschw.steuer)} Steuer bei einem Satz von ${DE.pct(stGeschw.satz)}. Eltern sind dagegen im Erbfall in Klasse I mit ${DE.eur(P.erbst.freibetrag.eltern_erbfall)} Freibetrag; auf ${DE.eur(elternLedig.betragJe)} zahlt ein Elternteil ${DE.eur(stEltern.steuer)}.` },
      { q: 'Erbt der Ehegatte alles, wenn das Paar keine Kinder hat?', a: `Nein, solange Eltern, Geschwister, Nichten, Neffen oder Großeltern leben. Neben ihnen erhält der Ehegatte im gesetzlichen Güterstand ${br(E.ehegatte_neben_ordnung2 + E.zugewinn_viertel)}, bei Gütertrennung oder Gütergemeinschaft ${br(E.ehegatte_neben_ordnung2)}. Den Rest bekommen die Verwandten. Allein erbt er erst, wenn weder Verwandte der ersten oder zweiten Ordnung noch Großeltern vorhanden sind (§ 1931 Abs. 2 BGB). Viele kinderlose Paare setzen sich deshalb gegenseitig im Testament ein.` },
      { q: 'Wer erbt ohne Kinder, Eltern und Geschwister?', a: 'Dann ist die dritte Ordnung an der Reihe: die Großeltern und, an Stelle verstorbener Großeltern, deren Abkömmlinge, also Onkel, Tanten, Cousins und Cousinen (§ 1926 BGB). Danach folgen Urgroßeltern und ihre Nachkommen; ab dieser vierten Ordnung erbt der nach dem Grad am nächsten Verwandte. Erst wenn niemand mehr festzustellen ist, erbt das Bundesland des letzten Wohnsitzes (§ 1936 BGB).' },
    ],
    body: (h) => {
      const lab: Record<string, string> = { ehegatte: 'Ehegatte', elternteil: 'je Elternteil', elternteil1: 'Mutter', geschwister: 'je Geschwister', grosseltern: 'Großeltern', staat: 'Bundesland oder Bund', alles: 'alles' };
      return `<h2>Ohne Abkömmlinge erbt die zweite Ordnung</h2>
<p>Kinder, Enkel und Urenkel bilden die erste Ordnung. Fehlen sie, oder haben alle die Erbschaft ausgeschlagen, kommt die ${h.src('bgb1925', 'zweite Ordnung nach § 1925 BGB')} zum Zug: die Eltern des Verstorbenen und deren Abkömmlinge. Leben beide Eltern, erben sie allein und je zur Hälfte. Geschwister gehen in diesem Fall leer aus, auch wenn sie dem Verstorbenen viel näher standen.</p>
<p>Ist ein Elternteil vorverstorben, wird seine Hälfte so verteilt, als wäre er selbst der Erblasser: an seine Kinder, also die Geschwister, und an Stelle eines toten Geschwisters an dessen Kinder. Nur wenn der verstorbene Elternteil keine Abkömmlinge hinterlässt, fällt seine Hälfte dem anderen Elternteil zu.</p>
<h2>Halbgeschwister und Nichten</h2>
<p>Weil jede Elternhälfte getrennt vererbt wird, kommt es bei Patchwork-Familien auf die Abstammung an. Ein Halbbruder aus der ersten Ehe des Vaters erbt nur an der Hälfte des Vaters mit, nicht an der der Mutter. Nichten und Neffen erben nur, wenn ihr eigener Elternteil, also Bruder oder Schwester des Erblassers, nicht mehr lebt. Dann teilen sie sich dessen Anteil, nicht den ganzen Nachlass.</p>
<h2>Der Ehegatte drängt die Familie zurück</h2>
<p>Neben Verwandten der zweiten Ordnung oder neben Großeltern erhält der Ehegatte nach ${h.src('bgb1931', '§ 1931 BGB')} die Hälfte. In der Zugewinngemeinschaft kommt nach ${h.src('bgb1371', '§ 1371 BGB')} ein Viertel hinzu, so dass für Eltern, Geschwister oder Großeltern zusammen nur ${br(1 - h.P.erbrecht.ehegatte_neben_ordnung2 - h.P.erbrecht.zugewinn_viertel)} bleibt. Treffen Großeltern mit Abkömmlingen verstorbener Großeltern zusammen, erhält der Ehegatte nach § 1931 Abs. 1 Satz 2 BGB zusätzlich den Teil, der auf diese Abkömmlinge entfallen würde; Onkel und Tanten gehen neben einem Ehegatten also leer aus. Allein erbt der Ehegatte erst, wenn weder Eltern noch deren Abkömmlinge noch Großeltern leben. Neben Eltern steht ihm außerdem der volle Voraus zu, also alle Haushaltsgegenstände und Hochzeitsgeschenke (§ 1932 BGB).</p>
<h2>Neun Fälle bei ${h.eur(N)} Nachlass</h2>
${h.table(['Situation', 'Verteilung', 'Pflichtteil der Eltern'], [
  ['ledig, beide Eltern leben', zeile(c.eltern, lab, h.eur), pt(c.eltern, h.eur, 'keiner')],
  ['ledig, Mutter lebt, drei Geschwister', zeile(c.mutterGeschw, lab, h.eur), pt(c.mutterGeschw, h.eur, 'keiner')],
  ['ledig, Eltern tot, zwei Geschwister', zeile(c.nurGeschw, lab, h.eur), pt(c.nurGeschw, h.eur, 'keiner')],
  ['ledig, Mutter lebt, keine Geschwister', zeile(c.nurMutter, lab, h.eur), pt(c.nurMutter, h.eur, 'keiner')],
  ['verheiratet, beide Eltern leben', zeile(c.eheEltern, lab, h.eur), pt(c.eheEltern, h.eur, 'keiner')],
  ['verheiratet, Eltern tot, zwei Geschwister', zeile(c.eheGeschw, lab, h.eur), pt(c.eheGeschw, h.eur, 'keiner')],
  ['verheiratet, nur Großeltern', zeile(c.eheGross, lab, h.eur), pt(c.eheGross, h.eur, 'keiner')],
  ['verheiratet, keine Verwandten bis Großeltern', zeile(c.eheAllein, lab, h.eur), pt(c.eheAllein, h.eur, 'keiner')],
  ['ledig, keine Verwandten', zeile(c.staat, lab, h.eur), pt(c.staat, h.eur, 'keiner')],
], 'Vom Erbrechner ermittelt, Ehegatte in Zugewinngemeinschaft; Pflichtteil je Elternteil nach § 2303 BGB')}
<p>Die dritte Spalte zeigt den Unterschied, der bei einem Testament zählt: Eltern behalten nach ${h.src('bgb2303', '§ 2303 Abs. 2 BGB')} die Hälfte ihres gesetzlichen Erbteils als Pflichtteil, Geschwister und Großeltern nichts.</p>
<h2>Die Steuer trifft Geschwister hart</h2>
<p>Was die Familie erbt, ist noch nicht, was ihr bleibt. Nach ${h.src('erbstg15', '§ 15 ErbStG')} stehen Eltern im Erbfall in der Steuerklasse I, Geschwister, Nichten und Neffen in der Klasse II. Der ${h.src('erbstg16', 'Freibetrag nach § 16 ErbStG')} beträgt für Eltern ${h.eur(h.P.erbst.freibetrag.eltern_erbfall)}, für Geschwister ${h.eur(h.P.erbst.freibetrag.stk2)}. Ein Bruder, der ${h.eur(geschwLedig.betragJe)} erbt, zahlt nach dem Rechner ${h.eur(stGeschw.steuer)}; ein Elternteil auf ${h.eur(elternLedig.betragJe)} nur ${h.eur(stEltern.steuer)}. Die Sätze stehen bei den ${h.a('erbschaftsteuer-steuersaetze', 'Steuersätzen')}.</p>
<h2>Wenn niemand mehr da ist</h2>
<p>Ohne Eltern und Geschwisterlinien folgen die Großeltern mit Onkeln, Tanten und Cousins (§ 1926 BGB), danach Urgroßeltern und deren Nachkommen (§ 1928 BGB). Ab der vierten Ordnung erbt, wer dem Grad nach am nächsten verwandt ist. Findet das Nachlassgericht keinen Verwandten und keinen Ehegatten, erbt nach § 1936 BGB das Land des letzten Wohnsitzes, hilfsweise der Bund.</p>
<p>Ihre Familie rechnet der ${h.a('erbrechner', 'Erbrechner')} mit der Zahl der lebenden Eltern und Geschwister durch. Die Grundregeln aller Ordnungen erklärt die ${h.a('gesetzliche-erbfolge', 'gesetzliche Erbfolge')}. Diese Seite zur Erbfolge ohne Kinder ist eine allgemeine Information, keine Rechtsberatung.</p>`;
    },
  },
  en: {
    slug: 'inheritance-without-children',
    nav: 'Inheritance without children',
    card: 'Who inherits in Germany when there are no children: parents, siblings, nieces, grandparents and the spouse.',
    title: 'Inheritance Without Children Germany 2026: Who Inherits',
    description: `Inheritance without children in Germany 2026: parents share equally, siblings step in, a spouse in the default regime gets ${br(E.ehegatte_neben_ordnung2 + E.zugewinn_viertel)}. Compulsory share and tax.`,
    h1: 'Who inherits in Germany when someone dies without children',
    intro: 'With no children or grandchildren, the second order takes over: parents, brothers, sisters, nieces and nephews. A spouse takes most of it away from them.',
    resume: `When a person dies in Germany without descendants and without a will, section 1925 of the Civil Code (BGB) calls the parents first, in equal halves. If one parent has died, that parent’s half goes to his or her children, the siblings of the deceased, and to the children of any sibling who has also died; only if there are none does the surviving parent take everything. On an estate of ${EN.eur(N)}, two living parents receive ${EN.eur(elternLedig.betragJe)} each, and with both parents dead two siblings take ${EN.eur(geschwLedig.betragJe)} each. A married person changes the picture sharply: beside parents or siblings the spouse receives ${br(E.ehegatte_neben_ordnung2)} under section 1931 BGB and, in the default property regime, another ${br(E.zugewinn_viertel)} under section 1371 BGB, so ${br(ehegEltern.quoteJe)} or ${EN.eur(ehegEltern.betragJe)}, leaving each parent ${EN.eur(elternNebenEhe.betragJe)}. Only if no grandparents or their descendants survive either does the spouse inherit alone; with no spouse and no relatives, the German federal state of last residence inherits.`,
    faqs: [
      { q: 'Do my siblings in another country inherit under German law if I have no children?', a: 'Where German succession law applies, yes: siblings inherit by their family position, not by nationality or place of residence, and someone living abroad is an heir like anyone else. Their share and any tax follow German rules, and their own country may tax the inheritance too. Heirs abroad have six months rather than six weeks to disclaim (section 1944 BGB).' },
      { q: 'Can I leave my siblings nothing in Germany if I have no children?', a: 'Yes. Brothers, sisters, nieces and nephews have no compulsory share under section 2303 BGB. A will naming someone else as heir excludes them completely. Parents are different: they keep a compulsory share of half their statutory portion as long as the deceased has no descendants, so a will that ignores living parents can still trigger a cash claim against the heir.' },
      { q: 'How are half-siblings treated in a German inheritance without children?', a: 'Each parent’s half passes separately. A half-brother through the father shares only in the father’s half, never in the mother’s. In a blended family this can give half-siblings noticeably less than full siblings. The calculator assumes full siblings only, so patchwork situations need to be worked out by hand or checked with the probate court.' },
      { q: 'What inheritance tax do siblings pay in Germany?', a: `Siblings are in tax class II with an allowance of only ${EN.eur(P.erbst.freibetrag.stk2)} (sections 15 and 16 ErbStG). On ${EN.eur(geschwLedig.betragJe)}, the calculator gives ${EN.eur(stGeschw.steuer)} at a rate of ${EN.pct(stGeschw.satz)}. A parent inheriting ${EN.eur(elternLedig.betragJe)} is in class I with ${EN.eur(P.erbst.freibetrag.eltern_erbfall)} allowance and pays ${EN.eur(stEltern.steuer)}.` },
      { q: 'Does a childless spouse in Germany inherit everything?', a: `Only if no parents, siblings, nieces, nephews or grandparents are alive (section 1931(2) BGB). Otherwise the spouse takes ${br(E.ehegatte_neben_ordnung2 + E.zugewinn_viertel)} in the default regime, or ${br(E.ehegatte_neben_ordnung2)} under separation or community of property, and the in-laws share the rest. That surprises many couples, which is why childless spouses often name each other as sole heir in a will.` },
    ],
    body: (h) => {
      const lab: Record<string, string> = { ehegatte: 'spouse', elternteil: 'each parent', elternteil1: 'mother', geschwister: 'each sibling', grosseltern: 'grandparents', staat: 'federal state or Federation', alles: 'everything' };
      return `<h2>No descendants: the second order inherits</h2>
<p>Children, grandchildren and great-grandchildren form the first order. When there are none, or all of them have disclaimed, the ${h.src('bgb1925', 'second order under section 1925 BGB')} inherits: the parents of the deceased and their descendants. If both parents are alive they take everything in equal halves, and the siblings receive nothing at all, however close they were.</p>
<p>If a parent has died, that parent’s half passes as if he or she were the one who died: to his or her children, the siblings of the deceased, and in place of a dead sibling to that sibling’s children. The surviving parent takes the half only when the deceased parent left no descendants.</p>
<h2>Half-siblings, nieces and nephews</h2>
<p>Because each parental half passes on its own, ancestry matters in patchwork families. A half-sister from the father’s first marriage shares in the father’s half but not in the mother’s. Nieces and nephews inherit only in place of a parent of theirs who has died, and they divide that parent’s portion between them rather than the whole estate.</p>
<h2>A spouse pushes the in-laws back</h2>
<p>Beside the second order or grandparents a spouse receives half under ${h.src('bgb1931', 'section 1931 BGB')}. The default regime adds a quarter under ${h.src('bgb1371', 'section 1371 BGB')}, so parents, siblings or grandparents share just ${br(1 - h.P.erbrecht.ehegatte_neben_ordnung2 - h.P.erbrecht.zugewinn_viertel)} between them. When grandparents meet descendants of deceased grandparents, the spouse also takes the portion those descendants would have received (section 1931(1) sentence 2 BGB), so aunts and uncles get nothing beside a spouse. The spouse inherits alone only when no parents, no descendants of parents and no grandparents survive. Beside parents, the spouse also receives all household items and wedding gifts (Voraus, section 1932 BGB).</p>
<h2>Nine situations on an estate of ${h.eur(N)}</h2>
${h.table(['Situation', 'Distribution', 'Parents’ compulsory share'], [
  ['single, both parents alive', zeile(c.eltern, lab, h.eur), pt(c.eltern, h.eur, 'none')],
  ['single, mother alive, three siblings', zeile(c.mutterGeschw, lab, h.eur), pt(c.mutterGeschw, h.eur, 'none')],
  ['single, parents dead, two siblings', zeile(c.nurGeschw, lab, h.eur), pt(c.nurGeschw, h.eur, 'none')],
  ['single, mother alive, no siblings', zeile(c.nurMutter, lab, h.eur), pt(c.nurMutter, h.eur, 'none')],
  ['married, both parents alive', zeile(c.eheEltern, lab, h.eur), pt(c.eheEltern, h.eur, 'none')],
  ['married, parents dead, two siblings', zeile(c.eheGeschw, lab, h.eur), pt(c.eheGeschw, h.eur, 'none')],
  ['married, only grandparents', zeile(c.eheGross, lab, h.eur), pt(c.eheGross, h.eur, 'none')],
  ['married, no relatives up to grandparents', zeile(c.eheAllein, lab, h.eur), pt(c.eheAllein, h.eur, 'none')],
  ['single, no relatives', zeile(c.staat, lab, h.eur), pt(c.staat, h.eur, 'none')],
], 'Computed by the inheritance calculator, spouse in the default regime; compulsory share per parent under section 2303 BGB')}
<p>The last column matters once there is a will. Parents keep half their statutory portion as a compulsory share under ${h.src('bgb2303', 'section 2303(2) BGB')}; siblings and grandparents keep nothing. Compare the second and fourth rows: the mother’s compulsory share doubles when there are no siblings, because her statutory portion grows from a half to the whole estate. Married couples see the opposite effect, since the spouse’s three quarters shrink every parent’s portion and with it the compulsory share.</p>
<h2>Tax hits siblings hardest</h2>
<p>Under ${h.src('erbstg15', 'section 15 ErbStG')} parents inheriting from a child are in tax class I, while siblings, nieces and nephews are in class II. The ${h.src('erbstg16', 'allowance under section 16 ErbStG')} is ${h.eur(h.P.erbst.freibetrag.eltern_erbfall)} for a parent and ${h.eur(h.P.erbst.freibetrag.stk2)} for a sibling. A brother inheriting ${h.eur(geschwLedig.betragJe)} owes ${h.eur(stGeschw.steuer)} according to the calculator; a parent receiving ${h.eur(elternLedig.betragJe)} owes ${h.eur(stEltern.steuer)}. The rates are on the ${h.a('erbschaftsteuer-steuersaetze', 'tax rates')} page. If relatives live abroad, their country of residence may also tax what they receive.</p>
<h2>When no one is left</h2>
<p>Without parents or sibling lines, the grandparents inherit with aunts, uncles and cousins stepping in for those who have died (section 1926 BGB), then great-grandparents and their descendants (section 1928 BGB), where the closest in degree takes precedence. If the probate court (Nachlassgericht) finds no relative and no spouse, the federal state (Land) of the last residence inherits, failing that the Federation (section 1936 BGB).</p>
<p>The ${h.a('erbrechner', 'inheritance calculator')} takes the number of living parents and siblings as inputs; the general rules for all orders are under ${h.a('gesetzliche-erbfolge', 'statutory succession')}. This page on inheritance without children is general information and not legal advice.</p>`;
    },
  },
});
