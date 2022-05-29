import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { CssBaseline, Typography } from '@mui/material';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import RecordScreen from './components/RecordScreen';
import { PUBLIC_URL } from './utils/urlPrefix';
import ProfilesScreen from './components/Profiles/ProfilesScreen';
import { ClientContext } from './context';
import mezzoClient from '@caribou-crew/mezzo-core-client';
import useFetchInfo from './hooks/useFetchInfo';

// If prod, routes are /mezzo and /mezzo/record instead of / and /record
export const App = () => {
  const client = mezzoClient({
    useRelativeUrl: true,
  });
  const { version, isProfileEnabled, isRecordingEnabled, isLoading } =
    useFetchInfo();
  return (
    <Router basename={PUBLIC_URL}>
      <CssBaseline />
      <Header
        name="Mezzo"
        isProfileEnabled={isProfileEnabled}
        isRecordingEnabled={isRecordingEnabled}
      />
      {isLoading ? (
        <div>TODO: make me pretty</div>
      ) : (
        <ClientContext.Provider value={client}>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            {isRecordingEnabled && (
              <Route path="/record" element={<RecordScreen />} />
            )}
            {isProfileEnabled && (
              <Route path="/profiles" element={<ProfilesScreen />} />
            )}
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </ClientContext.Provider>
      )}
      <Typography
        align="center"
        sx={{ mt: 15 }}
        gutterBottom
        style={{ color: 'white' }}
      >
        {version ? `v${version}` : null}
      </Typography>
    </Router>
  );
};

const NoMatch = () => {
  return (
    <Typography align="center" sx={{ mt: 10 }} style={{ color: 'white' }}>
      Oops no match
    </Typography>
  );
};

export default App;
