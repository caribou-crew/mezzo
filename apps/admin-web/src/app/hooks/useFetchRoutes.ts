import { MEZZO_API_PATH } from '@caribou-crew/mezzo-constants';
import { RouteItemType, VariantCategory } from '@caribou-crew/mezzo-interfaces';
import { useEffect, useState } from 'react';

export interface URLHashCallback {
  routes: RouteItemType[];
  initialText: string;
}

/**
 * Fetches array of routes via api
 * @returns
 */
export default function useFetchRoutes() {
  const [routes, setRoutes] = useState<RouteItemType[]>([]);
  const [version, setVersion] = useState<string>('');
  const [variantCategories, setVariantCategories] = useState<VariantCategory[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${MEZZO_API_PATH}/routes`);
      const data = await response.json();
      setRoutes(data.routes);
      setVersion(data.appVersion);
      setVariantCategories(
        (data.variantCategories || []).sort(
          (a: VariantCategory, b: VariantCategory) =>
            (a?.order ?? 0) - (b?.order ?? 0)
        )
      );
    };

    fetchData().catch(console.error);
  }, []);

  return { routes, version, variantCategories };
}
