import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Express middleware function signature
 */
export type MiddlewareFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

/**
 * Server options used when starting mezzo
 */
export interface ServerOptions {
  port: number | string;
  adminEndpoint?: string;
  mockedDirectory: string;
}

/**
 * Input provided when creating a new route
 */
export interface RouteData extends RouteAndVariantData {
  method?: string;
  path: string | RegExp;
}
/**
 * Input provided when creating a new variant
 */
export interface VariantData extends RouteAndVariantData {
  variantLabel?: string;
}
/**
 * Shared interface between route and variant data
 */
export interface RouteAndVariantData {
  id?: string;
  label?: string;
  callback?: RequestHandler;
}

/**
 * Model representation of a route
 */
export interface RouteModel {
  id: string;
  method: string;
  path: string | RegExp;
  variant: (v: VariantData) => RouteModel;
  variants: Map<string, VariantData>;
  setVariant: (id: string) => string | Error;
  processRequest: MiddlewareFn;
}
