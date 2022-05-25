import React, { useContext, useEffect, useState } from 'react';

import { Container, Typography, Paper } from '@mui/material';
import { Profile, RouteVariant } from '@caribou-crew/mezzo-interfaces';
import { getLocalProfiles, saveLocalProfile } from '../../utils/profileHelper';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClientContext } from '../../context';
import { arraysEqual } from '../../utils/equality';
import Variants from './Variants';
import SaveButton from './SaveButton';
import ProfileDetails from './ProfileDetails';
import SaveAsRemote from './SaveAsRemote';

SyntaxHighlighter.registerLanguage('javascript', js);

type Props = Record<string, never>;

export default function ProfilesScreen(props: Props) {
  console.log('Profile Screen');
  const client = useContext(ClientContext);

  const [remoteProfiles, setRemoteProfiles] = useState<Profile[]>([]);
  const [localProfiles, setLocalProfiles] = useState<Profile[]>([]);
  const [matchedProfile, setMatchedProfile] = useState<string | null>(null);
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

  if (matchedProfile == null) {
    [...remoteProfiles, ...localProfiles].some((profile) => {
      if (arraysEqual(profile.variants, activeVariants)) {
        setMatchedProfile(profile.name);
        return true;
      }
      return false;
    });
  }

  return (
    <Container component="main" maxWidth="lg" sx={{ marginTop: 3 }}>
      <Typography variant="h6">Current Selected Routes:</Typography>
      <Paper sx={{ pt: 1, pb: 1 }}>
        <Container>
          <Variants variants={activeVariants} />
          <Typography sx={{ pt: 2 }} color="red">
            {matchedProfile
              ? `Selected routes and variants match profile: ${matchedProfile}`
              : 'No remote profiles match these selections'}
          </Typography>
        </Container>
      </Paper>
      <Typography variant="h6">Remote Profiles</Typography>
      {remoteProfiles.map((profile) => (
        <ProfileDetails
          type="remote"
          profile={profile}
          setSelectedProfile={setSelectedProfile}
          setMatchedProfile={setMatchedProfile}
          client={client}
          selectedProfile={selectedProfile}
          setLocalProfiles={setLocalProfiles}
          setDetailsExpanded={setDetailsExpanded}
          detailsExpanded={detailsExpanded}
          key={profile.name}
        />
      ))}
      <Typography variant="h6">Local Profiles</Typography>
      {localProfiles.map((profile) => (
        <ProfileDetails
          type="local"
          profile={profile}
          setSelectedProfile={setSelectedProfile}
          setMatchedProfile={setMatchedProfile}
          client={client}
          selectedProfile={selectedProfile}
          setLocalProfiles={setLocalProfiles}
          setDetailsExpanded={setDetailsExpanded}
          detailsExpanded={detailsExpanded}
          key={profile.name}
        />
      ))}
      <SaveButton
        type="local"
        client={client}
        onSave={(name, variants) => {
          saveLocalProfile({
            name,
            variants,
          });
          const localProfiles = getLocalProfiles();
          setLocalProfiles(localProfiles);
        }}
      />
      <SaveButton
        type="remote"
        client={client}
        onSave={(name, variants) => {
          setSaveAsRemote(
            `mezzo.profile('${name}', ${JSON.stringify(variants)});`
          );
        }}
      />
      <SaveAsRemote saveAsRemote={saveAsRemote} />
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
