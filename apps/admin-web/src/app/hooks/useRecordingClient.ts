import { useEffect, useReducer, useRef } from 'react';
import * as log from 'loglevel';
import { RecordedItem } from '@caribou-crew/mezzo-interfaces';
import MezzoClient from '@caribou-crew/mezzo-core-client';

log.setDefaultLevel('debug');

interface MyState {
  items: RecordedItem[];
}

interface MyAction {
  type: string;
  payload?: RecordedItem | RecordedItem[];
}

function reducer(state: MyState, action: MyAction) {
  switch (action.type) {
    case 'add': {
      const payload: RecordedItem = action.payload as RecordedItem;
      // Attempt to update existing, if not add
      const existingIndex = state.items.findIndex(
        (i) => i.uuid === payload.uuid
      );
      if (existingIndex >= 0) {
        log.debug('[RecordingScreen] Updating existing item');
        const clonedItems = [...state.items];
        clonedItems[existingIndex] = payload;
        // update
        return {
          ...state,
          items: clonedItems,
        };
      } else {
        log.debug('[RecordScreen] Add new item');
        //add
        return {
          ...state,
          items: [...state.items, payload],
        };
      }
    }
    case 'set': {
      const payload: RecordedItem[] = action.payload as RecordedItem[];
      return {
        ...state,
        items: payload,
      };
    }
    case 'reset': {
      return {
        ...state,
        items: [],
      };
    }
    default:
      throw new Error();
  }
}

const initialState: MyState = {
  items: [],
};

export default function useRecordingClient() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const mezzoClient = useRef<ReturnType<typeof MezzoClient> | null>(null);

  useEffect(() => {
    const onCommand = (data: any) => {
      log.debug('[useRecordingClient] received', data);
      if (data.type === 'api.request' || data.type === 'api.response') {
        const message: RecordedItem = data;
        dispatch({ type: 'add', payload: message });
      }
    };

    if (mezzoClient.current == null) {
      const mc = MezzoClient({
        useRelativeUrl: true,
        createSocket: (path?: string) => new WebSocket(path ?? ''),
        name: 'Admin Web',
        onCommand,
        onDisconnect: () => {
          log.warn('[connection] Disconnect');
        },
        onConnect: () => {
          log.info('[connection] Connect');
        },
      });

      log.debug('[useRecordingClinet] connecting');
      mezzoClient.current = mc;
      mezzoClient.current.connect();
    }

    return () => {
      log.info('[useRecordingClient] unmount, calling close on socket');
      mezzoClient.current?.send('close'); // server will detect disconnect, but this way client can also signal it's done
      mezzoClient.current?.close();
      mezzoClient.current = null;
    };
  }, [dispatch]);

  return { state, dispatch, mezzoClient };
}
