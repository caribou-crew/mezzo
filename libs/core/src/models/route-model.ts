import { RequestHandler } from 'express';
import { RouteData, RouteModel, VariantData } from '../types';
import logger from '../utils/logger';
import { getValidMethod } from '../utils/method-utils';

export function Route(routeData: RouteData): RouteModel {
  let _activeVariant = 'default';
  const _variants: Map<string, VariantData> = new Map<string, VariantData>();

  const id = routeData.id;
  const method = getValidMethod(routeData.method);
  const path = routeData.path;

  /**
   * Called to process express endpoint of this mock route
   * @param req
   * @param res
   * @param next
   */
  const processRequest: RequestHandler = (req, res, next) => {
    let callback: RequestHandler;

    // 1. Read variant from request header
    //  const variantFromRequestHeader = request.headers['x-request-variant'];
    // 2. Read variant from session state
    //  const sessionFromRequestHeader = request.headers['x-request-session'];
    // 3. Read variant from route state
    if (_activeVariant === 'default') {
      callback = routeData.callback;
    } else {
      callback = _variants.get(_activeVariant).callback;
    }

    logger.info(
      `Processing request for path ${path} with active variant ${_activeVariant} of variants with size ${_variants.size}`
    );

    if (callback) {
      callback(req, res, next);
    } else {
      res.send('no match');
    }
  };

  const setVariant = (id: string) => {
    if (_variants.has(id) || id === 'default') {
      logger.info('Setting active variant for ' + path + ' to ' + id);
      _activeVariant = id;
      return id;
    } else {
      logger.warn(
        'Could not find id ' + id + ' in route, setting as active variant'
      );
      return new Error('no variants found with id: ' + id);
    }
  };

  /**
   * Add variant to this route
   * Returns everything to allow for chaining e.g. mezzo.route(x).variant(y).variant(z);
   * @param variantData
   * @returns
   */
  const variant = (variantData: VariantData) => {
    _variants.set(variantData.id, variantData);
    logger.info(`Adding to variants, size of ${path} is now ${_variants.size}`);
    return {
      id,
      method,
      path,
      variant,
      variants: _variants,
      setVariant,
      processRequest,
    };
  };

  return {
    id,
    method,
    path,
    variant,
    variants: _variants,
    setVariant,
    processRequest,
  };
}
