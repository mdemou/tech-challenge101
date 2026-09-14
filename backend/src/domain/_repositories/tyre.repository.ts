import type { ITyre } from '@domain/_interfaces/tyres.interface';

export interface TyreRepository {
  findAll: () => Promise<ITyre[]>;
}
