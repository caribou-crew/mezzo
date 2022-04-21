import React, { useEffect, useState } from 'react';
import { GetMezzoRoutesRouteData } from '@caribou-crew/mezzo-interfaces';

import {
  TextField,
  Stack,
  Grid,
  Box,
  Container,
  Button,
  Typography,
} from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import RouteItem from './components/RouteItem';
import Header from './components/Header';

type SortProperty = 'method' | 'path';
export const App = () => {
  const sortAsc = 1;
  const [routes, setRoutes] = useState<GetMezzoRoutesRouteData[]>([]);
  const [displayedRoutes, setDisplayedRoutes] = useState<
    GetMezzoRoutesRouteData[]
  >([]);
  const [sortedBy, setSortedBy] = useState('');
  const [sortDirection, setSortDirection] = useState(sortAsc);
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/_admin/routes');
      const data = await response.json();
      setRoutes(data.routes);
      setDisplayedRoutes(data.routes);
    };

    fetchData().catch(console.error);
  }, []);

  const renderRoutelist = () => {
    const listOfRoutes: JSX.Element[] = [];
    if (Array.isArray(displayedRoutes) && displayedRoutes.length > 0) {
      displayedRoutes.forEach((route) => {
        listOfRoutes.push(
          <RouteItem
            route={route}
            key={route.id}
            selectedItem={selectedItem}
            setSelectedItem={(id) => setSelectedItem(id)}
          ></RouteItem>
        );
      });
    }
    return listOfRoutes;
  };

  const sortBy = (property: SortProperty) => {
    let mySortDirection = sortDirection;
    if (sortedBy === property) {
      mySortDirection *= -1;
      setSortDirection(mySortDirection);
    } else {
      setSortedBy(property);
    }

    const sortedRoutes = [...displayedRoutes].sort((a, b) =>
      a?.[property] < b?.[property] ? -1 * mySortDirection : mySortDirection
    );
    setDisplayedRoutes(sortedRoutes);
  };

  const getSortIcon = (property: SortProperty) => {
    if (sortedBy === property) {
      return sortDirection === sortAsc ? <ArrowDropDown /> : <ArrowDropUp />;
    } else {
      return null;
    }
  };

  const filter = (event: any) => {
    const value = event?.target?.value;
    const filteredRoutes = routes.filter((route) => {
      return (
        route?.id?.includes(value) ||
        route?.label?.includes(value) ||
        route?.method?.includes(value)
      );
    });
    setDisplayedRoutes(filteredRoutes);
  };

  const _renderShowByContainer = () => {
    return (
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          mt: 1.1,
          gap: 1,
        }}
      >
        <Typography align="center" variant="h6">
          Sort By:
        </Typography>
        <Button
          variant="outlined"
          onClick={() => sortBy('method')}
          startIcon={getSortIcon('method')}
        >
          Method
        </Button>
        <Button
          variant="outlined"
          onClick={() => sortBy('path')}
          startIcon={getSortIcon('path')}
        >
          Route Path
        </Button>
      </Container>
    );
  };

  const _renderAutoCompleteTextInput = () => {
    return (
      <Container>
        <TextField
          fullWidth
          id="outlined-search"
          type="search"
          label="Filter"
          variant="outlined"
          onChange={filter}
        />
      </Container>
    );
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Header name="Mezzo"></Header>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              {_renderShowByContainer()}
              {_renderAutoCompleteTextInput()}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={2}>{renderRoutelist()}</Stack>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default App;
