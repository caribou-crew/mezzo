import { RouteItemType } from '@caribou-crew/mezzo-interfaces';
import { useState } from 'react';

export interface URLHashCallback {
  routes: RouteItemType[];
  initialText: string;
}

/**
 * Filters array of routes based on the filterValue
 * @param routes
 * @returns
 */
export default function useRouteFilter(routes: RouteItemType[]) {
  const [filterValue, setFilterValue] = useState('');

  return {
    routes: getFilteredRoutes(routes, filterValue),
    filterValue,
    setFilterValue,
  };
}

const getFilteredRoutes = (routes: RouteItemType[], value: string) => {
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
