import { Request } from "express";

export type RequestWithParams<T> = Request<T>;
export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestWithQuery<T> = Request<{}, {}, {}, T>;

export type RequestWithParamsAndBody<T, K> = Request<T, {}, K>;