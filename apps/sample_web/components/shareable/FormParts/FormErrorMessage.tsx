import { m, AnimatePresence } from "framer-motion";
import { FC } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import styled from "styled-components";
//-----------------custom
import { colors } from "global-constants";

const FormErrorMessageContainer = styled.div`
  overflow: hidden;
  .error-msg {
    color: ${colors.amber};
    font-size: 0.8rem;
    transform-origin: bottom center;
    &::selection {
      background-color: ${colors.amber};
      color: ${colors.white};
    }
  }
`;

interface FormErrorMessageProps {
  errors: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

const FormErrorMessage: FC<FormErrorMessageProps> = ({ errors }) => {
  return (
    <FormErrorMessageContainer>
      <AnimatePresence>
        {errors && errors.message && (
          <m.p
            className="error-msg"
            initial={{ y: "-100%", height: 0, opacity: 0 }}
            animate={{ y: 0, height: "auto", opacity: 1 }}
            exit={{ y: "-100%", height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {errors.message as string}
          </m.p>
        )}
      </AnimatePresence>
    </FormErrorMessageContainer>
  );
};

export default FormErrorMessage;
