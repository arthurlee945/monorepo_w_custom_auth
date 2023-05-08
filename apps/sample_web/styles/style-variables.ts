import { css } from "styled-components";
import { colors } from "global-constants";

export const underline = css`
  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 0px;
    transform: translateY(100%);
    background-color: ${colors.blue};
    transition: width 250ms;
  }
  &:hover {
    &:after {
      width: 100%;
    }
  }
`;
