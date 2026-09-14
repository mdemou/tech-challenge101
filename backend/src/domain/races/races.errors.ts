const racesErrors = {
  raceNotFound: {
    message: 'Race not found',
    code: 'RACE4040',
  },
  circuitNotFound: {
    message: 'The circuit referenced by this race does not exist',
    code: 'RACE5002',
  },
  weatherNotFound: {
    message: 'No weather data available for this race',
    code: 'RACE5003',
  },
  simulationParametersNotFound: {
    message: 'No simulation parameters available for this race',
    code: 'RACE5004',
  },
  internalError: {
    message: 'Internal error reading races',
    code: 'RACE5001',
  },
};

export default racesErrors;
