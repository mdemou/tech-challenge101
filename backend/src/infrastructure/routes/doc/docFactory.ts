import type { ICreateResponseData } from '@services/responses/responses.interfaces';
import Joi from 'joi';

/** Shared rate limit response */
const RATE_LIMIT_RESPONSE = {
  statusCode: 429,
  code: 'RATE_LIMIT_4290',
  message: 'Too many requests. Please try again later',
} as const;

/** Build base Joi schema from internal response { statusCode, code, message } */
function baseSchema(r: ICreateResponseData, label: string) {
  return Joi.object({
    statusCode: Joi.number().example(r.statusCode),
    code: Joi.string().example(r.code),
    message: Joi.string().example(r.message),
  }).label(label);
}

export interface ResponseDocOptions {
  /** Optional data object schema for 200 response */
  dataSchema?: Joi.ObjectSchema;
  /** 400 Bad Request - pass output of badRequest(400, 'message') */
  400?: ICreateResponseData;
  /** 404 Not Found */
  404?: ICreateResponseData;
  /** 409 Conflict */
  409?: ICreateResponseData;
  /** 429 Rate limit - defaults to RATE_LIMIT_4290, or pass custom */
  429?: ICreateResponseData | boolean;
  /** 500 Internal error */
  500?: ICreateResponseData;
}

/** Creates hapi-swagger response definitions from response metadata */
export function createResponseDoc(
  routeName: string,
  okResponse: ICreateResponseData,
  options: ResponseDocOptions = {},
): Record<number, { description: string; schema: Joi.ObjectSchema }> {
  const result: Record<number, { description: string; schema: Joi.ObjectSchema }> = {};

  // 200 success
  const okSchema = options.dataSchema
    ? baseSchema(okResponse, `${routeName}Response`).keys({ data: options.dataSchema })
    : baseSchema(okResponse, `${routeName}Response`);
  result[200] = { description: okResponse.message, schema: okSchema };

  if (options[400]) {
    result[400] = {
      description: 'Bad Request',
      schema: baseSchema(options[400], `${routeName}BadRequest`),
    };
  }

  if (options[404]) {
    result[404] = {
      description: 'Not Found',
      schema: baseSchema(options[404], `${routeName}NotFound`),
    };
  }

  if (options[409]) {
    result[409] = {
      description: 'Conflict',
      schema: baseSchema(options[409], `${routeName}Conflict`),
    };
  }

  if (options[429]) {
    const r: ICreateResponseData = options[429] === true ? RATE_LIMIT_RESPONSE : options[429];
    result[429] = {
      description: 'Too many requests',
      schema: baseSchema(r, `${routeName}RateLimitExceeded`),
    };
  }

  if (options[500]) {
    result[500] = {
      description: 'Internal server error',
      schema: baseSchema(options[500], `${routeName}InternalError`),
    };
  }

  return result;
}
