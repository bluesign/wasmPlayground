import React  from 'react';
import { Global } from '@emotion/core';
import { ThemeProvider } from 'theme-ui';
import { Router } from '@reach/router';
import 'reset-css';


import Playground from 'containers/Editor';
import BrowserDetector from 'components/BrowserDetector';

import globalStyles from './globalStyles';
import theme from './theme';


const Base = (props: any) => {
  return <div>{props.children}</div>;
};

const App: React.FC = () => {
 
  return (
    <>
      <BrowserDetector />
      <Global styles={globalStyles} />
        <ThemeProvider theme={theme}>
            <Router>
              <Base path="/">
                <Playground path="/" />
              </Base>
            </Router>
        </ThemeProvider>
    </>
  );
};

export default App;
