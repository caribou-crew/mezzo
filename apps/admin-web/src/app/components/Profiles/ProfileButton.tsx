import { Profile } from '@caribou-crew/mezzo-interfaces';
import mezzoClient from '@caribou-crew/mezzo-core-client';
import { IconButton } from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

const ProfileButton = ({
  setSelectedProfile,
  setMatchedProfile,
  client,
  profile,
  selectedProfile,
}: {
  profile: Profile;
  client: ReturnType<typeof mezzoClient>;
  setMatchedProfile: (arg0: string) => void;
  setSelectedProfile: (arg0: string) => void;
  selectedProfile: string;
}) => {
  return (
    <IconButton
      color="primary"
      onClick={() => {
        client.setMockVariant(profile.variants);
        setSelectedProfile(profile.name);
        setMatchedProfile(profile.name);
      }}
    >
      {selectedProfile === profile.name ? (
        <CheckBox />
      ) : (
        <CheckBoxOutlineBlank />
      )}
    </IconButton>
  );
};
export default ProfileButton;
