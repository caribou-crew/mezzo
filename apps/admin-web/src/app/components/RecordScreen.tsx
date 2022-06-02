import { useEffect, useState, useRef } from 'react';

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
import {
  Clear,
  ClearAll,
  KeyboardDoubleArrowUp,
  KeyboardArrowUp,
  Code,
} from '@mui/icons-material';

import useWindowDimensions from '../hooks/useWindowDimensions';

import '../app.css';

log.setDefaultLevel('debug');

type Props = Record<string, never>;

const ReflexContainerTSFix: any = ReflexContainer;
const ReflexElementTSFix: any = ReflexElement;

export default function RecordScreen(props: Props) {
  const { width } = useWindowDimensions();
  const [selectedNetworkItem, setSelectedNetworkItem] =
    useState<RecordedItem>();
  const { state, dispatch, mezzoClient } = useRecordingClient();

  const divRef = useRef<null | HTMLDivElement>(null);

  const box: any = document.getElementById('out');
  const rect = box?.getBoundingClientRect();

  const scrollToBottom = () => {
    console.log(rect);
    if (rect?.top >= 0 && rect?.bottom <= window.innerHeight) {
      divRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(scrollToBottom, [state.items]);

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
        sx={{ mt: 2, display: 'flex', flexDirection: 'column' }}
        maxWidth="lg"
      >
        {width > 960 && <Typography>Requests: {state.items.length}</Typography>}
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => {
            mezzoClient.current?.send('api.response', dummyData, false);
          }}
        >
          {width >= 960 ? 'Load dummy data' : <ClearAll />}
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{ mt: 2 }}
          onClick={async () => {
            await mezzoClient.current?.deleteRecordings();
            dispatch({ type: 'reset' });
            setSelectedNetworkItem(undefined);
          }}
        >
          {width > 960 ? 'Clear' : <Clear />}
        </Button>
        <Button variant="outlined" sx={{ mt: 2 }}>
          {width > 960 ? 'Export All' : <KeyboardDoubleArrowUp />}
        </Button>
        {selectedNetworkItem && (
          <>
            <Button variant="outlined" sx={{ mt: 2 }}>
              {width > 960 ? 'Export Selected' : <KeyboardArrowUp />}
            </Button>
            <Button variant="outlined" sx={{ mt: 2 }}>
              {width > 960 ? 'Copy Selected as CURL' : <Code />}
            </Button>
          </>
        )}
      </Container>
    );
  };

  const _renderRecordingTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table stickyHeader={true} size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Status</TableCell>
              <TableCell padding="checkbox" align="left">
                Method
              </TableCell>
              <TableCell padding="normal" align="left">
                Host
              </TableCell>
              <TableCell padding="normal" align="left">
                Path
              </TableCell>
              {width >= 1024 && (
                <>
                  <TableCell padding="normal" align="right">
                    Time
                  </TableCell>
                  <TableCell padding="normal" align="right">
                    Delta
                  </TableCell>
                  <TableCell padding="checkbox" align="right">
                    Duration
                  </TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {state.items?.map((item: RecordedItem) => (
              <NetworkItem
                key={item.uuid}
                {...item}
                isSelected={item.uuid === selectedNetworkItem?.uuid}
                onClick={() => setSelectedNetworkItem(item)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <ReflexContainerTSFix orientation="horizontal" component="main">
      <ReflexElementTSFix>
        <ReflexContainerTSFix orientation="vertical">
          <ReflexElementTSFix
            maxSize={300}
            minSize={200}
            className="hideScrollBar"
          >
            {_renderTopLeftMenu()}
          </ReflexElementTSFix>
          <ReflexElementTSFix className="hideScrollBar">
            {_renderRecordingTable()}
            <div id="out" className="hiddenBox" ref={divRef} />
          </ReflexElementTSFix>
        </ReflexContainerTSFix>
      </ReflexElementTSFix>
      <ReflexSplitter />
      <ReflexElementTSFix className="hideScrollBar">
        {selectedNetworkItem ? (
          <SelectedNetworkItem {...selectedNetworkItem} />
        ) : (
          <Container sx={{ mt: 10 }}>
            <Typography align="center">
              Select an item from the table to display additional details.
            </Typography>
          </Container>
        )}
      </ReflexElementTSFix>
    </ReflexContainerTSFix>
  );
}
