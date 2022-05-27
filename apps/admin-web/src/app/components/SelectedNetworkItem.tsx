import { Container, Paper, Typography, Box, Button } from '@mui/material';

import { RecordedItem } from '@caribou-crew/mezzo-interfaces';

type Props = RecordedItem | void;

const SelectedNetworkItem = (props: Props) => {
  if (!props) {
    return <div>Select an item</div>;
  }
  const { url, request, response, date, deltaTime, duration } = props;

  return (
    <Paper
      style={{
        overflow: 'hidden',
        cursor: 'pointer',
        marginBottom: 15,
      }}
    >
      <Button>Save to disk (TODO)</Button>
      <Button>Copy as CURL (TODO)</Button>
      <Box>
        {/* <Divider></Divider> */}
        <Container
          sx={{ pt: 2, pb: 2 }}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Typography variant="subtitle2">Details</Typography>
          <Typography variant="body2">
            Date: {date}
            <br />
            Duration: {duration}
            <br />
            DeltaTime: {deltaTime}
          </Typography>
          <Typography variant="subtitle2">Request:</Typography>
          <Typography variant="body2">Headers:</Typography>
          <pre style={{ overflowX: 'scroll' }}>
            {JSON.stringify(request?.headers, null, 2)}
          </pre>
          <Typography variant="subtitle2">Response:</Typography>
          <Typography variant="body2">Status: {response?.status}</Typography>
          <Typography variant="body2">Headers:</Typography>
          <pre style={{ overflowX: 'scroll' }}>
            {JSON.stringify(response?.headers, null, 2)}
          </pre>
          <Typography variant="body2">Body:</Typography>
          <pre style={{ overflowX: 'scroll' }}>
            {JSON.stringify(response?.body, null, 2)}
          </pre>
        </Container>
      </Box>
    </Paper>
  );
};

export default SelectedNetworkItem;
