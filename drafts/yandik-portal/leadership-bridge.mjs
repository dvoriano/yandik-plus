/** Page-local read projections. No storage, network, authorization or cross-tab sync. */
const providers=new Map(),listeners=new Set();
export function register(name,read){providers.set(name,read);notify();}
export function read(name,scope){try{const p=providers.get(name);return p?{available:true,data:p(scope)}:{available:false,data:null};}catch{return {available:false,data:null};}}
export function notify(){for(const fn of listeners){try{fn();}catch{/* UI failure must not prevent saving a demo draft */}}}
export function subscribe(fn){listeners.add(fn);return ()=>listeners.delete(fn);}
