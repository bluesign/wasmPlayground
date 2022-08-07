import styled from "@emotion/styled";
import { integer } from "monaco-languageclient";
import theme from "../theme";

type HeadingProps = {
  length?: integer,
  textTransform?: string;
  selected?: boolean;
}

export const HeadingContainer = styled.div`
  --active-width: 6px;

  font-size: 1rem;
  padding-left: 1rem;
  padding-right: 0.25rem;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  background: var(--bg);
  position: relative;

  
  cursor: pointer;
  &:hover,
  &:focus {
    background: rgba(255, 255, 255, 0.75);
  }
  text-decoration: none;
  display:flex;
  align-items: center;
  font-weight: bold;
  color: ${theme.colors.muted};

  & .avatar {
    margin-right: 1rem;
    width: 35px;
    height: 35px;
    border-radius: 0 0 20px 20px;
  }

  & small,
  & .mute {
    font-weight: normal;
    color: ${theme.colors.heading};
    font-size: 13px;
  }
`



export const Heading = styled.div<HeadingProps>`
  padding: 1rem;
  font-size: 10px;
  font-weight: bold;
  text-transform: ${({ textTransform = "uppercase" }) => (textTransform)};
  letter-spacing: 0.1em;
  color: ${theme.colors.heading};
  padding-bottom: calc(1rem - 3px);

  display: flex; 
  
  justify-content: space-between;
  align-items: center;

  position: relative;

 

  &:after {
    opacity: 0.5;
    content: " ";
    display: flex;
    position: absolute;s
    left: 1rem;
    bottom: calc(1rem - 3px - 6px);
    background: ${theme.colors.primary};
    height:  ${({selected=true}) => (
      selected?3:0
    )}px;

    width:  ${({length=0}) => (
      length?length/2:0
    )}rem;

    border-radius: 3px;
  };
`


export const ResizeHeading = styled(Heading)`
	&:hover {
		cursor: ns-resize;
	}
`
