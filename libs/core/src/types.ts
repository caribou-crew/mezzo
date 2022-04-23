import { RouteOrVariantIcon } from '@caribou-crew/mezzo-interfaces';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Route } from './models/route-model';

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
  mockedDirectory?: string;
  fsOverride?: any;
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
  id: string;
  label?: string;
  callback?: CallbackType;
  handler?: HandlerType;
  titleIcons?: RouteOrVariantIcon[];
  icons?: RouteOrVariantIcon[];
}

export type HandlerType = RequestHandler;

export type CallbackType = (
  req: Request,
  res: Response,
  route: Route
) => Promise<any> | void;

export interface FileHandlerOptions {
  code?: number;
  headers?: Record<string, string | boolean>;
  baseDir?: string; // Base directory to scan method + variant for
  filePath?: string; // Exact file to read (bypasses variant logic)
  delay?: number;
  cookies?: any;
  // TODO
  transpose?: any;
}

export type RouteVariants = Record<string, string>; // route id to variant id mapping

/**
 * Options used for set/update/reset mock variant util calls
 */
export interface ConnectionOptions {
  useHttps?: boolean;
  hostname?: string;
  port?: number;
}
