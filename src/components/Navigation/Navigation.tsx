import './Navigation.css';
import inTheoryGamesLogo from '../Logos/intheorygames-logo.png';
import { Connect } from '../Connect';

export const Navigation = () => {
  return (
    <nav className='navStyle'>
      <div className='navRow'>
        <a href='#documentation' className='navItemStyle'>About</a>
      </div>
      <div className='navRow'>
        <img src={inTheoryGamesLogo} alt='In Theory Games Logo' className='logoStyle' />
        <h3>In Theory Games</h3>
      </div>
      <div className='navRow'>
        <Connect/>
      </div>
    </nav>
  );
};