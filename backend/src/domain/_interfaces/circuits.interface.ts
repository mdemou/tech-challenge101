export interface ICircuit {
  id: string;
  name: string;
  country: string;
  type: string;
  laps: number;
  lengthKm: number;
  /** Reference dry lap time in seconds, before tyre, fuel and weather effects. */
  baseLapTime: number;
  /** Time lost in seconds for a pit stop, excluding the tyre change itself. */
  pitStopLoss: number;
  /** Multiplier applied to tyre degradation. 1.0 is neutral. */
  tyreWear: number;
  /** 0 = easy to overtake, 1 = nearly impossible. */
  overtakingDifficulty: number;
}
