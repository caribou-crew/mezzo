import { RequestHandler } from 'express';
import { CallbackType, HandlerType, RouteData, VariantData } from '../types';
import logger from '../utils/logger';
import { getValidMethod } from '../utils/method-utils';

export class Route {
  private _activeVariant = 'default';
  private _variants: Map<string, VariantData> = new Map<string, VariantData>();
  private routeData;

  public get activeVariant() {
    return this._activeVariant;
  }

  public id: string;
  public method: string;
  public path: string | RegExp;

  constructor(routeData: RouteData) {
    this.routeData = routeData;
    this.id = routeData.id;
    this.method = getValidMethod(routeData.method);
    this.path = routeData.path;
  }

  /**
   * Called to process express endpoint of this mock route
   * @param req
   * @param res
   * @param next
   */
  public processRequest: RequestHandler = (req, res, next) => {
    let callback: CallbackType;
    // let callback: any;
    let handler: HandlerType;

    // 1. Read variant from request header
    //  const variantFromRequestHeader = request.headers['x-request-variant'];
    // 2. Read variant from session state
    //  const sessionFromRequestHeader = request.headers['x-request-session'];
    // 3. Read variant from route state
    if (this._activeVariant === 'default') {
      callback = this.routeData.callback;
      handler = this.routeData.handler;
    } else {
      callback = this._variants.get(this._activeVariant).callback;
      handler = this._variants.get(this._activeVariant).handler;
    }

    logger.info(
      `Processing request for path ${this.path} with active variant ${this._activeVariant} of variants with size ${this._variants.size}`
    );

    if (callback) {
      callback(req, res, this);
    } else if (handler) {
      handler.call(this, req, res);
    } else {
      res.send('no match');
    }
  };

  public executionContext(req: any) {
    return {
      state: () => {},
      input: () => {},
      meta: () => {},
      route: this.routeData,
      variant: 'Hi',
    };
  }

  public setVariant = (variantId: string) => {
    if (this._variants.has(variantId) || variantId === 'default') {
      logger.info(
        'Setting active variant for ' + this.path + ' to ' + variantId
      );
      this._activeVariant = variantId;
    } else {
      logger.warn(
        `Could not find variant "${variantId}" in route ${this.id} (${this.method} ${this.routeData.path}})`
      );
      // return new Error('no variants found with id: ' + variantId);
    }
    // return {
    //   id,
    //   method,
    //   path,
    //   variant,
    //   variants: _variants,
    //   setVariant,
    //   activeVariant: _activeVariant,
    //   processRequest,
    // };
    return this;
  };

  /**
   * Add variant to this route
   * Returns everything to allow for chaining e.g. mezzo.route(x).variant(y).variant(z);
   * @param variantData
   * @returns
   */
  public variant = (variantData: VariantData) => {
    this._variants.set(variantData.id, variantData);
    logger.info(
      `Adding to variants, size of ${this.path} is now ${this._variants.size}`
    );
    return this;
    // return {
    //   id,
    //   method,
    //   path,
    //   variant,
    //   variants: _variants,
    //   setVariant,
    //   activeVariant: _activeVariant,
    //   processRequest,
    // };
  };
}
