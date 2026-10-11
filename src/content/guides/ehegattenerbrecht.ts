import { defineGuide } from '../../lib/guide-types';
import { erbfolge, type Gueterstand } from '../../lib/engine/erbe';
import { zugewinnausgleich } from '../../lib/engine/vermoegen';
import { P, DE, EN } from '../../lib/fmt';

/** Bruch aus einer Quote des Motors (0,25 → „1/4“), nur zur Anzeige. */
const br = (q: number) => {
  for (const d of [1, 2, 3, 4, 6, 8, 12, 16, 24, 32]) { const n = Math.round(q * d); if (Math.abs(n / d - q) < 1e-9) return d === 1 ? String(n) : `${n}/${d}`; }
  return q.toFixed(3);
};
const E = P.erbrecht;
/** Beispiele aus dem Motor, nie von Hand: Nachlass 480.000 €. */
const N = 480000;
const ehe = (g: Gueterstand, k: number) => erbfolge({ verheiratet: true, gueterstand: g, kinder: k, elternLebend: k ? 0 : 2, nachlass: N }).anteile[0];
const zg1 = ehe('zugewinn', 1), zg0 = ehe('zugewinn', 0);
const gt1 = ehe('trennung', 1), gt2 = ehe('trennung', 2), gt3 = ehe('trennung', 3);
const gg1 = ehe('gemeinschaft', 1);
/** Enterbte Ehefrau, die ganze Erbmasse des Mannes ist in der Ehe entstanden; sie selbst hat keinen Zugewinn. */
const za = zugewinnausgleich({ anfangA: 0, endA: N, anfangB: 0, endB: 0 });
const restNachlass = N - za.forderung;
const kleinPt = erbfolge({ verheiratet: true, gueterstand: 'zugewinn', kinder: 2, nachlass: restNachlass }).kleinerPflichtteilEhegatte;
const gueterrechtlich = za.forderung + kleinPt;
const erbrechtlich = ehe('zugewinn', 2);

const zelle = (a: { quoteJe: number; betragJe: number }, eur: (n: number) => string) => `${br(a.quoteJe)} = ${eur(a.betragJe)}`;

