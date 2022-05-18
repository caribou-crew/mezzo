import React, { useEffect, useState } from 'react';

import { Container, Button } from '@mui/material';
import { Profile } from '@caribou-crew/mezzo-interfaces';
import mezzoClient from '@caribou-crew/mezzo-core-client';
import CopyIcon from '@mui/icons-material/CopyAll';
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

SyntaxHighlighter.registerLanguage('javascript', js);

type Props = Record<string, never>;

export default function ProfilesScreen(props: Props) {
  const client = mezzoClient();
  const [remoteProfiles, setRemoteProfiles] = useState<Profile[]>([]);
  const [localProfiles, setLocalProfiles] = useState<Profile[]>([]);
  const [saveAsRemote, setSaveAsRemote] = useState('');
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

  return (
    <Container component="main" maxWidth="lg">
      Remote Profiles
      {remoteProfiles.map((profile) => (
        <div key={profile.name}>
          <Button
            onClick={() => {
              client.setMockVariant(profile.variants);
            }}
          >
            Load
          </Button>
          Some Profile: {profile.name} Variants:{' '}
          {profile.variants.map((i) => i.routeID)}
        </div>
      ))}
      Local Profiles
      {localProfiles.map((profile) => (
        <div key={profile.name}>
          <Button
            onClick={() => {
              client.setMockVariant(profile.variants);
            }}
          >
            Load
          </Button>
          <Button
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
            Delete
          </Button>
          Some Profile: {profile.name}
        </div>
      ))}
      <br />
      Save variants as local profile{' '}
      <Button
        onClick={async () => {
          const enteredName = window.prompt('Please enter your name');
          if (enteredName) {
            console.log('Save with name', enteredName);
            // Fetch current variants
            const { data } = (await client.getActiveVariants()) ?? {};
            if (data?.variants) {
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
        }}
      >
        Save
      </Button>
      <br />
      Save as remote profile:
      <Button
        onClick={async () => {
          const enteredName = prompt('Please enter your name');
          if (enteredName) {
            const { data } = (await client.getActiveVariants()) ?? {};
            if (data?.variants) {
              setSaveAsRemote(
                `mezzo.profile('${enteredName}', ${JSON.stringify(
                  data.variants
                )});`
              );
            }
          }
        }}
      >
        Save
      </Button>
      {saveAsRemote ? (
        <div>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(saveAsRemote);
              toast.success('Copied');
            }}
            color="inherit"
          >
            <CopyIcon /> Copy
          </Button>
          the following code snippet to where you initialize the mezzo server
          <SyntaxHighlighter
            language="javascript"
            style={github}
            customStyle={{ padding: 0, margin: 0 }}
            wrapLongLines={true}
          >
            {saveAsRemote}
          </SyntaxHighlighter>
        </div>
      ) : null}
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
