import React, { useContext, useEffect, useState } from 'react';

import {
  Container,
  Typography,
  IconButton,
  Box,
  Paper,
  Divider,
} from '@mui/material';
import {
  CheckBox,
  CheckBoxOutlineBlank,
  DeleteForever,
  Save,
  ExpandMore,
  ExpandLess,
  CopyAll,
} from '@mui/icons-material';
import useFetchRoutes from '../../hooks/useFetchRoutes';
import { Profile, RouteVariant } from '@caribou-crew/mezzo-interfaces';
import mezzoClient from '@caribou-crew/mezzo-core-client';
import {
  deleteLocalProfile,
  getLocalProfiles,
  saveLocalProfile,
} from '../../utils/profileHelper';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import github from 'react-syntax-highlighter/dist/cjs/styles/hljs/github';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { ClientContext } from '../../context';
import { arraysEqual } from '../../utils/equality';

SyntaxHighlighter.registerLanguage('javascript', js);

type Props = Record<string, never>;

export default function ProfilesScreen(props: Props) {
  const client = mezzoClient();
  // const client = useContext(ClientContext);
  const { routes } = useFetchRoutes();

  const [remoteProfiles, setRemoteProfiles] = useState<Profile[]>([]);
  const [localProfiles, setLocalProfiles] = useState<Profile[]>([]);
  const [saveAsRemote, setSaveAsRemote] = useState('');
  const [activeVariants, setActiveVariants] = useState<RouteVariant[]>([]);

  const [selectedProfile, setSelectedProfile] = useState('');
  const [detailsExpanded, setDetailsExpanded] = useState({
    profileName: '',
    isExpanded: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data } = (await client.getRemoteProfiles()) ?? {};
      if (data) {
        setRemoteProfiles(data.profiles);
      }

      // Also read from localstorage
      const localProfiles = getLocalProfiles();
      setLocalProfiles(localProfiles);
    };

    fetchData().catch(console.error);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = (await client.getActiveVariants()) ?? {};
      if (data) {
        setActiveVariants(data.variants);
      }
    };

    fetchData().catch(console.error);
  }, []);

  const _renderProfileButton = (profile: Profile) => {
    return (
      <IconButton
        color="primary"
        onClick={() => {
          client.setMockVariant(profile.variants);
          setSelectedProfile(profile.name);
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

  const _renderDeleteLocalProfileButton = (profile: Profile) => {
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

  const _renderProfileDetails = (profile: Profile, type: string) => {
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
            {_renderProfileButton(profile)}
            <Typography variant="subtitle1">{profile.name}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {type === 'local' && _renderDeleteLocalProfileButton(profile)}
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

  /**
   * TODO optimize me, this call can take ~10 seconds if we have say 200+ routes
   */
  const _getMatchingProfileCheck = () => {
    const profiles = [...remoteProfiles, ...localProfiles];

    let profileName;
    profiles.some((profile) => {
      if (arraysEqual(profile.variants, activeVariants)) {
        profileName = profile.name;
        return true;
      }
      return false;
    });

    return profileName
      ? `Selected routes and variants match profile: ${profileName}`
      : 'No remote profiles match these selections';
  };

  const _renderCurrentSelectedRoutes = (variant: RouteVariant) => {
    return (
      <Box sx={{ pt: 0.5, pb: 0.5 }}>
        <Typography noWrap variant="body1">
          <b>Route:</b> {variant.routeID}
        </Typography>
        <Typography noWrap variant="body1">
          <b>Selected Varaint:</b> {variant.variantID}
        </Typography>
      </Box>
    );
  };

  const _renderSaveButton = (type: string) => {
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
                if (type === 'remote') {
                  setSaveAsRemote(
                    `mezzo.profile('${enteredName}', ${JSON.stringify(
                      data.variants
                    )});`
                  );
                } else if (type === 'local') {
                  // Save to local
                  saveLocalProfile({
                    name: enteredName,
                    // variants: [],
                    variants: data?.variants,
                  });
                  const localProfiles = getLocalProfiles();
                  setLocalProfiles(localProfiles);
                }
              }
            }
          }}
        >
          <Save />
        </IconButton>
      </Box>
    );
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ marginTop: 3 }}>
      <Typography variant="h6">Current Selected Routes:</Typography>
      <Paper sx={{ pt: 1, pb: 1 }}>
        <Container>
          {activeVariants.map((variant) =>
            _renderCurrentSelectedRoutes(variant)
          )}
          <Typography sx={{ pt: 2 }} color="red">
            {_getMatchingProfileCheck()}{' '}
          </Typography>
        </Container>
      </Paper>
      {_renderSaveButton('local')}
      {_renderSaveButton('remote')}
      {saveAsRemote ? (
        <Paper sx={{ backgroundColor: '#FFFFFF', pt: 1, pb: 1, mb: 1 }}>
          <Container>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <IconButton
                sx={{ pl: 0 }}
                onClick={() => {
                  navigator.clipboard.writeText(saveAsRemote);
                  toast.success('Copied');
                }}
                color="primary"
              >
                <CopyAll />
              </IconButton>
              <Typography variant="body1">
                Copy the following code snippet to where you initialize the
                mezzo server
              </Typography>
            </Box>
            <SyntaxHighlighter
              language="javascript"
              style={github}
              customStyle={{
                padding: 0,
                margin: 0,
                backgroundColor: '#FFFFFF',
              }}
              wrapLongLines={true}
            >
              {saveAsRemote}
            </SyntaxHighlighter>
          </Container>
        </Paper>
      ) : null}
      <Typography variant="h6">Remote Profiles</Typography>
      {remoteProfiles.map((profile) =>
        _renderProfileDetails(profile, 'remote')
      )}
      <Typography variant="h6">Local Profiles</Typography>
      {localProfiles.map((profile) => _renderProfileDetails(profile, 'local'))}
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
}
