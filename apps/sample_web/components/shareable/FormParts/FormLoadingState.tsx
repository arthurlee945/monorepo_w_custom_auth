import { FC } from "react";
import styled from "styled-components";

//------------custom
import LoadingIcon from "../LoadingIcon";
import { colors } from "global-constants";
const FormLoadingStateContainer = styled.div<{ $colorScheme: "light" | "dark" }>`
  z-index: 1;
  position: absolute;
  top: -10px;
  left: -10px;
  width: calc(100% + 20px);
  height: calc(100% + 20px);
  backdrop-filter: contrast(0.8);
  border-radius: 15px;
  overflow: hidden;
  path {
    stroke: ${({ $colorScheme }) => ($colorScheme === "dark" ? colors.black : colors.white)} !important;
  }
`;

interface FormLoadingStateProps {
  colorScheme?: "light" | "dark";
}

const FormLoadingState: FC<FormLoadingStateProps> = ({ colorScheme = "dark" }) => {
  return (
    <FormLoadingStateContainer $colorScheme={colorScheme}>
      <LoadingIcon iconStyling={{ width: 40, height: 40 }} />
    </FormLoadingStateContainer>
  );
};

export default FormLoadingState;
