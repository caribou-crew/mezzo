import { Typography, IconButton, Box } from '@mui/material';
import { Save } from '@mui/icons-material';
import { RouteVariant } from '@caribou-crew/mezzo-interfaces';
import mezzoClient from '@caribou-crew/mezzo-core-client';

const SaveButton = ({
  type,
  client,
  onSave,
}: {
  type: string;
  client: ReturnType<typeof mezzoClient>;
  onSave: (name: string, variants: RouteVariant[]) => void;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ml: 2,
      }}
    >
      <Typography variant="body1" component="p">
        Save as {type} profile:
      </Typography>
      <IconButton
        color="primary"
        onClick={async () => {
          const enteredName = prompt('Please enter profile name');
          if (enteredName) {
            const { data } = (await client.getActiveVariants()) ?? {};
            if (data?.variants) {
              onSave(enteredName, data.variants);
            }
          }
        }}
      >
        <Save />
      </IconButton>
    </Box>
  );
};
export default SaveButton;
