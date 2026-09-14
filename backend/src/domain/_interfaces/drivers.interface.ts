export interface IDriver {
  id: string;
  name: string;
  number: number;
  teamId: string;
  /** Relative driver pace. Higher is faster. */
  pace: number;
  /** How reliably the driver reproduces their pace. Higher is more consistent. */
  consistency: number;
}
