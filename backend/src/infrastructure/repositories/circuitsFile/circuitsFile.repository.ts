import type { ICircuit } from '@domain/_interfaces/circuits.interface';
import type { CircuitRepository } from '@domain/_repositories/circuit.repository';
import Boom from '@hapi/boom';
import { filesService } from '@services/files.service';
import logger from '@services/logger.service';
import circuitsFileErrors from './circuitsFile.errors';

const DATA_FILE = 'circuits.json';

async function loadCircuits(): Promise<ICircuit[]> {
  try {
    return await filesService.readJsonData<ICircuit[]>(DATA_FILE);
  } catch (error) {
    logger.error(__filename, 'loadCircuits', 'error', error);
    throw Boom.badImplementation(circuitsFileErrors.internalError.message, {
      code: circuitsFileErrors.internalError.code,
    });
  }
}

const circuitsFileRepository: CircuitRepository = {
  findAll: async (): Promise<ICircuit[]> => {
    return loadCircuits();
  },

  findById: async (id: string): Promise<ICircuit | null> => {
    const circuits = await loadCircuits();
    return circuits.find((circuit) => circuit.id === id) ?? null;
  },
};

export default circuitsFileRepository;
