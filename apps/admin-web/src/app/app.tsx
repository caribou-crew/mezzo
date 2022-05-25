import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { createContext } from 'react';

import { CssBaseline } from '@mui/material';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import RecordScreen from './components/RecordScreen';
import { PUBLIC_URL } from './utils/urlPrefix';
import ProfilesScreen from './components/Profiles/ProfilesScreen';
import { ClientContext } from './context';
import mezzoClient from '@caribou-crew/mezzo-core-client';

// If prod, routes are /mezzo and /mezzo/record instead of / and /record
export const App = () => {
  const client = mezzoClient();
  // const MyContext = React.createContext(client);

  console.log('=============RERENDER APP ROOT');
  return (
    <Router basename={PUBLIC_URL}>
      <CssBaseline />
      <Header name="Mezzo" />
      <ClientContext.Provider value={client}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/record" element={<RecordScreen />} />
          <Route path="/profiles" element={<ProfilesScreen />} />
        </Routes>
      </ClientContext.Provider>
    </Router>
  );
};

export default App;
