import './Footer.css';
import akrasiaPFP from '../Logos/Akrasia round name.png';
import incoLogo from '../Logos/Inco.png';

export const Footer = () => {
  return (
    <footer className='footerStyle'> 
      <div className='footerRow footerLeft'>
        <a href='https://twitter.com/0xAkrasia' target='_blank' rel='noopener noreferrer'>
          <div></div>
          <img src={akrasiaPFP} alt="Akrasia Twitter" className="footerImage"></img>
        </a>
      </div>
      +
      <div className='footerRow footerRight'>
        <a href='https://twitter.com/inconetwork' target='_blank' rel='noopener noreferrer'>
          <img src={incoLogo} alt="Inco Twitter" className="footerImage"></img>
        </a>
      </div>
    </footer>
  );
};