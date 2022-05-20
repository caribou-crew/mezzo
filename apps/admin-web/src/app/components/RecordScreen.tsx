import React, { useEffect, useState } from 'react';

import { Button, Container, Typography } from '@mui/material';
import { MEZZO_API_GET_RECORDINGS } from '@caribou-crew/mezzo-constants';

import { RecordedItem } from '@caribou-crew/mezzo-interfaces';
import NetworkItem from './NetworkItem';
import * as log from 'loglevel';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import SelectedNetworkItem from './SelectedNetworkItem';
import useRecordingClient from '../hooks/useRecordingClient';
import { dummyData } from '../utils/dummyData';
import { ToastContainer } from 'react-toastify';

log.setDefaultLevel('debug');

type Props = Record<string, never>;

const ReflexContainerTSFix: any = ReflexContainer;
const ReflexElementTSFix: any = ReflexElement;

export default function RecordScreen(props: Props) {
  const [selectedNetworkItem, setSelectedNetworkItem] =
    useState<RecordedItem>();
  const { state, dispatch, mezzoClient } = useRecordingClient();

  useEffect(() => {
    async function fetchAllRecordsings() {
      const response = await mezzoClient?.current?.getRecordings();
      const recordedItems = response?.data?.items ?? [];
      dispatch({
        type: 'set',
        payload: recordedItems,
      });
    }
    fetchAllRecordsings();
  }, []);

  return (
    <ReflexContainerTSFix orientation="horizontal">
      <ReflexElementTSFix className="left-pane">
        <Container component="main" maxWidth="lg">
          <Button
            variant="outlined"
            onClick={() => {
              mezzoClient.current?.send('api.response', dummyData, false);
            }}
          >
            Load dummy data
          </Button>
          <Button
            variant="outlined"
            onClick={async () => {
              await mezzoClient.current?.deleteRecordings();
              dispatch({ type: 'reset' });
            }}
          >
            Clear
          </Button>
          <br />
          <Typography>Total items: {state.items.length}</Typography>
          Redux:
          {state.items?.map((item: RecordedItem) => (
            <NetworkItem
              key={item.uuid}
              {...item}
              onClick={() => {
                setSelectedNetworkItem(item);
              }}
            />
          ))}
        </Container>
      </ReflexElementTSFix>
      <ReflexSplitter />

      <ReflexElementTSFix className="right-pane" minSize={200}>
        {selectedNetworkItem && (
          <SelectedNetworkItem {...selectedNetworkItem} />
        )}
        <ToastContainer
          position="bottom-center"
          autoClose={2000}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </ReflexElementTSFix>
    </ReflexContainerTSFix>
  );
}
