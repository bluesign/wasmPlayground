// take in the state for an account, return data for resources explorer
export const getStorageData = (state: string = ''): any => {

  

  const storage: { [identifier: string]: any } = {};
  const paths: { [identifier: string]: string } = {};
  const types: { [identifier: string]: string } = {};
  const capabilities: { [identifier: string]: any } = {};


 if (state=="" || !state) return { storage, paths, types, capabilities }

 //console.log("state", state)
  const parsed = JSON.parse(state);

 // console.log("parsed" ,parsed)
  var domains =  ["Storage", "Public", "Private"]

  for(var i = 0; i < domains.length; i++){
    var domain = domains[i]
    if (parsed[domain]==null) continue
    for (var identifier in parsed[domain]){
        const path = `/${domain}/${identifier}`;
        var content =  parsed[domain][identifier]
        storage[identifier] = parsed[domain][identifier];
        paths[identifier] = path;
        types[identifier] = "Resource";
        
      //  console.log(content)
        if (content.startsWith("Link<")){
            types[identifier] = "Link";
            
            const rxpBorrowType = /<([^>]+)>/g;
            const borrowType = rxpBorrowType.exec(content)[0]
            const borrowTypeSplit = borrowType.split(".");
            const contractAcctId = borrowTypeSplit[1];
            const contractAddr = `0x0${contractAcctId.substr(contractAcctId.length - 1)}`;
            const contract = borrowTypeSplit[2];
            const resourcePart = borrowTypeSplit[3];
            const resource = resourcePart.split("{")[0];

            const rxp = /{([^}]+)}/g;

            const foundInterfacesRegEx = rxp.exec(borrowType)

            let interfaces: string[] = [];
            if (foundInterfacesRegEx) {
              const foundInterfaces = foundInterfacesRegEx[1];
              const fullyQualifiedInterfaces = foundInterfaces.split(',');
              fullyQualifiedInterfaces.map((fullyQualifiedInterface) => {
                interfaces.push(fullyQualifiedInterface.split(".")[2] + "." + fullyQualifiedInterface.split(".")[3]);
              });
            }
        
                      // parsed[domain][identifier];
            
            capabilities[identifier] = {
              path: path,
              contractAddr: contractAddr,
              resourceContract: contract,
              resource: resource,
              contractImplementedInterfaces: interfaces
            };
     
            }
    }
  }

 

  return { storage, paths, types, capabilities }
 
}
