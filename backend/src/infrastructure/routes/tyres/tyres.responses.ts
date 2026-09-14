import responsesService from '@services/responses/responses.service';

const tyresResponses = {
  listOk: responsesService.createInternalResponse(200, 'TYR2001', 'Tyre compounds retrieved'),
  internalError: {
    statusCode: 500,
    code: 'TYR5001',
    message: 'Internal error reading tyres',
  },
};

export default tyresResponses;
