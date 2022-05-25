import React from 'react';
import mezzoClient from '@caribou-crew/mezzo-core-client';
import {
  Container,
  Typography,
  IconButton,
  Box,
  Paper,
  Divider,
} from '@mui/material';
import { Profile, RouteVariant } from '@caribou-crew/mezzo-interfaces';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import ProfileButton from './ProfileButton';
import DeleteProfileButton from './DeleteProfileButton';

interface DetailsExpanded {
  profileName: string;
  isExpanded: boolean;
}
const ProfileDetails = ({
  profile,
  type,
  setSelectedProfile,
  setMatchedProfile,
  client,
  selectedProfile,
  setLocalProfiles,
  setDetailsExpanded,
  detailsExpanded,
  setActiveVariants,
}: {
  profile: Profile;
  type: string;
  setLocalProfiles: (arg0: Profile[]) => void;
  setDetailsExpanded: (arg0: DetailsExpanded) => void;

  client: ReturnType<typeof mezzoClient>;
  setMatchedProfile: (arg0: string) => void;
  setSelectedProfile: (arg0: string) => void;
  selectedProfile: string;
  detailsExpanded: DetailsExpanded;
  setActiveVariants: (arg0: RouteVariant[]) => void;
}) => {
  return (
    <Paper key={profile.name} sx={{ mb: 1.5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <ProfileButton
            setSelectedProfile={setSelectedProfile}
            setMatchedProfile={setMatchedProfile}
            profile={profile}
            client={client}
            selectedProfile={selectedProfile}
            setActiveVariants={setActiveVariants}
          />
          <Typography variant="subtitle1">{profile.name}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {type === 'local' && (
            <DeleteProfileButton
              profile={profile}
              setLocalProfiles={setLocalProfiles}
            />
          )}
          <IconButton
            onClick={() => {
              profile.name === detailsExpanded.profileName
                ? setDetailsExpanded({
                    profileName: '',
                    isExpanded: false,
                  })
                : setDetailsExpanded({
                    profileName: profile.name,
                    isExpanded: !detailsExpanded,
                  });
            }}
          >
            {detailsExpanded.profileName === profile.name &&
            !detailsExpanded.isExpanded ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )}
          </IconButton>
        </Box>
      </Box>
      {detailsExpanded.profileName === profile.name && (
        <>
          <Divider />
          <Container sx={{ mt: 1, pb: 2 }}>
            <Typography variant="subtitle2" component="p">
              Routes:
            </Typography>
            {profile.variants.map((i) => (
              <>
                <Typography
                  variant="subtitle2"
                  component="p"
                  noWrap
                  sx={{ ml: 2, mt: 0.5 }}
                >
                  {i.routeID}
                </Typography>
                <Typography
                  variant="subtitle2"
                  component="p"
                  noWrap
                  sx={{ ml: 6, mt: 0.5 }}
                >
                  Variant: {i.variantID}
                </Typography>
              </>
            ))}
          </Container>
        </>
      )}
    </Paper>
  );
};

export default ProfileDetails;
