import { DeleteForever } from '@mui/icons-material';
import {
  deleteLocalProfile,
  getLocalProfiles,
} from '../../utils/profileHelper';
import { IconButton } from '@mui/material';
import { Profile } from '@caribou-crew/mezzo-interfaces';

const DeleteProfileButton = ({
  profile,
  setLocalProfiles,
}: {
  profile: Profile;
  setLocalProfiles: (arg0: Profile[]) => void;
}) => {
  return (
    <IconButton
      color="error"
      onClick={() => {
        const shouldDelete = window.confirm(
          'Are you sure you want to remove profile: ' + profile.name
        );
        if (shouldDelete) {
          deleteLocalProfile(profile.name);
          const localProfiles = getLocalProfiles();
          setLocalProfiles(localProfiles);
        }
      }}
    >
      <DeleteForever />
    </IconButton>
  );
};
export default DeleteProfileButton;
