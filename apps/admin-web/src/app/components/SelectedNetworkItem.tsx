import { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab, AppBar } from '@mui/material';

import { RecordedItem } from '@caribou-crew/mezzo-interfaces';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { grey } from '@mui/material/colors';

const SelectedNetworkItem = ({
  url,
  request,
  response,
  date,
  deltaTime,
  duration,
}: RecordedItem) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);

  const updateIndex = (event: React.SyntheticEvent, newValue: number) => {
    setIndex(newValue);
  };

  const updateSubIndex = (event: React.SyntheticEvent, newValue: number) => {
    setSubIndex(newValue);
  };

  const _renderText = (label: string, value: any) => {
    return (
      <Typography variant="subtitle2" sx={{ color: grey[400] }}>
        {label}{' '}
        <Box component="span" color="white">
          {value}
        </Box>
      </Typography>
    );
  };

  const _renderMetadata = () => {
    return (
      <Container sx={{ pt: 2, pb: 2 }}>
        {_renderText('URL', url)}
        {_renderText('Status', response?.status)}
        {_renderText('Method', request?.method)}
        {_renderText('Date', date)}
        {_renderText('Duration', duration)}
        {_renderText('Delta Time', deltaTime)}
      </Container>
    );
  };

  const _renderJSONContent = (jsonObject: any) => {
    return (
      <SyntaxHighlighter
        language="json"
        style={vs2015}
        customStyle={{
          padding: '0 5vw',
          margin: 0,
        }}
        wrapLongLines={true}
      >
        {JSON.stringify(jsonObject, null, 2)}
      </SyntaxHighlighter>
    );
  };

  const _renderTabBar = () => {
    return (
      <AppBar position="static">
        <Tabs
          value={index}
          onChange={updateIndex}
          indicatorColor="primary"
          textColor="inherit"
          variant="standard"
        >
          <Tab id="tab-index-0" label="Overview" />
          <Tab id="tab-index-1" label="Request" />
          <Tab id="tab-index-1" label="Reponse" />
        </Tabs>
      </AppBar>
    );
  };

  const _renderResponseTabBar = () => {
    return (
      <AppBar position="static">
        <Tabs
          value={subIndex}
          onChange={updateSubIndex}
          indicatorColor="secondary"
          textColor="inherit"
          variant="standard"
        >
          <Tab id="sub-tab-index-0" label="Headers" />
          <Tab id="sub-tab-index-1" label="JSON" />
        </Tabs>
      </AppBar>
    );
  };

  return (
    <Box style={{ cursor: 'pointer' }}>
      {_renderTabBar()}
      {index === 0 && _renderMetadata()}
      {index === 1 && _renderJSONContent(request.headers)}
      {index === 2 && (
        <>
          {_renderResponseTabBar()}
          {subIndex === 0 && _renderJSONContent(response?.headers)}
          {subIndex === 1 && _renderJSONContent(response?.body)}
        </>
      )}
    </Box>
  );
};

export default SelectedNetworkItem;
