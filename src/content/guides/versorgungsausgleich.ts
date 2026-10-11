import { defineGuide } from '../../lib/guide-types';
import { versorgungsausgleich } from '../../lib/engine/vermoegen';
import { scheidungskosten } from '../../lib/engine/kosten';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor, nie von Hand. */
/** Gesetzliche Renten beider Ehegatten, deutlicher Unterschied. */
const klar = versorgungsausgleich({ renteA: 380, renteB: 140, kapitalA: 0, kapitalB: 0 });
/** Kleine Rentenanrechte, fast gleich: Differenz unter der Geringfügigkeitsgrenze. */
const klein = versorgungsausgleich({ renteA: 92, renteB: 34, kapitalA: 0, kapitalB: 0 });
/** Ein einzelner Riester-Vertrag mit kleinem Kapitalwert. */
const riester = versorgungsausgleich({ renteA: 0, renteB: 0, kapitalA: 6000, kapitalB: 0 });
/** Eine Betriebsrente mit größerem Kapitalwert. */
const bav = versorgungsausgleich({ renteA: 0, renteB: 0, kapitalA: 18000, kapitalB: 0 });
/** Verfahrenswert des Versorgungsausgleichs (§ 50 FamGKG). */
const wertViele = scheidungskosten({ netto1: 3400, netto2: 2100, anrechte: 4, anwaelte: 1 });
const wertWenig = scheidungskosten({ netto1: 1300, netto2: 900, anrechte: 1, anwaelte: 1 });
const V = P.versorgungsausgleich;
const F = P.famgkg;

