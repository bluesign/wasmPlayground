import React, {createContext, useState, useMemo, useEffect} from 'react';
import { useLocation, Redirect } from '@reach/router';
import * as fcl from "@onflow/fcl"
import { createDefaultProject } from "./projectDefault";
import useEmulator from '../../hooks/useEmulator';

import { Project, Account, ScriptExecution } from  "src/_newTypes/newTypes";
import { getParams } from 'util/url';
import { ec as EC } from "elliptic";
import { SHA3 } from "sha3";
import { Emulator } from 'util/emulator';
import { Tag } from 'util/normalize-interaction-response';
const ec: EC = new EC("p256");
import styled from "@emotion/styled";
import { Box, Text } from 'theme-ui';

const LoadingMessageDiv = styled.div`
    display: flex;
    padding: 2rem;
    height: 100vh;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    
`;

export enum EntityType {
  Account = 1,
  TransactionTemplate,
  ScriptTemplate,
}

export type ActiveEditor = {
  type: EntityType;
  index: number;
  subindex: string;
  onChange: (
    code: string
  ) => void;
};

export interface ProjectContextValue {
  project: Project | null;
  isLoading: boolean;
  emulator: Emulator,
  updateAccountDeployedCode: () => Promise<any>;
  updateAccountDraftCode: (subindex: string, value: string) => Promise<any>;
  updateSelectedContractAccount: (accountIndex: number) => void;
  updateSelectedTransactionAccounts: (accountIndexes: number[]) => void;
  updateActiveScriptTemplate: (script: string, title: string) => Promise<any>;
  updateActiveTransactionTemplate: (
    script: string,
    title: string,
  ) => Promise<any>;
  updateScriptTemplate: (
    templateId: string,
    title: string,
    script: string,
  ) => Promise<any>;
  updateTransactionTemplate: (
    templateId: string,
    title: string,
    script: string,
  ) => Promise<any>;
  deleteScriptTemplate: (templateId: string) => void;
  createScriptTemplate: (code:string, name:string) => Promise<any>;
  deleteTransactionTemplate: (templateId: string) => void;
  createTransactionTemplate: (code:string, name:string) => Promise<any>;
  createTransactionExecution: (
    signingAccounts: Account[],
    args?: string[],
  ) => Promise<any>;
  createScriptExecution: (args?: string[]) => Promise<any>;
  active: ActiveEditor;
  setActive: (type: EntityType, index: number, subIndex: string) => void;
  selectedResourceAccount: string;
  setSelectedResourceAccount: (account: string) => void;
  lastSigners: string[];
  setLastSigners: (signers: string[]) => void;
  transactionAccounts: number[];
  isSavingCode: boolean;
}

export const ProjectContext: React.Context<ProjectContextValue> = createContext(
  null,
);

