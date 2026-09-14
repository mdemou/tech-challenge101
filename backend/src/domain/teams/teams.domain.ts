import type { ITeam } from '@domain/_interfaces/teams.interface';
import type { TeamRepository } from '@domain/_repositories/team.repository';

interface TeamsRepositories {
  teamRepository: TeamRepository;
}

function teamsDomainFactory(repositories: TeamsRepositories) {
  const { teamRepository } = repositories;

  return {
    async list(): Promise<ITeam[]> {
      return teamRepository.findAll();
    },
  };
}

export default teamsDomainFactory;
