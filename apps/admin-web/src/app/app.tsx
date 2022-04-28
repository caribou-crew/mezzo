import React, { useEffect, useState } from 'react';
import { RouteItemType, VariantCategory } from '@caribou-crew/mezzo-interfaces';
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
import { useSort } from './utils/useSort';
import { MEZZO_API_PATH } from '@caribou-crew/mezzo-constants';

type SortProperty = 'method' | 'path';
export const App = () => {
  const [routes, setRoutes] = useState<RouteItemType[]>([]);
  const [version, setVersion] = useState<string>('');
  const [variantCategories, setVariantCategories] = useState<VariantCategory[]>(
    []
  );
  const [displayedRoutes, setDisplayedRoutes] = useState<RouteItemType[]>([]);
  const [selectedItem, setSelectedItem] = useState('');
  const { sortBy, getSortDirection } = useSort();
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${MEZZO_API_PATH}/routes`);
      const data = await response.json();
      setRoutes(data.routes);
      setVersion(data.appVersion);
      setVariantCategories(
        (data.variantCategories || []).sort(
          (a: VariantCategory, b: VariantCategory) =>
            (a?.order ?? 0) - (b?.order ?? 0)
        )
      );
      setDisplayedRoutes(data.routes);
    };

    fetchData().catch(console.error);
  }, []);

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
    const sortDirection = getSortDirection(property);
    if (sortDirection != null) {
      return sortDirection > 0 ? <ArrowDropDown /> : <ArrowDropUp />;
    } else {
      return null;
    }
  };

  const filter = (event: any) => {
    const value = event?.target?.value;
    const filteredRoutes = routes.filter((route) => {
      const searchLower = value?.toLowerCase();
      return (
        route?.id?.toLowerCase()?.includes(searchLower) ||
        route?.label?.toLowerCase()?.includes(searchLower) ||
        route?.method?.toLowerCase()?.includes(searchLower) ||
        route?.path?.toString()?.toLowerCase()?.includes(searchLower)
      );
    });
    setFilterValue(value);
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
          label="Filter"
          variant="outlined"
          onChange={filter}
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
