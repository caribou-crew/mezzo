import { Request, RequestHandler } from 'express';
import { CallbackType, HandlerType, RouteData, VariantData } from '../types';
import {
  DEFAULT_VARIANT,
  X_REQUEST_SESSION,
  X_REQUEST_VARIANT,
} from '../utils/constants';
import logger from '../utils/logger';
import { getValidMethod } from '../utils/method-utils';
import { SessionState } from './sessionState';

export class Route {
  private _activeVariant = 'default';
  private _variants: Map<string, VariantData> = new Map<string, VariantData>();
  private routeData: RouteData;
  private sessionState: SessionState;

  public getVariants() {
    return this._variants;
  }

  public getActiveVariantId(request?: Request) {
    const variantRequestHeader = request?.get(X_REQUEST_VARIANT);
    const sessionVariantRequestHeader = request?.get(X_REQUEST_SESSION);
    const routeStateVariant = this._activeVariant;
    let sessionVariant = undefined;

    if (sessionVariantRequestHeader) {
      sessionVariant = this.sessionState.getSessionVariantStateForRoute(
        sessionVariantRequestHeader,
        this.id
      );
    }

    return variantRequestHeader || sessionVariant || routeStateVariant;
  }

  // public getActiveVariant(activeVariantId: string) {
  public getActiveVariant() {
    // return this._variants.get(activeVariantId);
    return this._activeVariant;
  }

  public id: string;
  public method: string;
  public label: string;
  public path: string | RegExp;

  constructor(routeData: RouteData, sessionState: SessionState) {
    this.routeData = routeData;
    this.id = routeData.id;
    this.method = getValidMethod(routeData.method);
    this.path = routeData.path;
    this.label = routeData.label;
    this.sessionState = sessionState;
  }

  /**
   * Called to process express endpoint of this mock route
   * @param req
   * @param res
   * @param next
   */
  public processRequest: RequestHandler = (req, res, next) => {
    let callback: CallbackType;
    let handler: HandlerType;

    const activeVariant = this.getActiveVariantId(req);
    const hasVariant = this._variants.has(activeVariant);

    if (!hasVariant || activeVariant === DEFAULT_VARIANT) {
      callback = this.routeData.callback;
      handler = this.routeData.handler;
    } else {
      callback = this._variants.get(activeVariant).callback;
      handler = this._variants.get(activeVariant).handler;
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
  };
}
