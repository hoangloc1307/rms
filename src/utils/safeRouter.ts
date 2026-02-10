import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from 'express';

type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

function isAsyncHandler(handler: RequestHandler) {
  return handler.constructor.name === 'AsyncFunction';
}

function wrapAsync(handler: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

export function safeRouter() {
  const router = Router();

  const methods: HTTPMethod[] = ['get', 'post', 'put', 'delete', 'patch'];

  methods.forEach((method) => {
    const original = router[method].bind(router);

    router[method] = ((path: string, ...handlers: RequestHandler[]) => {
      const wrapped = handlers.map((handler) =>
        isAsyncHandler(handler) ? wrapAsync(handler) : handler
      );
      return original(path, ...wrapped);
    }) as (typeof router)[typeof method];
  });

  return router;
}
