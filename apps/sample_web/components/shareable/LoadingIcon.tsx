import { colors } from "global-constants";
import { FC } from "react";
import styled from "styled-components";

import MagnifyingGlass from "styles/icons/MagnifyingGlass.svg";

const LoadingIconContaienr = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  .icon-container {
    svg {
      width: 100%;
      height: 100%;
      overflow: visible;
      path {
        stroke: ${colors.black};
        stroke-width: 1.5px;
        fill: transparent;
        stroke-dasharray: 500;
        animation: mag-glass 3s ease-in-out infinite;
        @keyframes mag-glass {
          from {
            stroke-dashoffset: 500;
          }
          50% {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: 500;
          }
        }
      }
    }
  }
`;
interface LoadingIconProps {
  iconStyling?: {
    width: string | number;
    height: string | number;
    [styleEl: string]: any;
  };
}

const LoadingIcon: FC<LoadingIconProps> = ({ iconStyling = { width: 50, height: 50 } }) => {
  return (
    <LoadingIconContaienr>
      <div className="icon-container" style={iconStyling}>
        <MagnifyingGlass />
      </div>
    </LoadingIconContaienr>
  );
};

export default LoadingIcon;
