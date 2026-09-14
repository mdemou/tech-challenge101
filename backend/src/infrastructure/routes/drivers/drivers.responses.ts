import responsesService from '@services/responses/responses.service';

const driversResponses = {
  listOk: responsesService.createInternalResponse(200, 'DRV2001', 'Drivers retrieved'),
  internalError: {
    statusCode: 500,
    code: 'DRV5001',
    message: 'Internal error reading drivers',
  },
};

export default driversResponses;
