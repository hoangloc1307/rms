import { Request } from 'express';

export type TypedRequest<B, P = object, Q = object> = Request<P, object, B, Q>;
