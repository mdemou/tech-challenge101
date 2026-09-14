import type { IDriver } from '@domain/_interfaces/drivers.interface';
import type { DriverRepository } from '@domain/_repositories/driver.repository';

interface DriversRepositories {
  driverRepository: DriverRepository;
}

function driversDomainFactory(repositories: DriversRepositories) {
  const { driverRepository } = repositories;

  return {
    async list(): Promise<IDriver[]> {
      return driverRepository.findAll();
    },
  };
}

export default driversDomainFactory;
