import { defineGuide } from '../../lib/guide-types';
import { erbfolge } from '../../lib/engine/erbe';
import { P, DE, EN } from '../../lib/fmt';

/** Bruch aus einer Quote des Motors (0,25 → „1/4“), wie ihn der Rechner anzeigt. */
const br = (q: number) => {
  for (const d of [1, 2, 3, 4, 6, 8, 12, 16, 24, 32]) { const n = Math.round(q * d); if (Math.abs(n / d - q) < 1e-9) return d === 1 ? String(n) : `${n}/${d}`; }
  return q.toFixed(3);
};
/** Startwerte des Rechners: verheiratet, Zugewinngemeinschaft, zwei Kinder, 300.000 €. */
const N = 300000;
const start = erbfolge({ verheiratet: true, gueterstand: 'zugewinn', kinder: 2, nachlass: N });
const sEhe = start.anteile.find((a) => a.wer === 'ehegatte')!;
const sKind = start.anteile.find((a) => a.wer === 'kind')!;
/** Zweites Beispiel: Ehepaar ohne Kinder, Mutter lebt, Vater tot, ein Bruder. */
const ohne = erbfolge({ verheiratet: true, gueterstand: 'zugewinn', kinder: 0, elternLebend: 1, geschwister: 1, nachlass: N });
const oEhe = ohne.anteile.find((a) => a.wer === 'ehegatte')!;
const oMutter = ohne.anteile.find((a) => a.wer === 'elternteil')!;
const oBruder = ohne.anteile.find((a) => a.wer === 'geschwister')!;
/** Drittes Beispiel: Gütertrennung, ein Kind. */
const gt = erbfolge({ verheiratet: true, gueterstand: 'trennung', kinder: 1, nachlass: N });

