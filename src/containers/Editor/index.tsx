import React from 'react';

import { ProjectProvider } from 'providers/Project';
import CadenceChecker from 'providers/CadenceChecker';

import EditorLayout from './layout';
import { Base } from 'layout/Base';

const Playground: any = (_: any) => {
  
  
  return (
    <ProjectProvider>

<Base>

        
        <CadenceChecker>
          <EditorLayout />
        </CadenceChecker>
        
    </Base>
    </ProjectProvider>

  );
};

export default Playground;
