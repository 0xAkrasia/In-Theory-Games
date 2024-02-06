import { useEffect, useState } from 'react';
import { init } from './fhevmjs';
import './App.css';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { EnterGameButton } from './components/TwoThirdsGameEntry';
import { FetchPlayerCount } from './components/FetchPlayerCount';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    init()
      .then(() => {
        setIsInitialized(true);
      })
      .catch(() => setIsInitialized(false));
  }, []);

  if (!isInitialized) return null;

  return (
    <>
      <Navigation/>
      <h2>Two Thirds Game</h2>
      <EnterGameButton/>
      <FetchPlayerCount/>
      <Footer/>
    </>
  );
}

export default App;