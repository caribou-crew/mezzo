import React, { useEffect, useState } from 'react';
import { GetMezzoRoutesRouteData } from '@caribou-crew/mezzo-interfaces';

import {
  TextField,
  Stack,
  Autocomplete,
  Grid,
  Box,
  Container,
  Button,
  Typography,
} from '@mui/material';
import RouteItem from './components/RouteItem';
import Header from './components/Header';

export const App = () => {
  const [routes, setRoutes] = useState<GetMezzoRoutesRouteData[]>([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/_admin/routes');
      const data = await response.json();
      setRoutes(data.routes);
    };

    fetchData().catch(console.error);
  }, []);

  const renderRoutelist = () => {
    const listOfRoutes: JSX.Element[] = [];
    if (Array.isArray(routes) && routes.length > 0) {
      routes.forEach((route) => {
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

  const sortByMethod = () => {
    const sortedRoutes = [...routes].sort((a, b) =>
      // @ts-ignore
      a.method < b.method ? -1 : 1
    );
    setRoutes(sortedRoutes);
  };

  const sortByPath = () => {
    // @ts-ignore
    const sortedRoutes = [...routes].sort((a, b) => (a.path < b.path ? -1 : 1));
    setRoutes(sortedRoutes);
  };

  const search = (value: any) => {
    const routeIndex = [...routes].findIndex(
      (routeData) => (value?.label ?? value) === routeData.path
    );

    if (routeIndex !== -1) {
      const searchedRoute = routes[routeIndex];
      routes.splice(routeIndex, 1);
      routes.splice(0, 0, searchedRoute);
      setRoutes(routes);
      setSelectedItem(searchedRoute?.id);
    } else {
      setErrorMessage('Unable to find the route.');
    }
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
        <Button variant="outlined" onClick={() => sortByMethod()}>
          Method
        </Button>
        <Button variant="outlined" onClick={() => sortByPath()}>
          Route Path
        </Button>
      </Container>
    );
  };

  const _renderAutoCompleteTextInput = () => {
    return (
      <Container>
        <Autocomplete
          disablePortal
          freeSolo
          id="combo-box-search"
          options={routes.map((route) => ({
            label: route.path,
            id: route.id,
          }))}
          renderInput={(params) => <TextField {...params} label="Search..." />}
          value=""
          onChange={(_event, searchParam) => {
            setErrorMessage('');
            !!searchParam && search(searchParam);
          }}
        />
        {errorMessage !== '' && (
          <Typography sx={{ pt: 1, color: 'red' }}>{errorMessage}</Typography>
        )}
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
