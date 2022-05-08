import { SetRouteVariant } from '@caribou-crew/mezzo-interfaces';

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
    payload: SetRouteVariant
  ) {
    this.state[sessionId] = {};
    payload.forEach((item) => {
      this.state[sessionId][item.routeID] = item.variantID;
    });
  }

  public updateSessionVariantStateByKey(
    sessionId: string,
    payload: SetRouteVariant
  ) {
    payload.forEach((item) => {
      this.state[sessionId][item.routeID] = item.variantID;
    });
  }
}
