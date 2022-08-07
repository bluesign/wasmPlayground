import styled from "@emotion/styled"

export const Stack = styled.div`
  display:flex;
  flex-direction:column;
  flex: 1;

  & > * + * {
    margin-top:3px;
  }
  
  strong, small {
    max-width: 11em;
    font-size: 0.8em;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`
