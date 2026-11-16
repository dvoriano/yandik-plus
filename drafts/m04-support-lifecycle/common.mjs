/** M04-S13–S15 | KODE DITULIS, BELUM DIUJI. Synthetic only. */
export const clone=x=>JSON.parse(JSON.stringify(x));
export const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function exact(v,keys,label){
 if(!v||typeof v!=="object"||Array.isArray(v)||Object.keys(v).length!==keys.length||
 keys.some(k=>!Object.hasOwn(v,k)))throw Error(label+": atribut tidak sesuai.");
}
export function code(v,prefix){
 if(typeof v!=="string"||!v.startsWith(prefix)||!/^[A-Z0-9_-]{8,70}$/.test(v)||v.length<=prefix.length)
 throw Error("Kode fiktif tidak sah: "+prefix);
 return v;
}
export function date(v){
 if(typeof v!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(v)||
 !Number.isFinite(Date.parse(v+"T00:00:00Z"))||new Date(v+"T00:00:00Z").toISOString().slice(0,10)!==v)
 throw Error("Tanggal DEMO tidak sah.");
 return v;
}
export function qty(v,min=0){
 if(!Number.isSafeInteger(v)||v<min||v>100000)throw Error("Jumlah tidak sah.");
 return v;
}
export function note(v){
 if(typeof v!=="string"||v.trim().length<10||v.trim().length>500)
 throw Error("Catatan harus 10–500 karakter.");
 return v.trim();
}
export function list(v,label,max=1000){
 if(!Array.isArray(v)||v.length>max)throw Error(label+": daftar tidak sah.");
 return v;
}
export function unique(set,v){
 if(set.has(v))throw Error("ID atau rujukan ganda: "+v);
 set.add(v);
}
