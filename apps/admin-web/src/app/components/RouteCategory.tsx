import { Container, Typography } from '@mui/material';

import {
  GetMezzoRoutesRouteData,
  VariantCategory,
} from '@caribou-crew/mezzo-interfaces';
import VariantButton from './VariantButton';

type Props = {
  category: VariantCategory;
  route: GetMezzoRoutesRouteData;
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
      <Container
        disableGutters
        sx={{
          ml: 8,
        }}
      >
        {route.variants
          .filter((v) => v.category === category?.name)
          .map((variant, idx) => (
            <VariantButton
              key={`${route.id}:${variant.id}`}
              activeVariant={activeVariant}
              setActiveVariant={setActiveVariant}
              route={route}
              variant={variant}
            />
          ))}
      </Container>
    </>
  );
};

export default RouteCategory;
