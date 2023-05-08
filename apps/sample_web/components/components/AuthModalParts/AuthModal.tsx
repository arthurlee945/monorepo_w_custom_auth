// import qs from "qs";
import { FC, useState } from "react";
import styled from "styled-components";
import { m } from "framer-motion";
//------------------custom
import { colors, medias } from "global-constants";
import CloseIcon from "styles/icons/Close.svg";
import LogInForm from "./LogInForm";
import SignUpForm from "./SignUpForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

const AuthModalContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  backdrop-filter: brightness(0.7);
  .log-container {
    position: relative;
    top: 0;
    background-color: ${colors.white};
    padding: 60px 50px;
    border-radius: 15px;
    width: 450px;
    color: ${colors.black};
    @media screen and (min-width: ${`${medias.mobile + 1}px`}) and (max-width: ${`${medias.tablet}px`}) {
    }
    @media screen and (max-width: ${`${medias.mobile}px`}) {
      padding: 35px 30px;
      width: 90%;
    }
    .close-btn {
      position: absolute;
      top: 10px;
      right: 16px;
      width: 25px;
      height: 25px;
    }
    .other-action {
      margin-top: 5px;
      .co-name {
        font-weight: 600;
      }
      .otherAction-button {
        color: ${colors.blue};
        font-weight: 700;
        &:hover {
          text-decoration: underline;
          text-decoration-color: ${colors.blue};
        }
      }
    }
  }
`;

interface AuthModalProps {
  closeModal: (status: "open" | "close") => void;
}

const AuthModal: FC<AuthModalProps> = ({ closeModal }) => {
  const [formType, setFormType] = useState<"signUp" | "login" | "forgotPassword">("login");
  const handleFormSelection = (selectedForm: "signUp" | "login" | "forgotPassword") => {
    setFormType(selectedForm);
  };
  return (
    <AuthModalContainer>
      <m.div className="log-container" style={{ y: -25, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <button className="close-btn" onClick={closeModal.bind(null, "close")}>
          <CloseIcon />
        </button>
        {formType === "login" ? (
          <LogInForm handleFormSelection={handleFormSelection} closeModal={closeModal} />
        ) : formType === "signUp" ? (
          <SignUpForm handleFormSelection={handleFormSelection} closeModal={closeModal} />
        ) : (
          <ForgotPasswordForm handleFormSelection={handleFormSelection} />
        )}
      </m.div>
    </AuthModalContainer>
  );
};

export default AuthModal;
