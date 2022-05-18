import { MEZZO_API_PATH } from '@caribou-crew/mezzo-constants';
import {
  GetRoutesResponse,
  RouteItemType,
  VariantCategory,
} from '@caribou-crew/mezzo-interfaces';
import { useEffect, useState } from 'react';
import { MezzoClient } from '@caribou-crew/mezzo-core-client';

export interface URLHashCallback {
  routes: RouteItemType[];
  initialText: string;
}

/**
 * Fetches array of routes via api
 * @return
 */
export default function useFetchRoutes() {
  const [routes, setRoutes] = useState<RouteItemType[]>([]);
  const [version, setVersion] = useState<string>('');
  const [variantCategories, setVariantCategories] = useState<VariantCategory[]>(
    []
  );
  const client = new MezzoClient().initVariant();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = (await client.variantClient?.getRoutes()) || {};
      if (data) {
        setRoutes(data?.routes);
        setVersion(data?.appVersion);
        setVariantCategories(
          (data?.variantCategories || []).sort(
            (a: VariantCategory, b: VariantCategory) =>
              (a?.order ?? 0) - (b?.order ?? 0)
          )
        );
      }
    };

    fetchData().catch(console.error);
  }, []);

  return { routes, version, variantCategories };
}
