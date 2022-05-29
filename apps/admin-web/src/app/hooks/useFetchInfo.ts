import { useContext, useEffect, useState } from 'react';
import { ClientContext } from '../context';
// import mezzoClient from '@caribou-crew/mezzo-core-client';

/**
 * Fetches array of routes via api
 * @return
 */
export default function useFetchInfo() {
  const [isLoading, setIsLoading] = useState(false);
  const [version, setVersion] = useState<string>('');
  const [plugins, setPlugins] = useState<string[]>([]);

  const client = useContext(ClientContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data } = (await client.getInfo()) || {};
      if (data) {
        setPlugins(data?.plugins);
        setVersion(data?.appVersion);
      }
      setIsLoading(false);
    };

    fetchData().catch(console.error);
  }, []);

  return {
    version,
    plugins,
    isLoading,
    isRecordingEnabled: plugins.includes('recording-endpoints-plugin'),
    isProfileEnabled: plugins.includes('profiles-plugins'),
  };
}
