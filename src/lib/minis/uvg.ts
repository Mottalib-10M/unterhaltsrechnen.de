import { unterhaltsvorschuss } from '../engine/unterhalt';
import { T, eur, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Unterhaltsvorschuss für Ihr Kind', 'Maintenance advance for your child'),
  cta: T(l, 'Unterhaltsvorschuss-Rechner', 'Maintenance advance calculator'),
  inputs: [{ id: 'a', label: T(l, 'Alter des Kindes', 'Child’s age'), def: 6, max: 17 }, { id: 'u', label: T(l, 'Unterhalt, der ankommt', 'Maintenance received'), def: 0, unit: '€', max: 5000 }],
  run: ({ a, u }: Record<string, number>) => { const r = unterhaltsvorschuss({ alter: a, unterhaltErhalten: u, ab12Voraussetzung: true });
    return { head: [T(l, 'Vorschuss pro Monat', 'Advance per month'), eur(r.leistung, l)], rows: [[T(l, 'Mindestunterhalt', 'Minimum support'), eur(r.mindestunterhalt, l)], [T(l, 'minus Kindergeld', 'minus child benefit'), eur(r.kindergeldAbzug, l)]] as Rows, note: a >= 12 ? T(l, 'Ab 12 nur ohne Bürgergeld des Kindes oder mit mindestens 600 € Einkommen des Elternteils.', 'From 12 only if the child gets no Bürgergeld or the parent earns at least €600.') : undefined }; },
});