export default defineGuide({
  id: 'ehegattenerbrecht',
  group: 'erbe',
  order: 12,
  mini: 'ehegattenErbteil',
  related: ['gesetzliche-erbfolge', 'erbrechner', 'zugewinnausgleich', 'pflichtteil', 'erbschaftsteuer-freibetraege', 'erbfolge-ohne-kinder'],
  sources: ['bgb1931', 'bgb1371', 'bgb2303', 'bgb1373', 'erbstg16'],
  de: {
    slug: 'ehegattenerbrecht',
    nav: 'Erbrecht des Ehegatten',
    card: 'Wie viel der Ehegatte ohne Testament erbt: Zugewinngemeinschaft, Gütertrennung, Gütergemeinschaft im Vergleich.',
    title: 'Erbrecht Ehegatte 2026: Erbteil nach Güterstand, Tabelle',
    description: `Erbrecht des Ehegatten 2026: ${br(E.ehegatte_neben_ordnung1)} neben Kindern, ${br(E.ehegatte_neben_ordnung2)} neben Eltern, plus ${br(E.zugewinn_viertel)} bei Zugewinngemeinschaft. Gütertrennung, kleiner und großer Pflichtteil, Voraus.`,
    h1: 'Erbrecht des Ehegatten: was der Güterstand ausmacht',
    intro: 'Wie viel ein Witwer oder eine Witwe erbt, hängt von zwei Fragen ab: welche Verwandten leben und welcher Güterstand galt.',
    resume: `Der überlebende Ehegatte erbt in Deutschland nach § 1931 BGB neben Kindern und Enkeln ${br(E.ehegatte_neben_ordnung1)}, neben Eltern, Geschwistern oder Großeltern ${br(E.ehegatte_neben_ordnung2)}, und allein, wenn keiner von ihnen lebt. Bestand die Zugewinngemeinschaft, also der gesetzliche Güterstand ohne Ehevertrag, erhöht sich dieser Erbteil nach § 1371 Abs. 1 BGB pauschal um ${br(E.zugewinn_viertel)}. Bei einem Nachlass von ${DE.eur(N)} und einem Kind erhält die Witwe dann ${br(zg1.quoteJe)}, also ${DE.eur(zg1.betragJe)}; ohne Kinder, neben beiden Eltern, sind es ${br(zg0.quoteJe)} oder ${DE.eur(zg0.betragJe)}. Bei Gütertrennung entfällt das Zusatzviertel, dafür erben Ehegatte und ein oder zwei Kinder zu gleichen Teilen (§ 1931 Abs. 4 BGB): neben einem Kind ${DE.eur(gt1.betragJe)}, neben zwei Kindern ${DE.eur(gt2.betragJe)}. In der Gütergemeinschaft gilt nur die Grundquote, weil dem Überlebenden seine Hälfte am Gesamtgut ohnehin gehört. Wird der Ehegatte enterbt, bleibt ihm der Pflichtteil; bei Zugewinngemeinschaft zusätzlich der rechnerische Zugewinnausgleich.`,
    faqs: [
      { q: 'Erbt der Ehegatte, wenn bei seinem Tod die Scheidung beantragt war?', a: 'Nicht in jedem Fall. Nach § 1933 BGB entfallen Erbrecht und Voraus, wenn beim Tod die Voraussetzungen der Scheidung vorlagen und der Verstorbene die Scheidung beantragt oder ihr zugestimmt hatte. Hatte nur der Überlebende den Antrag gestellt, bleibt dessen Erbrecht bestehen. Ob die Ehe tatsächlich gescheitert war, prüft im Streit das Nachlassgericht. Ein Testament zugunsten des Ehegatten wird nach § 2077 BGB im selben Fall in der Regel unwirksam.' },
      { q: 'Was ist der Voraus des Ehegatten?', a: 'Der Voraus nach § 1932 BGB steht dem gesetzlich erbenden Ehegatten zusätzlich zu seinem Erbteil zu: die Gegenstände des ehelichen Haushalts, die nicht Zubehör eines Grundstücks sind, und die Hochzeitsgeschenke. Neben Eltern, Geschwistern oder Großeltern erhält er sie vollständig, neben Kindern nur, soweit er sie für einen angemessenen Haushalt braucht. Rechtlich wird der Voraus wie ein Vermächtnis behandelt und geht dem Erbteil voraus.' },
      { q: 'Wann lohnt es sich für den Ehegatten, das Erbe auszuschlagen?', a: `Wenn der tatsächliche Zugewinn des Verstorbenen sehr hoch war. Schlägt der Ehegatte aus, kann er nach § 1371 Abs. 3 BGB den konkret berechneten Zugewinnausgleich und daneben den kleinen Pflichtteil verlangen. Im Beispiel dieser Seite ergibt das ${DE.eur(gueterrechtlich)} statt ${DE.eur(erbrechtlich.betragJe)} als Erbe. Die Ausschlagung ist nur binnen sechs Wochen möglich, bei Wohnsitz des Erblassers im Ausland binnen sechs Monaten (§ 1944 BGB).` },
      { q: 'Wie hoch ist der Freibetrag für Ehegatten bei der Erbschaftsteuer?', a: `${DE.eur(P.erbst.freibetrag.ehegatte)} persönlicher Freibetrag nach § 16 ErbStG und zusätzlich ein Versorgungsfreibetrag von ${DE.eur(P.erbst.versorgung_ehegatte)} nach § 17 ErbStG, der um steuerfreie Versorgungsbezüge wie Witwenrenten gekürzt werden kann. Der Zugewinnausgleich selbst ist nach § 5 ErbStG steuerfrei, auch wenn er nur fiktiv im Erbfall berechnet wird. Eingetragene Lebenspartner werden wie Ehegatten behandelt, nichteheliche Partner nicht.` },
      { q: 'Gilt das Ehegattenerbrecht auch für eingetragene Lebenspartner?', a: 'Ja. § 10 des Lebenspartnerschaftsgesetzes gibt eingetragenen Lebenspartnern dieselben Quoten wie Ehegatten, einschließlich Voraus und der Gleichverteilung bei Gütertrennung. Seit dem 1. Oktober 2017 können keine neuen Lebenspartnerschaften mehr begründet werden; bestehende gelten aber fort, solange sie nicht in eine Ehe umgewandelt wurden. Nichteheliche Partner haben dagegen kein gesetzliches Erbrecht, auch nicht nach langer Beziehung.' },
      { q: 'Wie viel erbt der Ehegatte bei Gütertrennung und drei Kindern?', a: `Bei drei oder mehr Kindern greift die Gleichverteilung des § 1931 Abs. 4 BGB nicht mehr. Der Ehegatte erhält dann wieder die Grundquote von ${br(E.ehegatte_neben_ordnung1)}, bei ${DE.eur(N)} Nachlass also ${DE.eur(gt3.betragJe)}, und die Kinder teilen sich die übrigen drei Viertel. Ein Zusatzviertel gibt es bei Gütertrennung nie, weil kein Zugewinn auszugleichen ist.` },
    ],
    body: (h) => `<h2>Zwei Bausteine: Grundquote und Güterstand</h2>
<p>Ehegatten sind keine Verwandten und erben deshalb nicht nach den Ordnungen, sondern nach einer eigenen Regel. Der ${h.src('bgb1931', '§ 1931 BGB')} gibt ihnen eine Grundquote, die davon abhängt, wer neben ihnen erbt:</p>
<ul>
<li>neben Kindern, Enkeln oder Urenkeln: ${br(h.P.erbrecht.ehegatte_neben_ordnung1)}</li>
<li>neben Eltern, Geschwistern, Nichten, Neffen oder Großeltern: ${br(h.P.erbrecht.ehegatte_neben_ordnung2)}</li>
<li>wenn keiner von ihnen lebt: der ganze Nachlass</li>
</ul>
<p>Der zweite Baustein ist der Güterstand. Er entscheidet, ob zur Grundquote etwas hinzukommt oder ob sich die Teilung mit den Kindern verschiebt. Wer nie beim Notar einen Ehevertrag geschlossen hat, lebt in der Zugewinngemeinschaft.</p>
<h2>Zugewinngemeinschaft: das pauschale Viertel</h2>
<p>Endet die Zugewinngemeinschaft durch Tod, wird der Zugewinn nicht ausgerechnet. Stattdessen erhöht ${h.src('bgb1371', '§ 1371 Abs. 1 BGB')} den gesetzlichen Erbteil um ${br(h.P.erbrecht.zugewinn_viertel)}, und zwar ausdrücklich auch dann, wenn in der Ehe gar kein Zugewinn erzielt wurde oder der Überlebende selbst mehr hinzugewonnen hat. Neben Kindern kommt die Witwe so auf ${br(h.P.erbrecht.ehegatte_neben_ordnung1 + h.P.erbrecht.zugewinn_viertel)}, neben Eltern auf ${br(h.P.erbrecht.ehegatte_neben_ordnung2 + h.P.erbrecht.zugewinn_viertel)}.</p>
<p>Das Viertel ist nicht ganz frei: Hinterlässt der Verstorbene Kinder aus einer anderen Beziehung, muss der Ehegatte ihnen aus diesem Zusatzviertel bei Bedarf eine angemessene Ausbildung finanzieren (§ 1371 Abs. 4 BGB).</p>
<h2>Gütertrennung und Gütergemeinschaft</h2>
<p>Bei Gütertrennung gibt es keinen Zugewinn und damit kein Zusatzviertel. Um den Ehegatten nicht schlechter zu stellen als ein Kind, ordnet § 1931 Abs. 4 BGB an: Neben einem oder zwei Kindern erben Ehegatte und Kinder zu gleichen Teilen. Ab drei Kindern gilt wieder die Grundquote.</p>
<p>In der Gütergemeinschaft gehört das während der Ehe erworbene Vermögen beiden gemeinsam (Gesamtgut). Beim Tod fällt nur der Anteil des Verstorbenen am Gesamtgut in den Nachlass; die andere Hälfte gehört dem Überlebenden bereits. Vom Nachlass erhält er die Grundquote ohne Zusatzviertel.</p>
<h2>Vergleich bei ${h.eur(N)} Nachlass</h2>
${h.table(['Neben', 'Zugewinngemeinschaft', 'Gütertrennung', 'Gütergemeinschaft'], [
  ['einem Kind', zelle(zg1, h.eur), zelle(gt1, h.eur), zelle(gg1, h.eur)],
  ['zwei Kindern', zelle(ehe('zugewinn', 2), h.eur), zelle(gt2, h.eur), zelle(ehe('gemeinschaft', 2), h.eur)],
  ['drei Kindern', zelle(ehe('zugewinn', 3), h.eur), zelle(gt3, h.eur), zelle(ehe('gemeinschaft', 3), h.eur)],
  ['beiden Eltern, keine Kinder', zelle(zg0, h.eur), zelle(ehe('trennung', 0), h.eur), zelle(ehe('gemeinschaft', 0), h.eur)],
], 'Erbteil des Ehegatten, vom Erbrechner ermittelt; bei Gütergemeinschaft zusätzlich die eigene Hälfte des Gesamtguts')}
<p>Die Tabelle zeigt, warum die Gütertrennung bei Familien mit einem Kind nicht schadet und bei drei Kindern deutlich ungünstiger ist. Die Zugewinngemeinschaft verschafft dem Ehegatten in allen Zeilen mindestens die Hälfte.</p>
<h2>Enterbter Ehegatte: kleiner und großer Pflichtteil</h2>
<p>Wird der Ehegatte durch Testament ausgeschlossen, hat er nach ${h.src('bgb2303', '§ 2303 Abs. 2 BGB')} einen Pflichtteil in Höhe der Hälfte seines gesetzlichen Erbteils. In der Zugewinngemeinschaft kommt es darauf an, ob er gar nichts bekommt. Erhält er weder Erbteil noch Vermächtnis, berechnet sich der Pflichtteil aus dem nicht erhöhten Erbteil (kleiner Pflichtteil), und daneben steht ihm der konkret ausgerechnete ${h.src('bgb1373', 'Zugewinnausgleich')} zu (§ 1371 Abs. 2 BGB). Ist er dagegen mit einem Vermächtnis bedacht, wird nach verbreiteter Auffassung vom erhöhten Erbteil ausgegangen (großer Pflichtteil).</p>
<p>Ein Beispiel mit zwei Kindern: Das Vermögen des Mannes von ${h.eur(N)} ist vollständig in der Ehe entstanden, die Frau hat keinen Zugewinn. Ihre Ausgleichsforderung beträgt ${h.eur(za.forderung)} und mindert als Nachlassschuld den Nachlass auf ${h.eur(restNachlass)}. Der kleine Pflichtteil von ${br(h.P.erbrecht.ehegatte_neben_ordnung1 * h.P.erbrecht.pflichtteil_quote)} daraus sind ${h.eur(kleinPt)}. Zusammen erhält sie ${h.eur(gueterrechtlich)}, als gesetzliche Erbin hätte sie ${h.eur(erbrechtlich.betragJe)} bekommen. Diese güterrechtliche Lösung steht nach § 1371 Abs. 3 BGB auch einer Witwe offen, die ihr Erbe ausschlägt. Wie der Ausgleich selbst berechnet wird, erklärt die Seite zum ${h.a('zugewinnausgleich', 'Zugewinnausgleich')}.</p>
<h2>Voraus, Dreißigster und Scheidungsantrag</h2>
<p>Neben dem Erbteil stehen dem gesetzlich erbenden Ehegatten die Haushaltsgegenstände und Hochzeitsgeschenke als Voraus zu (§ 1932 BGB), neben Kindern allerdings nur, soweit er sie für einen angemessenen Haushalt braucht. Lebte er mit dem Verstorbenen zusammen und wurde von ihm unterhalten, muss der Erbe ihm für die ersten 30 Tage Unterhalt und die Nutzung der Wohnung gewähren (§ 1969 BGB). Das Erbrecht entfällt nach § 1933 BGB, wenn der Verstorbene die Scheidung beantragt oder ihr zugestimmt hatte und ihre Voraussetzungen vorlagen.</p>
<h2>Steuer</h2>
<p>Ehegatten haben nach ${h.src('erbstg16', '§ 16 ErbStG')} einen Freibetrag von ${h.eur(h.P.erbst.freibetrag.ehegatte)} und daneben einen Versorgungsfreibetrag von ${h.eur(h.P.erbst.versorgung_ehegatte)}. Die Einzelheiten stehen bei den ${h.a('erbschaftsteuer-freibetraege', 'Freibeträgen')}. Eigene Konstellationen rechnet der ${h.a('erbrechner', 'Erbrechner')} durch. Diese Darstellung des Ehegattenerbrechts ist eine allgemeine Information und keine Rechtsberatung für Ihren Nachlass.</p>`,
  },
  en: {
    slug: 'spouse-inheritance',
    nav: 'Spouse’s inheritance',
    card: 'How much a surviving spouse inherits in Germany without a will, by matrimonial property regime.',
    title: 'Spouse Inheritance Germany 2026: Share by Property Regime',
    description: `Spouse inheritance in Germany 2026: ${br(E.ehegatte_neben_ordnung1)} beside children, ${br(E.ehegatte_neben_ordnung2)} beside parents, plus ${br(E.zugewinn_viertel)} in the default regime. Separation of property, compulsory share, expats.`,
    h1: 'What a surviving spouse inherits in Germany',
    intro: 'A widow’s or widower’s share depends on two things: which relatives survive and which matrimonial property regime applied.',
    resume: `Under section 1931 of the German Civil Code (BGB), a surviving spouse inherits ${br(E.ehegatte_neben_ordnung1)} of the estate alongside children or grandchildren, ${br(E.ehegatte_neben_ordnung2)} alongside parents, siblings or grandparents, and everything when none of them is alive. In the default property regime, the community of accrued gains (Zugewinngemeinschaft), which applies to every couple without a notarised marriage contract, that share rises by a flat ${br(E.zugewinn_viertel)} under section 1371(1) BGB. On an estate of ${EN.eur(N)} with one child, the widow therefore takes ${br(zg1.quoteJe)}, which is ${EN.eur(zg1.betragJe)}; with no children but both parents alive, ${br(zg0.quoteJe)} or ${EN.eur(zg0.betragJe)}. Under separation of property (Gütertrennung) there is no extra quarter, but spouse and one or two children share equally (section 1931(4) BGB): ${EN.eur(gt1.betragJe)} beside one child, ${EN.eur(gt2.betragJe)} beside two. In a community of property (Gütergemeinschaft) only the basic fraction applies, because the survivor already owns half of the joint assets. A spouse cut out by will keeps the compulsory share.`,
    faqs: [
      { q: 'Which law decides my spouse’s inheritance if we are foreigners living in Germany?', a: 'For deaths since 17 August 2015, the EU Succession Regulation (Regulation 650/2012) generally applies the law of the country where the deceased had their habitual residence at death; a will may choose the law of a nationality held instead. Your matrimonial property regime is a separate question with its own rules, so the extra quarter of section 1371 BGB is not automatic for couples married abroad. A notary or probate court can assess this.' },
      { q: 'Does a spouse still inherit in Germany if divorce proceedings were pending?', a: 'Not always. Under section 1933 BGB the spouse loses the statutory share and household items if, at the time of death, the conditions for divorce were met and the deceased had filed for divorce or consented to it. If only the survivor had filed, their right remains. A will in the spouse’s favour is normally ineffective in the same situation (section 2077 BGB).' },
      { q: 'What household items does a German widow receive on top of her share?', a: 'The so-called advance portion (Voraus, section 1932 BGB): household items that are not fixtures of a property, plus wedding gifts. Beside parents, siblings or grandparents the spouse receives all of them; beside children only as far as needed to run a reasonable household. It is treated like a legacy and comes off the estate before the shares are calculated.' },
      { q: 'How long does a spouse have to disclaim an inheritance in Germany?', a: `Six weeks from learning of the inheritance and its basis, or six months if the deceased’s last residence was only abroad or the heir is abroad when the period starts (section 1944 BGB). Disclaiming can pay off in the default regime: in the example on this page the widow gets ${EN.eur(gueterrechtlich)} by taking the accrued-gains claim plus the small compulsory share, against ${EN.eur(erbrechtlich.betragJe)} as heir.` },
      { q: 'What is the German inheritance tax allowance for a spouse?', a: `${EN.eur(P.erbst.freibetrag.ehegatte)} under section 16 of the Inheritance Tax Act (ErbStG), plus a special pension allowance of ${EN.eur(P.erbst.versorgung_ehegatte)} under section 17, which is reduced by tax-free survivor pensions. Registered civil partners receive the same. An unmarried partner falls into tax class III with a far smaller allowance, which is one reason couples abroad sometimes marry before settling in Germany.` },
    ],
    body: (h) => `<h2>Two building blocks</h2>
<p>A spouse is not a blood relative, so German law gives them a separate fraction rather than a place in the orders of heirs. ${h.src('bgb1931', 'Section 1931 BGB')} sets that fraction by reference to who else inherits:</p>
<ul>
<li>beside children, grandchildren or great-grandchildren: ${br(h.P.erbrecht.ehegatte_neben_ordnung1)}</li>
<li>beside parents, siblings, nieces, nephews or grandparents: ${br(h.P.erbrecht.ehegatte_neben_ordnung2)}</li>
<li>if none of these relatives is alive: the whole estate</li>
</ul>
<p>The second block is the matrimonial property regime (Güterstand). Couples who never signed a marriage contract before a German notary live in the default regime, the community of accrued gains. Couples who married abroad may be in a foreign regime; which one applies is a conflict-of-laws question that this page does not resolve.</p>
<h2>The default regime adds a flat quarter</h2>
<p>When a spouse dies, the gains built up during the marriage are not actually calculated. ${h.src('bgb1371', 'Section 1371(1) BGB')} instead raises the statutory share by ${br(h.P.erbrecht.zugewinn_viertel)}, expressly even if no gains were made or the survivor gained more than the deceased. Beside children the survivor thus reaches ${br(h.P.erbrecht.ehegatte_neben_ordnung1 + h.P.erbrecht.zugewinn_viertel)}, beside parents ${br(h.P.erbrecht.ehegatte_neben_ordnung2 + h.P.erbrecht.zugewinn_viertel)}.</p>
<p>One string is attached. If the deceased had children from another relationship, the survivor must fund their reasonable education out of this extra quarter where they need it (section 1371(4) BGB). In patchwork families that obligation can matter.</p>
<h2>Separation of property and community of property</h2>
<p>Separation of property (Gütertrennung) involves no gains to share, so there is no extra quarter. To stop the spouse being worse off than a child, section 1931(4) BGB lets spouse and children inherit equally when there are one or two children. From three children on, the basic quarter applies again.</p>
<p>In a community of property (Gütergemeinschaft), assets acquired during the marriage belong to both spouses jointly. Only the deceased’s half of these joint assets falls into the estate, since the other half already belongs to the survivor, who then inherits the basic fraction of the estate without any increase.</p>
<h2>Comparison on an estate of ${h.eur(N)}</h2>
${h.table(['Beside', 'Accrued gains (default)', 'Separation', 'Community'], [
  ['one child', zelle(zg1, h.eur), zelle(gt1, h.eur), zelle(gg1, h.eur)],
  ['two children', zelle(ehe('zugewinn', 2), h.eur), zelle(gt2, h.eur), zelle(ehe('gemeinschaft', 2), h.eur)],
  ['three children', zelle(ehe('zugewinn', 3), h.eur), zelle(gt3, h.eur), zelle(ehe('gemeinschaft', 3), h.eur)],
  ['both parents, no children', zelle(zg0, h.eur), zelle(ehe('trennung', 0), h.eur), zelle(ehe('gemeinschaft', 0), h.eur)],
], 'Spouse’s share as computed by the inheritance calculator; under community of property the survivor also keeps their own half of the joint assets')}
<p>Separation of property costs nothing with one child and a lot with three. The default regime gives the survivor at least half in every row.</p>
<h2>A spouse left out of the will</h2>
<p>A disinherited spouse can claim a compulsory share (Pflichtteil) worth half the statutory share under ${h.src('bgb2303', 'section 2303(2) BGB')}. In the default regime two routes exist. If the spouse receives neither a share nor a legacy, the compulsory share is calculated from the unraised fraction (the small compulsory share) and the survivor additionally claims the gains actually built up (${h.src('bgb1373', 'accrued gains under section 1373 BGB')}). If the will leaves a legacy, the raised fraction is widely taken as the basis instead (the large compulsory share).</p>
<p>Suppose the husband’s ${h.eur(N)} was all earned during the marriage, the wife made no gains, and there are two children. Her equalisation claim is ${h.eur(za.forderung)}; as a debt of the estate it reduces the estate to ${h.eur(restNachlass)}, of which her small compulsory share of ${br(h.P.erbrecht.ehegatte_neben_ordnung1 * h.P.erbrecht.pflichtteil_quote)} is ${h.eur(kleinPt)}. In total she receives ${h.eur(gueterrechtlich)}, against ${h.eur(erbrechtlich.betragJe)} as statutory heir. A widow who disclaims the inheritance can choose this route too (section 1371(3) BGB). The ${h.a('zugewinnausgleich', 'accrued gains')} page explains the underlying calculation.</p>
<h2>Household items, the first month, and tax</h2>
<p>A spouse who inherits by law also receives the household items and wedding gifts (Voraus, section 1932 BGB), beside children only as far as needed. A family member who lived in the household and was supported by the deceased may stay and be maintained by the heirs for the first 30 days (section 1969 BGB). For tax, ${h.src('erbstg16', 'section 16 ErbStG')} grants a spouse ${h.eur(h.P.erbst.freibetrag.ehegatte)} plus a pension allowance of ${h.eur(h.P.erbst.versorgung_ehegatte)}; see the ${h.a('erbschaftsteuer-freibetraege', 'tax-free allowances')}.</p>
<p>Run your own situation through the ${h.a('erbrechner', 'inheritance calculator')}. This explanation of a spouse’s inheritance rights is general information and not legal advice on any particular estate.</p>`,
  },
});
