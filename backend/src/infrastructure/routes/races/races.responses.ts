import responsesService from '@services/responses/responses.service';

const racesResponses = {
  listOk: responsesService.createInternalResponse(200, 'RACE2001', 'Races retrieved'),
  detailsOk: responsesService.createInternalResponse(200, 'RACE2002', 'Race retrieved'),
  weatherOk: responsesService.createInternalResponse(200, 'RACE2003', 'Race weather retrieved'),
  simulationParametersOk: responsesService.createInternalResponse(
    200,
    'RACE2004',
    'Race simulation parameters retrieved',
  ),
  badRequest: (statusCode: number, message: string) =>
    responsesService.createInternalResponse(statusCode, 'RACE4000', message),
  notFound: { statusCode: 404, code: 'RACE4040', message: 'Race not found' },
  internalError: { statusCode: 500, code: 'RACE5001', message: 'Internal error reading races' },
};

export default racesResponses;
