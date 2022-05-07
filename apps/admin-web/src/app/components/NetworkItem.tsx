import {
  Container,
  Button,
  Paper,
  Typography,
  Box,
  Divider,
} from '@mui/material';

import { red, purple, green, blue, orange } from '@mui/material/colors';
import { RecordedItem } from '@caribou-crew/mezzo-interfaces';

interface Props extends RecordedItem {
  selectedUUID: string;
  setSelectedUUID: (id: string) => void;
}

const NetworkItem = ({
  uuid,
  url,
  request,
  response,
  date,
  deltaTime,
  duration,
  selectedUUID,
  setSelectedUUID,
}: Props) => {
  const getColors = () => {
    // let backgroundColor;
    // let textColor;
    // if (endTime == null) {
    //   backgroundColor = orange[50];
    //   textColor = orange[800];
    // } else {
    const backgroundColor = green[50];
    const textColor = green[800];
    // }
    return { backgroundColor, textColor };
  };

  const _renderTitle = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          p: 2,
          gap: 2,
        }}
      >
        <Typography noWrap variant="body1">
          <b>{request.method}</b> {url}
        </Typography>
      </Box>
    );
  };

  return (
    <Paper
      style={{
        backgroundColor: getColors().backgroundColor,
        overflow: 'hidden',
        cursor: 'pointer',
        marginBottom: 15,
      }}
      onClick={() =>
        uuid === selectedUUID ? setSelectedUUID('') : setSelectedUUID(uuid)
      }
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {_renderTitle()}
      </Box>
      {selectedUUID === uuid && (
        <Box>
          <Divider></Divider>
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
      )}
    </Paper>
  );
};

export default NetworkItem;
