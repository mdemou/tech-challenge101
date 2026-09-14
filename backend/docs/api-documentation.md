# API Documentation Conventions

When adding or modifying backend routes, follow these patterns for Swagger docs.

## File Structure

Each route module has:

- **`.route.ts`** — Route definition (method, path, handler, options)
- **`.doc.ts`** — Validation + hapi-swagger response schemas
- **`.responses.ts`** — Response metadata (`statusCode`, `code`, `message`)

## Use createResponseDoc

Do not manually build Joi schemas for responses. Use the factory from `@infrastructure/routes/doc/docFactory`:

```typescript
// .doc.ts
import { createResponseDoc } from '@infrastructure/routes/doc/docFactory';
import { createValidationFailAction } from '@infrastructure/routes/validationFailAction';
import someResponses from './some.responses';

const someDocs = {
  myEndpoint: {
    responses: createResponseDoc('myEndpoint', someResponses.okResponse, {
      dataSchema: Joi.object({
        /* optional payload for 200 */
      }),
      400: someResponses.badRequest(400, 'Validation error'),
      429: true, // Default rate limit; or pass custom object
      409: { statusCode: 409, code: 'XXX4090', message: '...' },
      500: { statusCode: 500, code: 'XXX5001', message: '...' },
    }),
    parameters: {
      payload: Joi.object({
        /* ... */
      }),
      failAction: createValidationFailAction(someResponses.badRequest),
    },
  },
};
```

## Route Wiring

```typescript
// .route.ts
options: {
  plugins: {
    'hapi-swagger': { responses: someDocs.myEndpoint.responses },
  },
  validate: someDocs.myEndpoint.parameters,
  tags: ['api', 'group-name'],
}
```

## Response Metadata

Define in `.responses.ts` via `responsesService.createInternalResponse(statusCode, code, message)`. Reuse these in both controllers and `createResponseDoc`.

## Data Sources

Routes are backed by JSON files in `src/data/`, not a database. Controllers wire a
file-backed repository into the domain factory exactly as they would a DB one — see
`messages.controller.ts`.

## Swagger UI

Documentation is served at `/docs` (not `/documentation`). JSON spec at `/docs.json`.