export default defineGuide({
  id: 'versorgungsausgleich',
  group: 'scheidung',
  order: 68,
  mini: 'bagatelle',
  related: ['versorgungsausgleich-rechner', 'zugewinnausgleich', 'scheidungskosten', 'verfahrenswert', 'gerichtskosten-scheidung', 'ehegattenunterhalt'],
  sources: ['versausglg1', 'versausglg18', 'svbezgrv2026', 'famgkg50'],
  de: {
    slug: 'versorgungsausgleich',
    nav: 'Versorgungsausgleich',
    card: 'Halbteilung der Rentenanrechte aus der Ehezeit, Bagatellgrenze 2026, kurze Ehe, Verzicht und Kosten.',
    title: 'Versorgungsausgleich 2026: Halbteilung und Bagatellgrenze',
    description: `Versorgungsausgleich 2026: Ehezeitanteile werden halbiert, geringfügig bis ${DE.eur(V.bezugsgroesse_monat * V.bagatelle_rente_anteil, 2)} Rente oder ${DE.eur(V.bezugsgroesse_monat * V.bagatelle_kapital_anteil)} Kapitalwert. Mit vier Beispielen und den Kosten.`,
    h1: 'Versorgungsausgleich: wie Renten bei der Scheidung geteilt werden',
    intro: 'Jede Altersvorsorge, die in der Ehe entstanden ist, wird halbiert. Kleine Unterschiede bleiben ungeteilt.',
    resume: `Im Versorgungsausgleich gibt jeder Ehegatte die Hälfte der Rentenanrechte ab, die er während der Ehe erworben hat (§ 1 VersAusglG). Das betrifft die gesetzliche Rente, Beamtenpensionen, Versorgungswerke, Betriebsrenten und private Rentenverträge. Hat ein Ehegatte in der Ehezeit ${DE.eur(380)} Monatsrente erworben und der andere ${DE.eur(140)}, betragen die Ausgleichswerte ${DE.eur(klar.ausgleichRenteA)} und ${DE.eur(klar.ausgleichRenteB)}; per Saldo wandern ${DE.eur(klar.differenzRente)} Monatsrente zum Ehegatten mit weniger Anrechten. Geteilt wird in der Regel intern beim selben Versorgungsträger. Geringe Werte soll das Familiengericht nicht ausgleichen (§ 18 VersAusglG): 2026 liegt die Grenze bei ${DE.eur(klar.grenzeRente, 2)} Monatsrente oder ${DE.eur(klar.grenzeKapital)} Kapitalwert, das sind ${DE.pct(V.bagatelle_rente_anteil, 0)} und ${DE.pct(V.bagatelle_kapital_anteil, 0)} der monatlichen Bezugsgröße von ${DE.eur(V.bezugsgroesse_monat)}. Nach einer Ehe von höchstens drei Jahren findet der Ausgleich nur auf Antrag statt. Mit einem notariellen Ehevertrag können Ehegatten ihn ausschließen. Im Scheidungsverfahren erhöht jedes Anrecht den Verfahrenswert um ${DE.pct(F.va_prozent_je_anrecht, 0)} des dreimonatigen Nettoeinkommens beider Ehegatten.`,
    faqs: [
      { q: 'Welche Renten fallen in den Versorgungsausgleich?', a: 'Alle Anrechte, die durch Arbeit oder Vermögen geschaffen wurden, der Absicherung im Alter oder bei Invalidität dienen und auf eine Rente gerichtet sind (§ 2 VersAusglG): gesetzliche Rente, Beamtenversorgung, berufsständische Versorgungswerke, private Rentenversicherungen und Riester-Verträge. Betriebsrenten werden unabhängig von der Auszahlungsform geteilt. Eine reine Kapitallebensversicherung gehört dagegen in den Zugewinnausgleich.' },
      { q: 'Wann beginnt und endet die Ehezeit im Versorgungsausgleich?', a: 'Sie beginnt am ersten Tag des Monats, in dem geheiratet wurde, und endet am letzten Tag des Monats vor der Zustellung des Scheidungsantrags (§ 3 Abs. 1 VersAusglG). Die Trennung ändert daran nichts: Auch Anrechte aus dem Trennungsjahr werden geteilt. Wer im Mai heiratet, dessen Ehezeit beginnt also am ersten Mai.' },
      { q: 'Gibt es nach einer kurzen Ehe einen Versorgungsausgleich?', a: 'Bei einer Ehezeit von bis zu drei Jahren nur, wenn ein Ehegatte ihn beantragt (§ 3 Abs. 3 VersAusglG). Ohne Antrag bleibt jeder bei seinen eigenen Anrechten. Bei längeren Ehen prüft das Familiengericht den Ausgleich ohne Antrag im Scheidungsverfahren und holt dafür Auskünfte bei allen Versorgungsträgern ein, die die Ehegatten in ihren Fragebögen angeben.' },
      { q: 'Kann man auf den Versorgungsausgleich verzichten?', a: 'Ja. Die Ehegatten können ihn ganz oder teilweise ausschließen, mit dem Zugewinn verrechnen oder auf die Zeit nach der Scheidung verschieben (§ 6 VersAusglG). Vor Rechtskraft der Entscheidung muss die Vereinbarung notariell beurkundet oder vor Gericht protokolliert werden (§ 7 VersAusglG). Das Familiengericht ist an sie gebunden, prüft aber, ob sie einen Ehegatten unangemessen benachteiligt.' },
      { q: 'Was kostet der Versorgungsausgleich im Scheidungsverfahren?', a: `Er erhöht den Verfahrenswert und damit Gerichts- und Anwaltsgebühren. Je Anrecht kommen ${DE.pct(F.va_prozent_je_anrecht, 0)} des in drei Monaten erzielten Nettoeinkommens beider Ehegatten hinzu, insgesamt mindestens ${DE.eur(F.va_mindestwert)} (§ 50 FamGKG). Bei ${DE.eur(3400)} und ${DE.eur(2100)} Netto und vier Anrechten sind das ${DE.eur(wertViele.vaWert)}.` },
      { q: 'Was bedeutet die Bagatellgrenze im Versorgungsausgleich 2026?', a: `Liegt die Differenz zweier gleichartiger Anrechte oder der Ausgleichswert eines einzelnen Anrechts unter der Grenze, soll das Gericht nicht teilen (§ 18 VersAusglG). 2026 sind das ${DE.eur(klar.grenzeRente, 2)} bei einer Monatsrente und ${DE.eur(klar.grenzeKapital)} bei einem Kapitalwert. Das Wort soll lässt dem Gericht Spielraum: Bei mehreren kleinen Anrechten oder einseitigen Verhältnissen wird oft trotzdem geteilt.` },
    ],
    body: (h) => `<h2>Halbteilung: der Grundsatz</h2>
<p>Während der Ehe sorgen oft nicht beide gleich für das Alter vor. Wer Kinder betreut oder in Teilzeit arbeitet, sammelt weniger Rentenpunkte. Der Versorgungsausgleich gleicht das bei der Scheidung aus: Die in der Ehezeit erworbenen Anteile aller Anrechte werden jeweils zur Hälfte geteilt (${h.src('versausglg1', '§ 1 VersAusglG')}). Die Hälfte heißt Ausgleichswert.</p>
<p>Geteilt wird jedes Anrecht für sich, in beide Richtungen. Hat die Frau eine gesetzliche Rente und der Mann eine gesetzliche Rente plus Betriebsrente, gibt jeder die Hälfte seiner Ehezeitanteile ab. Bei derselben Rentenversicherung werden die gegenseitigen Ansprüche verrechnet, sodass nur die Differenz tatsächlich übertragen wird.</p>
<h2>Ehezeitanteil und interne Teilung</h2>
<p>Den Ehezeitanteil berechnet nicht das Gericht, sondern der Versorgungsträger: die Deutsche Rentenversicherung in Entgeltpunkten, eine Pensionskasse oder ein Versicherer als Rentenbetrag oder Kapitalwert. Maßgeblich ist das Ende der Ehezeit, also der letzte Tag des Monats vor Zustellung des Scheidungsantrags.</p>
<p>Normalfall ist die interne Teilung: Der berechtigte Ehegatte erhält beim selben Träger ein eigenes Anrecht in Höhe des Ausgleichswerts. Bei kleineren Betriebsrenten kann der Träger eine externe Teilung verlangen; dann fließt der Ausgleichswert als Kapital zu einer anderen Versorgung. Das übertragene Anrecht gehört danach dem Berechtigten selbst.</p>
<h2>Vier Beispiele</h2>
${h.table(['Fall', 'Ausgleichswerte', 'Differenz', 'Ergebnis'], [
  [`gesetzliche Renten ${h.eur(380)} und ${h.eur(140)}`, `${h.eur(klar.ausgleichRenteA, 2)} / ${h.eur(klar.ausgleichRenteB, 2)}`, h.eur(klar.differenzRente, 2), klar.geringRente ? 'geringfügig' : 'wird geteilt'],
  [`kleine Renten ${h.eur(92)} und ${h.eur(34)}`, `${h.eur(klein.ausgleichRenteA, 2)} / ${h.eur(klein.ausgleichRenteB, 2)}`, h.eur(klein.differenzRente, 2), klein.geringRente ? 'geringfügig, soll entfallen' : 'wird geteilt'],
  [`ein Riester-Vertrag, Kapitalwert ${h.eur(6000)}`, h.eur(riester.ausgleichKapitalA), h.eur(riester.differenzKapital), riester.geringKapital ? 'geringfügig, soll entfallen' : 'wird geteilt'],
  [`eine Betriebsrente, Kapitalwert ${h.eur(18000)}`, h.eur(bav.ausgleichKapitalA), h.eur(bav.differenzKapital), bav.geringKapital ? 'geringfügig' : 'wird geteilt'],
], `Berechnet mit dem Versorgungsausgleich-Rechner, Grenzen 2026: ${h.eur(klar.grenzeRente, 2)} Rente, ${h.eur(klar.grenzeKapital)} Kapital`)}
<h2>Geringfügigkeit: wann nicht geteilt wird</h2>
<p>Kleinstbeträge zu übertragen, kostet die Versorgungsträger mehr, als es den Ehegatten nützt. Deshalb soll das Familiengericht nicht ausgleichen, wenn die Differenz der Ausgleichswerte gleichartiger Anrechte gering ist oder ein einzelnes Anrecht nur einen kleinen Ausgleichswert hat (${h.src('versausglg18', '§ 18 VersAusglG')}).</p>
<p>Gering heißt: höchstens ${h.pct(h.P.versorgungsausgleich.bagatelle_rente_anteil, 0)} der monatlichen Bezugsgröße bei einem Rentenbetrag, höchstens ${h.pct(h.P.versorgungsausgleich.bagatelle_kapital_anteil, 0)} bei einem Kapitalwert. Die ${h.src('svbezgrv2026', 'Bezugsgröße 2026')} beträgt ${h.eur(h.P.versorgungsausgleich.bezugsgroesse_monat)}, die Grenzen also ${h.eur(klar.grenzeRente, 2)} und ${h.eur(klar.grenzeKapital)}. Maßgeblich ist der Wert am Ende der Ehezeit, für eine 2026 endende Ehezeit also diese Zahlen. Viele Gerichte gleichen trotzdem aus, wenn sich mehrere kleine Anrechte summieren.</p>
<h2>Anrechte im Ausland und nicht ausgleichsreife Anrechte</h2>
<p>Einbezogen werden Anrechte im In- und Ausland (§ 2 Abs. 1 VersAusglG). Ein deutsches Familiengericht kann aber nicht in eine ausländische Rentenkasse eingreifen. Solche Anrechte gelten als nicht ausgleichsreif und bleiben bei der Scheidung ungeteilt (§ 19 VersAusglG), ebenso noch verfallbare Betriebsrenten. Sie werden später über Ausgleichsansprüche nach der Scheidung abgewickelt, etwa über eine schuldrechtliche Ausgleichsrente, sobald der Pflichtige seine Rente bezieht (§ 20 VersAusglG).</p>
<p>Hat ein Ehegatte erhebliche Anrechte im Ausland, kann der Ausgleich auch der übrigen Anrechte unterbleiben, soweit er für den anderen unbillig wäre. Ein Beispiel: Der Mann hat zehn Jahre in eine ausländische Rentenkasse eingezahlt, die Frau nur in die Deutsche Rentenversicherung. Würde allein ihre deutsche Rente geteilt, gäbe sie ab, ohne sofort etwas zurückzubekommen.</p>
<p>Abzugrenzen ist der Versorgungsausgleich vom Güterrecht: Was hier geteilt wird, fließt nicht zusätzlich in den Zugewinn ein (§ 2 Abs. 4 VersAusglG). Eine Kapitallebensversicherung ohne Rentenbezug oder ein Wertpapierdepot gehört dagegen ins Endvermögen.</p>
<h2>Kurze Ehe, Verzicht, Härtefälle</h2>
<ul>
<li><strong>Kurze Ehe</strong>: Bei einer Ehezeit von bis zu drei Jahren wird nur auf Antrag geteilt (§ 3 Abs. 3 VersAusglG).</li>
<li><strong>Vereinbarung</strong>: Die Ehegatten können den Ausgleich ausschließen, beschränken oder mit dem ${h.a('zugewinnausgleich', 'Zugewinnausgleich')} verrechnen (§ 6 VersAusglG). Vor Rechtskraft der Entscheidung ist notarielle Form nötig, im Ehevertrag ohnehin.</li>
<li><strong>Grobe Unbilligkeit</strong>: Ausnahmsweise findet kein Ausgleich statt, soweit er grob unbillig wäre (§ 27 VersAusglG). Das setzt voraus, dass die gesamten Umstände des Einzelfalls ein Abweichen von der Halbteilung rechtfertigen; die Gerichte legen das eng aus.</li>
</ul>
<h2>Kosten im Scheidungsverfahren</h2>
<p>Der Versorgungsausgleich erhöht den ${h.a('verfahrenswert', 'Verfahrenswert')}: je Anrecht ${h.pct(h.P.famgkg.va_prozent_je_anrecht, 0)} des in ${h.num(h.P.famgkg.ehe_monate_netto)} Monaten erzielten Nettoeinkommens beider Ehegatten, mindestens ${h.eur(h.P.famgkg.va_mindestwert)} (${h.src('famgkg50', '§ 50 FamGKG')}).</p>
${h.table(['Netto beider Ehegatten', 'Anrechte', 'Wert des Versorgungsausgleichs'], [
  [`${h.eur(3400)} + ${h.eur(2100)}`, 4, h.eur(wertViele.vaWert)],
  [`${h.eur(1300)} + ${h.eur(900)}`, 1, h.eur(wertWenig.vaWert)],
], 'Vom Scheidungskosten-Rechner ermittelt')}
<p>Im zweiten Fall greift der Mindestwert. Was das an ${h.a('gerichtskosten-scheidung', 'Gerichtskosten')} bedeutet, hängt vom Gesamtwert der Scheidung ab.</p>
<p>Diese Seite ist eine allgemeine Information zum Versorgungsausgleich und keine Rechtsberatung. Die verbindlichen Ausgleichswerte nennen die Versorgungsträger im Verfahren; mit dem ${h.a('versorgungsausgleich-rechner', 'Versorgungsausgleich-Rechner')} prüfen Sie vorab, ob die Bagatellgrenze erreicht ist.</p>`,
  },
  en: {
    slug: 'pension-splitting',
    nav: 'Pension splitting',
    card: 'Half of every pension earned during the marriage, the 2026 de minimis limits, short marriages and opting out.',
    title: 'Versorgungsausgleich 2026: Pension Splitting in Germany',
    description: `Pension splitting on divorce in Germany 2026: half of every pension built up in the marriage, no split below ${EN.eur(V.bezugsgroesse_monat * V.bagatelle_rente_anteil, 2)} a month. What happens to foreign pensions.`,
    h1: 'Pension splitting on divorce in Germany',
    intro: 'Every pension right built up during the marriage is halved between the spouses. Very small differences are left alone.',
    resume: `In a German divorce each spouse hands over half of the pension rights earned during the marriage: pension splitting, or Versorgungsausgleich (section 1 of the Pension Equalisation Act, VersAusglG). It covers the statutory pension, civil-service pensions, professional pension funds, company pensions and private annuity contracts. If one spouse built up a monthly pension of ${EN.eur(380)} during the marriage and the other ${EN.eur(140)}, their equalisation values are ${EN.eur(klar.ausgleichRenteA)} and ${EN.eur(klar.ausgleichRenteB)}, and on balance ${EN.eur(klar.differenzRente)} a month moves to the spouse with less. Splitting normally happens inside the same scheme. The family court should not split minor values (section 18 VersAusglG): in 2026 the limit is ${EN.eur(klar.grenzeRente, 2)} of monthly pension or ${EN.eur(klar.grenzeKapital)} of capital value, which is ${EN.pct(V.bagatelle_rente_anteil, 0)} and ${EN.pct(V.bagatelle_kapital_anteil, 0)} of the ${EN.eur(V.bezugsgroesse_monat)} monthly reference value. After a marriage of up to three years pensions are only split on application. Pensions held with foreign providers are not split by the German court at the divorce itself.`,
    faqs: [
      { q: 'Is a pension I earned in another country split in a German divorce?', a: 'It counts, because the law covers rights in Germany and abroad (section 2 VersAusglG), but a German court cannot divide a scheme run by a foreign provider. Such rights are left out of the split at divorce (section 19 VersAusglG) and dealt with afterwards through claims between the spouses, typically once pension payments begin. Where leaving them out would be unfair, German pensions may also stay unsplit.' },
      { q: 'Which period counts as the marriage for pension splitting?', a: 'From the first day of the month of the wedding to the last day of the month before the divorce petition is served (section 3(1) VersAusglG). Separation does not stop the clock: pension rights earned while living apart during the separation year are split too. The wedding venue or country does not change these dates.' },
      { q: 'Can we opt out of pension splitting in Germany?', a: 'Yes. Spouses may exclude it fully or partly, offset it against accrued gains or postpone it until after the divorce (section 6 VersAusglG). Until the court’s decision becomes final, the agreement must be notarised or recorded by the court (section 7 VersAusglG). The family court is bound by it unless it treats one spouse grossly unfairly.' },
      { q: 'What does pension splitting add to the cost of a German divorce?', a: `Each pension right raises the value of the proceedings by ${EN.pct(F.va_prozent_je_anrecht, 0)} of both spouses’ net income over three months, with a minimum of ${EN.eur(F.va_mindestwert)} in total (section 50 Family Court Costs Act). With ${EN.eur(3400)} and ${EN.eur(2100)} of monthly net income and four pension rights, that adds ${EN.eur(wertViele.vaWert)}, which then drives court and lawyer fees.` },
      { q: 'What is the 2026 de minimis limit for pension splitting?', a: `If the difference between two pension rights of the same kind, or the value of a single right, does not exceed ${EN.eur(klar.grenzeRente, 2)} a month or ${EN.eur(klar.grenzeKapital)} as a capital value, the court should not split it (section 18 VersAusglG). Should, not must: judges keep discretion and often still split several small rights that add up.` },
      { q: 'Are pensions split after a short marriage?', a: 'If the marriage period lasted up to three years, only when one spouse applies for it (section 3(3) VersAusglG). Without an application each keeps their own pension. For longer marriages the court deals with it automatically within the divorce, sending questionnaires about every pension scheme each spouse has belonged to.' },
    ],
    body: (h) => `<h2>Why Germany splits pensions</h2>
<p>Couples rarely build up retirement savings equally. The spouse who stayed home with children or worked part time ends a marriage with fewer pension points. German law corrects this at divorce: the share of each pension right earned during the marriage is divided in half (${h.src('versausglg1', 'section 1 VersAusglG')}). That half is called the equalisation value (Ausgleichswert).</p>
<p>Each right is split separately and in both directions. If both spouses pay into the German statutory scheme, the Deutsche Rentenversicherung nets the two transfers so that only the difference actually moves.</p>
<h2>Who calculates and how it is split</h2>
<p>The pension providers (Versorgungsträger) calculate the marriage-period share, not the judge: the statutory scheme in pension points (Entgeltpunkte), a company scheme or insurer as a monthly amount or capital value. The court collects these figures through questionnaires each spouse fills in.</p>
<p>The default is internal splitting (interne Teilung): the receiving spouse gets their own right with the same provider. For smaller company pensions the provider may insist on external splitting, paying the value as capital into another scheme. Either way, the transferred right then belongs to the recipient.</p>
<h2>Four cases at 2026 limits</h2>
${h.table(['Case', 'Equalisation values', 'Difference', 'Outcome'], [
  [`statutory pensions ${h.eur(380)} and ${h.eur(140)}`, `${h.eur(klar.ausgleichRenteA, 2)} / ${h.eur(klar.ausgleichRenteB, 2)}`, h.eur(klar.differenzRente, 2), klar.geringRente ? 'minor' : 'split'],
  [`small pensions ${h.eur(92)} and ${h.eur(34)}`, `${h.eur(klein.ausgleichRenteA, 2)} / ${h.eur(klein.ausgleichRenteB, 2)}`, h.eur(klein.differenzRente, 2), klein.geringRente ? 'minor, normally not split' : 'split'],
  [`one Riester contract, capital ${h.eur(6000)}`, h.eur(riester.ausgleichKapitalA), h.eur(riester.differenzKapital), riester.geringKapital ? 'minor, normally not split' : 'split'],
  [`one company pension, capital ${h.eur(18000)}`, h.eur(bav.ausgleichKapitalA), h.eur(bav.differenzKapital), bav.geringKapital ? 'minor' : 'split'],
], `Computed with the pension splitting calculator, limits 2026: ${h.eur(klar.grenzeRente, 2)} pension, ${h.eur(klar.grenzeKapital)} capital`)}
<h2>The de minimis rule</h2>
<p>Transferring tiny amounts costs schemes more than it helps the spouses. The court should therefore leave out rights of the same kind whose values differ only slightly, and single rights with a small value (${h.src('versausglg18', 'section 18 VersAusglG')}). The thresholds are ${h.pct(h.P.versorgungsausgleich.bagatelle_rente_anteil, 0)} of the monthly reference value (Bezugsgröße) for a pension amount and ${h.pct(h.P.versorgungsausgleich.bagatelle_kapital_anteil, 0)} for a capital value. With the ${h.src('svbezgrv2026', '2026 reference value')} of ${h.eur(h.P.versorgungsausgleich.bezugsgroesse_monat)}, that means ${h.eur(klar.grenzeRente, 2)} and ${h.eur(klar.grenzeKapital)}.</p>
<h2>Expats: foreign pensions and short stays</h2>
<p>Many expats arrive with a pension in another country and add German rights while working here. Foreign rights count in principle, but the German court cannot order a foreign provider to split them. They are excluded from the split at divorce and handled later by claims between the former spouses, for example a monthly compensation payment once the pension is drawn. If one spouse has substantial foreign rights, the court may also decline to split the other’s German rights where that would be unfair.</p>
<p>A short German career often meets a short marriage: if the marriage period lasted up to three years, nothing is split unless one spouse applies (section 3(3) VersAusglG). Whether German law governs the divorce at all is a preliminary question for the court.</p>
<h2>Agreements and costs</h2>
<p>Spouses can exclude or limit pension splitting, or trade it against ${h.a('zugewinnausgleich', 'accrued gains')}, in a notarised agreement. Each right also raises the ${h.a('verfahrenswert', 'value of the proceedings')} by ${h.pct(h.P.famgkg.va_prozent_je_anrecht, 0)} of three months’ joint net income, at least ${h.eur(h.P.famgkg.va_mindestwert)} in total (${h.src('famgkg50', 'section 50 FamGKG')}). For a couple earning ${h.eur(1300)} and ${h.eur(900)} with a single right, the minimum applies: ${h.eur(wertWenig.vaWert)}. See ${h.a('scheidungskosten', 'divorce costs')} for the full picture.</p>
<p>This page is general information on German pension splitting, not legal advice. Binding figures come from your pension providers during the proceedings; the ${h.a('versorgungsausgleich-rechner', 'pension splitting calculator')} lets you test the de minimis limits in advance.</p>`,
  },
});
