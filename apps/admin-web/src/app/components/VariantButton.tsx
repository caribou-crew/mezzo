import { MEZZO_API_PATH } from '@caribou-crew/mezzo-constants';
import {
  GetMezzoRoutesRouteData,
  GetMezzoRoutesVariantData,
} from '@caribou-crew/mezzo-interfaces';
import { Button, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import DynamicIcon from './DynamicIcon';

type Props = {
  activeVariant: string;
  setActiveVariant: (id: string) => void;
  route: GetMezzoRoutesRouteData;
  variant: GetMezzoRoutesVariantData;
};
export default function VariantButton(props: Props) {
  const { route, variant, activeVariant, setActiveVariant } = props;
  const activeRouteVariant = activeVariant === variant.id;
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: activeRouteVariant ? blue[900] : blue[300],
        width: '40%',
        mr: '1%',
        mb: 1,
      }}
      onClick={() => {
        fetch(`${MEZZO_API_PATH}/routeVariants/set`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ [route.id]: variant.id }),
        });
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
