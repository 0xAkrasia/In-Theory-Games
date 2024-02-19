import './css/normalize.css'
import './css/twoThirdsGame.css'
import './css/webflow.css'
import WebFont from 'webfontloader';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { init } from './fhevmjs';
import { Navigation } from './components/Navigation';
import { Sculpture } from './components/Sculpture';
import { ConnectSubmit } from './components/ConnectSubmit';
import { PlayersAndTech } from './components/PlayersAndTech';
import { Footer } from './components/Footer';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    init()
      .then(() => {
        setIsInitialized(true);
      })
      .catch(() => setIsInitialized(false));

      WebFont.load({
        google: {
          families: [
            "Pixelify Sans:regular,500,600,700",
            "Urbanist:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic",
            "Source Code Pro:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic"
          ]
        }
      });
  
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      document.documentElement.classList.add('w-mod-js'); // Indicate JS is enabled
      if (isTouchDevice) {
        document.documentElement.classList.add('w-mod-touch'); // Indicate touch support
      }
  }, []);

  if (!isInitialized) return null;

  return (
    <>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="Two Thirds Game" property="og:title"/>
        <meta content="Two Thirds Game" property="twitter:title"/>
        <link href="https://fonts.googleapis.com" rel="preconnect"/>
        <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="anonymous"/>
        <link rel="icon" href="https://raw.githubusercontent.com/0xAkrasia/In-Theory-Games/main/src/images/favicon.ico" type="image/x-icon"/>
        <title>In Theory Games</title>
      </Helmet>
      <Navigation/>
      <Sculpture/>
      <ConnectSubmit/>
      <PlayersAndTech/>
      <Footer/>
    </>
  );
}

export default App;