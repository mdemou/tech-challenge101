import type { Request, ResponseToolkit, Server } from '@hapi/hapi';
import responsesService from '@services/responses/responses.service';

export const DEBUG_ERROR_HEADER = 'x-debug-error';

/**
 * Testing aid for candidates: sending `X-Debug-Error: <status>` on any data endpoint
 * makes the API fail with that status, in the normal error format. This lets a candidate
 * demonstrate how their backend copes with an unreliable third-party API without the API
 * having to actually be unreliable.
 *
 * Health and docs routes are deliberately excluded so a globally-set header cannot make
 * the service look down to a process monitor.
 */
const DEBUG_ERROR_RESPONSES: Record<number, { code: string; message: string }> = {
  400: { code: 'DEBUG4000', message: 'Simulated bad request' },
  404: { code: 'DEBUG4040', message: 'Simulated not found' },
  429: { code: 'DEBUG4290', message: 'Simulated rate limit. Too many requests' },
  500: { code: 'DEBUG5000', message: 'Simulated internal server error' },
  503: { code: 'DEBUG5030', message: 'Simulated service unavailable' },
};

const SUPPORTED_STATUSES = Object.keys(DEBUG_ERROR_RESPONSES).map(Number);

const UNSUPPORTED_VALUE = {
  statusCode: 400,
  code: 'DEBUG4001',
  message: `Unsupported X-Debug-Error value. Supported statuses: ${SUPPORTED_STATUSES.join(', ')}`,
};

function isDataRoute(path: string): boolean {
  return path.startsWith('/api/') && !path.startsWith('/api/__');
}

export function registerDebugError(server: Server) {
  server.ext('onRequest', (request: Request, h: ResponseToolkit) => {
    const header = request.headers[DEBUG_ERROR_HEADER];
    if (!header || !isDataRoute(request.path)) {
      return h.continue;
    }

    const status = Number(header);
    const simulated = DEBUG_ERROR_RESPONSES[status];

    if (!simulated) {
      const response = responsesService.createResponseData(UNSUPPORTED_VALUE);
      return h.response(response.body).code(response.statusCode).takeover();
    }

    const response = responsesService.createResponseData({ statusCode: status, ...simulated });
    return h.response(response.body).code(response.statusCode).takeover();
  });
}
