import { useEffect, useState, useMemo } from 'react';
import { CadenceLanguageServer, Callbacks } from 'util/language-server';
import { MonacoServices } from 'monaco-languageclient/lib/monaco-services';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { createCadenceLanguageClient } from 'util/language-client';
import { useProject } from 'providers/Project/projectHooks';
import debounce from "util/debounce";
import * as fcl from "@onflow/fcl"

let monacoServicesInstalled = false;
var codes = {}

async function startLanguageServer(callbacks: any, getCode: any, ops) {
  const { setLanguageServer, setCallbacks } = ops;
  const server = await CadenceLanguageServer.create(callbacks);
  new Promise(() => {
    let checkInterval = setInterval(() => {
      if (callbacks.toServer !== null) {
        clearInterval(checkInterval);
        callbacks.getAddressCode = getCode;
        setCallbacks(callbacks);
        setLanguageServer(server);
        console.log('%c LS: Is Up!', 'color: #00FF00');
      }
    }, 100);
  });
}

const launchLanguageClient = async (callbacks, languageServer, setLanguageClient) => {
  if (languageServer) {
    const newClient = createCadenceLanguageClient(callbacks);
    newClient.start();
    await newClient.onReady();
    setLanguageClient(newClient);
  }
};

export default function useLanguageServer() {
  const project = useProject();

  // Language Server Callbacks
  let initialCallbacks: Callbacks = {
    // The actual callback will be set as soon as the language server is initialized
    toServer: null,

    // The actual callback will be set as soon as the language server is initialized
    onClientClose: null,

    // The actual callback will be set as soon as the language client is initialized
    onServerClose: null,

    // The actual callback will be set as soon as the language client is initialized
    toClient: null,

    //@ts-ignore
    getAddressCode(address: string): string | undefined {
      // we will set it once it is instantiated
    },
  };

  // Base state handler
  const [languageServer, setLanguageServer] = useState(null);
  const [languageClient, setLanguageClient] = useState(null);
  const [callbacks, setCallbacks] = useState(initialCallbacks);

  const getCodeAsync = async (address,callbacks) => {

    var [account, _] = address.split(".")
    while (account.length<16){
      account = "0" + account
   }

    var response =  await fcl.send([fcl.getAccount(`0x${account}`)])
    var contracts = response["account"]["contracts"]
    

    for(var key in contracts) {
      codes[`${account}.${key}`] = contracts[key]
    } 

    callbacks.toServer(null, window.lastChangeMessage);
  }
  
  const getCode = (address) => {

    var parts = address.split(".")

    var existingAccount = project.project.accounts.find((account)=>{
      return account.address == "0x" + parts[0]
    })

    if (existingAccount){
        var contract = existingAccount.deployedContracts.find((contract)=>{return contract.name==parts[1]})

        if (contract) 
          return contract.code
    }
    
    if (codes[address]!=null){
      return codes[address]
    }
    
    getCodeAsync(address,callbacks).then()
    return ""
  };

  const restartServer = () => {
    console.log('Restarting server...');

    startLanguageServer(callbacks, getCode, {
      setLanguageServer,
      setCallbacks,
    });
  };

  const debouncedServerRestart = useMemo(
      () => debounce(restartServer, 150),
      [languageServer]
  )

  useEffect(() => {
    if (languageServer) {
      languageServer.updateCodeGetter(getCode);
    }
  }, [project.project.accounts]);

  // TODO: Disable this, once the cadence language server package is updated
  useEffect(debouncedServerRestart, [project.project.accounts, project.active]);


  useEffect(() => {
    // The Monaco Language Client services have to be installed globally, once.
    // An editor must be passed, which is only used for commands.
    // As the Cadence language server is not providing any commands this is OK

    console.log('Installing monaco services');
    if (!monacoServicesInstalled) {
      MonacoServices.install(monaco);
      monacoServicesInstalled = true;
      
    }

    restartServer();
  }, []);



  useEffect(() => {
    if (!languageClient) {
      launchLanguageClient(callbacks, languageServer, setLanguageClient).then();
    }
  }, [languageServer]);



  return {
    languageClient,
    languageServer,
    restartServer,
  };
}
