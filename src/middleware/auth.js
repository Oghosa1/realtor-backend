export const DEFAULT_USER_ID = '11111111-1111-1111-1111-111111111111';

/**
 * Injects current authenticated/mocked user into the request context.
 */
export const currentUserMiddleware = (req, res, next) => {
  const userId = req.headers['x-user-id'] || DEFAULT_USER_ID;
  req.userId = typeof userId === 'string' ? userId : DEFAULT_USER_ID;
  next();
};
