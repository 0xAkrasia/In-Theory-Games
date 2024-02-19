import { usePrivy } from '@privy-io/react-auth';

export const LoginButton = () => {
    const { login } = usePrivy();
    const handleLogin = async () => {
        login();

    };
    return (
        <div className="w-layout-vflex thin-wrapper">
            <div className="w-layout-vflex main-content">
                <button className="primary-button w-inline-block">
                    <div onClick={handleLogin} className="button-text">
                        Connect Wallet to Play
                    </div>
                </button>
            </div>
        </div>
    );
};