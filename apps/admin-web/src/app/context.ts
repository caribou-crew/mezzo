import { createContext } from 'react';

import mezzoClient from '@caribou-crew/mezzo-core-client';
export const ClientContext = createContext(mezzoClient());
