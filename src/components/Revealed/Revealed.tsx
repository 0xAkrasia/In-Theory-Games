export const Revealed = () => {
    return (
        <div className="w-layout-vflex wrapper">
            <div className="w-layout-vflex main-content">
                <div className="w-layout-vflex user-entry invert">
                    <p className="paragraph tagline winner">You are a winner!</p>
                    <p className="paragraph tagline darker">USDC will be sent to your Polygon wallet</p>
                </div>
                <div className="w-layout-vflex user-entry">
                    <p className="paragraph tagline">Winning Number</p>
                    <p className="display winning_number">24</p>
                </div>
                <div className="w-layout-vflex user-entry winner-list">
                    <p className="paragraph tagline">Winners</p>
                    <div className="w-layout-hflex player"><img src="https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg" loading="lazy" alt="" className="avatar smaller" />
                        <p className="paragraph address">00DD...CCSA</p>
                    </div>
                    <div className="w-layout-hflex player"><img src="https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg" loading="lazy" alt="" className="avatar smaller" />
                        <p className="paragraph address">00DD...CCSA</p>
                    </div>
                    <div className="w-layout-hflex player"><img src="https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg" loading="lazy" alt="" className="avatar smaller" />
                        <p className="paragraph address">00DD...CCSA</p>
                    </div>
                    <div className="w-layout-hflex player"><img src="https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg" loading="lazy" alt="" className="avatar smaller" />
                        <p className="paragraph address">00DD...CCSA</p>
                    </div>
                    <div className="w-layout-hflex player"><img src="https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg" loading="lazy" alt="" className="avatar smaller" />
                        <p className="paragraph address">00DD...CCSA</p>
                    </div>
                </div>
            </div>
        </div>
    );
};