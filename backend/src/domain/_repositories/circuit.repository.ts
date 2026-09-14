import type { ICircuit } from '@domain/_interfaces/circuits.interface';

export interface CircuitRepository {
  findAll: () => Promise<ICircuit[]>;
  findById: (id: string) => Promise<ICircuit | null>;
}
