import { RouteItemType } from '@caribou-crew/mezzo-interfaces';
import { useState } from 'react';

export interface URLHashCallback {
  routes: RouteItemType[];
  initialText: string;
}

/**
 * Sorts routes based on selected property and direction
 * @param routes
 * @returns
 */
export default function useRouteSort(routes: RouteItemType[]) {
  const sortAsc = 1;
  const [sortedByProperty, setSortedBy] = useState('');
  const [sortDirection, setSortDirection] = useState(sortAsc);

  const setSort = (property: string) => {
    let mySortDirection = sortDirection;
    if (sortedByProperty === property) {
      mySortDirection *= -1;
      setSortDirection(mySortDirection);
    } else {
      setSortedBy(property);
    }
  };

  const outRoutes = [...routes].sort((a: any, b: any) =>
    a?.[sortedByProperty] < b?.[sortedByProperty]
      ? -1 * sortDirection
      : sortDirection
  );
  return { routes: outRoutes, setSort, sortDirection, sortedByProperty };
}