interface ProjectProviderProps {
  children: any;

}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {

console.log("project provider")

  function hex_to_ascii(str1)
 {
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }

  fcl.config().put("accessNode.api", "http://localhost:3000/api")  
  const [project] = useState<Project>(createDefaultProject());
const [isLoading, setIsLoading] = useState<boolean>(true);
const [shouldUpdateAccounts, setShouldUpdateAccounts] = useState<boolean>(false);



const {emulator } = useEmulator();
  const [selectedResourceAccount, setSelectedResourceAccount] = useState<
    string | null
  >(null); 
 useEffect( ()=>{
    if (emulator){
        console.log("emulator is set")
        setShouldUpdateAccounts(true)
    }
 }, [emulator])

 useEffect( ()=>{
    console.log("update accounts?")
    if (!shouldUpdateAccounts) return
    console.log("updating accounts")
    project.states = {}
    var selectedResource = selectedResourceAccount
    setSelectedResourceAccount("none")

    fcl
    .send([fcl.script(`


    pub fun encodeWord(_ word :UInt64): UInt64 {
      var generatorMatrixRows = [
        0xe467b9dd11fa00df, 0xf233dcee88fe0abe, 0xf919ee77447b7497, 
    0xfc8cf73ba23a260d,
      0xfe467b9dd11ee2a1, 0xff233dcee888d807, 0xff919ee774476ce6, 
    0x7fc8cf73ba231d10,
      0x3fe467b9dd11b183, 0x1ff233dcee8f96d6, 0x8ff919ee774757ba, 
    0x47fc8cf73ba2b331,
      0x23fe467b9dd27f6c, 0x11ff233dceee8e82, 0x88ff919ee775dd8f, 
    0x447fc8cf73b905e4,
      0xa23fe467b9de0d83, 0xd11ff233dce8d5a7, 0xe88ff919ee73c38a, 
    0x7447fc8cf73f171f,
      0xba23fe467b9dcb2b, 0xdd11ff233dcb0cb4, 0xee88ff919ee26c5d, 
    0x77447fc8cf775dd3,
      0x3ba23fe467b9b5a1, 0x9dd11ff233d9117a, 0xcee88ff919efa640, 
    0xe77447fc8cf3e297,
      0x73ba23fe467fabd2, 0xb9dd11ff233fb16c, 0xdcee88ff919adde7, 
    0xee77447fc8ceb196,
      0xf73ba23fe4621cd0, 0x7b9dd11ff2379ac3, 0x3dcee88ff91df46c, 
    0x9ee77447fc88e702,
      0xcf73ba23fe4131b6, 0x67b9dd11ff240f9a, 0x33dcee88ff90f9e0, 
    0x19ee77447fcff4e3,
      0x8cf73ba23fe64091, 0x467b9dd11ff115c7, 0x233dcee88ffdb735, 
    0x919ee77447fe2309,
      0xc8cf73ba23fdc736]
      
      var codeWord = UInt64(0x1cb159857af02018)
      var i=0
      var res = word
      while (i<45){
        if res&1 == 1 {
          codeWord = codeWord ^ UInt64(generatorMatrixRows[i])
        }
        res = res >> 1
        i=i+1
      }
    
      return codeWord 
    }
    
    
        pub fun main(): [{String:AnyStruct}] {
          var res :  [{String:AnyStruct}] = []
          var i=1
          while i<10{
            var addr = Address(UInt64(i)) //encodeWord
            var pa = getAccount(addr)
            
            if pa.balance==0.0{
                break
            }
    
            var r : {String:AnyStruct} = {}
            r["address"] = addr.toString()
            var contracts: [{String:String}] = []
            for cname in pa.contracts.names{
              contracts.append({"name":cname, "code":  
    String.encodeHex(pa.contracts.get(name: cname)!.code)})
            }
            r["contracts"] = contracts
            res.append(r)
            i=i+1
    
          }
          return res
        }
        
`
    )])
    .then(fcl.decode)
    .then((result)=>{
      var names = ["Service Account", "Alice", "Bob", "Charlie", "Dave", "Edward", "Fergie"]
      var newAccounts = result.map((acc, index) => {
       
        acc.contracts.forEach((con,_)=>{
          con.code = hex_to_ascii(con.code)
        })

       var v : Account =  {
         address: acc.address,
         id: acc.address.replace("0x00000000000000","0x"),
         name: index < 7? names[index] : acc.address.replace("0x00000000000000","0x"),
         deployedContracts: acc.contracts ?? [],
         detail: acc,
         draftCodes: {"Draft":`pub contract Hello {
        }`},
         state: "",
       }   
        
       window.getAccountStorage( v.id ).then((res)=>{project.states[v.id]=res})


       acc.contracts.map((contract) => {
         v.draftCodes[contract.name] = contract.code
        })

       return v 
      }
      );


      project.accounts = newAccounts
      setIsLoading(false)
      setShouldUpdateAccounts(false)
      setSelectedResourceAccount(selectedResource)
    })

 }
  , [shouldUpdateAccounts])


  const [active, setActive] = useState<{ type: EntityType; index: number, subIndex:string }>({
    type: EntityType.Account,
    index: 0,
    subIndex: "",
  });
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [transactionAccounts, setTransactionAccounts] = useState<number[]>([0]);
  const [isSavingCode, setIsSaving] = useState(false);
  const [lastSigners, setLastSigners] = useState(null);


  const title =  null;
  let timeout: any;

  const getContractName = (template: string) => {
    const match = template.match(/(?:contract\s*)([\d\w]*)(?:\s*{)/);
    if (match) {
      return match[1];
    }
    return '';
  };


  const updateAccountDeployedCode: any = async () => {
    clearTimeout(timeout);
    var authz = []
    authz.push(playauthz(project.accounts[active.index].address))

    var contractCode = project.accounts[active.index].draftCodes[active.subIndex]
    var contractName = getContractName(contractCode)

    contractCode = contractCode.split("")
     .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
     .join("");

    var transactionId = await fcl.mutate(
      {
        cadence:`
        transaction(name:String, code: String) {
          prepare(signer: AuthAccount) {
            if signer.contracts.names.contains(name){
              signer.contracts.update__experimental(name: name, code: code.decodeHex())
            }else{
              signer.contracts.add(name: name, code: code.decodeHex())
            }
          }
          execute{

          }
        }         

        `,
        args:  (arg, t) => [
          arg(contractName, t.String), 
          arg(contractCode, t.String), 
        ],
        proposer : authz[0],
        payer:  authz[0],
        authorizations: authz,

      }
    ).then((res)=>{
      console.log(res)

    //  project.accounts =[]
      return res
    })

    const transaction = await fcl.tx(transactionId).onceSealed().catch((error)=>{
      console.log(error)
    })
    console.log(transaction)
    setShouldUpdateAccounts(true)

    setIsSaving(true);
    timeout = setTimeout(() => {
      setIsSaving(false);
    }, 1000);
    //return res;
  };


  const updateAccountDraftCode = async (subindex: string, value: string) => {
    project.accounts[active.index].draftCodes[subindex] = value
  };

  const updateScriptTemplate = async (
    templateId: string,
    script: string,
    title: string,
  ) => {
    var template = project.scriptTemplates.find(template => template.id==templateId)
    template.script = script
    template.title = title
  };

  const updateTransactionTemplate = async (
    templateId: string,
    script: string,
    title: string,
  ) => {
    var template = project.transactionTemplates.find(template => template.id==templateId)
    template.script = script
    template.title = title
  };

  const updateActiveScriptTemplate = async (script: string) => {
    var template = project.scriptTemplates.find(template => template.index==active.index)
    template.script = script
    template.title = title
  };

  const updateActiveTransactionTemplate = async (script: string) => {
    var template = project.transactionTemplates.find(template => template.index==active.index)
    template.script = script
    template.title = title
  };


  const hashMsg=  (msg)=>{
    const sha = new SHA3(256);
    sha.update(Buffer.from(msg.message, 'hex'));
    return sha.digest();
  };

const produceSignature = (msg) => {
  const key = ec.keyFromPrivate(Buffer.from("68ee617d9bf67a4677af80aaca5a090fcda80ff2f4dbc340e0e36201fa1f1d8c", "hex"));
  const sig = key.sign(hashMsg(msg));
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  var res =  Buffer.concat([r, s]).toString("hex");
  console.log(res)
  return res
};

  
  const playauthz =  (addr) => {
    return async function authorizationFunction (account) {
     // console.log(account)
      var res =  {
         ...account,
         tempId: `${addr}-${0}`,
         addr: addr,
         keyId: Number(0),
         signingFunction: signable => {
          return {
            addr: addr,
            keyId: 0, 
            signature: produceSignature(signable) 
          }
         }
        }
         return res
      
    }
  }
  
  const createTransactionExecution = async (
    signingAccounts: Account[],
    args?: [string],
  ) => {
    console.log(args)

    clearTimeout(timeout);
    setIsSaving(true);

    var authz = []
    //execute with FCL 
    let signers: string[] = [];
    signingAccounts?.map((acct: any) => {
      const addr = acct.address;
      const acctNum = addr.charAt(addr.length - 1);
      const acctHex = `0x0${acctNum}`;
      signers.push(acctHex);
      authz.push(playauthz(acct.address))
    });
    setLastSigners(signers);

    var transactionId = await fcl.mutate(
      {
        cadence: project.transactionTemplates[active.index].script,
        args: [
            
        ],
        proposer : authz[0],
        payer:  authz[0],
        authorizations: authz,

      }
    ).then((res)=>{
      console.log(res)

    //  project.accounts =[]
      return res
    })

    const transaction = await fcl.tx(transactionId).onceSealed().catch((error)=>{
      console.log(error)
    })
    console.log(transaction)
    setShouldUpdateAccounts(true)
   // setIsLoading(true)
    
    //console.log(res)
    /*
    const res = await mutator.createTransactionExecution(
      project.transactionTemplates[active.index].script,
      signingAccounts,
      args,
    );*/

   

    timeout = setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const createScriptExecution = async (args?: string[]) => {
    console.log(args)
    clearTimeout(timeout);
    setIsSaving(true);
   
    timeout = setTimeout(() => {
      setIsSaving(false);
    }, 1000);

    

    var res = await fcl.send([fcl.script(project.scriptTemplates[active.index].script)]).then((res)=>{
      console.log(res)
      return res.encodedData
    })
    .then((result)=>{

      console.log(result)

      project.scriptExecutions = []
      var localtime = new Date().toLocaleTimeString('en-US', { hour12: false });

      var execution:ScriptExecution  = {
        script: project.scriptTemplates[active.index].script, 
        logs: [{time:localtime, value:"test"},{time: localtime, value:"rest2"}], 
        value: JSON.stringify(result),
        executionTimeLabel: localtime        
      } 
      window.emulatorLog.push({tag: Tag.VALUE, message: JSON.stringify(result), data:"{}", timestamp:localtime})

      project.scriptExecutions[active.index] = execution
    })
    .catch((error)=>{
      var localtime = new Date().toLocaleTimeString('en-US', { hour12: false });
      project.scriptExecutions = []

      var execution:ScriptExecution  = {
        script: project.scriptTemplates[active.index].script, 
        logs: [], 
        value: null,
        errors: [{message:error.errorMessage}],
        executionTimeLabel: localtime        
      } 
      project.scriptExecutions[active.index] = execution
    }) 
    setIsSaving(false);

    return {data: {createScriptExecution:res}}
  };

  const createScriptTemplate = async  (code, name): Promise<any> =>  {
    console.log(code)
    console.log(name)
  }


  const deleteScriptTemplate = async (templateId: string) => {
    var template = project.scriptTemplates.find(template => template.id==templateId)
    console.log(template)

  };

  const createTransactionTemplate = async (code, name): Promise<any> =>  {
    console.log(code)
    console.log(name)
  }

  const deleteTransactionTemplate = async (templateId: string) => {
    clearTimeout(timeout);
    console.log(templateId)
  
  };

  const updateSelectedContractAccount = (accountIndex: number) => {
  alert("s")
    setActive({ type: EntityType.Account, index: accountIndex, subIndex:"0" });
  };

  const updateSelectedTransactionAccounts = (accountIndexes: number[]) => {
    setTransactionAccounts(accountIndexes);
  };

  const getActiveEditor = (): ActiveEditor => {
    switch (active.type) {
      case EntityType.Account:
        return {
          type: active.type,
          index: active.index,
          subindex: active.subIndex,
          onChange: (code: string) => updateAccountDraftCode(active.subIndex, code),
        };
      case EntityType.TransactionTemplate:
        return {
          type: active.type,
          index: active.index,
          subindex: "",
          onChange: (code: any) =>
            updateActiveTransactionTemplate(code),
        };
      case EntityType.ScriptTemplate:
        return {
          type: active.type,
          index: active.index,
          subindex: "",
          onChange: (code: any) =>
            updateActiveScriptTemplate(code),
        };
      
    }
  };

  const activeEditor = useMemo(
      getActiveEditor,
      [active.type, active.index, project]
  )


  const location = useLocation();
  const params = getParams(location.search || '');
  const { id, type, storage: storageParam, subIndex } = params;
  const storage = storageParam || 'none';

  

  let templateIndex = 0;
  if (!isLoading) {

  switch (type) {
    case 'tx': {
      if (id && id !== '') {
        const foundIndex = project.transactionTemplates.findIndex(
          (template) => template.id === id,
        );
        if (foundIndex > 0) {
          templateIndex = foundIndex;
        }
      }

      const sameType = active.type == EntityType.TransactionTemplate;
      const sameIndex = active.index == templateIndex 

      if (!sameIndex || !sameType || initialLoad) {
        console.log(active.index, templateIndex)
        setInitialLoad(false);
        setActive({
          type: EntityType.TransactionTemplate,
          index: templateIndex,
          subIndex: "",
        });
        console.log(project.transactionTemplates)
        const templateId = project.transactionTemplates[templateIndex].id;
        return (
          <Redirect
            noThrow
            to={`/?type=tx&id=${templateId}&storage=${storage}`}
          />
        );
      }
      break;
    }
    case 'script': {
      if (id && id !== '') {
        const foundIndex = project.scriptTemplates.findIndex(
          (template) => template.id === id,
        );
        if (foundIndex > 0) {
          templateIndex = foundIndex;
        }
      }
      const sameType = active.type == EntityType.ScriptTemplate;
      const sameIndex = active.index == templateIndex;

      if (!sameIndex || !sameType || initialLoad) {
        setInitialLoad(false);
        setActive({
          type: EntityType.ScriptTemplate,
          index: templateIndex,
          subIndex: "",
        });
        const templateId = project.scriptTemplates[templateIndex].id;
        return (
          <Redirect
            noThrow
            to={`/?type=script&id=${templateId}&storage=${storage}`}
          />
        );
      }
      break;
    }
   default: { //'account': {
     
      if (id && id !== '') {
        const foundIndex = project.accounts.findIndex(
          (template) => template.id === id,
        );
        if (foundIndex > 0) {
          templateIndex = foundIndex;
        }
      }

      var newSubIndex = subIndex
      if (newSubIndex==null) newSubIndex=""


      const sameType = active.type == EntityType.Account;
      const sameIndex = active.index == templateIndex && active.subIndex==newSubIndex;
     
      if (!sameIndex || !sameType || initialLoad) {
        setInitialLoad(false);
        setActive({
          type: EntityType.Account,
          index: templateIndex,
          subIndex: newSubIndex,
        });
        return (
          <Redirect
            noThrow
            to={`/?type=account&id=${project.accounts[templateIndex].id}&subIndex=${newSubIndex}&storage=${storage}`}
          />
        );
      }
      break;
    }

  }
} 

if (isLoading){
  return (
    <LoadingMessageDiv>
        <Box
            sx={{
                marginBottom: "2rem",
            }}
        >
            <img src="/flow_logo.jpg" alt="Flow Logo" width="160" height="160" />
        </Box>
        <Text
            sx={{
                marginBottom: "4rem",
                fontSize: "2rem",
                fontWeight: "bold"
            }}
        >
            The Flow Playground is loading.
        </Text>
       
    </LoadingMessageDiv>
)
}

  return (
    <ProjectContext.Provider
      value={{
        project,
        isSavingCode,
        isLoading,
        emulator,
        updateAccountDeployedCode,
        updateAccountDraftCode,
        updateScriptTemplate,
        updateTransactionTemplate,
        updateActiveScriptTemplate,
        updateActiveTransactionTemplate,
        deleteScriptTemplate,
        deleteTransactionTemplate,
        createTransactionTemplate,
        createScriptTemplate,
        createTransactionExecution,
        createScriptExecution,
        updateSelectedContractAccount,
        updateSelectedTransactionAccounts,
        active: activeEditor,
        setActive: (type: EntityType, index: number, subIndex: string) => {
          setActive({ type, index, subIndex });
        },
        selectedResourceAccount,
        setSelectedResourceAccount: (account: string) => {
          setSelectedResourceAccount(account);
        },
        lastSigners,
        setLastSigners: (signers: string[]) => {
          setLastSigners(signers);
        },
        transactionAccounts,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
