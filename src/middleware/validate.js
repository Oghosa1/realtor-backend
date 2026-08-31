import { ValidationError } from './errorHandler.js';

/**
 * Middleware factory to validate request parts against a Zod schema.
 * @param {import('zod').ZodSchema} schema
 * @param {'body' | 'query' | 'params'} [source='body']
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errorMsg = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(new ValidationError(errorMsg));
    }
    req[source] = result.data;
    next();
  };
};
