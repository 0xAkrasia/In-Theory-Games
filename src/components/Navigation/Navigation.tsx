import './Navigation.css';
import inTheoryGamesLogo from '../Logos/intheorygames-logo.png';
import { Connect } from '../Connect';

export const Navigation = () => {
  return (
    <nav className='navStyle'>
      <div className='navRow'>
        <a href='#about' className='navItemStyle'>About</a>
        <a href='#blog' className='navItemStyle'>Blog</a>
        <a href='#stats' className='navItemStyle'>Stats</a>
        <a href='#documentation' className='navItemStyle'>Documentation</a>
      </div>
      <div className='navRow'>
        <img src={inTheoryGamesLogo} alt='In Theory Games Logo' className='logoStyle' />
      </div>
      <div className='navRow'>
        <Connect/>
      </div>
    </nav>
  );
};