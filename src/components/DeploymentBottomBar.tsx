import React, { useState, useEffect } from 'react';
import { ResultType } from "../_newTypes/newTypes";

import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import useMousePosition from '../hooks/useMousePosition';
import styled from '@emotion/styled';
import { ResizeHeading } from 'layout/Heading';
import { Feedback as FeedbackRoot } from 'layout/Feedback';

import { RenderResponse } from 'components/RenderResponse';
import { FaEraser } from 'react-icons/fa';
import theme from '../theme';

const Clear = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  position: absolute;
  left: 50%;
  span {
    padding-right: 0.2rem;
  }
  &:hover {
    cursor: pointer;
    color: ${theme.colors.error};
  }
`;

export const clearLog = () => {
  window.emulatorLog = []

}

export const ClearResults: React.FC<{ type: ResultType }> = () => {
  return (
    <Clear
      onClick={() =>
        clearLog()
      }
    >
    <span>clear</span> <FaEraser></FaEraser>
    </Clear>
  );
};

const RESULT_PANEL_MIN_HEIGHT = 80;
const PLAYGROUND_HEADER_HEIGHT = 75;

const DeploymentResultContainer = styled.div<{ height: number }>`
  display: flex;
  flex-direction: row;
  justify-content: space-even;
  left: 245px;
  width: calc(100vw - 245px);
  position: absolute;
  bottom: 0px;
  background: white;
  height: ${(p) => p.height}px;
  overflow-y: hidden;
`;

interface DeploymentBottomBarProps {
  setBottomBarHeight: (height: number) => void;
}

const DeploymentBottomBar: React.FC<DeploymentBottomBarProps> = ({ setBottomBarHeight }) => {
  const { x, y } = useMousePosition();

  const [resultHeight, setResultHeight] = useState(140);
  const [isResizingResult, setIsResizingResult] = useState(false);

  const toggleResizingResult = (toggle: boolean) => {
    setIsResizingResult(toggle);
  };

  const toggleResizeListener = () => {
    toggleResizingResult(false);
  };

  useEffect(() => {
    if (
      isResizingResult &&
      y > RESULT_PANEL_MIN_HEIGHT &&
      y < window.innerHeight - PLAYGROUND_HEADER_HEIGHT
    ) {
      setResultHeight(y);
      setBottomBarHeight(y);
    }
  }, [x, y]);

  useEffect(() => {
    window.addEventListener('mouseup', toggleResizeListener, false);
    return () => {
      window.removeEventListener('mouseup', toggleResizeListener, false);
    };
  }, []);

  return (
    <DeploymentResultContainer height={resultHeight}>
      <FeedbackRoot>
        <ResizeHeading onMouseDown={() => toggleResizingResult(true)}>
          Emulator Log
          <ClearResults type={ResultType.Contract} />
          {resultHeight > 40 ? (
            <GoChevronDown size="16px" onClick={() => setResultHeight(40)} />
          ) : (
            <GoChevronUp
              size="16px"
              onClick={() => setResultHeight(RESULT_PANEL_MIN_HEIGHT * 2)}
            />
          )}
        </ResizeHeading>
        <RenderResponse resultType={ResultType.Contract} />
      </FeedbackRoot>
    </DeploymentResultContainer>
  );
};

export default DeploymentBottomBar;
