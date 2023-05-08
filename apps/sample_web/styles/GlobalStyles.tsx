import { createGlobalStyle } from "styled-components";
import { colors, medias } from "global-constants";

interface GlobalStylesTypes {
  $lockViewPort: boolean;
}

export const GlobalStyles = createGlobalStyle<GlobalStylesTypes>`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    -webkit-tap-highlight-color:transparent;
  }
  *::selection {
      background-color: ${colors.white};
      color: #0b0d10;
    }
  html,
  body {
    font-family: "Hubot Sans", sans-serif;
    background-color: ${colors.black};
    color: ${colors.white};
    max-width: 100vw;
    overflow-x: hidden;
    scroll-behavior: smooth;
    scrollbar-width: thin;

  }

  html {
    color-scheme: dark;
    overflow: ${({ $lockViewPort }) => ($lockViewPort ? "hidden" : "auto")}
  }

  body{
    padding:20px 15px;
    overflow: ${({ $lockViewPort }) => ($lockViewPort ? "hidden" : "auto")};
    overflow-x: hidden;
    scroll-behavior: smooth;
    @media screen and (min-width: ${`${medias.mobile + 1}px`}) and (max-width: ${`${medias.tablet}px`}) {
      padding:15px;
    }
    @media screen and (max-width: ${`${medias.mobile}px`}) {
      padding:10px;
    }
  }

  #__next{
    border:1px solid ${colors.grey};
    position: relative;
    min-height: calc(100vh - 40px);
    min-height: calc(100svh - 40px);
    @media screen and (min-width: ${`${medias.mobile + 1}px`}) and (max-width: ${`${medias.tablet}px`}) {
      min-height: calc(100vh - 30px);
    }
    @media screen and (max-width: ${`${medias.mobile}px`}) {
      min-height: calc(100vh - 20px);
    }
  }

  /*override default scroll bar*/

  body::-webkit-scrollbar {
    appearance: none;
    width: 4px;
  }
  body::-webkit-scrollbar-track {
    background-color: ${colors.darkGrey};
  }
  body::-webkit-scrollbar-thumb {
    background-color: ${colors.lightGrey};
  }
  body::-webkit-scrollbar-thumb:hover {
    background-color: ${colors.white};
  }

  a {
    color: inherit;
    text-decoration: none;
  }
  button{
    background-color:transparent;
    border:none;
    cursor:pointer;
  }
  li,
  ul{
    list-style: none;
  }

  .paragraph-small{
    font-size: 0.9rem;
    font-weight: 500;
    @media screen and (min-width: ${`${medias.mobile + 1}px`}) and (max-width: ${`${medias.tablet}px`}) {
    }
    @media screen and (max-width: ${`${medias.mobile}px`}) {
      font-size:0.8rem;
    }
  }
  .paragraph{
    font-size:1rem;
    font-weight:500;
    @media screen and (min-width: ${`${medias.mobile + 1}px`}) and (max-width: ${`${medias.tablet}px`}) {
    }
    @media screen and (max-width: ${`${medias.mobile}px`}) {
      font-size:0.9rem;
    }
  }
  .grecaptcha-badge{
    visibility:hidden;
  }
`;
