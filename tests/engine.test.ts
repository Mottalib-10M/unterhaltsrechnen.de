/**
 * Motor gegen die amtlichen Tabellen: Zahlbetragstabelle der DT 2026 (Anhang), Mangelfallbeispiel Anm. C,
 * jede Zeile der Pfändungstabelle 2026 (Monat), FamGKG- und RVG-Gebührentabellen (Anlage 2), Erbfolge,
 * Erbschaftsteuer mit Härteausgleich, PKH-Raten, Unterhaltsvorschuss, Zugewinn und Versorgungsausgleich.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import pf from './fixtures/pfaendung-2026-monat.json';
import famgkgTab from './fixtures/famgkg-anlage2.json';
import rvgTab from './fixtures/rvg-anlage2.json';
import { kindesunterhalt, zahlbetrag, gruppeVon, stufeVonAlter, bedarf, mangelfallGrenze, type Stufe } from '../src/lib/engine/dt';
import { ehegattenunterhalt, volljaehrigenunterhalt, wechselmodell, elternunterhalt, unterhaltsvorschuss } from '../src/lib/engine/unterhalt';
import { pfaendbar, pKonto, freibetrag } from '../src/lib/engine/pfaendung';
import { famgkgGebuehr, rvgGebuehr, scheidungskosten, pkh } from '../src/lib/engine/kosten';
import { erbfolge, pflichtteilsergaenzung, erbschaftsteuer, steuerNachTarif } from '../src/lib/engine/erbe';
import { zugewinnausgleich, versorgungsausgleich } from '../src/lib/engine/vermoegen';

describe('Düsseldorfer Tabelle 2026', () => {
  it('Zahlbeträge = Anhang der Tabelle, alle 15 Gruppen × 4 Altersstufen', () => {
    const txt = readFileSync(new URL('../research/dt2026.txt', import.meta.url), 'utf8');
    const anhang = txt.slice(txt.indexOf('Anhang: Tabelle Zahlbeträge'));
    const rows = [...anhang.matchAll(/^\s*(\d{1,2})\.\s.*?((?:\d\.)?\d{3},\d\d)\s+((?:\d\.)?\d{3},\d\d)\s+((?:\d\.)?\d{3},\d\d)\s+((?:\d\.)?\d{3},\d\d)\s+(\d{3})\s*$/gm)];
    expect(rows.length).toBe(15);
    for (const r of rows) {
      const g = Number(r[1]) - 1;
      for (let s = 0; s < 4; s++) expect(zahlbetrag(g, s as Stufe)).toBeCloseTo(Number(r[2 + s].replace('.', '').replace(',', '.')), 2);
    }
  });
  it('Gruppen und Altersstufen an den Grenzen', () => {
    expect(gruppeVon(2100)).toBe(0); expect(gruppeVon(2101)).toBe(1); expect(gruppeVon(11200)).toBe(14); expect(gruppeVon(20000)).toBe(14);
    expect(stufeVonAlter(5)).toBe(0); expect(stufeVonAlter(6)).toBe(1); expect(stufeVonAlter(11)).toBe(1); expect(stufeVonAlter(12)).toBe(2); expect(stufeVonAlter(18)).toBe(3);
    expect(bedarf(0, 0)).toBe(486);
  });
  it('Mangelfallbeispiel der Anm. C: 107,60 / 105,02 / 87,38 €', () => {
    const r = kindesunterhalt(1750, [{ alter: 18, privilegiert: true }, { alter: 7 }, { alter: 5 }], { erwerbstaetig: true });
    expect(r.mangelfall).toBe(true);
    expect(r.verteilungsmasse).toBe(300);
    expect(r.kinder.map((k) => k.tabellenZahlbetrag)).toEqual([439, 428.5, 356.5]);
    expect(r.kinder.map((k) => k.zahlbetrag)).toEqual([107.6, 105.02, 87.38]);
  });
  it('ein Kind, 3.000 €: Gruppe 4, 512,50 €', () => {
    const r = kindesunterhalt(3000, [{ alter: 8 }]);
    expect(r.gruppe).toBe(3); expect(r.summe).toBe(512.5); expect(r.mangelfall).toBe(false);
  });
  it('Herabstufung bis zum Bedarfskontrollbetrag, dann Mangelfall', () => {
    const r = kindesunterhalt(2600, [{ alter: 3 }, { alter: 7 }, { alter: 13 }]);
    expect(r.gruppeEinkommen).toBe(2); expect(r.gruppe).toBe(0); expect(r.mangelfall).toBe(true);
    expect(r.verteilungsmasse).toBe(1150);
    expect(r.summe).toBeCloseTo(1150, 1);
    expect(r.verbleibt).toBeCloseTo(1450, 1);
  });
  it('ohne BKB keine Herabstufung', () => {
    const r = kindesunterhalt(4000, [{ alter: 3 }, { alter: 7 }], { bkb: false });
    expect(r.gruppe).toBe(5);
  });
  it('erweiterter Umgang: 10 % Abzug vom Bedarf (BGH XII ZB 415/25)', () => {
    const r = kindesunterhalt(3000, [{ alter: 8 }], { umgangAbzug: 0.1 });
    expect(r.kinder[0].zahlbetrag).toBeCloseTo(642 * 0.9 - 129.5, 2);
  });
  it('nicht erwerbstätig: Selbstbehalt 1.200 €', () => {
    const r = kindesunterhalt(1500, [{ alter: 4 }], { erwerbstaetig: false });
    expect(r.selbstbehalt).toBe(1200); expect(r.summe).toBe(300); expect(r.mangelfall).toBe(true);
  });
  it('Mangelfallgrenze', () => { expect(mangelfallGrenze([{ alter: 4 }])).toBe(1810); });
  it('Mangelfall: verteilt wird genau die Verteilungsmasse, kein Rundungscent', () => {
    const r = kindesunterhalt(1800, [{ alter: 3 }, { alter: 7 }, { alter: 12 }]);
    expect(r.mangelfall).toBe(true); expect(r.summe).toBe(350); expect(r.verbleibt).toBe(1450);
  });
});

describe('Ehegatten-, Volljährigen-, Eltern-, Wechselmodell-Unterhalt, UVG', () => {
  it('45 % der Differenz, Selbstbehalt 1.600 €', () => {
    const r = ehegattenunterhalt({ pflichtigErwerb: 3500, berechtigtErwerb: 1000 });
    expect(r.unterhalt).toBe(1125);
    const s = ehegattenunterhalt({ pflichtigErwerb: 2000, berechtigtErwerb: 0, kindesunterhalt: 300 });
    expect(s.quote).toBe(765); expect(s.unterhalt).toBe(100); expect(s.begrenztDurchSelbstbehalt).toBe(true);
  });
  it('Rentner zahlt 50 %', () => { expect(ehegattenunterhalt({ pflichtigErwerb: 3000, pflichtigErwerbstaetig: false }).unterhalt).toBe(1500); });
  it('Volljährige im Elternhaushalt: Quote über 1.750 €, Kappung nach eigenem Einkommen', () => {
    const r = volljaehrigenunterhalt({ einkommenA: 3000, einkommenB: 2000, eigenerHaushalt: false });
    expect(r.bedarf).toBe(1061); expect(r.restbedarf).toBe(802);
    expect(r.anteilA).toBe(544); expect(r.kappungA).toBe(true); expect(r.anteilB).toBeCloseTo(133.67, 2);
  });
  it('Student mit eigener Wohnung: 990 € minus Kindergeld', () => {
    const r = volljaehrigenunterhalt({ einkommenA: 4000, einkommenB: 2750, eigenerHaushalt: true });
    expect(r.restbedarf).toBe(731); expect(r.anteilA + r.anteilB).toBeCloseTo(731, 1); expect(r.anteilA).toBeCloseTo(506.08, 2);
  });
  it('Elternunterhalt: 30 % über 2.650 €, nur über 100.000 € brutto', () => {
    expect(elternunterhalt({ nettoBereinigt: 5650, jahresbrutto: 120000, luecke: 2000 }).unterhalt).toBe(900);
    expect(elternunterhalt({ nettoBereinigt: 5650, jahresbrutto: 95000, luecke: 2000 }).unterhalt).toBe(0);
  });
  it('Wechselmodell: Spitze und Kindergeldausgleich', () => {
    const r = wechselmodell({ einkommenA: 3750, einkommenB: 2250, alter: 8, kindergeldAn: 'B' });
    expect(r.gruppe).toBe(10); expect(r.tabellenbedarf).toBe(938); expect(r.barbedarf).toBe(808.5);
    expect(r.quoteA).toBeCloseTo(0.8, 5); expect(r.spitze).toBeCloseTo((808.5 * 0.6) / 2, 2); expect(r.zahlt).toBe('A');
    expect(r.kgWeitergabe).toBeCloseTo(64.75 + 129.5 * 0.8, 2);
    expect(r.ausgleichZahlt).toBe('A'); expect(r.ausgleich).toBeCloseTo(242.55 - 168.35, 2);
  });
  it('Unterhaltsvorschuss 2026: 227 / 299 / 394 €', () => {
    expect(unterhaltsvorschuss({ alter: 3 }).leistung).toBe(227);
    expect(unterhaltsvorschuss({ alter: 9 }).leistung).toBe(299);
    expect(unterhaltsvorschuss({ alter: 14, ab12Voraussetzung: true }).leistung).toBe(394);
    expect(unterhaltsvorschuss({ alter: 14 }).grund).toBe('ab12');
    expect(unterhaltsvorschuss({ alter: 9, unterhaltErhalten: 100 }).leistung).toBe(199);
  });
});

describe('Pfändungstabelle 2026 (ab 1. Juli 2026)', () => {
  it(`alle ${pf.zeilen.length} Zeilen der Monatstabelle × 6 Spalten, Zeilenanfang und Zeilenende`, () => {
    let n = 0;
    for (const z of pf.zeilen) for (let p = 0; p <= 5; p++) for (const netto of [z.von, z.bis]) {
      expect(pfaendbar(netto, p).pfaendbar, `${netto} € / ${p}`).toBeCloseTo(z.p[p], 2); n++;
    }
    expect(n).toBe(pf.zeilen.length * 12);
  });
  it('über der Obergrenze voll pfändbar', () => {
    expect(pfaendbar(5866.3, 0).pfaendbar).toBeCloseTo(2290.82 + 1000, 2);
  });
  it('Freibeträge und P-Konto', () => {
    expect(freibetrag(0)).toBe(1587.4); expect(freibetrag(1)).toBeCloseTo(2184.82, 2); expect(freibetrag(2)).toBeCloseTo(2517.65, 2);
    expect(pKonto(0).summe).toBe(1590); expect(pKonto(1, 1).summe).toBeCloseTo(1590 + 597.42 + 259, 2);
  });
});

describe('Gerichts- und Anwaltskosten', () => {
  it(`FamGKG Anlage 2: ${famgkgTab.zeilen.length} Werte`, () => { for (const z of famgkgTab.zeilen) expect(famgkgGebuehr(z.wert), String(z.wert)).toBeCloseTo(z.gebuehr, 2); });
  it(`RVG Anlage 2: ${rvgTab.zeilen.length} Werte`, () => { for (const z of rvgTab.zeilen) expect(rvgGebuehr(z.wert), String(z.wert)).toBeCloseTo(z.gebuehr, 2); });
  it('über 500.000 € und Zwischenwerte', () => {
    expect(famgkgGebuehr(550000)).toBeCloseTo(4138 + 210, 2); expect(rvgGebuehr(550000)).toBeCloseTo(3752 + 175, 2);
    expect(famgkgGebuehr(12600)).toBe(313.5); expect(rvgGebuehr(3001)).toBe(295);
  });
  it('Scheidung mit Versorgungsausgleich, ein Anwalt', () => {
    const r = scheidungskosten({ netto1: 2000, netto2: 1500, anrechte: 2, anwaelte: 1 });
    expect(r.eheWert).toBe(10500); expect(r.vaWert).toBe(2100); expect(r.gesamtWert).toBe(12600);
    expect(r.gerichtskosten).toBe(627); expect(r.anwalt.verfahren).toBe(919.1); expect(r.anwalt.termin).toBe(848.4);
    expect(r.anwalt.auslagen).toBe(20); expect(r.anwalt.brutto).toBeCloseTo(2127.13, 2);
    expect(r.gesamt).toBeCloseTo(627 + 2127.13, 2);
  });
  it('Mindestwerte 3.000 € und 1.000 €', () => {
    const r = scheidungskosten({ netto1: 500, netto2: 0, anrechte: 1, anwaelte: 1 });
    expect(r.eheWert).toBe(3000); expect(r.vaWert).toBe(1000);
  });
  it('PKH-Rate', () => {
    expect(pkh({ netto: 2500, erwerbstaetig: true, wohnkosten: 800 }).rate).toBe(499);
    expect(pkh({ netto: 1800, erwerbstaetig: true, wohnkosten: 700 }).rate).toBe(99);
    expect(pkh({ netto: 1500, erwerbstaetig: true, wohnkosten: 600, kinder: [4] }).ratenfrei).toBe(true);
  });
});

describe('Erbrecht und Erbschaftsteuer', () => {
  it('Zugewinngemeinschaft mit zwei Kindern: 1/2 und je 1/4', () => {
    const r = erbfolge({ verheiratet: true, gueterstand: 'zugewinn', kinder: 2, nachlass: 400000 });
    expect(r.anteile[0].quoteJe).toBe(0.5); expect(r.anteile[1].quoteJe).toBe(0.25); expect(r.anteile[1].pflichtteilJe).toBe(50000);
    expect(r.kleinerPflichtteilEhegatte).toBe(50000);
  });
  it('Gütertrennung: zwei Kinder je 1/3, drei Kinder Ehegatte 1/4', () => {
    expect(erbfolge({ verheiratet: true, gueterstand: 'trennung', kinder: 2, nachlass: 300000 }).anteile[0].quoteJe).toBeCloseTo(1 / 3, 6);
    expect(erbfolge({ verheiratet: true, gueterstand: 'trennung', kinder: 3, nachlass: 300000 }).anteile[0].quoteJe).toBe(0.25);
  });
  it('ohne Kinder, beide Eltern: Ehegatte 3/4, Eltern je 1/8', () => {
    const r = erbfolge({ verheiratet: true, kinder: 0, elternLebend: 2, nachlass: 80000 });
    expect(r.anteile[0].quoteJe).toBe(0.75); expect(r.anteile[1].quoteJe).toBe(0.125);
  });
  it('ledig, ein Elternteil lebt, zwei Geschwister', () => {
    const r = erbfolge({ verheiratet: false, kinder: 0, elternLebend: 1, geschwister: 2, nachlass: 100000 });
    expect(r.anteile.map((a) => a.quoteJe)).toEqual([0.5, 0.25]);
  });
  it('Pflichtteilsergänzung: 1/10 weniger je Jahr', () => {
    expect(pflichtteilsergaenzung(100000, 0.5, 0.25).ergaenzung).toBe(25000);
    expect(pflichtteilsergaenzung(100000, 3.2, 0.25).angerechnet).toBe(70000);
    expect(pflichtteilsergaenzung(100000, 10, 0.25).ergaenzung).toBe(0);
  });
  it('Erbschaftsteuer Kind 600.000 €: 20.350 €', () => {
    const r = erbschaftsteuer({ erwerb: 600000, beziehung: 'kind', erbfall: true, alterKind: 30 });
    expect(r.steuerpflichtig).toBe(185000); expect(r.satz).toBe(0.11); expect(r.steuer).toBe(20350);
  });
  it('Härteausgleich § 19 Abs. 3', () => {
    const t = steuerNachTarif(310000, 'I');
    expect(t.haerteausgleich).toBe(true); expect(t.steuer).toBe(38000);
  });
  it('Ehegatte mit Versorgungsfreibetrag, Nichte in Klasse II', () => {
    expect(erbschaftsteuer({ erwerb: 771000, beziehung: 'ehegatte', erbfall: true }).steuerpflichtig).toBe(0);
    const n = erbschaftsteuer({ erwerb: 100000, beziehung: 'nichte_neffe', erbfall: true });
    expect(n.klasse).toBe('II'); expect(n.steuerpflichtig).toBe(65000); expect(n.steuer).toBe(9750);
  });
});

describe('Zugewinn und Versorgungsausgleich', () => {
  it('Hälfte des Überschusses', () => {
    const r = zugewinnausgleich({ anfangA: 10000, endA: 110000, anfangB: 0, endB: 20000 });
    expect(r.forderung).toBe(40000); expect(r.berechtigt).toBe('B');
  });
  it('Kappung durch Endvermögen', () => {
    const r = zugewinnausgleich({ anfangA: -50000, endA: 10000, anfangB: 0, endB: 0 });
    expect(r.zugewinnA).toBe(60000); expect(r.forderung).toBe(10000); expect(r.gekappt).toBe(true);
  });
  it('Geringfügigkeit: 39,55 € Rente, 4.746 € Kapital', () => {
    const r = versorgungsausgleich({ renteA: 400, renteB: 330, kapitalA: 12000, kapitalB: 0 });
    expect(r.grenzeRente).toBe(39.55); expect(r.differenzRente).toBe(35); expect(r.geringRente).toBe(true);
    expect(r.grenzeKapital).toBe(4746); expect(r.geringKapital).toBe(false);
  });
});
