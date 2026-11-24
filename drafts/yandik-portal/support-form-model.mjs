/** CODE_ONLY | Typed support form command and display selection. */
export const ATTENTION=["ABSENT","BELOW_MINIMUM","UNUSABLE","PARTIAL_USABLE"];
export const ACTIONS=["propose","submit","county_review","plan_package","schedule","dispatch","receive","handover","monitor","return_draft"];
export function filterSupport(rows,mode,q=""){
 const term=q.trim().toLowerCase();
 return rows.filter(r=>(mode==="all"||mode==="attention"&&r.record_id&&ATTENTION.includes(r.assessment)||mode==="started"&&r.revision>0||mode==="pending"&&!r.record_id)&&[r.label,r.item_id,r.group].some(x=>String(x).toLowerCase().includes(term)));
}
export function supportCommand(record,action,payload,command_id){
 if(!record?.candidate_actions?.includes(action)||!ACTIONS.includes(action)||!Number.isInteger(record.revision)||!record.record_id)throw Error("ACTION_UNAVAILABLE");
 return {command_id,record_id:record.record_id,expected_revision:record.revision,action,payload};
}
export function pendingShipments(snapshot){
 return snapshot.shipments.map(s=>({...s,remaining:s.quantity-snapshot.receipts.filter(r=>r.shipment_ref===s.shipment_ref).reduce((n,r)=>n+r.good+r.damaged,0)})).filter(s=>s.remaining>0);
}
export function pendingHandovers(snapshot){return snapshot.receipts.filter(r=>!snapshot.handovers.some(h=>h.receipt_ref===r.receipt_ref));}
export function monitorable(snapshot){return snapshot.receipts.filter(r=>r.good>0&&snapshot.handovers.some(h=>h.receipt_ref===r.receipt_ref));}
