import './Footer.css';
import twitterLogo from '../Logos/twitter-logo-black.png';
import discordLogo from '../Logos/discord-logo-black.png';
import telegramLogo from '../Logos/telegram-logo.png';
import { FetchBalance } from '../FetchBalance';

export const Footer = () => {
  return (
    <div>
      <FetchBalance className='footerLeftStyle' />
      <footer className='footerRightStyle'>
        {/* <FetchBalance/> */}
        <a href='https://twitter.com' target='_blank' rel='noopener noreferrer' className='iconStyle'>
          <img src={twitterLogo} alt='Twitter' className='logoStyle' />
        </a>
        <a href='https://discord.com' target='_blank' rel='noopener noreferrer' className='iconStyle'>
          <img src={discordLogo} alt='Discord' className='logoStyle' />
        </a>
        <a href='https://telegram.org' target='_blank' rel='noopener noreferrer' className='iconStyle'>
          <img src={telegramLogo} alt='Telegram' className='logoStyle' />
        </a>
      </footer>
    </div>
  );
};