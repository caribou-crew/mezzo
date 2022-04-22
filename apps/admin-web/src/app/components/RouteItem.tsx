import { useState } from 'react';
import { Container, Paper, Typography, Box, Divider } from '@mui/material';

import { red, purple, green, blue, orange } from '@mui/material/colors';
import { Button } from '@mui/material';
import { Bookmark, Visibility } from '@mui/icons-material';
import { openInNewTab, openJsonInNewTab } from '../utils/urlHelper';
import { GetMezzoRoutesRouteData } from '@caribou-crew/mezzo-interfaces';

type Props = {
  route: GetMezzoRoutesRouteData;
  selectedItem: string;
  setSelectedItem: (id: string) => void;
};

const RouteItem = ({ route, selectedItem, setSelectedItem }: Props) => {
  const [activeVariant, setActiveVariant] = useState('default');

  const getColors = () => {
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

    return { backgroundColor, textColor };
  };

  const _renderRouteTitle = () => {
    return (
      <Typography variant="body1" sx={{ p: 2 }} style={{ color: 'black' }}>
        {route.path}
      </Typography>
    );
  };

  const _renderInteractiveButtons = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        {/* I think this is too much, I thought it was a button and was confused when it didn't work, accordion is enough */}
        {/* {selectedItem === route.id && (
          <Visibility
            color="primary"
            sx={{ alignSelf: 'center', mr: 1 }}
          ></Visibility>
        )} */}
        <Button
          variant="contained"
          size="small"
          sx={{
            mr: 2,
            backgroundColor: getColors().textColor,
            maxHeight: 30,
            alignSelf: 'center',
          }}
          onClick={() => {
            if (route.method?.toUpperCase() === 'GET') {
              openInNewTab(route.path.toString());
            } else {
              // If not a POST, currently assumes response is always JSON, fetch via API then open
              fetch(route.path.toString(), {
                method: route.method,
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: route.method === 'GET' ? undefined : '{}',
              })
                .then((r) => r.json())
                .then(openJsonInNewTab);
            }
          }}
        >
          <Bookmark />
        </Button>
        <Container
          sx={{
            backgroundColor: getColors().textColor,
            pt: '15px',
            width: '100px',
          }}
        >
          <Typography sx={{ color: 'white', textAlign: 'center' }}>
            {route.method}
          </Typography>
        </Container>
      </Box>
    );
  };

  return (
    <Paper
      style={{
        backgroundColor: getColors().backgroundColor,
        overflow: 'hidden',
      }}
      onClick={() => route.id === selectedItem ? setSelectedItem("") : setSelectedItem(route.id)}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {_renderRouteTitle()}
        {_renderInteractiveButtons()}
      </Box>
      {selectedItem === route.id && (
        <Box>
          <Divider></Divider>
          <Container sx={{ pt: 2 }}>
            <Typography variant="subtitle2">Details</Typography>
            <Typography variant="body2">
              Route Id: {<span style={{ color: 'green' }}>{route.id}</span>}
            </Typography>
            <Typography variant="body2">
              Active Variant Id:{' '}
              {<span style={{ color: 'green' }}>{activeVariant}</span>}
            </Typography>
            <Typography variant="subtitle2" sx={{ pt: 2 }}>
              Variants
            </Typography>
            <Container
              disableGutters
              sx={{
                pb: 2,
                mt: 2,
                ml: 8,
              }}
            >
              {route.variants.map((variant, index) => {
                const activeRouteVariant = activeVariant === variant.id;
                return (
                  <Button
                    key={variant.id}
                    variant="contained"
                    sx={{
                      backgroundColor: activeRouteVariant
                        ? blue[900]
                        : blue[300],
                      width: '40%',
                      mr: '1%',
                      mb: 1,
                    }}
                    onClick={() => {
                      // TODO investigate why this works with ../
                      fetch(`../_admin/api/routeVariants/set`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ [route.id]: variant.id }),
                      });
                      setActiveVariant(variant.id);
                    }}
                  >
                    {variant.label ?? variant.id}
                  </Button>
                );
              })}
            </Container>
          </Container>
        </Box>
      )}
    </Paper>
  );
};

export default RouteItem;