export default defineGuide({
  id: 'erbrechner',
  group: 'erbe',
  order: 5,
  tool: 'erbfolge',
  toolPreset: { modus: 'erbfolge' },
  related: ['gesetzliche-erbfolge', 'ehegattenerbrecht', 'erbfolge-ohne-kinder', 'pflichtteilsrechner', 'erbschaftsteuer-rechner'],
  sources: ['bgb1924', 'bgb1925', 'bgb1931', 'bgb1371', 'bgb2303'],
  de: {
    slug: 'erbrechner',
    nav: 'Erbrechner',
    card: 'Gesetzliche Erbfolge berechnen: Ehegatte, Kinder, Eltern, Geschwister, mit Quote, Betrag und Pflichtteil.',
    title: 'Erbrechner 2026: Erbfolge und Erbteile online berechnen',
    description: `Erbrechner 2026: Erbfolge-Rechner nach BGB für Ehegatte, Kinder, Eltern und Geschwister. Erbquote, Betrag in Euro, Pflichtteil und Rechenweg je Güterstand.`,
    h1: 'Erbrechner: wer wie viel erbt, wenn es kein Testament gibt',
    intro: 'Nachlass, Familienstand, Güterstand und Angehörige eingeben: Der Rechner verteilt den Nachlass nach §§ 1924 bis 1931 und 1371 BGB.',
    resume: `Der Erbrechner wendet die gesetzliche Erbfolge des BGB auf Ihre Familie an. Mit den Startwerten, einem Nachlass von ${DE.eur(N)}, einem verheirateten Erblasser in Zugewinngemeinschaft und zwei Kindern, erhält der Ehegatte ${br(sEhe.quoteJe)}, also ${DE.eur(sEhe.betragJe)}: ${br(P.erbrecht.ehegatte_neben_ordnung1)} nach § 1931 BGB und ${br(P.erbrecht.zugewinn_viertel)} Zugewinnausgleich nach § 1371 BGB. Jedes Kind bekommt ${br(sKind.quoteJe)} oder ${DE.eur(sKind.betragJe)}, und sein Pflichtteil, falls es enterbt würde, läge bei ${DE.eur(sKind.pflichtteilJe)}. Stellen Sie die Kinderzahl auf 0, fragt der Rechner nach lebenden Eltern, Geschwistern und Großeltern und rechnet in der zweiten oder dritten Ordnung weiter. Der Güterstand verschiebt die Quoten: Bei Gütertrennung und einem Kind teilen Ehegatte und Kind je zur Hälfte. Unter dem Ergebnis steht der Rechenweg mit den Paragrafen; der Link enthält Ihre Eingaben und lässt sich teilen.`,
    faqs: [
      { q: 'Welchen Wert trage ich im Erbrechner als Nachlass ein?', a: 'Den Nettonachlass: alle Vermögenswerte des Verstorbenen am Todestag, also Immobilien zum Verkehrswert, Konten, Depots, Fahrzeuge und Forderungen, abzüglich seiner Schulden und der Kosten der Beerdigung. Bei einer Immobilie mit Darlehen zählt der Wert abzüglich der Restschuld. Gemeinsame Konten des Ehepaars gehören in der Regel nur zur Hälfte in den Nachlass. Lebensversicherungen mit Bezugsberechtigtem fallen meist nicht hinein.' },
      { q: 'Kann der Erbrechner ein Testament berücksichtigen?', a: 'Nein. Er rechnet ausschließlich die gesetzliche Erbfolge, also die Verteilung ohne Testament oder Erbvertrag. Gibt es ein Testament, bestimmt es die Erben; der Rechner zeigt dann nur, was die Angehörigen ohne Testament bekommen hätten und welcher Pflichtteil Kindern, Ehegatten oder Eltern zusteht, wenn sie übergangen wurden. Für Schenkungen zu Lebzeiten gibt es den Pflichtteilsrechner mit zwei weiteren Feldern.' },
      { q: 'Wie zähle ich im Erbrechner ein verstorbenes Kind mit Enkeln?', a: 'Als Kind. Hat ein vorverstorbenes Kind selbst Kinder hinterlassen, treten diese an seine Stelle und teilen sich seinen Anteil (§ 1924 Abs. 3 BGB). Der Rechner zeigt dann den Anteil je Stamm; den Betrag teilen Sie durch die Zahl der Enkel in diesem Stamm. Ein vorverstorbenes Kind ohne Nachkommen zählen Sie nicht mit, es fällt aus der Rechnung heraus.' },
      { q: 'Was bedeutet die Zeile kleiner Pflichtteil Ehegatte im Erbrechner?', a: `Sie erscheint nur bei Zugewinngemeinschaft. Wird der Ehegatte enterbt und erhält auch kein Vermächtnis, berechnet sich sein Pflichtteil aus dem nicht erhöhten Erbteil; mit den Startwerten sind das ${DE.eur(start.kleinerPflichtteilEhegatte)}. Daneben kann er den tatsächlich entstandenen Zugewinnausgleich verlangen, den der Rechner nicht kennt. Dafür ist der Zugewinnausgleich-Rechner gedacht.` },
    ],
    body: (h) => `<h2>Die Eingaben</h2>
<ul>
<li><strong>Wert des Nachlasses</strong>: das Vermögen nach Abzug der Schulden, in Euro.</li>
<li><strong>Verheiratet?</strong>: Ja oder Nein. Eingetragene Lebenspartner wählen Ja.</li>
<li><strong>Güterstand</strong> (nur bei Ja): Zugewinngemeinschaft als Regelfall, Gütertrennung oder Gütergemeinschaft, wie im Ehevertrag vereinbart.</li>
<li><strong>Kinder</strong>: lebende Kinder plus vorverstorbene Kinder, die eigene Nachkommen hinterlassen haben.</li>
<li><strong>Lebende Eltern, Geschwister, Großeltern?</strong>: erscheinen nur, wenn Sie 0 Kinder eintragen. Gezählt werden vollbürtige Geschwister.</li>
</ul>
<p>Das Ergebnis zeigt oben die Quote und den Betrag des ersten Erben, darunter jede Erbengruppe mit Bruch und Eurobetrag, die Pflichtteile und bei Zugewinngemeinschaft den kleinen Pflichtteil des Ehegatten. Der aufklappbare Rechenweg nennt die Ordnung nach ${h.src('bgb1924', '§ 1924')} oder ${h.src('bgb1925', '§ 1925 BGB')} und den Ehegattenanteil nach ${h.src('bgb1931', '§ 1931')} und ${h.src('bgb1371', '§ 1371 BGB')}. Mit den Schaltflächen kopieren Sie das Ergebnis, teilen den Link mit Ihren Eingaben oder drucken die Seite.</p>
<h2>Drei Rechnungen mit ${h.eur(N)}</h2>
${h.table(['Eingaben', 'Ergebnis'], [
  ['verheiratet, Zugewinngemeinschaft, 2 Kinder', `Ehegatte ${br(sEhe.quoteJe)} = ${h.eur(sEhe.betragJe)}; je Kind ${br(sKind.quoteJe)} = ${h.eur(sKind.betragJe)}`],
  ['verheiratet, Gütertrennung, 1 Kind', gt.anteile.map((a) => `${a.wer === 'ehegatte' ? 'Ehegatte' : 'Kind'} ${br(a.quoteJe)} = ${h.eur(a.betragJe)}`).join('; ')],
  ['verheiratet, Zugewinngemeinschaft, 0 Kinder, 1 Elternteil, 1 Geschwister', `Ehegatte ${br(oEhe.quoteJe)} = ${h.eur(oEhe.betragJe)}; Mutter ${br(oMutter.quoteJe)} = ${h.eur(oMutter.betragJe)}; Bruder ${br(oBruder.quoteJe)} = ${h.eur(oBruder.betragJe)}`],
], 'Vom Erbrechner ermittelt')}
<p>Die dritte Zeile überrascht viele kinderlose Ehepaare: Neben dem Ehegatten erben Schwiegermutter und Schwager mit, und der Bruder tritt an die Stelle des verstorbenen Vaters. Wer das nicht will, braucht ein Testament. Der Pflichtteil der Mutter beträgt nach ${h.src('bgb2303', '§ 2303 BGB')} ${h.eur(oMutter.pflichtteilJe)}; der Bruder hat keinen.</p>
<h2>Grenzen des Rechners</h2>
<p>Er kennt keine Testamente und Erbverträge, keine Ausschlagung und keinen Erbverzicht. Halbgeschwister, die nur über einen Elternteil erben, rechnet er nicht getrennt, und die dritte Ordnung fasst er als eine Gruppe zusammen. Den Voraus des Ehegatten (Hausrat, Hochzeitsgeschenke) zieht er nicht vorab ab. Bei Gütergemeinschaft geben Sie als Nachlass nur den Anteil des Verstorbenen am Gesamtgut und sein Sondervermögen ein. Steuer berechnet der ${h.a('erbschaftsteuer-rechner', 'Erbschaftsteuer-Rechner')}, Pflichtteile mit Schenkungen der ${h.a('pflichtteilsrechner', 'Pflichtteilsrechner')}. Die Regeln dahinter erklärt die ${h.a('gesetzliche-erbfolge', 'gesetzliche Erbfolge')}. Das Ergebnis ist eine allgemeine Berechnung, keine Rechtsberatung und kein Ersatz für den Erbschein des Nachlassgerichts.</p>`,
  },
  en: {
    slug: 'inheritance-calculator',
    nav: 'Inheritance calculator',
    card: 'Work out German statutory succession: spouse, children, parents, siblings, with fractions, euros and compulsory shares.',
    title: 'Inheritance Calculator Germany 2026: Shares Without a Will',
    description: `Inheritance calculator for Germany 2026: statutory shares of spouse, children, parents and siblings under the BGB, amounts in euros, compulsory shares, every step.`,
    h1: 'Inheritance calculator: who gets what in Germany without a will',
    intro: 'Enter the estate, marital status, property regime and surviving relatives; the tool applies sections 1924 to 1931 and 1371 of the German Civil Code.',
    resume: `This calculator applies German statutory succession (gesetzliche Erbfolge) to your family. With the starting values, an estate of ${EN.eur(N)}, a married deceased in the default regime (Zugewinngemeinschaft) and two children, the spouse receives ${br(sEhe.quoteJe)}, which is ${EN.eur(sEhe.betragJe)}: ${br(P.erbrecht.ehegatte_neben_ordnung1)} under section 1931 BGB plus ${br(P.erbrecht.zugewinn_viertel)} for accrued gains under section 1371 BGB. Each child gets ${br(sKind.quoteJe)} or ${EN.eur(sKind.betragJe)}, and a child cut out by a will could still claim a compulsory share (Pflichtteil) of ${EN.eur(sKind.pflichtteilJe)}. Set the number of children to 0 and the tool asks about living parents, siblings and grandparents, moving on to the second or third order. The property regime shifts the fractions: under separation of property with one child, spouse and child take half each. Below the result, the step-by-step section names the sections applied, and the page link stores your inputs so you can share it with family abroad.`,
    faqs: [
      { q: 'What value should I enter as the estate in the inheritance calculator?', a: 'The net estate: everything the deceased owned on the day of death, such as property at market value, bank and securities accounts, vehicles and receivables, minus debts and funeral costs. If the deceased also had assets abroad, include them only if German succession law governs the whole estate, which depends on the last habitual residence and any choice of law. Joint accounts usually count half.' },
      { q: 'Does the inheritance calculator take a will into account?', a: 'No. It only applies statutory succession, the distribution without a will or inheritance contract. Where a will exists, it decides who inherits; the tool then shows what relatives would have received without it and which compulsory share children, a spouse or parents can claim if they were left out. Lifetime gifts are handled by the compulsory share calculator.' },
      { q: 'How do I enter a child who died before the parent but left children?', a: 'Count that child. Grandchildren step into the place of a parent who died first and share that parent’s portion (section 1924(3) BGB). The tool shows the portion per branch; divide it by the number of grandchildren in that branch. A child who died without descendants is left out of the count entirely.' },
    ],
    body: (h) => `<h2>The fields</h2>
<ul>
<li><strong>Value of the estate</strong>: assets after debts, in euros.</li>
<li><strong>Married?</strong>: yes or no. Registered civil partners choose yes.</li>
<li><strong>Matrimonial regime</strong> (only if married): community of accrued gains as the default, separation of property or community of property, as agreed in a marriage contract.</li>
<li><strong>Children</strong>: living children plus any child who died earlier leaving descendants.</li>
<li><strong>Living parents, siblings, grandparents?</strong>: shown only when you enter 0 children. Siblings means full siblings.</li>
</ul>
<p>The result shows the fraction and amount of the first heir at the top, then every group of heirs with fraction and euro amount, the compulsory shares and, in the default regime, the spouse’s small compulsory share. The expandable step-by-step list names the order applied under ${h.src('bgb1924', 'section 1924')} or ${h.src('bgb1925', 'section 1925 BGB')} and the spouse’s portion under ${h.src('bgb1931', 'section 1931')} and ${h.src('bgb1371', 'section 1371 BGB')}. Buttons copy the result, copy a link with your inputs, or print.</p>
<h2>Three runs with ${h.eur(N)}</h2>
${h.table(['Inputs', 'Result'], [
  ['married, default regime, 2 children', `spouse ${br(sEhe.quoteJe)} = ${h.eur(sEhe.betragJe)}; each child ${br(sKind.quoteJe)} = ${h.eur(sKind.betragJe)}`],
  ['married, separation of property, 1 child', gt.anteile.map((a) => `${a.wer === 'ehegatte' ? 'spouse' : 'child'} ${br(a.quoteJe)} = ${h.eur(a.betragJe)}`).join('; ')],
  ['married, default regime, 0 children, 1 parent, 1 sibling', `spouse ${br(oEhe.quoteJe)} = ${h.eur(oEhe.betragJe)}; mother ${br(oMutter.quoteJe)} = ${h.eur(oMutter.betragJe)}; brother ${br(oBruder.quoteJe)} = ${h.eur(oBruder.betragJe)}`],
], 'Computed by the inheritance calculator')}
<p>The third row surprises many childless couples: the mother-in-law and brother-in-law inherit alongside the spouse, the brother taking the place of the late father. Under ${h.src('bgb2303', 'section 2303 BGB')} the mother’s compulsory share would be ${h.eur(oMutter.pflichtteilJe)}; the brother has none.</p>
<h2>Limits</h2>
<p>The tool ignores wills, inheritance contracts, disclaimers and waivers. It does not separate half-siblings, groups the third order together and does not deduct the spouse’s household items (Voraus). Under community of property, enter only the deceased’s half of the joint assets plus their separate property. It assumes German succession law applies; for expats that is often, but not always, the case. Tax is on the ${h.a('erbschaftsteuer-rechner', 'inheritance tax calculator')}, gifts on the ${h.a('pflichtteilsrechner', 'compulsory share calculator')}, and the rules behind the figures under ${h.a('gesetzliche-erbfolge', 'statutory succession')}. The result is a general calculation, not legal advice, and no substitute for a certificate of inheritance (Erbschein) from the probate court.</p>`,
  },
});
