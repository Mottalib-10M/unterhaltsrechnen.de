/** Kennzahlen der Prüfung gegen die amtlichen Tabellen, aus den Testdaten gelesen (nie von Hand in Texte schreiben). */
import pf from '../../tests/fixtures/pfaendung-2026-monat.json';
import famgkg from '../../tests/fixtures/famgkg-anlage2.json';
import rvg from '../../tests/fixtures/rvg-anlage2.json';
import { P } from './engine/params';

export const PRUEFUNG = {
  dtZellen: P.dt.bedarf.length * 4,
  pfZeilen: pf.zeilen.length,
  pfWerte: pf.zeilen.length * 6 * 2,
  pfAbgerufen: pf.abgerufen,
  famgkgZeilen: famgkg.zeilen.length,
  rvgZeilen: rvg.zeilen.length,
};
