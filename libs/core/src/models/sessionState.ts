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
    key: string,
    payload: Record<string, string>
  ) {
    this.state[key] = payload;
  }
}
