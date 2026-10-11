/** Typisierter Zugriff auf params-2026.json: jeder Rechtswert der Seite steht dort, nie in Seiten oder Code. */
import raw from '../../data/params-2026.json';

export type SourceKey = keyof typeof raw.sources;
export type Params = typeof raw;
export const P: Params = raw;

/** Kaufmännische Rundung auf Cent. */
export const r2 = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;
/** Aufrunden auf volle Euro (§ 1612a Abs. 2 Satz 2 BGB). */
export const ceilEur = (x: number) => Math.ceil(x - 1e-9);
