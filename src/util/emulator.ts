import { get, set, clear } from 'idb-keyval';
import { entries } from 'idb-keyval';

// The global `Go` is declared by `wasm_exec.js`.
// Instead of improving the that file, we use it as-is,
// because it is maintained by the Go team and

declare var Go: any

export interface Callbacks {
    log(message: string, data: object, timestamp: string): void
}

declare global {
  interface Window {
    [index: string]: any;
  }
    function fetch(request: any, init: any) : Promise<any>;
    function setEmulator();
}

export class Emulator {

  isLoaded = false
  wasmhttp = {
        path: "api",
        handler: null,
        getAccountStorage: null,
        setHandler: (v) =>{ 
            console.log("handler set")
            this.wasmhttp.handler = v 
            window.setEmulator()
        },
        setGetAccountStorage: (v) =>{ 
            console.log("getAccountStorage set")
            window['getAccountStorage']=v
            this.wasmhttp.getAccountStorage = v 
        }
 
  }
 
  public async init(setEmulator) {
    
    var args = ["-v","--simple-addresses", "--transaction-validation=false","--persist"]
    const wasm = await fetch("./emulator.wasm")
    const go = new Go()
    go.argv = [wasm, ...args]
    const module = await WebAssembly.instantiateStreaming(wasm, go.importObject)

    go.run(module.instance)

    self.isLoaded = true
    
    window.setEmulator = (()=>(setEmulator(this)))

   }

  public async xget(key){
    return get(key)
  }

  public async  xset(key, value){
    return set(key, value)
}

  constructor(callbacks: Callbacks) {
   
    if (self.isLoaded) {
      return
    }
 
    window['setHandler']=this.wasmhttp.setHandler
    window['setGetAccountStorage']=this.wasmhttp.setGetAccountStorage
    window['storage_get'] = this.xget 
    window['storage_set'] = this.xset 
    window['storage_clear'] = clear
    window['storage_entries'] = entries

    window['emulator_log'] = (message: string, data: object, timestamp: string): void => {
      callbacks.log(message, data, timestamp)
    }
    
    var originalFetch = window.fetch

    window.fetch = async (url, options) => {
        if (!url.startsWith("http")) {//|| !self.wasmhttp.handler){
            return originalFetch(url, options)
        }
        const pathname = new URL(url).pathname
        console.log(pathname)
         
        if (!pathname.startsWith("/api")) {
            return originalFetch(url, options)
        }   
     
        
        options.url = pathname.substring(4)
        var pos = url.indexOf("?")
        if (pos>0){
            options.url = options.url + url.substr(pos)
        }

        if (options.headers ==null){
            options.headers = {}
        }
        if (this.wasmhttp.handler)
            return this.wasmhttp.handler(options)
    

        return setTimeout(async function(){return await window.fetch(url, options)}, 1000)
    }
 
       
      const outputBuffers = new Map<number, string>()
    const decoder = new TextDecoder("utf-8")


    window['fs'].writeSync = function (fileDescriptor: number, buf: Uint8Array): number {

      let outputBuffer = outputBuffers.get(fileDescriptor)
      if (!outputBuffer) {
        outputBuffer = ""
      }

      outputBuffer += decoder.decode(buf)


      const nl = outputBuffer.lastIndexOf("\n")
      if (nl != -1) {
        const lines = outputBuffer.substr(0, nl + 1)
        console.debug(`(FD ${fileDescriptor}):`, lines)
        // keep the remainder
        outputBuffer = outputBuffer.substr(nl + 1)
      }
      outputBuffers.set(fileDescriptor, outputBuffer)

      return buf.length
    }


}

  
  
}
