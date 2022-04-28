import React, { useState } from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';

import {
  TextField,
  Grid,
  Box,
  Container,
  Button,
  Typography,
} from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import RouteItem from './components/RouteItem';
import Header from './components/Header';
import useFetchRoutes from './hooks/useFetchRoutes';
import useRouteFilter from './hooks/useRouteFilter';
import useRouteSort from './hooks/useRouteSort';
import useFilterFromURL, { setURLHash } from './hooks/useFilterFromURL';

type SortProperty = 'method' | 'path' | '';
export const App = () => {
  const [selectedItem, setSelectedItem] = useState('');

  const { routes, version, variantCategories } = useFetchRoutes();

  const {
    routes: filteredRoutes,
    setFilterValue,
    filterValue,
  } = useRouteFilter(routes);

  const {
    routes: displayedRoutes,
    setSort,
    sortDirection,
    sortedByProperty,
  } = useRouteSort(filteredRoutes);

  useFilterFromURL(setFilterValue);

  const renderRouteList = () => {
    return displayedRoutes.map((route) => (
      <Flipped key={route.id} flipId={route.id}>
        <div>
          <RouteItem
            route={route}
            variantCategories={variantCategories}
            key={route.id}
            selectedItem={selectedItem}
            setSelectedItem={(id) => setSelectedItem(id)}
          ></RouteItem>
        </div>
      </Flipped>
    ));
  };

  const getSortIcon = (property: SortProperty) => {
    if (sortDirection != null && property === sortedByProperty) {
      return sortDirection > 0 ? <ArrowDropDown /> : <ArrowDropUp />;
    } else {
      return null;
    }
  };

  const filter = (event: any) => {
    const value = event?.target?.value;
    setURLHash(value);
    setFilterValue(value);
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
          onClick={() => setSort('method')}
          startIcon={getSortIcon('method')}
        >
          Method
        </Button>
        <Button
          variant="outlined"
          onClick={() => setSort('path')}
          startIcon={getSortIcon('path')}
        >
          Path
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setSort('')}
          startIcon={getSortIcon('')}
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
          label="Filter"
          variant="outlined"
          onChange={filter}
          value={filterValue}
        />
      </Container>
    );
  };

  const _renderTypography = () => {
    const hasBeenFiltered = filterValue !== '';
    const displayText = hasBeenFiltered
      ? 'No Results Found. Please confirm the value that has been entered is correct.'
      : 'No Routes Available.';
    return (
      <Typography align="center" sx={{ mt: 10 }}>
        {displayText}
      </Typography>
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
            {displayedRoutes.length > 0 ? (
              <Flipper
                flipKey={displayedRoutes.reduce(
                  (prev, current) => prev + current.id,
                  ''
                )}
              >
                {renderRouteList()}
              </Flipper>
            ) : (
              _renderTypography()
            )}
            <Typography align="center" sx={{ mt: 5 }}>
              {version ? `v${version}` : null}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default App;
