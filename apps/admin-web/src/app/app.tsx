import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { CssBaseline } from '@mui/material';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import RecordScreen from './components/RecordScreen';
import { PUBLIC_URL } from './utils/urlPrefix';
console.log('Using public URL: ', PUBLIC_URL);

// If prod, routes are /mezzo and /mezzo/record instead of / and /record
export const App = () => {
  return (
    <Router basename={PUBLIC_URL}>
      <CssBaseline />
      <Header name="Mezzo" />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/record" element={<RecordScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
