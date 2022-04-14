export interface Message {
  message: string;
}

// TODO: use Route[] from libs/core/src/models/route-model instead
  export interface UserRoute {
    _activeVariant: string;
    _variants:      unknown;
    id:             string;
    method:         string;
    path:           string;
    routeData:      RouteData;
    sessionState:   SessionState;
}

export interface RouteData {
    id:      string;
    path:    string;
    method?:  string;
}

export interface SessionState {
    state: unknown;
}
