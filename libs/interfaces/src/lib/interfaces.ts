export interface Message {
  message: string;
}

export interface GetMezzoRoutes {
  routes: GetMezzoRoutesRouteData[];
}

export interface GetMezzoRoutesVariantData {
  id: string;
  // isPACT: boolean, // TODO make this in custom variant section?
  // isPostman: boolean,
  custom?: Record<any, any>;
  label?: string;
  // input
}
export interface GetMezzoRoutesRouteData {
  id: string; // GET /appium
  actions?: [];
  activeVariant: string; // default
  // input: {},
  label?: string; // /appium
  method?: string; // GET
  path: string | RegExp; // /appium
  variants: GetMezzoRoutesVariantData[];
  // gitUrl: string; // This is custom, add custom scope with any key/value?
  custom?: Record<any, any>;
}
