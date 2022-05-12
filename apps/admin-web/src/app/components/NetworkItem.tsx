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
  onClick: any;
}

const NetworkItem = ({
  uuid,
  url,
  request,
  response,
  date,
  deltaTime,
  duration,
  onClick,
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
          p: 0.2,
          gap: 0,
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
        marginBottom: 1,
        padding: 0,
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        style={{ padding: 0 }}
      >
        {_renderTitle()}
      </Box>
    </Paper>
  );
};

export default NetworkItem;
