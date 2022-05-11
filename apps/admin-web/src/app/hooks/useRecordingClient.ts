import { useEffect, useReducer, useRef, useState } from 'react';
import * as log from 'loglevel';
import { RecordedItem } from '@caribou-crew/mezzo-interfaces';
import {
  MezzoClient,
  MezzoRecordingClient,
} from '@caribou-crew/mezzo-core-client';
import { DEFAULT_PORT } from '@caribou-crew/mezzo-constants';
log.setDefaultLevel('debug');

interface MyState {
  items: RecordedItem[];
}

interface MyAction {
  type: string;
  payload: RecordedItem | RecordedItem[];
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
    default:
      throw new Error();
  }
}

const initialState: MyState = {
  items: [],
};
export default function useRecordingClient() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const mezzoClient = useRef<MezzoRecordingClient | null>(null);

  useEffect(() => {
    const onCommand = (data: any) => {
      log.debug('[RecordScreen useEffect] on command', data);
      if (data.type === 'api.response') {
        const message: RecordedItem = data;
        log.debug('[RecordScreen] onCommand api.response', message);
        dispatch({ type: 'add', payload: message });
      }
    };
    const mc = new MezzoClient().initRecording({
      createSocket: (path?: string) => new WebSocket(path ?? ''),
      port: DEFAULT_PORT,
      host: 'localhost',
      name: 'Admin Web',
      client: {},
      getClientId: () => {
        return new Promise((resolve) => resolve('Some Temp id from client'));
      },
      onCommand,
    });
    mezzoClient.current = mc.recordingClient;

    return () => {
      if (mezzoClient.current?.readyState === WebSocket.OPEN) {
        mezzoClient.current?.send('Close');
        mezzoClient.current?.close();
      }
    };
  }, [dispatch]);

  return { state, dispatch, mezzoClient };
}
