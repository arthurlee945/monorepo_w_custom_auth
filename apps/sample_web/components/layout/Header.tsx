import { FC, useContext } from "react";
import styled from "styled-components";
//-------custom--------------
import { colors, medias } from "global-constants";
import { GlobalStyleContext } from "../../utils/contexts/GlobalStyleContext";
import { AuthModalContext } from "../../utils/contexts/AuthModalContext";
import MainButton from "../shareable/MainButton";
import ProfileView from "./parts/ProfileView";
import { AuthContext } from "../../utils/contexts/AuthContext";

const HeaderComponent = styled.header`
    z-index: 1;
    position: sticky;
    background-color: ${colors.darkGrey};
    padding: 7px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid ${colors.grey};
    min-height: 50px;
    @media screen and (min-width: ${medias.tablet}) {
        &:hover {
        }
    }
    .profile-container {
        display: flex;
        align-items: center;
        column-gap: 15px;
    }
`;
interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
    const {
        authenticatedUser: { authenticated },
    } = useContext(AuthContext);
    const { setLockViewPort } = useContext(GlobalStyleContext);
    const { setModalVisible } = useContext(AuthModalContext);

    const handleModalStatus = (status: "open" | "close") => {
        if (status === "open") {
            setModalVisible("open");
            setLockViewPort("lock");
        } else {
            setModalVisible("close");
            setLockViewPort("unlock");
        }
    };
    return (
        <>
            <HeaderComponent>
                <div className="info-container"></div>
                <div className="profile-container">
                    {!authenticated && <MainButton onClick={handleModalStatus.bind(null, "open")}>Log in</MainButton>}
                    <ProfileView authenticated={authenticated} />
                </div>
            </HeaderComponent>
        </>
    );
};

export default Header;
