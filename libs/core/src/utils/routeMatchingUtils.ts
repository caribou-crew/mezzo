import { RouteModel } from '../types';

export function findRoute(
  method: string,
  path: string,
  userRoutes: RouteModel[]
) {
  return userRoutes.find(
    (route) =>
      path === route.path && method.toUpperCase() === route.method.toUpperCase()
  );
}

export function findRouteIndex(
  method: string,
  path: string,
  userRoutes: RouteModel[]
) {
  return userRoutes.findIndex(
    (route) =>
      path === route.path && method.toUpperCase() === route.method.toUpperCase()
  );
}
