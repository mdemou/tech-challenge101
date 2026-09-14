export type TyreCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET';

export interface IRainIntensityRange {
  min: number;
  max: number;
}

export interface ITyre {
  compound: TyreCompound;
  /** Lap time delta in seconds against the circuit base lap time. Negative is faster. */
  pace: number;
  /** Seconds added per lap of stint age. */
  degradation: number;
  /** Grip effectiveness on a wet track. 0 = unusable, 1 = fully effective. */
  wetPerformance: number;
  /** Rain intensity band this compound is designed for. */
  optimalRainIntensity: IRainIntensityRange;
}
