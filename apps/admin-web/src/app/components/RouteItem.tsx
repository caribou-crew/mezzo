import { Paper, Typography } from '@mui/material';
import { UserRoute } from '@caribou-crew/mezzo-api-interfaces';

import { red, purple, green, blue, orange } from '@mui/material/colors';
import { Chip, Grid, Button } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { openJsonInNewTab } from '../utils/urlHelper';

type Props = {
  route: UserRoute;
};

const RouteItem = ({ route }: Props) => {
  let backgroundColor;
  let textColor;
  switch (route.method) {
    case 'GET':
      backgroundColor = blue[50];
      textColor = blue[800];
      break;
    case 'POST':
      backgroundColor = green[50];
      textColor = green[800];
      break;
    case 'PUT':
      backgroundColor = purple[50];
      textColor = purple[800];
      break;
    case 'DELETE':
      backgroundColor = red[50];
      textColor = red[800];
      break;
    case 'PATCH':
      backgroundColor = orange[50];
      textColor = orange[800];
      break;
    default:
      break;
  }
  return (
    <Paper style={{ backgroundColor }}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={4}>
          <Typography
            variant="body1"
            sx={{ p: 2 }}
            style={{ color: textColor }}
          >
            {route.path}
          </Typography>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4} sx={{ pr: 2 }}>
          <Grid container xs={12} justifyContent="flex-end">
            <Button
              variant="contained"
              sx={{ mr: 2, backgroundColor: textColor }}
              onClick={() =>
                fetch(route.path, {
                  method: route.method,
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: route.method === 'GET' ? undefined : '{}',
                })
                  .then((r) => r.json())
                  .then(openJsonInNewTab)
              }
            >
              <Visibility></Visibility>
            </Button>
            <Chip
              label={route.method}
              variant="outlined"
              style={{ color: textColor }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RouteItem;
