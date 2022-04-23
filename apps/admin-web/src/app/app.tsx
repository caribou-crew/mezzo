import React, { useEffect, useState } from 'react';
import { GetMezzoRoutesRouteData } from '@caribou-crew/mezzo-interfaces';
import { debounce } from 'lodash-es';

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
import { useSort } from './utils/useSort';
import { MEZZO_API_PATH } from '@caribou-crew/mezzo-constants';
import stringSimilarity from 'string-similarity';

type SortProperty = 'method' | 'path';
export const App = () => {
  const [routes, setRoutes] = useState<GetMezzoRoutesRouteData[]>([]);
  const [displayedRoutes, setDisplayedRoutes] = useState<
    GetMezzoRoutesRouteData[]
  >([]);
  const [selectedItem, setSelectedItem] = useState('');
  const { sortBy, getSortDirection } = useSort();
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${MEZZO_API_PATH}/routes`);
      const data = await response.json();
      setRoutes(data.routes);
      setDisplayedRoutes(data.routes);
    };

    fetchData().catch(console.error);
  }, []);

  const renderRouteList = () => {
    return displayedRoutes.map((route) => (
      <RouteItem
        route={route}
        key={route.id}
        selectedItem={selectedItem}
        setSelectedItem={(id) => setSelectedItem(id)}
      ></RouteItem>
    ));
  };

  const getSortIcon = (property: SortProperty) => {
    const sortDirection = getSortDirection(property);
    if (sortDirection != null) {
      return sortDirection > 0 ? <ArrowDropDown /> : <ArrowDropUp />;
    } else {
      return null;
    }
  };

  const sort = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event?.target?.value;

    const compare = (a: string, b: string) =>
      stringSimilarity.compareTwoStrings(a.toLowerCase(), b.toLowerCase());

    const sortedRoutes = routes.sort(
      (a, b) => compare(b.id, value) - compare(a.id, value)
    );

    setFilterValue(value);
    setDisplayedRoutes(sortedRoutes);
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
          onClick={() => setDisplayedRoutes(sortBy('method', displayedRoutes))}
          startIcon={getSortIcon('method')}
        >
          Method
        </Button>
        <Button
          variant="outlined"
          onClick={() => setDisplayedRoutes(sortBy('path', displayedRoutes))}
          startIcon={getSortIcon('path')}
        >
          Path
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setDisplayedRoutes(routes)}
        >
          Default
        </Button>
      </Container>
    );
  };

  const _renderSearchInput = () => {
    return (
      <Container>
        <TextField
          fullWidth
          id="outlined-search"
          type="search"
          label="Search"
          variant="outlined"
          onChange={debounce(sort, 300)}
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
              {_renderSearchInput()}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={2}>{renderRouteList()}</Stack>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default App;
