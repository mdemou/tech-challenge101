import type { ITyre } from '@domain/_interfaces/tyres.interface';
import type { TyreRepository } from '@domain/_repositories/tyre.repository';

interface TyresRepositories {
  tyreRepository: TyreRepository;
}

function tyresDomainFactory(repositories: TyresRepositories) {
  const { tyreRepository } = repositories;

  return {
    async list(): Promise<ITyre[]> {
      return tyreRepository.findAll();
    },
  };
}

export default tyresDomainFactory;
