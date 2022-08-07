import { useEffect, useState } from 'react';

import { Emulator,Callbacks } from 'util/emulator';



export default function useEmulator() {

  let initialCallbacks: Callbacks = {
    log : (message, data, timestamp) => {
        
        if (window.emulatorLog==null){
            window.emulatorLog = []
        }


        if (data.toString().includes("821888a7a83e6a3c534bdeeee5dd9e9057b803e0a488ba98de97269257bb8126")){
          window.emulatorLog.pop()
          return
        }

        if (message.toString().includes("Starting admin server")){
          return
        }
        if (message.toString().includes("Starting REST API on port")){
          window.emulatorLog.push({message:"Started wasm emulator.", data:"{}", timestamp})

          return
        }

        if (message.toString().includes("Starting gRPC server on port ")){
          return
        }

        

        window.emulatorLog.push({message, data, timestamp})
        console.log(message, data, timestamp)
    }
  };

  const [emulator, setEmulator] = useState(null);
  const [callbacks, setCallbacks] = useState(initialCallbacks);


  useEffect(() => {
    if (!emulator) {
        new Emulator(callbacks).init(setEmulator).then();
    }
  });
  
  return {
    emulator, 
    setCallbacks
  };
}
