import React from 'react';
import {navigate, useLocation} from "@reach/router";
import { FaDatabase } from 'react-icons/fa';
import { SidebarItemToggleResources } from 'layout/SidebarItemToggleResources';
import { useProject } from 'providers/Project/projectHooks';
import { getParams } from "util/url";

type ResourcesExplorerButtonProps = {
  address: string;
};

export const ResourcesExplorerButton = (props: ResourcesExplorerButtonProps) => {
  const {  setSelectedResourceAccount } = useProject();
  const { address } = props;


  const location = useLocation();
  const params = getParams(location.search);
  const { type, id, storage } = params;  

  let queryParams = type ? `&type=${type}`: "";
  queryParams += id ? `&id=${id}`: "";
    if (storage){
        queryParams += storage === address ? "&storage=none" : `&storage=${address}`;
    }

  queryParams = queryParams.replace("&","?")

  return (
    <SidebarItemToggleResources
      onClick={() => {
        if (address === storage) {
          setSelectedResourceAccount('none');
        } else {
          setSelectedResourceAccount(address);
        }
        navigate(`/${queryParams}`);
      }}
      title={'Open the resources explorer'}
      active={address === storage}
    >
      <FaDatabase />
    </SidebarItemToggleResources>
  );
};
