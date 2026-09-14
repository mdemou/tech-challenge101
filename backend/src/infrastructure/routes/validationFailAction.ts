import type { Request, ResponseToolkit } from '@hapi/hapi';
import type { ICreateResponseData } from '@services/responses/responses.interfaces';
import responsesService from '@services/responses/responses.service';

type BadRequestFactory = (statusCode: number, message: string) => ICreateResponseData;

/**
 * Builds a Hapi `failAction` that renders Joi validation errors in the project's
 * standard `{ statusCode, code, message }` envelope, using the route module's own
 * `badRequest` factory so the emitted `code` matches the rest of that module.
 *
 * Uses `takeover()` because a failAction runs before the handler — rethrowing a Boom
 * here would bypass the controller's catch block and serialize in Boom's default
 * shape, dropping the `code`.
 */
export function createValidationFailAction(badRequest: BadRequestFactory) {
  return (_request: Request, h: ResponseToolkit, err?: Error) => {
    const message = err?.message ?? 'Validation error';
    const response = responsesService.createResponseData(badRequest(400, message));
    return h.response(response.body).code(response.statusCode).takeover();
  };
}
