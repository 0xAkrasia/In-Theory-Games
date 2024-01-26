import { useEffect, useState } from 'react';
import { init } from './fhevmjs';
import './App.css';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { EnterGameButton } from './components/TwoThirdsGameEntry';

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
      <h1>In Theory Games</h1>
      <h2>Two Thirds Game</h2>
      <EnterGameButton/>
      <Footer/>
    </>
  );
}

export default App;