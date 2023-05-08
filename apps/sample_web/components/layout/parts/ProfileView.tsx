import Link from "next/link";
import { FC, useContext, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, m } from "framer-motion";

//-------------------------custom
import { trpc } from "../../../utils/trpc";
import { colors } from "global-constants";
import AuthedButton from "./AuthedButton";
import NotAuthedButton from "./NotAuthedButton";
import { AuthModalContext } from "../../../utils/contexts/AuthModalContext";
import { AuthContext } from "../../../utils/contexts/AuthContext";

const ProfileViewContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .profile-menu {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        bottom: 0;
        right: 0;
        transform: translateY(100%);
        overflow: hidden;
        background-color: ${colors.white};
        min-width: 225px;
        button,
        a {
            color: ${colors.black};
            white-space: nowrap;
            padding: 5px 20px;
            width: 100%;
            text-align: center;
            transition: background-color 250ms, color 250ms;
            &:hover {
                background-color: ${colors.darkGrey};
                color: ${colors.white};
            }
        }
        hr {
            width: 90%;
            border: 0px;
            min-height: 1px;
            background-color: ${colors.lightGrey};
        }
    }
`;

interface ProfileViewProps {
    authenticated: boolean;
}

const ProfileView: FC<ProfileViewProps> = ({ authenticated = false }) => {
    const logoutMutation = trpc.auth.logout.useMutation();
    const { setModalVisible } = useContext(AuthModalContext);
    const { revalidateAuth } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const handleLoginClick = () => {
        setModalVisible("open");
        setMenuOpen(false);
    };
    const handleLogoutClick = async () => {
        await logoutMutation.mutateAsync();
        revalidateAuth();
        setMenuOpen(false);
    };
    return (
        <ProfileViewContainer>
            {!authenticated ? (
                <NotAuthedButton
                    onClick={() => {
                        setMenuOpen(!menuOpen);
                    }}
                />
            ) : (
                <AuthedButton
                    onClick={() => {
                        setMenuOpen(!menuOpen);
                    }}
                />
            )}
            <AnimatePresence>
                {menuOpen && (
                    <m.div
                        className="profile-menu"
                        initial={{ x: "75%", y: "100%", opacity: 0 }}
                        animate={{ x: 0, y: "100%", opacity: 1 }}
                        exit={{ x: "75%", y: "100%", opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link className="paragraph-small" href="/">
                            Terms & Conditions
                        </Link>
                        <hr />
                        {!authenticated ? (
                            <button className="paragraph-small" onClick={handleLoginClick}>
                                Log in
                            </button>
                        ) : (
                            <button className="paragraph-small" onClick={handleLogoutClick}>
                                Log out
                            </button>
                        )}
                    </m.div>
                )}
            </AnimatePresence>
        </ProfileViewContainer>
    );
};

export default ProfileView;
