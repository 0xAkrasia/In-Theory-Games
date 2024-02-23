import fi_arrow_up_right from '../../images/fi_arrow-up-right.png'

export const SubmissionComplete = (props: any) => {
    if (props.entry === null || props.entry === undefined || props.entry === "") {
        return(
            <div className="w-layout-vflex thin-wrapper">
                <div className="w-layout-vflex main-content">
                    <div className="w-layout-vflex user-entry">
                        <p className="display">
                            Submission Received!
                        </p>
                    </div>
                    <a href="#" className="primary-button w-inline-block">
                        <div className="button-text">
                            Claim Poap
                        </div>
                        <img src={fi_arrow_up_right} loading="lazy" width={20} height={20} alt="" className="chevron" />
                    </a>
                </div>
            </div>
        );
    } else {
        return(
            <div className="w-layout-vflex thin-wrapper">
                <div className="w-layout-vflex main-content">
                <p className="paragraph">
                Submission Received!
                </p>
                    <div className="w-layout-vflex user-entry">
                        <p className="paragraph tagline">
                            Your entry
                        </p>
                        <p className="display">
                            {props.entry}
                        </p>
                    </div>
                    <a href="#" className="primary-button w-inline-block">
                        <div className="button-text">
                            Claim Poap
                        </div>
                        <img src={fi_arrow_up_right} loading="lazy" width={20} height={20} alt="" className="chevron" />
                    </a>
                </div>
            </div>
        );
    };
};