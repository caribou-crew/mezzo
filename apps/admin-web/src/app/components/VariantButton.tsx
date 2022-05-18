import mezzoClient from '@caribou-crew/mezzo-core-client';
import {
  RouteItemType,
  SetRouteVariant,
  VariantItem,
} from '@caribou-crew/mezzo-interfaces';
import { Button, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import DynamicIcon from './DynamicIcon';

type Props = {
  activeVariant: string;
  setActiveVariant: (id: string) => void;
  route: RouteItemType;
  variant: VariantItem;
};
export default function VariantButton(props: Props) {
  const { route, variant, activeVariant, setActiveVariant } = props;
  const activeRouteVariant = activeVariant === variant.id;
  return (
    <Button
      variant="contained"
      fullWidth
      sx={{
        backgroundColor: activeRouteVariant ? blue[900] : blue[300],
      }}
      onClick={() => {
        const myVariants: SetRouteVariant = [
          {
            routeID: route.id,
            variantID: variant.id,
          },
        ];
        const client = mezzoClient();
        client.updateMockVariant(myVariants);
        setActiveVariant(variant.id);
      }}
    >
      <Typography noWrap>{variant.label ?? variant.id}</Typography>
      {variant?.icons?.map((icon, idx) => (
        <DynamicIcon
          key={`${route.id}:${variant.id}-icon:${icon.name}`}
          style={{ marginLeft: 5 }}
          {...icon}
        />
      ))}
    </Button>
  );
}
