import React from "react";
import { EntityType } from "providers/Project";
import AccountList from "components/AccountList";
import MenuList from "components/MenuList";
import { Sidebar as SidebarRoot } from "layout/Sidebar";

import { useProject } from "providers/Project/projectHooks";
import { navigate } from "@reach/router";


const Sidebar: React.FC = () => {
  const {
   // isLoading,
    active,
    project,
    
    deleteTransactionTemplate,
    deleteScriptTemplate,
    updateTransactionTemplate,
    updateScriptTemplate,
    createTransactionTemplate,
    createScriptTemplate,
    selectedResourceAccount
  } = useProject();


  const storageAcct = selectedResourceAccount || 'none'

  return (
    <SidebarRoot>
      <AccountList />
      <MenuList
        title="Transaction Templates"
        items={project.transactionTemplates}
        active={
          active.type == EntityType.TransactionTemplate ? active.index : null
        }
        onSelect={(_, id) => {
          navigate(`/?type=tx&id=${id}&storage=${storageAcct}`)
        }}
        onUpdate={(templateId: string, script: string, title: string) => {
          updateTransactionTemplate(templateId, script, title);
        }}
        onDelete={async (templateId: string) => {
          await deleteTransactionTemplate(templateId);
          const id = project.transactionTemplates[0].id;
          navigate(`/?type=tx&id=${id}&storage=${storageAcct}`)
        }}
        onInsert={async () => {
         const res = await createTransactionTemplate("", `New Transaction`)
         navigate(`/?type=tx&id=${res.data?.createTransactionTemplate?.id}&storage=${storageAcct}`)
        }}
      />
      <MenuList
        title="Script Templates"
        items={project.scriptTemplates}
        active={active.type == EntityType.ScriptTemplate ? active.index : null}
        onSelect={(_, id) => {
          navigate(`/?type=script&id=${id}&storage=${storageAcct}`)
        }}
        onUpdate={(templateId: string, script: string, title: string) => {
          updateScriptTemplate(templateId, script, title);
        }}
        onDelete={async (templateId: string) => {
          await deleteScriptTemplate(templateId);
          const id = project.scriptTemplates[0].id;
          navigate(`/?type=script&id=${id}&storage=${storageAcct}`)
        }}
        onInsert={async () => {
          const res = await createScriptTemplate("", `New Script`);
          navigate(`/?type=script&id=${res.data?.createScriptTemplate?.id}&storage=${storageAcct}`)
        }}
      />
    </SidebarRoot>
  );
};

export default Sidebar;
