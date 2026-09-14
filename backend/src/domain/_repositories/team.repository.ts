import type { ITeam } from '@domain/_interfaces/teams.interface';

export interface TeamRepository {
  findAll: () => Promise<ITeam[]>;
}
