import { GetMezzoRoutesRouteData } from '@caribou-crew/mezzo-interfaces';

export const getFilteredRoutes = (
  routes: GetMezzoRoutesRouteData[],
  value: string
) => {
  const filteredRoutes = routes.filter((route) => {
    const searchLower = value?.toLowerCase();
    return (
      route?.id?.toLowerCase()?.includes(searchLower) ||
      route?.label?.toLowerCase()?.includes(searchLower) ||
      route?.method?.toLowerCase()?.includes(searchLower) ||
      route?.path?.toString()?.toLowerCase()?.includes(searchLower)
    );
  });
  return filteredRoutes;
};
