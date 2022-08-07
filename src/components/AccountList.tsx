import React from "react";
import { navigate, useLocation} from "@reach/router"
import { Account } from "src/_newTypes/newTypes";
import {EntityType} from "providers/Project";
import {SidebarSection as Root} from "layout/SidebarSection";
import {SidebarHeader as Header} from "layout/SidebarHeader";
import {SidebarItems as Items} from "layout/SidebarItems";
import {SidebarItem as Item} from "layout/SidebarItem";
import {Stack} from "layout/Stack";
import {useProject} from "providers/Project/projectHooks";
import Avatar from "components/Avatar";
import styled from "@emotion/styled";
import {getParams} from "../util/url";
import {ResourcesExplorerButton} from "components/ResourcesExplorerButton";
import { SidebarItemInsert } from 'layout/SidebarItemInsert';
import {IoMdAddCircleOutline} from "react-icons/io";
import { FaSpinner   } from "react-icons/fa";


function getDeployedContracts(account: Account): string[] {
  const contracts = account.deployedContracts.map(
    contract => contract.name.split(".").slice(-1)[0]
  );
  return contracts;
}
export const AccountContractStyle = styled.small<{selected:boolean}>`
   &:hover{
    color: #4a4a4a;
  }
`;

const AccountContract: React.FC<{ account: string, storage: string,  contract: string, selected: boolean }> = ({account, storage,  contract, selected }) => {
    

    return (
        <AccountContractStyle selected={selected} onClick={
                    ()=>{
                        
                         navigate(`/?type=account&id=${account}&storage=${storage}&subindex=${contract}`)
                        }
                    } key={contract}> 
        <p>
        {contract}
        </p>
        </AccountContractStyle>
    )
}


export const AccountCard = styled.div`
  display: flex;
  align-items: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  width: 100%;
`;

const AccountList: React.FC = () => {
  const {
    isLoading,
    project,
    active,
    selectedResourceAccount,
  } = useProject();
  const accountSelected = active.type === EntityType.Account

  const location = useLocation();
  const params = getParams(location.search)



  if (isLoading) {
    return (
      <Root>
      <Header>
      Accounts <FaSpinner className="spin" />
      </Header>
      </Root>
      
    )
  }


  return (
    <Root>
      <Header>
        Accounts
      <SidebarItemInsert onClick={(_: React.SyntheticEvent) => {}}>
       <IoMdAddCircleOutline size="20px" />
      </SidebarItemInsert>
      

      </Header>



      <Items>
        {project.accounts.map((account: Account, _: number) => {
          const { id } = account
          const isActive = accountSelected && params.id === id
         
          var contractNames = getDeployedContracts(account)
          return (
            <Item
              title={account.id}
              active={isActive}
              key={account.id}
            >
              <AccountCard>
              <Avatar address={account.address}/>
              <Stack>
                  

                  <strong key={account.name} onClick={()=>{ navigate(`/?type=account&id=${account.id}&storage=${selectedResourceAccount || 'none'}&subindex=Draft`)
}}> {account.id} - {account.name}</strong>
           
                  {contractNames.map((contractName, _) => {    

                    return <AccountContract 
                    selected={active.subindex==contractName}
                    account={account.id} 
                    storage={selectedResourceAccount || 'none'}
                    contract={contractName} />
                   })}
                  
                </Stack>
              </AccountCard>
              <ResourcesExplorerButton address={account.id}/>
            </Item>
          );
        })}
      </Items>
    </Root>
  );
};

export default AccountList;
