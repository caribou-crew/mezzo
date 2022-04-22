export interface Message {
  message: string;
}

export interface GetMezzoRoutes {
  routes: GetMezzoRoutesRouteData[];
}

export interface RouteOrVariantIcon {
  name: string;
  link?: string;
  color?: string;
}

// TODO, this is almost a duplicate of core/src/types VariantData, address? This is the html facing API return value though
export interface GetMezzoRoutesVariantData {
  id: string;
  label?: string;
  icons?: RouteOrVariantIcon[];
}

// TODO, this is almost a duplicate of core/src/types RouteData, address? This is the html facing API return value though
export interface GetMezzoRoutesRouteData {
  id: string; // GET /appium
  actions?: [];
  activeVariant: string; // default
  // input: {},
  label?: string; // /appium
  method: string; // GET
  path: string | RegExp; // /appium
  variants: GetMezzoRoutesVariantData[];
  // gitUrl: string; // This is custom, add custom scope with any key/value?
  custom?: Record<any, any>;
  titleIcons?: RouteOrVariantIcon[];
}
