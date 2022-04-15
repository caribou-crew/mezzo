import React, { useEffect, useState } from 'react';
import { UserRoute } from '@caribou-crew/mezzo-api-interfaces';

import {
  TextField,
  Stack,
  Paper,
  Autocomplete,
  Grid,
  Box,
  Container,
} from '@mui/material';
import RouteItem from './components/RouteItem';
import Header from './components/Header';

export const App = () => {
  const [routes, setRoutes] = useState<UserRoute[]>([]);

  useEffect(() => {
    fetch('/mezzo/routes')
      .then((r) => r.json())
      .then((r) => setRoutes(r.routes));
  }, []);

  const list = () => {
    const listOfRoutes: any[] = [];
    if (Array.isArray(routes) && routes.length > 0) {
      routes.forEach((route) => {
        listOfRoutes.push(<RouteItem route={route} key={route.id}></RouteItem>);
      });
    }
    return listOfRoutes;
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
          <Grid item xs={12} justifyContent="center">
            <Header name="Mezzo"></Header>
            <Autocomplete
              disablePortal
              freeSolo
              id="combo-box-search"
              options={routes.map((route) => ({
                label: route.path,
                id: route.id,
              }))}
              sx={{ pr: '20%', pl: '20%' }}
              renderInput={(params) => (
                <TextField {...params} label="Search..." />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={2}>{list()}</Stack>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default App;
