import { integer } from "monaco-languageclient";

export enum ResultType {
    Transaction = 'TRANSACTION',
    Script = 'SCRIPT',
    Contract = 'CONTRACT'
}

export type Contract = {
  name: string,
  code: string
}

export type Account = {
    id: string,
    name: string,
    address: string;
    deployedContracts: Array<Contract>;
    draftCodes: {[key: string]: string};
    state: string;
    detail: object;
  };
  
export type ProgramPosition = {
    column: integer;
    line: integer;
    offset: integer;
};

export type ProgramError = {
    endPosition?: ProgramPosition;
    message: string;
    startPosition?: ProgramPosition;
};

export type ScriptExecution = {
    arguments?: Array<string>;
    errors?: Array<ProgramError>;
    logs: Array<any>;
    script: string;
    value: string;
    executionTimeLabel: string;
};

export type ScriptTemplate = {
    id: string;
    index: integer;
    script: string;
    title: string;
  };


  export type Event = {
    type: string;
    values: Array<string>;
  };

export type TransactionExecution = {
    arguments?: Array<string>;
    errors?: Array<ProgramError>;
    events: Array<Event>;
    logs: Array<string>;
    script: string;
    signers: Array<Account>;
    executionTimeLabel: string;
  };


export type TransactionTemplate = {
    id: string,
    index: integer;
    script: string;
    title: string;
};
  
export type Project = {
    id: string,
    accounts?: Array<Account>;
    states?: {[key:string]:string}
    mutable?: boolean;
    parentId?: string;
    persist?: boolean;
    publicId: string;
    scriptExecutions?: Array<ScriptExecution>;
    scriptTemplates?: Array<ScriptTemplate>;
    seed: integer;
    transactionExecutions?: Array<TransactionExecution>;
    transactionTemplates?: Array<TransactionTemplate>;
    version: string;
  };
