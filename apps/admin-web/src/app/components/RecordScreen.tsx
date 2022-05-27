import React, { useEffect, useState } from 'react';

import {
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

import { RecordedItem } from '@caribou-crew/mezzo-interfaces';
import NetworkItem from './NetworkItem';
import * as log from 'loglevel';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import SelectedNetworkItem from './SelectedNetworkItem';
import useRecordingClient from '../hooks/useRecordingClient';
import { dummyData } from '../utils/dummyData';

import '../app.css';

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

  const _renderTopLeftMenu = () => {
    return (
      <Container
        sx={{ display: 'flex', flexDirection: 'column' }}
        maxWidth="lg"
      >
        <Typography>Total Requests: {state.items.length}</Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => {
            mezzoClient.current?.send('api.response', dummyData, false);
          }}
        >
          Load dummy data
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{ mt: 2 }}
          onClick={async () => {
            await mezzoClient.current?.deleteRecordings();
            dispatch({ type: 'reset' });
          }}
        >
          Clear
        </Button>
      </Container>
    );
  };

  const _renderRecordingTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell align="left">Method</TableCell>
              <TableCell align="left">Host/Path</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Delta Time</TableCell>
              <TableCell align="right">Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.items?.map((item: RecordedItem) => (
              <NetworkItem
                key={item.uuid}
                {...item}
                onClick={() => setSelectedNetworkItem(item)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <ReflexContainerTSFix
      orientation="horizontal"
      style={{ marginTop: '5rem' }}
      component="main"
    >
      <ReflexElementTSFix>
        <ReflexContainerTSFix orientation="vertical">
          <ReflexElementTSFix maxSize={300} minSize={200}>
            {_renderTopLeftMenu()}
          </ReflexElementTSFix>
          <ReflexElementTSFix className="hideScrollBar">
            {_renderRecordingTable()}
          </ReflexElementTSFix>
        </ReflexContainerTSFix>
      </ReflexElementTSFix>
      <ReflexSplitter />
      <ReflexElementTSFix className="hideScrollBar">
        {selectedNetworkItem && (
          <SelectedNetworkItem {...selectedNetworkItem} />
        )}
      </ReflexElementTSFix>
    </ReflexContainerTSFix>
  );
}
