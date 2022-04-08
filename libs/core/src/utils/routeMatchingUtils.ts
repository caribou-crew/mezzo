import { Route } from '../models/route-model';

export function findRoute(method: string, path: string, userRoutes: Route[]) {
  return userRoutes.find(
    (route) =>
      path === route.path && method.toUpperCase() === route.method.toUpperCase()
  );
}
export function findRouteById(id: string, userRoutes: Route[]) {
  return userRoutes.find((route) => id === route.id);
}
export function findRouteIndexById(id: string, userRoutes: Route[]) {
  return userRoutes.findIndex((route) => id === route.id);
}

export function findRouteIndex(
  method: string,
  path: string,
  userRoutes: Route[]
) {
  return userRoutes.findIndex(
    (route) =>
      path === route.path && method.toUpperCase() === route.method.toUpperCase()
  );
}
