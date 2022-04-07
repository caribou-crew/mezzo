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
  id: string; // Unique ID given to a route
  method: string; // HTTP method of route
  path: string | RegExp; // Endpoint match of route, must be compatible with express
  variant: (v: VariantData) => RouteModel; // Adds a variant to the route
  variants: Map<string, VariantData>; // Map of key:value pairs of variant id to variant data
  setVariant: (id: string) => RouteModel; // Sets the variant for given route
  activeVariant: string; // Active variant id for route, or default
  processRequest: MiddlewareFn; // Executed when route is visited
}
