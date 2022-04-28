import { RouteItemType } from '@caribou-crew/mezzo-interfaces';
import { useEffect } from 'react';

export interface URLHashCallback {
  routes: RouteItemType[];
  initialText: string;
}

export type SetFilter = (arg0: string) => void;
const hashKey = 'label';

/**
 * If #label hash is set in URL on load, then set that value as the initial filter
 * @param setFilter
 */
export default function useFilterFromURL(setFilter: SetFilter) {
  useEffect(() => {
    const hash = getURLHash();
    if (hash.key === hashKey) {
      setFilter(hash.value);
    }
  }, [setFilter]);
}

export const getURLHash = () => {
  const [key, hashValue] = window.location.hash.substring(1).split('/');
  return { key, value: decodeURIComponent(hashValue) };
};

export const setURLHash = (value: string) => {
  if (value.length > 0) {
    window.history.replaceState(
      null,
      '',
      `#${hashKey}/${encodeURIComponent(value)}`
    );
  } else {
    window.history.replaceState(null, '', '');
  }
};
