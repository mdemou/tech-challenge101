import type { IDriver } from '@domain/_interfaces/drivers.interface';

export interface DriverRepository {
  findAll: () => Promise<IDriver[]>;
}
