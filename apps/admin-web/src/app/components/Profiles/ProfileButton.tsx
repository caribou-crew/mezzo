import { Profile, RouteVariant } from '@caribou-crew/mezzo-interfaces';
import mezzoClient from '@caribou-crew/mezzo-core-client';
import { IconButton } from '@mui/material';
import {
  RadioButtonChecked,
  RadioButtonUncheckedOutlined,
} from '@mui/icons-material';

const ProfileButton = ({
  setSelectedProfile,
  setMatchedProfile,
  client,
  profile,
  selectedProfile,
  setActiveVariants,
}: {
  profile: Profile;
  client: ReturnType<typeof mezzoClient>;
  setMatchedProfile: (arg0: string) => void;
  setSelectedProfile: (arg0: string) => void;
  selectedProfile: string;
  setActiveVariants: (arg0: RouteVariant[]) => void;
}) => {
  return (
    <IconButton
      color="primary"
      onClick={(event) => {
        event.stopPropagation();
        client.setMockVariant(profile.variants);
        setActiveVariants(profile.variants);
        setSelectedProfile(profile.name);
        setMatchedProfile(profile.name);
      }}
    >
      {selectedProfile === profile.name ? (
        <RadioButtonChecked />
      ) : (
        <RadioButtonUncheckedOutlined />
      )}
    </IconButton>
  );
};
export default ProfileButton;
