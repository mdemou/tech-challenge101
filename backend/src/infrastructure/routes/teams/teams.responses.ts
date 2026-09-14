import responsesService from '@services/responses/responses.service';

const teamsResponses = {
  listOk: responsesService.createInternalResponse(200, 'TEAM2001', 'Teams retrieved'),
  internalError: {
    statusCode: 500,
    code: 'TEAM5001',
    message: 'Internal error reading teams',
  },
};

export default teamsResponses;
