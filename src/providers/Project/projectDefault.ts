import { strToSeed, uuid } from "util/rng";
import { Account, Project, ScriptTemplate, TransactionTemplate } from "src/_newTypes/newTypes";

/*
const DEFAULT_ACCOUNTS = [
  'DEFAULT CONTRACT CODE '
];*/

const DEFAULT_TRANSACTION = `transaction {

  prepare(acct: AuthAccount) {
      var newAcc = AuthAccount(payer: acct)
      var key = PublicKey(
        publicKey: "9cd98d436d111aab0718ab008a466d636a22ac3679d335b77e33ef7c52d9c8ce47cf5ad71ba38cedd336402aa62d5986dc224311383383c09125ec0636c0b042".decodeHex(), 
       signatureAlgorithm: SignatureAlgorithm.ECDSA_P256)

      newAcc.keys.add(publicKey: key, hashAlgorithm: HashAlgorithm.SHA3_256, weight: 100.0)
      log(newAcc)
  }

  execute {
    
  }
}

`;

const DEFAULT_SCRIPT = `pub fun main(): Int {
  return 1
}
`;

export const PLACEHOLDER_TITLE = "Name of your project"
export const PLACEHOLDER_DESCRIPTION = "Single sentence describing this project"
export const PLACEHOLDER_README = `Here you can provide a detailed explanation to help others understand how to use your Playground project.
Editor supports Markdown. Please, consult https://www.markdownguide.org/cheat-sheet/ for examples and tips.`

export function createDefaultProject(): Project {
  return createLocalProject(
    null,
    strToSeed(uuid()),
    [{ title: "Transaction", code: DEFAULT_TRANSACTION }],
    [{ title: "Script" , code :DEFAULT_SCRIPT }]
  );
}

type ScriptDetails = {
  code: string,
  title: string
}

export function createLocalProject(
  parentId: string | null,
  seed: number,
  transactionTemplates: Array<ScriptDetails>,
  scriptTemplates: Array<ScriptDetails>
): Project {

  const accountEntities: Account[] = [] /*accounts.map((script, i) => {
    return {
      id: `local-account-${i}`,
      name: "",
      address: `000000000000000000000000000000000000000${i + 1}`,
      title: title,
      description: description,
      readme: readme,
      draftCode: script,
      deployedContracts: [],
      state: "{}",
      detail: {},
    };
  });*/

  const transactionTemplatesEntities: TransactionTemplate[] = transactionTemplates.map(
    (script, i) => {
      const { title, code } = script
      return {
        id: `local-tx-temp-${i}`,
        title: title || `Transaction ${i + 1}`,
        script: code,
        index: i,
      };
    }
  );

  const scriptsTemplatesEntities: ScriptTemplate[] = scriptTemplates.map(
    (script, i) => {
      const { title, code } = script
      return {
        id: `local-script-temp-${i}`,
        title: title || `Script ${i + 1}`,
        script: code,
        index: i,
      };
    }
  );

  return {
    id: "local",
    publicId: "",
    persist: false,
    mutable: false,
    seed: seed,
    parentId: parentId,
    accounts: accountEntities,
    transactionTemplates: transactionTemplatesEntities,
    scriptTemplates: scriptsTemplatesEntities,
    version: ""
  };
}
