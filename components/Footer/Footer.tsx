import Akrasia from "../../images/0xAkrasia.png";
import x from "../../images/x.png";
import inco_logo from "../../images/inco_logo.png"

export const Footer = () => {
  return (
    <div className="w-layout-vflex footer">
      <div className="credits">
        <a href="https://twitter.com/0xAkrasia" target="_blank" rel="noreferrer">
          <img src={Akrasia} alt="0xAkrasia"/>
        </a>
        <img src={x} alt="x" style={{ height: "25%" }}/>
        <a href="https://inco.network" target="_blank" rel="noreferrer">
          <img src={inco_logo} alt="Inco Network"/>
        </a>
      </div>
      <div className="stripes bottom" />
    </div>
  );
};