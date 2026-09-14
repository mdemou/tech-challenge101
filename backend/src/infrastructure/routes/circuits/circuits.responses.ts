import responsesService from '@services/responses/responses.service';

const circuitsResponses = {
  listOk: responsesService.createInternalResponse(200, 'CIR2001', 'Circuits retrieved'),
  internalError: {
    statusCode: 500,
    code: 'CIR5001',
    message: 'Internal error reading circuits',
  },
};

export default circuitsResponses;
