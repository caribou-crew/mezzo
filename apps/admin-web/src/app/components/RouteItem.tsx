import { useState } from 'react';
import {
  Container,
  Button,
  Paper,
  Typography,
  Box,
  Divider,
} from '@mui/material';

import { red, purple, green, blue, orange } from '@mui/material/colors';
import { OpenInNew } from '@mui/icons-material';
import { openInNewTab, openJsonInNewTab } from '../utils/urlHelper';
import {
  RouteItemType,
  RouteOrVariantIcon,
  VariantCategory,
} from '@caribou-crew/mezzo-interfaces';
import DynamicIcon from './DynamicIcon';
import RouteCategory from './RouteCategory';

type Props = {
  route: RouteItemType;
  selectedItem: string;
  setSelectedItem: (id: string) => void;
  variantCategories: VariantCategory[];
};

const RouteItem = ({
  route,
  selectedItem,
  setSelectedItem,
  variantCategories,
}: Props) => {
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
          <b>Path: </b>
          {route.path}
        </Typography>
        {selectedItem !== route.id && activeVariant !== 'default' && (
          <Typography noWrap variant="body1">
            <b>Variant: </b>
            {activeVariant}
          </Typography>
        )}
      </Box>
    );
  };

  const GetLinkableIcon = (icon: RouteOrVariantIcon) => {
    if (icon.link) {
      return (
        <Button
          onClick={(event) => {
            event.stopPropagation();
            icon?.link && openInNewTab(icon.link);
          }}
        >
          <DynamicIcon {...icon} />
        </Button>
      );
    } else {
      return (
        <Container
          sx={{
            width: 60,
            alignSelf: 'center',
          }}
        >
          <DynamicIcon {...icon} />
        </Container>
      );
    }
  };

  const _renderInteractiveButtons = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        {route?.titleIcons?.map((icon, index) => (
          <GetLinkableIcon key={`${icon.name}:${index}`} {...icon} />
        ))}
        <Button
          variant="contained"
          size="small"
          sx={{
            mr: 2,
            backgroundColor: getColors().textColor,
            maxHeight: 30,
            alignSelf: 'center',
          }}
          onClick={(event) => {
            if (route.method?.toUpperCase() === 'GET') {
              event.stopPropagation();
              openInNewTab(route.path.toString());
            } else {
              event.stopPropagation();
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
          <OpenInNew />
        </Button>
        <Container
          disableGutters
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
        cursor: 'pointer',
        marginBottom: 15,
      }}
      onClick={() =>
        route.id === selectedItem
          ? setSelectedItem('')
          : setSelectedItem(route.id)
      }
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
          <Container
            sx={{ pt: 2, pb: 2 }}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <Typography variant="subtitle2">Details</Typography>
            <Typography variant="body2">
              Route Id: {<span style={{ color: 'green' }}>{route.id}</span>}
            </Typography>
            <Typography noWrap variant="body2">
              Active Variant Id:{' '}
              {<span style={{ color: 'green' }}>{activeVariant}</span>}
            </Typography>
            {variantCategories.map((category, index) => (
              <RouteCategory
                key={`${category}:${index}`}
                category={category}
                route={route}
                activeVariant={activeVariant}
                setActiveVariant={setActiveVariant}
              />
            ))}
          </Container>
        </Box>
      )}
    </Paper>
  );
};

export default RouteItem;
