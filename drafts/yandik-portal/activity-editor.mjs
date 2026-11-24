/** Synthetic activity editor; no free-text IDs, file uploads or persistence. */
const make=(tag,content)=>{const e=document.createElement(tag);if(content!==undefined)e.textContent=content;return e;};
const ids=(prefix)=>Array.from({length:20},(_,i)=>"DEMO-"+prefix+"-"+String(i+1).padStart(2,"0"));
const eventIds=ids("EVENT"),locationIds=ids("LOCATION"),animalIds=ids("ANIMAL");
function optionField(label,list,selected,disabled){
 const wrapper=make("label",label),select=make("select");
 const available=list.includes(selected)||!selected?list:[selected,...list];
 select.replaceChildren(...available.map(v=>new Option(v,v)));
 if(selected)select.value=selected;select.disabled=disabled;wrapper.append(select);
 return {wrapper,select};
}
function checkField(label,checked,disabled){
 const wrapper=make("label",label);wrapper.className="check-label";
 const input=make("input");input.type="checkbox";input.checked=checked;input.disabled=disabled;
 wrapper.prepend(input);return {wrapper,input};
}
export function mountActivityEditor({investigations,animals,addInvestigation,addAnimal}){
 let editable=false,changed=()=>{};
 const events=[],kurban=[];
 function add(type,value={}){
  const isEvent=type==="event",list=isEvent?events:kurban,area=isEvent?investigations:animals;
  if(list.length>=100)return;
  const row=make("div");row.className="activity-row";
  const a=optionField(isEvent?"Kejadian":"Hewan",isEvent?eventIds:animalIds,
    isEvent?value.event_id:value.animal_id,!editable);
  row.append(a.wrapper);
  let b,c;
  if(isEvent){b=optionField("Lokasi",locationIds,value.location_id,!editable);row.append(b.wrapper);}
  else{b=checkField("Ante-mortem",value.ante??true,!editable);c=checkField("Post-mortem",value.post??false,!editable);row.append(b.wrapper,c.wrapper);}
  const item={row,read:()=>isEvent?{event_id:a.select.value,location_id:b.select.value}:
   {animal_id:a.select.value,ante:b.input.checked,post:c.input.checked}};
  const remove=make("button","Hapus");remove.type="button";remove.disabled=!editable;
  remove.addEventListener("click",()=>{if(!editable)return;const i=list.indexOf(item);if(i>=0)list.splice(i,1);row.remove();changed();});
  row.append(remove);list.push(item);area.append(row);
 }
 addInvestigation.addEventListener("click",()=>{if(editable){add("event");changed();}});
 addAnimal.addEventListener("click",()=>{if(editable){add("animal");changed();}});
 return {onChange:fn=>{changed=fn;},render:(data,canEdit)=>{
  editable=canEdit;events.length=0;kurban.length=0;
  investigations.replaceChildren();animals.replaceChildren();
  for(const v of data?.investigations??[])add("event",v);
  for(const v of data?.kurban_animals??[])add("animal",v);
  addInvestigation.disabled=!editable;addAnimal.disabled=!editable;
 },read:()=>({investigations:events.map(x=>x.read()),kurban_animals:kurban.map(x=>x.read())})};
}
