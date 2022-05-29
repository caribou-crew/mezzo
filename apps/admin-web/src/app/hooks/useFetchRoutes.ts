import { RouteItemType, VariantCategory } from '@caribou-crew/mezzo-interfaces';
import { useContext, useEffect, useState } from 'react';
import { ClientContext } from '../context';
// import mezzoClient from '@caribou-crew/mezzo-core-client';

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
  const [isLoading, setIsLoading] = useState(false);
  const [variantCategories, setVariantCategories] = useState<VariantCategory[]>(
    []
  );

  const client = useContext(ClientContext);
  // const client = mezzoClient({
  //   useRelativeUrl: true,
  // });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data } = (await client.getRoutes()) || {};
      if (data) {
        setRoutes(data?.routes);
        setVariantCategories(
          (data?.variantCategories || []).sort(
            (a: VariantCategory, b: VariantCategory) =>
              (a?.order ?? 0) - (b?.order ?? 0)
          )
        );
      }
      setIsLoading(false);
    };

    fetchData().catch(console.error);
  }, []);

  return { routes, variantCategories, isLoading };
}
