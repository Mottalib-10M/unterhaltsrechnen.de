import { defineGuide } from '../../lib/guide-types';
import { scheidungskosten } from '../../lib/engine/kosten';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor: Startwerte des Rechners (2.800 € und 1.900 €, zwei Anrechte) und zwei Varianten. */
const basis = scheidungskosten({ netto1: 2800, netto2: 1900, anrechte: 2, anwaelte: 1 });
const basisZwei = scheidungskosten({ netto1: 2800, netto2: 1900, anrechte: 2, anwaelte: 2 });
const sorge = scheidungskosten({ netto1: 2800, netto2: 1900, anrechte: 2, anwaelte: 1, kindschaftssachen: 1 });
const einigung = scheidungskosten({ netto1: 2800, netto2: 1900, anrechte: 2, anwaelte: 2, folgesachenWert: 6000, einigungWert: 6000 });
const F = P.famgkg, R = P.rvg;

export default defineGuide({
  id: 'scheidungskosten-rechner',
  group: 'scheidung',
  order: 5,
  tool: 'scheidung',
  related: ['scheidungskosten', 'verfahrenswert', 'gerichtskosten-scheidung', 'anwaltskosten-scheidung', 'prozesskostenhilfe-rechner'],
  sources: ['famgkg43', 'famgkg44', 'famgkg50', 'famgkgKv', 'rvgVv', 'famfg150'],
  de: {
    slug: 'scheidungskosten-rechner',
    nav: 'Scheidungskosten-Rechner',
    card: 'Gericht und Anwalt aus dem Einkommen beider Ehegatten, mit Folgesachen, Einigung und Kostenteilung.',
    title: 'Scheidungskosten-Rechner 2026: Gericht, Anwalt, Folgesachen',
    description: `Scheidungskosten-Rechner 2026: Verfahrenswert nach FamGKG, Gerichtsgebühr ${DE.num(F.kv1110_satz, 1)}, Anwalt nach RVG mit USt, ein oder zwei Anwälte, Folgesachen und Kostenteilung.`,
    h1: 'Scheidungskosten berechnen',
    intro: 'Zwei Nettoeinkommen und die Zahl der Rentenanrechte genügen; Folgesachen, Kinder und Vermögen lassen sich zuschalten.',
    resume: `Mit den Startwerten des Rechners, ${DE.eur(2800)} und ${DE.eur(1900)} netto im Monat und zwei Anrechten im Versorgungsausgleich, kostet die Scheidung 2026 ${DE.eur(basis.gesamt, 2)} mit einem Anwalt und ${DE.eur(basisZwei.gesamt, 2)} mit zwei. Der Rechner bildet zuerst den Verfahrenswert: ${DE.num(F.ehe_monate_netto)} Monatsnetto beider Ehegatten, mindestens ${DE.eur(F.ehe_mindestwert)}, ergibt ${DE.eur(basis.eheWert)} für die Ehesache (§ 43 FamGKG), dazu ${DE.eur(basis.vaWert)} für den Versorgungsausgleich (§ 50 FamGKG), zusammen ${DE.eur(basis.gesamtWert)}. Daraus folgen ${DE.num(F.kv1110_satz, 1)} Gerichtsgebühren von zusammen ${DE.eur(basis.gerichtskosten, 2)} und je Anwalt ${DE.eur(basis.anwalt.brutto, 2)} mit Verfahrensgebühr ${DE.num(R.vv3100, 1)}, Terminsgebühr ${DE.num(R.vv3104, 1)}, Auslagenpauschale und ${DE.pct(R.ust)} Umsatzsteuer. Weil die Kosten bei einer Scheidung gegeneinander aufgehoben werden (§ 150 FamFG), zeigt der Rechner auch, was jeder Ehegatte selbst trägt: mit einem Anwalt ${DE.eur(basis.antragsteller, 2)} der Antragsteller und ${DE.eur(basis.antragsgegner, 2)} der andere.`,
    faqs: [
      { q: 'Wie viele Anrechte trage ich im Scheidungskosten-Rechner ein?', a: `Jedes Versorgungskonto beider Ehegatten zählt einzeln: das Konto bei der Deutschen Rentenversicherung, eine Betriebsrente, ein Riester- oder Rürup-Vertrag, eine Beamtenversorgung. Zwei Ehegatten mit gesetzlicher Rente und je einer Betriebsrente haben vier Anrechte. Jedes Anrecht erhöht den Wert um ${DE.pct(F.va_prozent_je_anrecht)} des Dreimonatsnettos. Ist der Versorgungsausgleich ausgeschlossen, etwa durch Ehevertrag, tragen Sie 0 ein.` },
      { q: 'Warum ändert die Sorgerechtsoption meine Scheidungskosten manchmal nicht?', a: `Die Option erhöht den Verfahrenswert um ${DE.pct(F.kindschaft_zuschlag)} des Ehewerts, höchstens ${DE.eur(F.kindschaft_zuschlag_max)}. Die Gebührentabellen steigen aber in Stufen: Bleibt der neue Gesamtwert in derselben Wertstufe, ändert sich die Gebühr nicht. Mit den Startwerten steigt der Wert auf ${DE.eur(sorge.gesamtWert)}, die Gesamtkosten liegen dann bei ${DE.eur(sorge.gesamt, 2)} statt ${DE.eur(basis.gesamt, 2)}.` },
      { q: 'Was bedeutet das Feld „Davon durch Einigung erledigt“?', a: `Einigen sich die Ehegatten über eine Folgesache, die schon beim Gericht anhängig ist, etwa über Unterhalt, verdient jeder beteiligte Anwalt zusätzlich eine Einigungsgebühr von ${DE.num(R.vv1003, 1)} aus dem Wert dieser Einigung. Tragen Sie dort den Teil des Folgesachenwerts ein, über den Sie sich geeinigt haben. Die Gerichtskosten ändert das Feld nicht.` },
      { q: 'Rechnet der Scheidungskosten-Rechner Verfahrenskostenhilfe mit ein?', a: 'Nein. Er zeigt die vollen Kosten nach den Gebührentabellen. Ob der Staat sie ganz oder gegen Raten übernimmt, hängt von Ihrem Einkommen nach Abzug der Freibeträge ab und steht im eigenen Prozesskostenhilfe-Rechner. Mit Verfahrenskostenhilfe zahlt die Staatskasse Ihren Anwalt nach eigenen, niedrigeren Sätzen; diese Sätze kennt dieser Rechner nicht.' },
    ],
    body: (h) => `<h2>Die Felder des Rechners</h2>
<ul>
<li><strong>Netto Ehegatte 1 und 2:</strong> das monatliche Nettoeinkommen jedes Ehegatten. Der Rechner nimmt es mal ${h.num(h.P.famgkg.ehe_monate_netto)}, wie ${h.src('famgkg43', '§ 43 Abs. 2 FamGKG')} es für die Einkommensverhältnisse vorsieht.</li>
<li><strong>Anrechte im Versorgungsausgleich:</strong> die Zahl aller Rentenkonten beider Ehegatten, die geteilt werden; 0 heißt kein Ausgleich. Jedes Anrecht zählt ${h.pct(h.P.famgkg.va_prozent_je_anrecht, 0)} des Dreimonatsnettos, insgesamt mindestens ${h.eur(h.P.famgkg.va_mindestwert)} (${h.src('famgkg50', '§ 50 FamGKG')}).</li>
<li><strong>Anwälte:</strong> einer, wenn nur der Antragsteller vertreten ist, zwei, wenn beide Ehegatten einen eigenen Anwalt nehmen.</li>
</ul>
<p>Im aufklappbaren Bereich „Folgesachen, Kinder, Vermögen“ stehen fünf weitere Felder:</p>
<ul>
<li><strong>Sorge/Umgang im Verbund:</strong> Ja erhöht den Wert um ${h.pct(h.P.famgkg.kindschaft_zuschlag, 0)} des Ehewerts, höchstens ${h.eur(h.P.famgkg.kindschaft_zuschlag_max)} (${h.src('famgkg44', '§ 44 FamGKG')}).</li>
<li><strong>Abzug je Monat:</strong> Manche Gerichte ziehen für unterhaltsberechtigte Kinder einen Betrag vom Monatsnetto ab. Höhe und Handhabung sind Gerichtspraxis, das Feld ist Ihre Annahme; der Rechner zieht es ebenfalls ${h.num(h.P.famgkg.ehe_monate_netto)}-mal ab.</li>
<li><strong>Zuschlag für Vermögen:</strong> ein Betrag, um den das Gericht den Ehewert wegen Vermögens erhöht. Auch das ist Ermessen des Gerichts.</li>
<li><strong>Wert weiterer Folgesachen:</strong> etwa nachehelicher Unterhalt oder Zugewinnausgleich, mit dem Wert, den diese Sache hat.</li>
<li><strong>Davon durch Einigung erledigt:</strong> löst beim Anwalt die Einigungsgebühr aus.</li>
</ul>
<h2>Was das Ergebnis zeigt</h2>
<p>Oben stehen die Gesamtkosten und der Verfahrenswert, darunter die Gerichtskosten (Gebührensatz ${h.num(h.P.famgkg.kv1110_satz, 1)} nach Nummer 1110 des ${h.src('famgkgKv', 'Kostenverzeichnisses')}), die Kosten eines Anwalts mit Umsatzsteuer und die Aufteilung zwischen Antragsteller und Antragsgegner nach ${h.src('famfg150', '§ 150 Abs. 1 FamFG')}. Der Rechenweg nennt jede Zwischenzahl mit ihrer Vorschrift. Mit „Link teilen“ geben Sie das Ergebnis samt allen Eingaben weiter, mit „Drucken“ legen Sie es zu Ihren Unterlagen.</p>
<h2>Drei Varianten mit denselben Einkommen</h2>
${h.table(['Variante', 'Verfahrenswert', 'Gericht', 'Anwalt je', 'Gesamt'], [
  ['Startwerte, ein Anwalt', h.eur(basis.gesamtWert), h.eur(basis.gerichtskosten, 2), h.eur(basis.anwalt.brutto, 2), h.eur(basis.gesamt, 2)],
  ['plus Sorgerecht im Verbund', h.eur(sorge.gesamtWert), h.eur(sorge.gerichtskosten, 2), h.eur(sorge.anwalt.brutto, 2), h.eur(sorge.gesamt, 2)],
  [`zwei Anwälte, Unterhalt ${h.eur(6000)} geeinigt`, h.eur(einigung.gesamtWert), h.eur(einigung.gerichtskosten, 2), h.eur(einigung.anwalt.brutto, 2), h.eur(einigung.gesamt, 2)],
], 'Netto 2.800 € und 1.900 €, zwei Anrechte; vom Rechner ermittelt', ['l', 'r', 'r', 'r', 'r'])}
<p>In der dritten Zeile verdient jeder Anwalt zusätzlich ${h.eur(einigung.anwalt.einigung, 2)} Einigungsgebühr (${h.src('rvgVv', 'VV 1003 RVG')}). Die Variante zeigt, dass eine Folgesache im Verbund mehr kostet als die Scheidung allein, aber weniger als ein getrenntes Verfahren mit eigener Gebührenrechnung.</p>
<h2>Grenzen der Berechnung</h2>
<p>Der Rechner kennt nur die gesetzlichen Gebühren. Vereinbart ein Anwalt ein Honorar nach Stunden, gilt diese Vereinbarung. Gutachten, Dolmetscher und Übersetzungen sind nicht enthalten, ebenso wenig die abweichende Kostenverteilung, die ein Gericht im Einzelfall anordnen kann. Den Verfahrenswert setzt das Familiengericht fest. Was die Zahlen bedeuten, erklärt die Seite zu den ${h.a('scheidungskosten', 'Scheidungskosten')}; ob der Staat einspringt, zeigt der ${h.a('prozesskostenhilfe-rechner', 'Prozesskostenhilfe-Rechner')}. Die Berechnung ist eine allgemeine Kostenschätzung nach FamGKG und RVG, keine Rechtsberatung.</p>`,
  },
  en: {
    slug: 'divorce-cost-calculator',
    nav: 'Divorce cost calculator',
    card: 'Court and lawyer fees from both spouses’ incomes, with ancillary matters, settlement and cost sharing.',
    title: 'Divorce Cost Calculator Germany 2026: Court and Lawyer',
    description: `Divorce cost calculator for Germany 2026: value under the FamGKG, ${EN.num(F.kv1110_satz, 1)} court fee, RVG lawyer fees with VAT, one or two lawyers, ancillary matters, who pays.`,
    h1: 'Calculate the cost of a German divorce',
    intro: 'Two net incomes and the number of pension entitlements are enough; children, assets and other disputes can be added.',
    resume: `With the calculator’s starting values, ${EN.eur(2800)} and ${EN.eur(1900)} net a month and two pension entitlements to split, a German divorce costs ${EN.eur(basis.gesamt, 2)} in 2026 with one lawyer and ${EN.eur(basisZwei.gesamt, 2)} with two. The tool first builds the value of the proceedings (Verfahrenswert): ${EN.num(F.ehe_monate_netto)} months of both net incomes, at least ${EN.eur(F.ehe_mindestwert)}, gives ${EN.eur(basis.eheWert)} for the divorce itself (section 43 FamGKG), plus ${EN.eur(basis.vaWert)} for pension splitting (section 50 FamGKG), ${EN.eur(basis.gesamtWert)} in total. From that follow ${EN.num(F.kv1110_satz, 1)} court fees, ${EN.eur(basis.gerichtskosten, 2)}, and ${EN.eur(basis.anwalt.brutto, 2)} per lawyer for a ${EN.num(R.vv3100, 1)} procedure fee, a ${EN.num(R.vv3104, 1)} hearing fee, flat expenses and ${EN.pct(R.ust)} VAT. Because costs are set off once the divorce is granted (section 150 FamFG), the tool also shows what each spouse bears: with one lawyer ${EN.eur(basis.antragsteller, 2)} for the petitioner and ${EN.eur(basis.antragsgegner, 2)} for the other spouse.`,
    faqs: [
      { q: 'How do I count pension entitlements if one of us worked abroad?', a: `Count every pension account the court has to deal with: a German state pension account, a German company pension, a Riester or Rürup contract, a civil-service pension. Each adds ${EN.pct(F.va_prozent_je_anrecht)} of the three-month income. Entitlements with a foreign pension fund are often handled differently, and how courts value them varies, so the result is an estimate; the court’s own decision on the value is what counts.` },
      { q: 'Why does ticking custody sometimes leave the divorce cost unchanged?', a: `It raises the value by ${EN.pct(F.kindschaft_zuschlag)} of the divorce value, at most ${EN.eur(F.kindschaft_zuschlag_max)}. The fee tables rise in steps, though, so if the new total stays within the same band, the fee stays the same. With the starting values the value moves to ${EN.eur(sorge.gesamtWert)} and the total becomes ${EN.eur(sorge.gesamt, 2)} instead of ${EN.eur(basis.gesamt, 2)}.` },
      { q: 'Which income do I enter if my salary is paid in another currency?', a: 'Enter your monthly net pay converted into euros, after the tax and social contributions you actually pay. The court looks at the net income of both spouses over three months, wherever it is earned. If income varies, an average is a reasonable assumption for an estimate. The court sets the final value from the information and documents both of you provide.' },
      { q: 'Does the calculator take legal aid into account?', a: 'No. It shows the full statutory fees. Whether the state covers them, fully or against instalments, depends on your income after allowances and is shown by the separate legal aid calculator. Under legal aid (Verfahrenskostenhilfe) the state pays your lawyer at its own reduced rates, which this tool does not model.' },
    ],
    body: (h) => `<h2>The input fields</h2>
<ul>
<li><strong>Net income spouse 1 and 2:</strong> each spouse’s monthly take-home pay. The tool multiplies the sum by ${h.num(h.P.famgkg.ehe_monate_netto)}, as ${h.src('famgkg43', 'section 43(2) FamGKG')} prescribes.</li>
<li><strong>Pension entitlements to split:</strong> the number of pension accounts of both spouses that the court divides (Versorgungsausgleich); 0 means none. Each adds ${h.pct(h.P.famgkg.va_prozent_je_anrecht, 0)} of the three-month income, with a minimum of ${h.eur(h.P.famgkg.va_mindestwert)} overall (${h.src('famgkg50', 'section 50 FamGKG')}).</li>
<li><strong>Lawyers:</strong> one if only the petitioner is represented, two if each spouse hires a lawyer.</li>
</ul>
<p>The collapsible section “Ancillary matters, children, assets” holds five more fields:</p>
<ul>
<li><strong>Custody in the same case:</strong> adds ${h.pct(h.P.famgkg.kindschaft_zuschlag, 0)} of the divorce value, at most ${h.eur(h.P.famgkg.kindschaft_zuschlag_max)} (${h.src('famgkg44', 'section 44 FamGKG')}).</li>
<li><strong>Monthly deduction:</strong> some courts deduct an amount per dependent child from monthly income. This is court practice and your assumption; it is deducted ${h.num(h.P.famgkg.ehe_monate_netto)} times.</li>
<li><strong>Surcharge for assets:</strong> an amount by which the court raises the value because of the couple’s wealth, again at its discretion.</li>
<li><strong>Value of other ancillary matters:</strong> for example post-divorce maintenance or the division of accrued gains (Zugewinnausgleich).</li>
<li><strong>Of which settled by agreement:</strong> triggers the lawyers’ settlement fee.</li>
</ul>
<h2>Reading the result</h2>
<p>The top line shows the total and the value. Below come the court fees (rate ${h.num(h.P.famgkg.kv1110_satz, 1)} under item 1110 of the ${h.src('famgkgKv', 'fee schedule')}), one lawyer’s bill including VAT, and the split between petitioner and respondent under ${h.src('famfg150', 'section 150(1) FamFG')}. The step-by-step section names the rule behind each figure, and “Share link” copies an address that keeps all your inputs.</p>
<h2>Three variants on the same incomes</h2>
${h.table(['Variant', 'Value', 'Court', 'Each lawyer', 'Total'], [
  ['starting values, one lawyer', h.eur(basis.gesamtWert), h.eur(basis.gerichtskosten, 2), h.eur(basis.anwalt.brutto, 2), h.eur(basis.gesamt, 2)],
  ['plus custody in the same case', h.eur(sorge.gesamtWert), h.eur(sorge.gerichtskosten, 2), h.eur(sorge.anwalt.brutto, 2), h.eur(sorge.gesamt, 2)],
  [`two lawyers, ${h.eur(6000)} maintenance settled`, h.eur(einigung.gesamtWert), h.eur(einigung.gerichtskosten, 2), h.eur(einigung.anwalt.brutto, 2), h.eur(einigung.gesamt, 2)],
], 'Net incomes €2,800 and €1,900, two entitlements; computed by the tool', ['l', 'r', 'r', 'r', 'r'])}
<p>In the third line each lawyer also earns a ${h.eur(einigung.anwalt.einigung, 2)} settlement fee (${h.src('rvgVv', 'item 1003 of the RVG schedule')}). Deciding a dispute inside the divorce costs more than the divorce alone, but less than a separate case with its own fee bill.</p>
<h2>Limits</h2>
<p>The tool knows the statutory fees only. If your lawyer agrees an hourly rate, that agreement governs. Expert reports, interpreters and translations of foreign documents are not included, nor is a different cost split the court may order. The family court (Familiengericht) fixes the value. The ${h.a('scheidungskosten', 'divorce costs')} guide explains the figures, and the ${h.a('prozesskostenhilfe-rechner', 'legal aid calculator')} shows whether the state steps in. The result is a general estimate under the FamGKG and RVG, not legal advice.</p>`,
  },
});
