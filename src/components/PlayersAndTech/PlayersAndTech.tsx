import { FetchPlayerCount } from '../FetchPlayerCount'; 
import contractAddresses from '../Contracts/contractAddresses.json';

const contractAddress = contractAddresses[0].twoThirdsGame_vInco;

export const PlayersAndTech = () => {
    return (
        <div className="bottom-wrapper main-content w-layout-hflex secondary-actions">
            <a href={"https://explorer.inco.org/contract/" + contractAddress} target="_blank" className="primary-button link w-inline-block">
                <div className="text-block">
                    <FetchPlayerCount/>
                </div>
                <img src="https://uploads-ssl.webflow.com/65c3fd5f49f68afb85023612/65c406bd9ed9340c06c80fbd_Vectors-Wrapper.svg" loading="lazy" width={20} height={20} alt="" className="chevron" />
            </a>
            <a href="https://docs.inco.network/introduction/inco-network-introduction" target="_blank" className="primary-button link w-inline-block">
                <div className="text-block">
                    The Tech
                </div>
                <img src="https://uploads-ssl.webflow.com/65c3fd5f49f68afb85023612/65c406bd9ed9340c06c80fbd_Vectors-Wrapper.svg" loading="lazy" width={20} height={20} alt="" className="chevron" />
            </a>
        </div>
    );
};