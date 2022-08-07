import React, { useState, useEffect, useRef } from 'react';
import { Flex, Button, Box } from 'theme-ui';
import { FaShareSquare } from 'react-icons/fa';
import { motion } from 'framer-motion';
import useClipboard from 'react-use-clipboard';

import { Main as MainRoot } from 'layout/Main';
import { Editor as EditorRoot } from 'layout/Editor';
import { Heading, HeadingContainer } from 'layout/Heading';
import { EntityType, ActiveEditor } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import { Account, Project } from "src/_newTypes/newTypes";


import { default as FlowButton } from 'components/Button';
// import CadenceEditor from 'components/CadenceEditor';
import DeploymentBottomBar from 'components/DeploymentBottomBar';
import ResourcesBar from 'components/ResourcesBar';

import CadenceEditor from 'components/CadenceEditor';
import { navigate, useLocation } from '@reach/router';
import { getParams } from 'util/url';

export interface WithShowProps {
  show: boolean;
}

const Header: React.FC = ({ children }) => {
  return (
    <motion.div>
      <Flex
        py={1}
        sx={{
          flex: '1 1 auto',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '1em',
          paddingRight: '1em',
        }}
      >
        {children}
      </Flex>
    </motion.div>
  );
};

const NavButton: React.FC = ({ children }) => {
  return (
    <Button
      variant="secondary"
      sx={{
        marginLeft: '0.25rem',
        textDecoration: 'none',
      }}
    >
      {children}
    </Button>
  );
};

const Nav: React.FC = ({ children }) => {
  return <Flex>{children}</Flex>;
};

const ShareButton: React.FC<{ url: string }> = ({ url }) => {
  const [isCopied, setCopied] = useClipboard(url, { successDuration: 2000 });
  return (
    <Flex
      sx={{
        alignItems: 'center',
      }}
    >
      <FlowButton
        onClick={() => {
          setCopied();
        }}
        Icon={FaShareSquare}
      >
        {!isCopied ? 'Share' : 'Link Copied!'}
      </FlowButton>
    </Flex>
  );
};

const ShareSaveButton: React.FC<{
  url: string;
  saveText: string;
  showShare: boolean;
  onSave: () => void;
  icon: any;
}> = ({ url, saveText, showShare, onSave, icon }) => {
  const { isSavingCode } = useProject();
  return (
    <Box sx={{ marginRight: '0.5rem' }}>
      {showShare ? (
        <ShareButton url={url} />
      ) : (
        <FlowButton
          onClick={() => onSave()}
          disabled={isSavingCode}
          Icon={icon}
        >
          {saveText}
        </FlowButton>
      )}
    </Box>
  );
};

type EditorContainerProps = {
  isLoading: boolean;
  project: Project;
  active: ActiveEditor;
};

function getActiveCode(project: Project, active: ActiveEditor): string {
  switch (active.type) {
    case EntityType.Account:
      return project.accounts[active.index].draftCodes[active.subindex];

    case EntityType.TransactionTemplate:
      return project.transactionTemplates[active.index]
        ? project.transactionTemplates[active.index].script
        : '';
    case EntityType.ScriptTemplate:
      return project.scriptTemplates[active.index]
        ? project.scriptTemplates[active.index].script
        : '';
    default:
      return '';
  }
}

function getActiveId(project: Project, active: ActiveEditor): string {
  switch (active.type) {
    case EntityType.Account:
      return project.accounts[active.index].id;
    case EntityType.TransactionTemplate:
      return project.transactionTemplates[active.index]
        ? project.transactionTemplates[active.index].id
        : '';
    case EntityType.ScriptTemplate:
      return project.scriptTemplates[active.index]
        ? project.scriptTemplates[active.index].id
        : '';
    default:
      return '';
  }
}

const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  }, [value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
};

// This method
const compareContracts = (prev: Account[]) => {
  for (let i = 0; i < prev.length; i++) {
   // if (prev[i].deployedCode !== current[i].deployedCode) {
   //   return false;
   // }
  }
  return true;
};


const EditorContainer: React.FC<EditorContainerProps> = ({
  isLoading,
  project,
  active,
}) => {

  //@ts-ignore
  const [code, setCode] = useState('');
  //@ts-ignore
  const [activeId, setActiveId] = useState(null);

  const projectAccess = useProject();

  
  const location = useLocation();
  const params = getParams(location.search);
  active.subindex = params.subindex ? params.subindex: 0


  useEffect(() => {
    if (isLoading) {
      setCode('');
      setActiveId(null);
    } else {
      setCode(getActiveCode(project, active));
      setActiveId(getActiveId(project, active));
    }
  }, [isLoading, active, projectAccess.project]);

  const previousProjectState = usePrevious(project);

 
  // This hook will listen for project updates and if one of the contracts has been changed,
  // it will reload language server
  useEffect(() => {
    if (previousProjectState !== undefined) {
      // @ts-ignore
      const previousAccounts = previousProjectState.accounts || [];
      const equal = compareContracts(previousAccounts);
      if (!equal) {
        // reloadServer()
      }
    }
  }, [project]);

  


  return (
    <MainRoot>
      <EditorRoot>
        <EditorTitle active={active}  project={project}/>
        {/* This is Project Info Block */}
     
        {/* This is Cadence Editor */}
        {/*        <CadenceEditor
          type={active.type}
          activeId={activeId}
          code={code}
          mount="cadenceEditor"
          onChange={(code: string, _: any) => onEditorChange(code)}
          show={!isReadmeEditor}
        />*/}
        <CadenceEditor show={true} />
      </EditorRoot>
      <BottomBarContainer active={active} />
    </MainRoot>
  );
};

type EditorTitleProps = {
  active: ActiveEditor;
  project: Project;
};

const EditorTitle: React.FC<EditorTitleProps> = ( {active, project}) => {
      
      if (active.type === EntityType.Account) {
          return (
            <HeadingContainer>
            <Heading key="draft" onClick={() => navigate(`/?type=account&id=${project.accounts[active.index].id}&subindex=${active.subindex}`)}
               selected={true} length={active.subindex.length}> {active.subindex}</Heading>

          </HeadingContainer>
          )
      }

      if (active.type === EntityType.TransactionTemplate) {
        return (
          <HeadingContainer>
          <Heading key="transaction_draft" onClick={() => navigate(`#`)}
             selected={true} length={10}> Transaction </Heading>
        </HeadingContainer>
        )
    }
    if (active.type === EntityType.ScriptTemplate) {
      return (
        <HeadingContainer>
        <Heading key="script_draft" onClick={() => navigate(`#`)}
           selected={true} length={5}> Script </Heading>
      </HeadingContainer>
      )
  }

    return null

};

type BottomBarContainerProps = {
  active: ActiveEditor;
};

const BottomBarContainer: React.FC<BottomBarContainerProps> = () => {
  const [bottomBarHeight, setBottomBarHeight] = useState(140);
  return (
  <>
  <ResourcesBar resultHeight={bottomBarHeight} />
  <DeploymentBottomBar setBottomBarHeight={setBottomBarHeight} />
  </>
  )

  
};


export {
  EditorContainer,
  Header,
  NavButton,
  Nav,
  ShareSaveButton,
  
};
