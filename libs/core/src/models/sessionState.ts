import { RouteVariants } from '../types';

export class SessionState {
  private state = {};

  public get sessionVariantState() {
    return this.state;
  }

  public getSessionVariantStateForRoute(sessionId: string, routeId: string) {
    return this.state[sessionId]?.[routeId];
  }

  public resetSessionVariantState() {
    this.state = {};
  }

  public resetSessionVariantStateByKey(key: string) {
    delete this.state[key];
  }

  public setSessionVariantStateByKey(
    sessionId: string,
    payload: RouteVariants
  ) {
    this.state[sessionId] = payload;
  }

  public updateSessionVariantStateByKey(
    sessionId: string,
    payload: RouteVariants
  ) {
    const currentData = this.state[sessionId] || {};
    this.state[sessionId] = {
      ...currentData,
      ...payload,
    };
  }
}
