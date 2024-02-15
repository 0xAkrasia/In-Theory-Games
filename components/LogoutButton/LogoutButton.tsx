import { usePrivy } from '@privy-io/react-auth';

export const LogoutButton = () => {
    const { logout } = usePrivy();

    return (
        <div className="w-layout-vflex thin-wrapper">
            <div className="w-layout-vflex main-content">
                <button className="primary-button w-inline-block button-text" onClick={logout}>
                    Log out
                </button>
            </div>
        </div>
    );
};