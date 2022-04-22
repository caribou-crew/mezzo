import { useState } from 'react';

export function useSort() {
  const sortAsc = 1;
  const [sortedBy, setSortedBy] = useState('');
  const [sortDirection, setSortDirection] = useState(sortAsc);

  const sortBy = (property: string, arrayToSort: any[]) => {
    let mySortDirection = sortDirection;
    if (sortedBy === property) {
      mySortDirection *= -1;
      setSortDirection(mySortDirection);
    } else {
      setSortedBy(property);
    }

    return [...arrayToSort].sort((a, b) =>
      a?.[property] < b?.[property] ? -1 * mySortDirection : mySortDirection
    );
  };

  const getSortDirection = (property: string) => {
    if (sortedBy === property) {
      return sortDirection;
    } else {
      return null;
    }
  };

  return { sortBy, getSortDirection };
}
