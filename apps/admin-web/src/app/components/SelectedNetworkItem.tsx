import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Button,
} from '@mui/material';

import { red, purple, green, blue, orange } from '@mui/material/colors';
import { RecordedItem } from '@caribou-crew/mezzo-interfaces';

type Props = RecordedItem | void;
// type Props = Record<string, unknown>;

const SelectedNetworkItem = (props: Props) => {
  if (!props) {
    return <div>Select an item</div>;
  }
  const { url, request, response, date, deltaTime, duration } = props;
  const getColors = () => {
    const backgroundColor = green[50];
    const textColor = green[800];
    return { backgroundColor, textColor };
  };

  return (
    <Paper
      style={{
        backgroundColor: getColors().backgroundColor,
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
          <Typography variant="body2">
            Headers:{' '}
            {
              <span style={{ color: 'green' }}>
                {JSON.stringify(request?.headers)}
              </span>
            }
          </Typography>
          <Typography variant="subtitle2">Response:</Typography>
          <Typography variant="body2">Status: {response?.status}</Typography>
          <Typography variant="body2">
            Headers:{' '}
            {
              <span style={{ color: 'green' }}>
                {JSON.stringify(response?.headers)}
              </span>
            }
          </Typography>
          <Typography variant="body2">
            Body:{' '}
            {
              <span style={{ color: 'green' }}>
                {JSON.stringify(response?.body)}
              </span>
            }
          </Typography>
        </Container>
      </Box>
    </Paper>
  );
};

export default SelectedNetworkItem;
