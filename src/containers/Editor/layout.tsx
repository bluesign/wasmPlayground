import React, {  useEffect } from 'react';
import { useLocation } from '@reach/router';
import { Flex, Text } from 'theme-ui';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FaCloudUploadAlt } from 'react-icons/fa';
import {
  FaCodeBranch,
} from 'react-icons/fa';
import { getParams } from 'util/url';

import { Header as HeaderRoot } from 'layout/Header';
import Sidebar from 'components/Sidebar';


import {
  EditorContainer,
  Header,
  Nav,
  ShareSaveButton,
} from './components';

import { useProject } from 'providers/Project/projectHooks';



const EditorLayout: React.FC = () => {
  const {
    project,
    isSavingCode,
    isLoading,
    active,
    setSelectedResourceAccount,
  } = useProject();

  
 

  const location = useLocation();
  const params = getParams(location.search);
  useEffect(() => {
    params.storage && setSelectedResourceAccount(params.storage);
  }, [params]);

  
  if (!isLoading && !project) {
    // NOTE: Leave this. 404 redirect is handled in
    // projectHooks.tsx. Show nothing before navigating.
    return <></>;
  }

  return (
    <>
      <Helmet>
        <title>Flow  </title>
      </Helmet>
      <HeaderRoot>
        <Header>
          <Flex
            sx={{
              alignItems: 'center',
            }}
          >
            <img src="/flow_logo.jpg" alt="Flow Logo" width="40" height="40" />
            <Text
              pl={1}
              sx={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                position: 'relative',
              }}
            >
              Playground
            </Text>

          
          </Flex>
          {/* <Text>New Project</Text> */}
          <Nav>
            <Flex
              sx={{
                alignItems: 'center',
              }}
            >
              <Text
                sx={{
                  fontWeight: 'body',
                  color: 'darkGrey',
                  fontSize: '13px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '15px',
                }}
              >
                <AnimatePresence exitBeforeEnter>
                  {project && project.persist && isSavingCode && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{
                        opacity: 0,
                      }}
                      key="1"
                    >
                      Autosaving...
                    </motion.div>
                  )}
                  {project && project.persist && !isSavingCode && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{
                        opacity: 0,
                      }}
                      key="2"
                    >
                      All changes saved
                    </motion.div>
                  )}
                </AnimatePresence>
              </Text>
              {project && (
                <ShareSaveButton
                  url={window.location.href}
                  saveText={project.parentId ? 'Fork' : 'Reset'}
                  showShare={project.persist}
                  onSave={window['storage_clear']}
                  icon={project.parentId ? FaCodeBranch : FaCloudUploadAlt}
                />
              )}
             
            </Flex>
          </Nav>
        </Header>
      </HeaderRoot>
      <Sidebar />
      <EditorContainer
        isLoading={isLoading}
        project={project}
        active={active}
      />
     
      
    </>
  );
};

export default EditorLayout;
