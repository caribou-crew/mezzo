import { Typography, Box } from '@mui/material';
import { RouteVariant } from '@caribou-crew/mezzo-interfaces';

const Variants = ({ variants }: { variants: RouteVariant[] }) => (
  <>
    {variants.map((variant) => (
      <Variant data={variant} key={variant.routeID} />
    ))}
  </>
);

export const Variant = ({ data }: { data: RouteVariant }) => {
  return (
    <Box sx={{ pt: 0.5, pb: 0.5 }}>
      <Typography noWrap variant="body1">
        <b>Route:</b> {data.routeID}
      </Typography>
      <Typography noWrap variant="body1">
        <b>Selected Varaint:</b> {data.variantID}
      </Typography>
    </Box>
  );
};

export default Variants;
