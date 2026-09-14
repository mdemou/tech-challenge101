import type { ICircuit } from '@domain/_interfaces/circuits.interface';
import type { CircuitRepository } from '@domain/_repositories/circuit.repository';

interface CircuitsRepositories {
  circuitRepository: CircuitRepository;
}

function circuitsDomainFactory(repositories: CircuitsRepositories) {
  const { circuitRepository } = repositories;

  return {
    async list(): Promise<ICircuit[]> {
      return circuitRepository.findAll();
    },
  };
}

export default circuitsDomainFactory;
