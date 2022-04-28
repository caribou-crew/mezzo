import { Grid, Typography } from '@mui/material';

import { RouteItemType, VariantCategory } from '@caribou-crew/mezzo-interfaces';
import VariantButton from './VariantButton';

type Props = {
  category: VariantCategory;
  route: RouteItemType;
  activeVariant: string;
  setActiveVariant: (arg0: string) => void;
};

const RouteCategory = ({
  route,
  category,
  activeVariant,
  setActiveVariant,
}: Props) => {
  const variants = route.variants.filter((v) => v.category === category?.name);
  if (variants.length === 0) {
    return null;
  }
  return (
    <>
      <Typography variant="subtitle2" sx={{ pt: 2 }}>
        {category?.name ?? 'Variants'}
      </Typography>
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {route.variants
          .filter((v) => v.category === category?.name)
          .map((variant, index) => (
            <Grid key={index} item xs={12} sm={12} md={6}>
              <VariantButton
                key={`${route.id}:${variant.id}`}
                activeVariant={activeVariant}
                setActiveVariant={setActiveVariant}
                route={route}
                variant={variant}
              />
            </Grid>
          ))}
      </Grid>
    </>
  );
};

export default RouteCategory;
